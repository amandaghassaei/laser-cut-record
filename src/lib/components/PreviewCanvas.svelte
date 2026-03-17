<script lang="ts">
	import { onMount } from 'svelte';
	import { createScene, type SceneContext } from '$lib/preview/createScene';
	import { updateGrooveMesh } from '$lib/preview/updateGrooveMesh';
	import { getGrooveResult } from '$lib/stores/grooveStore.svelte';
	import { paramState } from '$lib/stores/paramStore.svelte';

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
</script>

<div bind:this={container} class="relative h-full w-full min-h-0">
	<canvas bind:this={canvas} class="block h-full w-full"></canvas>
	<div class="pointer-events-none absolute bottom-2 right-2 rounded bg-black/50 px-2 py-1 text-[10px] text-white/70">
		Drag to pan · Scroll to zoom
	</div>
</div>
