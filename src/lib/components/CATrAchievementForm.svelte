<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import Label from '$lib/components/ui/label/label.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	import type { Honor } from '$lib/types';
	import SpellcheckTextarea from '$lib/components/SpellcheckTextarea.svelte';
	import CharLimit from '$lib/components/CharLimit.svelte';

	let { honor = $bindable() }: { honor: Honor } = $props();

	const achievementTypes = ['Awards', 'Honors and Honor Societies', 'Publications'];
</script>

<form class="flex flex-grow flex-col gap-6 overflow-auto px-8 pt-4 pb-8 text-sm">
	<div class="flex flex-col gap-2">
		<Label for="type">Type</Label>
		<Select.Root type="single" name="type" bind:value={honor.type}>
			<Select.Trigger class="w-full max-w-[400px] truncate bg-white">
				{honor.type}
			</Select.Trigger>
			<Select.Content class="max-h-[400px] max-w-[400px] overflow-y-auto">
				{#each achievementTypes as achievementType}
					{@const label = achievementType || 'Select an achievement type...'}
					<Select.Item value={achievementType} {label} disabled={!achievementType}
						>{label}</Select.Item
					>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>

	<div class="flex flex-col gap-2">
		<Label for="title">Name</Label>
		<SpellcheckTextarea id="title" bind:value={honor.title} />
		<CharLimit content={honor.title} limit={60} />
	</div>

	<div class="flex flex-col gap-2">
		<Label for="org">Name of presenting organization</Label>
		<SpellcheckTextarea id="org" bind:value={honor.org} />
		<CharLimit content={honor.org} limit={60} />
	</div>

	<div class="flex flex-col gap-2">
		<Label for="date">Issued date</Label>
		<Input type="date" class="w-40" bind:value={honor.date} />
	</div>

	<div class="flex flex-col gap-2">
		<Label for="description">Brief description</Label>
		<SpellcheckTextarea id="description" bind:value={honor.description} />
		<CharLimit content={honor.description} limit={600} />
	</div>

	<Separator class="mt-4" />

	<div class="flex flex-col gap-2">
		<Label for="comments">Comments</Label>
		<Textarea id="comments" bind:value={honor.comments} spellcheck="true" />
	</div>
</form>
