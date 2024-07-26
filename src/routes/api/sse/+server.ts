// src/routes/api/messages/+server.ts
import { createProjectStore } from '$lib/server/redis';
import type { RequestHandler } from '@sveltejs/kit';

const projectStore = createProjectStore('Old SSE');

export const GET: RequestHandler = async ({ url }) => {
	const channelName = url.searchParams.get('channel') || 'default';

	const stream = new ReadableStream({
		start(controller) {
			const onMessages = (messages: string[], newMessage: string) => {
				console.log('received', { messages, newMessage });
				const data = `data: ${JSON.stringify({ messages, newMessage, channelName })}\n\n`;
				console.log('enqueue', data);
				controller.enqueue(new TextEncoder().encode(data));
			};

			projectStore.subscribe(`stream:${channelName}`, onMessages);
		},
		cancel() {
			projectStore.unsubscribe();
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive'
		}
	});
};
