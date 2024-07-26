<script lang="ts">
	import type { PageData } from './$types';

	// Access the loaded data using $props
	const { data } = $props<{ data: PageData }>();

	let messages = $state<string[]>([]);
</script>

<div>
	<h1>Project</h1>

	<ul class="project-list">
		<li class="project-item">{data.name}</li>
		<li class="project-item">{data.description}</li>
	</ul>

	<ul class="project-list">
		{#each data.teams as team}
			<li class="project-item"><a href="/teams/{team.id}">{team.name}</a></li>
		{/each}
	</ul>

	<h2>Messages</h2>
	{#if messages.length === 0}
		<p>No messages yet.</p>
	{:else}
		<ul>
			{#each messages as message}
				<li>{message}</li>
			{/each}
		</ul>
	{/if}
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
