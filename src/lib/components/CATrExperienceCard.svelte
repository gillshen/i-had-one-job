<script lang="ts">
	import * as Card from '$lib/components/ui/card/index';
	import Button from '$lib/components/ui/button/button.svelte';
	import CharLimitSpan from '$lib/components/CharLimitSpan.svelte';
	import Comments from '$lib/components/Comments.svelte';
	import { MoveUp, MoveDown, Trash } from '@lucide/svelte';
	import type { Activity } from '$lib/types';
	import { orderRecognitionTypes } from '$lib/utils/sorting';

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

	const formatRecognitionType = (recType: string): string => {
		switch (recType) {
			case 'compensated':
				return 'Compensated';
			case 'received academic credit':
				return 'Received Academic Credit';
			case 'volunteer':
				return 'Volunteer';
			default:
				return recType;
		}
	};

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
	<Card.Header class="mb-0 pb-0">
		<Card.Title class="mb-0 flex items-center justify-between">
			<div class="text-lg font-semibold">
				{activity.order}
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
		<div class="grid grid-cols-[min(50%,450px)_1fr] items-start gap-x-4 gap-y-2">
			<div class="grid grid-cols-[min(128px,40%)_1fr] gap-x-2 gap-y-1">
				<div class="font-medium">Experience Type:</div>
				<div>{activity.type}</div>
				<div class="font-medium">Recognition Type:</div>
				<div>
					{Array.from(activity.type_of_recognition)
						.sort(orderRecognitionTypes)
						.map(formatRecognitionType)
						.join(', ')}
				</div>
				<div class="font-medium">Title:</div>
				<div><CharLimitSpan text={activity.name} charLimit={60} /></div>
				<div class="font-medium">Employer:</div>
				<div class="flex flex-col">
					<div><CharLimitSpan text={activity.organization} charLimit={255} /></div>
					<div>{activity.country}</div>
				</div>
				<!-- <div class="font-medium">Supervisor:</div> -->
			</div>
			<div class="grid grid-cols-[min(128px,40%)_1fr] gap-x-2 gap-y-1">
				<div class="font-medium">Experience Dates:</div>
				<div>
					{formatDate(activity.job_start_date) || '-'} / {activity.job_is_continuing === 'TRUE'
						? 'Current'
						: formatDate(activity.job_end_date) || '-'}
				</div>
				<div class="font-medium">Status:</div>
				<div>{activity.job_status}</div>
				<div class="font-medium">Experience Details:</div>
				<div><CharLimitSpan text={activity.description} charLimit={600} /></div>
			</div>
			{#if activity.comments && !preview}
				<div class="col-span-2">
					<Comments text={activity.comments} />
				</div>
			{/if}
		</div>
	</Card.Content>
</Card.Root>
