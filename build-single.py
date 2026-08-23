#!/usr/bin/env python3
"""Inline app.css + app.js into one self-contained preview.html.

The multi-file version in this folder is the real app. This build exists only for
hosts that can serve a single file (and for emailing yourself a copy). Sync is
stripped out, since the lazy `import('./sync.js')` has nothing to resolve to.
"""
import pathlib, re

here = pathlib.Path(__file__).parent
html = (here / "index.html").read_text()
css  = (here / "app.css").read_text()
js   = (here / "app.js").read_text()

html = html.replace('<link rel="stylesheet" href="app.css">', f"<style>\n{css}\n</style>")
html = html.replace('<script src="app.js"></script>', f"<script>\n{js}\n</script>")

# Drop the pieces that need sibling files on disk.
for tag in ('<link rel="manifest" href="manifest.webmanifest">',
            '<link rel="icon" href="icon.svg" type="image/svg+xml">',
            '<link rel="apple-touch-icon" href="icon-180.png">'):
    html = html.replace(tag, "")

html = re.sub(r'if\("serviceWorker" in navigator.*?\n}\n', "", html, flags=re.S)

out = here / "preview.html"
out.write_text(html)
print(f"wrote {out.name}  ({len(html)/1024:.0f} KB)")
