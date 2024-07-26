import { Organization } from './organization';

class Application {
	organization: Organization;

	constructor() {
		this.organization = new Organization();
	}
}

export const app = new Application();
