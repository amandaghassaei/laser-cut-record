/**
 * Fetch and decode the bundled example audio clip.
 * Edison's "Mary Had a Little Lamb" (1927) — the first words ever recorded,
 * re-enacted by Thomas Edison himself. Public domain.
 *
 * @returns Object with mono Float32Array samples and sample rate.
 */
export async function loadDefaultAudio(): Promise<{ samples: Float32Array; sampleRate: number }> {
	const { base } = await import('$app/paths');
	const response = await fetch(`${base}/example.mp3`);
	const arrayBuffer = await response.arrayBuffer();
	const audioContext = new AudioContext();
	try {
		const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
		const sampleRate = audioBuffer.sampleRate;
		const numChannels = audioBuffer.numberOfChannels;
		const length = audioBuffer.length;

		// Mix down to mono.
		const mono = new Float32Array(length);
		for (let ch = 0; ch < numChannels; ch++) {
			const channelData = audioBuffer.getChannelData(ch);
			for (let i = 0; i < length; i++) {
				mono[i] += channelData[i];
			}
		}
		if (numChannels > 1) {
			for (let i = 0; i < length; i++) {
				mono[i] /= numChannels;
			}
		}

		return { samples: mono, sampleRate };
	} finally {
		await audioContext.close();
	}
}
