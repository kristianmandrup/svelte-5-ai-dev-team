import { createTeamStore, createProjectStore } from '$lib/server/redis';
import type { Team } from './team';

export class Project extends Storage {
	name: string;
	storeName: string;
	teams: Record<string, Team> = {};

	static create(name: string) {
		return new Project(name);
	}

	constructor(name: string) {
		super();
		this.name = name;
		this.storeName = `${name}@team`;
		this.stores['teams'] = createTeamStore();
		this.stores[this.storeName] = createProjectStore(this.storeName);
	}

	addTeam(team: Team) {
		this.teams[team.name] = team;
	}

	removeTeam(name: string) {
		delete this.teams[name];
	}
}
