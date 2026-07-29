# `_pipeline/` — imagery working directory

Non-shipping. Raw generation output, the ARM reference set, and provenance live
here. Nothing in this directory is referenced by the site's HTML.

## Layout

```
_pipeline/
  README.md              this file
  COWORK-PROMPT.md       the session prompt for executing the spec
  MANIFEST.md            provenance log — one entry per finished image
  raw/                   Gemini_Generated_Image_*.png, unmodified
  masters/               patched, renamed, full-resolution PNG masters
  arm-reference/         the existing AI Records Manager 50-image set
```

## What goes where

**`raw/`** — every `Gemini_Generated_Image_*.png` exactly as downloaded, before
any watermark patching. Keep all of them, including rejected generations. The
brand-imagery skill is explicit: don't delete these. They're the provenance trail
and the source if a variant needs redoing.

**`masters/`** — the patched, renamed, full-resolution result. One file per
inventory entry, named per the spec:
`newpub-<category>-<subject>-<nn>-<ratio>.png`. These are masters, not web
assets — full resolution, no compression pass. The web derivative gets exported
from here into the shipping directory (`images/og/`, `images/iso/`,
`images/abstract/`, `images/tile/`, `images/photos/`).

**`arm-reference/`** — the existing AI Records Manager asset set, pasted in
wholesale. Two jobs:

1. **Reuse.** Spec entries U33, U34 and C11 target the AI & Agentic line. If the
   ARM set already contains a usable image, recrop it instead of generating a new
   one and note the reuse in `MANIFEST.md`. Cheaper and more consistent than
   regenerating.
2. **Style reference.** 21 of the 50 planned images are isometric and have to read
   as one system. The ARM set is the closest existing body of on-brand Block Aero
   illustration — mine it for the isometric angle, line weight, platform
   thickness and accent-colour discipline before generating anything new.

Keep the ARM set's original filenames and its own `MANIFEST.md` if it has one.
Don't renumber it into this spec's sequence — it's a separate inventory, and
conflating the two loses which images were audited against which brief.

## Working rules

From `block-aero-brand-imagery`, non-negotiable:

- One image per Gemini conversation. Never batch prompts in one thread.
- Full STYLE BLOCK + PALETTE + GUARDRAILS flattened into a single paragraph on
  every generation. Gemini retains nothing between images.
- Guardrail-check at full resolution, never from a thumbnail. Zoom every paper,
  screen, tag, sign and stencil in the frame.
- Patch the sparkle watermark with the skill's `scripts/patch_sparkle.py`, then
  `check` at realistic display size before accepting.
- One `MANIFEST.md` entry per finished file, in the skill's exact format.

## Palette for this set

Pinned to match `css/style.css`, not the ARM set's `#0E1320`:

- Navy: `#0A0E16` / `#141C2E`
- Blue: `#1C5FC0`, lighter `#2B86D4`
- Orange: `#E8761A`
- Gold: `#F5C53A`
- Green: `#1AAB65`, lighter `#27C47A`
