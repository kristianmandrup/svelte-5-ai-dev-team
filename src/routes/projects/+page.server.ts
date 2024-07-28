import { app } from '$lib/app/app';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';

const { projects } = app.organization;

const newProjectSchema = z.object({
	name: z.string(),
	description: z.string().optional()
});

export const load = async () => {
	// const project = {
	// 	name: ''
	// };

	const form = await superValidate(zod(newProjectSchema));
	return {
		form,
		projects: Object.values(projects).map((proj) => proj.serialize())
	};
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(newProjectSchema));
		console.log(form);
		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		// TODO: process form data

		return {
			form
		};
	}
};
