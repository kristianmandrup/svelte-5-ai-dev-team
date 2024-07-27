import type { RedisStore } from '$lib/stores/redis-rune-store.svelte';

export abstract class Storable {
	id: string;
	stores = new Map<string, RedisStore>();

	genId() {
		return crypto.randomUUID().slice(0, 6);
	}

	constructor() {
		this.id = this.genId();
	}
}
