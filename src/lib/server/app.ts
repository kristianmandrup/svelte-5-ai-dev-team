import type { RedisStore } from '$lib/stores/redis-rune-store.svelte';
import { createMemberStore, createProjectStore, createStore, createTeamStore } from './redis';

class Application {
	organization: Organization;

	constructor() {
		this.organization = new Organization();
	}
}

export const app = new Application();

abstract class Storage {
	stores: Record<string, RedisStore> = {};
}

class Organization extends Storage {
	name: string = 'my org';
	projects: Record<string, Project> = {};
	backlog: Backlog;

	constructor() {
		super();
		this.stores['projects'] = createProjectStore();
		this.backlog = new Backlog();
	}

	addProject(project: Project) {
		this.projects[project.name] = project;
	}

	removeProject(name: string) {
		delete this.projects[name];
	}
}

class Project extends Storage {
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

class Team extends Storage {
	name: string;
	storeName: string;
	members: Record<string, Member> = {};
	backlog: Backlog;

	static create(name: string) {
		return new Project(name);
	}

	constructor(name: string) {
		super();
		this.name = name;
		this.storeName = `${name}@team`;
		this.stores['members'] = createMemberStore();
		this.stores[this.storeName] = createTeamStore(this.storeName);
		this.backlog = new Backlog();
	}

	addMember(member: Member) {
		this.members[member.name] = member;
	}

	removeMember(name: string) {
		delete this.members[name];
	}
}

class Member extends Storage {
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

class Feature extends Storage {
	name: string;
	storeName: string;

	constructor(name: string) {
		super();
		this.name = name;
		this.storeName = `${name}@feature`;
		this.stores[this.storeName] = createStore(this.storeName, 'feature');
	}
}

class Backlog {
	features: Record<string, Feature> = {};

	constructor() {}
}
