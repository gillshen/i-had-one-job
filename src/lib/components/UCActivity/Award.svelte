<script lang="ts">
	import type { Activity } from '$lib/types';
	import CharLimitSpan from '$lib/components/CharLimitSpan.svelte';
	import UCSection from './UCSection.svelte';
	import GradeLevels from './GradeLevels.svelte';
	import GradeLevelsCompact from './GradeLevelsCompact.svelte';
	import { orderRecognitions } from '$lib/utils/sorting';

	type Props = {
		activity: Activity;
		compact?: boolean;
	};
	let { activity, compact = false }: Props = $props();

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

{#if compact}
	<div class="grid grid-cols-[1fr_min(33%,140px)] gap-4">
		<div>
			<div class="font-semibold"><CharLimitSpan text={activity.name} charLimit={60} /></div>
			<div>
				<span class="font-medium text-[#1295D8]">Requirements:</span>
				<CharLimitSpan text={activity.award_req} charLimit={250} />
			</div>
			<div>
				<span class="font-medium text-[#1295D8]">Action:</span>
				<CharLimitSpan text={activity.description} charLimit={350} />
			</div>
		</div>
		<div>
			<div>{getRecLevels(activity.level_of_recognition).join(', ')}</div>
			<div>{formatAwardType(activity.award_type)}</div>
			<GradeLevelsCompact {activity} />
		</div>
	</div>
{:else}
	<UCSection heading="Name of the award or honor" body={activity.name} charLimit={60} />
	<UCSection heading="Level of recognition">
		{#if Array.from(activity.level_of_recognition).length}
			<div class="flex flex-col">
				{#each getRecLevels(activity.level_of_recognition) as recognition}
					<div>{formatRecognitionLevel(recognition)}</div>
				{/each}
			</div>
		{/if}
	</UCSection>
	<UCSection heading="Type of award" body={formatAwardType(activity.award_type)} />
	<GradeLevels {activity} heading="Grade level when awarded" />
	<UCSection heading="Award requirements" body={activity.award_req} charLimit={250} />
	<UCSection heading="What you did to earn award" body={activity.description} charLimit={350} />
{/if}
