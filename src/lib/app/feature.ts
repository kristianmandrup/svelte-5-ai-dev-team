import { createStore } from '$lib/server/redis';
import { Storable } from './storable';

export class Feature extends Storable {
	model = 'feature';
	name: string;
	storeName: string;

	constructor(name: string) {
		super();
		this.name = name;
		this.storeName = `${name}@feature`;
		this.stores.set(this.storeName, createStore(this.storeName, 'feature'));
	}

	serialize() {
		return {
			id: this.id,
			name: this.name
			// description: this.description
		};
	}
}
