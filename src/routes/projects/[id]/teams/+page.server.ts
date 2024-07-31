import { app } from '$lib/app/app';
import type { Team } from '$lib/app/team.js';

export const load = async ({ params }) => {
	const project = app.organization.project(params.id);
	if (project) {
		const teams = project.teams;
		const list = Object.values(teams) as Team[];
		return {
			teams: list.map((team) => team.serialize())
		};
	} else {
		return {
			teams: []
		};
	}
};
