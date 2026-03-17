import * as THREE from 'three';

const LABEL_RADIUS_NAME = 'labelRadiusIndicator';
const CIRCLE_SEGMENTS = 128;

/**
 * Show or hide a dashed black circle indicating the label radius.
 *
 * @param scene - The Three.js scene.
 * @param show - Whether to show the indicator.
 * @param center - Record center coordinate (diameter / 2) in inches.
 * @param radius - Label radius in inches.
 */
export function updateLabelRadiusIndicator(
	scene: THREE.Scene,
	show: boolean,
	center: number,
	radius: number
): void {
	// Remove existing indicator.
	const toRemove: THREE.Object3D[] = [];
	scene.traverse((obj) => {
		if (obj.name === LABEL_RADIUS_NAME) {
			toRemove.push(obj);
		}
	});
	for (const obj of toRemove) {
		scene.remove(obj);
		if (obj instanceof THREE.Line) {
			(obj.geometry as THREE.BufferGeometry).dispose();
			(obj.material as THREE.Material).dispose();
		}
	}

	if (!show) return;

	// Build circle points.
	const points: THREE.Vector3[] = [];
	for (let i = 0; i <= CIRCLE_SEGMENTS; i++) {
		const angle = (i / CIRCLE_SEGMENTS) * Math.PI * 2;
		points.push(
			new THREE.Vector3(
				center + Math.cos(angle) * radius,
				center + Math.sin(angle) * radius,
				0
			)
		);
	}

	const geometry = new THREE.BufferGeometry().setFromPoints(points);
	const material = new THREE.LineDashedMaterial({
		color: 0x888888,
		dashSize: 0.1,
		gapSize: 0.1,
	});
	const line = new THREE.Line(geometry, material);
	line.computeLineDistances(); // Required for dashed material.
	line.name = LABEL_RADIUS_NAME;
	scene.add(line);
}
