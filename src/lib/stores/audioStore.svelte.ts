export const audioState = $state<{
	samples: Float32Array | null;
	sampleRate: number;
	fileName: string;
	loading: boolean;
}>({
	samples: null,
	sampleRate: 44100,
	fileName: '',
	loading: false,
});
