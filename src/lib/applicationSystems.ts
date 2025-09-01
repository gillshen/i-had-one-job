import { type WorkBook, utils } from 'xlsx';
import type { Activity, Honor } from './types';

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

export const newActivity = (order: number): Activity => {
	return {
		order,
		grade_level: [],
		hours_per_week: null,
		weeks_per_year: null,
		type: '',
		when: [],
		position: '',
		organization: '',
		description: '',
		comments: ''
	};
};

export const newHonor = (order: number): Honor => {
	return {
		order,
		grade_level: [],
		title: '',
		level_of_recognition: [],
		comments: ''
	};
};

export const APPLICATION_SYSTEMS = {
	CA_FRESHMAN: {
		id: 'caf',
		name: 'Common App Freshman',
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
		id: 'cat',
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
		}
	},
	UC: {
		id: 'uc',
		name: 'University of California',
		fileFilter: {
			name: 'UC List',
			extensions: ['uc.xlsx', 'uc.xls']
		},
		activities: {
			maxEntries: 20
		}
	}
};
