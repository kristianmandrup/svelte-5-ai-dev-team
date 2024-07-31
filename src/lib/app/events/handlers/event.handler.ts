import { app } from '$lib/app/app';
import type { ActionEvent } from '../event';

export abstract class ActionEventHandler {
	organization = app.organization;

	abstract process(event: ActionEvent): void;
}
