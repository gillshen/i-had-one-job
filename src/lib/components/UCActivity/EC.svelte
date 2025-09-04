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

<UCSection heading="Activity name" body={activity.name} charLimit={60} />
<UCSection heading="Activity description" body={activity.description} charLimit={350} />
<GradeLevels {activity} />
<TimeCommitment {activity} />
<div class="text-red-600">{activity.comments}</div>
