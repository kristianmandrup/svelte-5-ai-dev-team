import { app } from '$lib/app/app';
import type { ActionEvent } from '$lib/app/events/event';
import type { ActionEventHandler } from '$lib/app/events/handlers/event.handler';
import { projectEventHandler } from '$lib/app/events/handlers/project.event.handler';
import { teamMemberEventHandler } from '$lib/app/events/handlers/team-member.event.handler';
import { teamEventHandler } from '$lib/app/events/handlers/team.event.handler';
import { generateProjectEvents } from '$lib/app/generators/project.event.generator';
import { generateTeamMemberEvents } from '$lib/app/generators/team-member.event.generator';
import { generateTeamEvents } from '$lib/app/generators/team.event.generator';
import { produce } from 'sveltekit-sse';

const appEventStore = app.appEvents;

const eventHandlers = new Map<string, ActionEventHandler>();
eventHandlers.set('project', projectEventHandler);
eventHandlers.set('team', teamEventHandler);
eventHandlers.set('member', teamMemberEventHandler);

const onActionEvents = (messages: string[], newMessage: string) => {
	try {
		const json = JSON.parse(newMessage);
		const event = json as ActionEvent;
		const { model } = event;
		const handler = eventHandlers.get(model);
		if (!handler) {
			throw new Error(`Unknown event model: ${model}`);
		}
		handler.process(event);
	} catch (err) {
		console.log(err);
	}
};

const projectStore = app.organization.projectStore;
projectStore.subscribe('app', onActionEvents);

export function POST() {
	return produce(async function start({ emit }) {
		console.log('produce app messages');
		const onMessages = (messages: string[], newMessage: string) => {
			// TODO: filter only project messages
			try {
				if (!newMessage) {
					console.log('invalid message - skipped');
					return;
				}
				console.log('App message received', { newMessage });
				const json = JSON.parse(newMessage);
				console.log('AppEvent', { json });
				const { model } = json;
				if (model === 'project') {
					console.log('emit: project message');
					emit('project', newMessage);
				} else {
					console.log('not a project message');
				}
			} catch (err) {
				console.error(err);
			}
		};
		appEventStore.subscribe(`stream:`, onMessages);
	});
}

generateProjectEvents();
generateTeamEvents();
generateTeamMemberEvents();
