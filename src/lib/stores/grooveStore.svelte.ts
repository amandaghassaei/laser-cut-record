import { generateGroove } from '$lib/groove/generateGroove';
import type { GrooveResult } from '$lib/groove/types';
import { audioState } from './audioStore.svelte';
import { paramState } from './paramStore.svelte';

/**
 * Reactive groove geometry — recomputes when params or audio change.
 * Exported as a getter function because Svelte 5 does not allow exporting $derived from modules.
 */
let _grooveResult: GrooveResult | null = $derived.by(() => {
	if (!audioState.samples) return null;
	return generateGroove(
		{ ...paramState },
		audioState.samples,
		audioState.sampleRate
	);
});

export function getGrooveResult(): GrooveResult | null {
	return _grooveResult;
}
