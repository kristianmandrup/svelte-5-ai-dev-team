import { Member } from '$lib/app/member';
import type { ActionEvent } from '../event';
import type { AddTeamMemberPayload, RemoveTeamMemberPayload } from '../member.events';
import { ActionEventHandler } from './event.handler';

export class TeamMemberEventHandler extends ActionEventHandler {
	process(event: ActionEvent) {
		switch (event.action) {
			case 'add':
				return this.onAddMember(event);
			case 'remove':
				return this.onRemoveMember(event);
			default:
				console.log(`unknown action: ${event.action}`);
		}
	}

	getProject(id: string) {
		return this.organization.project(id);
	}

	getTeam(id: string) {
		return this.organization.team(id);
	}

	onAddMember = (event: ActionEvent) => {
		const payload = event.payload as AddTeamMemberPayload;
		const { name, teamId } = payload;
		const team = this.getTeam(teamId);
		if (!team) return;
		const member = new Member(name);
		team.addMember(member);
	};

	onRemoveMember = (event: ActionEvent) => {
		const payload = event.payload as RemoveTeamMemberPayload;
		const { name, teamId } = payload;
		const team = this.getTeam(teamId);
		if (!team) return;
		team.removeMember(name);
	};
}

export const teamMemberEventHandler = new TeamMemberEventHandler();
