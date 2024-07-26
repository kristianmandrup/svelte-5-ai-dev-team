import { createTeamStore, createProjectStore } from '$lib/server/redis';
import { Storable } from './storable';
import type { Team } from './team';

export class Project extends Storable {
	id: string;
	name: string;
	description?: string;
	storeName: string;
	teams: Record<string, Team> = {};

	static create(name: string) {
		return new Project(name);
	}

	constructor(name: string, description?: string) {
		super();
		this.id = crypto.randomUUID().slice(0, 6);
		this.name = name;
		this.description = description;
		this.storeName = `${name}@team`;
		this.stores['teams'] = createTeamStore();
		this.stores[this.storeName] = createProjectStore(this.storeName);
	}

	serialize() {
		return {
			id: this.id,
			name: this.name,
			description: this.description
		};
	}

	addTeam(team: Team) {
		this.teams[team.name] = team;
	}

	removeTeam(name: string) {
		delete this.teams[name];
	}
}
