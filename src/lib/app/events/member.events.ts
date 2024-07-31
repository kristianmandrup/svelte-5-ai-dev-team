export type MemberPayload = {
	id: string;
	name: string;
	description?: string;
};

export type AddMemberPayload = MemberPayload;

export type RemoveMemberPayload = {
	id: string;
};

export type TeamMemberPayload = {
	teamId: string;
	name: string;
	description?: string;
};

export type AddTeamMemberPayload = TeamMemberPayload;

export type RemoveTeamMemberPayload = {
	teamId: string;
	id: string;
};
