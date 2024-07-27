import { faker } from '@faker-js/faker';
import type { ActionEvent } from '../events/event';
import { app } from '../app';

const names = ['Alpha', 'Beta', 'Omega', 'Gamma'];

const add = (name: string): ActionEvent => ({
	source: 'generator',
	model: 'project',
	action: 'add',
	payload: {
		name,
		description: faker.lorem.sentence()
	}
});

const remove = (name: string): ActionEvent => ({
	source: 'generator',
	model: 'project',
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
	add(names[3])
	// remove(names[1])
	// remove(names[2])
];

const projectStore = app.organization.projectStore;

export const generateProjectEvents = () => {
	setInterval(() => {
		const msg = messages.shift();
		if (!msg) return;
		const json = JSON.stringify(msg, null, 2);
		projectStore.add(json);
	}, 2000);
};
