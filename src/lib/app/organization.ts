import { createMemberStore, createProjectStore } from '$lib/server/redis';
import type { RedisStore } from '$lib/stores/redis-rune-store.svelte';
import { Backlog } from './backlog';
import type { Member } from './member';
import type { Project } from './project';
import { Storable } from './storable';

export class Organization extends Storable {
	name: string = 'my org';
	projects = new Map<string, Project>();
	members = new Map<string, Member>();
	backlog: Backlog;
	projectStore: RedisStore;
	memberStore: RedisStore;

	constructor() {
		super();
		// this.stores.projects = createProjectStore();
		this.projectStore = createProjectStore();
		this.memberStore = createMemberStore();
		this.backlog = new Backlog();
	}

	project(id: string) {
		return this.projects.get(id);
	}

	addProject(project: Project) {
		this.projects.set(project.id, project);
	}

	removeProject(id: string) {
		this.projects.delete(id);
	}

	addMember(member: Member) {
		this.members.set(member.id, member);
	}

	removeMember(id: string) {
		this.members.delete(id);
	}
}
