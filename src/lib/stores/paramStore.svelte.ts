import type { GrooveParams } from '$lib/groove/types';

export const DEFAULT_PARAMS: GrooveParams = {
	rpm: 45,
	diameter: 11.8,
	innerHole: 0.286,
	labelRadius: 2.25,
	grooveMargin: 0.15,
	amplitude: 10,
	spacing: 10,
	minDist: 6,
	thetaIter: 5880,
	dpi: 1200,
	cutLines: true,
};

export const paramState = $state<GrooveParams>({ ...DEFAULT_PARAMS });

/** Whether the label radius slider is actively being dragged. */
export const uiState = $state({ editingLabelRadius: false });
