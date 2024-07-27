<script lang="ts">
	import { dndzone, type Options, type DndEvent } from 'svelte-dnd-action';
	import { writable } from 'svelte/store';

	// Define the type for our items
	interface DndItem {
		id: number;
		content: string;
	}

	// Example items to be dragged and dropped
	const items = writable<DndItem[]>([
		{ id: 1, content: 'Item 1' },
		{ id: 2, content: 'Item 2' },
		{ id: 3, content: 'Item 3' }
	]);

	// Function to handle the reordering of items
	function handleReorder(event: CustomEvent<DndEvent<DndItem>>) {
		const [from, to] = event.detail.items;
		items.update((items) => {
			const item = items.splice(from.id - 1, 1)[0];
			items.splice(to.id - 1, 0, item);
			return items;
		});
	}
</script>

<div
	use:dndzone={{ items: $items, flipDurationMs: 200 } as Options<DndItem>}
	on:consider={handleReorder}
>
	{#each $items as item (item.id)}
		<div class="dnd-item">{item.content}</div>
	{/each}
</div>

<style>
	.dnd-item {
		padding: 16px;
		border: 1px solid #ccc;
		border-radius: 4px;
		background-color: #f9f9f9;
		cursor: grab;
	}
</style>
