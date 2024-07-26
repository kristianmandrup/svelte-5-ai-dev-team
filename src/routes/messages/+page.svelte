<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	let newMessage = '';
	let channelName = 'default';
	let messages = writable<string[]>([]);

	async function fetchMessages() {
		console.log('fetch messages', channelName);
		const response = await fetch(`/api/messages?channel=${channelName}`);
		console.log({ response });
		const data = await response.json();
		messages.set(data.messages);
	}

	async function postMessage() {
		console.log('post message');
		if (newMessage.trim() === '') {
			console.log('empty message');
			return;
		}
		const response = await fetch('/api/messages', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ message: newMessage })
		});
		console.log('Post response', response);
		const data = await response.json();
		if (response.ok) {
			console.log('Message added:', data.message);
			newMessage = '';
			fetchMessages(); // Refresh messages
		} else {
			console.error('Error:', data.error);
		}
	}

	onMount(() => {
		fetchMessages();
	});
</script>

<div>
	<h2>{channelName} Messages</h2>

	<div class="form-container">
		<input type="text" bind:value={newMessage} placeholder="Enter new message" />
		<button on:click={postMessage} class="rounded-md bg-gray-300 p-1">Post Message</button>
	</div>

	<div class="messages-container">
		{#if $messages.length === 0}
			<p>No messages yet.</p>
		{:else}
			<ul>
				{#each $messages as message}
					<li>{message}</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>

<style>
	.form-container {
		margin-bottom: 1rem;
	}

	button {
		margin: 1px solid;
	}

	.messages-container {
		margin-top: 1rem;
		border: 1px solid #ccc;
		padding: 1rem;
	}
</style>
