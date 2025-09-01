<script lang="ts">
	import * as Card from '$lib/components/ui/card/index';
	import type { Activity } from '$lib/types';

	export let activity: Activity;
</script>

<div class="relative">
	<Card.Root class="max-w-prose text-sm">
		<Card.Header>
			<Card.Title class="text-xl font-semibold">{activity.type}</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="grid grid-cols-3">
				<div class="flex flex-col">
					<div>{activity.grade_level}</div>
					<div>{activity.when}</div>
					<div>{activity.hours_per_week} hr/wk, {activity.weeks_per_year} wk/yr</div>
				</div>
				<div class="col-span-2 flex flex-col">
					<div class="font-semibold">{activity.position}, {activity.organization}</div>
					<div>{activity.description}</div>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</div>
