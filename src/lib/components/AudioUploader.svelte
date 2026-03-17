<script lang="ts">
	import { decodeAudio } from '$lib/audio/decodeAudio';
	import { loadDefaultAudio } from '$lib/audio/defaultAudio';
	import { audioState } from '$lib/stores/audioStore.svelte';
	import { TOOLTIPS } from '$lib/tooltips';
	import InfoTooltip from './InfoTooltip.svelte';
	import Play from 'lucide-svelte/icons/play';
	import Square from 'lucide-svelte/icons/square';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';

	const EXAMPLE_NAME = 'Edison — "Mary Had a Little Lamb" (1927)';

	let dragOver = $state(false);
	let loading = $state(false);
	let error = $state('');
	let playing = $state(false);
	let audioCtx: AudioContext | null = null;
	let sourceNode: AudioBufferSourceNode | null = null;

	async function handleFile(file: File) {
		error = '';
		loading = true;
		stopPlayback();
		try {
			const { samples, sampleRate } = await decodeAudio(file);
			audioState.samples = samples;
			audioState.sampleRate = sampleRate;
			audioState.fileName = file.name;
		} catch (e) {
			error = `Failed to decode audio: ${e instanceof Error ? e.message : 'Unknown error'}`;
		} finally {
			loading = false;
		}
	}

	function onDrop(e: DragEvent) {
		e.preventDefault();
		dragOver = false;
		const file = e.dataTransfer?.files[0];
		if (file) handleFile(file);
	}

	function onDragOver(e: DragEvent) {
		e.preventDefault();
		dragOver = true;
	}

	function onDragLeave() {
		dragOver = false;
	}

	function onFileInput(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) handleFile(file);
	}

	async function loadExample() {
		error = '';
		loading = true;
		stopPlayback();
		try {
			const { samples, sampleRate } = await loadDefaultAudio();
			audioState.samples = samples;
			audioState.sampleRate = sampleRate;
			audioState.fileName = EXAMPLE_NAME;
		} catch (e) {
			error = `Failed to load example: ${e instanceof Error ? e.message : 'Unknown error'}`;
		} finally {
			loading = false;
		}
	}

	function stopPlayback() {
		if (sourceNode) {
			sourceNode.onended = null;
			sourceNode.stop();
			sourceNode.disconnect();
			sourceNode = null;
		}
		if (audioCtx) {
			audioCtx.close();
			audioCtx = null;
		}
		playing = false;
	}

	function togglePlayback() {
		if (playing) {
			stopPlayback();
			return;
		}

		const samples = audioState.samples;
		if (!samples) return;

		audioCtx = new AudioContext();
		const buffer = audioCtx.createBuffer(1, samples.length, audioState.sampleRate);
		buffer.getChannelData(0).set(samples);

		sourceNode = audioCtx.createBufferSource();
		sourceNode.buffer = buffer;
		sourceNode.connect(audioCtx.destination);
		sourceNode.onended = () => {
			stopPlayback();
		};
		sourceNode.start();
		playing = true;
	}
</script>

<div class="space-y-3">
	<div class="flex items-center gap-1">
		<h3 class="text-sm font-semibold">Audio</h3>
		<InfoTooltip text={TOOLTIPS.audio} />
	</div>

	<!-- Drop zone -->
	<div
		role="button"
		tabindex="0"
		class="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 text-center text-sm transition-colors
			{dragOver ? 'border-primary bg-accent' : 'border-border hover:border-primary/50'}"
		ondrop={onDrop}
		ondragover={onDragOver}
		ondragleave={onDragLeave}
	>
		{#if loading}
			<div class="flex items-center gap-2 text-muted-foreground">
				<LoaderCircle size={16} class="animate-spin" />
				<p>Decoding audio...</p>
			</div>
		{:else}
			<p class="text-muted-foreground">Drop audio file here</p>
			<p class="text-xs text-muted-foreground">MP3, WAV, OGG, FLAC</p>
		{/if}
	</div>

	<!-- File input -->
	<div class="flex gap-2">
		<label class="flex-1 cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-center text-sm hover:bg-accent">
			Browse...
			<input type="file" accept="audio/*" class="hidden" onchange={onFileInput} />
		</label>
		<button
			class="flex-1 rounded-md bg-secondary px-3 py-2 text-sm hover:bg-secondary/80"
			onclick={loadExample}
		>
			Load Example
		</button>
	</div>

	{#if audioState.fileName}
		<div class="space-y-1">
			<p class="text-xs font-medium text-muted-foreground">Currently loaded:</p>
			<div class="flex items-center gap-1.5">
				<button
					class="shrink-0 rounded p-0.5 text-muted-foreground hover:text-foreground"
					onclick={togglePlayback}
				>
					{#if playing}
						<Square size={14} />
					{:else}
						<Play size={14} />
					{/if}
				</button>
				<p class="truncate text-xs text-muted-foreground" title={audioState.fileName}>
					{audioState.fileName}
				</p>
			</div>
			{#if audioState.samples}
				<p class="text-[11px] text-muted-foreground/70">
					{(audioState.samples.length / audioState.sampleRate).toFixed(1)}s · {(audioState.sampleRate / 1000).toFixed(1)} kHz · {(audioState.samples.length).toLocaleString()} samples
				</p>
			{/if}
		</div>
	{/if}

	{#if error}
		<p class="text-xs text-destructive">{error}</p>
	{/if}
</div>
