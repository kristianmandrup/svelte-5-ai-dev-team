import { faker } from '@faker-js/faker';
import type { ActionEvent } from '../events/event';
import { getFeatureId, getTeam, list } from './utils';
import type { FeaturePayload } from '../events/feature.events';

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

export const addEvents = (start = 6000, interval = 3000) => {
	setTimeout(() => {
		setInterval(() => {
			const event: ActionEvent | undefined = eventLog.add.shift();
			if (!event) return;
			const team = getTeam();
			if (!team) {
				console.error(`No team`);
				return;
			}
			const payload = event.payload as FeaturePayload;
			payload.teamId = team.id;
			team.backlog.featureStore.addObj(event);
		}, interval);
	}, start);
};

export const removeEvents = (start = 9000, interval = 4000) => {
	setTimeout(() => {
		setInterval(() => {
			const event: ActionEvent | undefined = eventLog.remove.shift();
			if (!event) return;
			const team = getTeam();
			if (!team) {
				console.error(`No team`);
				return;
			}
			const payload = event.payload as FeaturePayload;
			payload.teamId = team.id;
			event.payload.id = getFeatureId(team);

			team.backlog.featureStore.addObj(event);
		}, interval);
	}, start);
};

export const teamFeatureEvents = {
	addEvents,
	removeEvents,
	all: () => {
		addEvents();
		removeEvents();
	}
};
