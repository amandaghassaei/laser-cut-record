<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index';
</script>

<Dialog.Root>
	<Dialog.Trigger
		class="inline-flex items-center rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
	>
		About
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Title>About Laser Cut Record</Dialog.Title>
		<Dialog.Description class="mt-3">
			A browser-based tool for generating laser-cuttable vinyl records from audio files.
		</Dialog.Description>

		<div class="mt-5 space-y-4 text-sm leading-relaxed">
			<p>
				This project is a web-based reimagining of the original
				<a
					href="https://www.instructables.com/Laser-Cut-Record/"
					target="_blank"
					rel="noopener noreferrer"
					class="font-medium underline underline-offset-4 hover:text-foreground"
				>Laser Cut Record Instructables post</a>
				by <a
					href="https://amandaghassaei.com"
					target="_blank"
					rel="noopener noreferrer"
					class="font-medium underline underline-offset-4 hover:text-foreground"
				>Amanda Ghassaei</a>,
				which used Python and Processing scripts to generate vector files for laser cutting playable records.
				This app combines both steps into a single browser-based tool with a live preview.
			</p>

			<div class="rounded-md border border-yellow-300 bg-yellow-50 p-3 text-xs text-yellow-900">
				<p class="font-medium">Heads up</p>
				<p class="mt-1">
					This project was vibe coded with Claude Code and may contain bugs or inaccuracies.
					If you run into any issues, feel free to get in touch or submit a pull request on the
					<a
						href="https://github.com/amandaghassaei/laser-cut-record"
						target="_blank"
						rel="noopener noreferrer"
						class="font-medium underline underline-offset-4 hover:text-yellow-700"
					>GitHub repo</a>.
				</p>
			</div>

			<p>
				Upload an audio file (or use the built-in example), adjust the groove parameters to
				match your laser cutter, preview the result, and export as SVG or PDF for cutting.
				All processing runs entirely in your browser — your audio files never leave your
				computer and nothing is uploaded to a server.
			</p>

			<p>
				The included example audio is Thomas Edison's 1927 re-enactment of
				"Mary Had a Little Lamb" — the first words ever recorded on a phonograph, originally
				demonstrated in 1877.
			</p>

			<p>
				Source code available on <a
					href="https://github.com/amandaghassaei/laser-cut-record"
					target="_blank"
					rel="noopener noreferrer"
					class="font-medium underline underline-offset-4 hover:text-foreground"
				>GitHub</a>.
			</p>
		</div>
	</Dialog.Content>
</Dialog.Root>
