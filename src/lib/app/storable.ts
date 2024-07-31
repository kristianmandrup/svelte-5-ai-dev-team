import type { RedisStore } from '$lib/stores/redis-store.svelte';
import { app, type ActionType } from './app';
import type { AppEvent } from './events/event';

export type IdentifiableItem = {
	id: string;
};

export type NamedItem = IdentifiableItem & {
	name: string;
};

export abstract class Storable implements IdentifiableItem {
	id: string;
	model = 'unknown';
	stores = new Map<string, RedisStore>();

	genId() {
		return crypto.randomUUID().slice(0, 6);
	}

	constructor() {
		this.id = this.genId();
	}

	abstract serialize(): unknown;

	byName($map: Map<string, NamedItem>, name: string) {
		return Array.from($map.values()).find((p: NamedItem) => p.name === name);
	}

	byId($map: Map<string, IdentifiableItem>, id: string) {
		return $map.get(id);
	}

	get appEvents() {
		return app.appEvents;
	}

	publishEvent(action: ActionType = 'add', event?: AppEvent) {
		event = event ?? this.createEvent(action);
		if (!this.appEvents) {
			throw new Error('appEvents store not available on app');
		}
		this.appEvents.addObj(event);
	}

	createEvent(action: ActionType = 'add'): AppEvent {
		return {
			source: 'app',
			model: this.model,
			action,
			data: this.dataFor(action)
		};
	}

	dataFor(action: ActionType) {
		switch (action) {
			case 'add':
				return this.serialize();
			case 'update':
				return this.serialize();
			case 'remove':
				return { id: this.id };
		}
	}

	remove($map: Map<string, IdentifiableItem>, id: string) {
		const item = this.byId($map, id);
		if (!item) return;
		$map.delete(item.id);
	}

	removeItem(collection: Map<string, IdentifiableItem>, id: string) {
		const item = this.byId(collection, id);
		this.remove(collection, id);
		(item as Storable).publishEvent('remove');
	}

	addItem(collection: Map<string, Storable>, item: Storable) {
		collection.set(item.id, item);
		item.publishEvent('add');
	}
}
