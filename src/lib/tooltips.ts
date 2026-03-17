/**
 * Tooltip copy for all UI controls.
 * Edit this file to update tooltip text across the app.
 */

export const TOOLTIPS = {
	audio:
		'Upload an audio file to engrave into the record groove. The audio is decoded to mono and mapped onto the spiral. Shorter clips work best — long files may produce very dense geometry.',
	rpm:
		'Playback speed of the record. Standard vinyl speeds are 33.3 (LP), 45 (single), and 78 (shellac).',
	dpi:
		'Resolution of your laser cutter in dots per inch. Amplitude and spacing are specified in pixels at this DPI.',
	diameter:
		'Outer diameter of the record in inches.',
	innerHole:
		'Diameter of the center spindle hole in inches. Standard is 0.286" (fits a typical turntable spindle).',
	grooveMargin:
		'Distance from the outer edge of the record to where the first groove begins. A small margin prevents grooves from running right up to the cut edge.',
	labelRadius:
		'Radius of the label area at the center of the record. The groove spiral works inward and stops here.',
	amplitude:
		'Peak amplitude of the audio-modulated groove in pixels at the selected DPI. Higher values produce louder playback but require more spacing between grooves.',
	spacing:
		'Space between adjacent grooves in pixels at the selected DPI. Must be large enough to prevent grooves from overlapping (at least 2x amplitude).',
	cutLines:
		'Include cut lines for the inner hole and outer edge of the record. These circles will be cut through the material to release the finished record.',
	minDist:
		'Minimum distance between consecutive points in the vector path, in pixels at the selected DPI. Prevents the laser cutter from stalling on overly dense geometry.',
	thetaIter:
		'Number of angular steps per revolution of the spiral. Higher values produce smoother grooves but generate more points. Also affects audio sampling rate — more steps means more audio samples per revolution.',
};
