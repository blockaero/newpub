# block.aero imagery gap analysis & generation spec

**Date:** 2026-08-04 (rev 4 — retargeted to the v3 brand canon)
**Site audited:** this repo at `8a84d7c`
**Brand canon:** **v3**, read off the live `ai-records-manager.com` (deployed 2026-08-03 20:16 GMT) — see §0
**Pipeline:** `block-aero-brand-imagery` skill (Gemini via browser automation → guardrail check → sparkle patch → catalog in `images/MANIFEST.md`)
**Scope:** 50 images across three content families, in three priority tiers

> Internal planning doc. The Pages workflow deploys the repo root as-is, so this
> file is reachable once merged; `robots.txt` disallows it. Move it out of the
> repo if that isn't good enough.

**Revision note (rev 4 — brand canon change).** Revs 1–3 were built against the
palette in `css/style.css` (`--blue #1C5FC0`, `--navy #0E1320`, Inter body). That is
no longer the newest canon. On **2026-08-03** a revised brand system shipped on
`ai-records-manager.com`: a versioned asset directory `/static/brand/v3/`, a named
logo system (**"Spectrum Wing"** mark, **"Diamond Period"** lockups), a new primary
blue, a full text-neutral scale, Space Grotesk + DM Sans type, and — most
consequentially for this document — a **documentary-photography-led art direction
with almost no illustration**.

Decision taken: **v3 is treated as the corporate canon**, not an ARM-only
sub-brand. This rev re-pins the palette, adopts v3's image treatment, adopts the
**"Agentic Records Manager"** product name in briefs, and **rebalances the family
mix from 37/50 illustration to 28/50 photography**. Entry count is unchanged at 50.
See §0 for the canon, §5 for the full diff.

**Two caveats recorded honestly:**

1. **No brand document exists.** There is no `tokens.json`, no style guide, no
   published brand page — all 404. Nothing in Drive, Slack, Confluence, ReadMe, this
   repo, or any installed skill documents or announces v3. The canon below is read
   off shipped CSS and SVG, which is strong evidence for colour, type and logo, but
   leaves usage rules and scope-of-application undocumented. Supernova
   (`blockaero.supernova-docs.io`) is the likely authoritative home and is behind an
   auth wall; Figma is org-authenticated but not enabled for this session. Either
   would supersede §0 if opened.
2. **`css/style.css` is now stale but NOT changed here.** It still ships
   `--blue #1C5FC0`, `--navy #0E1320`, and Inter, and newpub is a *light* theme
   (`--bg #ffffff`) whereas v3 is dark-on-navy. Reconciling the site's own
   stylesheet with v3 is a site-wide design change well outside imagery scope. This
   document governs **generated image content and treatment only**. Flagged, not
   actioned.

---

## 0. The v3 brand canon (what generated art must match)

Read off `ai-records-manager.com`, deploy stamp 2026-08-03 20:16:56 GMT. Every value
below is literal from that host's shipped CSS or from an SVG under
`/static/brand/v3/`. Nothing here is inferred.

### Palette

| Role | v3 value | vs. rev 3 |
|---|---|---|
| Page ground / primary navy | `#0A0E16` | unchanged |
| **Primary blue** — buttons, focus, links | **`#3B82F0`** | **replaces `#1C5FC0`** |
| Primary blue, darker state | `#2563D4` | new |
| Accent orange | `#E8761A` | unchanged |
| Accent gold | `#F5C53A` | unchanged |
| Body text on navy | `#E8EDF5` | new |
| Secondary text | `#9AA6B8` | new |
| Fine print | `#6B7589` | new |
| Panel surface (primary) | `#111827` | **replaces `#141C2E`** |
| Panel surface (alt) | `#0B1220` | new |
| Hairline / border | `rgba(255,255,255,.12)` | new |
| Translucent surface | `rgba(10,14,22,.72)` | new |
| Green | `#1AAB65` | **demoted** — verification ticks only, not a field colour |

**Retired. Do not use as a ground or accent in generated art:** `#141C2E`,
`#2B86D4`, `#27C47A`. Zero occurrences on the v3 surface.

**One deliberate exception.** The logo's spectrum gradient still carries the *old*
blue: `#E8761A 0%` → `#F5C53A 35%` → `#1C5FC0 65%` → `#1AAB65 100%`, vertical. If art
depicts or echoes the mark, that gradient keeps `#1C5FC0`. Everywhere else the
functional blue is `#3B82F0`.

### Typography

- Display: **Space Grotesk** 700. `h1` `clamp(2.35rem, 9vw, 3.75rem)`, line-height
  1.02, letter-spacing `-.035em`.
- Body: **DM Sans**, 17px / 1.55.
- Eyebrow labels: `.72rem`, 600, letter-spacing `.18em`, uppercase.
- Only decorative type device in the system: gradient text,
  `linear-gradient(105deg, var(--orange), var(--gold) 55%, #fff 120%)`.

Generated art carries **no rendered text** regardless (see guardrails) — these are
here so surrounding-page context is understood, and for any deck or OG card where
type is composited on afterwards.

### Image treatment — the part that changed most

v3 is **photography-led**. The entire ARM homepage contains exactly **one** piece of
iconography (a 16px check circle) and **no illustration library**. Four rules:

1. **Photographs are veiled to navy** so type stays legible:
   `linear-gradient(180deg, rgba(10,14,22,.35) 0%, rgba(10,14,22,.55) 40%, rgba(10,14,22,.92) 78%, #0A0E16 100%)`
   over `radial-gradient(120% 80% at 70% 20%, rgba(28,95,192,.22), transparent)`.
   Generate the photograph *un-veiled and full-frame*; the veil is applied in CSS at
   integration, not baked into the image.
2. **Images sit in rounded panels:** `border-radius: 16px`, `overflow: hidden`,
   `1px solid rgba(255,255,255,.12)`, on `#111827` or `#0B1220`.
3. **Every image gets a gold provenance pill** stating where it came from — Space
   Grotesk `.68rem` 600, letter-spacing `.14em`, uppercase, `#F5C53A` on
   `rgba(10,14,22,.82)`, `1px solid rgba(245,197,58,.42)`, `border-radius: 999px`.
   Live examples: "Auto-assembled · Review-gated", "Concept · ABN". **This is a
   caption obligation, not decoration** — see rule 4.
4. **Concept art is labelled as concept, never passed off as product.** The live site
   badges its abstract passport animation "Concept · ABN" and captions its document
   photo "built from synthetic demo records through the real pack builder." Anything
   in the `abstract` or `iso` family below inherits this: it ships with a
   `Concept` pill. Nothing generated may imply it is a real product screenshot or a
   real customer record.

**Product imagery in v3 is photographed physical paper, not UI.** The live proof
image is a fanned document stack — cover page, section divider, an 8130-3 release.
This is the single most reusable v3 technique in this spec, and it is *safer* to
generate than facility interiors: no liveries, no faces, no OEM logos in frame.

### Product naming (per the R7 company deck, 2026-07-30, + v3 live)

- Network: **Block Aero Aviation Blockchain Network** (ABN)
- Core product: **Digital Asset Manager**
- Modular add-ons: **Agentic Records Manager**, **AI QC Manager**, **Registry Manager**
- Separately sold: Registry as a Service · Private Blockchain as a Service
- Both AI products carry the lifecycle badge **NEW · EARLY ACCESS**

`Agentic Records Manager` is the v3 name; briefs and alt text in §3 use it. See §6
for the 72 `AI Records Manager` occurrences in this repo's HTML that would need a
copy change — **not made here**.

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
| **Critical** | 8 | 0 | 9 | **17** |
| **Urgent** | 20 | 5 | 0 | **25** |
| **Nice to have** | 0 | 3 | 5 | **8** |
| **Total** | **28** | **8** | **14** | **50** |

Rev 3 was 13 photo / 21 iso / 16 abstract. The rebalance to **28 / 8 / 14** follows
v3's art direction (§0): photography leads, illustration is the exception and ships
badged as concept. What survives as isometric is only the five diagrams where a
photograph genuinely cannot carry the idea — openAPI connection, private-channel
isolation, registry visibility tiers, supply-network topology, the ARM five-step
pipeline — plus three product empty/explainer states.

**The 28 photographs split into two very different risk classes, and the split
matters more than the count:**

| Class | Count | Entries | Risk |
|---|---|---|---|
| **Photographed paper / objects** | 11 | C2, C17, U18, U23, U24, U33, and the object-led tiles U27, U29, U31 (+ U39, U40 partly) | **Low.** Controlled still life on a bench. No liveries, no faces, no OEM logos possible in frame. This is v3's own signature technique and the safest thing in the set. |
| **Facility / operational documentary** | 17 | C1, C12–C16, U21, U26, U28, U30, U32, U35–U38, U41, U42 | **High.** Facility interiors are exactly where liveries, OEM cues, legible placards and recognisable faces slip through. |

Do the low-risk class first. It builds the v3 visual language on safe ground before
anything touches a hangar interior.

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
| 02 | `newpub-photo-part-lifecycle-02-16x9` | photo | 16:9 | `index.html` slide `3 of 6` — `cz-bg` svg aria-label *"A digital passport card linked to a lifecycle timeline of verified events"* | Documentary still life: one unbranded serialized rotable on a workbench with its paperwork fanned beside it — a release sheet, a divider, a tag — low three-quarter angle, single practical lamp. Paper reads as documents, never as words. The part and its history in one frame. |
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
| 15 | `newpub-photo-hero-shopfloor-15-21x9` | photo | 21:9 | `trust.html`, `platform.html`, `contact.html` | Wide shop floor down the length of the bay: work platforms and component stands receding into cool overhead light, one warm practical mid-distance. No one in focus. Upper two-thirds kept quiet for the navy veil and white type. |
| 16 | `newpub-photo-hero-apron-16-21x9` | photo | 21:9 | `about.html`, `news.html` + news detail pages | Wide apron at dusk from a low camera position, unpainted airframe silhouettes mid-distance, ground equipment as dark shapes, sky doing most of the work. Editorial and still — sits under a headline without competing. |

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
| 18 | `newpub-photo-data-package-18-3x2` | `products.html#data-packages` — svg aria-label *"Data Package Creation pipeline…"* | v3's signature treatment. A fanned stack of assembled records photographed flat-on under even light — cover sheet, section dividers, a release certificate, a tag — squared and complete rather than scattered, so it reads as one finished package. No legible field values. |
| 19 | `newpub-iso-openapi-19-3x2` | `products.html#api` — svg aria-label *"openAPI integrations connecting Block Aero to marketplaces and ERP systems"* | Isometric central platform slab with three typed connectors seating into sockets on adjacent external systems — connection shown by fit, not by wires. |
| 20 | `newpub-iso-private-channel-20-3x2` | `products.html#private-channel` — svg aria-label *"Private Channel as a Service…"* | Isometric ledger corridor enclosed in a translucent boundary wall, two enterprise systems docking through gated ports, everything outside the boundary greyed. |
| 21 | `newpub-photo-afra-caac-flow-21-3x2` | `products.html#afra-caac` — svg aria-label *"AFRA-CAAC registry flow from teardown to China-registered aircraft installation"* | Documentary sequence in a single frame: a harvested component on a padded pallet in the disassembly-bay foreground, inspection bench mid-ground, shipping crate at frame edge. Overcast daylight through open hangar doors. Unpainted, unbranded, no stencilled identifiers. |
| 22 | `newpub-iso-registry-tiers-22-3x2` | `registries.html` — svg aria-label *"A registry of verified asset records with public, semi-private, and private visibility tiers"* | Three isometric concentric enclosures at increasing wall height for public, semi-private and private visibility, same record object visible at differing clarity in each. |
| 23 | `newpub-photo-earc-swap-23-3x2` | `earc.html` — svg aria-label *"A paper certificate replaced by a verified digital record"* | Two-object still life on a dark bench: a loose paper release certificate at left, handled and curling; a clean screen edge at right carrying a structured record as flat colour blocks only. The paper is photographed; the screen shows no readable text. The swap, stated plainly. |
| 24 | `newpub-photo-chain-of-custody-24-3x2` | `afra-caac.html` — svg aria-label *"Aircraft, engine and part registries linked in one chain of custody"* | An unbranded serialized part centred on a dark surface, three document sets arranged behind it in receding depth — birth, service, transfer — each softer further back. One continuous line of custody expressed as physical depth. |
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
| 26 | `newpub-tile-distributors-26-1x1` | Parts Distributors — `solutions.html#parts-distributors` | Square documentary crop: a parts warehouse bin bay, one component lifted clear of its bin onto a dispatch bench with a document sleeve beside it. Uniform overhead light, no legible labels. |
| 27 | `newpub-tile-asset-managers-27-1x1` | Asset Managers & Traders — `solutions.html#asset-managers` | Square crop: four unbranded component cases staged on a floor grid at varying heights, each with a document sleeve laid on top. A portfolio, photographed. |
| 28 | `newpub-tile-disassembly-28-1x1` | Disassembly & Teardown — `solutions.html#disassembly` | Square crop: a partial airframe section on cradles in a teardown bay, two removed components set down on the pallet beside it. Overcast daylight, unpainted skin. |
| 29 | `newpub-tile-mros-29-1x1` | MROs — `solutions.html#mros` | Square crop of a shop bench: one component under an inspection lamp between two tool stations, its worksheet squared beside it. |
| 30 | `newpub-tile-lessors-30-1x1` | Lessors — `solutions.html#lessors` | Square crop: a crated asset on a dock between two staging areas, its document folder resting on the crate lid. Transfer mid-motion, no people in frame. |
| 31 | `newpub-tile-oems-31-1x1` | OEMs — `solutions.html#oems` | Square crop: a new unbranded component on a clean assembly surface, a fresh unmarked document set paired beside it at the same height. Origin, photographed. |
| 32 | `newpub-tile-regulators-32-1x1` | Regulators & Authorities — `solutions.html#regulators` | Square crop shot from inside a records aisle looking out across a bay — shelving flanking the foreground, the operation visible between. Standing inside the oversight, not looking down on it. |

#### U33–U34 · AI Records Manager page (gap G6)

| # | Filename | Ratio | Slot | Brief |
|---|---|---|---|---|
| 33 | `newpub-photo-paper-to-record-33-3x2` | 3:2 | `arm.html` — replacing the svg aria-label *"A pile of paper records resolved into a structured digital record"* | Left to right in one frame on a dark bench: a disordered heap of loose maintenance paperwork resolving into a single squared, tabbed, indexed stack at right. Same documents, two states. Even raking light, no legible field values. |
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

#### U41–U42 · Company page (gap G5)

| # | Filename | Ratio | Slot | Brief |
|---|---|---|---|---|
| 41 | `newpub-photo-about-facility-41-16x9` | 16:9 | `company.html` — `<h2>One Group, Three Operating Companies</h2>` (re-anchored; the old `about.html` slot was removed by the About re-org) | Two people walking a hangar floor seen from behind at distance, high-vis vests, scale of the space doing the work. |
| 42 | `newpub-photo-about-audit-42-3x2` | 3:2 | `company.html` — `<h2>Built at the Intersection of Aerospace, AI, and Blockchain</h2>` (that heading also exists on `leadership.html`; this entry is for `company.html`) | Three people around a workbench reviewing a component together, all faces turned away or in shadow, mixed daylight and task lighting. |

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

- Palette is already pinned — use §0 verbatim. Do **not** take it from
  `css/style.css` (stale: `#1C5FC0`, `#0E1320`, Inter) and do **not** take it from
  the imagery skill's `brand-spec.md` unless that file's palette matches §0. Rev 4
  updated the skill in step with this document; if a future session finds them
  disagreeing, §0 and the live `ai-records-manager.com` CSS win.
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

### Step 5 — Lock the two visual languages (3 images)

Rev 4 needs **two** house styles locked, not one, and the photographic one now
matters far more than the isometric one.

**5a — the photographed-paper language (2 images: U18, U33).** These two define how
every document photograph in the set is lit, squared and framed. Eleven of the 28
photographs are this class. Generate both, settle the bench surface, the raking-light
angle, the degree of fan, and how paper reads as documents without reading as words.
Write the settled values into the STYLE BLOCK before any other photography.

**5b — the isometric language (1 image: U20).** Only 8 images remain isometric and
they all now ship badged as concept, so one reference is enough. Settle the angle,
line weight, platform thickness and node treatment against U20 (private-channel
isolation, the most structural of the five).

Show all three before proceeding. Everything in steps 6–8 inherits from them.

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

## 6. Copy changes v3 implies (flagged, NOT made)

### The ARM rename

`Agentic Records Manager` is the v3 name. This repo says **`AI Records Manager` 72
times across 27 HTML files.** §3 briefs and alt text use the new name; the page prose
is untouched here because it is marketing copy, not imagery.

| File | Occurrences | | File | Occurrences |
|---|---|---|---|---|
| `solutions.html` | 16 | | `index.html` | 2 |
| `arm.html` | 13 | | `resources.html` | 2 |
| `products.html` | 7 | | `acc-rates.html` | 2 |
| `faq.html` | 5 | | 19 other pages | 1 each |
| `pricing.html` | 4 | | | |

Not yet settled, and worth checking before a bulk find-and-replace: the ARM site's
**own** linked product PDF (`/static/marketing/Block Aero ARM-product-info.pdf`,
dated 2026-07-28) is still titled "AI Records Manager", and the R7 company deck
(2026-07-30) also still says "AI Records Manager". So v3's site copy is ahead of both
its own collateral and the deck. The abbreviation `ARM` is unaffected either way.

### Other v3 gaps in this repo, for the record

- **`css/style.css` carries the superseded palette and body font** — `--blue
  #1C5FC0`, `--navy #0E1320`, Inter. Reconciling it with v3 is a site-wide design
  change, out of scope here (see rev 4 caveat 2).
- **Three marks are in production simultaneously:** v3's "Spectrum Wing", this repo's
  400×400 ring (`images/brand/block-aero-mark.svg`, frozen since 2026-07-07, also the
  favicon), and the 2021 logo still live on the corporate WordPress site. Generated
  art should echo *no* mark rather than pick one.
- **`Tessaron`** appears in 3 prose spots (`arm.html` ×2, `faq.html` ×1) as "Block
  Aero's meta-model for aviation documents". It has zero corroboration anywhere —
  not in Slack, not in Drive, not on the v3 site. Worth confirming it should be
  public at all. No imagery references it.
- **`about.html` was gutted** by the About re-org: it is now a hub page, and its
  content moved to `company.html` and `leadership.html`. This broke one spec anchor
  (see §5).

---

## 5. Revision history

### rev 3 → rev 4 (`d082dfc` → `8a84d7c`, and a brand-canon change)

**The canon moved.** A revised brand system shipped on `ai-records-manager.com` on
2026-08-03 — one day before this rev — and was adopted here as corporate-wide. Full
detail in §0. Net effect on this document:

| Area | rev 3 | rev 4 |
|---|---|---|
| Primary blue | `#1C5FC0` | `#3B82F0` |
| Panel navy | `#141C2E` | `#111827` / `#0B1220` |
| Text neutrals | none | `#E8EDF5` / `#9AA6B8` / `#6B7589` |
| Retired outright | — | `#141C2E`, `#2B86D4`, `#27C47A` |
| Body type | Inter | DM Sans (display stays Space Grotesk) |
| Art direction | flat editorial illustration | documentary photography, veiled to navy, in rounded panels, with a gold provenance pill |
| Family mix | 13 photo / 21 iso / 16 abstract | **28 / 8 / 14** |
| Product name in briefs | AI Records Manager | **Agentic Records Manager** |

**Entries re-briefed from illustration to photography (15):** C2, C15, C16, U18,
U21, U23, U24, U26–U32, U33. Eight were renamed because the family word is part of
the filename convention — e.g. `newpub-iso-data-package-18-3x2` →
`newpub-photo-data-package-18-3x2`. C15 and C16 also changed subject, since an
abstract mesh and grid have no photographic equivalent: they became
`hero-shopfloor` and `hero-apron`.

**One anchor broke.** `about.html` → `<h2>From First Registry to Implementation
Partner</h2>` no longer exists; the About re-org moved that content out. U41 is
re-anchored to `company.html`. Related and worth noting: `<h2>Built at the
Intersection of Aerospace, AI, and Blockchain</h2>` (U42's anchor) now appears on
**both** `company.html` and `leadership.html`, so it is no longer unique — U42 names
its page explicitly.

**Not done, by decision:** the count stays at 50, so the three pages added since
`d082dfc` (`board.html`, `company.html`, `leadership.html`) get **no dedicated
imagery**. They inherit the C16 hero band and the company OG card. `css/style.css`
was not touched. The "no identifiable human faces" guardrail was left as-is — it
governs *generated* art, and the 8 real headshots in `images/team/` are sanctioned
portraiture that the guardrail was never about.

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
