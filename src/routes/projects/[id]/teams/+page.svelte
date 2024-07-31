<script lang="ts">
	import { source } from 'sveltekit-sse';
	import type { PageData } from './$types';
	import type { TeamPayload } from '$lib/app/events/team.events';

	// Access the loaded data using $props
	const { data } = $props<{ data: PageData }>();

	const connection = source('/events/app');
	const channel = connection.select('team');

	const transformed = channel.transform(function run(data) {
		if (data === '') return;
		console.log('transform:', data);
		// TODO: parse json
		return `${data}`;
	});

	$effect(() => {
		if (!data.teams) return;
		// messages = [...messages, ...data.projects];
		teams = [...teams, ...data.teams];
	});

	let teams = $state<TeamPayload[]>([]);
	let messages = $state<string[]>([]);
	let lastMessage = $state<string>('');

	transformed.subscribe((value: string) => {
		if (value) {
			messages = [...messages, value];
			lastMessage = value;
			const json = JSON.parse(value);
			console.log('unpacked', json);
			const { source, model, action, data } = json;
			if (model !== 'team') {
				console.log('not a team event');
				return;
			}
			console.log('event', { source, model, action });
			const team = data;
			// TODO: depending on the event, add, remove or update the project
			teams = [...teams, team];
		}
	});

	let title = $state('');
	let description = $state('');
	let titleInput = $state<HTMLInputElement>();

	async function postTeamEvent() {
		console.log('post team event');
		if (title.trim() === '') {
			console.log('missing title');
			return;
		}
		const payload = { title, description };
		const event = {
			model: 'team',
			action: 'add',
			payload
		};
		const response = await fetch('/api/teams', {
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

	const toastState = getToastState();

	const toastMap = new Map<string, unknown>();

	$effect(() => {
		const message = lastMessage;
		if (!message) return;

		const json = JSON.parse(message);
		const { data } = json;
		if (!data) {
			console.error('missing data', json);
		}
		const { name, description } = data;
		if (!name) {
			console.log('missing name', data);
			return;
		}
		// already processed
		if (toastMap.get(name)) {
			console.log('already made toast for', name);
			return;
		}
		toastMap.set(name, data);
		console.log('toast message', name);
		toastState.add(name, description);
	});
</script>

<div>
	<h1>Project teams</h1>

	<ul class="project-list">
		{#each teams as team}
			<li class="team-item"><a href="/teams/{team.id}">{team.name}</a></li>
		{/each}
	</ul>

	<form
		onsubmit={(e) => {
			e.preventDefault();
			postTeamEvent();
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
	ul {
		list-style-type: none;
		padding: 0;
	}
	li {
		margin-bottom: 10px;
		padding: 5px;
		border: 1px solid #ccc;
		border-radius: 4px;
	}
</style>
