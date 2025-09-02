<script lang="ts">
	import * as Card from '$lib/components/ui/card/index';
	import type { Activity } from '$lib/types';
	import { orderGradeLevels, orderTimings } from '$lib/utils/sorting';

	let {
		activity,
		isSelected: selected,
		onclick
	} = $props<{ activity: Activity; isSelected: boolean; onclick: () => void }>();

	const formatGradeLevels = (gradeLevels: Set<string>): string => {
		const arr = Array.from(gradeLevels).sort(orderGradeLevels);
		return arr.join(', ');
	};

	const formatWhen = (when: Set<string>): string => {
		return Array.from(when)
			.map((t) => t.toLowerCase())
			.sort(orderTimings)
			.map(formatTiming)
			.join(', ');
	};

	const formatTiming = (timing: string): string => {
		switch (timing) {
			case 'all year':
				return 'Year';
			case 'during school year':
				return 'School';
			case 'during school break':
				return 'Break';
			default:
				console.warn(`unrecognized timing: ${timing}`);
				return timing;
		}
	};
</script>

<Card.Root class={['card cursor-default gap-2 text-sm shadow-none', { selected }]} {onclick}>
	<Card.Header class="mb-0">
		<Card.Title class="text-xl font-semibold">{activity.order}. {activity.type}</Card.Title>
	</Card.Header>
	<Card.Content class="mt-0">
		<div class="grid grid-cols-3 gap-2">
			<div class="flex flex-col">
				<div>{formatGradeLevels(activity.grade_level)}</div>
				<div>{formatWhen(activity.when)}</div>
				<div>{activity.hours_per_week ?? 'x'} hr/wk, {activity.weeks_per_year ?? 'x'} wk/yr</div>
			</div>
			<div class="col-span-2 flex flex-col">
				<div class="mb-1 font-semibold">{activity.position}, {activity.organization}</div>
				<div>{activity.description}</div>
				{#if activity.comments}
					<div class="mt-2 text-red-600">{activity.comments}</div>
				{/if}
			</div>
		</div>
	</Card.Content>
</Card.Root>
