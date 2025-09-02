<script lang="ts">
	import Label from '$lib/components/ui/label/label.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import type { Honor } from '$lib/types';
	import CharLimit from '$lib/components/CharLimit.svelte';

	let { honor = $bindable() } = $props<{ honor: Honor }>();

	const gradeLevels = [
		{ value: '9', label: '9' },
		{ value: '10', label: '10' },
		{ value: '11', label: '11' },
		{ value: '12', label: '12' },
		{ value: 'PG', label: 'Post-graduate' }
	];

	const recognitionLevels = [
		{ value: 'school', label: 'School' },
		{ value: 'state/regional', label: 'State/Regional' },
		{ value: 'national', label: 'National' },
		{ value: 'international', label: 'International' }
	];
</script>

<form class="flex flex-grow flex-col gap-6 overflow-auto px-8 py-4 text-sm">
	<div class="flex flex-col gap-2">
		<Label for="title">Title</Label>
		<Textarea id="title" bind:value={honor.title} spellcheck={true} />
		<CharLimit content={honor.title} limit={100} />
	</div>

	<div class="flex flex-col gap-2">
		<Label>Grade level</Label>
		<div class="flex flex-col gap-2">
			{#each gradeLevels as { value, label }}
				<div class="flex items-center gap-3">
					<Checkbox
						id="grade-${value}"
						class="bg-white"
						checked={honor.grade_level.has(value)}
						onCheckedChange={(v) => {
							const newSet = new Set(honor.grade_level);
							if (v) {
								newSet.add(value);
							} else {
								newSet.delete(value);
							}
							honor.grade_level = newSet;
						}}
					/>
					<Label for="grade-${value}" class="font-normal">{label}</Label>
				</div>
			{/each}
		</div>
	</div>

	<div class="flex flex-col gap-2">
		<Label>Level(s) of recognition</Label>
		<div class="flex flex-col gap-2">
			{#each recognitionLevels as { value, label }}
				<div class="flex items-center gap-3">
					<Checkbox
						id="rec-${value}"
						class="bg-white"
						checked={honor.level_of_recognition.has(value)}
						onCheckedChange={(v) => {
							const newSet = new Set(honor.level_of_recognition);
							if (v) {
								newSet.add(value);
							} else {
								newSet.delete(value);
							}
							honor.level_of_recognition = newSet;
						}}
					/>
					<Label for="rec-${value}" class="font-normal">{label}</Label>
				</div>
			{/each}
		</div>
	</div>

	<Separator class="mt-4" />

	<div class="flex flex-col gap-2">
		<Label for="comments">Comments</Label>
		<Textarea id="comments" bind:value={honor.comments} spellcheck="true" />
	</div>
</form>
