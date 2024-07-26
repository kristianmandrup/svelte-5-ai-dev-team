<script lang="ts">
	import { source } from 'sveltekit-sse';

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
</script>

<div>
	<h1>Projects</h1>
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
