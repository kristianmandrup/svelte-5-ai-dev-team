import { faker } from '@faker-js/faker';
import type { ActionEvent } from '../events/event';
import { app } from '../app';
import type { TeamPayload } from '../events/team.events';

const names = ['Team A', 'Team B', 'Team X'];

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

const messages = [
	add(names[0]),
	add(names[1]),
	remove(names[0]),
	add(names[2]),
	remove(names[1])
	// remove(names[2])
];

export const getRandom = (items: string[]): string =>
	items[Math.floor(Math.random() * items.length)];

export const generateTeamEvents = () => {
	setInterval(() => {
		const projectIds: string[] = Array.from(app.organization.projects.keys());

		const msg: ActionEvent | undefined = messages.shift();
		if (!msg) return;
		const projectId = getRandom(projectIds);
		const payload = msg.payload as TeamPayload;
		payload.projectId = projectId;
		const project = app.organization.project(projectId);
		if (!project) {
			console.error(`No project: ${projectId}`);
			return;
		}
		const json = JSON.stringify(msg, null, 2);
		project.teamStore.add(json);
	}, 3000);
};
