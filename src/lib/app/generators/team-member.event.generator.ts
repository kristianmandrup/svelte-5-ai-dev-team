import { faker } from '@faker-js/faker';
import type { ActionEvent } from '../events/event';
import type { TeamMemberPayload } from '../events/member.events';
import { getTeam, getTeamMemberId, list } from './utils';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const names = list(6).map((_) => faker.person.firstName());

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

const eventLog = {
	add: names.map((name) => add(name)),
	remove: names.map((name) => remove(name))
};

const addEvents = (start = 5000, interval = 3000) => {
	setTimeout(() => {
		setInterval(() => {
			const event: ActionEvent | undefined = eventLog.add.shift();
			if (!event) return;
			const team = getTeam();
			if (!team) {
				console.error(`No team`);
				return;
			}
			const payload = event.payload as TeamMemberPayload;
			payload.teamId = team.id;
			team.memberStore.addObj(event);
		}, interval);
	}, start);
};

const removeEvents = (start = 7000, interval = 4000) => {
	setTimeout(() => {
		setInterval(() => {
			const event: ActionEvent | undefined = eventLog.remove.shift();
			if (!event) return;
			const team = getTeam();
			if (!team) {
				console.error(`No team`);
				return;
			}
			const payload = event.payload as TeamMemberPayload;
			payload.teamId = team.id;
			event.payload.id = getTeamMemberId(team);
			team.memberStore.addObj(event);
		}, interval);
	}, start);
};

export const teamMemberEvents = {
	addEvents,
	removeEvents,
	all: () => {
		addEvents();
		removeEvents();
	}
};
