import { faker } from '@faker-js/faker';
import type { ActionEvent } from '../events/event';
import { app } from '../app';
import { getProjectId, list } from './utils';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const names = list(6).map((_) => faker.commerce.productName());

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

const eventLog = {
	add: names.map((name) => add(name)),
	remove: names.map((name) => remove(name))
};

const projectStore = app.organization.projectStore;

const addEvents = (start = 1000, interval = 3000) => {
	setTimeout(() => {
		setInterval(() => {
			const event = eventLog.add.shift();
			if (!event) return;
			projectStore.addObj(event);
		}, interval);
	}, start);
};

const removeEvents = (start = 4000, interval = 3000) => {
	setTimeout(() => {
		setInterval(() => {
			const event: ActionEvent | undefined = eventLog.remove.shift();
			if (!event) return;
			event.payload.id = getProjectId();
			projectStore.addObj(event);
		}, interval);
	}, start);
};

export const projectEvents = {
	addEvents,
	removeEvents,
	all: () => {
		addEvents();
		removeEvents();
	}
};
