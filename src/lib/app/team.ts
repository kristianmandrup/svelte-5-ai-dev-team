import { createMemberStore, createTeamStore } from '$lib/server/redis';
import { Backlog } from './backlog';
import type { Member } from './member';
import { Project } from './project';
import { Storable } from './storable';

export class Team extends Storable {
	id: string;
	name: string;
	description?: string;

	storeName: string;
	members = new Map<string, Member>();
	backlog: Backlog;

	static create(name: string) {
		return new Project(name);
	}

	constructor(name: string, description?: string) {
		super();
		this.id = crypto.randomUUID().slice(0, 6);
		this.name = name;
		this.description = description;
		this.storeName = `${name}@team`;
		this.stores.set('members', createMemberStore());
		this.stores.set(this.storeName, createTeamStore(this.storeName));
		this.backlog = new Backlog();
	}

	serialize() {
		return {
			id: this.id,
			name: this.name,
			description: this.description
		};
	}

	addMember(member: Member) {
		this.members.set(member.id, member);
	}

	removeMember(name: string) {
		this.members.delete(name);
	}
}
