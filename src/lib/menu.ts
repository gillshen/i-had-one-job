import { Menu, Submenu, MenuItem, CheckMenuItem, PredefinedMenuItem } from '@tauri-apps/api/menu';
import type { GlobalState } from '$lib/commands.svelte';

export const buildMenu = async (gs: GlobalState) => {
	const separator = await PredefinedMenuItem.new({
		item: 'Separator'
	});
	const quit = await PredefinedMenuItem.new({
		text: 'Quit',
		item: 'Quit'
	});

	const newFile = await MenuItem.new({
		id: 'new',
		text: 'New File',
		accelerator: 'CmdOrCtrl+N',
		action: gs.new.bind(gs)
	});
	gs.setMenuItem('new-file', newFile);

	const openFile = await MenuItem.new({
		id: 'open',
		text: 'Open File...',
		accelerator: 'CmdOrCtrl+O',
		action: gs.open.bind(gs)
	});
	gs.setMenuItem('open-file', openFile);

	const saveFile = await MenuItem.new({
		id: 'save',
		text: 'Save',
		accelerator: 'CmdOrCtrl+S',
		action: gs.save.bind(gs)
	});
	gs.setMenuItem('save-file', saveFile);

	const saveFileAs = await MenuItem.new({
		id: 'save_as',
		text: 'Save As...',
		accelerator: 'CmdOrCtrl+Shift+S',
		action: gs.saveAs.bind(gs)
	});
	gs.setMenuItem('save-file-as', saveFileAs);

	const fileSubmenu = await Submenu.new({
		text: 'File',
		items: [newFile, openFile, separator, saveFile, saveFileAs, separator, quit]
	});

	const contextCAF = await CheckMenuItem.new({
		id: 'caf_check',
		text: 'CA First-Year',
		action: () => (gs.context = 'CA_FRESHMAN')
	});
	gs.setCheckMenuItems('context-caf', contextCAF);

	const contextCAT = await CheckMenuItem.new({
		id: 'cat_check',
		text: 'CA Transfer',
		action: () => (gs.context = 'CA_TRANSFER'),
		enabled: false
	});
	gs.setCheckMenuItems('context-cat', contextCAT);

	const contextUC = await CheckMenuItem.new({
		id: 'uc_check',
		text: 'UC',
		action: () => (gs.context = 'UC')
	});
	gs.setCheckMenuItems('context-uc', contextUC);

	const contextCL = await CheckMenuItem.new({
		id: 'cl_check',
		text: 'Coalition',
		action: () => (gs.context = 'COALITION'),
		enabled: false
	});
	gs.setCheckMenuItems('context-cl', contextCL);

	const systemMenu = await Submenu.new({
		text: 'System',
		items: [contextCAF, contextCAT, contextUC, contextCL]
	});

	const nextItem = await MenuItem.new({
		id: 'next_item',
		text: 'Next',
		accelerator: 'CmdOrCtrl+Down',
		action: gs.selectNext.bind(gs)
	});
	gs.setMenuItem('next-item', nextItem);

	const prevItem = await MenuItem.new({
		id: 'previous_item',
		text: 'Previous',
		accelerator: 'CmdOrCtrl+Up',
		action: gs.selectPrevious.bind(gs)
	});
	gs.setMenuItem('prev-item', prevItem);

	const newActivity = await MenuItem.new({
		id: 'new_activity',
		text: 'Add Activity',
		accelerator: 'CmdOrCtrl+Shift+A',
		action: gs.newActivity.bind(gs)
	});
	gs.setMenuItem('new-activity', newActivity);

	const newHonor = await MenuItem.new({
		id: 'new_honor',
		text: 'Add Honor',
		accelerator: 'CmdOrCtrl+Shift+H',
		action: gs.newHonor.bind(gs)
	});
	gs.setMenuItem('new-honor', newHonor);

	const moveUp = await MenuItem.new({
		id: 'move_up',
		text: 'Move Up',
		accelerator: 'CmdOrCtrl+Shift+Up',
		action: gs.moveItemUp.bind(gs)
	});
	gs.setMenuItem('move-up', moveUp);

	const moveDown = await MenuItem.new({
		id: 'move_down',
		text: 'Move Down',
		accelerator: 'CmdOrCtrl+Shift+Down',
		action: gs.moveItemDown.bind(gs)
	});
	gs.setMenuItem('move-down', moveDown);

	const deleteSelected = await MenuItem.new({
		id: 'delete_selected',
		text: 'Delete...',
		accelerator: 'CmdOrCtrl+Delete',
		action: () => {
			if (gs.selection) gs.deleteDialog = true;
		}
	});
	gs.setMenuItem('delete', deleteSelected);

	const activityMenu = await Submenu.new({
		text: 'Items',
		items: [
			nextItem,
			prevItem,
			separator,
			newActivity,
			newHonor,
			separator,
			moveUp,
			moveDown,
			separator,
			deleteSelected
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
		} else if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
			e.preventDefault();
			await gs.new();
		} else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
			e.preventDefault();
			gs.newActivity();
		} else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'h') {
			e.preventDefault();
			gs.newHonor();
		} else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 's') {
			e.preventDefault();
			await gs.saveAs();
		} else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
			e.preventDefault();
			await gs.save();
		} else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'ArrowUp') {
			e.preventDefault();
			if (gs.selection) {
				gs.moveItemUp();
			}
		} else if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowUp') {
			e.preventDefault();
			gs.selectPrevious();
		} else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'ArrowDown') {
			e.preventDefault();
			if (gs.selection) {
				gs.moveItemDown();
			}
		} else if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowDown') {
			e.preventDefault();
			gs.selectNext();
		} else if ((e.ctrlKey || e.metaKey) && e.key === 'Delete') {
			e.preventDefault();
			if (gs.selection) {
				gs.deleteDialog = true;
			}
		} else if (e.key === 'Escape') {
			gs.clearSelection();
		}
	});
};
