# `images/` directory convention

Two zones: **shipping** directories whose files are referenced by the HTML, and a
**pipeline** directory that is working state only.

## Shipping — referenced by pages, deployed to block.aero

| Directory | Holds | Status |
|---|---|---|
| `images/brand/` | Logo marks, wordmarks, lockups, morph animations | Complete — 19 files |
| `images/logos/` | Partner marks in `<slug>/on-light` + `on-dark` pairs | See `images/logos/MANIFEST.md` |
| `images/product/` | Real product UI screenshots | 9 files |
| `images/photos/` | Documentary photography | 4 files → 13 planned |
| `images/og/` | Social share cards, 1200×630 | New — 7 planned |
| `images/iso/` | Isometric concept illustration | New — 21 planned |
| `images/abstract/` | Abstract art, hero bands, section textures | New — 16 planned |
| `images/tile/` | 1:1 Solutions business-type tiles | New — 7 planned |

Every file in a shipping directory must be web-optimized and referenced by at
least one page. Unreferenced files are dead weight — the repo root deploys as-is,
so anything sitting here is served.

## Pipeline — working state, not for release

`images/_pipeline/` holds raw generation output, the ARM reference set, and the
`MANIFEST.md` provenance log. Nothing in it is referenced by the HTML. The
underscore prefix marks it as non-shipping; `robots.txt` disallows it. See
`images/_pipeline/README.md` for the working contract.

## Rules for adding a new image

1. Generate and patch in `_pipeline/` (see its README).
2. Log a `MANIFEST.md` entry — no entry, no ship.
3. Export a web derivative into the right shipping directory above.
4. Reference it from the HTML with explicit `width` and `height`.

Steps 3 and 4 are what make it live. A file in `_pipeline/` is not published.

## Specs

- `images/IMAGERY-SPEC.md` — the gap analysis and the 50-image inventory with
  per-image filenames, ratios, target slots and briefs.
