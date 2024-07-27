import { createTeamStore, createProjectStore } from '$lib/server/redis';
import type { RedisStore } from '$lib/stores/redis-rune-store.svelte';
import { Storable } from './storable';
import type { Team } from './team';

export class Project extends Storable {
	name: string;
	description?: string;
	storeName: string;
	teams = new Map<string, Team>();
	teamStore: RedisStore;

	static create(name: string) {
		return new Project(name);
	}

	constructor(name: string, description?: string) {
		super();
		this.name = name;
		this.description = description;
		this.storeName = `${name}@team`;
		// this.stores.set('teams', createTeamStore());
		this.teamStore = createTeamStore();
		this.stores.set(this.storeName, createProjectStore(this.storeName));
	}

	serialize() {
		return {
			id: this.id,
			name: this.name,
			description: this.description
		};
	}

	addTeam(team: Team) {
		this.teams.set(team.name, team);
	}

	removeTeam(name: string) {
		this.teams.delete(name);
	}
}
