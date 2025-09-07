<script lang="ts">
	import * as Card from '$lib/components/ui/card/index';
	import Button from '$lib/components/ui/button/button.svelte';
	import CharLimitSpan from '$lib/components/CharLimitSpan.svelte';
	import Comments from '$lib/components/Comments.svelte';
	import { MoveUp, MoveDown, Trash } from '@lucide/svelte';
	import type { Activity } from '$lib/types';
	import { orderGradeLevels, orderTimings } from '$lib/utils/sorting';

	type Props = {
		activity: Activity;
		previewMode?: boolean;
		isSelected: boolean;
		onclick: () => void;
		onMoveUp: () => void;
		onMoveDown: () => void;
		onDelete: () => void;
	};
	let {
		activity,
		previewMode: preview = false,
		isSelected: selected,
		onclick,
		onMoveUp,
		onMoveDown,
		onDelete
	}: Props = $props();

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
	class={[
		'card common-app group cursor-default gap-0 py-4 text-sm shadow-none',
		{ selected, preview }
	]}
	{onclick}
>
	<Card.Header class="mb-0 pb-0">
		<Card.Title class="mb-0 flex items-center justify-between">
			<div class="text-lg font-semibold text-[#0B6DBD]">
				{activity.order}. {activity.type}
			</div>
			{#if !preview}
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
			{/if}
		</Card.Title>
	</Card.Header>
	<Card.Content class="mt-0 pt-0">
		<div class="grid grid-cols-[min(140px,33%)_1fr_1fr] gap-4">
			<div class="flex flex-col">
				<div>{formatGradeLevels(activity.grade_level)}</div>
				<div>{formatWhen(activity.when)}</div>
				<div>
					{#if isNaN(parseInt(activity.hours_per_week))}
						<span class="missing">{activity.hours_per_week || '??'}</span>
					{:else}
						{activity.hours_per_week}
					{/if}
					hr/wk,
					{#if isNaN(parseInt(activity.weeks_per_year))}
						<span class="missing">{activity.weeks_per_year || '??'}</span>
					{:else}
						{activity.weeks_per_year}
					{/if}
					wk/yr
				</div>
				<div>
					{activity.continue_in_college === 'TRUE' ? 'Continue' : ''}
				</div>
			</div>
			<div class="col-span-2 flex flex-col">
				<div class="font-semibold">
					<CharLimitSpan text={activity.position} charLimit={50} />, <CharLimitSpan
						text={activity.organization}
						charLimit={100}
					/>
				</div>
				<div>
					<CharLimitSpan text={activity.description} charLimit={150} />
				</div>
				{#if activity.comments && !preview}
					<div class="mt-2">
						<Comments text={activity.comments} />
					</div>
				{/if}
			</div>
		</div>
	</Card.Content>
</Card.Root>
