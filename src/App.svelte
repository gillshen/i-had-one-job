<script lang="ts">
	import { getCurrentWindow } from '@tauri-apps/api/window';

	import * as Resizable from '$lib/components/ui/resizable/';
	import * as Dialog from '$lib/components/ui/dialog';
	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	// global state
	import { gs, type Selection as SelectedItem } from '$lib/commands.svelte';

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
		gs.updateMenuItems();
	});
</script>

{#if !gs.context}
	<div class="flex min-h-screen w-full">
		<div class="m-auto flex flex-col items-center p-6 pb-12">
			<h2 class="text-lg font-semibold">Select an application system to start</h2>
			<div class="text-sm text-zinc-600">You can switch between systems at any point</div>
			<div class="mx-auto mt-12 flex flex-wrap content-center justify-center-safe gap-12 p-4">
				<Button
					variant="outline"
					class="flex size-[120px] flex-col rounded-xl"
					onclick={() => (gs.context = 'CA_FRESHMAN')}
				>
					<div>Common App<br />First-Year</div>
				</Button>
				<Button
					variant="outline"
					disabled
					class="flex size-[120px] flex-col rounded-xl"
					onclick={() => (gs.context = 'CA_TRANSFER')}
				>
					<div>Common App<br />Transfer</div>
				</Button>
				<Button
					variant="outline"
					class="flex size-[120px] flex-col rounded-xl"
					onclick={() => (gs.context = 'UC')}
				>
					<div>University of<br />California</div>
				</Button>
				<Button
					variant="outline"
					disabled
					class="flex size-[120px] flex-col rounded-xl"
					onclick={() => (gs.context = 'COALITION')}
				>
					<div>Coalition</div>
				</Button>
			</div>
		</div>
	</div>
{:else}
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
{/if}

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
