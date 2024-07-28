import { createStore } from '$lib/server/redis';
import type { RedisStore } from '$lib/stores/redis-store.svelte';
import { Organization } from './organization';

export type ActionType = 'add' | 'remove' | 'update';

class Application {
	organization: Organization;
	appEvents: RedisStore;

	constructor() {
		this.organization = new Organization();
		this.appEvents = createStore('app', 'application');
	}
}

export const app = new Application();
