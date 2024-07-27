<script lang="ts">
	import { source } from 'sveltekit-sse';
	import type { PageData } from './$types';

	// Access the loaded data using $props
	const { data } = $props<{ data: PageData }>();

	const connection = source('/events/app');
	const channel = connection.select('project');

	const transformed = channel.transform(function run(data) {
		if (data === '') return;
		console.log('transform:', data);
		// TODO: parse json
		return `${data}`;
	});

	$effect(() => {
		if (!data) return;
		messages = [...messages, ...data];
		projects = [...projects, ...data];
	});

	let projects = $state<ProjectPayload[]>([]);
	let messages = $state<string[]>([]);
	let lastMessage = $state<string>('');

	transformed.subscribe((value: string) => {
		if (value) {
			messages = [...messages, value];
			lastMessage = value;
			const project = JSON.parse(value).payload;
			projects = [...projects, project];
		}
	});

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

	import { getToastState } from '$lib/toast-state.svelte';
	import type { ProjectPayload } from '$lib/app/events/project.events';

	const toastState = getToastState();

	const toastMap = new Map<string, unknown>();

	$effect(() => {
		const message = lastMessage;
		if (!message) return;

		const json = JSON.parse(message);
		const { payload } = json;
		const { name, description } = payload;
		if (!name) {
			console.log('missing name', payload);
			return;
		}
		// already processed
		if (toastMap.get(name)) {
			console.log('already made toast for', name);
			return;
		}
		toastMap.set(name, payload);
		console.log('toast message', name);
		toastState.add(name, description);
	});
</script>

<div>
	<h1>Projects</h1>

	<ul class="project-list">
		{#each projects as project}
			<li class="project-item"><a href="/projects/{project.name}">{project.name}</a></li>
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
