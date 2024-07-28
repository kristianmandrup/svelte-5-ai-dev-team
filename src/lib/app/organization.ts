import { createMemberStore, createProjectStore } from '$lib/server/redis';
import type { RedisStore } from '$lib/stores/redis-store.svelte';
import { Backlog } from './backlog';
import type { ProjectPayload } from './events/project.events';
import type { Member } from './member';
import type { Project } from './project';
import { Storable } from './storable';

export class Organization extends Storable {
	model = 'org';
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

	get teamList() {
		return this.projectList.map((proj) => proj.teamList).flat();
	}

	get projectList() {
		return Array.from(this.projects.values());
	}

	team(id: string) {
		const projects = Array.from(this.projects.values());
		const project = projects.find((proj) => proj.team(id));
		if (!project) return;
		return project.team(id);
	}

	updateProject(payload: ProjectPayload) {
		const { id, name, description } = payload;
		const project = this.project(id);
		if (!project) {
			throw new Error(`No such project: ${id}`);
		}
		project.name = name;
		project.description = description;
	}

	addProject(project: Project) {
		this.projects.set(project.id, project);
		project.publishEvent('add');
	}

	removeProject(name: string) {
		const project = this.byName(this.projects, name);
		this.remove(this.projects, name);
		(project as Project).publishEvent('remove');
	}

	addMember(member: Member) {
		this.members.set(member.id, member);
	}

	removeMember(id: string) {
		this.members.delete(id);
	}

	serialize() {
		return {
			id: this.id,
			name: this.name
			// description: this.description
		};
	}
}
