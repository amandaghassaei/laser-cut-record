import type { GrooveParams, GrooveResult, Point } from './types';

/**
 * Generate groove geometry from audio samples and parameters.
 * Pure function — no side effects.
 *
 * Port of LaserCutRecord.pde from the original Processing project.
 *
 * @param params - Groove generation parameters.
 * @param samples - Mono audio samples (Float32Array), normalized to [-1, 1].
 * @param sampleRate - Audio sample rate in Hz.
 * @returns GrooveResult with points in inches, Y-down coordinate system.
 */
export function generateGroove(
	params: GrooveParams,
	samples: Float32Array,
	sampleRate: number
): GrooveResult {
	const { rpm, diameter, innerHole, labelRadius, grooveMargin, amplitude, spacing, minDist, thetaIter, dpi, cutLines } = params;

	// Compute derived radii.
	const outerRad = diameter / 2 - grooveMargin;
	const innerRad = labelRadius;

	// Convert DPI-pixel values to inches.
	const amplitudeInches = amplitude / dpi;
	const spacingInches = spacing / dpi;
	const minDistInches = minDist / dpi;
	const minDistSq = minDistInches * minDistInches;

	// Center of the record in inches.
	const cx = diameter / 2;
	const cy = diameter / 2;

	// Angular increment per step (radians).
	const incrNum = (2 * Math.PI) / thetaIter;

	// Radial increment per step — spiral pitch.
	const radIncrNum = (2 * amplitudeInches + spacingInches) / thetaIter;

	// Audio sample index increment per angular step.
	const samplesPerRevolution = (sampleRate * 60) / rpm;
	const indexIncr = Math.floor(samplesPerRevolution / thetaIter);

	// Normalize audio so max absolute value maps to amplitudeInches.
	let maxAbs = 0;
	for (let i = 0; i < samples.length; i++) {
		const abs = Math.abs(samples[i]);
		if (abs > maxAbs) maxAbs = abs;
	}
	const normalizedAudio = new Float32Array(samples.length);
	if (maxAbs > 0) {
		const scale = amplitudeInches / maxAbs;
		for (let i = 0; i < samples.length; i++) {
			normalizedAudio[i] = samples[i] * scale;
		}
	}

	const groovePoints: Point[] = [];
	let theta = 0;
	let radius = outerRad;
	let audioIndex = 0;
	let numGrooves = 0;
	let lastX = -Infinity;
	let lastY = -Infinity;

	/**
	 * Add a point if it passes the minimum distance filter.
	 */
	function addPoint(x: number, y: number) {
		const dx = x - lastX;
		const dy = y - lastY;
		if (dx * dx + dy * dy > minDistSq) {
			groovePoints.push({ x, y });
			lastX = x;
			lastY = y;
		}
	}

	/************************************************
	 * PHASE 1: Silent lead-in groove (1 revolution)
	 ************************************************/
	for (let i = 0; i < thetaIter; i++) {
		const x = cx + radius * Math.cos(theta);
		const y = cy - radius * Math.sin(theta);
		addPoint(x, y);
		theta += incrNum;
		radius -= radIncrNum;
	}

	/************************************************
	 * PHASE 2: Audio grooves
	 ************************************************/
	while (radius > innerRad && audioIndex < normalizedAudio.length) {
		for (let i = 0; i < thetaIter; i++) {
			if (audioIndex >= normalizedAudio.length || radius <= innerRad) break;

			const radCalc = radius + normalizedAudio[audioIndex];
			const x = cx + radCalc * Math.cos(theta);
			const y = cy - radCalc * Math.sin(theta);
			addPoint(x, y);

			theta += incrNum;
			radius -= radIncrNum;
			audioIndex += indexIncr;
		}
		numGrooves++;
	}

	/************************************************
	 * PHASE 3: Silent lead-out groove (1 revolution)
	 ************************************************/
	for (let i = 0; i < thetaIter; i++) {
		const x = cx + radius * Math.cos(theta);
		const y = cy - radius * Math.sin(theta);
		addPoint(x, y);
		theta += incrNum;
		radius -= radIncrNum;
	}

	/************************************************
	 * PHASE 4: Locked groove (1 revolution circle)
	 ************************************************/
	const lockedRadius = radius;
	for (let i = 0; i <= thetaIter; i++) {
		const x = cx + lockedRadius * Math.cos(theta);
		const y = cy - lockedRadius * Math.sin(theta);
		addPoint(x, y);
		theta += incrNum;
	}

	// Compute audio duration used.
	const audioDuration = audioIndex / sampleRate;

	return {
		groovePoints,
		innerCircle: { cx, cy, r: innerHole / 2 },
		outerCircle: { cx, cy, r: diameter / 2 },
		numGrooves,
		audioDuration,
		totalPoints: groovePoints.length,
	};
}
