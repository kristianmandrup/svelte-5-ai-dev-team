import { app } from '$lib/app/app';

const { projects } = app.organization;

export const load = async () => {
	return {
		projects: Object.values(projects).map((proj) => proj.serialize())
	};
};
