import type { GrooveResult } from '$lib/groove/types';

/**
 * Generate an SVG string from groove geometry and trigger a download.
 *
 * @param result - The groove generation result.
 * @param showCutLines - Whether to include cut perimeter circles.
 */
export function exportSVG(result: GrooveResult, showCutLines: boolean, baseName: string): void {
	const diameter = result.outerCircle.r * 2;
	const strokeWidth = 0.001; // Hairline stroke in inches.

	let svg = `<?xml version="1.0" encoding="UTF-8"?>\n`;
	svg += `<svg xmlns="http://www.w3.org/2000/svg" width="${diameter}in" height="${diameter}in" viewBox="0 0 ${diameter} ${diameter}">\n`;

	// Groove polyline.
	if (result.groovePoints.length > 0) {
		const pointsStr = result.groovePoints
			.map((p) => `${p.x.toFixed(6)},${p.y.toFixed(6)}`)
			.join(' ');
		svg += `  <polyline points="${pointsStr}" fill="none" stroke="red" stroke-width="${strokeWidth}" />\n`;
	}

	// Cut circles.
	if (showCutLines) {
		svg += `  <circle cx="${result.innerCircle.cx}" cy="${result.innerCircle.cy}" r="${result.innerCircle.r}" fill="none" stroke="red" stroke-width="${strokeWidth}" />\n`;
		svg += `  <circle cx="${result.outerCircle.cx}" cy="${result.outerCircle.cy}" r="${result.outerCircle.r}" fill="none" stroke="red" stroke-width="${strokeWidth}" />\n`;
	}

	svg += `</svg>`;

	downloadBlob(new Blob([svg], { type: 'image/svg+xml' }), `${baseName}.svg`);
}

function downloadBlob(blob: Blob, filename: string) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}
