<script lang="ts">
	let { text }: { text: string } = $props();
</script>

<div class="flex flex-col text-red-600">
	{#each text.split(/\n+/) as paragraph}
		<p>{paragraph}</p>
	{/each}
</div>
