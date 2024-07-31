import { faker } from '@faker-js/faker';
import type { ActionEvent } from '../events/event';
import { app } from '../app';
import { getOrgMemberId, list } from './utils';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const names = list(6).map((_) => faker.person.firstName());

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

const eventLog = {
	add: names.map((name) => add(name)),
	remove: names.map((name) => remove(name))
};

const org = app.organization;

const addEvents = (start = 1000, interval = 3000) => {
	setTimeout(() => {
		setInterval(() => {
			const event: ActionEvent | undefined = eventLog.add.shift();
			if (!event) return;
			org.memberStore.addObj(event);
		}, interval);
	}, start);
};

const removeEvents = (start = 6000, interval = 3000) => {
	setTimeout(() => {
		setInterval(() => {
			const event: ActionEvent | undefined = eventLog.remove.shift();
			if (!event) return;
			event.payload.id = getOrgMemberId();
			org.memberStore.addObj(event);
		}, interval);
	}, start);
};

export const orgMemberEvents = {
	addEvents,
	removeEvents,
	all: () => {
		addEvents();
		removeEvents();
	}
};
