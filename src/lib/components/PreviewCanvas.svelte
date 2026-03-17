<script lang="ts">
	import { onMount } from 'svelte';
	import { createScene, type SceneContext } from '$lib/preview/createScene';
	import { updateGrooveMesh } from '$lib/preview/updateGrooveMesh';
	import { updateLabelRadiusIndicator } from '$lib/preview/updateLabelRadiusIndicator';
	import { getGrooveResult } from '$lib/stores/grooveStore.svelte';
	import { paramState, uiState } from '$lib/stores/paramStore.svelte';
	import Maximize from 'lucide-svelte/icons/maximize';
	import * as Tooltip from '$lib/components/ui/tooltip/index';

	let container: HTMLDivElement;
	let canvas: HTMLCanvasElement;
	let sceneCtx: SceneContext | null = null;

	onMount(() => {
		sceneCtx = createScene(canvas, container);
		return () => {
			sceneCtx?.dispose();
			sceneCtx = null;
		};
	});

	// React to groove changes.
	$effect(() => {
		const result = getGrooveResult();
		if (sceneCtx && result) {
			updateGrooveMesh(sceneCtx.scene, result, paramState.cutLines);
		}
	});

	// Show dashed label radius circle while editing.
	$effect(() => {
		if (!sceneCtx) return;
		const center = paramState.diameter / 2;
		updateLabelRadiusIndicator(sceneCtx.scene, uiState.editingLabelRadius, center, paramState.labelRadius);
	});
</script>

<div bind:this={container} class="relative h-full w-full min-h-0 min-w-0 overflow-hidden">
	<canvas bind:this={canvas} class="block h-full w-full"></canvas>
	<div class="absolute top-2 right-2">
		<Tooltip.Root>
			<Tooltip.Trigger
				class="rounded bg-black/50 p-1.5 text-white/70 hover:bg-black/70 hover:text-white"
				onclick={() => sceneCtx?.resetView()}
			>
				<Maximize size={14} />
			</Tooltip.Trigger>
			<Tooltip.Content side="left">Center view</Tooltip.Content>
		</Tooltip.Root>
	</div>
	<div class="pointer-events-none absolute bottom-2 right-2 rounded bg-black/50 px-2 py-1 text-[10px] text-white/70">
		<span class="hidden md:inline">Drag to pan · Scroll to zoom</span>
		<span class="md:hidden">Drag to pan · Pinch to zoom</span>
	</div>
</div>
