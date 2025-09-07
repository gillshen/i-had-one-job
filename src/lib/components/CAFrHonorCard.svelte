<script lang="ts">
	import * as Card from '$lib/components/ui/card/index';
	import Button from '$lib/components/ui/button/button.svelte';
	import CharLimitSpan from '$lib/components/CharLimitSpan.svelte';
	import Comments from '$lib/components/Comments.svelte';
	import { MoveUp, MoveDown, Trash } from '@lucide/svelte';
	import type { Honor } from '$lib/types';
	import { orderGradeLevels, orderRecognitions } from '$lib/utils/sorting';

	type Props = {
		honor: Honor;
		previewMode?: boolean;
		isSelected: boolean;
		onclick: () => void;
		onMoveUp: () => void;
		onMoveDown: () => void;
		onDelete: () => void;
	};
	let {
		honor,
		previewMode: preview = false,
		isSelected: selected,
		onclick,
		onMoveUp,
		onMoveDown,
		onDelete
	}: Props = $props();

	const formatGradeLevels = (gradeLevels: Set<string>): string =>
		Array.from(gradeLevels)
			.sort(orderGradeLevels)
			.map((grade) => (grade === 'pg' ? 'Post-graduate' : grade))
			.join(', ');

	const formatRecognitionLevels = (recLevels: Set<string>): string => {
		return Array.from(recLevels)
			.map((lvl) => lvl.toLowerCase().trim())
			.sort(orderRecognitions)
			.map(formatRecognitionLevel)
			.join(', ');
	};

	const formatRecognitionLevel = (lvl: string): string => {
		switch (lvl) {
			case 'school':
				return 'School';
			case 'state/regional':
				return 'State/Regional';
			case 'national':
				return 'National';
			case 'international':
				return 'International';
			default:
				console.warn(`unrecognized recognition level: ${lvl}`);
				return lvl;
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
	<Card.Content class="my-0 flex flex-col py-0">
		<div class=" grid grid-cols-[12px_3fr_2fr_2fr_2fr] gap-x-4 gap-y-2">
			<div class="min-w-0 font-medium">{honor.order}</div>
			<div class="flex min-w-0 flex-col gap-2">
				<div class="font-medium">
					<CharLimitSpan text={honor.title} charLimit={100} />
				</div>
			</div>
			<div class="min-w-0">{formatRecognitionLevels(honor.level_of_recognition)}</div>
			<div class="min-w-0">{formatGradeLevels(honor.grade_level)}</div>
			<div class="flex gap-1 font-normal opacity-0 transition-opacity group-hover:opacity-200">
				{#if !preview}
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
				{/if}
			</div>
			{#if honor.comments && !preview}
				<div class="col-span-3 col-start-2">
					<Comments text={honor.comments} />
				</div>
			{/if}
		</div>
	</Card.Content>
</Card.Root>
