import type { Feature } from './feature';

export class Backlog {
	features: Record<string, Feature> = {};

	constructor() {}
}
