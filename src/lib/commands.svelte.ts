import type { Context, Activity, Honor } from './types';
import {
	APPLICATION_SYSTEMS,
	newActivity,
	newHonor,
	serializeCAFrWorkbook
} from './applicationSystems';
import { getOpenFilePath, getSaveFilePath, openFile, saveFile } from './utils/fs';

type ItemType = 'activity' | 'honor';

export type Selection = {
	type: ItemType;
	index: number;
};

class GlobalState {
	private _context: Context = $state(APPLICATION_SYSTEMS['CA_FRESHMAN']);
	private _activities: Activity[] = $state([]);
	private _honors: Honor[] = $state([]);
	private _filePath: string = $state('');
	private _selection: Selection | null = $state(null);
	private _deleteDialog: boolean = $state(false);

	get context(): Context {
		return this._context;
	}

	set context(key: keyof typeof APPLICATION_SYSTEMS) {
		this._context = APPLICATION_SYSTEMS[key];
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

	isSelected(test: Selection | null) {
		return this.selection?.type === test?.type && this.selection?.index === test?.index;
	}

	new() {
		// TODO check if there is unsaved data
		// if yes, prompt the user to save
		this.filePath = '';
		this.activities = [];
		this.honors = [];
		this.selection = null;
	}

	async open() {
		const filePath = (await getOpenFilePath(this.context.fileFilter)) ?? '';
		if (!filePath) return;
		try {
			const data = await openFile(filePath, { parser: this.context.parser });
			this.activities = data.activities;
			this.honors = data.honors;
			this.filePath = filePath;
			this.selection = null;
		} catch (e) {
			// TODO handle error properly
			this.filePath = `error: ${e}`;
		}
	}

	async save() {
		if (!this.filePath) {
			// if no file is opened, prompt the user to save as
			await this.saveAs();
			return;
		}
		await saveFile(
			this.filePath,
			serializeCAFrWorkbook({ activities: this.activities, honors: this.honors })
		);
	}

	async saveAs() {
		const filePath = (await getSaveFilePath(this.context.fileFilter)) ?? '';
		if (filePath) {
			this.filePath = filePath;
			await this.save();
		}
	}

	newActivity() {
		this.activities = [
			...this.activities,
			// TODO vary with context?
			newActivity(this.activities.length + 1)
		];
		this.selection = { type: 'activity', index: this.activities.length - 1 };
	}

	newHonor() {
		this.honors = [
			...this.honors,
			// TODO vary with context?
			newHonor(this.honors.length + 1)
		];
		this.selection = { type: 'honor', index: this.honors.length - 1 };
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
		console.log(this.selection);
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

	moveItemUp(selection: Selection) {
		console.log(selection);
		alert(`Move ${selection.type} ${selection.index + 1} up`);
	}

	moveItemDown(selection: Selection) {
		console.log(selection);
		alert(`Move ${selection.type} ${selection.index + 1} down`);
	}

	deleteSelected() {
		if (!this.selection) return;

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
}

export const gs = new GlobalState();
