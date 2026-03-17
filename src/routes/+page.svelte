<script lang="ts">
	import { onMount } from 'svelte';
	import AudioUploader from '$lib/components/AudioUploader.svelte';
	import ParameterPanel from '$lib/components/ParameterPanel.svelte';
	import PreviewCanvas from '$lib/components/PreviewCanvas.svelte';
	import ExportButtons from '$lib/components/ExportButtons.svelte';
	import AboutModal from '$lib/components/AboutModal.svelte';
	import { decodeAudio } from '$lib/audio/decodeAudio';
	import { loadDefaultAudio } from '$lib/audio/defaultAudio';
	import { audioState } from '$lib/stores/audioStore.svelte';
	import { getGrooveResult } from '$lib/stores/grooveStore.svelte';
	import X from 'lucide-svelte/icons/x';
	import TriangleAlert from 'lucide-svelte/icons/triangle-alert';

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

	async function onGlobalDrop(e: DragEvent) {
		e.preventDefault();
		const file = e.dataTransfer?.files[0];
		if (!file || !file.type.startsWith('audio/')) return;
		audioState.loading = true;
		try {
			const { samples, sampleRate } = await decodeAudio(file);
			audioState.samples = samples;
			audioState.sampleRate = sampleRate;
			audioState.fileName = file.name;
		} catch {
			// Silently fail for global drops.
		} finally {
			audioState.loading = false;
		}
	}
</script>

<svelte:head>
	<title>Laser Cut Record</title>
</svelte:head>

<svelte:window
	ondragover={(e) => e.preventDefault()}
	ondrop={onGlobalDrop}
/>

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
<div class="flex flex-1 flex-col overflow-hidden md:flex-row">
	<!-- Preview (top on mobile, right on desktop) -->
	<main class="h-64 shrink-0 md:order-2 md:h-auto md:flex-1 md:min-h-0 md:min-w-0">
		<PreviewCanvas />
	</main>

	<!-- Sidebar (below preview on mobile, left on desktop) -->
	<aside class="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto border-t border-border p-4 md:order-1 md:w-80 md:min-w-80 md:flex-initial md:shrink-0 md:border-t-0 md:border-r">
		<AudioUploader />
		{#if grooveResult?.audioTruncated}
			<div class="flex items-start gap-2 rounded-md border border-yellow-300 bg-yellow-50 p-2.5 text-xs text-yellow-900">
				<TriangleAlert size={14} class="mt-0.5 shrink-0" />
				<p>
					Audio truncated: {grooveResult.audioDuration.toFixed(1)}s of {grooveResult.totalAudioDuration.toFixed(1)}s fit on the record. To fit more, try lowering the amplitude or spacing, increasing the diameter, shrinking the label radius, or using a slower RPM.
				</p>
			</div>
		{/if}
		<hr class="border-border" />
		<ParameterPanel />
		<hr class="border-border" />
		<ExportButtons />
	</aside>
</div>

<!-- Info bar -->
<footer class="flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-border px-4 py-1.5 text-xs text-muted-foreground">
	{#if grooveResult}
		<span>Grooves: {grooveResult.numGrooves}</span>
		<span>Points: {grooveResult.totalPoints.toLocaleString()}</span>
		<span>Duration: {grooveResult.audioDuration.toFixed(1)}s</span>
	{:else}
		<span>No audio loaded</span>
	{/if}
</footer>
