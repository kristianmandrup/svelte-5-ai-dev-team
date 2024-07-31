import { app } from '$lib/app/app';
import { Member } from '$lib/app/member';
import type { ActionEvent } from '../event';
import type { AddMemberPayload, RemoveMemberPayload } from '../member.events';
import { ActionEventHandler } from './event.handler';

export class MemberEventHandler extends ActionEventHandler {
	process(event: ActionEvent) {
		switch (event.action) {
			case 'add':
				return this.onAddMember(event);
			case 'remove':
				return this.onRemoveMember(event);
			default:
				console.log(`unknown action: ${event.action}`);
		}
	}

	get org() {
		return app.organization;
	}

	onAddMember = (event: ActionEvent) => {
		const payload = event.payload as AddMemberPayload;
		const { name } = payload;
		const member = new Member(name);
		this.org.addMember(member);
	};

	onRemoveMember = (event: ActionEvent) => {
		const payload = event.payload as RemoveMemberPayload;
		const { name } = payload;
		this.org.removeMember(name);
	};
}

export const memberEventHandler = new MemberEventHandler();
