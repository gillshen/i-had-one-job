<script lang="ts">
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import type { Activity } from '$lib/types';

	type Props = {
		activity: Activity;
		label?: string;
		helper?: string;
	};
	let { activity = $bindable(), label = '', helper = '' }: Props = $props();
</script>

<div class="flex flex-col gap-2">
	{#if label}
		<Label>{label}</Label>
	{/if}
	{#if helper}
		<div class="uc-helper">{helper}</div>
	{/if}
	<div class="flex flex-wrap gap-6">
		<div class="flex flex-col gap-2">
			<Label for="hours-per-week" class="font-normal">Hours spent per week</Label>
			<Input id="hours-per-week" bind:value={activity.hours_per_week} maxlength={5} />
		</div>
		<div class="flex flex-col gap-2">
			<Label for="weeks-per-year" class="font-normal">Weeks spent per year</Label>
			<Input id="weeks-per-year" bind:value={activity.weeks_per_year} maxlength={5} />
		</div>
	</div>
</div>
