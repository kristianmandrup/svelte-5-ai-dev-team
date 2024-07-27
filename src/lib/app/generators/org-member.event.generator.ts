import { faker } from '@faker-js/faker';
import type { ActionEvent } from '../events/event';
import { app } from '../app';
import type { TeamMemberPayload } from '../events/member.events';

const names = ['Allan', 'Carol', 'Michael'];

const add = (name: string): ActionEvent => ({
	source: 'generator',
	model: 'member',
	action: 'add',
	payload: {
		name,
		description: faker.lorem.sentence()
	}
});

const remove = (name: string): ActionEvent => ({
	source: 'generator',
	model: 'member',
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

const getRandom = (items: string[]): string => items[Math.floor(Math.random() * items.length)];

export const generateMemberEvents = () => {
	setInterval(() => {
		const teamIds: string[] = app.organization.teamList.map((team) => team.id);
		const event: ActionEvent | undefined = eventLog.shift();
		if (!event) return;
		const teamId = getRandom(teamIds);
		const payload = event.payload as TeamMemberPayload;
		payload.teamId = teamId;
		app.organization.memberStore.addObj(event);
	}, 2400);
};
