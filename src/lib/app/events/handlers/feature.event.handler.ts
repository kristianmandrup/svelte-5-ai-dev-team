import { Feature } from '$lib/app/feature';
import type { ActionEvent } from '../event';
import type { AddFeaturePayload } from '../feature.events';
import { ActionEventHandler } from './event.handler';

export class FeatureEventHandler extends ActionEventHandler {
	process(event: ActionEvent) {
		switch (event.action) {
			case 'add':
				return this.onAddFeature(event);
			case 'remove':
				return this.onRemoveFeature(event);
			default:
				console.log(`unknown action: ${event.action}`);
		}
	}

	getProject(id: string) {
		return this.organization.projects.get(id);
	}

	getTeam(id: string) {
		return this.organization.team(id);
	}

	getTeamBacklog(teamId: string) {
		const team = this.getTeam(teamId);
		return team?.backlog;
	}

	get backlog() {
		return this.organization.backlog;
	}

	getBacklog(event: ActionEvent) {
		const payload = event.payload as AddFeaturePayload;
		const { teamId } = payload;
		return teamId ? this.getTeamBacklog(teamId) : this.backlog;
	}

	onAddFeature = (event: ActionEvent) => {
		const backlog = this.getBacklog(event);
		if (!backlog) return;
		const payload = event.payload as AddFeaturePayload;
		const { name } = payload;
		const feature = new Feature(name);
		backlog.addFeature(feature);
	};

	onRemoveFeature = (event: ActionEvent) => {
		const backlog = this.getBacklog(event);
		if (!backlog) return;
		const payload = event.payload as AddFeaturePayload;
		const { name } = payload;
		backlog.removeFeature(name);
	};
}

export const featureEventHandler = new FeatureEventHandler();
