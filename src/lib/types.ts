import type { WorkBook } from 'xlsx';

type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};

type CAFrActivity = {
	order: number;
	type: string;
	grade_level: Set<string>;
	hours_per_week: string;
	weeks_per_year: string;
	when: Set<string>;
	position: string;
	organization: string;
	description: string;
	continue_in_college: 'TRUE' | 'FALSE';
	comments: string;
};

export type CATrActivity = {
	order: number;
	type: string;
	organization: string;
	country: string;
	job_is_continuing: 'TRUE' | 'FALSE';
	job_start_date: string;
	job_end_date: string;
	job_status: string; // full time, part time, or temporary
	name: string; // title
	type_of_recognition: Set<string>;
	description: string;
	comments: string;
};

export const ucActivityCategory = [
	'',
	'award',
	'edu-prep',
	'ec',
	'course',
	'volunteer',
	'work'
] as const;

export type UCActivityCategory = (typeof ucActivityCategory)[number];

export const ucActivityCategoryMap: Record<UCActivityCategory, string> = {
	'': '',
	award: 'Award or honor',
	'edu-prep': 'Educational preparation program',
	ec: 'Extracurricular activity',
	course: 'Other coursework',
	volunteer: 'Volunteer / Community service',
	work: 'Work experience'
};

export type UCWorkHour = {
	grade: string;
	school: string;
	summer: string;
};

type UCActivity = {
	uc_category: UCActivityCategory;
	order: number; // effective within a category
	name: string; // name of award | program | ec | course | org | workplace
	grade_level: Set<string>;
	comments: string;
	// for edu-prep & ec & course & volunteer
	hours_per_week: string;
	weeks_per_year: string;
	// "what did you do", for award & ec & volunteer & work (as job responsibilities)
	description: string;
	// for edu-prep & course (as course description) & volunteer & work (as company description)
	program_description: string;
	// for award
	level_of_recognition: Set<string>;
	award_type: 'academic' | 'non-academic' | '';
	award_req: string;
	// for work
	job_title: string;
	work_hours: UCWorkHour[];
	job_is_continuing: 'TRUE' | 'FALSE';
	job_start_date: string;
	job_end_date: string;
};

export type Activity = Prettify<CAFrActivity & CATrActivity & UCActivity>;

export type RawActivity = Prettify<
	Omit<
		Activity,
		'grade_level' | 'when' | 'level_of_recognition' | 'type_of_recognition' | 'work_hours'
	> & {
		grade_level: string;
		when: string;
		level_of_recognition: string;
		type_of_recognition: string;
		work_hours: string;
	}
>;

export type GeneralData = { activities: Activity[]; honors: Honor[] };

export type SerializedCAFrActivity = Prettify<
	Omit<CAFrActivity, 'grade_level' | 'when'> & { grade_level: string; when: string }
>;

export type SerializedCATrActivity = Prettify<
	Omit<CATrActivity, 'type_of_recognition'> & { type_of_recognition: string }
>;

export type SerializedUCActivity = Prettify<
	Omit<UCActivity, 'grade_level' | 'level_of_recognition' | 'work_hours'> & {
		grade_level: string;
		level_of_recognition: string;
		work_hours: string;
	}
>;

// Honor types are exclusive to Common App systems
export type CAFrHonor = {
	order: number;
	title: string;
	grade_level: Set<string>;
	level_of_recognition: Set<string>;
	comments: string;
};

export type CATrHonor = {
	order: number;
	type: string;
	title: string;
	org: string;
	date: string;
	description: string;
	comments: string;
};

export type Honor = Prettify<CAFrHonor & CATrHonor>;

export type RawHonor = Prettify<
	Omit<Honor, 'grade_level' | 'level_of_recognition'> & {
		grade_level: string;
		level_of_recognition: string;
	}
>;

export type SerializedCAFrHonor = Prettify<
	Omit<CAFrHonor, 'grade_level' | 'level_of_recognition'> & {
		grade_level: string;
		level_of_recognition: string;
	}
>;

export type SerializedCATrHonor = CATrHonor;

export type SerializedCAFrData = {
	activities: SerializedCAFrActivity[];
	honors: SerializedCAFrHonor[];
};

export type SerializedCATrData = {
	activities: SerializedCATrActivity[];
	honors: SerializedCATrHonor[];
};

export type SerializedUCData = {
	activities: SerializedUCActivity[];
	honors: [];
};

export type SerializedGeneralData = Prettify<{
	activities: (SerializedCAFrActivity & SerializedCATrActivity & SerializedUCActivity)[];
	honors: RawHonor[];
}>;

export type Context = {
	id: string;
	name: string;
	fileFilter: {
		name: string;
		extensions: string[];
	};
	honors?: {
		maxEntries: number;
	};
	activities: {
		maxEntries: number;
	};
	parser: (wb: WorkBook) => Promise<GeneralData>;
	importer: (wb: WorkBook) => Promise<GeneralData>;
	serialize: (data: GeneralData) => SerializedCAFrData | SerializedCATrData | SerializedUCData;
	exportAsExcel: (params: { data: SerializedGeneralData; filePath: string }) => Promise<void>;
};
