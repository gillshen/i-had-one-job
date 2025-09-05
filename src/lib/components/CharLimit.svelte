<script lang="ts">
	import { writeText } from '@tauri-apps/plugin-clipboard-manager';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Copy } from '@lucide/svelte';

	type Props = {
		content: string;
		limit: number;
	};
	let { content, limit }: Props = $props();
	let remaining = $derived(limit - content.length);
	let invalid = $derived(remaining < 0);

	// state for showing copy message
	let showCopyMessage = $state(false);
	let timeoutId: number | null = null;

	const handleCopy = async () => {
		await writeText(content);
		// Clear any existing timeout
		if (timeoutId) clearTimeout(timeoutId);

		showCopyMessage = true;
		setTimeout(() => {
			showCopyMessage = false;
		}, 2000);
	};
</script>

<div class="flex flex-wrap justify-between gap-4 select-none">
	<div class={['char-limit text-xs', { invalid }]}>
		{#if invalid}
			{-remaining} character{`${remaining === -1 ? '' : 's'}`} over limit
		{:else}
			{remaining} character{`${remaining === 1 ? '' : 's'}`} remaining
		{/if}
	</div>
	<div class="flex gap-2">
		{#if showCopyMessage}
			<div class="copy-message text-xs font-normal">Content copied</div>
		{/if}
		<Button
			size="icon"
			variant="ghost"
			class="size-6 -translate-y-1 cursor-pointer hover:bg-zinc-200"
			onclick={handleCopy}
		>
			<Copy class="size-3" />
		</Button>
	</div>
</div>

<style>
	.copy-message {
		animation: fadeOut 2s forwards;
		color: oklch(70.5% 0.015 286.067);
	}

	@keyframes fadeOut {
		0% {
			opacity: 1;
		}
		75% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
</style>
