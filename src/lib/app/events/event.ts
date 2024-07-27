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
	payload: unknown;
};

export type ActionResult = 'success' | 'failure';

export type ActionResultEvent = {
	source: string;
	model: string;
	action: string;
	payload: unknown;
	result: ActionResult;
};
