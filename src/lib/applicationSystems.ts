import { type WorkBook, utils } from 'xlsx';
import type {
	Activity,
	RawActivity,
	Honor,
	Context,
	RawHonor,
	SerializedCAFrActivity,
	SerializedUCActivity,
	UCWorkHour
} from './types';
import { orderGradeLevels, orderRecognitions, orderTimings } from './utils/sorting';

const parseGradeLevel = <T extends { grade_level: string }>(
	item: T
): Omit<T, 'grade_level'> & { grade_level: Set<string> } => {
	return {
		...item,
		grade_level: new Set(
			item.grade_level
				.toString()
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
				.map((lvl) => lvl.toLowerCase().trim())
				.filter(Boolean) ?? []
		)
	};
};

const serializeRecLevel = <T extends { level_of_recognition: Set<string> }>(
	item: T
): Omit<T, 'level_of_recognition'> & { level_of_recognition: string } => {
	return {
		...item,
		level_of_recognition: Array.from(item.level_of_recognition).sort(orderRecognitions).join(', ')
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
					return {
						grade,
						school: isNaN(Number(school)) ? null : Number(school),
						summer: isNaN(Number(summer)) ? null : Number(summer)
					};
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

const parseWorkbook = async (
	wb: WorkBook
): Promise<{ activities: Activity[]; honors: Honor[] }> => {
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

const serializeCAFrWorkbook = (data: {
	activities: Activity[];
	honors: Honor[];
}): { activities: SerializedCAFrActivity[]; honors: RawHonor[] } => {
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

	const serializedHonors = data.honors.map(serializeGradeLevel).map(serializeRecLevel);
	console.table(serializedHonors);

	return { activities: serializedActivities, honors: serializedHonors };
};

// TODO
const serializeCATrWorkbook = (data: {
	activities: Activity[];
	honors: Honor[];
}): { activities: RawActivity[]; honors: RawHonor[] } => {
	console.log(data);
	return { activities: [], honors: [] };
};

const serializeUCWorkbook = (data: {
	activities: Activity[];
	honors: Honor[];
}): { activities: SerializedUCActivity[]; honors: [] } => {
	console.log(data);
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

export const newActivity = (order: number): Activity => {
	return {
		// common and CA fields
		order,
		grade_level: new Set(),
		hours_per_week: '',
		weeks_per_year: '',
		type: '',
		when: new Set(),
		position: 'TODO',
		organization: 'TODO',
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
		job_end_date: ''
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
		parser: parseWorkbook,
		serialize: serializeCAFrWorkbook
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
		parser: parseWorkbook,
		serialize: serializeCATrWorkbook
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
		serialize: serializeUCWorkbook
	}
};
