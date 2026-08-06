# Memory — Block Aero Brand Kit (v3)

## Canon default logo
**`lockup-horizontal.png`** is the canonical default raster export of the
primary logo (Spectrum Wing mark + "Block◆Aero" wordmark). Use this file
whenever a PNG/raster version of the logo is needed (docs, decks, email,
web) instead of re-exporting from SVG each time.

- Source: `lockup-horizontal.svg` in this folder.
- Rendered 1600×365px, transparent background, via `cairosvg`.
- Must show the full "Spectrum" gradient across the chevrons: ember
  `#E8761A` → gold `#F5C53A` → blue `#1C5FC0` → green `#1AAB65` (see the
  Color section in `index.html`). If a re-render shows mostly blue/teal
  with no orange/gold, the renderer is broken — see gotcha below.

## Session WIP indicator (canon)
**`session-wip.js`** — occupancy loader for session / agent / model /
Tessaron work-in-progress. Not a circular spinner.

- **Mechanic:** 3×3 fixed slots; frames toggle which cells are lit
  (Cursor-adjacent occupancy, BA-styled).
- **Glyph:** Spectrum Wing tooth (chevron) by default; `glyph: 'triangle'`
  optional.
- **Color:** each lit cell samples the spectrum by `(cellIndex/9 + time)` —
  ember → gold → blue → green.
- **Sizes:** 14px session rows, 18px tab chrome; 34px for geometry review.
- **API:** `SessionWip.create(el, { size, glyph, animate })` or
  `SessionWip.mountAll()` on `[data-session-wip]`.
- **Do not use for:** boot splash (Hangar Drift), network status
  (`SpectrumLoader`), or generic `.spinner-sm` pipeline activity (legacy
  hex assemble).
- Live in brand kit `index.html`; exploration mockup at
  `/static/mockups/session-wip-indicator.html`.

## Rendering gotcha
ImageMagick's `convert` lists `rsvg-convert` as its SVG delegate, but if
that binary isn't actually installed, `convert` silently falls back to
its own weak built-in SVG renderer. That fallback mishandles this file's
`linearGradient` (`gradientUnits="userSpaceOnUse"` under a nested
`translate`+`scale`) and drops the orange/gold stops, rendering mostly
blue-green — with no error thrown.

**Fix:** always render this SVG with `cairosvg` (or a verified working
`rsvg-convert`/Inkscape), and visually confirm all four spectrum colors
appear before treating an export as final:

```
python3 -m cairosvg lockup-horizontal.svg -o lockup-horizontal.png --output-width 1600
```
