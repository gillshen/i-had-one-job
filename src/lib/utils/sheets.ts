export const isEmptyCell = (cell: unknown): boolean =>
	cell === null || cell === undefined || (typeof cell === 'string' && !(cell as string).trim());

export const stripLeadingEmptyCells = (row: unknown[]): unknown[] => {
	// remove the empty cells from the start of the row
	let i = 0;
	while (i < row.length && isEmptyCell(row[i])) {
		i++;
	}
	return row.slice(i, row.length);
};

export const rowStartsWithNumber = (row: unknown[]): boolean =>
	typeof row[0] === 'number' || (typeof row[0] === 'string' && !!row[0].trim().match(/^[0-9]+$/));

export const castAsString = (value: unknown, defaultValue = ''): string => {
	if (typeof value === 'string') return value.trim();
	if (typeof value === 'number') return value.toString();
	return defaultValue;
};

export const castAsGradeLevel = (value: unknown): Set<string> => {
	const stringValue = castAsString(value);
	const levels = stringValue
		.split(/[,;/\s]+/)
		.map((s) => s.trim().toUpperCase())
		.filter((grade) => grade.match(/^(9|10|11|12|PG)$/));
	return new Set(levels);
};

export const castAsParticipationTiming = (value: unknown): Set<string> => {
	const stringValue = castAsString(value);
	const timings = stringValue
		.split(/[,;/\n]/)
		.map((s) => s.trim().toLowerCase())
		.filter((when) => when.match(/^(during school year|during school break|all year)$/));
	return new Set(timings);
};

export const castAsRecognitionLevel = (value: unknown, subset: 'caf' | 'uc'): Set<string> => {
	const stringValue = castAsString(value);
	const levels = stringValue
		.split(/[,;/\n]/)
		.map((s) => s.trim().toLowerCase())
		.filter((level) =>
			subset === 'caf'
				? level.match(/^(school|state\/regional|national|international)$/)
				: level.match(/^(school|city\/community|state|regional|national|international)$/)
		);
	return new Set(levels);
};
