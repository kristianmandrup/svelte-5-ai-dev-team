import { app } from '$lib/app/app';
import { Project } from '$lib/app/project';
import type { ActionEvent } from '../event';
import type { AddProjectPayload, RemoveProjectPayload } from '../project.events';
import { ActionEventHandler } from './event.handler';

export class ProjectEventHandler extends ActionEventHandler {
	process(event: ActionEvent) {
		switch (event.action) {
			case 'add':
				return this.onAddProject(event);
			case 'remove':
				return this.onRemoveProject(event);
			default:
				console.log(`unknown action: ${event.action}`);
		}
	}

	onAddProject = (event: ActionEvent) => {
		const payload = event.payload as AddProjectPayload;
		const { name, description } = payload;
		const project = new Project(name, description);
		app.organization.addProject(project);
	};

	onRemoveProject = (event: ActionEvent) => {
		const payload = event.payload as RemoveProjectPayload;
		const { name } = payload;
		app.organization.removeProject(name);
	};
}

export const projectEventHandler = new ProjectEventHandler();
