import { app } from '$lib/app/app';

export const load = async ({ params }) => {
	const project = app.organization.project(params.id);
	if (project) {
		const { name, description } = project;
		const teams = project.teams;
		return {
			name,
			description,
			teams: Object.values(teams).map((item) => item.serialize())
		};
	} else {
		return {
			teams: []
		};
	}
};
