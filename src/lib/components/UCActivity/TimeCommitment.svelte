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
		<div>{activity.hours_per_week || 'x'} hours per week</div>
		<div>{activity.weeks_per_year || 'x'} weeks per year</div>
	</div>
</UCSection>
