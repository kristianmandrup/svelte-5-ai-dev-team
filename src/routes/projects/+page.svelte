<script lang="ts">
	import { source } from 'sveltekit-sse';
	import type { PageData } from './$types';
	import { getToastState } from '$lib/toast-state.svelte';
	import type { ProjectPayload } from '$lib/app/events/project.events';
	import type { AppEvent } from '$lib/app/events/event';
	import { SseStore } from '$lib/stores/sse-store.svelte';

	// Access the loaded data using $props
	const { data } = $props<{ data: PageData }>();

	const sseStore = new SseStore<ProjectPayload>({ model: 'project' });

	let title = $state('');
	let description = $state('');
	let titleInput = $state<HTMLInputElement>();

	async function postProjectEvent() {
		console.log('post project event');
		if (title.trim() === '') {
			console.log('missing title');
			return;
		}
		const payload = { title, description };
		const event = {
			model: 'project',
			action: 'add',
			payload
		};
		const response = await fetch('/api/projects', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ event })
		});
		console.log('Post response', response);
		const data = await response.json();
		if (response.ok) {
			console.log('project added:', title);
		} else {
			console.error('Error:', data.error);
		}
	}

	let allProjects = $derived(data.projects.push(sseStore.projects));
</script>

<div>
	<h1>Projects</h1>

	<ul class="project-list">
		{#each allProjects as project}
			<li class="project-item"><a href="/projects/{project.id}">{project.name}</a></li>
		{/each}
	</ul>

	<form
		onsubmit={(e) => {
			e.preventDefault();
			postProjectEvent();
			title = '';
			description = '';
			titleInput?.focus();
		}}
		class="flex w-1/4 flex-col gap-2"
	>
		<div class="flex flex-col gap-1">
			<label for="title">Title</label>
			<input
				class="rounded-md border border-gray-800"
				id="title"
				bind:this={titleInput}
				bind:value={title}
			/>
		</div>

		<div class="flex flex-col gap-1">
			<label for="description">Message</label>
			<input class="rounded-md border border-gray-800" id="description" bind:value={description} />
		</div>
		<button class="rounded-md bg-gray-300 p-1"> Add toast! </button>
	</form>
</div>

<style>
	.project-item {
		background: green;
		color: white;
		font-weight: 400;
	}
</style>
