import { createMemberStore, createTeamStore } from '$lib/server/redis';
import { Backlog } from './backlog';
import type { Member } from './member';
import { Project } from './project';

export class Team extends Storage {
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
