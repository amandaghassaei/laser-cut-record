<script lang="ts">
	import { exportSVG } from '$lib/export/exportSVG';
	import { exportPDF } from '$lib/export/exportPDF';
	import { getGrooveResult } from '$lib/stores/grooveStore.svelte';
	import { paramState } from '$lib/stores/paramStore.svelte';
	import { audioState } from '$lib/stores/audioStore.svelte';

	let exporting = $state(false);

	/** Strip file extension from the audio file name to use as the export base name. */
	function getBaseName(): string {
		const name = audioState.fileName || 'laser-cut-record';
		return name.replace(/\.[^.]+$/, '');
	}

	function handleExportSVG() {
		const result = getGrooveResult();
		if (!result) return;
		exportSVG(result, paramState.cutLines, getBaseName());
	}

	async function handleExportPDF() {
		const result = getGrooveResult();
		if (!result) return;
		exporting = true;
		try {
			await exportPDF(result, paramState.cutLines, getBaseName());
		} finally {
			exporting = false;
		}
	}

	const disabled = $derived(!getGrooveResult());
</script>

<div class="space-y-3">
	<h3 class="text-sm font-semibold">Export</h3>
	<div class="flex gap-2">
		<button
			class="flex-1 rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
			onclick={handleExportSVG}
			{disabled}
		>
			SVG
		</button>
		<button
			class="flex-1 rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
			onclick={handleExportPDF}
			disabled={disabled || exporting}
		>
			{exporting ? 'Exporting...' : 'PDF'}
		</button>
	</div>
</div>
