<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	import type { Activity } from '$lib/types';
	import SpellcheckTextarea from '$lib/components/SpellcheckTextarea.svelte';
	import CharLimit from '$lib/components/CharLimit.svelte';

	let { activity = $bindable() }: { activity: Activity } = $props<{ activity: Activity }>();

	const activityTypes = [
		'Academic',
		'Art',
		'Athletics: Club',
		'Athletics: JV/Varsity',
		'Career Oriented',
		'Community Service (Volunteer)',
		'Computer/Technology',
		'Cultural',
		'Dance',
		'Debate/Speech',
		'Environmental',
		'Family Responsibilities',
		'Foreign Exchange',
		'Foreign Language',
		'Internship',
		'Journalism/Publication',
		'Junior R.O.T.C.',
		'LGBT',
		'Music: Instrumental',
		'Music: Vocal',
		'Religious',
		'Research',
		'Robotics',
		'School Spirit',
		'Science/Math',
		'Social Justice',
		'Student Govt./Politics',
		'Theater/Drama',
		'Work (Paid)',
		'Other Club/Activity'
	];

	const gradeLevels = [
		{ value: '9', label: '9' },
		{ value: '10', label: '10' },
		{ value: '11', label: '11' },
		{ value: '12', label: '12' },
		{ value: 'PG', label: 'Post-graduate' }
	];

	const timings = [
		{ value: 'during school year', label: 'During school year' },
		{ value: 'during school break', label: 'During school break' },
		{ value: 'all year', label: 'All year' }
	];
</script>

<form class="flex flex-grow flex-col gap-6 overflow-auto px-8 pt-4 pb-8 text-sm">
	<div class="flex flex-col gap-2">
		<Label for="type">Activity type</Label>
		<Select.Root type="single" name="type" bind:value={activity.type}>
			<Select.Trigger class="w-full max-w-[400px] truncate bg-white">
				{activity.type}
			</Select.Trigger>
			<Select.Content class="max-h-[400px] max-w-[400px] overflow-y-auto">
				{#each activityTypes as activityType}
					<Select.Item value={activityType} label={activityType}>{activityType}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>

	<div class="flex flex-col gap-2">
		<Label for="position">Position/Leadership description</Label>
		<SpellcheckTextarea id="position" bind:value={activity.position} />
		<CharLimit content={activity.position} limit={50} />
	</div>

	<div class="flex flex-col gap-2">
		<Label for="title">Organization</Label>
		<SpellcheckTextarea id="title" bind:value={activity.organization} />
		<CharLimit content={activity.organization} limit={100} />
	</div>

	<div class="flex flex-col gap-2">
		<Label for="description"
			>Please describe this activity, including what you accomplished and any recognition you
			received, etc.</Label
		>
		<SpellcheckTextarea id="description" bind:value={activity.description} />
		<CharLimit content={activity.description} limit={150} />
	</div>

	<div class="flex flex-col gap-2">
		<Label>Participation grade levels</Label>
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

	<div class="flex flex-col gap-2">
		<Label>Timing of participation</Label>
		<div class="flex flex-col gap-2">
			{#each timings as { value, label }}
				{@const slug = value.replace(' ', '-')}
				<div class="flex items-center gap-3">
					<Checkbox
						id="timing-${slug}"
						class="bg-white"
						checked={activity.when.has(value)}
						onCheckedChange={(v) => {
							const newSet = new Set(activity.when);
							if (v) {
								newSet.add(value);
							} else {
								newSet.delete(value);
							}
							activity.when = newSet;
						}}
					/>
					<Label for="grade-${slug}" class="font-normal">{label}</Label>
				</div>
			{/each}
		</div>
	</div>

	<div class="flex flex-wrap gap-6">
		<div class="flex flex-col gap-2">
			<Label for="hours-per-week">Hours spent per week</Label>
			<Input id="hours-per-week" bind:value={activity.hours_per_week} maxlength={5} />
		</div>

		<div class="flex flex-col gap-2">
			<Label for="weeks-per-year">Weeks spent per year</Label>
			<Input id="weeks-per-year" bind:value={activity.weeks_per_year} maxlength={5} />
		</div>
	</div>

	<div class="flex flex-col gap-2">
		<Label>I intend to participate in a similar activity in college.</Label>
		<RadioGroup.Root bind:value={activity.continue_in_college}>
			<div class="flex items-center gap-3">
				<RadioGroup.Item value="TRUE" id="continue-in-college" />
				<Label for="continue-in-college" class="font-normal">Yes</Label>
			</div>
			<div class="flex items-center gap-3">
				<RadioGroup.Item value="FALSE" id="not-continue-in-college" />
				<Label for="not-continue-in-college" class="font-normal">No</Label>
			</div>
		</RadioGroup.Root>
	</div>

	<Separator class="mt-4" />

	<div class="flex flex-col gap-2">
		<Label for="comments">Comments</Label>
		<Textarea id="comments" bind:value={activity.comments} spellcheck="true" />
	</div>
</form>
