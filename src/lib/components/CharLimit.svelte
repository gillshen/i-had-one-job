<script lang="ts">
	let { content, limit } = $props<{ content: string; limit: number }>();
	let remaining = $derived(limit - content.length);
	let invalid = $derived(remaining < 0);
</script>

<div class={['char-limit text-xs', { invalid }]}>
	{#if invalid}
		{-remaining} character{`${remaining === -1 ? '' : 's'}`} over limit
	{:else}
		{remaining} character{`${remaining === 1 ? '' : 's'}`} remaining
	{/if}
</div>
