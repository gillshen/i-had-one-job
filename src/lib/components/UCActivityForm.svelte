<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	import { ucActivityCategory, ucActivityCategoryMap, type Activity } from '$lib/types';
	import CharLimit from '$lib/components/CharLimit.svelte';
	import * as UC from '$lib/components/UCActivity';

	let { activity = $bindable() }: { activity: Activity } = $props<{ activity: Activity }>();

	const recognitionLevels = [
		{ value: 'school', label: 'School' },
		{ value: 'city/community', label: 'City/Community' },
		{ value: 'state', label: 'State' },
		{ value: 'regional', label: 'Regional' },
		{ value: 'national', label: 'National' },
		{ value: 'international', label: 'International' }
	];

	let programChoice = $state(
		UC.EDU_PREP_PROGRAMS.includes(activity.name) ? activity.name : 'Other'
	);

	$effect(() => {
		if (activity.uc_category === 'edu-prep' && programChoice !== 'Other') {
			activity.name = programChoice;
		}
	});
</script>

<form class="flex flex-grow flex-col gap-6 overflow-auto px-8 pt-4 pb-8 text-sm">
	<div class="flex flex-col gap-2">
		<Label for="type">Category</Label>
		<Select.Root type="single" name="uc_category" bind:value={activity.uc_category}>
			<Select.Trigger class="w-full bg-white">
				{ucActivityCategoryMap[activity.uc_category]}
			</Select.Trigger>
			<Select.Content class="max-h-[400px]">
				{#each Array.from(ucActivityCategory) as category}
					{@const label = ucActivityCategoryMap[category] || 'Select a category...'}
					<Select.Item value={category} {label} disabled={!category}>{label}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>

	{#if activity.uc_category === 'award'}
		<div class="flex flex-col gap-2">
			<Label for="name">What's the name of the award or honor?</Label>
			<Input id="name" bind:value={activity.name} spellcheck="true" />
			<CharLimit content={activity.name} limit={60} />
		</div>
		<div class="flex flex-col gap-2">
			<Label>Level of recognition</Label>
			<div class="flex flex-col gap-2">
				{#each recognitionLevels as { value, label }}
					<div class="flex items-center gap-3">
						<Checkbox
							id="rec-${value}"
							class="bg-white"
							checked={activity.level_of_recognition.has(value)}
							onCheckedChange={(v) => {
								const newSet = new Set(activity.level_of_recognition);
								if (v) {
									newSet.add(value);
								} else {
									newSet.delete(value);
								}
								activity.level_of_recognition = newSet;
							}}
						/>
						<Label for="rec-${value}" class="font-normal">{label}</Label>
					</div>
				{/each}
			</div>
		</div>
		<div class="flex flex-col gap-2">
			<Label>Type of award or honor</Label>
			<RadioGroup.Root bind:value={activity.award_type}>
				<div class="flex items-center gap-3">
					<RadioGroup.Item value="academic" id="type-academic" />
					<Label for="type-academic" class="font-normal"
						>Academic (for example: Honor societies, academic competitions &amp; programs,
						grade-based &amp; department awards)</Label
					>
				</div>
				<div class="flex items-center gap-3">
					<RadioGroup.Item value="non-academic" id="type-non-academic" />
					<Label for="type-non-academic" class="font-normal"
						>Non-academic (for example: Athletics, leadership, volunteering/community service)</Label
					>
				</div>
			</RadioGroup.Root>
		</div>
		<UC.GradeLevelSelector
			bind:activity
			label="When did you receive it?"
			helper="If you received an award during the summer, select the grade you were in before that summer."
		/>
		<div class="flex flex-col gap-2">
			<Label for="award-req">What are the eligibility requirements for this award or honor?</Label>
			<div class="uc-helper">
				For example: How are award recipients chosen? How many people are selected to receive the
				award? Is there an application or nomination for the award?
			</div>
			<Textarea id="award-req" bind:value={activity.award_req} spellcheck="true" />
			<CharLimit content={activity.award_req} limit={250} />
		</div>
		<div class="flex flex-col gap-2">
			<Label for="description">What did you do to achieve this award or honor?</Label>
			<div class="uc-helper">
				We'd like to understand what it took - on your part - to achieve this award. For instance:
				Were there multiple competitions that you had to participate in? How much time did you
				dedicate to winning this award?
			</div>
			<Textarea id="description" bind:value={activity.description} spellcheck="true" />
			<CharLimit content={activity.description} limit={350} />
		</div>
	{:else if activity.uc_category === 'edu-prep'}
		<div class="flex flex-col gap-2">
			<Label>What was the program name?</Label>
			<!-- let user choose from a Select widget; if the user chooses "Other", show an Input and let user type -->
			<!-- update activity.name with the selected value if it's not "Other"; otherwise update it with the value of the Input -->
			<Select.Root type="single" bind:value={programChoice}>
				<Select.Trigger class="w-full max-w-[400px] truncate bg-white">
					{programChoice}
				</Select.Trigger>
				<Select.Content class="max-h-[400px] max-w-[400px] overflow-auto">
					{#each UC.EDU_PREP_PROGRAMS as program}
						<Select.Item value={program} label={program}>{program}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
			{#if programChoice === 'Other'}
				<div class="mt-2 flex flex-col gap-2">
					<Label for="other-program">Program name</Label>
					<Input id="other-program" bind:value={activity.name} spellcheck="true" />
					<CharLimit content={activity.name} limit={60} />
				</div>
			{/if}
		</div>
		<div class="flex flex-col gap-2">
			<Label for="program-description">Briefly describe the program.</Label>
			<div class="uc-helper">
				Think about the program's main focus, your experience, and what you accomplished and learned
				while participating in the program.
			</div>
			<Textarea
				id="program-description"
				bind:value={activity.program_description}
				spellcheck="true"
			/>
			<CharLimit content={activity.program_description} limit={350} />
		</div>
		<UC.GradeLevelSelector
			bind:activity
			label="When did you participate in the program?"
			helper="If you participated in the program during the summer, select the grade you were in before
				that summer."
		/>
		<UC.TimeCommitmentInput bind:activity label="How much time did you spend in the program?" />
	{:else if activity.uc_category === 'ec'}
		<div class="flex flex-col gap-2">
			<Label for="name">What's the name of the activity?</Label>
			<Input id="name" bind:value={activity.name} spellcheck="true" />
			<CharLimit content={activity.name} limit={60} />
		</div>
		<div class="flex flex-col gap-2">
			<Label for="description">What did you do?</Label>
			<div class="uc-helper">
				Think about your experience, and what you accomplished and learned. We'd also like to know
				if you've held a leadership role, which can mean more than just a title — it can mean being
				a mentor to others, acting as a point-person in charge of a specific task, or taking a lead
				role in organizing an event or project.
			</div>
			<Textarea id="description" bind:value={activity.description} spellcheck="true" />
			<CharLimit content={activity.description} limit={350} />
		</div>
		<UC.GradeLevelSelector
			bind:activity
			label="When did you participate in this activity?"
			helper="If you participated during the summer, select the grade you were in before that summer."
		/>
		<UC.TimeCommitmentInput
			bind:activity
			label="How much time did you spend on this activity?"
			helper="It's ok to estimate, but try to be as accurate as possible."
		/>
	{:else if activity.uc_category === 'course'}
		<div class="flex flex-col gap-2">
			<Label for="name">What was the course name?</Label>
			<Input id="name" bind:value={activity.name} spellcheck="true" />
			<CharLimit content={activity.name} limit={60} />
		</div>
		<div class="flex flex-col gap-2">
			<Label for="course-description">Briefly describe the course.</Label>
			<div class="uc-helper">
				What program or school offered the course? Also, think about describing the major themes or
				topics the course covered, as well as what knowledge or skills you learned.
			</div>
			<Textarea
				id="course-description"
				bind:value={activity.program_description}
				spellcheck="true"
			/>
			<CharLimit content={activity.program_description} limit={350} />
		</div>
		<UC.GradeLevelSelector
			bind:activity
			label="When did you take this course?"
			helper="If you took this course during the summer, select the grade you were in before that summer."
		/>
		<UC.TimeCommitmentInput
			bind:activity
			label="How much time did you spend in class?"
			helper="It's ok to estimate, but try to be as accurate as possible."
		/>
	{:else if activity.uc_category === 'volunteer'}
		<div class="flex flex-col gap-2">
			<Label for="name"
				>What's the name of the organization, program, school or group you volunteered for?</Label
			>
			<Input id="name" bind:value={activity.name} spellcheck="true" />
			<CharLimit content={activity.name} limit={60} />
		</div>
		<div class="flex flex-col gap-2">
			<Label for="course-description"
				>Please describe the organization, program, school or group.</Label
			>
			<div class="uc-helper">
				Consider what kind of work the organization does: What's the reason the organization exists
				today? How does it help a certain community or population?
			</div>
			<Textarea
				id="course-description"
				bind:value={activity.program_description}
				spellcheck="true"
			/>
			<CharLimit content={activity.program_description} limit={250} />
		</div>
		<div class="flex flex-col gap-2">
			<Label for="course-description">What did you do?</Label>
			<div class="uc-helper">
				Think about your experience, and what you accomplished and learned while volunteering. We'd
				also like to know if you've held a leadership role, which can mean more than just a title —
				it can mean being a mentor to others, acting as a point-person in charge of a specific task,
				or taking a lead role in organizing an event or project.
			</div>
			<Textarea id="course-description" bind:value={activity.description} spellcheck="true" />
			<CharLimit content={activity.description} limit={350} />
		</div>
		<UC.GradeLevelSelector
			bind:activity
			label="When did you volunteer?"
			helper="If you volunteered during the summer, select the grade you were in before you volunteered."
		/>
		<UC.TimeCommitmentInput
			bind:activity
			label="How much time did you spend volunteering?"
			helper="It's ok to estimate, but try to be as accurate as possible."
		/>
	{:else if activity.uc_category === 'work'}
		<div class="flex flex-col gap-2">
			<Label for="name">Where did you work?</Label>
			<div class="uc-helper">Please tell us the name of the place where you worked.</div>
			<Input id="name" bind:value={activity.name} spellcheck="true" />
			<CharLimit content={activity.name} limit={60} />
		</div>
		<div class="flex flex-col gap-2">
			<Label for="course-description"
				>Please briefly describe the company or organization where you worked.</Label
			>
			<div class="uc-helper">
				Consider describing the industry, the size of the company or organization, or its main
				focus.
			</div>
			<Textarea
				id="course-description"
				bind:value={activity.program_description}
				spellcheck="true"
			/>
			<CharLimit content={activity.program_description} limit={250} />
		</div>
		<div class="flex flex-col gap-2">
			<Label for="name">What was your job title?</Label>
			<Input id="name" bind:value={activity.job_title} spellcheck="true" />
			<CharLimit content={activity.job_title} limit={60} />
		</div>
		<div class="flex flex-col gap-2">
			<Label for="course-description">What were your job responsibilities?</Label>
			<Textarea id="course-description" bind:value={activity.description} spellcheck="true" />
			<CharLimit content={activity.description} limit={350} />
		</div>
		<UC.WorkHourInput bind:activity />
		<div class="flex flex-col gap-2">
			<Label>Do you still work at this job?</Label>
			<RadioGroup.Root bind:value={activity.job_is_continuing}>
				<div class="flex items-center gap-3">
					<RadioGroup.Item value="FALSE" id="job-continuing-false" />
					<Label for="job-continuing-false" class="font-normal">No</Label>
				</div>
				<div class="flex items-center gap-3">
					<RadioGroup.Item value="TRUE" id="job-continuing-true" />
					<Label for="job-continuing-true" class="font-normal">Yes</Label>
				</div>
			</RadioGroup.Root>
		</div>
		<div class="flex flex-col gap-2">
			<Label for="job-start-date">Start date</Label>
			<Input type="date" class="w-40" bind:value={activity.job_start_date} />
		</div>
		{#if activity.job_is_continuing === 'FALSE'}
			<div class="flex flex-col gap-2">
				<Label for="job-end-date">End date</Label>
				<Input type="date" class="w-40" bind:value={activity.job_end_date} />
			</div>
		{/if}
	{/if}

	<Separator class="mt-4" />

	<div class="flex flex-col gap-2">
		<Label for="comments">Comments</Label>
		<Textarea id="comments" bind:value={activity.comments} spellcheck="true" />
	</div>
</form>
