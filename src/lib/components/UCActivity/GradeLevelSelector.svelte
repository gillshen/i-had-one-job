<script lang="ts">
	import Label from '$lib/components/ui/label/label.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import type { Activity } from '$lib/types';

	type Props = {
		activity: Activity;
		label: string;
		helper?: string;
	};
	let { activity = $bindable(), label, helper = '' }: Props = $props();

	const gradeLevels = [
		{ value: '9', label: '9th grade' },
		{ value: '10', label: '10th grade' },
		{ value: '11', label: '11th grade' },
		{ value: '12', label: '12th grade' },
		{ value: 'PG', label: 'After 12th grade' }
	];
</script>

<div class="flex flex-col gap-2">
	<Label>{label}</Label>
	{#if helper}
		<div class="uc-helper">{helper}</div>
	{/if}
	<div class="flex flex-col gap-2">
		{#each gradeLevels as { value, label }}
			<div class="flex items-center gap-3">
				<Checkbox
					id="grade-${value}"
					class="bg-white"
					checked={activity.grade_level.has(value)}
					onCheckedChange={(v) => {
						const newSet = new Set(activity.grade_level);
						if (v) {
							newSet.add(value);
						} else {
							newSet.delete(value);
						}
						activity.grade_level = newSet;
					}}
				/>
				<Label for="grade-${value}" class="font-normal">{label}</Label>
			</div>
		{/each}
	</div>
</div>
