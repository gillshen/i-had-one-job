const gradeLevelOrder = ['9', '10', '11', '12', 'PG'];

export const orderGradeLevels = (level1: string, level2: string): number => {
	const index1 = gradeLevelOrder.indexOf(level1);
	const index2 = gradeLevelOrder.indexOf(level2);
	return index1 - index2;
};

const timingOrder = ['all year', 'during school year', 'during school break'];

export const orderTimings = (t1: string, t2: string): number => {
	const index1 = timingOrder.indexOf(t1);
	const index2 = timingOrder.indexOf(t2);
	return index1 - index2;
};
