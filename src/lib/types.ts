import type { WorkBook } from 'xlsx';

export type Activity = {
	order: number;
	grade_level: Set<string>;
	hours_per_week: number | null;
	weeks_per_year: number | null;
	type: string;
	when: Set<string>;
	position: string;
	organization: string;
	description: string;
	comments: string;
};

export type RawActivity = Omit<Activity, 'grade_level' | 'when'> & {
	grade_level: string;
	when: string;
};

export type Honor = {
	order: number;
	grade_level: Set<string>;
	title: string;
	level_of_recognition: Set<string>;
	comments: string;
};

export type RawHonor = Omit<Honor, 'grade_level' | 'level_of_recognition'> & {
	grade_level: string;
	level_of_recognition: string;
};

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
};
