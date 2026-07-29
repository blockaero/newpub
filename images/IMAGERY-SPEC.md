# block.aero imagery gap analysis & generation spec

**Date:** 2026-07-29
**Site audited:** this repo at `da141e1` — 25 shipping pages, `css/style.css`, `js/main.js`
**Pipeline:** `block-aero-brand-imagery` skill (Gemini via browser automation → guardrail check → sparkle patch → catalog in `images/MANIFEST.md`)
**Scope:** 46 images across three content families, in three priority tiers

> Internal planning doc. The Pages workflow deploys the repo root as-is, so this
> file is reachable once merged; `robots.txt` disallows it. Move it out of the
> repo if that isn't good enough.

---

## 1. What the audit found

### Inventory today

| Asset class | Count | Notes |
|---|---|---|
| Brand marks / logo lockups | 19 files | Complete. Not a gap. |
| Partner & regulator logos | 13 files | Complete. Not a gap. |
| Product UI screenshots | 9 files | Real captures, good quality. Only 6 are referenced. |
| **Documentary photographs** | **4 files** | `wing-sunset`, `ascent-visit`, `ecube-audit`, `teardown-bench` — and `teardown-bench.jpg` is an unreferenced orphan. |
| **Isometric / concept illustration** | **0 files** | None exist. Every concept visual is hand-authored inline SVG. |
| **Abstract / texture art** | **0 files** | None exist. All section atmosphere is CSS gradients + one hex data-URI. |

Three real photographs carry the entire site. That is the headline finding.

### The five structural gaps

**G1 — Homepage carousel is half-finished.** `index.html` has a 6-slide featured
carousel above the fold. Slides 1 and 4 use real photography. Slides 2, 3, 5 and 6
(`index.html:231`, `:257`, `:311`, `:332`) are hand-drawn SVG gradient blobs with
dashed circles and flat wing shapes. Because they sit in the same rotation as the
two real photos, the contrast is immediate and unflattering — the site looks like
it ran out of budget mid-build.

**G2 — Social share cards are a 279px logo, site-wide.** All 25 pages point
`og:image` at `images/logo_ring.png` — a **279×279** logo ring, against a 1200×630
platform expectation. `twitter:card` is `summary`, not `summary_large_image`, and
no page sets `twitter:image` at all. For a B2B company whose deal flow runs
through links pasted into Slack, LinkedIn and email, every share currently renders
as a tiny undifferentiated tile. Highest polish-per-image ratio on the list.

**G3 — 22 of 25 pages have no hero art.** Only 4 pages use `hero hero-dark`;
22 use `hero page-hero`, which `style.css:337` defines as padding and nothing else.
Landing on `trust.html`, `pricing.html`, or `registries.html` gives you a headline
on a flat gradient. Consistent, and consistently thin.

**G4 — 19 concept visuals are placeholder wireframes.** Every `feature-visual`
slot holds inline SVG mimicking a UI: `iv-card`, `iv-ln`, `iv-soft` rectangles
approximating windows and text rows. For the ~9 slots standing in for actual
product screens this is acceptable shorthand. For the 10 standing in for
*concepts* — data package flow, private channel isolation, chain of custody,
registry visibility tiers — it reads as unfinished mockup, not design.

**G5 — Card photo support exists and is unused.** `style.css:884` defines
`.card-photo` with a 188px cover crop. Across 250+ `.card` blocks site-wide it is
used **twice** (`news.html:134`, `news-ecube-unical.html`). The news index, the
JALUX case study and the about page all render as walls of text cards while the
design system already supports imagery in them.

---

## 2. Counts by family and priority

| | Photo-realistic | Isometric | Abstract | **Total** |
|---|---|---|---|---|
| **Critical** | 5 | 1 | 10 | **16** |
| **Urgent** | 8 | 10 | 0 | **18** |
| **Nice to have** | 0 | 4 | 8 | **12** |
| **Total** | **13** | **15** | **18** | **46** |

Tier definitions used here:

- **Critical** — visible on first impression, or actively signals unfinished work.
  Fixing these changes whether the site reads as premium.
- **Urgent** — the placeholder-quality layer. Not broken, but caps how polished
  the site can feel. Do straight after critical.
- **Nice to have** — depth and consistency. Real improvements, no credibility cost
  if deferred.

---

## 3. Numbered inventory

Filenames follow the skill convention:
`newpub-<category>-<subject>-<nn>-<ratio>.png`. Project prefix is `newpub`.
Categories: `photo`, `iso`, `abstract`, `og`, `texture`, `empty`, `deck-bg`.

### CRITICAL — 16 images

#### C1–C4 · Homepage carousel slides (gap G1)

| # | Filename | Family | Ratio | Slot | Brief |
|---|---|---|---|---|---|
| 01 | `newpub-photo-teardown-harvest-01-16x9` | photo | 16:9 | `index.html:231` slide 2, eCube & Unical | Documentary wide shot of a stripped narrowbody airframe in a disassembly bay, unpainted skin, harvested parts staged on pallets in the foreground, flat overcast daylight through open hangar doors. |
| 02 | `newpub-iso-part-lifecycle-02-16x9` | iso | 16:9 | `index.html:257` slide 3, Every Part Carries Its History | Isometric lifecycle rail carrying one serialized rotable left to right through four raised station platforms — manufacture, install, shop visit, resale — each marked with a small nested-square node. |
| 03 | `newpub-abstract-trust-network-03-16x9` | abstract | 16:9 | `index.html:311` slide 5, Trust at the Speed of Data | Bounded cluster of organization nodes joined by thin arcs following an implied globe curvature, denser toward the right; membership shown by containment rather than chain links. |
| 04 | `newpub-abstract-iso27001-seal-04-16x9` | abstract | 16:9 | `index.html:332` slide 6, ISO 27001 | Layered concentric aperture resolving to a single checkmark at centre, deep navy field, one gold rim light, restrained and editorial — no shield cliché. |

#### C5–C10 · Social share cards (gap G2)

All 1200×630. Each is a family template: brand mark at a consistent position,
distinct abstract field per family so shares are visually differentiated.
Also requires markup changes — see §4 step 2.

| # | Filename | Family | Ratio | Applies to |
|---|---|---|---|---|
| 05 | `newpub-og-home-05-1200x630` | abstract | 1200×630 | `index.html` |
| 06 | `newpub-og-products-06-1200x630` | abstract | 1200×630 | `products.html`, `pricing.html`, `acc-rates.html` |
| 07 | `newpub-og-solutions-07-1200x630` | abstract | 1200×630 | `solutions.html`, `afra-caac.html`, `earc.html` |
| 08 | `newpub-og-platform-08-1200x630` | abstract | 1200×630 | `platform.html`, `registries.html` |
| 09 | `newpub-og-trust-09-1200x630` | abstract | 1200×630 | `trust.html`, `policies.html`, `faq.html`, `glossary.html` |
| 10 | `newpub-og-company-10-1200x630` | abstract | 1200×630 | `about.html`, `news.html` + 5 news detail pages, `contact.html`, `get-started.html`, `investors.html`, `resources.html`, `casestudy-jalux.html` |

#### C11–C15 · Hero band art (gap G3)

Five reusable bands covering 22 bare heroes, assigned by page family. Dark,
heavily scrimmed, built to sit behind white type at 21:9.

| # | Filename | Family | Ratio | Applies to | Brief |
|---|---|---|---|---|---|
| 11 | `newpub-photo-hero-hangar-11-21x9` | photo | 21:9 | `products.html`, `pricing.html`, `acc-rates.html`, `get-started.html` | Wide low-angle hangar interior at blue hour, unpainted airframe silhouette, structural bays receding right, deep shadow across the lower two thirds for type. |
| 12 | `newpub-photo-hero-records-12-21x9` | photo | 21:9 | `earc.html`, `faq.html`, `glossary.html`, `resources.html`, `policies.html` | Shallow-focus row of archive boxes and binder spines on steel shelving, raking side light, spine labels illegible by depth of field. |
| 13 | `newpub-photo-hero-engine-13-21x9` | photo | 21:9 | `registries.html`, `afra-caac.html`, `solutions.html` | Turbofan fan face off-centre in a shop bay, unbranded, cool overhead light with one warm practical, negative space to the left. |
| 14 | `newpub-abstract-hero-mesh-14-21x9` | abstract | 21:9 | `trust.html`, `platform.html`, `contact.html` | Wide navy field with a fine perspective mesh flattening toward the horizon, three nested-square nodes at unequal intervals, single soft blue bloom. |
| 15 | `newpub-abstract-hero-grid-15-21x9` | abstract | 21:9 | `about.html`, `news.html` + news detail pages, `investors.html`, `casestudy-jalux.html` | Wide navy field, sparse orthogonal grid, one gold horizon rule off-centre, otherwise near-empty — built to sit quietly under editorial headlines. |

#### C16 · Homepage problem section (gap G5)

| # | Filename | Family | Ratio | Slot | Brief |
|---|---|---|---|---|---|
| 16 | `newpub-photo-paper-records-16-3x2` | photo | 3:2 | `index.html:142` "Aviation Runs on Trust. Trust Still Runs on Paper." — currently text-only | Over-the-shoulder framing of hands working through a thick stack of loose maintenance paperwork on a workbench, no faces, no legible text, practical desk light — the problem the product solves, shown once and plainly. |

### URGENT — 18 images

#### U17–U26 · Concept wireframe replacements (gap G4)

All 3:2, all isometric, all replacing an inline `feature-visual` SVG. The nine
remaining `feature-visual` slots that stand in for real product screens are
deliberately excluded — those should get screenshots, not illustration.

| # | Filename | Slot | Brief |
|---|---|---|---|
| 17 | `newpub-iso-data-package-17-3x2` | `products.html:135` | Isometric assembly of loose record sheets converging into one sealed package, then fanning out along four short rails to distinct recipient platforms. |
| 18 | `newpub-iso-openapi-18-3x2` | `products.html:209` | Isometric central platform slab with three typed connectors seating into sockets on adjacent external systems — connection shown by fit, not by wires. |
| 19 | `newpub-iso-private-channel-19-3x2` | `products.html:238` | Isometric ledger corridor enclosed in a translucent boundary wall, two enterprise systems docking through gated ports, everything outside the boundary greyed. |
| 20 | `newpub-iso-afra-caac-flow-20-3x2` | `products.html:363` | Isometric four-station route from teardown bay through inspection and registry to installation on a receiving airframe, one continuous raised rail throughout. |
| 21 | `newpub-iso-passport-transfer-21-3x2` | `solutions.html:212` | Isometric passport card lifting off one owner platform and settling onto the next, with its stacked history slab travelling underneath intact. |
| 22 | `newpub-iso-mro-workflow-22-3x2` | `solutions.html:274` | Isometric shop-visit pipeline: induction, teardown, repair, test, release — five platforms at descending then ascending heights, each emitting one record tile upward. |
| 23 | `newpub-iso-registry-tiers-23-3x2` | `registries.html:100` | Three isometric concentric enclosures at increasing wall height for public, semi-private and private visibility, same record object visible at differing clarity in each. |
| 24 | `newpub-iso-earc-swap-24-3x2` | `earc.html:106` | Isometric paired platforms: a loose paper sheet on the left dissolving into a structured record slab on the right, arrow implied by platform elevation. |
| 25 | `newpub-iso-chain-of-custody-25-3x2` | `afra-caac.html:166` | Three isometric registry slabs — aircraft, engine, part — stacked at offset depths and stitched by one continuous vertical spine. |
| 26 | `newpub-iso-supply-network-26-3x2` | `casestudy-jalux.html:86` | Isometric multi-node supply network across an implied region, one hub platform larger than the rest, thin routed rails between nodes. |

#### U27–U30 · News card photography (gap G5)

All 16:9, cropped to `.card-photo`'s 188px band. Fills the 4 empty news cards in
`news.html` and doubles as hero art on each news detail page.

| # | Filename | Card | Brief |
|---|---|---|---|
| 27 | `newpub-photo-news-iso27001-27-16x9` | ISO 27001 certification | Server room cold aisle, cabinet doors closed, cool blue key light, one warm status glow — infrastructure security without a padlock cliché. |
| 28 | `newpub-photo-news-api-28-16x9` | openAPI Integration Services live | Over-the-shoulder framing of an engineer at a two-monitor workstation, screens out of focus and illegible, warm desk lamp against cool room light. |
| 29 | `newpub-photo-news-ascent-29-16x9` | Ascent Aviation goes digital | Desert storage apron at low sun, two unpainted airframes in the middle distance, long shadows, wide and quiet. |
| 30 | `newpub-photo-news-usm-seminar-30-16x9` | USM seminar | Conference room from the back of the audience, heads and shoulders only, projected slide reduced to a bright unreadable rectangle. |

#### U31–U32 · JALUX case study (gap G5)

| # | Filename | Ratio | Slot | Brief |
|---|---|---|---|---|
| 31 | `newpub-photo-jalux-warehouse-31-16x9` | 16:9 | `casestudy-jalux.html` hero | High wide shot down a parts warehouse aisle, bin racking to the ceiling, uniform overhead light, no visible labels or brands. |
| 32 | `newpub-photo-jalux-receiving-32-3x2` | 3:2 | mid-page proof block | Receiving bench with a crated rotable partially unpacked, gloved hands at the edge of frame, inspection lamp overhead, no legible markings. |

#### U33–U34 · About page (gap G5)

| # | Filename | Ratio | Slot | Brief |
|---|---|---|---|---|
| 33 | `newpub-photo-about-facility-33-16x9` | 16:9 | `about.html:117` "From First Registry to Implementation Partner" | Two people walking a hangar floor seen from behind at distance, high-vis vests, scale of the space doing the work. |
| 34 | `newpub-photo-about-audit-34-3x2` | 3:2 | `about.html:80` "Built at the Intersection…" | Three people around a workbench reviewing a component together, all faces turned away or in shadow, mixed daylight and task lighting. |

### NICE TO HAVE — 12 images

| # | Filename | Family | Ratio | Slot | Brief |
|---|---|---|---|---|---|
| 35 | `newpub-texture-band-navy-35-32x9` | abstract | 32:9 | Dark `.section` bands | Very low-contrast navy field, faint orthogonal grid, one off-centre bloom — tiles horizontally without a visible seam. |
| 36 | `newpub-texture-band-light-36-32x9` | abstract | 32:9 | `.section.soft` bands | Near-white field with the faintest blue dot lattice and a single soft tint sweep. |
| 37 | `newpub-texture-divider-rule-37-32x5` | abstract | 32:5 | Section transitions | Slim horizontal transition strip, navy to soft, one thin gold-to-orange gradient rule slightly off-centre. |
| 38 | `newpub-texture-cta-band-38-32x9` | abstract | 32:9 | Closing CTA on every page | Deep navy with a directional light sweep rising left to right, built to sit behind a single headline and two buttons. |
| 39 | `newpub-empty-offcourse-39-4x3` | abstract | 4:3 | `404.html` | Minimal navigation figure with one route diverging off the plotted path toward empty space — dry and on-brand, not cute. |
| 40 | `newpub-iso-empty-archive-40-4x3` | iso | 4:3 | Reusable product empty state | Open empty archive drawer at a simple three-quarter isometric angle, one dim interior guide rail, nothing filed. |
| 41 | `newpub-abstract-glossary-41-21x9` | abstract | 21:9 | `glossary.html`, `faq.html` | Wide navy field, sparse array of small uniform tiles at varying opacity suggesting an ordered reference set. |
| 42 | `newpub-abstract-resources-42-21x9` | abstract | 21:9 | `resources.html`, `policies.html` | Wide navy field with three offset stacked slabs at shallow depth, one edge-lit in gold. |
| 43 | `newpub-iso-acc-metering-43-3x2` | iso | 3:2 | `acc-rates.html` | Isometric metering column filling in discrete increments beside three consumption platforms of differing heights. |
| 44 | `newpub-iso-pricing-tiers-44-3x2` | iso | 3:2 | `pricing.html` | Three isometric platforms at ascending heights, each carrying progressively more module blocks, shared base slab. |
| 45 | `newpub-iso-onboarding-steps-45-3x2` | iso | 3:2 | `get-started.html` | Isometric four-step ascending path from a small entry platform to a fully populated workspace slab. |
| 46 | `newpub-deck-bg-investors-46-16x9` | abstract | 16:9 | `investors.html`, pitch deck reuse | Deep navy presentation ground, one broad diagonal light sweep, generous empty area for overlaid type. |

---

## 4. Plan to get started

### Step 0 — Confirm the spec (before any generation)

The skill is explicit that a wrong plan is cheaper to fix than 20 wrong images.
Two decisions worth settling first:

1. **Photo count.** 13 documentary photographs is the single biggest quality risk
   in this set — generated "documentary photography" is the hardest category to
   land, and aviation facility interiors invite guardrail slips (liveries, OEM
   logos, legible placards). If licensed stock or real facility photography from
   eCube, Ascent, or JALUX is obtainable, prefer it for U27–U34 and generate only
   C11–C13 and C16.
2. **Hero rollout.** C11–C15 assume a new `.page-hero--art` CSS variant. That is a
   ~20-line stylesheet change plus one class per page. Confirm before generating,
   since the crop and scrim depend on it.

### Step 1 — Pin the brief and scaffold (no generation)

- Pin the exact palette for this set. `brand-spec.md` allows a product to pin its
  own navy; recommend `#0A0E16` / `#141C2E` to match `style.css` rather than the
  AI Records Manager's `#0E1320`, so generated art matches the live CSS.
- Create `images/generated/` and an empty `images/MANIFEST.md` in the skill's
  format.
- Delete or wire up the `teardown-bench.jpg` orphan and the unreferenced
  `wing-sunset-1200.jpg`.

### Step 2 — Ship the social cards first (C5–C10, 6 images)

Highest polish-per-image on the list, fully independent of any layout work, and
six images covers all 25 pages. Ships in one pass:

- Generate the 6 family cards at 1200×630.
- Per page: point `og:image` at the family card, add `og:image:width` / `:height`,
  add `twitter:image`, and switch `twitter:card` from `summary` to
  `summary_large_image`.
- Add `og:image` to `404.html` (currently the only page without one).
- Verify with a card validator before merging.

### Step 3 — Fix the carousel (C1–C4, 4 images)

Brings the homepage's above-the-fold rotation to a uniform standard. Markup is
already in place — each slide swaps its inline `<svg class="cz-bg">` for an
`<img class="cz-bg">`, exactly as slides 1 and 4 already do. Keep the existing
SVGs as `display:none` fallbacks, matching the current pattern at
`index.html:210`.

### Step 4 — Hero bands + problem anchor (C11–C16, 6 images)

Add the `.page-hero--art` variant, then apply the five bands across the 22 bare
pages by family. Completes the critical tier.

### Step 5 — Isometric concept set (U17–U26, 10 images)

The largest single batch and the most stylistically demanding: ten isometric
illustrations that must read as one system. Generate #17 and #19 first, settle the
isometric angle, line weight, platform thickness and node treatment against those
two, then run the remaining eight against the locked description. Do not start
these before the critical tier ships.

### Step 6 — Photography (U27–U34, 8 images)

Contingent on the Step 0 photo decision. If generating: run one test image and
guardrail-check it at full resolution before committing to the batch — faces,
liveries, OEM cues and legible placards are all live risks in facility interiors.

### Step 7 — Nice-to-have (N35–N46, 12 images)

Textures first (N35–N38) since they lift every page at once; explainer diagrams
last, and only after the Step 5 isometric style is locked so they match.

### Working rules for every batch

- One image per Gemini conversation. Never batch prompts in a thread.
- Full STYLE BLOCK + PALETTE + GUARDRAILS flattened into a single paragraph on
  every generation — Gemini retains nothing between images.
- Guardrail check at full resolution, never from a thumbnail. Zoom every
  paper, screen, tag, sign and stencil in the frame.
- Patch the sparkle watermark with `scripts/patch_sparkle.py`, then `check` the
  result at realistic display size before accepting.
- Keep every raw `Gemini_Generated_Image_*.png` for provenance.
- One `MANIFEST.md` entry per finished file, in the skill's exact format.
- Export web derivatives (WebP + sized JPEG/PNG fallbacks) and set explicit
  `width`/`height` on every `<img>` — the site already does this on logos and
  should stay consistent. 13 full-bleed photographs will otherwise cost real
  page weight.

### Suggested sequencing

| Batch | Images | Count | Unblocks |
|---|---|---|---|
| 1 | C5–C10 | 6 | Every shared link, all 25 pages |
| 2 | C1–C4 | 4 | Homepage above the fold |
| 3 | C11–C16 | 6 | 22 bare heroes + homepage problem section |
| 4 | U17–U26 | 10 | Removes all concept placeholder wireframes |
| 5 | U27–U34 | 8 | News, case study, about credibility |
| 6 | N35–N46 | 12 | Site-wide depth and consistency |

Batches 1–3 (16 images) are the critical tier and the point at which the site
stops reading as unfinished. Batches 4–5 (18 images) are where it starts reading
as premium.
