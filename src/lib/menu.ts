import { Menu, Submenu, MenuItem, CheckMenuItem, PredefinedMenuItem } from '@tauri-apps/api/menu';
import { gs } from './commands.svelte';

export const buildMenu = async () => {
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
		text: 'CA First-Year',
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
				action: gs.selectNext.bind(gs)
			}),
			await MenuItem.new({
				id: 'previous_item',
				text: 'Previous',
				accelerator: 'CmdOrCtrl+Up',
				action: gs.selectPrevious.bind(gs)
			}),
			separator,
			await MenuItem.new({
				id: 'new_activity',
				text: 'New Activity',
				accelerator: 'CmdOrCtrl+Shift+A',
				action: gs.newActivity.bind(gs)
			}),
			await MenuItem.new({
				id: 'new_honor',
				text: 'New Honor',
				accelerator: 'CmdOrCtrl+Shift+H',
				action: gs.newHonor.bind(gs)
			}),
			separator,
			await MenuItem.new({
				id: 'move_up',
				text: 'Move Up',
				accelerator: 'CmdOrCtrl+Shift+Up',
				action: () => {
					if (gs.selection) gs.moveItemUp(gs.selection);
				}
			}),
			await MenuItem.new({
				id: 'move_down',
				text: 'Move Down',
				accelerator: 'CmdOrCtrl+Shift+Down',
				action: () => {
					if (gs.selection) gs.moveItemDown(gs.selection);
				}
			}),
			separator,

			await MenuItem.new({
				id: 'delete_activity',
				text: 'Delete...',
				accelerator: 'CmdOrCtrl+Delete',
				action: () => {
					if (gs.selection) gs.deleteDialog = true;
				}
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
		} else if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
			e.preventDefault();
			gs.new();
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
				gs.moveItemUp(gs.selection);
			}
		} else if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowUp') {
			e.preventDefault();
			gs.selectPrevious();
		} else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'ArrowDown') {
			e.preventDefault();
			if (gs.selection) {
				gs.moveItemDown(gs.selection);
			}
		} else if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowDown') {
			e.preventDefault();
			gs.selectNext();
		} else if ((e.ctrlKey || e.metaKey) && e.key === 'Delete') {
			e.preventDefault();
			if (gs.selection) {
				gs.deleteDialog = true;
			}
		}
	});
};
