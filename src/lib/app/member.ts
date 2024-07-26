import { createMemberStore } from '$lib/server/redis';
import { Project } from './project';
import { Storable } from './storable';

export class Member extends Storable {
	name: string;
	storeName: string;

	static create(name: string) {
		return new Project(name);
	}

	constructor(name: string) {
		super();
		this.name = name;
		this.storeName = `${name}@team`;
		this.stores[this.storeName] = createMemberStore(this.storeName);
	}
}
