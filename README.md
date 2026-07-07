# block.aero — public website (staging)

Deployable static site for https://www.block.aero — no build step: every file in this repo ships as-is.

- **Staging/production host:** point Cloudflare Pages / Netlify / GitHub Pages at the repo root.
- **Excluded by design:** internal planning docs, draft customer announcements (pending customer quote approval), dev harness files. Source of truth lives in the working folder; rebuild with `tools/make-dist.sh` there.
- **Before DNS cutover:** set HubSpot form IDs (grep `HUBSPOT SWAP` in get-started.html + investors.html), create the site in Plausible (`data-domain="block.aero"`), configure the redirect map (see internal PLAN.md §10).
