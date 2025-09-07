<script lang="ts">
	let { text, charLimit }: { text: string; charLimit: number } = $props();
</script>

<span>{text.slice(0, charLimit)}</span><span class="over-limit">{text.slice(charLimit)}</span>
