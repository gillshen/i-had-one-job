import type { Context, Activity, Honor } from './types';
import {
	APPLICATION_SYSTEMS,
	newActivity,
	newHonor,
	serializeCAFrWorkbook
} from './applicationSystems';
import { getOpenFilePath, getSaveFilePath, openFile, saveFile } from './utils/fs';

class GlobalState {
	private _context: Context = $state(APPLICATION_SYSTEMS['CA_FRESHMAN']);
	private _activities: Activity[] = $state([]);
	private _honors: Honor[] = $state([]);
	private _filePath: string = $state('');
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

	get deleteDialog() {
		return this._deleteDialog;
	}

	set deleteDialog(value: boolean) {
		this._deleteDialog = value;
	}

	new() {
		// TODO check if there is unsaved data
		// if yes, prompt the user to save
		this.filePath = '';
		this.activities = [];
		this.honors = [];
	}

	async open() {
		const filePath = (await getOpenFilePath(this.context.fileFilter)) ?? '';
		if (!filePath) return;
		try {
			const data = await openFile(filePath, { parser: this.context.parser });
			this.activities = data.activities;
			this.honors = data.honors;
			this.filePath = filePath;
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
	}

	newHonor() {
		this.honors = [
			...this.honors,
			// TODO vary with context?
			newHonor(this.honors.length + 1)
		];
	}

	duplicateItem() {
		alert('Duplicate Activity');
	}

	gotoNext() {
		alert('Next');
	}

	gotoPrevious() {
		alert('Previous');
	}

	moveItemUp() {
		alert('Move Up');
	}

	moveItemDown() {
		alert('Move Down');
	}

	deleteItem() {
		alert('Delete Activity');
	}
}

export const gs = new GlobalState();
