import type { GrooveParams } from '$lib/groove/types';

export const DEFAULT_PARAMS: GrooveParams = {
	rpm: 33.3,
	diameter: 11.8,
	innerHole: 0.286,
	innerRad: 2.25,
	outerRad: 5.75,
	amplitude: 10,
	spacing: 10,
	minDist: 6,
	thetaIter: 5880,
	dpi: 1200,
	cutLines: true,
};

export const paramState = $state<GrooveParams>({ ...DEFAULT_PARAMS });
