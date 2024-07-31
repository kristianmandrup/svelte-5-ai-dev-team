import { createMemberStore, createTeamStore } from '$lib/server/redis';
import type { RedisStore } from '$lib/stores/redis-store.svelte';
import { Backlog } from './backlog';
import type { Member } from './member';
import { Project } from './project';
import { Storable } from './storable';

export class Team extends Storable {
	model = 'team';
	id: string;
	name: string;
	description?: string;

	storeName: string;
	members = new Map<string, Member>();
	backlog: Backlog;
	memberStore: RedisStore;

	static create(name: string) {
		return new Project(name);
	}

	constructor(name: string, description?: string) {
		super();
		this.id = crypto.randomUUID().slice(0, 6);
		this.name = name;
		this.description = description;
		this.storeName = `${name}@team`;
		// this.stores.set('members', createMemberStore());
		this.memberStore = createMemberStore();
		this.stores.set(this.storeName, createTeamStore(this.storeName));
		this.backlog = new Backlog();
	}

	member(id: string) {
		return this.members.get(id);
	}

	get memberList() {
		return Array.from(this.members.values());
	}

	get memberIds() {
		return this.memberList.map((mem) => mem.id);
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

	removeMember(id: string) {
		this.removeItem(this.members, id);
	}
}
