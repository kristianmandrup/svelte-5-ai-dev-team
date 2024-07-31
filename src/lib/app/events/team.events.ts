export type TeamPayload = {
	id: string;
	projectId: string;
	name: string;
	description?: string;
};

export type AddTeamPayload = {
	projectId: string;
	name: string;
	description?: string;
};

export type RemoveTeamPayload = {
	projectId?: string;
	id: string;
};
