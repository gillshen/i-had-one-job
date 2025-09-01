<script lang="ts">
	import { onMount } from 'svelte';

	// import HelloWorld from '$lib/components/HelloWorld.svelte';
	import { Menu, Submenu, MenuItem, CheckMenuItem, PredefinedMenuItem } from '@tauri-apps/api/menu';

	import * as Resizable from '$lib/components/ui/resizable/';
	import * as Card from '$lib/components/ui/card/';
	import * as Dialog from '$lib/components/ui/dialog';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	import type { Activity, Honor } from '$lib/types';
	import { getOpenFilePath, getSaveFilePath, openFile, saveFile } from '$lib/utils/fs';
	import { APPLICATION_SYSTEMS } from '$lib/applicationSystems';

	let contextKey: 'CA_FRESHMAN' | 'CA_TRANSFER' | 'UC' | 'COALITION' = $state('CA_FRESHMAN');
	let context = $derived(APPLICATION_SYSTEMS[contextKey]);

	let deleteDialogOpen = $state(false);

	let keydown = $state(false); // flag to prevent multiple keydown events

	let filePath = $state('');

	let activities: Activity[] = $state([]);
	let honors: Honor[] = $state([]);

	const handleNewFile = () => {
		// TODO check if there is unsaved data
		// if yes, prompt the user to save
		filePath = '';
		activities = [];
		honors = [];
	};

	const handleOpenFile = async () => {
		filePath = (await getOpenFilePath(context.fileFilter)) ?? '';
		if (!filePath) return;
		try {
			const data = await openFile(filePath, { parser: context.parser });
			activities = data.activities;
			honors = data.honors;
		} catch (e) {
			// TODO handle error properly
			filePath = `error: ${e}`;
		}
	};

	const handleSaveFile = async () => {
		if (!filePath) {
			// if no file is opened, prompt the user to save as
			await handleSaveFileAs();
			return;
		}
		await saveFile(filePath, { activities, honors });
	};

	const handleSaveFileAs = async () => {
		filePath = (await getSaveFilePath(context.fileFilter)) ?? '';
		if (filePath) {
			await handleSaveFile();
		}
	};

	const handleNextActivity = () => {
		// TODO implement next activity functionality
		alert('Next Activity clicked');
	};

	const handlePreviousActivity = () => {
		// TODO implement previous activity functionality
		alert('Previous Activity clicked');
	};

	const handleNewActivity = () => {
		activities = [
			...activities,
			// TODO vary with system
			{
				order: activities.length + 1,
				grade_level: [],
				hours_per_week: null,
				weeks_per_year: null,
				type: '',
				when: [],
				position: '',
				organization: '',
				description: '',
				comments: ''
			}
		];
	};

	const handleDuplicateActivity = () => {
		// TODO implement duplicate activity functionality
		alert('Duplicate Activity clicked');
	};

	const handleMoveActivityUp = () => {
		// TODO implement move activity up functionality
		alert('Move Up clicked');
	};

	const handleMoveActivityDown = () => {
		// TODO implement move activity down functionality
		alert('Move Down clicked');
	};

	const handleDeleteActivity = () => {
		// TODO implement delete activity functionality
		deleteDialogOpen = true;
	};

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
					action: handleNewFile
				}),
				await MenuItem.new({
					id: 'open',
					text: 'Open File...',
					accelerator: 'CmdOrCtrl+O',
					action: handleOpenFile
				}),
				separator,
				await MenuItem.new({
					id: 'save',
					text: 'Save',
					accelerator: 'CmdOrCtrl+S',
					action: handleSaveFile
				}),
				await MenuItem.new({
					id: 'save_as',
					text: 'Save As...',
					accelerator: 'CmdOrCtrl+Shift+S',
					action: handleSaveFileAs
				}),
				separator,
				quit
			]
		});

		const sysMenuItemCAF = await CheckMenuItem.new({
			id: 'caf_check',
			text: 'CA Freshman',
			// accelerator: 'Alt+F',
			action: () => {
				contextKey = 'CA_FRESHMAN';
				sysMenuItemCAF.setChecked(true);
				sysMenuItemCAT.setChecked(false);
				sysMenuItemUC.setChecked(false);
				sysMenuItemCL.setChecked(false);
			},
			checked: contextKey === 'CA_FRESHMAN'
		});
		const sysMenuItemCAT = await CheckMenuItem.new({
			id: 'cat_check',
			text: 'CA Transfer',
			// accelerator: 'Alt+T',
			action: () => {
				contextKey = 'CA_TRANSFER';
				sysMenuItemCAF.setChecked(false);
				sysMenuItemCAT.setChecked(true);
				sysMenuItemUC.setChecked(false);
				sysMenuItemCL.setChecked(false);
			},
			checked: contextKey === 'CA_TRANSFER'
		});
		const sysMenuItemUC = await CheckMenuItem.new({
			id: 'uc_check',
			text: 'UC',
			// accelerator: 'Alt+C',
			action: () => {
				contextKey = 'UC';
				sysMenuItemCAF.setChecked(false);
				sysMenuItemCAT.setChecked(false);
				sysMenuItemUC.setChecked(true);
				sysMenuItemCL.setChecked(false);
			},
			checked: contextKey === 'UC'
		});
		const sysMenuItemCL = await CheckMenuItem.new({
			id: 'cl_check',
			text: 'Coalition',
			// accelerator: 'Alt+L',
			action: () => {
				contextKey = 'COALITION';
				sysMenuItemCAF.setChecked(false);
				sysMenuItemCAT.setChecked(false);
				sysMenuItemUC.setChecked(false);
				sysMenuItemCL.setChecked(true);
			},
			checked: contextKey === 'COALITION',
			enabled: false
		});

		const systemMenu = await Submenu.new({
			text: 'System',
			items: [sysMenuItemCAF, sysMenuItemCAT, sysMenuItemUC, sysMenuItemCL]
		});

		const activityMenu = await Submenu.new({
			text: 'Activity',
			items: [
				await MenuItem.new({
					id: 'next_activity',
					text: 'Next',
					accelerator: 'CmdOrCtrl+Down',
					action: handleNextActivity
				}),
				await MenuItem.new({
					id: 'previous_activity',
					text: 'Previous',
					accelerator: 'CmdOrCtrl+Up',
					action: handlePreviousActivity
				}),
				separator,
				await MenuItem.new({
					id: 'new_activity',
					text: 'New',
					accelerator: 'CmdOrCtrl+Shift+N',
					action: handleNewActivity
				}),
				await MenuItem.new({
					id: 'duplicate_activity',
					text: 'Duplicate',
					accelerator: 'CmdOrCtrl+D',
					action: handleDuplicateActivity
				}),
				separator,
				await MenuItem.new({
					id: 'move_up',
					text: 'Move Up',
					accelerator: 'CmdOrCtrl+Shift+Up',
					action: handleMoveActivityUp
				}),
				await MenuItem.new({
					id: 'move_down',
					text: 'Move Down',
					accelerator: 'CmdOrCtrl+Shift+Down',
					action: handleMoveActivityDown
				}),
				separator,

				await MenuItem.new({
					id: 'delete_activity',
					text: 'Delete...',
					accelerator: 'CmdOrCtrl+Delete',
					action: handleDeleteActivity
				})
			]
		});

		const menu = await Menu.new({
			items: [fileSubmenu, systemMenu, activityMenu]
		});
		await menu.setAsAppMenu();

		// manually bind accelerators as it doesn't work automatically on Windows
		window.addEventListener('keydown', async (e) => {
			if (keydown) return;
			keydown = true;
			if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
				e.preventDefault();
				await handleOpenFile();
			} else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'n') {
				e.preventDefault();
				handleNewActivity();
			} else if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
				e.preventDefault();
				handleNewFile();
			} else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 's') {
				e.preventDefault();
				await handleSaveFileAs();
			} else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
				e.preventDefault();
				await handleSaveFile();
			} else if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
				e.preventDefault();
				handleDuplicateActivity();
			} else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'ArrowUp') {
				e.preventDefault();
				handleMoveActivityUp();
			} else if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowUp') {
				e.preventDefault();
				handlePreviousActivity();
			} else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'ArrowDown') {
				e.preventDefault();
				handleMoveActivityDown();
			} else if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowDown') {
				e.preventDefault();
				handleNextActivity();
			} else if ((e.ctrlKey || e.metaKey) && e.key === 'Delete') {
				e.preventDefault();
				handleDeleteActivity();
			}
			keydown = false;
		});
	});
</script>

<!-- <HelloWorld /> -->

<Resizable.PaneGroup direction="horizontal" class="min-h-screen w-full rounded-xl">
	<Resizable.Pane defaultSize={58} minSize={1}>
		<!-- a list of activities displayed by cards -->
		<div class="flex max-h-screen flex-col gap-4 overflow-auto p-6">
			{#if honors.length}
				<h2 class="px-6 text-xl font-bold text-cyan-800">Honors</h2>
			{/if}
			{#each honors as honor}
				<Card.Root class="border-transparent shadow-none hover:border-indigo-200">
					<Card.Header>
						<Card.Title class="font-bold text-gray-800">{honor.level_of_recognition}</Card.Title>
					</Card.Header>
					<Card.Content class="text-sm text-gray-600">{honor.title}</Card.Content>
				</Card.Root>
			{/each}
			{#if honors.length && activities.length}
				<Separator class="w-[calc(100%-48px)]" />
			{/if}
			{#if activities.length && contextKey !== 'UC'}
				<h2 class="px-6 text-xl font-bold text-cyan-800">Activities</h2>
			{/if}
			{#each activities as activity}
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
		<div class="flex max-h-screen flex-col gap-6 overflow-auto px-8 py-6">
			<div class="font-semibold">Mode: {contextKey}</div>
			<div class="text-sm text-zinc-500">File: {filePath}</div>
			{#if activities.length}
				<form class="flex flex-grow flex-col gap-4">
					<div class="flex flex-col gap-1.5">
						<Label for="title" class="text-sm font-medium">Title</Label>
						<Input
							id="title"
							class="text-sm"
							bind:value={activities[0].organization}
							spellcheck="true"
						/>
					</div>
					<div class="flex flex-col gap-1.5">
						<Label for="description" class="text-sm font-medium">Description</Label>
						<Textarea
							id="description"
							class="bg-white text-sm"
							bind:value={activities[0].description}
							spellcheck="true"
						/>
					</div>
					<div class="flex flex-col gap-1.5">
						<Label for="comments" class="text-sm font-medium">Comments</Label>
						<Textarea
							id="comments"
							class="bg-white text-sm"
							bind:value={activities[0].comments}
							spellcheck="true"
						/>
					</div>
				</form>
			{/if}

			<div class="mt-auto grid grid-cols-3 gap-4">
				<Button type="button" variant="outline" class="w-full">Move Up</Button>
				<Button type="button" variant="outline" class="w-full">Move Down</Button>
				<Button type="button" variant="ghost" onclick={handleOpenFile}>More...</Button>
			</div>
		</div>
	</Resizable.Pane>
</Resizable.PaneGroup>

<Dialog.Root bind:open={deleteDialogOpen}>
	<!-- <Dialog.Overlay class="fixed inset-0 bg-black/50" /> -->
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
			<Button type="button" variant="destructive" onclick={() => (deleteDialogOpen = false)}>
				Delete
			</Button>
		</div>
	</Dialog.Content>
</Dialog.Root>
