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

**`arm-reference/`** — OPTIONAL. A place to put the existing AI Records Manager
asset set, if you have it handy, so a batch can reuse or reference it. This
directory is normally empty and that is completely fine — nothing in the plan
requires it. Don't go out of your way to populate it; if it's empty, every batch
just generates everything fresh, including the AI & Agentic entries.

If you do have that set sitting on a local machine and it's convenient to drop
in, here's what to know first: it's likely RAW Gemini downloads with the sparkle
watermark still on. Treat anything you find in here as unprocessed output, not a
finished master.

Two jobs if files are present, and the watermark affects one of them:

1. **Reuse.** Spec entries C11, U33 and U34 target the AI & Agentic line. If the
   ARM set already contains a usable image, reusing it beats regenerating — but
   it is **not** a straight recrop, because the sparkle is still present. The
   sequence is: locate the sparkle with `patch_sparkle.py find`, patch it (`blur`
   for flat backgrounds, `shift` when it sits on a rule or edge), confirm with
   `check` at realistic display size, *then* crop to the spec's target ratio, then
   export the web derivative. Log it in `MANIFEST.md` with the **Reused from** and
   **Processing** fields, recording exactly how the sparkle came out — same
   standard as a freshly generated image.
2. **Style reference.** 21 of the 50 planned images are isometric and have to read
   as one system. The ARM set is the closest existing body of on-brand Block Aero
   illustration — mine it for the isometric angle, line weight, platform
   thickness and accent-colour discipline before generating anything new. The
   watermark is irrelevant for this purpose; don't patch anything you're only
   looking at.

Also note: these are raw, so they have **not** been guardrail-checked against this
project's brief. Anything reused needs the full check at full resolution — rendered
text, liveries, OEM cues, faces — before it ships, exactly as if you had just
generated it.

Keep the ARM set's original filenames and its own `MANIFEST.md` if it has one.
Don't renumber it into this spec's sequence — it's a separate inventory, and
conflating the two loses which images were audited against which brief.

**Not committed.** `.gitignore` excludes the image files in this directory. Fifty
full-size Gemini PNGs are roughly 50–100 MB, and git history is permanent — the
deploy workflow strips `_pipeline/` from what ships, but it cannot strip anything
from history. Only the patched derivatives that actually get reused go into the
repo, under their spec filenames in `masters/` and the shipping directories.

`arm-reference/committed/` is tracked in git (unlike the rest of this directory)
in case a small curated subset is ever worth checking in for style reference. It
is also fine to leave empty forever — nothing downstream depends on it.

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
