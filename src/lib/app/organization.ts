import { createProjectStore } from '$lib/server/redis';
import type { RedisStore } from '$lib/stores/redis-rune-store.svelte';
import { Backlog } from './backlog';
import type { Project } from './project';
import { Storable } from './storable';

export class Organization extends Storable {
	name: string = 'my org';
	projects: Record<string, Project> = {};
	backlog: Backlog;
	projectStore: RedisStore;

	constructor() {
		super();
		// this.stores.projects = createProjectStore();
		this.projectStore = createProjectStore();
		this.backlog = new Backlog();
	}

	addProject(project: Project) {
		this.projects[project.name] = project;
	}

	removeProject(name: string) {
		delete this.projects[name];
	}
}
