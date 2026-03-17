import * as THREE from 'three';
import { MapControls } from 'three/addons/controls/MapControls.js';

export interface SceneContext {
	renderer: THREE.WebGLRenderer;
	scene: THREE.Scene;
	camera: THREE.OrthographicCamera;
	controls: MapControls;
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

	const camera = new THREE.OrthographicCamera(
		-viewSize * aspect,
		viewSize * aspect,
		viewSize,
		-viewSize,
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

	// Resize observer.
	const resizeObserver = new ResizeObserver(() => {
		const w = container.clientWidth;
		const h = container.clientHeight;
		if (w === 0 || h === 0) return;
		const a = w / h;
		camera.left = -viewSize * a;
		camera.right = viewSize * a;
		camera.top = viewSize;
		camera.bottom = -viewSize;
		camera.updateProjectionMatrix();
		renderer.setSize(w, h);
	});
	resizeObserver.observe(container);

	function dispose() {
		cancelAnimationFrame(animationId);
		resizeObserver.disconnect();
		controls.dispose();
		renderer.dispose();
	}

	return { renderer, scene, camera, controls, dispose };
}
