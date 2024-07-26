import type { RedisStore } from '$lib/stores/redis-rune-store.svelte';

export abstract class Storable {
	stores: Record<string, RedisStore> = {};
}
