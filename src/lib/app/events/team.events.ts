export type AddTeamPayload = {
	projectId: string;
	name: string;
	description?: string;
};

export type RemoveTeamPayload = {
	projectId: string;
	name: string;
};
