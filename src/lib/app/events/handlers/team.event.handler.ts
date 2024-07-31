import { Team } from '$lib/app/team';
import type { ActionEvent } from '../event';
import type { AddTeamPayload, RemoveTeamPayload } from '../team.events';
import { ActionEventHandler } from './event.handler';

export class TeamEventHandler extends ActionEventHandler {
	process(event: ActionEvent) {
		switch (event.action) {
			case 'add':
				return this.onAddTeam(event);
			case 'remove':
				return this.onRemoveTeam(event);
			default:
				console.log(`unknown action: ${event.action}`);
		}
	}

	getProject(id: string) {
		return this.organization.projects.get(id);
	}

	onAddTeam = (event: ActionEvent) => {
		const payload = event.payload as AddTeamPayload;
		const { name, description, projectId } = payload;
		const project = this.getProject(projectId);
		if (!project) return;
		const team = new Team(name, description);
		project.addTeam(team);
	};

	onRemoveTeam = (event: ActionEvent) => {
		const payload = event.payload as RemoveTeamPayload;
		const { name, projectId } = payload;
		const project = this.getProject(projectId);
		if (!project) return;
		project.removeTeam(name);
	};
}

export const teamEventHandler = new TeamEventHandler();
