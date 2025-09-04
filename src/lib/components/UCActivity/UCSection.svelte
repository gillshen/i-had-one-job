<script lang="ts">
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
		<div>
			<span>{body.slice(0, charLimit)}</span><span class="over-limit">{body.slice(charLimit)}</span>
		</div>
	{:else if body}
		<div>{body}</div>
	{/if}
	{@render children?.()}
</div>
