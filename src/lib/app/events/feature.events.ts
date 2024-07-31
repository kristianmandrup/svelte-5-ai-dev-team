export type FeaturePayload = {
	id: string;
	teamId?: string;
	name: string;
	description?: string;
};

export type AddFeaturePayload = {
	teamId?: string;
	name: string;
	description?: string;
};

export type RemoveFeaturePayload = {
	teamId?: string;
	id: string;
};
