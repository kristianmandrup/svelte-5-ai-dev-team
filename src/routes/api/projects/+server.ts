import { json, type RequestHandler } from '@sveltejs/kit';
import { app } from '$lib/app/app';

console.log(app.organization.projectStore);

const projectStore = app.organization.projectStore; //stores['project'];

export const POST: RequestHandler = async ({ request }) => {
	const { event } = await request.json();

	if (!event) {
		return json({ error: 'Event is required' }, { status: 400 });
	}

	console.log('add', event);
	projectStore.add(event);

	return json({ status: 'success', event });
};
