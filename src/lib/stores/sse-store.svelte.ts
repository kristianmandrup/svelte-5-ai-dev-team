import { source } from 'sveltekit-sse';

import { getToastState } from '$lib/toast-state.svelte';
import type { AppEvent } from '$lib/app/events/event';

export type CreateSseStoreOpts = {
	channelName?: string;
	model: string;
};

type Named = {
	id: string;
	name: string;
	description?: string;
};

export class SseStore<T extends Named> {
	model = 'unknown';
	toastState = getToastState();
	connection = source('/events/app');
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	sseChannel: any;
	projects = $state<T[]>([]);

	constructor({ channelName, model }: CreateSseStoreOpts) {
		this.model = model;
		this.sseChannel = this.connection.select(channelName || model);
		this.subscribe();
	}

	get event() {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return this.sseChannel.json(function or({ error, raw, previous }: any) {
			console.error(`Could not parse "${raw}" as json.`, error);
			return previous; // This will be the new value of the store
		});
	}

	isValidEvent(event: AppEvent) {
		const { model } = event;
		return model === this.model;
	}

	subscribe() {
		this.event.subscribe((event: AppEvent) => {
			if (!event) return;
			if (!this.isValidEvent(event)) return;
			this.onRemove(event);
			this.onAdd(event);
		});
	}

	addToast(payload: T) {
		const { name, description } = payload;
		this.toastState.add(name, '' + description);
	}

	onRemove(event: AppEvent) {
		const { action, data } = event;
		if (action !== 'remove') return;
		this.projects = this.remove(data as T);
	}

	remove(payload: T) {
		return this.projects.filter((item: Named) => item.name !== payload.name);
	}

	onAdd(event: AppEvent) {
		const { action, data } = event;
		if (action !== 'add') return;
		this.projects.push(data as T);
	}

	onUpdate(event: AppEvent) {
		const { action, data } = event;
		if (action !== 'update') return;
		this.replace(data as T);
	}

	protected findItem(payload: T) {
		return this.projects.findIndex((item) => item.id === payload.id);
	}

	protected replace(payload: T) {
		const indexToReplace = this.findItem(payload);
		if (indexToReplace === -1) return;
		this.projects.splice(indexToReplace, 1, payload);
	}
}
