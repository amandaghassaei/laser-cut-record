/**
 * Parameters controlling groove generation.
 */
export interface GrooveParams {
	/** Playback speed in RPM. */
	rpm: number;
	/** Record outer diameter in inches. */
	diameter: number;
	/** Center hole diameter in inches. */
	innerHole: number;
	/** Radius of the label area / innermost groove in inches. */
	labelRadius: number;
	/** Distance from the outer edge to the first groove in inches. */
	grooveMargin: number;
	/** Groove modulation amplitude in DPI pixels. */
	amplitude: number;
	/** Inter-groove spacing in DPI pixels. */
	spacing: number;
	/** Minimum point spacing in DPI pixels. */
	minDist: number;
	/** Angular steps per revolution. */
	thetaIter: number;
	/** Laser cutter resolution in DPI. */
	dpi: number;
	/** Whether to include cut perimeter circles. */
	cutLines: boolean;
}

/**
 * A 2D point in inches.
 */
export interface Point {
	x: number;
	y: number;
}

/**
 * Result of groove generation.
 */
export interface GrooveResult {
	/** Groove polyline points in inches (Y-down). */
	groovePoints: Point[];
	/** Inner hole circle (center + radius in inches). */
	innerCircle: { cx: number; cy: number; r: number };
	/** Outer edge circle (center + radius in inches). */
	outerCircle: { cx: number; cy: number; r: number };
	/** Number of audio grooves completed. */
	numGrooves: number;
	/** Audio duration used in seconds. */
	audioDuration: number;
	/** Total audio duration available in seconds. */
	totalAudioDuration: number;
	/** Whether the audio was truncated due to insufficient groove space. */
	audioTruncated: boolean;
	/** Total number of points in the groove. */
	totalPoints: number;
}
