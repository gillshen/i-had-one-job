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
