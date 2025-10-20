<script lang="ts">
	import * as Card from '$lib/components/ui/card/index';
	import Button from '$lib/components/ui/button/button.svelte';
	import CharLimitSpan from '$lib/components/CharLimitSpan.svelte';
	import Comments from '$lib/components/Comments.svelte';
	import { MoveUp, MoveDown, Trash } from '@lucide/svelte';
	import type { Honor } from '$lib/types';

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

	const formatDate = (date: string): string => {
		if (!date) return '';
		return new Date(date)
			.toLocaleDateString('en-US', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric'
			})
			.replace(/\//g, '-');
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
		<div class="grid grid-cols-[min(50%,450px)_1fr] items-start gap-x-4 gap-y-2">
			<div class="col-span-2 flex justify-between gap-4">
				<div class="min-w-0 text-lg font-semibold">{honor.order}. {honor.type}</div>
				<div
					class="flex justify-end gap-1 font-normal opacity-0 transition-opacity group-hover:opacity-200"
				>
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
			</div>
			<div class="grid grid-cols-[min(128px,40%)_1fr] gap-x-2 gap-y-1">
				<div class="font-medium">Name:</div>
				<div>
					<CharLimitSpan text={honor.title} charLimit={60} />
				</div>
				<div class="font-medium">Organization:</div>
				<div>
					<CharLimitSpan text={honor.org} charLimit={60} />
				</div>
				<div class="font-medium">Date:</div>
				<div>{formatDate(honor.date)}</div>
			</div>
			<div>
				<div class="pb-1 font-medium">Description:</div>
				<div>
					<CharLimitSpan text={honor.description} charLimit={600} />
				</div>
			</div>

			{#if honor.comments && !preview}
				<div class="col-span-2">
					<Comments text={honor.comments} />
				</div>
			{/if}
		</div>
	</Card.Content>
</Card.Root>
