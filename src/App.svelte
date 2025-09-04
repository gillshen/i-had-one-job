<script lang="ts">
	import { onMount } from 'svelte';
	import { getCurrentWindow } from '@tauri-apps/api/window';

	import * as Resizable from '$lib/components/ui/resizable/';
	import * as Dialog from '$lib/components/ui/dialog';
	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	// global state
	import { gs, type Selection as SelectedItem } from '$lib/commands.svelte';
	import { buildMenu } from '$lib/menu';

	import CAFrActivityCard from '$lib/components/CAFrActivityCard.svelte';
	import CaFrActivityForm from '$lib/components/CAFrActivityForm.svelte';
	import CaFrHonorCard from '$lib/components/CAFrHonorCard.svelte';
	import CaFrHonorForm from '$lib/components/CAFrHonorForm.svelte';
	import UcActivityCard from '$lib/components/UCActivityCard.svelte';
	import UcActivityForm from '$lib/components/UCActivityForm.svelte';

	const formatSelectedItem = (item: SelectedItem): string => {
		const itemType = item.type === 'activity' ? 'Activity' : 'Honor';
		return `${itemType} ${item.index + 1}`;
	};

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
				<div class="flex flex-col gap-1">
					{#each gs.honors as honor, index}
						<CaFrHonorCard
							{honor}
							isSelected={gs.isSelected({ type: 'honor', index })}
							onclick={() => gs.selectHonor(index)}
							onMoveUp={() => {
								gs.selectHonor(index);
								gs.moveItemUp();
							}}
							onMoveDown={() => {
								gs.selectHonor(index);
								gs.moveItemDown();
							}}
							onDelete={() => {
								gs.selectHonor(index);
								gs.deleteDialog = true;
							}}
						/>
					{/each}
				</div>
			{/if}

			{#if gs.honors.length && gs.activities.length}
				<Separator class="mt-4 mb-6 w-[calc(100%-48px)]" />
			{/if}

			{#if gs.activities.length && gs.context.id !== 'UC'}
				<h2 class="px-6 pb-2 text-2xl font-bold text-[#0B6DBD]">Activities</h2>
				<div class="flex flex-col gap-1">
					{#each gs.activities as activity, index}
						<CAFrActivityCard
							{activity}
							isSelected={gs.isSelected({ type: 'activity', index: index })}
							onclick={() => gs.selectActivity(index)}
							onMoveUp={() => {
								gs.selectActivity(index);
								gs.moveItemUp();
							}}
							onMoveDown={() => {
								gs.selectActivity(index);
								gs.moveItemDown();
							}}
							onDelete={() => {
								gs.selectActivity(index);
								gs.deleteDialog = true;
							}}
						/>
					{/each}
				</div>
			{:else if gs.activities.length}
				<h2 class="px-6 pb-2 text-2xl font-bold">Activities &amp; Awards</h2>
				<div class="flex flex-col gap-1">
					{#each gs.activities as activity, index}
						<UcActivityCard
							{activity}
							{index}
							isSelected={gs.isSelected({ type: 'activity', index: index })}
							onclick={() => gs.selectActivity(index)}
							onMoveUp={() => {
								gs.selectActivity(index);
								gs.moveItemUp();
							}}
							onMoveDown={() => {
								gs.selectActivity(index);
								gs.moveItemDown();
							}}
							onDelete={() => {
								gs.selectActivity(index);
								gs.deleteDialog = true;
							}}
						/>
					{/each}
				</div>
			{/if}
		</div>
	</Resizable.Pane>

	<Resizable.Handle />

	<Resizable.Pane defaultSize={50} class="bg-zinc-50" minSize={1}>
		<!-- editor -->
		<div class="flex max-h-screen flex-col gap-6 py-6">
			<div class="px-8 font-semibold">
				{gs.context.name}
				{#if gs.selection}
					&bull; {formatSelectedItem(gs.selection)}{/if}
			</div>
			{#if gs.selection?.type === 'honor'}
				<CaFrHonorForm bind:honor={gs.honors[gs.selection.index]} />
			{:else if gs.selection?.type === 'activity'}
				{#if gs.context.id === 'CA_FRESHMAN'}
					<CaFrActivityForm bind:activity={gs.activities[gs.selection.index]} />
				{:else if gs.context.id === 'UC'}
					<UcActivityForm bind:activity={gs.activities[gs.selection.index]} />
				{/if}
			{/if}
		</div>
	</Resizable.Pane>
</Resizable.PaneGroup>

<Dialog.Root bind:open={gs.deleteDialog}>
	<Dialog.Content
		class="fixed top-1/2 left-1/2 w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg"
	>
		<Dialog.Title class="mb-4 text-lg font-semibold">Confirm Deletion</Dialog.Title>
		{#if gs.selection}
			<Dialog.Description class="mb-6 text-sm text-zinc-600">
				Are you sure you want to delete {formatSelectedItem(gs.selection)}? This action cannot be
				undone.
			</Dialog.Description>
		{/if}
		<div class="flex justify-end space-x-4">
			<Button type="button" variant="outline" onclick={() => (gs.deleteDialog = false)}>
				Cancel
			</Button>
			<Button
				type="button"
				variant="destructive"
				onclick={() => {
					gs.deleteSelected();
					gs.deleteDialog = false;
				}}
			>
				Delete
			</Button>
		</div>
	</Dialog.Content>
</Dialog.Root>
