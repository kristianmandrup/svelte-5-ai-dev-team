import { faker } from '@faker-js/faker';
import type { ActionEvent } from '../events/event';
import { app } from '../app';
import { getRandom, list } from './utils';

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
	add: [add(names[0]), add(names[1]), add(names[2]), add(names[3])],
	remove: [remove(names[0])]
};

const projectStore = app.organization.projectStore;

const addEvents = () => {
	setInterval(() => {
		const event = eventLog.add.shift();
		if (!event) return;
		projectStore.addObj(event);
	}, 2000);
};

const removeEvents = () => {
	setTimeout(() => {
		setInterval(() => {
			const projectIds: string[] = app.organization.projectList.map((team) => team.id);
			const event: ActionEvent | undefined = eventLog.remove.shift();
			if (!event) return;
			if (!event) return;
			const projectId = getRandom(projectIds);
			event.payload.id = projectId;
			projectStore.addObj(event);
		}, 2000);
	}, 5000);
};

export const projectEvents = {
	addEvents,
	removeEvents
};
