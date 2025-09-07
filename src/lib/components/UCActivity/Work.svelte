<script lang="ts">
	import type { Activity } from '$lib/types';
	import CharLimitSpan from '$lib/components/CharLimitSpan.svelte';
	import UCSection from './UCSection.svelte';
	import { orderUCWorkHours } from '$lib/utils/sorting';

	type Props = {
		activity: Activity;
		compact?: boolean;
	};
	let { activity, compact = false }: Props = $props();

	const formatDate = (date: string): string =>
		new Date(date).toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' });
</script>

{#if compact}
	<div class="grid grid-cols-[min(140px,33%)_1fr] gap-4">
		<div>
			<div>
				{#if !isNaN(Date.parse(activity.job_start_date))}
					{formatDate(activity.job_start_date)}
				{:else}
					<span class="missing">mm/yyyy</span>
				{/if} - {#if activity.job_is_continuing === 'TRUE'}
					Present
				{:else if !isNaN(Date.parse(activity.job_end_date))}
					{formatDate(activity.job_end_date)}
				{:else}
					<span class="missing">mm/yyyy</span>
				{/if}
			</div>
			{#each [...activity.work_hours].sort(orderUCWorkHours) as { grade, school, summer }}
				<div>{grade.toLowerCase() === 'pg' ? 'PG' : grade}</div>
				<div>
					{#if isNaN(parseFloat(school))}
						<span class="missing">{school || '??'}</span>
					{:else}
						{school}
					{/if} hr/wk; {#if isNaN(parseFloat(summer))}
						<span class="missing">{summer || '??'}</span>
					{:else}
						{summer}
					{/if} hr/wk
				</div>
			{/each}
		</div>
		<div>
			<div class="font-semibold">
				<CharLimitSpan text={activity.job_title} charLimit={60} />, <CharLimitSpan
					text={activity.name}
					charLimit={60}
				/>
			</div>
			<div>
				<span class="font-medium text-[#1295D8]">Organization:</span>
				<CharLimitSpan text={activity.program_description} charLimit={250} />
			</div>
			<div>
				<span class="font-medium text-[#1295D8]">Job:</span>
				<CharLimitSpan text={activity.description} charLimit={350} />
			</div>
		</div>
	</div>
{:else}
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
		{#if activity.work_hours.length}
			<div class="flex flex-col gap-1">
				{#each [...activity.work_hours].sort(orderUCWorkHours) as { grade, school, summer }}
					<div class="flex flex-col">
						<div>{grade.toLowerCase() === 'pg' ? 'After 12th grade' : `${grade}th grade`}</div>
						{#if school}
							<div>
								&bull; During school year {school} hours per week
							</div>
						{/if}
						{#if summer}
							<div>&bull; During summer {summer} hours per week</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</UCSection>
	<UCSection
		heading="Currently working at this job"
		body={activity.job_is_continuing === 'TRUE' ? 'Yes' : 'No'}
	>
		<div class="flex flex-col">
			<!-- show date in mm/yyyy format -->
			{#if activity.job_start_date && !isNaN(Date.parse(activity.job_start_date))}
				<div>
					Start date: {formatDate(activity.job_start_date)}
				</div>
			{:else}
				<div>
					Start date:
					{#if activity.job_start_date}
						{activity.job_start_date}
					{:else}
						<span class="missing">mm/yyyy</span>
					{/if}
				</div>
			{/if}
			{#if activity.job_is_continuing === 'FALSE'}
				{#if activity.job_end_date && !isNaN(Date.parse(activity.job_end_date))}
					<div>
						End date: {formatDate(activity.job_end_date)}
					</div>
				{:else}
					<div>
						End date:
						{#if activity.job_end_date}
							{activity.job_end_date}
						{:else}
							<span class="missing">mm/yyyy</span>
						{/if}
					</div>
				{/if}
			{/if}
		</div>
	</UCSection>
{/if}
