import { faker } from '@faker-js/faker';
import type { ActionEvent } from '../events/event';
import { app } from '../app';
import { getOrgFeatureId, list } from './utils';

const names = list(6).map(() => faker.commerce.product());

const model = 'feature';

const add = (name: string): ActionEvent => ({
	source: 'generator',
	model,
	action: 'add',
	payload: {
		name,
		description: faker.lorem.sentence()
	}
});

const remove = (name: string): ActionEvent => ({
	source: 'generator',
	model,
	action: 'remove',
	payload: {
		name
	}
});

const eventLog = {
	add: names.map((name) => add(name)),
	remove: names.map((name) => remove(name))
};

const org = app.organization;

export const addEvents = (start = 1000, interval = 3000) => {
	setTimeout(() => {
		setInterval(() => {
			const event: ActionEvent | undefined = eventLog.add.shift();
			if (!event) return;
			org.backlog.featureStore.addObj(event);
		}, interval);
	}, start);
};

export const removeEvents = (start = 2000, interval = 4000) => {
	setTimeout(() => {
		setInterval(() => {
			const event: ActionEvent | undefined = eventLog.remove.shift();
			if (!event) return;
			event.payload.id = getOrgFeatureId();
			org.backlog.featureStore.addObj(event);
		}, interval);
	}, start);
};

export const orgFeatureEvents = {
	addEvents,
	removeEvents,
	all: () => {
		addEvents();
		removeEvents();
	}
};
