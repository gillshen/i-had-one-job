<script lang="ts">
	// A spellcheck-enabled textarea component implemented using typo-js
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { spellcheck } from '$lib/utils/spellcheck';

	let { value = $bindable(), id = undefined }: { value: string; id?: string } = $props();
</script>

<div class="relative">
	<!-- Overlay an invisible Textarea where the user types into on top of a visible one which displays the text with misspelled words underlined -->
	<Textarea class="caret-primary z-10 bg-transparent text-transparent" {id} bind:value></Textarea>
	<div
		class="pointer-events-none absolute top-0 left-0 z-0 field-sizing-content h-full w-full border-[1px] border-transparent px-3 py-2 whitespace-pre-wrap"
	>
		{@html spellcheck({ text: value, maxSuggestions: 0 }).html}
	</div>
</div>
