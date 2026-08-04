# Cowork session prompt

Run **one batch per session**. Change the `BATCH` line, paste, go. Batches are
ordered by dependency — batch 4 locks the isometric style that batches 5 and 6
depend on, so don't reorder those.

| Batch | Images | Count | What it unblocks |
|---|---|---|---|
| 1 | C5–C11 | 7 | Social cards for all 27 pages |
| 2 | C1–C4 | 4 | Homepage above the fold |
| 3 | C12–C17 | 6 | 23 bare heroes + homepage problem section |
| 4 | U18, U33, U20 | 3 | **Locks BOTH visual languages** — photographed paper (U18, U33) and isometric (U20) |
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

- images/_pipeline/arm-reference/ MAY contain the existing AI Records Manager
  asset set — it's optional and probably won't be there. Don't stop or ask if
  it's empty; just generate everything in your batch fresh. It has no required
  files, it's purely a shortcut if present.
- IF it has files, treat them as raw, unpatched, unwatermarked-check-pending
  Gemini downloads, not finished masters: (a) possible reuse for C11, U33, U34 —
  patch the sparkle first (patch_sparkle.py find, then blur or shift, then
  check), THEN crop to the spec ratio, THEN run the full guardrail check same as
  any fresh generation, before logging it as reused; (b) style reference for the
  21 isometric images — fine to look at as-is, no need to patch anything you're
  only studying.
- If it's empty (the normal case), skip both of the above and generate every
  entry in your batch, including C11/U33/U34, the same way as everything else.
- Locate every slot by its anchor, never by line number. The spec identifies each
  slot by a section id, an <svg> aria-label string, or heading text — grep for
  that. The spec deliberately contains no line numbers: earlier revisions used
  them and two consecutive commits invalidated every reference. If an anchor
  doesn't resolve, the slot has genuinely moved or gone — stop and say so rather
  than guessing at a nearby line.

BRAND CANON: v3, read off live ai-records-manager.com (deployed 2026-08-03). Read
IMAGERY-SPEC.md section 0 before generating — it has the full canon and the image
treatment rules. Do NOT take the palette from css/style.css; that file still ships
the SUPERSEDED #1C5FC0 / #0E1320 / Inter.

Palette: navy ground #0A0E16; PRIMARY BLUE #3B82F0 (darker #2563D4); orange #E8761A;
gold #F5C53A; text #E8EDF5 / #9AA6B8 / #6B7589; panels #111827 and #0B1220; hairline
rgba(255,255,255,.12); green #1AAB65 for verification ticks ONLY, not as a field
colour. RETIRED, do not use: #141C2E, #2B86D4, #27C47A. One exception: the logo
spectrum gradient keeps the old blue — #E8761A 0% / #F5C53A 35% / #1C5FC0 65% /
#1AAB65 100%.

ART DIRECTION: v3 is DOCUMENTARY PHOTOGRAPHY-LED, not illustration. The entire ARM
homepage carries one 16px icon and no illustration library. This set is 28
photographs, 8 isometric, 14 abstract — if a brief in your batch reads as flat
editorial illustration, check it against section 0; rev 4 re-briefed 15 entries from
illustration to photography and the family word is part of the filename.

Two treatment rules that change what you generate:
- Generate photographs UN-VEILED and full-frame. The navy veil gradient, the 16px
  rounded panel and the hairline border are applied in CSS at integration, never
  baked into the image.
- Everything in the abstract and iso families ships with a "Concept" provenance pill.
  v3 never passes concept art off as product. Nothing you generate may imply it is a
  real product screenshot or a real customer record.

PRODUCT NAME: the v3 name is "Agentic Records Manager" (abbreviated ARM), not "AI
Records Manager". Use it in briefs and alt text. The repo's HTML prose still says the
old name 72 times — that is a separate copy change, listed in IMAGERY-SPEC section 6.
Do NOT edit page prose as part of an imagery batch.

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

**Batch 4 is the style-lock batch and the most important one to get right.** Rev 4
needs TWO languages locked, and the photographic one matters more: 28 of 50 images
are photographs, only 8 remain isometric. Add to the prompt: *"Generate U18 and U33
first — these two define how every document photograph in the set is lit, squared and
framed, and 11 of the 28 photographs are that class. Then U20 for the isometric
reference. Write the settled values — bench surface, raking-light angle, degree of
fan, how paper reads as documents without reading as words; and for isometric, angle,
line weight, platform thickness, node treatment — into a STYLE BLOCK section at the
bottom of images/_pipeline/README.md so later batches reuse it verbatim. Show me all
three before writing it down."*

**Batch 5's seven tiles (U26–U32) must be generated in one sitting** against the
locked style. Rev 4 re-briefed all seven from isometric tiles to square documentary
crops. They sit in a single grid where any inconsistency is visible at a
glance. Add: *"Generate all seven tiles consecutively without interruption, then
review them as a set at grid size before accepting any of them."*

**Batch 7 is photography and the biggest quality risk in the set.** If real
facility photography from eCube, Ascent or JALUX is available, use it instead —
generated documentary photography of aviation interiors is where liveries, OEM
cues and legible placards slip through. Add: *"Generate one test image first and
guardrail-check it at full resolution before committing to the remaining seven."*
