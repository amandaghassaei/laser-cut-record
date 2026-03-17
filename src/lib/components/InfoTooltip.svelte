<script lang="ts">
	import Info from 'lucide-svelte/icons/info';
	import * as Tooltip from '$lib/components/ui/tooltip/index';

	let { text }: { text: string } = $props();
</script>

<Tooltip.Root>
	<Tooltip.Trigger
		class="inline-flex cursor-default text-muted-foreground hover:text-foreground"
		onclick={(e: MouseEvent) => e.preventDefault()}
	>
		<Info size={14} />
	</Tooltip.Trigger>
	<Tooltip.Content>
		{text}
	</Tooltip.Content>
</Tooltip.Root>
