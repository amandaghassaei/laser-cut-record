<script lang="ts">
	import { onMount } from 'svelte';
	import AudioUploader from '$lib/components/AudioUploader.svelte';
	import ParameterPanel from '$lib/components/ParameterPanel.svelte';
	import PreviewCanvas from '$lib/components/PreviewCanvas.svelte';
	import ExportButtons from '$lib/components/ExportButtons.svelte';
	import AboutModal from '$lib/components/AboutModal.svelte';
	import { loadDefaultAudio } from '$lib/audio/defaultAudio';
	import { audioState } from '$lib/stores/audioStore.svelte';
	import { getGrooveResult } from '$lib/stores/grooveStore.svelte';
	import X from 'lucide-svelte/icons/x';

	const EXAMPLE_NAME = 'Edison — "Mary Had a Little Lamb" (1927)';

	let showWarning = $state(true);

	// Auto-load example audio on mount.
	onMount(async () => {
		const { samples, sampleRate } = await loadDefaultAudio();
		audioState.samples = samples;
		audioState.sampleRate = sampleRate;
		audioState.fileName = EXAMPLE_NAME;
	});

	const grooveResult = $derived(getGrooveResult());
</script>

<svelte:head>
	<title>Laser Cut Record</title>
</svelte:head>

<!-- Warning banner -->
{#if showWarning}
	<div class="flex items-start gap-3 border-b border-yellow-300 bg-yellow-50 px-4 py-2.5 text-xs text-yellow-900">
		<p class="flex-1">
			This app was vibe coded with AI — the code has not been tested or even read by a human.
		</p>
		<button
			class="mt-0.5 shrink-0 rounded p-0.5 text-yellow-700 hover:bg-yellow-200 hover:text-yellow-900"
			onclick={() => { showWarning = false; }}
		>
			<X size={14} />
		</button>
	</div>
{/if}

<!-- Header -->
<header class="flex items-center justify-between border-b border-border px-4 py-2">
	<h1 class="text-lg font-bold">Laser Cut Record</h1>
	<AboutModal />
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
