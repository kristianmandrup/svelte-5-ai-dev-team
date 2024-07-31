export type ProjectPayload = {
	id: string;
	name: string;
	description?: string;
};

export type AddProjectPayload = {
	name: string;
	description?: string;
};

export type RemoveProjectPayload = {
	id: string;
};
