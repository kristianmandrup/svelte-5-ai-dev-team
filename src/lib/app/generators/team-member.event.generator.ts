import { faker } from '@faker-js/faker';
import type { ActionEvent } from '../events/event';
import { app } from '../app';
import type { TeamMemberPayload } from '../events/member.events';
import { getRandom } from './utils';

const names = ['Jack', 'Willy', 'Maria'];

const add = (name: string): ActionEvent => ({
	source: 'generator',
	model: 'team-member',
	action: 'add',
	payload: {
		name,
		description: faker.lorem.sentence()
	}
});

const remove = (name: string): ActionEvent => ({
	source: 'generator',
	model: 'team-member',
	action: 'remove',
	payload: {
		name
	}
});

const eventLog = [
	add(names[0]),
	add(names[1]),
	remove(names[0]),
	add(names[2]),
	remove(names[1])
	// remove(names[2])
];

export const generateTeamMemberEvents = () => {
	setInterval(() => {
		const teamIds: string[] = app.organization.teamList.map((team) => team.id);
		const event: ActionEvent | undefined = eventLog.shift();
		if (!event) return;
		const teamId = getRandom(teamIds);
		const payload = event.payload as TeamMemberPayload;
		payload.teamId = teamId;
		const team = app.organization.team(teamId);
		if (!team) {
			console.error(`No team: ${teamId}`);
			return;
		}
		team.memberStore.addObj(event);
	}, 4000);
};
