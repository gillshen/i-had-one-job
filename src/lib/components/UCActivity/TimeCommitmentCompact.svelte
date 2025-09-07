<script lang="ts">
	import type { Activity } from '$lib/types';

	let { activity }: { activity: Activity } = $props();
</script>

<div>
	{#if isNaN(parseFloat(activity.hours_per_week))}
		<span class="missing">{activity.hours_per_week || '??'}</span>
	{:else}
		{activity.hours_per_week}
	{/if}
	hr/wk,
	{#if isNaN(parseFloat(activity.weeks_per_year))}
		<span class="missing">{activity.weeks_per_year || '??'}</span>
	{:else}
		{activity.weeks_per_year}
	{/if}
	wk/yr
</div>
