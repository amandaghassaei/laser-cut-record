# Laser Cut Record

## Tech Stack
- SvelteKit (Svelte 5 runes, adapter-static, ssr: false)
- Tailwind CSS v4
- shadcn-svelte (bits-ui) for UI components (tooltip, dialog)
- Three.js for 2D preview (OrthographicCamera + MapControls)
- pdf-lib for PDF export
- Lucide icons

## Deployment
- GitHub Pages at `/laser-cut-record` (paths.base set in svelte.config.js)
- Static build output in `build/`

## UI Components
- shadcn-svelte components are manually created in `src/lib/components/ui/` (CLI init was not used)
- Tooltip text lives in `src/lib/tooltips.ts` for easy editing
- `cn()` utility at `src/lib/utils.ts`

## Audio
- All audio decoded to mono Float32Array via Web Audio API
- Use `$app/paths` `base` when fetching static assets
