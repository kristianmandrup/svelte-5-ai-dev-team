import { createStore } from '$lib/server/redis';
import type { RedisStore } from '$lib/stores/redis-store.svelte';
import type { Feature } from './feature';
import { Storable } from './storable';

export class Backlog extends Storable {
	features = new Map<string, Feature>();
	featureStore: RedisStore;

	constructor() {
		super();
		this.featureStore = createStore('', 'feature');
	}

	addFeature(feature: Feature) {
		this.features.set(feature.id, feature);
	}

	removeFeature(name: string) {
		this.remove(this.features, name);
	}

	get featureList() {
		return Array.from(this.features.values());
	}

	serialize() {
		return {
			features: this.featureList.map((f) => f.serialize())
		};
	}
}
