import { type WorkBook, utils } from 'xlsx';
import type {
	Context,
	Activity,
	RawActivity,
	Honor,
	RawHonor,
	UCWorkHour,
	UCActivityCategory,
	SerializedCAFrActivity,
	SerializedCATrData,
	SerializedCAFrData,
	SerializedUCActivity,
	SerializedUCData,
	GeneralData
} from './types';
import {
	castAsGradeLevel,
	castAsParticipationTiming,
	castAsRecognitionLevel,
	castAsString,
	isEmptyCell,
	rowStartsWithNumber,
	stripLeadingEmptyCells
} from './utils/sheets';
import {
	orderGradeLevels,
	orderRecognitionLevels,
	orderRecognitionTypes,
	orderTimings
} from './utils/sorting';
import { exportCAFrWorkbook, exportCATrWorkbook, exportUCWorkbook } from './utils/export';

const parseGradeLevel = <T extends { grade_level: string }>(
	item: T
): Omit<T, 'grade_level'> & { grade_level: Set<string> } => {
	return {
		...item,
		grade_level: new Set(
			item.grade_level
				?.toString()
				?.split(/,\s*|\s+/)
				.map((grade) => grade.toLowerCase().trim())
				.filter((grade) => grade.match(/^(9|10|11|12|pg)$/))
				.filter(Boolean) ?? []
		)
	};
};

const serializeGradeLevel = <T extends { grade_level: Set<string> }>(
	item: T
): Omit<T, 'grade_level'> & { grade_level: string } => {
	return {
		...item,
		grade_level: Array.from(item.grade_level).sort(orderGradeLevels).join(', ')
	};
};

const parseRecLevel = <T extends { level_of_recognition: string }>(
	item: T
): Omit<T, 'level_of_recognition'> & { level_of_recognition: Set<string> } => {
	return {
		...item,
		level_of_recognition: new Set(
			item.level_of_recognition
				?.split(/,\s*/)
				.map((recLevel) => recLevel.toLowerCase().trim())
				.filter(Boolean) ?? []
		)
	};
};

const parseRecType = <T extends { type_of_recognition: string }>(
	item: T
): Omit<T, 'type_of_recognition'> & { type_of_recognition: Set<string> } => {
	return {
		...item,
		type_of_recognition: new Set(
			item.type_of_recognition
				?.split(/,\s*/)
				.map((recType) => recType.toLowerCase().trim())
				.filter(Boolean) ?? []
		)
	};
};

const serializeRecLevel = <T extends { level_of_recognition: Set<string> }>(
	item: T
): Omit<T, 'level_of_recognition'> & { level_of_recognition: string } => {
	return {
		...item,
		level_of_recognition: Array.from(item.level_of_recognition)
			.sort(orderRecognitionLevels)
			.join(', ')
	};
};

const parseUCWorkHours = <T extends { work_hours: string }>(
	item: T
): Omit<T, 'work_hours'> & { work_hours: UCWorkHour[] } => {
	return {
		...item,
		work_hours:
			item.work_hours
				?.replace(/\s/, '')
				.split('|')
				.map((entry) => {
					const [grade, school, summer] = entry.split(',');
					return { grade, school, summer };
				}) ?? []
	};
};

const serializeUCWorkHours = <T extends { work_hours: UCWorkHour[] }>(
	item: T
): Omit<T, 'work_hours'> & { work_hours: string } => {
	return {
		...item,
		work_hours: item.work_hours
			.map(({ grade, school, summer }) => `${grade},${school},${summer}`)
			.join('|')
	};
};

const parseWorkbook = async (wb: WorkBook): Promise<GeneralData> => {
	// find the sheet named "Activities" (case insensitive); otherwise throw an error
	const activitiesSheetName = wb.SheetNames.find((name) => name.toLowerCase() === 'activities');
	if (!activitiesSheetName) {
		throw new Error('No sheet named "Activities" found.');
	}
	const activitiesSheet = wb.Sheets[activitiesSheetName];
	const rawActivities = utils.sheet_to_json(activitiesSheet) as RawActivity[];
	const activities = rawActivities
		.map(parseGradeLevel)
		.map(parseRecLevel)
		.map(parseRecType)
		.map(parseUCWorkHours)
		.map((a) => ({
			// supply default fields to prevent rendering errors
			...newActivity(a.order),
			...a,
			// parse Common App timing of pariticipation
			when: new Set(
				a.when
					?.split(/,\s*/)
					.filter(Boolean)
					.map((timing: string) => timing.toLowerCase()) ?? []
			)
		}));

	// find the sheet named "Honors" (case insensitive); otherwise make `honors` an empty array
	let honors: Honor[] = [];
	const honorsSheetName = wb.SheetNames.find((name) => name.toLowerCase() === 'honors');
	if (honorsSheetName) {
		const honorsSheet = wb.Sheets[honorsSheetName];
		const rawHonors = utils.sheet_to_json(honorsSheet) as RawHonor[];
		honors = rawHonors.map(parseGradeLevel).map(parseRecLevel);
	}

	return { activities, honors };
};

const serializeCAFrWorkbook = (data: GeneralData): SerializedCAFrData => {
	const serializedActivities = data.activities.map(serializeGradeLevel).map((a) => ({
		order: a.order,
		type: a.type,
		grade_level: a.grade_level,
		when: Array.from(a.when).sort(orderTimings).join(', '),
		hours_per_week: a.hours_per_week,
		weeks_per_year: a.weeks_per_year,
		position: a.position,
		organization: a.organization,
		description: a.description,
		continue_in_college: a.continue_in_college,
		comments: a.comments
	})) as SerializedCAFrActivity[];
	console.table(serializedActivities);

	const serializedHonors = data.honors
		.map(serializeGradeLevel)
		.map(serializeRecLevel)
		.map((h) => ({
			order: h.order,
			title: h.title,
			grade_level: h.grade_level,
			level_of_recognition: h.level_of_recognition,
			comments: h.comments
		}));
	console.table(serializedHonors);

	return { activities: serializedActivities, honors: serializedHonors };
};

const serializeCATrWorkbook = (data: GeneralData): SerializedCATrData => {
	console.log(data); // TODO
	const serializedActivities = data.activities.map((a) => ({
		order: a.order,
		type: a.type,
		organization: a.organization,
		country: a.country,
		job_start_date: a.job_start_date,
		job_is_continuing: a.job_is_continuing,
		job_end_date: a.job_end_date,
		job_status: a.job_status,
		name: a.name,
		type_of_recognition: Array.from(a.type_of_recognition).sort(orderRecognitionTypes).join(', '),
		description: a.description,
		comments: a.comments
	}));
	const serializedHonors = data.honors.map((h) => ({
		order: h.order,
		title: h.title,
		type: h.type,
		org: h.org,
		date: h.date,
		description: h.description,
		comments: h.comments
	}));
	return { activities: serializedActivities, honors: serializedHonors };
};

const serializeUCWorkbook = (data: GeneralData): SerializedUCData => {
	const serializedActivities = data.activities
		.map(serializeGradeLevel)
		.map(serializeRecLevel)
		.map(serializeUCWorkHours)
		.map((a) => ({
			order: a.order,
			uc_category: a.uc_category,
			grade_level: a.grade_level,
			hours_per_week: a.hours_per_week,
			weeks_per_year: a.weeks_per_year,
			name: a.name,
			program_description: a.program_description,
			description: a.description,
			award_type: a.award_type,
			award_req: a.award_req,
			level_of_recognition: a.level_of_recognition,
			job_title: a.job_title,
			work_hours: a.work_hours,
			job_is_continuing: a.job_is_continuing,
			job_start_date: a.job_start_date,
			job_end_date: a.job_is_continuing === 'TRUE' ? '' : a.job_end_date,
			comments: a.comments
		})) as SerializedUCActivity[];
	return { activities: serializedActivities, honors: [] };
};

const importCAFrWorkbook = async (wb: WorkBook): Promise<GeneralData> => {
	const result = { activities: [] as Activity[], honors: [] as Honor[] };

	// find the first sheet of the workbook
	const sheet = wb.Sheets[wb.SheetNames[0]];

	// find all the rows that start with numbers in the first column
	const rows = utils.sheet_to_json(sheet, { header: 1 }) as unknown[][];
	const usefulRows = rows.map(stripLeadingEmptyCells).filter(rowStartsWithNumber) as unknown[][];

	let reading: 'activities' | 'honors' | null = null;

	for (const row of usefulRows) {
		if (row[0] === 1 || (typeof row[0] === 'string' && row[0].trim() === '1')) {
			if (reading === null) {
				reading = 'activities';
			} else if (reading === 'activities') {
				reading = 'honors';
			}
		}
		if (reading === null) continue;

		// if the row has no content other than the order, skip this row
		if (row.slice(1, 9).every((cell) => isEmptyCell(cell))) {
			continue;
		}

		if (reading === 'activities') {
			// parse the row as an activity
			// assumes the columns have the following order:
			// order, grade_level, hours_per_week, weeks_per_year, type, when, position, organization, description
			const order = result.activities.length + 1;
			const activity = newActivity(order);
			result.activities.push({
				...activity,
				grade_level: castAsGradeLevel(row[1]),
				hours_per_week: castAsString(row[2]),
				weeks_per_year: castAsString(row[3]),
				type: castAsString(row[4]),
				when: castAsParticipationTiming(row[5]),
				position: castAsString(row[6]),
				organization: castAsString(row[7]),
				description: castAsString(row[8])
			});
		} else if (reading === 'honors') {
			// parse the row as an honor
			// assumes the columns have the following order:
			// order, grade_level, blank, blank, level_of_recognition, blank, blank, title,
			const order = result.honors.length + 1;
			const honor = newHonor(order);
			result.honors.push({
				...honor,
				grade_level: castAsGradeLevel(row[1]),
				level_of_recognition: castAsRecognitionLevel(row[4], 'caf'),
				title: castAsString(row[7], 'TODO')
			});
		}
	}

	return result;
};

const importUCWorkbook = async (wb: WorkBook): Promise<GeneralData> => {
	const result = { activities: [] as Activity[], honors: [] as Honor[] };

	// find the first sheet of the workbook
	const sheet = wb.Sheets[wb.SheetNames[0]];

	// find all the rows that start with numbers in the first column
	const rows = utils.sheet_to_json(sheet, { header: 1 }) as unknown[][];
	const usefulRows = rows.map(stripLeadingEmptyCells).filter(rowStartsWithNumber) as unknown[][];

	let ucCategory: UCActivityCategory = '';

	for (const row of usefulRows) {
		if (row[0] === 1 || (typeof row[0] === 'string' && row[0].trim() === '1')) {
			switch (ucCategory) {
				case '':
					ucCategory = 'award';
					break;
				case 'award':
					ucCategory = 'edu-prep';
					break;
				case 'edu-prep':
					ucCategory = 'ec';
					break;
				case 'ec':
					ucCategory = 'course';
					break;
				case 'course':
					ucCategory = 'volunteer';
					break;
				case 'volunteer':
					ucCategory = 'work';
					break;
				default:
					continue;
			}
		}

		// if the row has no content other than the order, skip this row
		if (row.slice(1, 10).every((cell) => isEmptyCell(cell))) {
			continue;
		}

		const order = result.activities.length + 1;
		const activity = { ...newActivity(order), uc_category: ucCategory };
		switch (ucCategory) {
			case '':
				continue;
			case 'award':
				// assumes the columns have the following order:
				// order, name, blank, blank, award_req, blank, blank, description, blank, level of recognition
				result.activities.push({
					...activity,
					name: castAsString(row[1]),
					award_req: castAsString(row[4]),
					description: castAsString(row[7]),
					level_of_recognition: castAsRecognitionLevel(row[9], 'uc')
				});
				break;
			case 'edu-prep':
			case 'course':
				// assumes the columns have the following order:
				// order, name, blank, blank, program_description, blank, blank, grade_level, hours_per_week, weeks_per_year
				result.activities.push({
					...activity,
					name: castAsString(row[1]),
					program_description: castAsString(row[4]),
					grade_level: castAsGradeLevel(row[7]),
					hours_per_week: castAsString(row[8]),
					weeks_per_year: castAsString(row[9])
				});
				break;
			case 'ec':
				// assumes the columns have the following order:
				// order, name, blank, blank, description, blank, blank, grade_level, hours_per_week, weeks_per_year
				result.activities.push({
					...activity,
					name: castAsString(row[1]),
					description: castAsString(row[4]),
					grade_level: castAsGradeLevel(row[7]),
					hours_per_week: castAsString(row[8]),
					weeks_per_year: castAsString(row[9])
				});
				break;
			case 'volunteer':
				// assumes the columns have the following order:
				// order, name, blank, blank, program_description, blank, description, grade_level, hours_per_week, weeks_per_year
				result.activities.push({
					...activity,
					name: castAsString(row[1]),
					program_description: castAsString(row[4]),
					description: castAsString(row[6]),
					grade_level: castAsGradeLevel(row[7]),
					hours_per_week: castAsString(row[8]),
					weeks_per_year: castAsString(row[9])
				});
				break;
			case 'work':
				// assumes the columns have the following order:
				// order, job_title, name, program_description, blank, description
				result.activities.push({
					...activity,
					job_title: castAsString(row[1]),
					name: castAsString(row[2]),
					program_description: castAsString(row[3]),
					description: castAsString(row[5])
				});
				break;
			default:
				console.error('Unknown UC category:', ucCategory, row);
		}
	}

	return result;
};

const importCATrWorkbook = async (wb: WorkBook): Promise<GeneralData> => {
	console.log(wb); // TODO
	return { activities: [], honors: [] };
};

export const newActivity = (order: number): Activity => {
	return {
		// common and CA fields
		order,
		grade_level: new Set(),
		hours_per_week: '',
		weeks_per_year: '',
		type: '',
		when: new Set(),
		position: '',
		organization: '',
		description: '',
		continue_in_college: 'FALSE',
		comments: '',
		// uc fields
		uc_category: '',
		name: '',
		program_description: '',
		level_of_recognition: new Set(),
		award_type: 'academic',
		award_req: '',
		job_title: '',
		work_hours: [],
		job_is_continuing: 'FALSE',
		job_start_date: '',
		job_end_date: '',
		// ca transfer fields
		country: '',
		job_status: '',
		type_of_recognition: new Set()
	};
};

export const newHonor = (order: number): Honor => {
	return {
		order,
		title: '',
		comments: '',
		grade_level: new Set(),
		level_of_recognition: new Set(),
		type: '',
		org: '',
		date: '',
		description: ''
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
		parser: parseWorkbook,
		importer: importCAFrWorkbook,
		serialize: serializeCAFrWorkbook,
		exportAsExcel: exportCAFrWorkbook
	},
	CA_TRANSFER: {
		id: 'CA_TRANSFER',
		name: 'Common App Transfer',
		fileFilter: {
			name: 'CA Transfer List',
			extensions: ['cat.xlsx', 'cat.xls']
		},
		honors: {
			maxEntries: 1000
		},
		activities: {
			maxEntries: 1000
		},
		parser: parseWorkbook,
		importer: importCATrWorkbook,
		serialize: serializeCATrWorkbook,
		exportAsExcel: exportCATrWorkbook
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
		parser: parseWorkbook,
		importer: importUCWorkbook,
		serialize: serializeUCWorkbook,
		exportAsExcel: exportUCWorkbook
	}
};
