<script lang="ts">
	import type { Activity } from '$lib/types';
	import UCSection from './UCSection.svelte';
	import { orderUCWorkHours } from '$lib/utils/sorting';

	type Props = {
		activity: Activity;
	};
	let { activity }: Props = $props();
</script>

<UCSection heading="Company or organization name" body={activity.name} charLimit={60} />
<UCSection
	heading="Company or organization description"
	body={activity.program_description}
	charLimit={250}
/>
<UCSection heading="Job title" body={activity.job_title} charLimit={60} />
<UCSection heading="Job responsibilities" body={activity.description} charLimit={350} />
<!-- TODO -->
<UCSection heading="Grade participation and time commitment">
	<div class="flex flex-col gap-1">
		{#each [...activity.work_hours].sort(orderUCWorkHours) as { grade, school, summer }}
			<div class="flex flex-col">
				<div>{grade.toLowerCase() === 'pg' ? 'After 12th grade' : `${grade}th grade`}</div>
				{#if school}
					<div>&bull; During school year {school} hours per week</div>
				{/if}
				{#if summer}
					<div>&bull; During summer {summer} hours per week</div>
				{/if}
			</div>
		{/each}
	</div>
</UCSection>
<UCSection
	heading="Currently working at this job"
	body={activity.job_is_continuing === 'TRUE' ? 'Yes' : 'No'}
>
	<div class="flex flex-col">
		<!-- show date in mm/yyyy format -->
		{#if activity.job_start_date && !isNaN(Date.parse(activity.job_start_date))}
			<div>
				Start date: {new Date(activity.job_start_date).toLocaleDateString('en-US', {
					month: '2-digit',
					year: 'numeric'
				})}
			</div>
		{:else}
			<div>Start date: {activity.job_start_date}</div>
		{/if}
		{#if activity.job_is_continuing === 'FALSE'}
			{#if activity.job_end_date && !isNaN(Date.parse(activity.job_end_date))}
				<div>
					End date: {new Date(activity.job_end_date).toLocaleDateString('en-US', {
						month: '2-digit',
						year: 'numeric'
					})}
				</div>
			{:else}
				<div>End date: {activity.job_end_date}</div>
			{/if}
		{/if}
	</div>
</UCSection>
<div class="text-red-600">{activity.comments}</div>
