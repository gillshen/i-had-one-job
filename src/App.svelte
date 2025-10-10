<script lang="ts">
	import { getCurrentWindow } from '@tauri-apps/api/window';
	import { onMount } from 'svelte';

	import * as Resizable from '$lib/components/ui/resizable/';
	import * as Dialog from '$lib/components/ui/dialog';
	import Button from '$lib/components/ui/button/button.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { FileCheck2, SquarePen, TriangleAlert } from '@lucide/svelte';

	// global state
	import { gs, type Selection as SelectedItem } from '$lib/commands.svelte';

	import CAFrActivityCard from '$lib/components/CAFrActivityCard.svelte';
	import CaFrActivityForm from '$lib/components/CAFrActivityForm.svelte';
	import CaFrHonorCard from '$lib/components/CAFrHonorCard.svelte';
	import CaFrHonorForm from '$lib/components/CAFrHonorForm.svelte';
	import UcActivityCard from '$lib/components/UCActivityCard.svelte';
	import UcActivityForm from '$lib/components/UCActivityForm.svelte';
	import { orderActivityDefault, orderUCActivityByCategory } from '$lib/utils/sorting';

	const formatSelectedItem = (item: SelectedItem): string => {
		const itemType = item.type === 'activity' ? 'Activity' : 'Honor';
		return `${itemType} ${item.index + 1}`;
	};

	$effect(() => {
		const appName = 'Activity List Editor';
		const fileName = gs.filePath.split('\\').pop() || 'Untitled';
		const title = `${fileName}${gs.hasUnsavedChanges ? ' *' : ''} - ${appName}`;
		getCurrentWindow().setTitle(title).then().catch(console.log);
		gs.updateMenuItems();
	});

	onMount(() => {
		let unlisten: (() => void) | null = null;

		// Set up the window close listener
		getCurrentWindow()
			.onCloseRequested(async (event) => {
				if (gs.hasUnsavedChanges) {
					// Prevent the window from closing
					event.preventDefault();
					// Set the pending operation to close and show the dialog
					gs.tryOperation({ op: 'quit' });
				}
			})
			.then((unlistenFn) => {
				unlisten = unlistenFn;
			});

		// Cleanup listener when component is destroyed
		return () => {
			if (unlisten) {
				unlisten();
			}
		};
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
					class="flex size-[140px] flex-col rounded-xl"
					onclick={() => {
						gs.context = 'CA_FRESHMAN';
					}}
				>
					<div>Common App<br />First-Year</div>
				</Button>
				<Button
					variant="outline"
					disabled
					class="flex size-[140px] flex-col rounded-xl"
					onclick={() => {
						gs.context = 'CA_TRANSFER';
					}}
				>
					<div>Common App<br />Transfer</div>
				</Button>
				<Button
					variant="outline"
					class="flex size-[140px] flex-col rounded-xl"
					onclick={() => {
						gs.context = 'UC';
					}}
				>
					<div>University of<br />California</div>
				</Button>
				<Button
					variant="outline"
					disabled
					class="flex size-[140px] flex-col rounded-xl"
					onclick={() => {
						gs.context = 'COALITION';
					}}
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
			<div class="flex h-[calc(100vh-36px)] flex-col overflow-auto p-6">
				{#if gs.context.id === 'CA_FRESHMAN'}
					<h2 class="px-6 pb-2 text-2xl font-bold text-[#0B6DBD]">Honors</h2>
					<div class="flex flex-col gap-1">
						{#each gs.honors as honor, index}
							{#if !gs.previewMode || index < 5}
								<CaFrHonorCard
									{honor}
									previewMode={gs.previewMode}
									isSelected={gs.isSelected({ type: 'honor', index })}
									onclick={() => {
										if (gs.previewMode) return;
										gs.selectHonor(index);
									}}
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
							{/if}
						{/each}
						{#if !gs.previewMode}
							<div class="flex justify-center px-6 py-2 pt-4">
								<Button variant="outline" class="w-32 rounded-full" onclick={gs.newHonor.bind(gs)}
									>Add Honor</Button
								>
							</div>
						{/if}
					</div>

					<Separator class="mt-4 mb-6 w-[calc(100%-48px)]" />

					<h2 class="px-6 pb-2 text-2xl font-bold text-[#0B6DBD]">Activities</h2>
					<div class="flex flex-col gap-1">
						{#each gs.activities as activity, index}
							{#if !gs.previewMode || index < 10}
								<CAFrActivityCard
									{activity}
									previewMode={gs.previewMode}
									isSelected={gs.isSelected({ type: 'activity', index: index })}
									onclick={() => {
										if (gs.previewMode) return;
										gs.selectActivity(index);
									}}
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
							{/if}
						{/each}
						{#if !gs.previewMode}
							<div class="flex justify-center px-6 py-2 pt-4">
								<Button
									variant="outline"
									class="w-32 rounded-full"
									onclick={gs.newActivity.bind(gs)}>Add Activity</Button
								>
							</div>
						{/if}
					</div>
				{:else if gs.context.id === 'UC'}
					<h2 class="px-6 pb-2 text-2xl font-bold">Activities &amp; Awards</h2>
					<div class="flex flex-col gap-1">
						{#each [...gs.activities].sort(gs.previewMode ? orderUCActivityByCategory : orderActivityDefault) as activity, index}
							{#if !gs.previewMode || index < 20}
								<UcActivityCard
									{activity}
									previewMode={gs.previewMode}
									compactMode={gs.compactMode}
									{index}
									isSelected={gs.isSelected({ type: 'activity', index: index })}
									onclick={() => {
										if (gs.previewMode) return;
										gs.selectActivity(index);
									}}
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
							{/if}
						{/each}
						{#if !gs.previewMode}
							<div class="flex justify-center px-6 py-2 pt-4">
								<Button
									variant="outline"
									class="w-48 rounded-full"
									onclick={gs.newActivity.bind(gs)}>Add Activity or Award</Button
								>
							</div>
						{/if}
					</div>
				{/if}
			</div>
			<div class="flex h-[36px] items-center justify-between gap-6 border-t-[1px] px-6 text-xs">
				<div class="flex items-center space-x-2 text-zinc-600">
					{#if gs.hasUnsavedChanges}
						<TriangleAlert class="size-[14px]" /><Label class="text-xs font-normal text-zinc-600"
							>Changes unsaved</Label
						>
					{:else}
						<FileCheck2 class="size-[14px]" /><Label class="text-xs font-normal text-zinc-600"
							>No unsaved changes</Label
						>
					{/if}
				</div>
				<div class="flex items-center gap-4">
					{#if gs.context.id === 'UC'}
						<div class="flex items-center">
							<Switch id="compact-switch" class="cursor-pointer" bind:checked={gs.compactMode} />
							<Label
								for="compact-switch"
								class="cursor-pointer pl-1 text-xs font-normal text-zinc-600">Compact</Label
							>
						</div>
					{/if}
					<div class="flex items-center">
						<Switch id="preview-switch" class="cursor-pointer" bind:checked={gs.previewMode} />
						<Label
							for="preview-switch"
							class="cursor-pointer pl-1 text-xs font-normal text-zinc-600">Preview</Label
						>
					</div>
				</div>
			</div>
		</Resizable.Pane>

		<Resizable.Handle />

		<Resizable.Pane defaultSize={50} class="bg-zinc-50" minSize={1}>
			<!-- editor -->
			<div class="flex max-h-screen flex-col">
				<div class="flex items-center gap-3 border-b-[1px] px-8 py-4 font-semibold">
					<SquarePen class="size-4" />
					<div>
						{gs.context.name}
						{#if gs.selection}
							&bull; {formatSelectedItem(gs.selection)}{/if}
					</div>
				</div>
				{#if gs.previewMode}
					<div class="m-auto p-8 text-sm">
						<button
							class="text-[#1295D8] underline underline-offset-2 hover:cursor-pointer"
							onclick={() => (gs.previewMode = false)}>Exit Preview Mode</button
						> to edit the list
					</div>
				{:else if gs.selection?.type === 'honor'}
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
		<Dialog.Title class="mb-0 text-lg font-semibold">Confirm Deletion</Dialog.Title>
		{#if gs.selection}
			<Dialog.Description class="mb-6 text-sm text-zinc-600">
				Are you sure you want to delete {formatSelectedItem(gs.selection)}? This action cannot be
				undone.
			</Dialog.Description>
		{/if}
		<div class="flex justify-center space-x-4">
			<Button
				type="button"
				variant="outline"
				class="min-w-24 rounded-full"
				onclick={() => (gs.deleteDialog = false)}
			>
				Cancel
			</Button>
			<Button
				type="button"
				variant="destructive"
				class="min-w-24 rounded-full"
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

<Dialog.Root bind:open={gs.askSaveDialog}>
	<Dialog.Content
		class="fixed top-1/2 left-1/2 w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg"
	>
		<Dialog.Title class="mb-0 text-lg font-semibold">You have unsaved changes</Dialog.Title>
		<Dialog.Description class="mb-6 text-sm text-zinc-600">
			Do you want to discard them?
		</Dialog.Description>
		<div class="flex justify-center space-x-4">
			<Button
				type="button"
				variant="outline"
				class="min-w-32 rounded-full"
				onclick={() => {
					gs.askSaveDialog = false;
					// fix inconsistent menu display
					gs.updateMenuItems();
				}}
			>
				No, take me back
			</Button>
			<Button
				type="button"
				variant="destructive"
				class="min-w-32 rounded-full"
				onclick={async () => {
					gs.rollbackChanges();
					gs.askSaveDialog = false;
					await gs.executePendingOperation();
				}}
			>
				Yes, discard them
			</Button>
		</div>
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={gs.errorDialog}>
	<Dialog.Content
		class="fixed top-1/2 left-1/2 w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg"
	>
		<Dialog.Title class="mb-0 text-lg font-semibold">Sorry, an error occurred</Dialog.Title>
		<Dialog.Description class="mb-6 text-sm text-zinc-600">
			{gs.error}
		</Dialog.Description>
		<div class="flex justify-center space-x-4">
			<Button
				type="button"
				variant="secondary"
				class="min-w-24 rounded-full"
				onclick={() => (gs.errorDialog = false)}
			>
				Close
			</Button>
		</div>
	</Dialog.Content>
</Dialog.Root>
