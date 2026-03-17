export const audioState = $state<{
	samples: Float32Array | null;
	sampleRate: number;
	fileName: string;
}>({
	samples: null,
	sampleRate: 44100,
	fileName: '',
});
