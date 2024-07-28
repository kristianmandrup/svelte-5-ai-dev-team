<script>
	import { enhance, applyAction } from '$app/forms';
	import ContactsTable from '$lib/components/ContactsTable.svelte';
	import Alert from '../../lib/components/Alert.svelte';

	export let data;
	export let form;
</script>

<div class="w-full">
	<div class="flex w-full items-center justify-between">
		<h2 class="text-center text-3xl font-bold tracking-tight text-gray-900">Contact Manager</h2>
	</div>
	<form
		method="POST"
		action="?/create"
		class="flex w-full flex-col"
		use:enhance={() => {
			// Before form submission to server
			return async ({ result, update }) => {
				// After form submission to server
				if (result.type === 'success') {
					form.reset();
				}
				if (result.type === 'failure') {
					await applyAction(result);
				}
				update();
			};
		}}
	>
		<div class="form-control w-full max-w-xs">
			<label for="name" class="label">
				<span class="label-text">Name</span>
			</label>

			<input
				type="text"
				name="name"
				value={form?.name ?? ''}
				class="input input-primary input-bordered w-full max-w-xs"
			/>
		</div>
		<div class="form-control w-full max-w-xs">
			<label for="email" class="label">
				<span class="label-text">Email</span>
			</label>
			<input
				type="email"
				name="email"
				value={form?.email ?? ''}
				class="input input-primary input-bordered w-full max-w-xs"
			/>
		</div>
		<div class="form-control w-full max-w-xs">
			<label for="company" class="label">
				<span class="label-text">Company</span>
			</label>

			<input
				type="text"
				name="company"
				value={form?.company ?? ''}
				class="input input-primary input-bordered w-full max-w-xs"
			/>
		</div>
		<div class="form-control w-full max-w-xs">
			<label for="job" class="label">
				<span class="label-text">Job</span>
			</label>

			<input
				type="text"
				name="job"
				value={form?.job ?? ''}
				class="input input-primary input-bordered w-full max-w-xs"
			/>
		</div>
		<button class="btn btn-primary mt-4 w-full max-w-xs">Add</button>
		{#if form?.error}
			<Alert message={form?.message} />
		{/if}
	</form>

	<ContactsTable contacts={data?.contacts} />
</div>
