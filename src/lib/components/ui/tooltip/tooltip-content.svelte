<script lang="ts">
	import { Tooltip as TooltipPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';

	let {
		ref = $bindable(null),
		class: className,
		sideOffset = 8,
		side = 'right',
		children,
		...restProps
	}: TooltipPrimitive.ContentProps = $props();
</script>

<TooltipPrimitive.Portal>
	<TooltipPrimitive.Content
		bind:ref
		{sideOffset}
		{side}
		class={cn(
			'z-50 max-w-xs rounded-md bg-foreground px-3 py-1.5 text-xs text-background',
			className
		)}
		{...restProps}
	>
		<TooltipPrimitive.Arrow class="text-foreground" width={10} height={5} />
		{@render children?.()}
	</TooltipPrimitive.Content>
</TooltipPrimitive.Portal>
