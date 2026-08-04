#!/usr/bin/env python3
"""Apply tools/brand-tokens.json across every place newpub hardcodes a brand value.

Why this exists: brand values are duplicated in FOUR places, so a palette or type
change is not a one-file edit.

  1. css/style.css          — the :root custom properties (the canonical set)
  2. *.html                 — an inline `tailwind.config` <script> block repeated on
                              EVERY page, restating the same colours and fonts
  3. *.html                 — the Google Fonts <link>, which must actually load any
                              typeface the tokens name (miss this and the new face
                              silently falls back to system sans on 30 pages)
  4. js/block-aero-logo.js  — colour data for the animated mark

Edit brand-tokens.json, run this, commit. Idempotent: safe to re-run.

  python3 tools/apply-brand-tokens.py --check   # report only, change nothing
  python3 tools/apply-brand-tokens.py           # apply

Only `v3_determined` is applied. `needs_branding_kit` tokens are deliberately left
alone — substituting v3's dark-theme values into newpub's light theme would break
them (most dangerously --ink, where v3's #E8EDF5 is text ON navy and would be
invisible on white).

PROTECTED: the animated mark's colour ring in js/block-aero-logo.js. Those hexes
are the logo's own spectrum gradient and keep the OLD blue by design, so the
`faces` array is skipped wholesale rather than by keyword.
"""
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
MAP = json.loads((ROOT / "tools" / "brand-tokens.json").read_text())

# The mark's colour ring, expressed as JS data rather than an SVG linearGradient.
# Everything between `faces = [` and the closing `];` is the logo's own gradient.
FACES_BLOCK = re.compile(r'(var\s+faces\s*=\s*\[.*?\];)', re.S)

# Webfont families, so a token naming a typeface also loads it.
FONT_LINKS = {
    "DM Sans": "family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400",
    "Inter": "family=Inter:wght@400;500;600;700",
}


def token_pairs():
    """(old, new, name) for every value that actually changes."""
    out = []
    for name, spec in MAP["v3_determined"].items():
        if name.startswith("_"):
            continue
        old, new = spec["from"], spec["to"]
        if old != new:
            out.append((old, new, name))
    return out


def variants(value):
    """A quoted token value appears double-quoted in CSS, single-quoted in Tailwind."""
    bare = value.strip('"')
    if bare == value:
        return [value]
    return [f'"{bare}"', f"'{bare}'"]


def rgb_triplet(hex_value):
    """'#1C5FC0' -> '28, 95, 192'. Brand colours also appear in rgba() form for
    shadows, selection, borders and dot patterns; those must follow the token."""
    h = hex_value.lstrip("#")
    if len(h) != 6:
        return None
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def rewrite_rgba(pairs, apply):
    """Rewrite rgba()/rgb() forms of any colour token that changed."""
    results = []
    for p in [ROOT / "css" / "style.css"] + sorted(ROOT.glob("*.html")):
        src = text = p.read_text()
        hits = []
        for old, new, name in pairs:
            o, n = rgb_triplet(old), rgb_triplet(new)
            if not o or not n:
                continue
            # tolerate any internal spacing: rgba(28,95,192 / rgba(28, 95, 192
            pat = re.compile(rf'(rgba?\(\s*){o[0]}(\s*,\s*){o[1]}(\s*,\s*){o[2]}')
            text, cnt = pat.subn(rf'\g<1>{n[0]}\g<2>{n[1]}\g<3>{n[2]}', text)
            if cnt:
                hits.append(f"{name}: rgb({o[0]},{o[1]},{o[2]}) -> rgb({n[0]},{n[1]},{n[2]}) ({cnt})")
        if hits:
            if apply and text != src:
                p.write_text(text)
            results.append((p.name, hits))
    return results


def rewrite_inline_art(pairs, apply):
    """Brand-colour usage inside inline <svg> artwork in the HTML pages.

    Safe because `pairs` only ever contains the determined token changes — the
    retired-but-pending values (#2B86D4, #0E1320, #141C2E) are absent from it and
    so are left untouched by construction. The animated mark is in
    js/block-aero-logo.js and is protected there; images/brand/*.svg carry no
    old blue, verified.
    """
    results = []
    for p in sorted(ROOT.glob("*.html")):
        src = text = p.read_text()
        # Keep the tailwind block out of it — rewrite_html owns that region
        m = re.search(r'(<script>tailwind\.config=.*?</script>)', text, re.S)
        guard = "__BA_TAILWIND_BLOCK__"
        if m:
            text = text.replace(m.group(1), guard)
        hits = []
        for old, new, name in pairs:
            if not old.startswith("#"):
                continue
            cnt = text.count(old)
            if cnt:
                text = text.replace(old, new)
                hits.append(f"{name}: {old} -> {new} ({cnt})")
        if m:
            text = text.replace(guard, m.group(1))
        if hits:
            if apply and text != src:
                p.write_text(text)
            results.append((p.name, hits))
    return results


def rewrite_css(pairs, apply):
    p = ROOT / "css" / "style.css"
    src = text = p.read_text()
    hits = []
    for old, new, name in pairs:
        for o, n in zip(variants(old), variants(new)):
            # Match the declaration only, never a usage
            pat = re.compile(rf'(--{re.escape(name.lstrip("-"))}\s*:\s*[^;]*?){re.escape(o)}')
            text, cnt = pat.subn(rf'\g<1>{n}', text)
            if cnt:
                hits.append(f"{name}: {o} -> {n} ({cnt})")
        # A retired face may also linger as a fallback in --font-display
        if old.startswith('"'):
            pat = re.compile(rf'(--font-display\s*:\s*[^;]*?){re.escape(variants(old)[0])}')
            text, cnt = pat.subn(rf'\g<1>{variants(new)[0]}', text)
            if cnt:
                hits.append(f"--font-display fallback: {old} -> {new} ({cnt})")
    if apply and text != src:
        p.write_text(text)
    return "css/style.css", hits


def rewrite_html(pairs, apply):
    """Tailwind config block + Google Fonts link, per page."""
    results = []
    new_faces = [n for o, n, name in pairs if name == "--font"]
    for p in sorted(ROOT.glob("*.html")):
        src = text = p.read_text()
        hits = []

        # (a) the inline tailwind.config block, scoped so page content and inline
        #     SVG gradients are never touched
        m = re.search(r'(<script>tailwind\.config=.*?</script>)', text, re.S)
        if m:
            block = new_block = m.group(1)
            for old, new, name in pairs:
                for o, n in zip(variants(old), variants(new)):
                    if o in new_block:
                        hits.append(f"tailwind {name}: {o} -> {n} ({new_block.count(o)})")
                        new_block = new_block.replace(o, n)
            if new_block != block:
                text = text.replace(block, new_block)

        # (b) the Google Fonts link — load whatever typeface the tokens now name
        for face in new_faces:
            bare, seg = face.strip('"'), FONT_LINKS.get(face.strip('"'))
            if not seg:
                hits.append(f"WARNING: no webfont segment known for {face}")
                continue
            fm = re.search(r'(fonts\.googleapis\.com/css2\?[^"\']+)', text)
            if not fm or seg in fm.group(1):
                continue
            href = new_href = fm.group(1)
            # swap the retired family's segment for the new one, in place
            for old, _, name in pairs:
                if name != "--font":
                    continue
                old_seg = FONT_LINKS.get(old.strip('"'))
                if old_seg and old_seg in new_href:
                    new_href = new_href.replace(old_seg, seg)
                    break
            else:
                new_href = new_href.replace("&display=swap", f"&{seg}&display=swap")
            if new_href != href:
                text = text.replace(href, new_href)
                hits.append(f"webfont link: now loads {bare}")

        if hits:
            if apply and text != src:
                p.write_text(text)
            results.append((p.name, hits))
    return results


def rewrite_logo_js(pairs, apply):
    p = ROOT / "js" / "block-aero-logo.js"
    if not p.exists():
        return "js/block-aero-logo.js", [], 0
    src = p.read_text()

    # Lift the mark's colour ring out before touching anything, put it back after.
    protected = FACES_BLOCK.search(src)
    guard = "__BA_FACES_PROTECTED__"
    text = src.replace(protected.group(1), guard) if protected else src

    hits = []
    for old, new, name in pairs:
        if not old.startswith("#"):
            continue
        cnt = text.count(old)
        if cnt:
            text = text.replace(old, new)
            hits.append(f"{name}: {old} -> {new} ({cnt})")

    if protected:
        text = text.replace(guard, protected.group(1))
    n_protected = len(re.findall(r'#[0-9A-Fa-f]{6}', protected.group(1))) if protected else 0

    if apply and text != src:
        p.write_text(text)
    return "js/block-aero-logo.js", hits, n_protected


def main():
    apply = "--check" not in sys.argv
    pairs = token_pairs()
    if not pairs:
        print("No value changes in v3_determined — nothing to do.")
        return 0

    print(f"{'APPLYING' if apply else 'CHECK (no writes)'} — {len(pairs)} token(s) changing\n")
    total = 0

    target, hits = rewrite_css(pairs, apply)
    print(f"{target}: {len(hits)} change(s)")
    for h in hits:
        print(f"    {h}")
    total += len(hits)

    target, hits, n_prot = rewrite_logo_js(pairs, apply)
    print(f"{target}: {len(hits)} change(s), {n_prot} hex(es) PROTECTED in the mark's colour ring")
    for h in hits:
        print(f"    {h}")
    total += len(hits)

    html = rewrite_html(pairs, apply)
    n = sum(len(h) for _, h in html)
    print(f"\nHTML (tailwind config + webfont link): {len(html)} page(s), {n} change(s)")
    for name, hits in html[:2]:
        for h in hits:
            print(f"    {name}: {h}")
    if len(html) > 2:
        print(f"    ... and {len(html)-2} more pages, same substitutions")
    total += n

    art = rewrite_inline_art(pairs, apply)
    n = sum(len(h) for _, h in art)
    print(f"\ninline SVG artwork: {len(art)} page(s), {n} change(s)")
    for name, hits in art:
        for h in hits:
            print(f"    {name}: {h}")
    total += n

    rgba = rewrite_rgba(pairs, apply)
    n = sum(len(h) for _, h in rgba)
    print(f"\nrgba()/rgb() forms: {len(rgba)} file(s), {n} change(s)")
    for name, hits in rgba:
        for h in hits:
            print(f"    {name}: {h}")
    total += n

    pending = [k for k in MAP["needs_branding_kit"] if not k.startswith("_")]
    print(f"\n{total} substitution(s) total")
    print(f"{len(pending)} token(s) awaiting branding-kit: {', '.join(pending)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
