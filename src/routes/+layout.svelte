<script lang="ts">
	import { setToastState } from '$lib/toast-state.svelte';
	import type { Snippet } from 'svelte';
	import Toaster from '$lib/components/toaster.svelte';
	import Nav from '$lib/components/nav.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';

	let { children }: { children: Snippet } = $props();

	setToastState();
</script>

<ModeWatcher />
<Toaster />
<Nav />

<main class="p-4">
	{@render children()}
</main>
