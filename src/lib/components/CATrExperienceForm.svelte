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
	import { CA_TRANSFER_COUNTRIES } from '$lib/utils/countries';

	let { activity = $bindable() }: { activity: Activity } = $props<{ activity: Activity }>();

	const experienceTypes = [
		'Employment',
		'Research',
		'Volunteer',
		'Extracurricular Activities',
		'Internship'
	];

	const experienceStatuses = ['Full-time', 'Part-time', 'Temporary'];

	const recognitionTypes = [
		{ value: 'compensated', label: 'Compensated' },
		{ value: 'received academic credit', label: 'Received academic credit' },
		{ value: 'volunteer', label: 'Volunteer' }
	];
</script>

<form class="flex flex-grow flex-col gap-4 overflow-auto px-8 pt-4 pb-8 text-sm">
	<div class="flex flex-col gap-2">
		<div class="pb-2 text-lg font-medium">Experience type</div>
		<Label for="type">What type of experience do you want to add?</Label>
		<Select.Root type="single" name="type" bind:value={activity.type}>
			<Select.Trigger class="w-full max-w-[400px] truncate bg-white">
				{activity.type}
			</Select.Trigger>
			<Select.Content class="max-h-[400px] max-w-[400px] overflow-y-auto">
				{#each experienceTypes as experienceType}
					<Select.Item value={experienceType} label={experienceType}>{experienceType}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>

	<Separator class="mt-4" />

	<div class="flex flex-col gap-2">
		<div class="pb-2 text-lg font-medium">Organization</div>
		<Label for="org">Name</Label>
		<SpellcheckTextarea id="org" bind:value={activity.organization} />
		<CharLimit content={activity.organization} limit={255} />

		<Label for="country">Country</Label>
		<Select.Root type="single" name="country" bind:value={activity.country}>
			<Select.Trigger class="w-full max-w-[400px] truncate bg-white">
				{activity.country}
			</Select.Trigger>
			<Select.Content class="max-h-[400px] max-w-[400px] overflow-y-auto">
				{#each CA_TRANSFER_COUNTRIES as country}
					<Select.Item value={country} label={country}>{country}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>

	<Separator class="mt-4" />

	<div class="flex flex-col gap-2">
		<div class="pb-2 text-lg font-medium">Experience Dates</div>
		<Label for="start-date">Start date</Label>
		<Input id="start-date" type="date" class="w-40" bind:value={activity.job_start_date} />

		<Label class="mt-2">Current experience</Label>
		<RadioGroup.Root bind:value={activity.job_is_continuing}>
			<div class="flex items-center gap-3">
				<RadioGroup.Item value="TRUE" id="continue-in-college" />
				<Label for="continue-in-college" class="font-normal">Yes</Label>
			</div>
			<div class="flex items-center gap-3">
				<RadioGroup.Item value="FALSE" id="not-continue-in-college" />
				<Label for="not-continue-in-college" class="font-normal">No</Label>
			</div>
		</RadioGroup.Root>

		{#if activity.job_is_continuing === 'FALSE'}
			<Label for="start-date" class="mt-2">End date</Label>
			<Input id="start-date" type="date" class="w-40" bind:value={activity.job_end_date} />
		{/if}

		<Label class="mt-2" for="status">Status</Label>
		<Select.Root type="single" name="status" bind:value={activity.job_status}>
			<Select.Trigger class="w-full max-w-[400px] truncate bg-white">
				{activity.job_status}
			</Select.Trigger>
			<Select.Content class="max-h-[400px] max-w-[400px] overflow-y-auto">
				{#each experienceStatuses as status}
					<Select.Item value={status} label={status}>{status}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>

	<Separator class="mt-4" />

	<div class="flex flex-col gap-2">
		<div class="pb-2 text-lg font-medium">Experience Details</div>
		<Label for="title">Title</Label>
		<SpellcheckTextarea id="title" bind:value={activity.name} />
		<CharLimit content={activity.name} limit={60} />

		<Label>Type of recognition</Label>
		<div class="flex flex-col gap-2">
			{#each recognitionTypes as { value, label }}
				{@const slug = value.replace(' ', '-')}
				<div class="flex items-center gap-3">
					<Checkbox
						id="rec-${slug}"
						class="bg-white"
						checked={activity.type_of_recognition.has(value)}
						onCheckedChange={(v) => {
							const newSet = new Set(activity.type_of_recognition);
							if (v) {
								newSet.add(value);
							} else {
								newSet.delete(value);
							}
							activity.type_of_recognition = newSet;
						}}
					/>
					<Label for="rec-${slug}" class="font-normal">{label}</Label>
				</div>
			{/each}
		</div>

		<Label for="description" class="mt-2">Description / Key responsibilities</Label>
		<SpellcheckTextarea id="description" bind:value={activity.description} />
		<CharLimit content={activity.description} limit={600} />
	</div>

	<Separator class="mt-4" />

	<div class="flex flex-col gap-2">
		<Label for="comments">Comments</Label>
		<Textarea id="comments" bind:value={activity.comments} spellcheck="true" />
	</div>
</form>
