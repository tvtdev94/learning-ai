"""Add the PWA tags (manifest, icons, service worker) to site pages.

Usage, from the repo root:
    python3 _work/add-pwa-head.py so-tay/<slug>/index.html ...

Pages already carrying the tags are skipped, so it is safe to rerun.
Run it on every new topic page before publishing. Topics live in
so-tay/<slug>/; a topic folder at the repo root is refused.
"""
import sys
from pathlib import Path

MARKER = '<!-- pwa -->'
# Top-level folders that are site sections, not misplaced topics.
SECTIONS = {'cv', 'products', 'so-tay', 'learning-ai'}
SNIPPET = """{marker}
<link rel="manifest" href="{p}manifest.webmanifest">
<meta name="theme-color" content="#f7f6f2" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#15171a" media="(prefers-color-scheme: dark)">
<link rel="icon" type="image/png" sizes="32x32" href="{p}icons/favicon-32.png">
<link rel="apple-touch-icon" href="{p}icons/apple-touch-icon.png">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Sổ tay">
<script>if('serviceWorker' in navigator)addEventListener('load',function(){{navigator.serviceWorker.register('{p}sw.js').catch(function(){{}})}})</script>
"""


def add(path: Path) -> str:
    html = path.read_text(encoding='utf-8')
    if MARKER in html:
        return 'skip (already has PWA tags)'
    end = html.find('</title>')
    if end < 0:
        return 'ERROR: no </title>'
    end += len('</title>\n')
    parts = path.parent.parts
    if len(parts) == 1 and parts[0] not in SECTIONS:
        return f'ERROR: topics go in so-tay/{parts[0]}/, not at the repo root'
    prefix = '../' * len(parts)
    html = html[:end] + SNIPPET.format(marker=MARKER, p=prefix) + html[end:]
    path.write_text(html, encoding='utf-8')
    return 'added'


if __name__ == '__main__':
    failed = False
    for arg in sys.argv[1:]:
        result = add(Path(arg))
        failed = failed or result.startswith('ERROR')
        print(f'{arg}: {result}')
    sys.exit(1 if failed else 0)
