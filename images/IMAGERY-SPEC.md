# block.aero imagery gap analysis & generation spec

**Date:** 2026-07-29
**Site audited:** this repo at `d082dfc` (post ARM-commercials wiring) — 26 sitemap pages + `404.html`, `css/style.css`, `js/main.js`
**Pipeline:** `block-aero-brand-imagery` skill (Gemini via browser automation → guardrail check → sparkle patch → catalog in `images/MANIFEST.md`)
**Scope:** 50 images across three content families, in three priority tiers

> Internal planning doc. The Pages workflow deploys the repo root as-is, so this
> file is reachable once merged; `robots.txt` disallows it. Move it out of the
> repo if that isn't good enough.

**Revision note (rev 3).** Rev 1 was audited at `da141e1`; `684cd10` then added
`arm.html`, regrouped Solutions by business type, and added the FinTech
coming-soon block, which killed two slots and opened four gaps (46 → 50 images).
`d082dfc` then wired ARM commercials in and added a site-wide nav entry, which
shifted **every line number in this spec by one to two lines** — the second
consecutive commit to invalidate the references.

Line numbers are the wrong anchor for this document. Rev 3 replaces them with
stable anchors: section `id` attributes, `<svg>` `aria-label` strings, and heading
text. Every `feature-visual` placeholder carries a unique `aria-label`, and every
Solutions segment has a section `id`, so each slot has an anchor that survives
content edits. The inventory count is unchanged at 50. See §5 for the full diff.

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

Three real photographs carry the entire site.

### The nine structural gaps

**G1 — Homepage carousel is half-finished.** `index.html` has a 6-slide featured
carousel above the fold. Slides 1 and 4 use real photography. Slides 2, 3, 5 and 6
(the `<article class="cz-slide">` elements labelled `2 of 6`, `3 of 6`, `5 of 6`,
`6 of 6`) are hand-drawn SVG gradient blobs with dashed circles and flat wing
shapes. Because they sit in the same rotation as the
two real photos, the contrast is immediate and unflattering — the site looks like
it ran out of budget mid-build.

**G2 — Social share cards are a 279px logo, site-wide.** All 27 pages point
`og:image` at `images/logo_ring.png` — a **279×279** logo ring, against a 1200×630
platform expectation. `twitter:card` is `summary`, not `summary_large_image`, and
no page sets `twitter:image`. For a B2B company whose deal flow runs through links
pasted into Slack, LinkedIn and email, every share currently renders as a tiny
undifferentiated tile. Highest polish-per-image ratio on the list.

**G3 — 23 of 27 pages have no hero art.** Only 4 pages use `hero hero-dark`
(`index`, `investors`, `afra-caac`, `casestudy-jalux`); 23 use `hero page-hero`,
which `css/style.css` defines as padding and nothing else. Landing on `trust.html`,
`pricing.html`, `arm.html` or `registries.html` gives you a headline on a flat
gradient. Consistent, and consistently thin.

**G4 — 9 of the 14 `feature-visual` slots are concept wireframes.** Each holds
inline SVG mimicking a UI: `iv-card`, `iv-ln`, `iv-soft` rectangles approximating
windows and text rows. The 14 break down as **9 concept stand-ins** (data package
flow, openAPI, private channel isolation, AFRA-CAAC flow, registry visibility
tiers, eARC swap, chain of custody, supply network, ARM's paper-to-record) — these
read as unfinished mockup and are what U18–U25 and U33 replace; **4 product-screen
stand-ins** (DAM dashboard, Registry Manager, platform passport record, news
repair-order flow) — acceptable shorthand, and they want real screenshots rather
than illustration; and **1 that already holds a real photograph**
(`registries.html`, the eCube audit image).

**G5 — Card photo support exists and is unused.** `.card-photo` in
`css/style.css` defines a 188px cover crop. Across 250+ `.card` blocks site-wide it
is used **twice** — the eCube card in `news.html`, and `news-ecube-unical.html`. The news index, the
JALUX case study and the about page all render as walls of text cards while the
design system already supports imagery in them.

**G6 — `arm.html` ships with zero imagery.** New in `684cd10`, sitemap priority
0.8, and the flagship of the AI & Agentic line. Nine substantial sections
(`#pricing` added by `d082dfc`), a bare `page-hero`, one wireframe placeholder, no
product screenshots, and the same generic `og:image`. Its core explainer — the
five-step Ingest → Classify → Extract → Verify → Structure sequence under
`<h2>Ingest, Classify, Extract, Verify, Structure</h2>` — is rendered as a
text-only `<ul class="timeline">`. This is the most under-served
high-value page on the site.

**G7 — the Solutions "Find Your Business" selector is seven text cards.** The
`grid-3` under `<h2>Find Your Business</h2>` is the page's primary routing moment:
seven business types as plain `.card` blocks with "Explore →" links, no visual
differentiation. A buyer self-selecting their own segment is exactly where imagery
earns its keep, and there is none.

**G8 — the restructure left the seven Solutions segments visually bare.**
`684cd10` replaced six `feature-visual` slots with seven business-type sections
(`#parts-distributors`, `#asset-managers`, `#disassembly`, `#mros`, `#lessors`,
`#oems`, `#regulators`). The content is stronger and better targeted; the page now
carries one product screenshot and nothing else across roughly 250 lines of body
copy.

**G9 — the FinTech block has no coming-soon treatment.** `products.html#fintech`
introduces the FinTech line with three `badge-addon` "Coming Soon" cards and no
art. A pre-launch product line reads as a gap in the page rather than a deliberate
teaser.

---

## 2. Counts by family and priority

| | Photo-realistic | Isometric | Abstract | **Total** |
|---|---|---|---|---|
| **Critical** | 5 | 1 | 11 | **17** |
| **Urgent** | 8 | 17 | 0 | **25** |
| **Nice to have** | 0 | 3 | 5 | **8** |
| **Total** | **13** | **21** | **16** | **50** |

Tier definitions used here:

- **Critical** — visible on first impression, or actively signals unfinished work.
  Fixing these changes whether the site reads as premium.
- **Urgent** — the placeholder-quality layer. Not broken, but caps how polished
  the site can feel. Do straight after critical.
- **Nice to have** — depth and consistency. Real improvements, no credibility cost
  if deferred.

At the 50-image ceiling exactly. Anything added from here should displace
something, not extend the set.

---

## 3. Numbered inventory

Filenames follow the skill convention:
`newpub-<category>-<subject>-<nn>-<ratio>.png`. Project prefix is `newpub`.
Categories: `photo`, `iso`, `abstract`, `og`, `tile`, `texture`, `empty`.

### CRITICAL — 17 images

#### C1–C4 · Homepage carousel slides (gap G1)

| # | Filename | Family | Ratio | Slot | Brief |
|---|---|---|---|---|---|
| 01 | `newpub-photo-teardown-harvest-01-16x9` | photo | 16:9 | `index.html` slide `2 of 6` — `cz-bg` svg aria-label *"A disassembly scene with parts lifting from an airframe into verified records"* | Documentary wide shot of a stripped narrowbody airframe in a disassembly bay, unpainted skin, harvested parts staged on pallets in the foreground, flat overcast daylight through open hangar doors. |
| 02 | `newpub-iso-part-lifecycle-02-16x9` | iso | 16:9 | `index.html` slide `3 of 6` — `cz-bg` svg aria-label *"A digital passport card linked to a lifecycle timeline of verified events"* | Isometric lifecycle rail carrying one serialized rotable left to right through four raised station platforms — manufacture, install, shop visit, resale — each marked with a small nested-square node. |
| 03 | `newpub-abstract-trust-network-03-16x9` | abstract | 16:9 | `index.html` slide `5 of 6` — `cz-bg` svg aria-label *"A connected global network of verified aviation organizations"* | Bounded cluster of organization nodes joined by thin arcs following an implied globe curvature, denser toward the right; membership shown by containment rather than chain links. |
| 04 | `newpub-abstract-iso27001-seal-04-16x9` | abstract | 16:9 | `index.html` slide `6 of 6` — `cz-bg` svg aria-label *"A security shield with a verification checkmark over a hex motif"* | Layered concentric aperture resolving to a single checkmark at centre, deep navy field, one gold rim light, restrained and editorial — no shield cliché. |

#### C5–C11 · Social share cards (gap G2)

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
| 11 | `newpub-og-ai-11-1200x630` | abstract | 1200×630 | `arm.html` — the AI & Agentic line reads as its own product family and warrants its own card (gap G6) |

#### C12–C16 · Hero band art (gap G3)

Five reusable bands covering 23 bare heroes, assigned by page family. Dark,
heavily scrimmed, built to sit behind white type at 21:9.

| # | Filename | Family | Ratio | Applies to | Brief |
|---|---|---|---|---|---|
| 12 | `newpub-photo-hero-hangar-12-21x9` | photo | 21:9 | `products.html`, `pricing.html`, `acc-rates.html`, `get-started.html` | Wide low-angle hangar interior at blue hour, unpainted airframe silhouette, structural bays receding right, deep shadow across the lower two thirds for type. |
| 13 | `newpub-photo-hero-records-13-21x9` | photo | 21:9 | `arm.html`, `earc.html`, `faq.html`, `glossary.html`, `resources.html`, `policies.html` | Shallow-focus row of archive boxes and binder spines on steel shelving, raking side light, spine labels illegible by depth of field. |
| 14 | `newpub-photo-hero-engine-14-21x9` | photo | 21:9 | `registries.html`, `solutions.html` | Turbofan fan face off-centre in a shop bay, unbranded, cool overhead light with one warm practical, negative space to the left. |
| 15 | `newpub-abstract-hero-mesh-15-21x9` | abstract | 21:9 | `trust.html`, `platform.html`, `contact.html` | Wide navy field with a fine perspective mesh flattening toward the horizon, three nested-square nodes at unequal intervals, single soft blue bloom. |
| 16 | `newpub-abstract-hero-grid-16-21x9` | abstract | 21:9 | `about.html`, `news.html` + news detail pages | Wide navy field, sparse orthogonal grid, one gold horizon rule off-centre, otherwise near-empty — built to sit quietly under editorial headlines. |

#### C17 · Homepage problem section (gap G5)

| # | Filename | Family | Ratio | Slot | Brief |
|---|---|---|---|---|---|
| 17 | `newpub-photo-paper-records-17-3x2` | photo | 3:2 | `index.html` — the section under `<h2>Aviation Runs on Trust. Trust Still Runs on Paper.</h2>`, currently text-only | Over-the-shoulder framing of hands working through a thick stack of loose maintenance paperwork on a workbench, no faces, no legible text, practical desk light — the problem the product solves, shown once and plainly. |

### URGENT — 25 images

#### U18–U25 · Concept wireframe replacements (gap G4)

All 3:2, all isometric, all replacing an inline `feature-visual` SVG. The six
remaining `feature-visual` slots that stand in for real product screens are
deliberately excluded — those should get screenshots, not illustration.

| # | Filename | Slot | Brief |
|---|---|---|---|
| 18 | `newpub-iso-data-package-18-3x2` | `products.html#data-packages` — svg aria-label *"Data Package Creation pipeline…"* | Isometric assembly of loose record sheets converging into one sealed package, then fanning out along four short rails to distinct recipient platforms. |
| 19 | `newpub-iso-openapi-19-3x2` | `products.html#api` — svg aria-label *"openAPI integrations connecting Block Aero to marketplaces and ERP systems"* | Isometric central platform slab with three typed connectors seating into sockets on adjacent external systems — connection shown by fit, not by wires. |
| 20 | `newpub-iso-private-channel-20-3x2` | `products.html#private-channel` — svg aria-label *"Private Channel as a Service…"* | Isometric ledger corridor enclosed in a translucent boundary wall, two enterprise systems docking through gated ports, everything outside the boundary greyed. |
| 21 | `newpub-iso-afra-caac-flow-21-3x2` | `products.html#afra-caac` — svg aria-label *"AFRA-CAAC registry flow from teardown to China-registered aircraft installation"* | Isometric four-station route from teardown bay through inspection and registry to installation on a receiving airframe, one continuous raised rail throughout. |
| 22 | `newpub-iso-registry-tiers-22-3x2` | `registries.html` — svg aria-label *"A registry of verified asset records with public, semi-private, and private visibility tiers"* | Three isometric concentric enclosures at increasing wall height for public, semi-private and private visibility, same record object visible at differing clarity in each. |
| 23 | `newpub-iso-earc-swap-23-3x2` | `earc.html` — svg aria-label *"A paper certificate replaced by a verified digital record"* | Isometric paired platforms: a loose paper sheet on the left dissolving into a structured record slab on the right, arrow implied by platform elevation. |
| 24 | `newpub-iso-chain-of-custody-24-3x2` | `afra-caac.html` — svg aria-label *"Aircraft, engine and part registries linked in one chain of custody"* | Three isometric registry slabs — aircraft, engine, part — stacked at offset depths and stitched by one continuous vertical spine. |
| 25 | `newpub-iso-supply-network-25-3x2` | `casestudy-jalux.html` — svg aria-label *"A worldwide network of connected supply-chain nodes"* | Isometric multi-node supply network across an implied region, one hub platform larger than the rest, thin routed rails between nodes. |

#### U26–U32 · Solutions business-type tiles (gaps G7, G8)

Seven 1:1 isometric tiles for the `grid-3` under `<h2>Find Your Business</h2>` in
`solutions.html`, reused as section markers on each segment below (each segment has
a stable section `id`, given per row). These must read as one set: same isometric
angle, same platform thickness, same line weight, one accent colour varying by
segment. This is the page's routing moment — generate them as a batch, never
piecemeal.

| # | Filename | Segment / anchor | Brief |
|---|---|---|---|
| 26 | `newpub-tile-distributors-26-1x1` | Parts Distributors — `solutions.html#parts-distributors` | Isometric shelf bay with three binned parts, one lifting out onto a small dispatch platform carrying a nested-square proof marker. |
| 27 | `newpub-tile-asset-managers-27-1x1` | Asset Managers & Traders — `solutions.html#asset-managers` | Isometric portfolio of four asset slabs at varying heights on one shared base, each capped with a small verified marker. |
| 28 | `newpub-tile-disassembly-28-1x1` | Disassembly & Teardown — `solutions.html#disassembly` | Isometric partial airframe section on cradles with two removed components set down on adjacent platforms. |
| 29 | `newpub-tile-mros-29-1x1` | MROs — `solutions.html#mros` | Isometric shop bay: a component on a work platform between two raised stations, one record tile rising from it. |
| 30 | `newpub-tile-lessors-30-1x1` | Lessors — `solutions.html#lessors` | Isometric asset slab passing between two owner platforms, its stacked history layer travelling underneath. |
| 31 | `newpub-tile-oems-31-1x1` | OEMs — `solutions.html#oems` | Isometric origin platform emitting a new asset with a paired record twin slab beside it at the same elevation. |
| 32 | `newpub-tile-regulators-32-1x1` | Regulators & Authorities — `solutions.html#regulators` | Isometric raised oversight platform positioned inside a bounded field of smaller asset nodes — standing inside, not looking down from outside. |

#### U33–U34 · AI Records Manager page (gap G6)

| # | Filename | Ratio | Slot | Brief |
|---|---|---|---|---|
| 33 | `newpub-iso-paper-to-record-33-3x2` | 3:2 | `arm.html` — replacing the svg aria-label *"A pile of paper records resolved into a structured digital record"* | Isometric loose paper drift on the left resolving into one clean structured record slab on the right, intermediate sheets shown mid-alignment. |
| 34 | `newpub-iso-arm-pipeline-34-16x9` | 16:9 | `arm.html` — above the text-only `<ul class="timeline">` under `<h2>Ingest, Classify, Extract, Verify, Structure</h2>` | Isometric five-station pipeline — ingest, classify, extract, verify, structure — as ascending platforms along one rail, with a single human-in-the-loop checkpoint marked at the verify station. |

#### U35–U38 · News card photography (gap G5)

All 16:9, cropped to `.card-photo`'s 188px band. Fills the 4 empty news cards in
`news.html` and doubles as hero art on each news detail page.

| # | Filename | Card | Brief |
|---|---|---|---|
| 35 | `newpub-photo-news-iso27001-35-16x9` | ISO 27001 certification | Server room cold aisle, cabinet doors closed, cool blue key light, one warm status glow — infrastructure security without a padlock cliché. |
| 36 | `newpub-photo-news-api-36-16x9` | openAPI Integration Services live | Over-the-shoulder framing of an engineer at a two-monitor workstation, screens out of focus and illegible, warm desk lamp against cool room light. |
| 37 | `newpub-photo-news-ascent-37-16x9` | Ascent Aviation goes digital | Desert storage apron at low sun, two unpainted airframes in the middle distance, long shadows, wide and quiet. |
| 38 | `newpub-photo-news-usm-seminar-38-16x9` | USM seminar | Conference room from the back of the audience, heads and shoulders only, projected slide reduced to a bright unreadable rectangle. |

#### U39–U40 · JALUX case study (gap G5)

| # | Filename | Ratio | Slot | Brief |
|---|---|---|---|---|
| 39 | `newpub-photo-jalux-warehouse-39-16x9` | 16:9 | `casestudy-jalux.html` hero | High wide shot down a parts warehouse aisle, bin racking to the ceiling, uniform overhead light, no visible labels or brands. |
| 40 | `newpub-photo-jalux-receiving-40-3x2` | 3:2 | mid-page proof block | Receiving bench with a crated rotable partially unpacked, gloved hands at the edge of frame, inspection lamp overhead, no legible markings. |

#### U41–U42 · About page (gap G5)

| # | Filename | Ratio | Slot | Brief |
|---|---|---|---|---|
| 41 | `newpub-photo-about-facility-41-16x9` | 16:9 | `about.html` — `<h2>From First Registry to Implementation Partner</h2>` | Two people walking a hangar floor seen from behind at distance, high-vis vests, scale of the space doing the work. |
| 42 | `newpub-photo-about-audit-42-3x2` | 3:2 | `about.html` — `<h2>Built at the Intersection of Aerospace, AI, and Blockchain</h2>` | Three people around a workbench reviewing a component together, all faces turned away or in shadow, mixed daylight and task lighting. |

### NICE TO HAVE — 8 images

| # | Filename | Family | Ratio | Slot | Brief |
|---|---|---|---|---|---|
| 43 | `newpub-texture-band-navy-43-32x9` | abstract | 32:9 | Dark `.section` bands | Very low-contrast navy field, faint orthogonal grid, one off-centre bloom — tiles horizontally without a visible seam. |
| 44 | `newpub-texture-band-light-44-32x9` | abstract | 32:9 | `.section.soft` bands | Near-white field with the faintest blue dot lattice and a single soft tint sweep. |
| 45 | `newpub-texture-cta-band-45-32x9` | abstract | 32:9 | Closing CTA on every page | Deep navy with a directional light sweep rising left to right, built to sit behind a single headline and two buttons. |
| 46 | `newpub-empty-fintech-46-3x2` | abstract | 3:2 | `products.html#fintech` (gap G9) | Deliberate pre-launch state: a bounded field with two fully-formed nodes and a third drawn in outline only, reading as "in development" rather than missing. |
| 47 | `newpub-empty-offcourse-47-4x3` | abstract | 4:3 | `404.html` | Minimal navigation figure with one route diverging off the plotted path toward empty space — dry and on-brand, not cute. |
| 48 | `newpub-iso-empty-archive-48-4x3` | iso | 4:3 | Reusable product empty state | Open empty archive drawer at a simple three-quarter isometric angle, one dim interior guide rail, nothing filed. |
| 49 | `newpub-iso-acc-metering-49-3x2` | iso | 3:2 | `acc-rates.html` | Isometric metering column filling in discrete increments beside three consumption platforms of differing heights. |
| 50 | `newpub-iso-onboarding-steps-50-3x2` | iso | 3:2 | `get-started.html` | Isometric four-step ascending path from a small entry platform to a fully populated workspace slab. |

---

## 4. Plan to get started

### Step 0 — Confirm the spec (before any generation)

The skill is explicit that a wrong plan is cheaper to fix than 20 wrong images.
Three decisions worth settling first:

1. **Does the ARM 50-image set already cover any of this?** The skill was packaged
   *from* a 50-image AI Records Manager asset set. That set is not in this repo and
   not in the working container. If it exists in the internal working folder, U33,
   U34 and C11 may be satisfiable by reuse or recrop rather than generation — and
   its style is the natural reference for the whole isometric family. Check before
   generating anything in the AI line.
2. **Photo count.** 13 documentary photographs is the single biggest quality risk
   in this set — generated "documentary photography" is the hardest category to
   land, and aviation facility interiors invite guardrail slips (liveries, OEM
   logos, legible placards). If licensed stock or real facility photography from
   eCube, Ascent, or JALUX is obtainable, prefer it for U35–U42 and generate only
   C12–C14 and C17.
3. **Hero rollout.** C12–C16 assume a new `.page-hero--art` CSS variant. That is a
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

### Step 2 — Ship the social cards first (C5–C11, 7 images)

Highest polish-per-image on the list, fully independent of any layout work, and
seven images covers all 27 pages. Ships in one pass:

- Generate the 7 family cards at 1200×630.
- Per page: point `og:image` at the family card, add `og:image:width` / `:height`,
  add `twitter:image`, and switch `twitter:card` from `summary` to
  `summary_large_image`.
- Add `og:image` to `404.html` (currently the only page without one).
- Verify with a card validator before merging.

### Step 3 — Fix the carousel (C1–C4, 4 images)

Brings the homepage's above-the-fold rotation to a uniform standard. Markup is
already in place — each slide swaps its inline `<svg class="cz-bg">` for an
`<img class="cz-bg">`, exactly as slides `1 of 6` and `4 of 6` already do. Keep the
existing SVGs as `display:none` fallbacks, matching the pattern those two slides
use.

### Step 4 — Hero bands + problem anchor (C12–C17, 6 images)

Add the `.page-hero--art` variant, then apply the five bands across the 23 bare
pages by family. Completes the critical tier.

### Step 5 — Lock the isometric style (U18, U20, U26 — 3 images)

21 of the 50 images are isometric, and they will only look premium if they read as
one system. Generate these three first — one concept diagram, one containment
diagram, one 1:1 tile — and settle the isometric angle, line weight, platform
thickness, node treatment and accent-colour rule against them. Write the settled
values into the STYLE BLOCK before running any further isometric work. Everything
in steps 6 and 7 depends on this.

### Step 6 — Solutions tiles + ARM (U26–U34, 9 images)

The tile set (U26–U32) is the highest-leverage isometric work: it fixes the
routing moment on a priority-0.9 page and gives the seven bare segment sections
their visual markers. Run all seven in one sitting against the locked style so they
match. Then U33–U34 for the ARM page, subject to the Step 0 reuse check.

### Step 7 — Remaining concept diagrams (U19, U21–U25, 6 images)

Clears the last of the concept wireframes from Products, Registries, eARC,
AFRA-CAAC and the JALUX case study.

### Step 8 — Photography (U35–U42, 8 images)

Contingent on the Step 0 photo decision. If generating: run one test image and
guardrail-check it at full resolution before committing to the batch — faces,
liveries, OEM cues and legible placards are all live risks in facility interiors.

### Step 9 — Nice-to-have (N43–N50, 8 images)

Textures first (N43–N45) since they lift every page at once; the two isometric
explainers last so they match the Step 5 style.

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
- **Locate slots by anchor, never by line number.** Every slot in §3 is
  identified by a section `id`, an `<svg>` `aria-label` string, or heading text.
  Grep for the anchor. Rev 1 and rev 2 of this spec used line numbers and both were
  invalidated within a day — `684cd10` deleted two slots outright and `d082dfc`
  shifted every remaining reference by one to two lines. If an anchor no longer
  resolves, the slot has genuinely moved or gone: stop and flag it rather than
  guessing at a nearby line.

### Suggested sequencing

| Batch | Images | Count | Unblocks |
|---|---|---|---|
| 1 | C5–C11 | 7 | Every shared link, all 27 pages |
| 2 | C1–C4 | 4 | Homepage above the fold |
| 3 | C12–C17 | 6 | 23 bare heroes + homepage problem section |
| 4 | U18, U20, U26 | 3 | Locks the isometric style for the other 18 |
| 5 | U27–U34 | 8 | Solutions routing + all 7 bare segments + ARM page |
| 6 | U19, U21–U25 | 6 | Removes the last concept placeholder wireframes |
| 7 | U35–U42 | 8 | News, case study, about credibility |
| 8 | N43–N50 | 8 | Site-wide depth and consistency |

Batches 1–3 (17 images) are the critical tier and the point at which the site
stops reading as unfinished. Batches 4–7 (25 images) are where it starts reading
as premium.

---

## 5. Revision history

### rev 2 → rev 3 (`684cd10` → `d082dfc`)

`d082dfc` wired ARM commercials into the site: a new `#pricing` section on
`arm.html`, a corrected ISO 27001 scope card, ARM CTAs redirected to
ai-records-manager.com, and — the part that matters here — an "AI Records"
top-level nav entry plus a footer product link **site-wide**.

**No slot died and no gap opened.** The inventory is unchanged at 50. But the
site-wide nav and footer edits shifted every line number in the spec by one to two
lines, invalidating all 19 slot references at once.

**The structural fix:** rev 3 drops line numbers entirely in favour of stable
anchors —

| Slot type | Anchor now used |
|---|---|
| Carousel slides | `<article class="cz-slide">` `aria-label="N of 6"` + the `cz-bg` svg's own `aria-label` |
| `feature-visual` placeholders | the svg's unique `aria-label` string, plus the containing section `id` where one exists (`#data-packages`, `#api`, `#private-channel`, `#afra-caac`, `#fintech`) |
| Solutions segments | section `id` (`#parts-distributors` … `#regulators`) |
| Everything else | heading text (`<h2>…</h2>`) |

These survive content edits in a way line numbers demonstrably do not. Two
invalidations in two consecutive commits is enough evidence.

**One count corrected while re-auditing.** Rev 2's G4 said the 14 `feature-visual`
slots split 8 concept / 6 product-screen. The actual split is **9 concept**
(the 8 in U18–U25 plus ARM's paper-to-record in U33), **4 product-screen** SVG
stand-ins, and **1 already holding a real photograph** (`registries.html`, the
eCube audit image). The 9 concept slots are all covered by the inventory; the
4 product-screen ones want screenshots rather than illustration.

### rev 1 → rev 2 (`da141e1` → `684cd10`)

**Slots that died (2):**

| Rev 1 | Was | Now |
|---|---|---|
| U21 `newpub-iso-passport-transfer` | a `feature-visual` in `solutions.html` | Slot deleted in the restructure. Concept partly absorbed by U30 (Lessors tile). |
| U22 `newpub-iso-mro-workflow` | a `feature-visual` in `solutions.html` | Slot deleted, same cause. Concept absorbed by U29 (MROs tile). |

**Gaps that opened (4):** G6 `arm.html` with zero imagery · G7 the seven-card
Solutions selector · G8 seven visually bare Solutions segments · G9 the untreated
FinTech coming-soon block.

**Images added (12):** C11 (AI-line OG card) · U26–U32 (seven business-type tiles)
· U33–U34 (ARM page) · N46 (FinTech coming-soon state), plus `arm.html` folded
into the C13 hero band family.

**Images cut (8),** to hold the 50 ceiling: the divider-rule texture, the separate
glossary and resources band art (both covered by hero band C13), the pricing-tier
isometric (the pricing page already carries a rate table doing that work), the
investor deck background (`investors.html` is already `hero-dark`, and deck reuse
is outside website scope), and the two dead Solutions slots above.

**Counts that moved:** `feature-visual` placeholders 19 → 14 · bare `page-hero`
pages 22 → 23 · total pages 25 → 27 · OG family cards 6 → 7 · total set 46 → 50 ·
isometric share 15 → 21, now the largest family and the reason Step 5 exists.
