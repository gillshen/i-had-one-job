<script lang="ts">
	import type { Activity } from '$lib/types';
	import CharLimitSpan from '$lib/components/CharLimitSpan.svelte';
	import UCSection from './UCSection.svelte';
	import GradeLevels from './GradeLevels.svelte';
	import TimeCommitment from './TimeCommitment.svelte';
	import GradeLevelsCompact from './GradeLevelsCompact.svelte';
	import TimeCommitmentCompact from './TimeCommitmentCompact.svelte';
	import { EDU_PREP_PROGRAMS } from './common';

	type Props = {
		activity: Activity;
		compact?: boolean;
	};
	let { activity, compact = false }: Props = $props();
</script>

{#if compact}
	<div class="grid grid-cols-[min(140px,33%)_1fr_1fr] gap-4">
		<div>
			<GradeLevelsCompact {activity} />
			<TimeCommitmentCompact {activity} />
		</div>
		<div class="col-span-2">
			<div class="font-semibold">
				{#if EDU_PREP_PROGRAMS.includes(activity.name)}
					{activity.name}
				{:else}
					<CharLimitSpan text={activity.name} charLimit={60} />
				{/if}
			</div>
			<div><CharLimitSpan text={activity.program_description} charLimit={350} /></div>
		</div>
	</div>
{:else}
	<UCSection heading="Program name">
		{#if activity.name}
			<div>
				{#if EDU_PREP_PROGRAMS.includes(activity.name)}
					<!-- pre-defined programs can bypass the char limit -->
					{activity.name}
				{:else}
					<CharLimitSpan text={activity.name} charLimit={60} />
				{/if}
			</div>
		{/if}
	</UCSection>
	<UCSection heading="Program description" body={activity.program_description} />
	<GradeLevels {activity} />
	<TimeCommitment {activity} />
{/if}
