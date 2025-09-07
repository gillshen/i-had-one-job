import { ucActivityCategory, type Activity, type UCWorkHour } from '$lib/types';

const gradeLevelOrder = ['9', '10', '11', '12', 'pg', 'PG'];

export const orderGradeLevels = (level1: string, level2: string): number => {
	const index1 = gradeLevelOrder.indexOf(level1);
	const index2 = gradeLevelOrder.indexOf(level2);
	return index1 - index2;
};

const timingOrder = ['during school year', 'during school break', 'all year'];

export const orderTimings = (t1: string, t2: string): number => {
	const index1 = timingOrder.indexOf(t1);
	const index2 = timingOrder.indexOf(t2);
	return index1 - index2;
};

const recognitionOrder = [
	'school',
	'city/community',
	'state/regional',
	'state',
	'regional',
	'national',
	'international'
];

export const orderRecognitions = (rec1: string, rec2: string): number => {
	const index1 = recognitionOrder.indexOf(rec1);
	const index2 = recognitionOrder.indexOf(rec2);
	return index1 - index2;
};

export const orderActivityDefault = (a1: Activity, a2: Activity): number => {
	return a1.order - a2.order;
};

export const orderUCActivityByCategory = (a1: Activity, a2: Activity): number => {
	const index1 = ucActivityCategory.indexOf(a1.uc_category);
	const index2 = ucActivityCategory.indexOf(a2.uc_category);
	if (index1 === index2) {
		return orderActivityDefault(a1, a2);
	}
	return index1 - index2;
};

export const orderUCWorkHours = (w1: UCWorkHour, w2: UCWorkHour): number => {
	const index1 = gradeLevelOrder.indexOf(w1.grade);
	const index2 = gradeLevelOrder.indexOf(w2.grade);
	return index1 - index2;
};
