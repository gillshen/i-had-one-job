<script lang="ts">
	import type { Activity } from '$lib/types';
	import CharLimitSpan from '$lib/components/CharLimitSpan.svelte';
	import UCSection from './UCSection.svelte';
	import GradeLevels from './GradeLevels.svelte';
	import TimeCommitment from './TimeCommitment.svelte';
	import GradeLevelsCompact from './GradeLevelsCompact.svelte';
	import TimeCommitmentCompact from './TimeCommitmentCompact.svelte';

	type Props = {
		activity: Activity;
		compact?: boolean;
	};
	let { activity, compact = false }: Props = $props();
</script>

{#if compact}
	<div class="grid grid-cols-[min(140px,33%)_1fr] gap-4">
		<div>
			<GradeLevelsCompact {activity} />
			<TimeCommitmentCompact {activity} />
		</div>
		<div>
			<div class="font-semibold"><CharLimitSpan text={activity.name} charLimit={60} /></div>
			<div>
				<span class="font-medium text-[#1295D8]">Organization:</span>
				<CharLimitSpan text={activity.program_description} charLimit={350} />
			</div>
			<div>
				<span class="font-medium text-[#1295D8]">Action:</span>
				<CharLimitSpan text={activity.description} charLimit={350} />
			</div>
		</div>
	</div>
{:else}
	<UCSection heading="Organization, group or program name" body={activity.name} charLimit={60} />
	<UCSection
		heading="Organization, group or program description"
		body={activity.program_description}
		charLimit={250}
	/>
	<UCSection
		heading="Description of volunteer experience"
		body={activity.description}
		charLimit={350}
	/>
	<GradeLevels {activity} />
	<TimeCommitment {activity} />
{/if}
