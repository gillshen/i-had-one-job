import type { Context, Activity, Honor } from './types';
import { getOpenFilePath, getSaveFilePath, openFile, saveFile } from './utils/fs';
import { APPLICATION_SYSTEMS, newActivity, newHonor } from './applicationSystems';
import type { CheckMenuItem, MenuItem } from '@tauri-apps/api/menu';

export type Selection = {
	type: 'activity' | 'honor';
	index: number;
};

type ContextKey = keyof typeof APPLICATION_SYSTEMS;

type PendingOperation = { op: 'new' } | { op: 'open' } | { op: 'context'; arg: ContextKey } | null;

export class GlobalState {
	private _menuItems: Record<string, MenuItem> = {};
	private _checkMenuItems: Record<string, CheckMenuItem> = {};
	private _context: Context | null = $state(null);
	private _activities: Activity[] = $state([]);
	private _honors: Honor[] = $state([]);
	private _filePath: string = $state('');
	private _selection: Selection | null = $state(null);
	private _deleteDialog: boolean = $state(false);
	private _previewMode: boolean = $state(false);
	private _compactMode: boolean = $state(false); // for UC

	private _pendingOperation: PendingOperation = $state(null);
	private _askSaveDialog: boolean = $state(false);
	private _savedActivities: Activity[] = $state([]);
	private _savedHonors: Honor[] = $state([]);
	private _hasUnsavedChanges = $derived(
		!(
			this.arraysEqual(this.activities, this._savedActivities) &&
			this.arraysEqual(this.honors, this._savedHonors)
		)
	);

	private _error: string = $state('');
	private _errorDialog: boolean = $state(false);

	setMenuItem(id: string, item: MenuItem) {
		this._menuItems[id] = item;
	}

	setCheckMenuItems(id: string, item: CheckMenuItem) {
		this._checkMenuItems[id] = item;
	}

	updateMenuItems() {
		// disable file operations unless context is set
		this._menuItems['new-file']?.setEnabled(!!this.context);
		this._menuItems['open-file']?.setEnabled(!!this.context);
		this._menuItems['save-file']?.setEnabled(!!this.context);
		this._menuItems['save-file-as']?.setEnabled(!!this.context);

		// set the check statuses of system menu items
		this._checkMenuItems['context-caf']?.setChecked(this.context?.id === 'CA_FRESHMAN');
		this._checkMenuItems['context-cat']?.setChecked(this.context?.id === 'CA_TRANSFER');
		this._checkMenuItems['context-uc']?.setChecked(this.context?.id === 'UC');
		this._checkMenuItems['context-cl']?.setChecked(this.context?.id === 'COALITION');

		// set preview/compact mode toggle state
		this._checkMenuItems['preview']?.setChecked(!!this.previewMode);
		this._checkMenuItems['compact']?.setChecked(!!this.compactMode);
		this._checkMenuItems['compact']?.setEnabled(this.context?.id === 'UC');

		// disable next/prev navigation unless there is at least one item
		this._menuItems['next-item']?.setEnabled(!!this.activities.length || !!this.honors.length);
		this._menuItems['prev-item']?.setEnabled(!!this.activities.length || !!this.honors.length);

		// disable creation of new activities unless context is set and not in preview mode
		this._menuItems['new-activity']?.setEnabled(!!this.context && !this.previewMode);
		// disable creation of new honors unless context is common app first-year and not in preview mode
		this._menuItems['new-honor']?.setEnabled(
			this.context?.id === 'CA_FRESHMAN' && !this.previewMode
		);

		// enable moving and deleting items if an item is selected and not in preview mode
		this._menuItems['move-up']?.setEnabled(!!this.selection && !this.previewMode);
		this._menuItems['move-down']?.setEnabled(!!this.selection && !this.previewMode);
		this._menuItems['delete']?.setEnabled(!!this.selection && !this.previewMode);
	}

	get context(): Context | null {
		return this._context;
	}

	set context(key: ContextKey) {
		if (key === this.context?.id) return;
		this.tryOperation({ op: 'context', arg: key }).then().catch(console.error);
	}

	get activities() {
		return this._activities;
	}

	set activities(value: Activity[]) {
		this._activities = value;
	}

	get honors() {
		return this._honors;
	}

	set honors(value: Honor[]) {
		this._honors = value;
	}

	get filePath() {
		return this._filePath;
	}

	set filePath(value: string) {
		this._filePath = value;
	}

	get selection() {
		return this._selection;
	}

	set selection(value: Selection | null) {
		this._selection = value;
	}

	get deleteDialog() {
		return this._deleteDialog;
	}

	set deleteDialog(value: boolean) {
		this._deleteDialog = value;
	}

	get previewMode() {
		return this._previewMode;
	}

	set previewMode(value: boolean) {
		this._previewMode = value;
		if (value) {
			this.clearSelection();
		}
	}

	get compactMode() {
		return this._compactMode;
	}

	set compactMode(value: boolean) {
		this._compactMode = value;
	}

	get askSaveDialog() {
		return this._askSaveDialog;
	}

	set askSaveDialog(value: boolean) {
		this._askSaveDialog = value;
	}

	get hasUnsavedChanges() {
		return this._hasUnsavedChanges;
	}

	get error() {
		return this._error;
	}

	set error(value: string) {
		this._error = value;
	}

	get errorDialog() {
		return this._errorDialog;
	}

	set errorDialog(value: boolean) {
		this._errorDialog = value;
	}

	isSelected(test: Selection | null) {
		return this.selection?.type === test?.type && this.selection?.index === test?.index;
	}

	private async tryOperation(operation: PendingOperation) {
		this._pendingOperation = operation;
		if (this.hasUnsavedChanges) {
			this.askSaveDialog = true;
			return;
		}
		await this.executePendingOperation();
	}

	async executePendingOperation() {
		switch (this._pendingOperation?.op) {
			case 'new':
				this._new();
				break;
			case 'open':
				await this._open();
				break;
			case 'context':
				this._new();
				this._context = APPLICATION_SYSTEMS[this._pendingOperation.arg];
				break;
		}
		this._pendingOperation = null;
	}

	async new() {
		await this.tryOperation({ op: 'new' });
	}

	private _new() {
		this.filePath = '';
		this.activities = [];
		this.honors = [];
		this.updateSnapshots();
		this.clearSelection();
	}

	async open() {
		await this.tryOperation({ op: 'open' });
	}

	private async _open() {
		if (!this.context) return;
		const filePath = (await getOpenFilePath(this.context.fileFilter)) ?? '';
		if (!filePath) return;
		try {
			const data = await openFile(filePath, { parser: this.context.parser });
			this.activities = data.activities;
			this.honors = data.honors;
			this.filePath = filePath;
			this.updateSnapshots();
			this.clearSelection();
		} catch (e) {
			this.error = `${e}`;
			this.errorDialog = true;
		}
	}

	async save() {
		if (!this.context) return;
		if (!this.filePath) {
			// if no file is opened, prompt the user to save as
			await this.saveAs();
			return;
		}
		try {
			await saveFile(
				this.filePath,
				this.context.serialize({ activities: this.activities, honors: this.honors })
			);
			this.updateSnapshots();
		} catch (e: unknown) {
			this.error = `${e}`;
			this.errorDialog = true;
		}
	}

	async saveAs() {
		if (!this.context) return;
		const filePath = (await getSaveFilePath(this.context.fileFilter)) ?? '';
		if (filePath) {
			this.filePath = filePath;
			await this.save();
		}
	}

	newActivity() {
		this.activities = [...this.activities, newActivity(this.activities.length + 1)];
		this.selectActivity(this.activities.length - 1);
	}

	newHonor() {
		if (!this.context || this.context.id !== 'CA_FRESHMAN') return;
		this.honors = [...this.honors, newHonor(this.honors.length + 1)];
		this.selectHonor(this.honors.length - 1);
	}

	clearSelection() {
		this.selection = null;
	}

	selectActivity(index: number) {
		// select the indexd activity or the first/last activity if index out of bound
		if (!this.activities.length) return;
		const safeIndex = Math.max(0, Math.min(index, this.activities.length - 1));
		this.selection = { type: 'activity', index: safeIndex };
	}

	selectHonor(index: number) {
		// select the indexd honor or the first/last honor if index out of bound
		if (!this.honors.length) return;
		const safeIndex = Math.max(0, Math.min(index, this.honors.length - 1));
		this.selection = { type: 'honor', index: safeIndex };
	}

	selectNext() {
		if (!this.selection) {
			// select the first honor if present, or the first activity if present
			if (this.honors.length) {
				this.selectHonor(0);
			} else {
				this.selectActivity(0);
			}
		} else if (this.selection.type === 'activity') {
			// if the current item is an activity, select the next activity if present
			this.selectActivity(this.selection.index + 1);
		} else if (this.selection.index < this.honors.length - 1) {
			// if the current item is an honor, select the next honor if present;
			this.selectHonor(this.selection.index + 1);
		} else {
			// if not, select the first activity if present
			this.selectActivity(0);
		}
	}

	selectPrevious() {
		if (!this.selection) {
			// select the last activity if present, of the last honor if present
			if (this.activities.length) {
				this.selectActivity(this.activities.length - 1);
			} else {
				this.selectHonor(this.honors.length - 1);
			}
		} else if (this.selection.type === 'honor') {
			// if the current item is an honor, select the previous honor if present
			this.selectHonor(this.selection.index - 1);
		} else if (this.selection.index) {
			// if the current item is an activity, select the pervious activity if present;
			this.selectActivity(this.selection.index - 1);
		} else {
			// if not, select the last honor if present
			this.selectHonor(this.honors.length - 1);
		}
	}

	moveItemUp() {
		const selection = this.selection;
		if (!selection || selection.index === 0 || this.previewMode) return;

		const array = selection.type === 'honor' ? [...this.honors] : [...this.activities];
		if (array.length < 2) return;

		// swap items
		[array[selection.index - 1], array[selection.index]] = [
			array[selection.index],
			array[selection.index - 1]
		];
		// update order numbers
		array[selection.index - 1].order = selection.index;
		array[selection.index].order = selection.index + 1;

		if (selection.type === 'honor') {
			this.honors = [...array] as Honor[];
			this.selectHonor(selection.index - 1);
		} else {
			this.activities = [...array] as Activity[];
			this.selectActivity(selection.index - 1);
		}
	}

	moveItemDown() {
		const selection = this.selection;
		if (!selection || this.previewMode) return;

		const array = selection.type === 'honor' ? [...this.honors] : [...this.activities];
		if (selection.index >= array.length - 1) return;

		// swap items
		[array[selection.index], array[selection.index + 1]] = [
			array[selection.index + 1],
			array[selection.index]
		];
		// update order numbers
		array[selection.index].order = selection.index + 1;
		array[selection.index + 1].order = selection.index + 2;

		if (selection.type === 'honor') {
			this.honors = [...array] as Honor[];
			this.selectHonor(selection.index + 1);
		} else {
			this.activities = [...array] as Activity[];
			this.selectActivity(selection.index + 1);
		}
	}

	deleteSelected() {
		if (!this.selection || this.previewMode) return;

		const index = this.selection.index;
		if (this.selection.type === 'honor') {
			const head = this.honors.slice(0, index);
			const tail = this.honors.slice(index + 1).map((h) => ({ ...h, order: h.order - 1 }));
			this.honors = [...head.concat(tail)];
		} else {
			const head = this.activities.slice(0, index);
			const tail = this.activities.slice(index + 1).map((a) => ({ ...a, order: a.order - 1 }));
			this.activities = [...head.concat(tail)];
		}
		this.selection = null;
	}

	arraysEqual(a: Record<string, unknown>[], b: Record<string, unknown>[]): boolean {
		if (a.length !== b.length) return false;
		return a.every((item, index) => {
			const otherItem = b[index];
			// Get all unique keys from both objects
			const allKeys = new Set([...Object.keys(item), ...Object.keys(otherItem)]);
			// Check that every key has the same value in both objects
			return Array.from(allKeys).every(
				(key) => JSON.stringify(item[key]) === JSON.stringify(otherItem[key])
			);
		});
	}

	private deepCopy<T>(obj: T): T {
		if (obj === null || typeof obj !== 'object') {
			return obj;
		}
		if (obj instanceof Set) {
			return new Set(Array.from(obj)) as T;
		}
		if (Array.isArray(obj)) {
			return obj.map((item) => this.deepCopy(item)) as T;
		}
		const copy = {} as T;
		Object.keys(obj).forEach((key) => {
			copy[key as keyof T] = this.deepCopy(obj[key as keyof T]);
		});
		return copy;
	}

	private updateSnapshots() {
		this._savedActivities = this.deepCopy(this.activities);
		this._savedHonors = this.deepCopy(this.honors);
	}

	rollbackChanges() {
		this.activities = this.deepCopy(this._savedActivities);
		this.honors = this.deepCopy(this._savedHonors);
	}
}

export const gs = new GlobalState();
