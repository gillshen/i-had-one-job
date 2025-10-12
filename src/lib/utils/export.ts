import * as XLSX from 'xlsx';
import type { SerializedGeneralData, SerializedUCActivity, UCActivityCategory } from '$lib/types';
import { saveWorkbookToFile } from './fs';

export const exportCAFrWorkbook = (params: {
	data: SerializedGeneralData;
	filePath: string;
}): void => {
	const { data, filePath } = params;

	const aoa = [
		// row 1 (empty)
		[],
		// row 2，section title
		['', 'Activities'],
		// row 3, major headings
		[
			'',
			'No.',
			'Grade level',
			'Approximate time spent',
			'',
			'Activity type',
			'When did you participate in the activity?',
			'Position/Leadership description',
			'Organization Name',
			'Please describe this activity, including what you accomplished and any recognition you received, etc.',
			'Char count: Position (max 50)',
			'Char count: Org name (max 100)',
			'Char count: Description (max 150)'
		],
		// row 4, sub-headings
		['', '', '9 10 11 12 PG', 'Hrs/Wk', 'Wks/Yr']
	];

	// add activities
	for (const activity of data.activities) {
		aoa.push([
			'',
			activity.order.toString(),
			activity.grade_level,
			activity.hours_per_week,
			activity.weeks_per_year,
			activity.type,
			activity.when,
			activity.position,
			activity.organization,
			activity.description
		]);
	}

	// add honors section
	const honorSectionHead = [
		[],
		['', 'Honors'],
		[
			'',
			'No.',
			'Grade Level\n9 10 11 12 PG',
			'',
			'',
			'Level of Recognition\nSchool / State / National / International',
			'',
			'',
			'Title',
			'',
			'',
			'Char count: Title (max 100)'
		]
	];
	aoa.push(...honorSectionHead);

	// add honors
	for (const honor of data.honors) {
		aoa.push([
			'',
			honor.order.toString(),
			honor.grade_level,
			'', // empty column
			'', // empty column
			honor.level_of_recognition,
			'', // empty column
			'', // empty column
			honor.title
		]);
	}

	const wb: XLSX.WorkBook = XLSX.utils.book_new();
	const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

	// Define merged cells
	ws['!merges'] = [
		{ s: { r: 1, c: 1 }, e: { r: 1, c: 12 } }, // B2:M2 - "Activities"
		{ s: { r: 2, c: 1 }, e: { r: 3, c: 1 } }, // B3:B4 - "No."
		{ s: { r: 2, c: 3 }, e: { r: 2, c: 4 } }, // D3:E3 - "Approximate time spent"
		{ s: { r: 2, c: 5 }, e: { r: 3, c: 5 } }, // F3:F4 - "Activity type"
		{ s: { r: 2, c: 6 }, e: { r: 3, c: 6 } }, // G3:G4 - "When did you participate in the activity?"
		{ s: { r: 2, c: 7 }, e: { r: 3, c: 7 } }, // H3:H4 - "Position/Leadership description"
		{ s: { r: 2, c: 8 }, e: { r: 3, c: 8 } }, // I3:I4 - "Organization Name"
		{ s: { r: 2, c: 9 }, e: { r: 3, c: 9 } }, // J3:J4 - "Please describe this activity..."
		{ s: { r: 2, c: 10 }, e: { r: 3, c: 10 } }, // K3:K4 - "Char count: Position (<=50)"
		{ s: { r: 2, c: 11 }, e: { r: 3, c: 11 } }, // L3:L4 - "Char count: Org name (<=100)"
		{ s: { r: 2, c: 12 }, e: { r: 3, c: 12 } } // M3:M4 - "Char count: Description (<=150)"
	];
	const honorTitleRow = 5 + data.activities.length;
	ws['!merges'].push(
		{ s: { r: honorTitleRow, c: 1 }, e: { r: honorTitleRow, c: 12 } } // B{honorStartRow+1}:M{honorStartRow+1} - "Honors"
	);
	for (let row = honorTitleRow + 1; row < honorTitleRow + 2 + data.honors.length; row++) {
		ws['!merges'].push(
			{ s: { r: row, c: 2 }, e: { r: row, c: 4 } }, // "Grade Level"
			{ s: { r: row, c: 5 }, e: { r: row, c: 7 } }, // "Level of Recognition"
			{ s: { r: row, c: 8 }, e: { r: row, c: 10 } } // "Title"
		);
	}

	// Add formulas for each activity row
	for (let row = 5; row < 5 + data.activities.length; row++) {
		ws[`K${row}`] = { f: `LEN(H${row})` }; // Position char count
		ws[`L${row}`] = { f: `LEN(I${row})` }; // Org name char count
		ws[`M${row}`] = { f: `LEN(J${row})` }; // Description char count
	}
	// Add formulas for each honor row
	for (
		let row = honorTitleRow + honorSectionHead.length;
		row < honorTitleRow + honorSectionHead.length + data.honors.length;
		row++
	) {
		ws[`L${row}`] = { f: `LEN(I${row})` }; // Title char count
	}

	XLSX.utils.book_append_sheet(wb, ws, 'Common App');
	saveWorkbookToFile(wb, filePath);
};

export const exportCATrWorkbook = (params: {
	data: SerializedGeneralData;
	filePath: string;
}): void => {
	// TODO
	console.log(params);
};

export const exportUCWorkbook = (params: {
	data: SerializedGeneralData;
	filePath: string;
}): void => {
	const {
		data: { activities },
		filePath
	} = params;

	const aoa = [
		// row 1 (empty)
		[],
		// row 2，section title
		['', 'Awards and Honors'],
		// row 3, instruction
		[
			'',
			'List and briefly describe the most significant awards you have received since the beginning of 9th grade. '
		],
		// row 4, headings
		[
			'',
			'No.',
			'Name of the award or honor (60 chars)',
			'',
			'',
			'Eligibility requirements for this award or honor (250 chars)\nFor example: How are award recipients chosen? How many people are selected to receive the award? Is there an application or nomination for the award?',
			'',
			'',
			"What did you do to achieve this award or honor? (350 chars)\nWe'd like to understand what it took - on your part - to achieve this award. For instance: Were there multiple competitions that you had to participate in? How much time did you dedicate to winning this award?",
			'',
			'Level of recognition',
			'Char count: Name (max 60)',
			'Char count: Requirements (max 250)',
			'Char count: Description (max 350)'
		]
	];

	// add awards and honors
	const awards = getUCActivities(activities, 'award');
	for (const [index, item] of awards.entries()) {
		aoa.push([
			'',
			(index + 1).toString(),
			item.name,
			'',
			'',
			item.award_req,
			'',
			'',
			item.description,
			'',
			item.level_of_recognition
		]);
	}

	// add educational programs
	aoa.push(
		...[
			[],
			['', 'Educational Preparation Programs'],
			[
				'',
				'Any programs or activities that have enriched your academic experiences or helped you prepare for college. Programs can include counseling, tutoring, research opportunities or special study opportunities, such as study abroad.'
			],
			[
				'',
				'No.',
				'Program name (60 chars)',
				'',
				'',
				"Program description (350 chars)\nThink about the program's main focus, your experience, and what you accomplished and learned while participating in the program.",
				'',
				'',
				'When did you participate\n9 10 11 12 PG',
				'Hours per week',
				'Weeks per year',
				'Char count: Name (max 60)',
				'Char count: Description (max 350)'
			]
		]
	);

	const eduPreps = getUCActivities(activities, 'edu-prep');
	for (const [index, item] of eduPreps.entries()) {
		aoa.push([
			'',
			(index + 1).toString(),
			item.name,
			'',
			'',
			item.program_description,
			'',
			'',
			item.grade_level,
			item.hours_per_week,
			item.weeks_per_year
		]);
	}

	// add extracurricular activities
	aoa.push(
		...[
			[],
			['', 'Extracurricular Activities'],
			[
				'',
				"These could include hobbies, clubs, sports or anything else you haven't had the chance to tell us about."
			],
			[
				'',
				'No.',
				'Name of the activity (60 chars)',
				'',
				'',
				"What did you do? (350 chars)\nThink about your experience, and what you accomplished and learned. We'd also like to know if you've held a leadership role, which can mean more than just a title — it can mean being a mentor to others, acting as a point-person in charge of a specific task, or taking a lead role in organizing an event or project.",
				'',
				'',
				'When did you participate\n9 10 11 12 PG',
				'Hours per week',
				'Weeks per year',
				'Char count: Name (max 60)',
				'Char count: Description (max 350)'
			]
		]
	);

	const ecs = getUCActivities(activities, 'ec');
	for (const [index, item] of ecs.entries()) {
		aoa.push([
			'',
			(index + 1).toString(),
			item.name,
			'',
			'',
			item.description,
			'',
			'',
			item.grade_level,
			item.hours_per_week,
			item.weeks_per_year
		]);
	}

	// add other courses
	aoa.push(
		...[
			[],
			['', 'Other Coursework'],
			[
				'',
				"These are courses other than those required for UC admission (courses that do not fit in UC's A-G subject areas)."
			],
			[
				'',
				'No.',
				'Course name (60 chars)',
				'',
				'',
				'Briefly describe the course (350 chars)\nWhat program or school offered the course? Also, think about describing the major themes or topics the course covered, as well as what knowledge or skills you learned.',
				'',
				'',
				'When did you participate\n9 10 11 12 PG',
				'Hours per week',
				'Weeks per year',
				'Char count: Name (max 60)',
				'Char count: Description (max 350)'
			]
		]
	);
	const courses = getUCActivities(activities, 'course');
	for (const [index, item] of courses.entries()) {
		aoa.push([
			'',
			(index + 1).toString(),
			item.name,
			'',
			'',
			item.program_description,
			'',
			'',
			item.grade_level,
			item.hours_per_week,
			item.weeks_per_year
		]);
	}

	// add volunteer experiences
	aoa.push(
		...[
			[],
			['', 'Volunteer / Community Services'],
			['', "These are activities you've donated time and effort to without getting paid."],
			[
				'',
				'No.',
				'Name of the organization, program, school or group (60 chars)',
				'',
				'',
				"Describe the organization (250 chars)\nConsider what kind of work the organization does: What's the reason the organization exists today? How does it help a certain community or population?",
				'',
				"What did you do? (350 chars)\nThink about your experience, and what you accomplished and learned while volunteering. We'd also like to know if you've held a leadership role, which can mean more than just a title — it can mean being a mentor to others, acting as a point-person in charge of a specific task, or taking a lead role in organizing an event or project.",
				'When did you participate\n9 10 11 12 PG',
				'Hours per week',
				'Weeks per year',
				'Char count: Name (max 60)',
				'Char count: Organization (max 250)',
				'Char count: Description (max 350)'
			]
		]
	);
	const volunteers = getUCActivities(activities, 'volunteer');
	for (const [index, item] of volunteers.entries()) {
		aoa.push([
			'',
			(index + 1).toString(),
			item.name,
			'',
			'',
			item.program_description,
			'',
			item.description,
			item.grade_level,
			item.hours_per_week,
			item.weeks_per_year
		]);
	}

	// add work experiences
	aoa.push(
		...[
			[],
			['', 'Work Experiences'],
			['', "This is for telling us about any paid jobs or paid internships you've had."],
			[
				'',
				'No.',
				'Job title (60 chars)',
				'Where did you work? (60 chars)\nPlease tell us the name of the place where you worked.',
				'Briefly describe the company or organization where you worked (250 chars)\nConsider describing the industry, the size of the company or organization, or its main focus.',
				'',
				'Where were your job responsibilities? (350 chars)',
				'',
				'When did you participate?\n9 10 11 12 PG',
				'Hours per week',
				'Weeks per year',
				'Char count: Company name (max 60)',
				'Char count: Company description (max 250)',
				'Char count: Job responsibilities (max 350)'
			]
		]
	);
	const works = getUCActivities(activities, 'work');
	for (const [index, item] of works.entries()) {
		aoa.push([
			'',
			(index + 1).toString(),
			item.job_title,
			item.name,
			item.program_description,
			'',
			item.description
		]);
	}

	const wb: XLSX.WorkBook = XLSX.utils.book_new();
	const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

	// Define merged cells and formulas
	ws['!merges'] = [
		{ s: { r: 1, c: 1 }, e: { r: 1, c: 13 } }, // B2:N2 - "Awards and Honors"
		{ s: { r: 2, c: 1 }, e: { r: 2, c: 13 } }, // B3:N3 - awards section instruction
		{ s: { r: 3, c: 2 }, e: { r: 3, c: 4 } }, // C4:E4 - name of the award/honor
		{ s: { r: 3, c: 5 }, e: { r: 3, c: 7 } }, // F4:H4 - award requirements
		{ s: { r: 3, c: 8 }, e: { r: 3, c: 9 } } // I4:J4 - award action description
	];
	for (let row = 5; row < 5 + awards.length; row++) {
		const r = row - 1;
		ws['!merges'].push(
			{ s: { r, c: 2 }, e: { r, c: 4 } }, // name of the award/honor
			{ s: { r, c: 5 }, e: { r, c: 7 } }, // award requirements
			{ s: { r, c: 8 }, e: { r, c: 9 } } // award action description
		);
		ws[`L${row}`] = { f: `LEN(C${row})` }; // Position char count
		ws[`M${row}`] = { f: `LEN(F${row})` }; // Org name char count
		ws[`N${row}`] = { f: `LEN(I${row})` }; // Description char count
	}

	const eduPrepTitleRow = 5 + awards.length;
	ws['!merges'].push(
		...[
			{ s: { r: eduPrepTitleRow, c: 1 }, e: { r: eduPrepTitleRow, c: 13 } }, // B:M - "Educational Preparation Programs"
			{ s: { r: eduPrepTitleRow + 1, c: 1 }, e: { r: eduPrepTitleRow + 1, c: 13 } }, // B:M - edu prep section instruction
			{ s: { r: eduPrepTitleRow + 2, c: 2 }, e: { r: eduPrepTitleRow + 2, c: 4 } }, // C:E - program name
			{ s: { r: eduPrepTitleRow + 2, c: 5 }, e: { r: eduPrepTitleRow + 2, c: 7 } } // F:H - program description
		]
	);
	for (let r = eduPrepTitleRow + 3; r < eduPrepTitleRow + 3 + eduPreps.length; r++) {
		ws['!merges'].push(
			{ s: { r, c: 2 }, e: { r, c: 4 } }, // program name
			{ s: { r, c: 5 }, e: { r, c: 7 } } // program description
		);
		const row = r + 1;
		ws[`L${row}`] = { f: `LEN(C${row})` }; // Program name char count
		ws[`M${row}`] = { f: `LEN(F${row})` }; // Program description char count
	}

	const ecTitleRow = eduPrepTitleRow + 4 + eduPreps.length;
	ws['!merges'].push(
		...[
			{ s: { r: ecTitleRow, c: 1 }, e: { r: ecTitleRow, c: 13 } }, // B:M - "Extracurricular Activities"
			{ s: { r: ecTitleRow + 1, c: 1 }, e: { r: ecTitleRow + 1, c: 13 } }, // B:M - ec section instruction
			{ s: { r: ecTitleRow + 2, c: 2 }, e: { r: ecTitleRow + 2, c: 4 } }, // C:E - ec name
			{ s: { r: ecTitleRow + 2, c: 5 }, e: { r: ecTitleRow + 2, c: 7 } } // F:H - ec description
		]
	);
	for (let r = ecTitleRow + 3; r < ecTitleRow + 3 + ecs.length; r++) {
		ws['!merges'].push(
			{ s: { r, c: 2 }, e: { r, c: 4 } }, // ec name
			{ s: { r, c: 5 }, e: { r, c: 7 } } // ec description
		);
		const row = r + 1;
		ws[`L${row}`] = { f: `LEN(C${row})` }; // ec name char count
		ws[`M${row}`] = { f: `LEN(F${row})` }; // ec description char count
	}

	const courseTitleRow = ecTitleRow + 4 + ecs.length;
	ws['!merges'].push(
		...[
			{ s: { r: courseTitleRow, c: 1 }, e: { r: courseTitleRow, c: 13 } }, // B:M - "Other Coursework"
			{ s: { r: courseTitleRow + 1, c: 1 }, e: { r: courseTitleRow + 1, c: 13 } }, // B:M - course section instruction
			{ s: { r: courseTitleRow + 2, c: 2 }, e: { r: courseTitleRow + 2, c: 4 } }, // C:E - course name
			{ s: { r: courseTitleRow + 2, c: 5 }, e: { r: courseTitleRow + 2, c: 7 } } // F:H - course description
		]
	);
	for (let r = courseTitleRow + 3; r < courseTitleRow + 3 + courses.length; r++) {
		ws['!merges'].push(
			{ s: { r, c: 2 }, e: { r, c: 4 } }, // course name
			{ s: { r, c: 5 }, e: { r, c: 7 } } // course description
		);
		const row = r + 1;
		ws[`L${row}`] = { f: `LEN(C${row})` }; // course name char count
		ws[`M${row}`] = { f: `LEN(F${row})` }; // course description char count
	}

	const volunteerTitleRow = courseTitleRow + 4 + courses.length;
	ws['!merges'].push(
		...[
			{ s: { r: volunteerTitleRow, c: 1 }, e: { r: volunteerTitleRow, c: 13 } }, // B:M - "Volunteer ..."
			{ s: { r: volunteerTitleRow + 1, c: 1 }, e: { r: volunteerTitleRow + 1, c: 13 } }, // B:M - volunteer section instruction
			{ s: { r: volunteerTitleRow + 2, c: 2 }, e: { r: volunteerTitleRow + 2, c: 4 } }, // C:E - org name
			{ s: { r: volunteerTitleRow + 2, c: 5 }, e: { r: volunteerTitleRow + 2, c: 6 } } // F:G - org description
		]
	);
	for (let r = volunteerTitleRow + 3; r < volunteerTitleRow + 3 + volunteers.length; r++) {
		ws['!merges'].push(
			{ s: { r, c: 2 }, e: { r, c: 4 } }, // org name
			{ s: { r, c: 5 }, e: { r, c: 6 } } // org description
		);
		const row = r + 1;
		ws[`L${row}`] = { f: `LEN(C${row})` }; // org name char count
		ws[`M${row}`] = { f: `LEN(F${row})` }; // org description char count
		ws[`N${row}`] = { f: `LEN(H${row})` }; // activity description char count
	}

	const workTitleRow = volunteerTitleRow + 4 + volunteers.length;
	ws['!merges'].push(
		...[
			{ s: { r: workTitleRow, c: 1 }, e: { r: workTitleRow, c: 13 } }, // B:M - "Work Experiences"
			{ s: { r: workTitleRow + 1, c: 1 }, e: { r: workTitleRow + 1, c: 13 } }, // B:M - volunteer section instruction
			{ s: { r: workTitleRow + 2, c: 4 }, e: { r: workTitleRow + 2, c: 5 } }, // E:F - company description
			{ s: { r: workTitleRow + 2, c: 6 }, e: { r: workTitleRow + 2, c: 7 } } // G:H - job responsibilities
		]
	);
	for (let r = workTitleRow + 3; r < workTitleRow + 3 + works.length; r++) {
		ws['!merges'].push(
			{ s: { r, c: 4 }, e: { r, c: 5 } }, // company name
			{ s: { r, c: 6 }, e: { r, c: 7 } } // job responsibilities
		);
		const row = r + 1;
		ws[`L${row}`] = { f: `LEN(D${row})` }; // company name char count
		ws[`M${row}`] = { f: `LEN(E${row})` }; // company description char count
		ws[`N${row}`] = { f: `LEN(G${row})` }; // job responsibilities char count
	}

	XLSX.utils.book_append_sheet(wb, ws, 'Common App');
	saveWorkbookToFile(wb, filePath);
};

const getUCActivities = (
	activities: SerializedUCActivity[],
	category: UCActivityCategory
): SerializedUCActivity[] => {
	const result = activities.filter((a) => a.uc_category === category);
	if (!result.length) {
		result.push({
			award_req: '',
			award_type: 'academic',
			comments: '',
			description: '',
			grade_level: '',
			hours_per_week: '',
			job_end_date: '',
			job_is_continuing: 'FALSE',
			job_start_date: '',
			job_title: '',
			level_of_recognition: '',
			name: '',
			order: 1,
			program_description: '',
			uc_category: category,
			weeks_per_year: '',
			work_hours: ''
		});
	}
	return result;
};
