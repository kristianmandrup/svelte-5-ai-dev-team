import { createMemberStore, createProjectStore } from '$lib/server/redis';
import type { RedisStore } from '$lib/stores/redis-store.svelte';
import { Backlog } from './backlog';
import type { MemberPayload } from './events/member.events';
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

	member(id: string) {
		return this.members.get(id);
	}

	team(id: string) {
		return this.teamList.find((team) => team.id === id);
	}

	get teamList() {
		return this.projectList.map((proj) => proj.teamList).flat();
	}

	get projectList() {
		return Array.from(this.projects.values());
	}

	get memberList() {
		return Array.from(this.members.values());
	}

	get memberIds() {
		return this.memberList.map((mem) => mem.id);
	}

	get teamIds() {
		return this.teamList.map((team) => team.id);
	}

	get projectIds() {
		return this.projectList.map((proj) => proj.id);
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
		this.addItem(this.projects, project);
	}

	removeProject(id: string) {
		this.removeItem(this.projects, id);
	}

	addMember(member: Member) {
		this.addItem(this.members, member);
	}

	updateMember(payload: MemberPayload) {
		const { id, name } = payload;
		const member = this.member(id);
		if (!member) {
			throw new Error(`No such member: ${id}`);
		}
		member.name = name;
		// member.description = description;
	}

	removeMember(id: string) {
		this.removeItem(this.members, id);
	}

	serialize() {
		return {
			id: this.id,
			name: this.name
			// description: this.description
		};
	}
}
