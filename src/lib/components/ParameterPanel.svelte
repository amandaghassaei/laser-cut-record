<script lang="ts">
	import { paramState, DEFAULT_PARAMS } from '$lib/stores/paramStore.svelte';

	/** Default margin between the record edge and the outermost groove radius. */
	const OUTER_MARGIN = DEFAULT_PARAMS.diameter / 2 - DEFAULT_PARAMS.outerRad;

	// When diameter changes, adjust outerRad to maintain the edge margin.
	let prevDiameter = $state(paramState.diameter);
	$effect(() => {
		const d = paramState.diameter;
		if (d !== prevDiameter) {
			paramState.outerRad = Math.round((d / 2 - OUTER_MARGIN) * 100) / 100;
			prevDiameter = d;
		}
	});

	function handleNumber(field: string) {
		return (e: Event) => {
			const value = parseFloat((e.target as HTMLInputElement).value);
			if (!isNaN(value)) {
				(paramState as any)[field] = value;
			}
		};
	}
</script>

<div class="space-y-4">
	<h3 class="text-sm font-semibold">Parameters</h3>

	<!-- RPM -->
	<div class="space-y-1" title="Playback speed of the record. Standard vinyl speeds are 33.3 (LP), 45 (single), and 78 (shellac).">
		<label class="text-xs text-muted-foreground" for="rpm">RPM</label>
		<select
			id="rpm"
			class="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
			value={paramState.rpm}
			onchange={(e) => { paramState.rpm = parseFloat((e.target as HTMLSelectElement).value); }}
		>
			<option value={33.3}>33.3</option>
			<option value={45}>45</option>
			<option value={78}>78</option>
		</select>
	</div>

	<!-- DPI -->
	<div class="space-y-1" title="Resolution of your laser cutter in dots per inch. Amplitude, spacing, and min distance are specified in pixels at this DPI.">
		<label class="text-xs text-muted-foreground" for="dpi">DPI</label>
		<select
			id="dpi"
			class="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
			value={paramState.dpi}
			onchange={(e) => { paramState.dpi = parseInt((e.target as HTMLSelectElement).value); }}
		>
			<option value={300}>300</option>
			<option value={600}>600</option>
			<option value={1200}>1200</option>
			<option value={2400}>2400</option>
		</select>
	</div>

	<hr class="border-border" />

	<!-- Diameter -->
	<div class="space-y-1" title="Outer diameter of the record in inches. Also adjusts the outer groove radius to maintain a consistent edge margin.">
		<div class="flex items-center justify-between">
			<label class="text-xs text-muted-foreground" for="diameter">Diameter (in)</label>
			<span class="text-xs tabular-nums">{paramState.diameter.toFixed(1)}</span>
		</div>
		<input
			id="diameter"
			type="range"
			min="3"
			max="12"
			step="0.1"
			value={paramState.diameter}
			oninput={handleNumber('diameter')}
			class="w-full"
		/>
	</div>

	<!-- Inner Hole -->
	<div class="space-y-1" title="Diameter of the center spindle hole in inches. Standard is 0.286&quot; (fits a typical turntable spindle).">
		<div class="flex items-center justify-between">
			<label class="text-xs text-muted-foreground" for="innerHole">Inner Hole (in)</label>
			<span class="text-xs tabular-nums">{paramState.innerHole.toFixed(3)}</span>
		</div>
		<input
			id="innerHole"
			type="range"
			min="0.1"
			max="1"
			step="0.001"
			value={paramState.innerHole}
			oninput={handleNumber('innerHole')}
			class="w-full"
		/>
	</div>

	<!-- Inner Radius -->
	<div class="space-y-1" title="Radius of the innermost groove in inches. The groove spiral works inward from the outer radius and stops here.">
		<div class="flex items-center justify-between">
			<label class="text-xs text-muted-foreground" for="innerRad">Inner Radius (in)</label>
			<span class="text-xs tabular-nums">{paramState.innerRad.toFixed(2)}</span>
		</div>
		<input
			id="innerRad"
			type="range"
			min="0.5"
			max="5"
			step="0.01"
			value={paramState.innerRad}
			oninput={handleNumber('innerRad')}
			class="w-full"
		/>
	</div>

	<!-- Outer Radius -->
	<div class="space-y-1" title="Radius of the outermost groove in inches. The groove spiral starts here and works inward. Auto-adjusted when the diameter changes.">
		<div class="flex items-center justify-between">
			<label class="text-xs text-muted-foreground" for="outerRad">Outer Radius (in)</label>
			<span class="text-xs tabular-nums">{paramState.outerRad.toFixed(2)}</span>
		</div>
		<input
			id="outerRad"
			type="range"
			min="1"
			max="6"
			step="0.01"
			value={paramState.outerRad}
			oninput={handleNumber('outerRad')}
			class="w-full"
		/>
	</div>

	<hr class="border-border" />

	<!-- Amplitude -->
	<div class="space-y-1" title="Peak amplitude of the audio-modulated groove in pixels at the selected DPI. Higher values produce louder playback but require more spacing between grooves.">
		<div class="flex items-center justify-between">
			<label class="text-xs text-muted-foreground" for="amplitude">Amplitude (px)</label>
			<span class="text-xs tabular-nums">{paramState.amplitude}</span>
		</div>
		<input
			id="amplitude"
			type="range"
			min="1"
			max="30"
			step="1"
			value={paramState.amplitude}
			oninput={handleNumber('amplitude')}
			class="w-full"
		/>
	</div>

	<!-- Spacing -->
	<div class="space-y-1" title="Space between adjacent grooves in pixels at the selected DPI. Must be large enough to prevent grooves from overlapping (at least 2x amplitude).">
		<div class="flex items-center justify-between">
			<label class="text-xs text-muted-foreground" for="spacing">Spacing (px)</label>
			<span class="text-xs tabular-nums">{paramState.spacing}</span>
		</div>
		<input
			id="spacing"
			type="range"
			min="4"
			max="30"
			step="1"
			value={paramState.spacing}
			oninput={handleNumber('spacing')}
			class="w-full"
		/>
	</div>

	<!-- Min Distance -->
	<div class="space-y-1" title="Minimum distance between consecutive points in the vector path, in pixels at the selected DPI. Prevents the laser cutter from stalling on overly dense geometry.">
		<div class="flex items-center justify-between">
			<label class="text-xs text-muted-foreground" for="minDist">Min Distance (px)</label>
			<span class="text-xs tabular-nums">{paramState.minDist}</span>
		</div>
		<input
			id="minDist"
			type="range"
			min="1"
			max="20"
			step="1"
			value={paramState.minDist}
			oninput={handleNumber('minDist')}
			class="w-full"
		/>
	</div>

	<!-- Theta Iterations -->
	<div class="space-y-1" title="Number of angular steps per revolution of the spiral. Higher values produce smoother grooves but generate more points. Also affects audio sampling rate — more steps means more audio samples per revolution.">
		<div class="flex items-center justify-between">
			<label class="text-xs text-muted-foreground" for="thetaIter">Steps/Rev</label>
			<span class="text-xs tabular-nums">{paramState.thetaIter}</span>
		</div>
		<input
			id="thetaIter"
			type="range"
			min="100"
			max="20000"
			step="100"
			value={paramState.thetaIter}
			oninput={handleNumber('thetaIter')}
			class="w-full"
		/>
	</div>

	<hr class="border-border" />

	<!-- Cut Lines Toggle -->
	<label
		class="flex cursor-pointer items-center gap-2 text-sm"
		for="cutLines"
		title="Include cut lines for the inner hole and outer edge of the record. These circles will be cut through the material to release the finished record."
	>
		<input
			id="cutLines"
			type="checkbox"
			checked={paramState.cutLines}
			onchange={() => { paramState.cutLines = !paramState.cutLines; }}
			class="rounded"
		/>
		Cut lines
	</label>
</div>
