import { faker } from '@faker-js/faker';
import type { ActionEvent } from '../events/event';
import { app } from '../app';
import type { TeamMemberPayload } from '../events/member.events';
import { getRandom, list } from './utils';

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

const addEvents = () => {
	setInterval(() => {
		const teamIds: string[] = app.organization.teamList.map((team) => team.id);
		const event: ActionEvent | undefined = eventLog.add.shift();
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
	}, 2500);
};

const removeEvents = () => {
	setTimeout(() => {
		setInterval(() => {
			const teamIds: string[] = app.organization.teamIds;
			const event: ActionEvent | undefined = eventLog.remove.shift();
			if (!event) return;
			const teamId = getRandom(teamIds);
			const payload = event.payload as TeamMemberPayload;
			payload.teamId = teamId;
			const team = app.organization.team(teamId);
			if (!team) {
				console.error(`No team: ${teamId}`);
				return;
			}
			const memberIds: string[] = team.memberIds;
			const id = getRandom(memberIds);
			event.payload.id = id;
			team.memberStore.addObj(event);
		}, 2500);
	}, 6000);
};

export const teamMemberEvents = {
	addEvents,
	removeEvents,
	all: () => {
		addEvents();
		removeEvents();
	}
};
