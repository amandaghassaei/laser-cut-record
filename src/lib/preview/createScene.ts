import * as THREE from 'three';
import { MapControls } from 'three/addons/controls/MapControls.js';

export interface SceneContext {
	renderer: THREE.WebGLRenderer;
	scene: THREE.Scene;
	camera: THREE.OrthographicCamera;
	controls: MapControls;
	resetView: () => void;
	dispose: () => void;
}

/**
 * Create a Three.js scene for 2D groove preview.
 *
 * @param canvas - The HTML canvas element to render into.
 * @param container - The container element for sizing.
 * @returns SceneContext with renderer, scene, camera, controls, and dispose function.
 */
export function createScene(canvas: HTMLCanvasElement, container: HTMLElement): SceneContext {
	const width = container.clientWidth;
	const height = container.clientHeight;

	// Record center at (6, 6) for a 12" record; adjust view to show full record.
	const viewSize = 7;
	const aspect = width / height;
	// Fit both axes: for tall viewports, expand vertical to fit horizontal.
	const viewH = aspect >= 1 ? viewSize : viewSize / aspect;
	const viewW = aspect >= 1 ? viewSize * aspect : viewSize;

	const camera = new THREE.OrthographicCamera(
		-viewW,
		viewW,
		viewH,
		-viewH,
		-10,
		10
	);
	camera.position.set(6, 6, 5);
	camera.lookAt(6, 6, 0);

	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0xffffff);

	const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(width, height);

	const controls = new MapControls(camera, renderer.domElement);
	controls.enableRotate = false;
	controls.screenSpacePanning = true;
	// Map right-click to pan (same as left-click).
	controls.mouseButtons = {
		LEFT: THREE.MOUSE.PAN,
		MIDDLE: THREE.MOUSE.DOLLY,
		RIGHT: THREE.MOUSE.PAN,
	};
	controls.target.set(6, 6, 0);
	controls.update();

	// Animation loop.
	let animationId: number;
	function animate() {
		animationId = requestAnimationFrame(animate);
		controls.update();
		renderer.render(scene, camera);
	}
	animate();

	/** Compute camera bounds that fit both axes. */
	function fitCamera(w: number, h: number) {
		const a = w / h;
		const vH = a >= 1 ? viewSize : viewSize / a;
		const vW = a >= 1 ? viewSize * a : viewSize;
		camera.left = -vW;
		camera.right = vW;
		camera.top = vH;
		camera.bottom = -vH;
		camera.updateProjectionMatrix();
	}

	// Resize observer.
	const resizeObserver = new ResizeObserver(() => {
		const w = container.clientWidth;
		const h = container.clientHeight;
		if (w === 0 || h === 0) return;
		fitCamera(w, h);
		renderer.setSize(w, h);
	});
	resizeObserver.observe(container);

	function resetView() {
		camera.position.set(6, 6, 5);
		camera.zoom = 1;
		fitCamera(container.clientWidth, container.clientHeight);
		controls.target.set(6, 6, 0);
		controls.update();
	}

	function dispose() {
		cancelAnimationFrame(animationId);
		resizeObserver.disconnect();
		controls.dispose();
		renderer.dispose();
	}

	return { renderer, scene, camera, controls, resetView, dispose };
}
