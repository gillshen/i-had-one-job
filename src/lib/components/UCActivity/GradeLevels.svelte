<script lang="ts">
	import type { Activity } from '$lib/types';
	import UCSection from './UCSection.svelte';

	type Props = {
		activity: Activity;
		heading?: string;
	};
	let { activity, heading = 'Grade participation' }: Props = $props();

	import { orderGradeLevels } from '$lib/utils/sorting';

	export const getGradeLevels = (gradeLevels: Set<string>): string[] =>
		Array.from(gradeLevels)
			.map((lvl) => lvl.toLowerCase().trim())
			.sort(orderGradeLevels)
			.map(formatGradeLevel);

	export const formatGradeLevel = (lvl: string): string =>
		lvl === 'pg' ? 'After 12th grade' : `${lvl}th grade`;
</script>

<UCSection {heading}>
	{#if Array.from(activity.grade_level).length}
		<div class="flex flex-col">
			{#each getGradeLevels(activity.grade_level) as lvl}
				<div>{lvl}</div>
			{/each}
		</div>
	{/if}
</UCSection>
