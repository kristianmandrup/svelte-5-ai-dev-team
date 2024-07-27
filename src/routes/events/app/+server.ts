import { app } from '$lib/app/app';
import type { AppEvent } from '$lib/app/events/event';
import type { AppEventHandler } from '$lib/app/events/handlers/event.handler';
import { projectEventHandler } from '$lib/app/events/handlers/project.event.handler';
import { teamEventHandler } from '$lib/app/events/handlers/team.event.handler';
import { produce } from 'sveltekit-sse';

console.log(app.organization.projectStore);

const projectStore = app.organization.projectStore; //stores['project'];

const eventHandlers = new Map<string, AppEventHandler>();
eventHandlers.set('project', projectEventHandler);
eventHandlers.set('team', teamEventHandler);

const onAppMessages = (messages: string[], newMessage: string) => {
	try {
		const json = JSON.parse(newMessage);
		const event = json as AppEvent;
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

projectStore.subscribe('app', onAppMessages);

export function POST() {
	return produce(async function start({ emit }) {
		console.log('produce app messages');
		const onMessages = (messages: string[], newMessage: string) => {
			console.log('received', { messages, newMessage });
			console.log('emit:project', newMessage);
			emit('project', newMessage);
		};
		projectStore.subscribe(`stream:`, onMessages);
	});
}

const names = ['my project', 'other project', 'last project'];

const add = (name: string) => ({
	model: 'project',
	action: 'add',
	payload: {
		name,
		description: 'my project description ...'
	}
});

const remove = (name: string) => ({
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
