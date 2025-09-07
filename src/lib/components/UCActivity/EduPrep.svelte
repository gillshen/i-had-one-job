<script lang="ts">
	import type { Activity } from '$lib/types';
	import UCSection from './UCSection.svelte';
	import GradeLevels from './GradeLevels.svelte';
	import TimeCommitment from './TimeCommitment.svelte';
	import { EDU_PREP_PROGRAMS } from './common';

	type Props = {
		activity: Activity;
	};
	let { activity }: Props = $props();
</script>

<UCSection heading="Program name">
	{#if activity.name}
		<div>
			{#if EDU_PREP_PROGRAMS.includes(activity.name)}
				<!-- pre-defined programs can bypass the char limit -->
				{activity.name}
			{:else}
				<span>{activity.name.slice(0, 60)}</span><span class="over-limit"
					>{activity.name.slice(60)}</span
				>
			{/if}
		</div>
	{/if}
</UCSection>
<UCSection heading="Program description" body={activity.program_description} />
<GradeLevels {activity} />
<TimeCommitment {activity} />
<div class="text-red-600">{activity.comments}</div>
