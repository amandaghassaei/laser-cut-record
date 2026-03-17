import * as THREE from 'three';
import type { GrooveResult } from '$lib/groove/types';

/**
 * Names used to identify objects in the scene for cleanup.
 */
const GROOVE_LINE_NAME = 'grooveLine';
const INNER_CIRCLE_NAME = 'innerCircle';
const OUTER_CIRCLE_NAME = 'outerCircle';

/**
 * Update the Three.js scene with new groove geometry.
 * Removes old geometry and creates new Line objects.
 *
 * Note: Y is flipped because generateGroove outputs Y-down coordinates,
 * but Three.js uses Y-up.
 *
 * @param scene - The Three.js scene to update.
 * @param result - The groove generation result.
 * @param showCutLines - Whether to show cut line circles.
 */
export function updateGrooveMesh(
	scene: THREE.Scene,
	result: GrooveResult,
	showCutLines: boolean
): void {
	// Remove old objects.
	const toRemove: THREE.Object3D[] = [];
	scene.traverse((obj) => {
		if (
			obj.name === GROOVE_LINE_NAME ||
			obj.name === INNER_CIRCLE_NAME ||
			obj.name === OUTER_CIRCLE_NAME
		) {
			toRemove.push(obj);
		}
	});
	for (const obj of toRemove) {
		scene.remove(obj);
		if (obj instanceof THREE.Line || obj instanceof THREE.LineLoop) {
			(obj.geometry as THREE.BufferGeometry).dispose();
			(obj.material as THREE.Material).dispose();
		}
	}

	// Build groove line.
	const positions = new Float32Array(result.groovePoints.length * 3);
	for (let i = 0; i < result.groovePoints.length; i++) {
		const p = result.groovePoints[i];
		positions[i * 3] = p.x;
		positions[i * 3 + 1] = result.outerCircle.cy * 2 - p.y; // Flip Y.
		positions[i * 3 + 2] = 0;
	}
	const grooveGeometry = new THREE.BufferGeometry();
	grooveGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
	const grooveMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
	const grooveLine = new THREE.Line(grooveGeometry, grooveMaterial);
	grooveLine.name = GROOVE_LINE_NAME;
	scene.add(grooveLine);

	// Build cut circles.
	if (showCutLines) {
		// Inner hole circle.
		const innerCircleGeom = new THREE.CircleGeometry(result.innerCircle.r, 128);
		// Remove the fill, keep only the edge.
		const innerEdgeGeom = new THREE.EdgesGeometry(innerCircleGeom);
		innerCircleGeom.dispose();
		const innerCircleLine = new THREE.LineLoop(
			innerEdgeGeom,
			new THREE.LineBasicMaterial({ color: 0xff0000 })
		);
		innerCircleLine.position.set(
			result.innerCircle.cx,
			result.innerCircle.cy, // cy is already diameter/2, flip not needed since cx=cy
			0
		);
		innerCircleLine.name = INNER_CIRCLE_NAME;
		scene.add(innerCircleLine);

		// Outer edge circle.
		const outerCircleGeom = new THREE.CircleGeometry(result.outerCircle.r, 256);
		const outerEdgeGeom = new THREE.EdgesGeometry(outerCircleGeom);
		outerCircleGeom.dispose();
		const outerCircleLine = new THREE.LineLoop(
			outerEdgeGeom,
			new THREE.LineBasicMaterial({ color: 0xff0000 })
		);
		outerCircleLine.position.set(
			result.outerCircle.cx,
			result.outerCircle.cy,
			0
		);
		outerCircleLine.name = OUTER_CIRCLE_NAME;
		scene.add(outerCircleLine);
	}
}
