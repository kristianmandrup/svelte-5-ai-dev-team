export type ActionPayload = Record<string, unknown>;

export type AppEvent = {
	source: 'app';
	model: string;
	action: string;
	data: unknown;
};

export type ActionEvent = {
	source: string;
	model: string;
	action: string;
	payload: ActionPayload;
};

export type ActionResult = 'success' | 'failure';

export type ActionResultEvent = {
	source: string;
	model: string;
	action: string;
	payload: ActionPayload;
	result: ActionResult;
};
