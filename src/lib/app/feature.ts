import { createStore } from '$lib/server/redis';
import { Storable } from './storable';

export class Feature extends Storable {
	name: string;
	storeName: string;

	constructor(name: string) {
		super();
		this.name = name;
		this.storeName = `${name}@feature`;
		this.stores[this.storeName] = createStore(this.storeName, 'feature');
	}
}
