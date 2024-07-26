import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createProjectStore } from '$lib/server/redis';

const projectStore = createProjectStore();

export const GET: RequestHandler = async ({ url }) => {
	console.log('GET', { url });
	const channelName = url.searchParams.get('channel') || 'default';
	const messages = await new Promise<string[]>((resolve) => {
		const onMessages = (messages: string[], newMessage: string) => {
			console.log('subscribed channel', { newMessage });
			resolve(messages);
		};
		projectStore.subscribe(onMessages);
	});

	return json({ messages, channelName });
};

export const POST: RequestHandler = async ({ request }) => {
	const { message } = await request.json();

	if (!message) {
		return json({ error: 'Message content is required' }, { status: 400 });
	}

	console.log('add', message);
	projectStore.add(message);

	return json({ status: 'success', message });
};
