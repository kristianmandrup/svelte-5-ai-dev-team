import { faker } from '@faker-js/faker';
import type { ActionEvent } from '../events/event';
import type { RemoveTeamPayload, TeamPayload } from '../events/team.events';
import { getProject, getTeam, list } from './utils';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const names = list(6).map((_) => faker.commerce.department());

const add = (name: string): ActionEvent => ({
	source: 'generator',
	model: 'team',
	action: 'add',
	payload: {
		name,
		description: faker.lorem.sentence()
	}
});

const remove = (name: string): ActionEvent => ({
	source: 'generator',
	model: 'team',
	action: 'remove',
	payload: {
		name
	}
});

const eventLog = {
	add: names.map((name) => add(name)),
	remove: names.map((name) => remove(name))
};

export const getRandom = (items: string[]): string =>
	items[Math.floor(Math.random() * items.length)];

export const addEvents = () => {
	setInterval(() => {
		const event: ActionEvent | undefined = eventLog.add.shift();
		if (!event) return;
		const project = getProject();
		if (!project) {
			console.error(`No project`);
			return;
		}
		const payload = event.payload as TeamPayload;
		payload.projectId = project.id;
		project.teamStore.addObj(event);
	}, 3000);
};

export const removeEvents = () => {
	setInterval(() => {
		const event: ActionEvent | undefined = eventLog.add.shift();
		if (!event) return;
		const project = getProject();
		if (!project) {
			console.error(`No project`);
			return;
		}
		const payload = event.payload as RemoveTeamPayload;
		const team = getTeam();
		if (!team) {
			console.error(`No team`);
			return;
		}
		payload.projectId = project.id;
		payload.id = team.id;
		project.teamStore.addObj(event);
	}, 3000);
};

export const teamEvents = {
	addEvents,
	removeEvents,
	all: () => {
		addEvents();
		removeEvents();
	}
};
