<script lang="ts">
	import { onMount } from 'svelte';
	import AudioUploader from '$lib/components/AudioUploader.svelte';
	import ParameterPanel from '$lib/components/ParameterPanel.svelte';
	import PreviewCanvas from '$lib/components/PreviewCanvas.svelte';
	import ExportButtons from '$lib/components/ExportButtons.svelte';
	import { generateDefaultAudio } from '$lib/audio/defaultAudio';
	import { audioState } from '$lib/stores/audioStore.svelte';
	import { getGrooveResult } from '$lib/stores/grooveStore.svelte';

	// Auto-load example audio on mount.
	onMount(() => {
		const { samples, sampleRate } = generateDefaultAudio();
		audioState.samples = samples;
		audioState.sampleRate = sampleRate;
		audioState.fileName = 'Example (440 Hz sine)';
	});

	const grooveResult = $derived(getGrooveResult());
</script>

<svelte:head>
	<title>Laser Cut Record</title>
</svelte:head>

<!-- Header -->
<header class="flex items-center border-b border-border px-4 py-2">
	<h1 class="text-lg font-bold">Laser Cut Record</h1>
</header>

<!-- Main content -->
<div class="flex flex-1 overflow-hidden">
	<!-- Sidebar -->
	<aside class="flex w-80 flex-shrink-0 flex-col gap-4 overflow-y-auto border-r border-border p-4">
		<AudioUploader />
		<hr class="border-border" />
		<ParameterPanel />
		<hr class="border-border" />
		<ExportButtons />
	</aside>

	<!-- Preview -->
	<main class="flex-1 min-h-0">
		<PreviewCanvas />
	</main>
</div>

<!-- Info bar -->
<footer class="flex items-center gap-6 border-t border-border px-4 py-1.5 text-xs text-muted-foreground">
	{#if grooveResult}
		<span>Grooves: {grooveResult.numGrooves}</span>
		<span>Points: {grooveResult.totalPoints.toLocaleString()}</span>
		<span>Duration: {grooveResult.audioDuration.toFixed(1)}s</span>
	{:else}
		<span>No audio loaded</span>
	{/if}
</footer>
