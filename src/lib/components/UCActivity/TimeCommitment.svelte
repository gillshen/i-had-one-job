<script lang="ts">
	import type { Activity } from '$lib/types';
	import UCSection from './UCSection.svelte';

	type Props = {
		activity: Activity;
		heading?: string;
	};
	let { activity, heading = 'Time commitment' }: Props = $props();
</script>

<UCSection {heading}>
	<div class="flex flex-col">
		<div>
			{#if !isNaN(parseFloat(activity.hours_per_week))}
				{activity.hours_per_week}
			{:else}
				<span class="missing">{activity.hours_per_week || '??'}</span>
			{/if}
			hours per week
		</div>
		<div>
			{#if !isNaN(parseFloat(activity.weeks_per_year))}
				{activity.weeks_per_year}
			{:else}
				<span class="missing">{activity.weeks_per_year || '??'}</span>
			{/if}
			weeks per year
		</div>
	</div>
</UCSection>
