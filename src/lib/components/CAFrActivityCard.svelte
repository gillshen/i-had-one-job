<script lang="ts">
	import * as Card from '$lib/components/ui/card/index';
	import Button from '$lib/components/ui/button/button.svelte';
	import { MoveUp, MoveDown, Trash } from '@lucide/svelte';
	import type { Activity } from '$lib/types';
	import { orderGradeLevels, orderTimings } from '$lib/utils/sorting';

	type Props = {
		activity: Activity;
		isSelected: boolean;
		onclick: () => void;
		onMoveUp: () => void;
		onMoveDown: () => void;
		onDelete: () => void;
	};
	let { activity, isSelected: selected, onclick, onMoveUp, onMoveDown, onDelete }: Props = $props();

	const formatGradeLevels = (gradeLevels: Set<string>): string => {
		const arr = Array.from(gradeLevels).sort(orderGradeLevels);
		return arr.join(', ');
	};

	const formatWhen = (when: Set<string>): string => {
		return Array.from(when)
			.map((t) => t.toLowerCase().trim())
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

<Card.Root
	class={['card group cursor-default gap-0 py-4 text-sm shadow-none', { selected }]}
	{onclick}
>
	<Card.Header class="mb-0 pb-0">
		<Card.Title class="mb-0 flex items-center justify-between">
			<div class="text-lg font-semibold text-[#0B6DBD]">
				{activity.order}. {activity.type}
			</div>
			<div class="flex gap-1 font-normal opacity-0 transition-opacity group-hover:opacity-200">
				<Button
					onclick={(e) => {
						e.stopPropagation();
						onMoveUp();
					}}
					variant="ghost"
					size="icon"
					class="size-6 cursor-pointer rounded-full hover:bg-white hover:shadow-md"
				>
					<MoveUp class="size-3" />
				</Button>
				<Button
					onclick={(e) => {
						e.stopPropagation();
						onMoveDown();
					}}
					variant="ghost"
					size="icon"
					class="size-6 cursor-pointer rounded-full hover:bg-white hover:shadow-md"
				>
					<MoveDown class="size-3" />
				</Button>
				<Button
					onclick={(e) => {
						e.stopPropagation();
						onDelete();
					}}
					variant="ghost"
					size="icon"
					class="size-6 cursor-pointer rounded-full hover:bg-white hover:text-red-600 hover:shadow-md"
				>
					<Trash class="size-3" />
				</Button>
			</div>
		</Card.Title>
	</Card.Header>
	<Card.Content class="mt-0 pt-0">
		<div class="grid grid-cols-[min(140px,33%)_1fr_1fr] gap-4">
			<div class="flex flex-col">
				<div>{formatGradeLevels(activity.grade_level)}</div>
				<div>{formatWhen(activity.when)}</div>
				<div>{activity.hours_per_week || 'x'} hr/wk, {activity.weeks_per_year || 'x'} wk/yr</div>
			</div>
			<div class="col-span-2 flex flex-col">
				<div class="font-semibold">
					<span>{activity.position.slice(0, 50)}</span><span class="over-limit"
						>{activity.position.slice(50)}</span
					>, <span>{activity.organization.slice(0, 100)}</span><span class="over-limit"
						>{activity.organization.slice(100)}</span
					>
				</div>
				<div>
					<span>{activity.description.slice(0, 150)}</span><span class="over-limit"
						>{activity.description.slice(150)}</span
					>
				</div>
				{#if activity.comments}
					<div class="mt-2 text-red-600">{activity.comments}</div>
				{/if}
			</div>
		</div>
	</Card.Content>
</Card.Root>
