import { createTeamStore, createProjectStore } from '$lib/server/redis';
import type { RedisStore } from '$lib/stores/redis-store.svelte';
import type { TeamPayload } from './events/team.events';
import { Storable } from './storable';
import type { Team } from './team';

export class Project extends Storable {
	model = 'project';
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

	team(id: string) {
		return this.teams.get(id);
	}

	get teamList() {
		return Array.from(this.teams.values());
	}

	get teamIds() {
		return this.teamList.map((team) => team.id);
	}

	serialize() {
		return {
			id: this.id,
			name: this.name,
			description: this.description
		};
	}

	updateProject(payload: TeamPayload) {
		const { id, name, description } = payload;
		const team = this.team(id);
		if (!team) {
			throw new Error(`No such team: ${id}`);
		}
		team.name = name;
		team.description = description;
	}

	addTeam(team: Team) {
		this.addItem(this.teams, team);
	}

	removeTeam(id: string) {
		this.removeItem(this.teams, id);
	}
}
