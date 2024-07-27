import { app } from '$lib/app/app';
import type { ActionEvent } from '$lib/app/events/event';
import type { ActionEventHandler } from '$lib/app/events/handlers/event.handler';
import { projectEventHandler } from '$lib/app/events/handlers/project.event.handler';
import { teamEventHandler } from '$lib/app/events/handlers/team.event.handler';
import { produce } from 'sveltekit-sse';
import { faker } from '@faker-js/faker';

const projectStore = app.organization.projectStore; //stores['project'];
const appEventStore = app.appEvents;

const eventHandlers = new Map<string, ActionEventHandler>();
eventHandlers.set('project', projectEventHandler);
eventHandlers.set('team', teamEventHandler);

const onActionEvents = (messages: string[], newMessage: string) => {
	try {
		const json = JSON.parse(newMessage);
		const event = json as ActionEvent;
		const { model } = event;
		const handler = eventHandlers.get(model);
		if (!handler) {
			throw new Error(`Unknown event model: ${model}`);
		}
		handler.process(event);
	} catch (err) {
		console.log(err);
	}
};

projectStore.subscribe('app', onActionEvents);

export function POST() {
	return produce(async function start({ emit }) {
		console.log('produce app messages');
		const onMessages = (messages: string[], newMessage: string) => {
			// TODO: filter only project messages
			try {
				if (!newMessage) {
					console.log('invalid message - skipped');
					return;
				}
				console.log('App message received', { newMessage });
				const json = JSON.parse(newMessage);
				console.log('AppEvent', { json });
				const { model } = json;
				if (model === 'project') {
					console.log('emit: project message');
					emit('project', newMessage);
				} else {
					console.log('not a project message');
				}
			} catch (err) {
				console.error(err);
			}
		};
		appEventStore.subscribe(`stream:`, onMessages);
	});
}

const names = ['my project', 'other project', 'last project'];

const add = (name: string): ActionEvent => ({
	source: 'generator',
	model: 'project',
	action: 'add',
	payload: {
		name,
		description: faker.lorem.sentence()
	}
});

const remove = (name: string): ActionEvent => ({
	source: 'generator',
	model: 'project',
	action: 'remove',
	payload: {
		name
	}
});

const messages = [
	add(names[0]),
	add(names[1]),
	remove(names[0]),
	add(names[2]),
	remove(names[1]),
	remove(names[2])
];

// setInterval(() => {
// 	projectStore.add('hello: ' + crypto.randomUUID());
// }, 4000);

setInterval(() => {
	const msg = messages.shift();
	const json = JSON.stringify(msg, null, 2);
	projectStore.add(json);
}, 4000);
