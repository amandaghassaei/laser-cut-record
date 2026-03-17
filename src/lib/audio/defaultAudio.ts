/**
 * Generate a programmatic sine wave for the default audio preview.
 * Produces a 440 Hz tone lasting ~3 seconds with a fade-in/out envelope.
 *
 * @returns Object with mono Float32Array samples and sample rate.
 */
export function generateDefaultAudio(): { samples: Float32Array; sampleRate: number } {
	const sampleRate = 44100;
	const duration = 3; // seconds
	const frequency = 440; // Hz
	const length = sampleRate * duration;
	const samples = new Float32Array(length);

	const fadeLength = Math.floor(sampleRate * 0.1); // 100ms fade

	for (let i = 0; i < length; i++) {
		const t = i / sampleRate;
		let amplitude = 1.0;

		// Fade in.
		if (i < fadeLength) {
			amplitude = i / fadeLength;
		}
		// Fade out.
		if (i > length - fadeLength) {
			amplitude = (length - i) / fadeLength;
		}

		samples[i] = amplitude * Math.sin(2 * Math.PI * frequency * t);
	}

	return { samples, sampleRate };
}
