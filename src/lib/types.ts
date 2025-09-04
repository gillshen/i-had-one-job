import type { WorkBook } from 'xlsx';

type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};

type CAFrActivity = {
	order: number;
	type: string;
	grade_level: Set<string>;
	hours_per_week: number | null;
	weeks_per_year: number | null;
	when: Set<string>;
	position: string;
	organization: string;
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
	school: number | null;
	summer: number | null;
};

type UCActivity = {
	uc_category: UCActivityCategory;
	order: number; // effective within a category
	name: string; // name of award | program | ec | course | org | workplace
	grade_level: Set<string>;
	comments: string;
	// for edu-prep & ec & course & volunteer
	hours_per_week: number | null;
	weeks_per_year: number | null;
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

export type Activity = Prettify<CAFrActivity & UCActivity>;

export type RawActivity = Prettify<
	Omit<Activity, 'grade_level' | 'when' | 'level_of_recognition' | 'work_hours'> & {
		grade_level: string;
		when: string;
		level_of_recognition: string;
		work_hours: string;
	}
>;

export type SerializedCAFrActivity = Prettify<
	Omit<CAFrActivity, 'grade_level' | 'when'> & { grade_level: string; when: string }
>;

export type SerializedUCActivity = Prettify<
	Omit<UCActivity, 'grade_level' | 'level_of_recognition' | 'work_hours'> & {
		grade_level: string;
		level_of_recognition: string;
		work_hours: string;
	}
>;

// Honor types are exclusive to Common App systems
export type Honor = {
	order: number;
	grade_level: Set<string>;
	title: string;
	level_of_recognition: Set<string>;
	comments: string;
};

export type RawHonor = Prettify<
	Omit<Honor, 'grade_level' | 'level_of_recognition'> & {
		grade_level: string;
		level_of_recognition: string;
	}
>;

export type SerializedCAFrData = {
	activities: SerializedCAFrActivity[];
	honors: RawHonor[];
};

export type SerializedUCData = { activities: SerializedUCActivity[]; honors: [] };

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
	parser: (wb: WorkBook) => Promise<{ activities: Activity[]; honors: Honor[] }>;
	serialize: (data: {
		activities: Activity[];
		honors: Honor[];
	}) => SerializedCAFrData | SerializedUCData;
};
