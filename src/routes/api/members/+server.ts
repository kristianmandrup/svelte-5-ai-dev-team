import { json, type RequestHandler } from '@sveltejs/kit';
import { app } from '$lib/app/app';

const memberStore = app.organization.memberStore; //stores['project'];

export const POST: RequestHandler = async ({ request }) => {
	const { event } = await request.json();

	if (!event) {
		return json({ error: 'Event is required' }, { status: 400 });
	}

	console.log('add', event);
	memberStore.add(event);

	return json({ status: 'success', event });
};
