import { app } from '$lib/app/app';
import type { AppEvent } from '$lib/app/events/event';
import type { AddProjectPayload, RemoveProjectPayload } from '$lib/app/events/project.events';
import { Project } from '$lib/app/project';
import { produce } from 'sveltekit-sse';

console.log(app.organization.projectStore);

const projectStore = app.organization.projectStore; //stores['project'];

const onAppMessages = (messages: string[], newMessage: string) => {
	try {
		const json = JSON.parse(newMessage);
		const event = json as AppEvent;
		switch (event.action) {
			case 'add':
				return onAddProject(event);
			case 'remove':
				return onRemoveProject(event);
			default:
				console.log(`unknown action: ${event.action}`);
		}
	} catch (err) {
		console.log(err);
	}
};

const onAddProject = (event: AppEvent) => {
	const payload = event.payload as AddProjectPayload;
	const { name, description } = payload;
	const project = new Project(name, description);
	app.organization.addProject(project);
};

const onRemoveProject = (event: AppEvent) => {
	const payload = event.payload as RemoveProjectPayload;
	const { name } = payload;
	app.organization.removeProject(name);
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
