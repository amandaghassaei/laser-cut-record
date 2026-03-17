# Laser Cut Record

A browser-based tool for generating laser-cuttable vinyl records from audio files. Upload an audio file, adjust groove parameters to match your laser cutter, preview the result in real time, and export as SVG or PDF for cutting.

This project is a web-based reimagining of the original [Laser Cut Record Instructables post](https://www.instructables.com/Laser-Cut-Record/) by [Amanda Ghassaei](https://amandaghassaei.com), which used Python and Processing scripts to generate vector files for laser cutting playable records. This app combines both steps into a single client-side tool with a live preview.

## Features

- Decode audio files (MP3, WAV, OGG, FLAC) directly in the browser
- Adjustable groove parameters: RPM, amplitude, spacing, DPI, dimensions, and more
- Real-time 2D preview with pan and zoom (Three.js)
- Export as vector SVG or PDF, ready to send to a laser cutter
- Fully client-side — no server required, all processing happens in your browser

## Getting Started

```sh
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser.

## Building

```sh
npm run build
```

The production build is output to `build/` as a static site (no server needed).

## Disclaimer

This project was vibe coded with [Claude Code](https://claude.ai) and may contain bugs or inaccuracies. If you run into any issues, please [open an issue](https://github.com/amandaghassaei/laser-cut-record/issues) or submit a pull request on the [GitHub repo](https://github.com/amandaghassaei/laser-cut-record).
