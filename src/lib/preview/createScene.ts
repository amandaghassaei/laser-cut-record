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

	// Custom mouse-centered zoom — registered before MapControls so it fires first.
	// stopImmediatePropagation prevents MapControls' built-in wheel handler from
	// double-processing the event, while enableZoom remains true for touch pinch zoom.
	let controls: MapControls;
	const zoomSpeed = 0.001;
	canvas.addEventListener('wheel', (e) => {
		e.preventDefault();
		e.stopImmediatePropagation();

		// Get mouse position in normalized device coordinates (-1 to +1).
		const rect = canvas.getBoundingClientRect();
		const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
		const ndcY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

		// Convert NDC to world coordinates before zoom.
		const worldBefore = new THREE.Vector3(ndcX, ndcY, 0).unproject(camera);

		// Apply zoom.
		const factor = 1 - e.deltaY * zoomSpeed;
		camera.zoom = Math.max(0.1, Math.min(100, camera.zoom * factor));
		camera.updateProjectionMatrix();

		// Convert same NDC to world coordinates after zoom.
		const worldAfter = new THREE.Vector3(ndcX, ndcY, 0).unproject(camera);

		// Shift camera so the world point under the mouse stays fixed.
		const dx = worldBefore.x - worldAfter.x;
		const dy = worldBefore.y - worldAfter.y;
		camera.position.x += dx;
		camera.position.y += dy;
		controls.target.x += dx;
		controls.target.y += dy;
		controls.update();
	}, { passive: false });

	controls = new MapControls(camera, renderer.domElement);
	controls.enableRotate = false;
	controls.screenSpacePanning = true;
	controls.mouseButtons = {
		LEFT: THREE.MOUSE.PAN,
		MIDDLE: THREE.MOUSE.PAN,
		RIGHT: THREE.MOUSE.PAN,
	};
	controls.touches = {
		ONE: THREE.TOUCH.PAN,
		TWO: THREE.TOUCH.DOLLY_PAN,
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
