<script lang="ts">
	import { decodeAudio } from '$lib/audio/decodeAudio';
	import { generateDefaultAudio } from '$lib/audio/defaultAudio';
	import { audioState } from '$lib/stores/audioStore.svelte';

	let dragOver = $state(false);
	let loading = $state(false);
	let error = $state('');

	async function handleFile(file: File) {
		error = '';
		loading = true;
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

	function loadExample() {
		const { samples, sampleRate } = generateDefaultAudio();
		audioState.samples = samples;
		audioState.sampleRate = sampleRate;
		audioState.fileName = 'Example (440 Hz sine)';
	}
</script>

<div class="space-y-3">
	<h3 class="text-sm font-semibold">Audio</h3>

	<!-- Drop zone -->
	<div
		role="button"
		tabindex="0"
		title="Upload an audio file to engrave into the record groove. The audio is decoded to mono and mapped onto the spiral. Shorter clips work best — long files may produce very dense geometry."
		class="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 text-center text-sm transition-colors
			{dragOver ? 'border-primary bg-accent' : 'border-border hover:border-primary/50'}"
		ondrop={onDrop}
		ondragover={onDragOver}
		ondragleave={onDragLeave}
	>
		{#if loading}
			<p class="text-muted-foreground">Decoding audio...</p>
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
		<p class="truncate text-xs text-muted-foreground" title={audioState.fileName}>
			{audioState.fileName}
		</p>
	{/if}

	{#if error}
		<p class="text-xs text-destructive">{error}</p>
	{/if}
</div>
