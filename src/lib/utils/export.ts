import * as XLSX from 'xlsx';
import type { SerializedGeneralData } from '$lib/types';
import { saveWorkbookToFile } from './fs';

export const exportCAFrWorkbook = (params: {
	data: SerializedGeneralData;
	filePath: string;
}): void => {
	const { data, filePath } = params;
	console.log(data);

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
	console.log(params);
};

export const exportUCWorkbook = (params: {
	data: SerializedGeneralData;
	filePath: string;
}): void => {
	console.log(params);
};
