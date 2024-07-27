export type MemberPayload = {
	name: string;
	description?: string;
};

export type AddMemberPayload = MemberPayload;

export type RemoveMemberPayload = {
	name: string;
};

export type TeamMemberPayload = {
	teamId: string;
	name: string;
	description?: string;
};

export type AddTeamMemberPayload = TeamMemberPayload;

export type RemoveTeamMemberPayload = {
	teamId: string;
	name: string;
};
