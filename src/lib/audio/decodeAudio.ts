/**
 * Decode an audio file (MP3, WAV, OGG, FLAC) to mono PCM samples.
 *
 * @param file - The audio file to decode.
 * @returns Object with mono Float32Array samples and sample rate.
 */
export async function decodeAudio(file: File): Promise<{ samples: Float32Array; sampleRate: number }> {
	const arrayBuffer = await file.arrayBuffer();
	const audioContext = new AudioContext();
	try {
		const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
		const sampleRate = audioBuffer.sampleRate;
		const numChannels = audioBuffer.numberOfChannels;
		const length = audioBuffer.length;

		// Mix down to mono by averaging all channels.
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
