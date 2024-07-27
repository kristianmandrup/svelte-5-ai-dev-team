export type AddMemberPayload = {
	name: string;
	description?: string;
};

export type RemoveMemberPayload = {
	name: string;
};

export type AddTeamMemberPayload = {
	teamId: string;
	name: string;
	description?: string;
};

export type RemoveTeamMemberPayload = {
	teamId: string;
	name: string;
};
