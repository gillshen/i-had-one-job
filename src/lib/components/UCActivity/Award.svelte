<script lang="ts">
	import type { Activity } from '$lib/types';
	import UCSection from './UCSection.svelte';
	import GradeLevels from './GradeLevels.svelte';
	import { orderRecognitions } from '$lib/utils/sorting';

	type Props = {
		activity: Activity;
	};
	let { activity }: Props = $props();

	const getRecLevels = (recLevels: Set<string>): string[] =>
		Array.from(recLevels)
			.map((lvl) => lvl.trim())
			.sort(orderRecognitions)
			.map(formatRecognitionLevel);

	const formatRecognitionLevel = (lvl: string): string => {
		switch (lvl.toLowerCase()) {
			case 'school':
				return 'School';
			case 'city/community':
				return 'City/Community';
			case 'state':
				return 'State';
			case 'regional':
				return 'Regional';
			case 'national':
				return 'National';
			case 'international':
				return 'International';
			default:
				console.warn(`unrecognized recognition level: "${lvl}"`);
				return lvl;
		}
	};

	const formatAwardType = (type: string): string => {
		switch (type) {
			case 'academic':
				return 'Academic';
			case 'non-academic':
				return 'Non-academic';
			default:
				console.warn(`unrecognized award type: ${type}`);
				return type;
		}
	};
</script>

<UCSection heading="Name of the award or honor" body={activity.name} charLimit={60} />
<UCSection heading="Level of recognition">
	<div class="flex flex-col">
		{#each getRecLevels(activity.level_of_recognition) as recognition}
			<div>{formatRecognitionLevel(recognition)}</div>
		{/each}
	</div>
</UCSection>
<UCSection heading="Type of award" body={formatAwardType(activity.award_type)} />
<GradeLevels {activity} heading="Grade level when awarded" />
<UCSection heading="Award requirements" body={activity.award_req} charLimit={250} />
<UCSection heading="What you did to earn award" body={activity.description} charLimit={350} />
<div class="text-red-600">{activity.comments}</div>
