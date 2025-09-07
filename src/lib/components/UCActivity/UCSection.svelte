<script lang="ts">
	import CharLimitSpan from '$lib/components/CharLimitSpan.svelte';

	type Props = {
		heading: string;
		body?: string;
		charLimit?: number | null;
		children?: any;
	};
	let { heading, body = '', charLimit = null, children }: Props = $props();
</script>

<div class="flex flex-col gap-1 text-sm">
	<h3 class="font-medium text-[#1295D8]">{heading}</h3>
	{#if body && charLimit}
		<div><CharLimitSpan text={body} {charLimit} /></div>
	{:else if body}
		<div>{body}</div>
	{/if}
	{@render children?.()}
</div>
