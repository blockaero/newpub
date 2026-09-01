# Partner logo library

Paired official marks. Paths are `images/logos/<slug>/`.

- **on-light** — full-color or dark mark, transparent background, for white / light grey.
- **on-dark** — white or reversed mark, transparent background, for navy / black.
- **source** — official vector when the partner publishes one.

Official artwork only. Empty pair slots are empty on purpose: do not invert a color logo to invent the missing variant. Place the existing mark on a CSS chip of the matching ground instead.

Verified 2026-09-01.

| Slug | Name | on-light | on-dark | Source URL | Notes |
|---|---|---|---|---|---|
| afra | Aircraft Fleet Recycling Association | yes (`on-light.png`, 1090×682) | yes (`on-dark.png`, 1090×682) | https://afraassociation.org/resources/Site/AFRA_Logo_Stacked_Color_Transparent.png · https://afraassociation.org/resources/Site/AFRA_Logo-Stacked-White-Transparent.png | Official stacked color + white transparents from AFRA's site. |
| md-turbines | MD Turbines | **no** | yes (`on-dark.png`, 1086×220) | https://www.mdturbines.com/ | Site ships the mark as a Lottie, not a static color file. In-repo white raster kept as on-dark (already transparent). Do not invent on-light. |
| ils | ILS — a CAMP company | yes (`on-light.svg` / `source.svg`) | yes (`on-dark.png`, 264×220) | https://www.ilsmart.com/hubfs/ILS.LOGO.MAIN.svg | Official main SVG from ilsmart.com (cyan + grey). On-dark is the in-repo cyan + white lockup, already transparent; long edge 264px — no larger official white file found. |
| elior | Elior Group | yes (`on-light.svg` / `source.svg`) | yes (`on-dark.png`, 962×110) | https://www.eliorgroup.com/sites/www.eliorgroup.com/files/elior_group_logotype_bleu_horizontal_0.svg · https://www.eliorgroup.com/sites/www.eliorgroup.com/files/elior_group_logotype_blanc_horizontal_0.png | Official blue SVG + white PNG from eliorgroup.com (2025 bison identity). |
| kp-aviation | KP Aviation | yes (`on-light.svg` / `source.svg`) | yes (`on-dark.svg`) | https://kpaviation.net/wp-content/themes/_kp/theme/assets/images/kp-logo.svg · https://kpaviation.net/wp-content/themes/_kp/theme/assets/images/kp-logo-white.svg | Official pair from the KP Aviation site theme. Color lockup includes white type — on pale grounds sit it on a navy chip. |
| aar | AAR | yes (`on-light.png`, 1440×538) | yes (`on-dark.svg` / `source.svg`) | https://www.aarcorp.com/en/newsroom/media-resources/ · https://www.aarcorp.com/globalassets/7.-newsroom/media-resources/images/logos/aar_296_rgb_full-color.png · https://www.aarcorp.com/globalassets/navigation/aar_logo_nav.svg | Full-color from AAR media kit. On-dark is the official nav SVG (white + grey). |
| asa | Aviation Suppliers Association | **no** | yes (`on-dark.png`, 1045×641) | https://www.aviationsuppliers.org/images/ASA-logo-wt.png | Official white lockup. Color file on the ASA site was a 28×17 favicon — discarded. |
| caac | CAAC | yes (`on-light.png`, 353×220) | **no** | — | In-repo grey raster, already transparent. No official pair found on caac.gov.cn (2026-09-01). Long edge 353px. |
| cavu | CAVU Aerospace | **no** | yes (`on-dark.png`, 2613×1000) | https://static.wixstatic.com/media/2dcac5_b6a1c5fd5f944706ac6791a357eb2660~mv2.png | Official `CAVU-Logo-White-RGB.png` from cavuaerospace.com. No color file published on the homepage. |
| ecube | eCube | yes (`on-light.png`, 1433×220) | **no** | https://www.ecube.aero/ | In-repo color raster matching the ecube.aero mark. Site currently serves only small header PNGs (144px / 437 B) — not used. |
| heston | Heston Materials | yes (`on-light.svg` / `source.svg`) | yes (`on-dark.png`, 998×220) | https://hestonmaterials.com/wp-content/uploads/2023/08/logo.svg | Official dark SVG from hestonmaterials.com. On-dark is the in-repo white raster (already transparent). |
| icao | ICAO | yes (`on-light.svg` / `source.svg`) | yes (`on-dark.png`, 267×220) | https://www.icao.int/sites/default/files/logo.svg | Official color SVG from icao.int. On-dark is the in-repo white raster; long edge 267px — no larger official white file fetched. |
| jal | JAL / JALUX | **no** | yes (`on-dark.png`, 193×220) | — | In-repo white crane, already transparent. Current official JAL color file not obtained (jal.com 403; Commons hits were historic 1989–2011 marks — not used). Long edge 193px. |
| stratton | Stratton Aviation | **no** | yes (`on-dark.png`, 691×220) | https://www.strattonaviation.com/ | In-repo white raster, already transparent. Homepage did not expose a named official color file. Long edge 691px. |
| unical | Unical | yes (`on-light.png`, 614×220) | yes (`on-dark.svg` / `source.svg`) | https://unical.com/hubfs/Stacked%20Logo%20AI-separate-02.svg | Official stacked SVG is orange + white (on-dark). On-light is the in-repo color raster (dark + orange, already transparent). |

## How pages should pick a file

| Ground | Prefer | If that pair is missing |
|---|---|---|
| White / light grey | `on-light` | Put `on-dark` on a navy CSS chip, or a text chip |
| Navy / black | `on-dark` | Put `on-light` on a white CSS chip, or a text chip |
