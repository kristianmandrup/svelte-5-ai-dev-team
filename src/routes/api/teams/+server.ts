import { json, type RequestHandler } from '@sveltejs/kit';
import { app } from '$lib/app/app';

export const POST: RequestHandler = async ({ request }) => {
	const { event } = await request.json();

	if (!event) {
		return json({ error: 'Event is required' }, { status: 400 });
	}

	const { projects } = app.organization;
	const { projectId } = event;
	if (!projectId) {
		throw new Error(`Event missing projectId`);
	}
	const project = projects.get(projectId);
	if (!project) {
		throw new Error(`No such project: ${projectId}`);
	}
	project?.teamStore.add(event);

	return json({ status: 'success', event });
};
