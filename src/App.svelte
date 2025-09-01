<script lang="ts">
	import { onMount } from 'svelte';
	import { getCurrentWindow } from '@tauri-apps/api/window';

	import * as Resizable from '$lib/components/ui/resizable/';
	import * as Dialog from '$lib/components/ui/dialog';
	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	// global state
	import { gs } from '$lib/commands.svelte';

	import CAFrActivityCard from '$lib/components/CAFrActivityCard.svelte';
	import CaFrActivityForm from '$lib/components/CAFrActivityForm.svelte';
	import CaFrHonorCard from '$lib/components/CAFrHonorCard.svelte';
	import { buildMenu } from '$lib/menu';

	$effect(() => {
		const appName = 'Activity List Editor';
		const title = gs.filePath ? `${appName} | ${gs.filePath}` : appName;
		getCurrentWindow().setTitle(title).then().catch(console.log);
	});

	onMount(buildMenu);
</script>

<Resizable.PaneGroup direction="horizontal" class="min-h-screen w-full rounded-xl">
	<Resizable.Pane defaultSize={50} minSize={1}>
		<!-- a list of activities displayed by cards -->
		<div class="flex max-h-screen flex-col overflow-auto p-6">
			{#if gs.honors.length}
				<h2 class="px-6 pb-2 text-2xl font-bold text-[#0B6DBD]">Honors</h2>
				<div class="flex flex-col">
					{#each gs.honors as honor}
						<CaFrHonorCard {honor} />
					{/each}
				</div>
			{/if}
			{#if gs.honors.length && gs.activities.length}
				<Separator class="mt-4 mb-6 w-[calc(100%-48px)]" />
			{/if}
			{#if gs.activities.length && gs.context.id !== 'UC'}
				<h2 class="px-6 pb-2 text-2xl font-bold text-[#0B6DBD]">Activities</h2>
				<div class="flex flex-col">
					{#each gs.activities as activity}
						<CAFrActivityCard {activity} />
					{/each}
				</div>
			{/if}
		</div>
	</Resizable.Pane>

	<Resizable.Handle />

	<Resizable.Pane defaultSize={50} class="bg-zinc-50" minSize={1}>
		<!-- editor -->
		<div class="flex max-h-screen flex-col gap-6 py-6">
			<div class="px-8 font-semibold">{gs.context.name}</div>
			{#if gs.activities.length}
				<CaFrActivityForm bind:activity={gs.activities[0]} />
			{/if}
		</div>
	</Resizable.Pane>
</Resizable.PaneGroup>

<Dialog.Root bind:open={gs.deleteDialog}>
	<Dialog.Content
		class="fixed top-1/2 left-1/2 w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg"
	>
		<Dialog.Title class="mb-4 text-lg font-semibold">Confirm Deletion</Dialog.Title>
		<Dialog.Description class="mb-6 text-sm text-gray-600">
			Are you sure you want to delete this activity? This action cannot be undone.
		</Dialog.Description>
		<div class="flex justify-end space-x-4">
			<Button type="button" variant="outline" onclick={() => (gs.deleteDialog = false)}>
				Cancel
			</Button>
			<Button
				type="button"
				variant="destructive"
				onclick={() => {
					gs.deleteItem();
					gs.deleteDialog = false;
				}}
			>
				Delete
			</Button>
		</div>
	</Dialog.Content>
</Dialog.Root>
