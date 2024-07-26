<script>
	// src/routes/+page.svelte
	import { source } from 'sveltekit-sse';
	const value = source('/events/time').select('message');
</script>

{$value}
