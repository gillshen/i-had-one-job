<script lang="ts">
	import { onMount } from 'svelte';
	import { Menu, Submenu, MenuItem, CheckMenuItem, PredefinedMenuItem } from '@tauri-apps/api/menu';

	import * as Resizable from '$lib/components/ui/resizable/';
	import * as Card from '$lib/components/ui/card/';
	import * as Dialog from '$lib/components/ui/dialog';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	import { gs } from '$lib/commands.svelte';
	// const gs = new GlobalState();

	let deleteDialogOpen = $state(false);

	onMount(async () => {
		const separator = await PredefinedMenuItem.new({
			item: 'Separator'
		});
		const quit = await PredefinedMenuItem.new({
			text: 'Quit',
			item: 'Quit'
		});

		const fileSubmenu = await Submenu.new({
			text: 'File',
			items: [
				await MenuItem.new({
					id: 'new',
					text: 'New File',
					accelerator: 'CmdOrCtrl+N',
					action: gs.new.bind(gs)
				}),
				await MenuItem.new({
					id: 'open',
					text: 'Open File...',
					accelerator: 'CmdOrCtrl+O',
					action: gs.open.bind(gs)
				}),
				separator,
				await MenuItem.new({
					id: 'save',
					text: 'Save',
					accelerator: 'CmdOrCtrl+S',
					action: gs.save.bind(gs)
				}),
				await MenuItem.new({
					id: 'save_as',
					text: 'Save As...',
					accelerator: 'CmdOrCtrl+Shift+S',
					action: gs.saveAs.bind(gs)
				}),
				separator,
				quit
			]
		});

		const sysMenuItemCAF = await CheckMenuItem.new({
			id: 'caf_check',
			text: 'CA Freshman',
			action: () => {
				gs.context = 'CA_FRESHMAN';
				sysMenuItemCAF.setChecked(true);
				sysMenuItemCAT.setChecked(false);
				sysMenuItemUC.setChecked(false);
				sysMenuItemCL.setChecked(false);
			},
			checked: gs.context.id === 'CA_FRESHMAN'
		});
		const sysMenuItemCAT = await CheckMenuItem.new({
			id: 'cat_check',
			text: 'CA Transfer',
			action: () => {
				gs.context = 'CA_TRANSFER';
				sysMenuItemCAF.setChecked(false);
				sysMenuItemCAT.setChecked(true);
				sysMenuItemUC.setChecked(false);
				sysMenuItemCL.setChecked(false);
			},
			checked: gs.context.id === 'CA_TRANSFER',
			enabled: false
		});
		const sysMenuItemUC = await CheckMenuItem.new({
			id: 'uc_check',
			text: 'UC',
			action: () => {
				gs.context = 'UC';
				sysMenuItemCAF.setChecked(false);
				sysMenuItemCAT.setChecked(false);
				sysMenuItemUC.setChecked(true);
				sysMenuItemCL.setChecked(false);
			},
			checked: gs.context.id === 'UC',
			enabled: false
		});
		const sysMenuItemCL = await CheckMenuItem.new({
			id: 'cl_check',
			text: 'Coalition',
			action: () => {
				gs.context = 'COALITION';
				sysMenuItemCAF.setChecked(false);
				sysMenuItemCAT.setChecked(false);
				sysMenuItemUC.setChecked(false);
				sysMenuItemCL.setChecked(true);
			},
			checked: gs.context.id === 'COALITION',
			enabled: false
		});

		const systemMenu = await Submenu.new({
			text: 'System',
			items: [sysMenuItemCAF, sysMenuItemCAT, sysMenuItemUC, sysMenuItemCL]
		});

		const activityMenu = await Submenu.new({
			text: 'Items',
			items: [
				await MenuItem.new({
					id: 'next_item',
					text: 'Next',
					accelerator: 'CmdOrCtrl+Down',
					action: gs.gotoNext.bind(gs)
				}),
				await MenuItem.new({
					id: 'previous_item',
					text: 'Previous',
					accelerator: 'CmdOrCtrl+Up',
					action: gs.gotoPrevious.bind(gs)
				}),
				separator,
				await MenuItem.new({
					id: 'new_activity',
					text: 'New Activity',
					accelerator: 'CmdOrCtrl+Shift+N',
					action: gs.newActivity.bind(gs)
				}),
				await MenuItem.new({
					id: 'new_honor',
					text: 'New Honor',
					accelerator: 'CmdOrCtrl+Shift+H',
					action: gs.newHonor.bind(gs)
				}),
				await MenuItem.new({
					id: 'duplicate_activity',
					text: 'Duplicate',
					accelerator: 'CmdOrCtrl+D',
					action: gs.duplicateItem.bind(gs)
				}),
				separator,
				await MenuItem.new({
					id: 'move_up',
					text: 'Move Up',
					accelerator: 'CmdOrCtrl+Shift+Up',
					action: gs.moveItemUp.bind(gs)
				}),
				await MenuItem.new({
					id: 'move_down',
					text: 'Move Down',
					accelerator: 'CmdOrCtrl+Shift+Down',
					action: gs.moveItemDown.bind(gs)
				}),
				separator,

				await MenuItem.new({
					id: 'delete_activity',
					text: 'Delete...',
					accelerator: 'CmdOrCtrl+Delete',
					action: () => (deleteDialogOpen = true)
				})
			]
		});

		const menu = await Menu.new({
			items: [fileSubmenu, systemMenu, activityMenu]
		});
		await menu.setAsAppMenu();

		// manually bind accelerators as it doesn't work automatically on Windows
		window.addEventListener('keydown', async (e) => {
			if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
				e.preventDefault();
				await gs.open();
			} else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'n') {
				e.preventDefault();
				gs.newActivity();
			} else if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
				e.preventDefault();
				gs.new();
			} else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'h') {
				e.preventDefault();
				gs.newHonor();
			} else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 's') {
				e.preventDefault();
				await gs.saveAs();
			} else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
				e.preventDefault();
				await gs.save();
			} else if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
				e.preventDefault();
				gs.duplicateItem();
			} else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'ArrowUp') {
				e.preventDefault();
				gs.moveItemUp();
			} else if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowUp') {
				e.preventDefault();
				gs.gotoPrevious();
			} else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'ArrowDown') {
				e.preventDefault();
				gs.moveItemDown();
			} else if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowDown') {
				e.preventDefault();
				gs.gotoNext();
			} else if ((e.ctrlKey || e.metaKey) && e.key === 'Delete') {
				e.preventDefault();
				deleteDialogOpen = true;
			}
		});
	});
</script>

<Resizable.PaneGroup direction="horizontal" class="min-h-screen w-full rounded-xl">
	<Resizable.Pane defaultSize={58} minSize={1}>
		<!-- a list of activities displayed by cards -->
		<div class="flex max-h-screen flex-col gap-4 overflow-auto p-6">
			{#if gs.honors.length}
				<h2 class="px-6 text-xl font-bold text-cyan-800">Honors</h2>
			{/if}
			{#each gs.honors as honor}
				<Card.Root class="border-transparent shadow-none hover:border-indigo-200">
					<Card.Header>
						<Card.Title class="font-bold text-gray-800">{honor.level_of_recognition}</Card.Title>
					</Card.Header>
					<Card.Content class="text-sm text-gray-600">{honor.title}</Card.Content>
				</Card.Root>
			{/each}
			{#if gs.honors.length && gs.activities.length}
				<Separator class="w-[calc(100%-48px)]" />
			{/if}
			{#if gs.activities.length && gs.context.id !== 'UC'}
				<h2 class="px-6 text-xl font-bold text-cyan-800">Activities</h2>
			{/if}
			{#each gs.activities as activity}
				<Card.Root class="border-transparent shadow-none hover:border-indigo-200">
					<Card.Header>
						<Card.Title class="font-bold text-gray-800">{activity.organization}</Card.Title>
					</Card.Header>
					<Card.Content class="text-sm text-gray-600">{activity.description}</Card.Content>
				</Card.Root>
			{/each}
		</div>
	</Resizable.Pane>

	<Resizable.Handle />

	<Resizable.Pane defaultSize={42} class="bg-zinc-50" minSize={1}>
		<!-- editor -->
		<div class="flex max-h-screen flex-col gap-6 py-6">
			<div class="px-8 font-semibold">{gs.context.name}</div>
			<div class="px-8 text-sm text-zinc-500">File: {gs.filePath}</div>
			{#if gs.activities.length}
				<form class="flex flex-grow flex-col gap-4 overflow-auto px-8 py-4">
					<div class="flex flex-col gap-1.5">
						<Label for="title" class="text-sm font-medium">Title</Label>
						<Input
							id="title"
							class="text-sm"
							bind:value={gs.activities[0].organization}
							spellcheck="true"
						/>
					</div>
					<div class="flex flex-col gap-1.5">
						<Label for="description" class="text-sm font-medium">Description</Label>
						<Textarea
							id="description"
							class="bg-white text-sm"
							bind:value={gs.activities[0].description}
							spellcheck="true"
						/>
					</div>
					<div class="flex flex-col gap-1.5">
						<Label for="comments" class="text-sm font-medium">Comments</Label>
						<Textarea
							id="comments"
							class="bg-white text-sm"
							bind:value={gs.activities[0].comments}
							spellcheck="true"
						/>
					</div>
				</form>
			{/if}
		</div>
	</Resizable.Pane>
</Resizable.PaneGroup>

<Dialog.Root bind:open={deleteDialogOpen}>
	<Dialog.Content
		class="fixed top-1/2 left-1/2 w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg"
	>
		<Dialog.Title class="mb-4 text-lg font-semibold">Confirm Deletion</Dialog.Title>
		<Dialog.Description class="mb-6 text-sm text-gray-600">
			Are you sure you want to delete this activity? This action cannot be undone.
		</Dialog.Description>
		<div class="flex justify-end space-x-4">
			<Button type="button" variant="outline" onclick={() => (deleteDialogOpen = false)}>
				Cancel
			</Button>
			<Button
				type="button"
				variant="destructive"
				onclick={() => {
					gs.deleteItem();
					deleteDialogOpen = false;
				}}
			>
				Delete
			</Button>
		</div>
	</Dialog.Content>
</Dialog.Root>
