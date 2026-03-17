import { PDFDocument, rgb } from 'pdf-lib';
import type { GrooveResult } from '$lib/groove/types';

/** PDF points per inch. */
const PTS_PER_INCH = 72;

/**
 * Generate a vector PDF from groove geometry and trigger a download.
 * Uses low-level content stream operators for efficient handling of 100K+ points.
 *
 * @param result - The groove generation result.
 * @param showCutLines - Whether to include cut perimeter circles.
 */
export async function exportPDF(result: GrooveResult, showCutLines: boolean): Promise<void> {
	const diameter = result.outerCircle.r * 2;
	const pageSizePts = diameter * PTS_PER_INCH;

	const pdfDoc = await PDFDocument.create();
	const page = pdfDoc.addPage([pageSizePts, pageSizePts]);

	const strokeWidth = 0.072; // Hairline in PDF points (~0.001 inch).

	// Helper: convert inches (Y-down) to PDF points (Y-up).
	const toX = (x: number) => x * PTS_PER_INCH;
	const toY = (y: number) => (diameter - y) * PTS_PER_INCH;

	// Draw groove polyline using raw content stream for efficiency.
	if (result.groovePoints.length > 1) {
		// Build content stream string manually for the groove path.
		const ops: string[] = [];
		ops.push('q'); // Save graphics state.
		ops.push(`${strokeWidth} w`); // Set line width.
		ops.push('1 0 0 RG'); // Set stroke color to red.

		const p0 = result.groovePoints[0];
		ops.push(`${toX(p0.x).toFixed(4)} ${toY(p0.y).toFixed(4)} m`);

		for (let i = 1; i < result.groovePoints.length; i++) {
			const p = result.groovePoints[i];
			ops.push(`${toX(p.x).toFixed(4)} ${toY(p.y).toFixed(4)} l`);
		}

		ops.push('S'); // Stroke the path.
		ops.push('Q'); // Restore graphics state.

		// Add raw content stream to the page.
		const contentStream = pdfDoc.context.stream(ops.join('\n'));
		const contentStreamRef = pdfDoc.context.register(contentStream);
		page.node.addContentStream(contentStreamRef);
	}

	// Draw cut circles using page API (only 2 circles, no performance concern).
	if (showCutLines) {
		page.drawCircle({
			x: toX(result.innerCircle.cx),
			y: toY(result.innerCircle.cy),
			size: result.innerCircle.r * PTS_PER_INCH,
			borderWidth: strokeWidth,
			borderColor: rgb(1, 0, 0),
			color: undefined,
		});
		page.drawCircle({
			x: toX(result.outerCircle.cx),
			y: toY(result.outerCircle.cy),
			size: result.outerCircle.r * PTS_PER_INCH,
			borderWidth: strokeWidth,
			borderColor: rgb(1, 0, 0),
			color: undefined,
		});
	}

	const pdfBytes = await pdfDoc.save();
	downloadBlob(new Blob([pdfBytes as BlobPart], { type: 'application/pdf' }), 'laser-cut-record.pdf');
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
