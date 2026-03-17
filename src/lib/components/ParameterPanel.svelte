<script lang="ts">
	import { paramState } from '$lib/stores/paramStore.svelte';
	import { TOOLTIPS } from '$lib/tooltips';
	import InfoTooltip from './InfoTooltip.svelte';

	let showAdvanced = $state(false);

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
	<div class="space-y-1">
		<div class="flex items-center gap-1">
			<label class="text-xs text-muted-foreground" for="rpm">RPM</label>
			<InfoTooltip text={TOOLTIPS.rpm} />
		</div>
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
	<div class="space-y-1">
		<div class="flex items-center gap-1">
			<label class="text-xs text-muted-foreground" for="dpi">DPI</label>
			<InfoTooltip text={TOOLTIPS.dpi} />
		</div>
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
	<div class="space-y-1">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-1">
				<label class="text-xs text-muted-foreground" for="diameter">Diameter (in)</label>
				<InfoTooltip text={TOOLTIPS.diameter} />
			</div>
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
	<div class="space-y-1">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-1">
				<label class="text-xs text-muted-foreground" for="innerHole">Inner Hole (in)</label>
				<InfoTooltip text={TOOLTIPS.innerHole} />
			</div>
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

	<!-- Groove Margin -->
	<div class="space-y-1">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-1">
				<label class="text-xs text-muted-foreground" for="grooveMargin">Groove Margin (in)</label>
				<InfoTooltip text={TOOLTIPS.grooveMargin} />
			</div>
			<span class="text-xs tabular-nums">{paramState.grooveMargin.toFixed(2)}</span>
		</div>
		<input
			id="grooveMargin"
			type="range"
			min="0.05"
			max="1"
			step="0.01"
			value={paramState.grooveMargin}
			oninput={handleNumber('grooveMargin')}
			class="w-full"
		/>
	</div>

	<!-- Label Radius -->
	<div class="space-y-1">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-1">
				<label class="text-xs text-muted-foreground" for="labelRadius">Label Radius (in)</label>
				<InfoTooltip text={TOOLTIPS.labelRadius} />
			</div>
			<span class="text-xs tabular-nums">{paramState.labelRadius.toFixed(2)}</span>
		</div>
		<input
			id="labelRadius"
			type="range"
			min="0.5"
			max="5"
			step="0.01"
			value={paramState.labelRadius}
			oninput={handleNumber('labelRadius')}
			class="w-full"
		/>
	</div>

	<hr class="border-border" />

	<!-- Amplitude -->
	<div class="space-y-1">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-1">
				<label class="text-xs text-muted-foreground" for="amplitude">Amplitude (px)</label>
				<InfoTooltip text={TOOLTIPS.amplitude} />
			</div>
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
	<div class="space-y-1">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-1">
				<label class="text-xs text-muted-foreground" for="spacing">Spacing (px)</label>
				<InfoTooltip text={TOOLTIPS.spacing} />
			</div>
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

	<hr class="border-border" />

	<!-- Cut Lines Toggle -->
	<div class="flex items-center gap-2">
		<label class="flex cursor-pointer items-center gap-2 text-sm" for="cutLines">
			<input
				id="cutLines"
				type="checkbox"
				checked={paramState.cutLines}
				onchange={() => { paramState.cutLines = !paramState.cutLines; }}
				class="rounded"
			/>
			Cut lines
		</label>
		<InfoTooltip text={TOOLTIPS.cutLines} />
	</div>

	<!-- Advanced toggle -->
	<button
		class="text-xs text-muted-foreground hover:text-foreground"
		onclick={() => { showAdvanced = !showAdvanced; }}
	>
		{showAdvanced ? 'Hide' : 'Show'} advanced
	</button>

	{#if showAdvanced}
		<!-- Min Distance -->
		<div class="space-y-1">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-1">
					<label class="text-xs text-muted-foreground" for="minDist">Min Distance (px)</label>
					<InfoTooltip text={TOOLTIPS.minDist} />
				</div>
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
		<div class="space-y-1">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-1">
					<label class="text-xs text-muted-foreground" for="thetaIter">Steps/Rev</label>
					<InfoTooltip text={TOOLTIPS.thetaIter} />
				</div>
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
	{/if}
</div>
