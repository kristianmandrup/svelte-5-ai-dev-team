<script lang="ts">
	import { source } from 'sveltekit-sse';
	import type { PageData } from './$types';

	// Access the loaded data using $props
	const { data } = $props<{ data: PageData }>();

	const connection = source('/events/app');
	const channel = connection.select('project');

	const transformed = channel.transform(function run(data) {
		if (data === '') return;
		// TODO: parse json
		return `transformed: ${data}`;
	});

	let messages = $state<string[]>([]);

	transformed.subscribe((value: string) => {
		if (value) {
			messages = [...messages, value];
		}
	});

	let title = $state('');
	let description = $state('');
	let titleInput = $state<HTMLInputElement>();

	async function postMessage() {
		console.log('post message');
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
</script>

<div>
	<h1>Projects</h1>

	<ul class="project-list">
		{#each data.projects as project}
			<li class="project-item"><a href="/projects/{project.id}">{project.name}</a></li>
		{/each}
	</ul>

	<form
		onsubmit={(e) => {
			e.preventDefault();
			postMessage();
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

	<h2>Messages</h2>
	{#if messages.length === 0}
		<p>No messages yet.</p>
	{:else}
		<ul>
			{#each messages as message}
				<li>message: {message}</li>
			{/each}
		</ul>
	{/if}
</div>
