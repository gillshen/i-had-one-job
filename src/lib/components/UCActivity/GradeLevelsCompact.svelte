<script lang="ts">
	import type { Activity } from '$lib/types';
	import { orderGradeLevels } from '$lib/utils/sorting';

	let { activity }: { activity: Activity } = $props();
</script>

<div>
	{Array.from(activity.grade_level)
		.map((grade) => grade.toLowerCase().trim())
		.sort(orderGradeLevels)
		.map((grade) => (grade === 'pg' ? 'PG' : grade))
		.join(', ')}
</div>
