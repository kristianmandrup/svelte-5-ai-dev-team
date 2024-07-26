import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createProjectStore } from '$lib/server/redis';

const projectStore = createProjectStore();

export const GET: RequestHandler = async ({ url }) => {
	const channelName = url.searchParams.get('channel') || 'default';
	const messages = await new Promise<string[]>((resolve) => {
		const onMessages = (messages: string[], newMessage: string) => {
			console.log(newMessage);
			resolve(messages);
		};
		projectStore.subscribe(onMessages);
	});

	return json({ messages, channelName });
};
