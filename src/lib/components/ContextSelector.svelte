<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { gs } from '$lib/commands.svelte';
</script>

<div class="flex min-h-screen w-full">
	<div class="m-auto flex flex-col items-center p-6 pb-12">
		<h2 class="text-lg font-semibold">Select an application system to start</h2>
		<div class="text-sm text-zinc-600">You can switch between systems at any point</div>
		<div class="mx-auto mt-12 flex flex-wrap content-center justify-center-safe gap-12 p-4">
			<Button
				variant="outline"
				class="flex size-[140px] flex-col rounded-xl"
				onclick={() => {
					gs.context = 'CA_FRESHMAN';
				}}
			>
				<div>Common App<br />First-Year</div>
			</Button>
			<Button
				variant="outline"
				class="flex size-[140px] flex-col rounded-xl"
				onclick={() => {
					gs.context = 'CA_TRANSFER';
				}}
			>
				<div>Common App<br />Transfer</div>
			</Button>
			<Button
				variant="outline"
				class="flex size-[140px] flex-col rounded-xl"
				onclick={() => {
					gs.context = 'UC';
				}}
			>
				<div>University of<br />California</div>
			</Button>
			<Button
				variant="outline"
				disabled
				class="flex size-[140px] flex-col rounded-xl"
				onclick={() => {
					gs.context = 'COALITION';
				}}
			>
				<div>Coalition</div>
			</Button>
		</div>
	</div>
</div>
