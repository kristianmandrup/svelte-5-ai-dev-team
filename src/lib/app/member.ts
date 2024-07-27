import { createMemberStore } from '$lib/server/redis';
import type { Feature } from './feature';
import { Project } from './project';
import { Storable } from './storable';

export class Member extends Storable {
	name: string;
	storeName: string;
	assigned?: Feature;

	static create(name: string) {
		return new Project(name);
	}

	constructor(name: string) {
		super();
		this.name = name;
		this.storeName = `${name}@team`;
		this.stores.set(this.storeName, createMemberStore(this.storeName));
	}

	assignFeature(feature: Feature) {
		this.assigned = feature;
	}
}
