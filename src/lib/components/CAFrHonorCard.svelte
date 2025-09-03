<script lang="ts">
	import * as Card from '$lib/components/ui/card/index';
	import Button from '$lib/components/ui/button/button.svelte';
	import { MoveUp, MoveDown, Trash } from '@lucide/svelte';
	import type { Honor } from '$lib/types';
	import { orderGradeLevels, orderRecognitions } from '$lib/utils/sorting';

	let {
		honor,
		isSelected: selected,
		onclick,
		onMoveUp,
		onMoveDown,
		onDelete
	} = $props<{
		honor: Honor;
		isSelected: boolean;
		onclick: () => void;
		onMoveUp: () => void;
		onMoveDown: () => void;
		onDelete: () => void;
	}>();

	const formatGradeLevels = (gradeLevels: Set<string>): string => {
		const arr = Array.from(gradeLevels).sort(orderGradeLevels);
		return arr.join(', ');
	};

	const formatRecognitionLevels = (recLevels: Set<string>): string => {
		return Array.from(recLevels)
			.map((lvl) => lvl.toLowerCase())
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
	class={['card group cursor-default gap-0 py-4 text-sm shadow-none', { selected }]}
	{onclick}
>
	<Card.Content class="my-0 flex flex-col py-0">
		<div class=" grid grid-cols-[12px_3fr_2fr_2fr_2fr] gap-x-4 gap-y-2">
			<div class="min-w-0 font-medium">{honor.order}</div>
			<div class="flex min-w-0 flex-col gap-2">
				<div class="font-medium">
					<span>{honor.title.slice(0, 100)}</span><span class="over-limit"
						>{honor.title.slice(100)}</span
					>
				</div>
				{#if honor.comments}
					<div class="col-span-2 text-red-600">{honor.comments}</div>
				{/if}
			</div>
			<div class="min-w-0">{formatRecognitionLevels(honor.level_of_recognition)}</div>
			<div class="min-w-0">{formatGradeLevels(honor.grade_level)}</div>
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
		</div>
	</Card.Content>
</Card.Root>
