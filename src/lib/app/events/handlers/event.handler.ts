import { app } from '$lib/app/app';
import type { AppEvent } from '../event';

export abstract class AppEventHandler {
	organization = app.organization;

	abstract process(event: AppEvent): void;
}
