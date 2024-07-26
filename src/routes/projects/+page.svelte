<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { messageStore } from '$lib/stores/messages';

	export let channelName = 'default';

	let messages: string[] = [];
	let intervalId: any;

	async function fetchMessages() {
		console.log('fetch messages');
		const response = await fetch(`/api/messages?channel=${channelName}`);
		console.log({ response });
		const data = await response.json();
		console.log('data');
		messageStore.set(data.messages);
	}

	onMount(() => {
		fetchMessages();
		intervalId = setInterval(fetchMessages, 5000); // Poll every 5 seconds
	});

	onDestroy(() => {
		if (intervalId) clearInterval(intervalId);
		messageStore.reset();
	});

	messageStore.subscribe((value) => {
		messages = value;
	});
</script>

<div>
	<h2>{channelName} Messages</h2>
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
