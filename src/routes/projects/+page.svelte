<script lang="ts">
	import type { PageData } from './$types';
	import type { ProjectPayload } from '$lib/app/events/project.events';
	import { useSseStore } from '$lib/stores/sse-store.svelte';
	import { superForm } from 'sveltekit-superforms';
	// Access the loaded data using $props
	const { data } = $props<{ data: PageData }>();
	const { form, errors, enhance, constraints } = superForm<ProjectPayload>(data.form);
	const sseStore = useSseStore<ProjectPayload>({ model: 'project' });
	let allProjects = $derived(data.projects.push(sseStore.projects));
</script>

<div>
	<h1>Projects</h1>

	<ul class="project-list">
		{#each allProjects as project}
			<li class="project-item"><a href="/projects/{project.id}">{project.name}</a></li>
		{/each}
	</ul>

	<form method="POST" use:enhance class="flex w-1/4 flex-col gap-2">
		<div class="flex flex-col gap-1">
			<label for="title">Title</label>
			<input
				class="rounded-md border border-gray-800"
				id="title"
				bind:value={$form.name}
				{...$constraints.name}
			/>
			{#if $errors.name}
				<small class="input-error">{$errors.name}</small>
			{/if}
		</div>

		<div class="flex flex-col gap-1">
			<label for="description">Message</label>
			<input
				class="rounded-md border border-gray-800"
				id="description"
				bind:value={$form.description}
				{...$constraints.description}
			/>
			{#if $errors.description}
				<small class="input-error">{$errors.description}</small>
			{/if}
		</div>
		<button class="rounded-md bg-gray-300 p-1"> Submit </button>
	</form>
</div>

<style>
	.project-item {
		background: green;
		color: white;
		font-weight: 400;
	}

	.input-error {
		color: red;
	}
</style>
