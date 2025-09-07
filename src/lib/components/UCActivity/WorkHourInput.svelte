<script lang="ts">
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import type { Activity } from '$lib/types';
	import { orderUCWorkHours } from '$lib/utils/sorting';

	type Props = {
		activity: Activity;
	};
	let { activity = $bindable() }: Props = $props();

	const gradeLevels = [
		{ value: '9', label: '9th grade' },
		{ value: '10', label: '10th grade' },
		{ value: '11', label: '11th grade' },
		{ value: '12', label: '12th grade' },
		{ value: 'PG', label: 'After 12th grade' }
	];

	const updateWorkHours = (grade: string, field: 'school' | 'summer', value: string) => {
		const safeValue = value.replace(/[^0-9.]/, '');
		activity.work_hours = activity.work_hours.map((wh) =>
			wh.grade === grade ? { ...wh, [field]: safeValue } : wh
		);
	};
</script>

<div class="flex flex-col gap-2">
	<Label>When did you work at this job?</Label>
	<div class="uc-helper">
		We'd like to know when you worked at this job and the number of hours per week you worked. It's
		ok to estimate, but try to be as accurate as possible. If you worked during the summer, select
		the grade year before that summer.
	</div>

	<div class="flex flex-col gap-2">
		{#each gradeLevels as { value, label }}
			<div class="flex flex-col gap-2">
				<div class="flex items-center gap-3">
					<Checkbox
						id="grade-${value}"
						class="bg-white"
						checked={!!activity.work_hours.find((wh) => wh.grade === value)}
						onCheckedChange={(v) => {
							const newArray = [...activity.work_hours];
							if (v) {
								newArray.push({ grade: value, school: '', summer: '' });
								newArray.sort(orderUCWorkHours);
								activity.work_hours = [...newArray];
							} else {
								const index = newArray.findIndex((wh) => wh.grade === value);
								activity.work_hours = [...newArray.slice(0, index), ...newArray.slice(index + 1)];
							}
						}}
					/>
					<Label for="grade-${value}" class="font-normal">{label}</Label>
				</div>

				{#if activity.work_hours.find((wh) => wh.grade === value)}
					{@const wh = activity.work_hours.find((wh) => wh.grade === value)}
					<div class="flex flex-wrap gap-x-6 gap-y-2 pl-7">
						<div class="flex flex-col gap-2">
							<Label for="${value}-school-hours" class="font-normal">During school year</Label>
							<Input
								id="${value}-school-hours"
								value={wh!.school}
								oninput={(e) => updateWorkHours(value, 'school', e.currentTarget.value)}
								maxlength={5}
							/>
						</div>
						<div class="flex flex-col gap-2">
							<Label for="${value}-summer-hours" class="font-normal">During summer</Label>
							<Input
								id="${value}-summer-hours"
								value={wh!.summer}
								oninput={(e) => updateWorkHours(value, 'summer', e.currentTarget.value)}
								maxlength={5}
							/>
						</div>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>
