import { open, save } from '@tauri-apps/plugin-dialog';
import { readFile, writeFile } from '@tauri-apps/plugin-fs';
import { type WorkBook, read, write, utils } from 'xlsx';

import type { Activity, Honor } from '$lib/types';

export const getOpenFilePath = async (filter: {
	name: string;
	extensions: string[];
}): Promise<string | null> => {
	// Open a dialog and ask the user to choose a file
	return await open({
		multiple: false,
		directory: false,
		filters: [filter]
	});
};

export const getSaveFilePath = async (filter: {
	name: string;
	extensions: string[];
}): Promise<string | null> => {
	return await save({
		filters: [filter]
	});
};

export const openFile = async (
	filePath: string,
	params: { parser: (wb: WorkBook) => Promise<{ activities: Activity[]; honors: Honor[] }> }
): Promise<{ activities: Activity[]; honors: Honor[] }> => {
	const data = await readFile(filePath);
	const wb = read(data, { type: 'array' });

	if (!wb.SheetNames.length) {
		throw new Error('The workbook contains no sheets.');
	}
	return params.parser(wb);
};

export const saveFile = async (
	filePath: string,
	data: { activities: Activity[]; honors: Honor[] }
): Promise<void> => {
	// Write `Data` to an Excel file with two sheets, "Activities" and "Honors"
	const { activities, honors } = data;

	if (activities.length === 0) {
		throw new Error('No activities to save.');
	}

	let wb: WorkBook;
	if (honors.length === 0) {
		wb = {
			SheetNames: ['Activities'],
			Sheets: {
				Activities: utils.json_to_sheet(activities)
			}
		};
	} else {
		wb = {
			SheetNames: ['Activities', 'Honors'],
			Sheets: {
				Activities: utils.json_to_sheet(activities),
				Honors: utils.json_to_sheet(honors)
			}
		};
	}
	const wbout = write(wb, { bookType: 'xlsx', type: 'array' });
	await writeFile(filePath, new Uint8Array(wbout));
};
