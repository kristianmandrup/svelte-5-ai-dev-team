import { app } from '$lib/app/app';

export const load = async ({ params }) => {
	const id = params.id;
	const project = app.organization.project(id);
	if (project) {
		console.log('load project', id);
		const { name, description } = project;
		const teams = project.teams;
		const list = Object.values(teams);
		return {
			name,
			description,
			teams: list.map((item) => item.serialize())
		};
	} else {
		return {
			teams: []
		};
	}
};
