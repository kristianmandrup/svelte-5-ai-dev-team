import { createStore } from '$lib/server/redis';
import type { RedisStore } from '$lib/stores/redis-store.svelte';
import type { FeaturePayload } from './events/feature.events';
import type { Feature } from './feature';
import { Storable } from './storable';

export class Backlog extends Storable {
	features = new Map<string, Feature>();
	featureStore: RedisStore;

	constructor() {
		super();
		this.featureStore = createStore('', 'feature');
	}

	feature(id: string) {
		return this.features.get(id);
	}

	updateFeature(payload: FeaturePayload) {
		const { id, name } = payload;
		const feature = this.feature(id);
		if (!feature) {
			throw new Error(`No such feature: ${id}`);
		}
		feature.name = name;
	}

	addFeature(feature: Feature) {
		this.addItem(this.features, feature);
	}

	removeFeature(id: string) {
		this.removeItem(this.features, id);
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
