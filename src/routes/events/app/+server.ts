import { app } from '$lib/server/app';
import { produce } from 'sveltekit-sse';

const projectStore = app.organization.stores['project'];

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
	event: 'add',
	payload: {
		name,
		description: 'my project description ...'
	}
});

const remove = (name: string) => ({
	model: 'project',
	event: 'remove',
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
