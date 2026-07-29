# Cowork session prompt

Run **one batch per session**. Change the `BATCH` line, paste, go. Batches are
ordered by dependency — batch 4 locks the isometric style that batches 5 and 6
depend on, so don't reorder those.

| Batch | Images | Count | What it unblocks |
|---|---|---|---|
| 1 | C5–C11 | 7 | Social cards for all 27 pages |
| 2 | C1–C4 | 4 | Homepage above the fold |
| 3 | C12–C17 | 6 | 23 bare heroes + homepage problem section |
| 4 | U18, U20, U26 | 3 | **Locks the isometric style for the other 18** |
| 5 | U27–U34 | 8 | Solutions routing + 7 bare segments + ARM page |
| 6 | U19, U21–U25 | 6 | Last of the concept placeholder wireframes |
| 7 | U35–U42 | 8 | News, case study, about credibility |
| 8 | N43–N50 | 8 | Site-wide depth and consistency |

---

## The prompt

```
Use the block-aero-brand-imagery skill to execute one batch of the imagery
plan in this repo.

BATCH: 1 — entries C5 through C11 (the seven 1200x630 social share cards)

Read these first, in this order:
1. images/IMAGERY-SPEC.md — the gap analysis and the full 50-image inventory.
   Your batch's entries are in §3 with per-image filename, family, target ratio,
   destination slot anchor and brief. §4 has the rollout plan; §5 has the
   revision history and why slots are anchored rather than line-numbered.
2. images/_pipeline/README.md — the working directory contract: where raw output,
   masters, and the ARM reference set live, and the pinned palette for this set.
3. images/_pipeline/MANIFEST.md — the provenance format you must log to.

Before generating anything:

- Check images/_pipeline/arm-reference/ for images that already satisfy an entry
  in your batch. The AI Records Manager set is on-brand Block Aero work. If
  something fits, recrop it and log it as a reuse instead of generating — cheaper
  and more consistent. This matters most for C11, U33 and U34 (the AI & Agentic
  line).
- Mine arm-reference/ for style reference regardless. 21 of the 50 images are
  isometric and must read as one system.
- Locate every slot by its anchor, never by line number. The spec identifies each
  slot by a section id, an <svg> aria-label string, or heading text — grep for
  that. The spec deliberately contains no line numbers: earlier revisions used
  them and two consecutive commits invalidated every reference. If an anchor
  doesn't resolve, the slot has genuinely moved or gone — stop and say so rather
  than guessing at a nearby line.

Palette, pinned to match css/style.css (NOT the ARM set's #0E1320):
navy #0A0E16 / #141C2E, blue #1C5FC0 / #2B86D4, orange #E8761A, gold #F5C53A,
green #1AAB65 / #27C47A.

Guardrails are non-negotiable and Block Aero has real exposure on two of them —
it's an aviation compliance company and a blockchain company. Every image, every
generation:
- No rendered text, letters or numbers unless the brief explicitly asks. Gemini
  slips in legible mock text constantly — fake form fields, spine labels, crate
  stencils, UI copy. Zoom every paper, screen, tag, sign and stencil at full
  resolution and regenerate if anything reads as words.
- No real or forgeable regulatory documents, certificates or airworthiness tags.
  A convincing fake 8130-3 or EASA Form 1 is a reputational problem, not just an
  off-brief image.
- No real airline liveries, tail numbers or registration marks. Aircraft
  unpainted and unbranded.
- No OEM or manufacturer logos — aviation OEMs and ordinary consumer brands
  alike. Gemini has slipped Dell/Apple/Lenovo design cues onto generic office
  equipment. Any recognizable brand cue counts, not just a wordmark.
- No identifiable human faces. Backs of heads, over-the-shoulder framing and
  faces in deep shadow are all fine; a lit, in-focus, recognizable face is not.
- No cryptocurrency or blockchain visual clichés — no coins, tokens, glowing
  cubes or hexagon-chain motifs. Express trust and verification through nested
  shapes, containment, checkmarks, bounded node clusters.
- No valid-format part numbers, serial numbers or CAGE codes. Short, obviously
  illustrative or illegible stamped values are fine and expected.

Per image, in order:
1. One image per Gemini conversation — never batch prompts in a thread.
2. Flatten STYLE BLOCK + PALETTE + GUARDRAILS + the spec's brief into a single
   paragraph with no line breaks. Gemini retains nothing between images, so
   restate all of it every time.
3. Generate. Guardrail-check at FULL resolution, never from a thumbnail.
   Regenerate on any violation.
4. Download and verify a new file actually landed — Gemini's download button
   fails silently often enough to check every time.
5. Save the untouched download to images/_pipeline/raw/.
6. Patch the sparkle watermark with the skill's scripts/patch_sparkle.py, then
   run its `check` mode and confirm the patch is invisible at realistic display
   size before accepting.
7. Save the patched master to images/_pipeline/masters/ under the spec's exact
   filename.
8. Export a web-optimized derivative into the shipping directory the spec's
   family maps to — images/og/, images/iso/, images/abstract/, images/tile/ or
   images/photos/. See images/README.md for the mapping.
9. Log a MANIFEST.md entry in the exact format in that file. Fill every field —
   "Pass" with no detail is not an acceptable guardrail check.

Then wire the batch into the site and update the progress table in MANIFEST.md.
For BATCH 1 specifically, the markup work is:
- Point each page's og:image at its family card per the spec's C5-C11 mapping.
- Add og:image:width 1200 and og:image:height 630.
- Add twitter:image alongside, and change twitter:card from "summary" to
  "summary_large_image" on every page.
- Add og:image to 404.html — it's the only page currently without one.
- Verify with a card validator before committing.

Every <img> you add anywhere gets explicit width and height attributes. The site
already does this on its logos; stay consistent. Thirteen full-bleed photographs
across this set will cost real page weight otherwise.

Commit on branch claude/block-aero-imagery-batch-1 with the masters, the raw
files, the shipping derivatives, the MANIFEST entries and the markup changes
together, then open a PR.

Stop and ask me if: a slot referenced in the spec has moved or disappeared, an
entry needs a brief materially different from what the spec says, an image needs
more than three regenerations to clear guardrails, or a batch-1 og:image mapping
looks wrong for a page.

Don't start batches beyond the one named above.
```

---

## Notes for later batches

**Batch 3** needs a new `.page-hero--art` CSS variant before the five hero bands
can be applied — roughly 20 lines in `css/style.css` plus one class per page.
Decide the crop and scrim treatment before generating, since the images depend on
it. Add to the prompt: *"First add a .page-hero--art variant to css/style.css that
carries a background image with a scrim dark enough for white type at every
breakpoint, then apply the five bands across the 23 bare pages by the family
mapping in spec C12-C16."*

**Batch 4 is the style-lock batch and the most important one to get right.** Three
images — one concept diagram (U18), one containment diagram (U20), one 1:1 tile
(U26). Add to the prompt: *"These three exist to fix the isometric house style for
the 18 that follow. Generate them, then write the settled values — isometric
angle, line weight, platform thickness, node treatment, accent-colour rule — into
a STYLE BLOCK section at the bottom of images/_pipeline/README.md so later batches
reuse it verbatim. Show me the three before writing it down."*

**Batch 5's seven tiles (U26–U32) must be generated in one sitting** against the
locked style. They sit in a single grid where any inconsistency is visible at a
glance. Add: *"Generate all seven tiles consecutively without interruption, then
review them as a set at grid size before accepting any of them."*

**Batch 7 is photography and the biggest quality risk in the set.** If real
facility photography from eCube, Ascent or JALUX is available, use it instead —
generated documentary photography of aviation interiors is where liveries, OEM
cues and legible placards slip through. Add: *"Generate one test image first and
guardrail-check it at full resolution before committing to the remaining seven."*
