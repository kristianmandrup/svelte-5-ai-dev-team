// src/routes/custom-event/+server.js
import { createProjectStore } from '$lib/server/redis';
import { produce } from 'sveltekit-sse';

const projectStore = createProjectStore('SSE');

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

setInterval(() => {
	projectStore.add('hello: ' + crypto.randomUUID());
}, 4000);
