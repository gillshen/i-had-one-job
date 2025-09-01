import { type WorkBook, utils } from 'xlsx';
import type { Activity, RawActivity, Honor, Context, RawHonor } from './types';
import { orderGradeLevels, orderRecognitions, orderTimings } from './utils/sorting';

const parseCAFrWorkbook = async (
	wb: WorkBook
): Promise<{ activities: Activity[]; honors: Honor[] }> => {
	// find the sheet named "Activities" (case insensitive); otherwise throw an error
	const activitiesSheetName = wb.SheetNames.find((name) => name.toLowerCase() === 'activities');
	if (!activitiesSheetName) {
		throw new Error('No sheet named "Activities" found.');
	}
	const activitiesSheet = wb.Sheets[activitiesSheetName];
	const rawActivities = utils.sheet_to_json(activitiesSheet) as RawActivity[];
	const activities = rawActivities.map((a) => ({
		...a,
		grade_level: new Set(a.grade_level.toString()?.split(/,\s*|\s+/) ?? []),
		when: new Set(a.when.split(/,\s*/).map((timing: string) => timing.toLowerCase()) ?? [])
	}));

	// find the sheet named "Honors" (case insensitive); otherwise make `honors` an empty array
	let honors: Honor[] = [];
	const honorsSheetName = wb.SheetNames.find((name) => name.toLowerCase() === 'honors');
	if (honorsSheetName) {
		const honorsSheet = wb.Sheets[honorsSheetName];
		const rawHonors = utils.sheet_to_json(honorsSheet) as RawHonor[];
		honors = rawHonors.map((h) => ({
			...h,
			grade_level: new Set(h.grade_level.toString()?.split(/,\s*|\s+/) ?? []),
			level_of_recognition: new Set(
				h.level_of_recognition.split(/,\s*/).map((lvl: string) => lvl.toLowerCase()) ?? []
			)
		}));
	}

	return { activities, honors };
};

export const serializeCAFrWorkbook = (data: {
	activities: Activity[];
	honors: Honor[];
}): { activities: RawActivity[]; honors: RawHonor[] } => {
	const rawActivities = data.activities.map((a) => ({
		...a,
		grade_level: Array.from(a.grade_level).sort(orderGradeLevels).join(', '),
		when: Array.from(a.when).sort(orderTimings).join(', ')
	})) as RawActivity[];
	console.table(rawActivities);

	const rawHonors = data.honors.map((h) => ({
		...h,
		grade_level: Array.from(h.grade_level).sort(orderGradeLevels).join(', '),
		level_of_recognition: Array.from(h.level_of_recognition).sort(orderRecognitions).join(', ')
	}));
	console.table(rawHonors);

	return { activities: rawActivities, honors: rawHonors };
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
		grade_level: new Set(),
		hours_per_week: null,
		weeks_per_year: null,
		type: '',
		when: new Set(),
		position: 'TODO',
		organization: 'TODO',
		description: '',
		comments: ''
	};
};

export const newHonor = (order: number): Honor => {
	return {
		order,
		grade_level: new Set(),
		title: 'TODO',
		level_of_recognition: new Set(),
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
