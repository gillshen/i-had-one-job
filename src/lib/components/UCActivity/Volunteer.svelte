<script lang="ts">
	import type { Activity } from '$lib/types';
	import UCSection from './UCSection.svelte';
	import GradeLevels from './GradeLevels.svelte';
	import TimeCommitment from './TimeCommitment.svelte';

	type Props = {
		activity: Activity;
	};
	let { activity }: Props = $props();
</script>

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
<div class="text-red-600">{activity.comments}</div>
