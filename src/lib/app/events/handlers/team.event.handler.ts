import { Team } from '$lib/app/team';
import type { AppEvent } from '../event';
import type { AddTeamPayload, RemoveTeamPayload } from '../team.events';
import { AppEventHandler } from './event.handler';

export class TeamEventHandler extends AppEventHandler {
	process(event: AppEvent) {
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

	onAddTeam = (event: AppEvent) => {
		const payload = event.payload as AddTeamPayload;
		const { name, description, projectId } = payload;
		const project = this.getProject(projectId);
		if (!project) return;
		const team = new Team(name, description);
		project.addTeam(team);
	};

	onRemoveTeam = (event: AppEvent) => {
		const payload = event.payload as RemoveTeamPayload;
		const { name, projectId } = payload;
		const project = this.getProject(projectId);
		if (!project) return;
		project.removeTeam(name);
	};
}

export const teamEventHandler = new TeamEventHandler();
