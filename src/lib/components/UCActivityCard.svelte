<script lang="ts">
	import * as Card from '$lib/components/ui/card/index';
	import Button from '$lib/components/ui/button/button.svelte';
	import { MoveUp, MoveDown, Trash } from '@lucide/svelte';
	import { ucActivityCategoryMap, type Activity } from '$lib/types';
	import * as UC from '$lib/components/UCActivity';
	import Comments from '$lib/components/Comments.svelte';

	type Props = {
		activity: Activity;
		previewMode?: boolean;
		compactMode?: boolean;
		index: number;
		isSelected: boolean;
		onclick: () => void;
		onMoveUp: () => void;
		onMoveDown: () => void;
		onDelete: () => void;
	};
	let {
		activity,
		previewMode: preview = false,
		compactMode: compact = false,
		index,
		isSelected: selected,
		onclick,
		onMoveUp,
		onMoveDown,
		onDelete
	}: Props = $props();
</script>

<Card.Root
	class={['card uc group cursor-default gap-0 py-4 text-sm shadow-none', { selected, preview }]}
	{onclick}
>
	<Card.Header class="mb-0">
		<Card.Title class="flex items-center justify-between">
			<div class="text-lg font-semibold">
				{index + 1}. {ucActivityCategoryMap[activity.uc_category]}
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
	<Card.Content class="felx-col mt-0 flex gap-2">
		<div class="flex w-full flex-col gap-2">
			{#if activity.uc_category === 'award'}
				<UC.Award {activity} {compact} />
			{:else if activity.uc_category === 'edu-prep'}
				<UC.EduPrep {activity} {compact} />
			{:else if activity.uc_category === 'ec'}
				<UC.EC {activity} {compact} />
			{:else if activity.uc_category === 'course'}
				<UC.Course {activity} {compact} />
			{:else if activity.uc_category === 'volunteer'}
				<UC.Volunteer {activity} {compact} />
			{:else if activity.uc_category === 'work'}
				<UC.Work {activity} {compact} />
			{/if}
			{#if activity.comments && !preview}
				<Comments text={activity.comments} />
			{/if}
		</div>
	</Card.Content>
</Card.Root>
