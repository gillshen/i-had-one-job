import type { WorkBook } from 'xlsx';

export type Activity = {
	order: number;
	grade_level: (string | number)[];
	hours_per_week: number | null;
	weeks_per_year: number | null;
	type: string;
	when: string[];
	position: string;
	organization: string;
	description: string;
	comments: string;
};

export type Honor = {
	order: number;
	grade_level: (string | number)[];
	title: string;
	level_of_recognition: string[];
	comments: string;
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
