import { faker } from '@faker-js/faker';
import type { ActionEvent } from '../events/event';
import { app } from '../app';
import { list } from './utils';
import type { FeaturePayload } from '../events/feature.events';

const names = list(6).map(() => faker.commerce.product.name);

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

const eventLog = [
	add(names[0]),
	add(names[1]),
	remove(names[0]),
	add(names[2]),
	remove(names[1])
	// remove(names[2])
];

export const getRandom = (items: string[]): string =>
	items[Math.floor(Math.random() * items.length)];

export const generateFeatureEvents = () => {
	setInterval(() => {
		const teamIds: string[] = Array.from(app.organization.teamList.map((t) => t.id));

		const event: ActionEvent | undefined = eventLog.shift();
		if (!event) return;
		const teamId = getRandom(teamIds);
		const payload = event.payload as FeaturePayload;
		payload.teamId = teamId;
		const team = app.organization.team(teamId);
		if (!team) {
			console.error(`No team: ${teamId}`);
			return;
		}
		team.backlog.featureStore.addObj(event);
	}, 3000);
};
