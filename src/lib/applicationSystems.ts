import { type WorkBook, utils } from 'xlsx';
import type { Activity, Context, Honor } from './types';

const parseCAFrWorkbook = async (
	wb: WorkBook
): Promise<{ activities: Activity[]; honors: Honor[] }> => {
	// find the sheet named "Activities" (case insensitive); otherwise throw an error
	const activitiesSheetName = wb.SheetNames.find((name) => name.toLowerCase() === 'activities');
	if (!activitiesSheetName) {
		throw new Error('No sheet named "Activities" found.');
	}
	const activitiesSheet = wb.Sheets[activitiesSheetName];
	const activities = utils.sheet_to_json(activitiesSheet) as Activity[];

	// find the sheet named "Honors" (case insensitive); otherwise make `honors` an empty array
	let honors: Honor[] = [];
	const honorsSheetName = wb.SheetNames.find((name) => name.toLowerCase() === 'honors');
	if (honorsSheetName) {
		const honorsSheet = wb.Sheets[honorsSheetName];
		honors = utils.sheet_to_json(honorsSheet);
	}

	return { activities, honors };
};

const parseCATrWorkbook = async (
	wb: WorkBook
): Promise<{ activities: Activity[]; honors: Honor[] }> => {
	// TODO
	console.log(wb);
	return { activities: [], honors: [] };
};

const parseUCWorkbook = async (
	wb: WorkBook
): Promise<{ activities: Activity[]; honors: Honor[] }> => {
	// TODO
	console.log(wb);
	return { activities: [], honors: [] };
};

export const newActivity = (order: number): Activity => {
	return {
		order,
		grade_level: [],
		hours_per_week: null,
		weeks_per_year: null,
		type: '',
		when: [],
		position: '',
		organization: 'TODO',
		description: '',
		comments: ''
	};
};

export const newHonor = (order: number): Honor => {
	return {
		order,
		grade_level: [],
		title: 'TODO',
		level_of_recognition: [],
		comments: ''
	};
};

export const APPLICATION_SYSTEMS: Record<string, Context> = {
	CA_FRESHMAN: {
		id: 'CA_FRESHMAN',
		name: 'Common App First-Year',
		fileFilter: {
			name: 'CA Freshman List',
			extensions: ['caf.xlsx', 'caf.xls']
		},
		honors: {
			maxEntries: 5
		},
		activities: {
			maxEntries: 10
		},
		parser: parseCAFrWorkbook
	},
	CA_TRANSFER: {
		id: 'CA_TRANSFER',
		name: 'Common App Transfer',
		fileFilter: {
			name: 'CA Transfer List',
			extensions: ['cat.xlsx', 'cat.xls']
		},
		honors: {
			maxEntries: -1
		},
		activities: {
			maxEntries: -1
		},
		parser: parseCATrWorkbook
	},
	UC: {
		id: 'UC',
		name: 'University of California',
		fileFilter: {
			name: 'UC List',
			extensions: ['uc.xlsx', 'uc.xls']
		},
		activities: {
			maxEntries: 20
		},
		parser: parseUCWorkbook
	}
};
