"""Adds 繁體 and 简体 buttons to the English pages (index.html + chapters/chapter-NN.html).
Run once from the root of the eagle-en-game repo:   python3 add_chinese_links.py
Safe to run again. If you ran the earlier version (one "中文" button), it relabels
that button 繁體 and adds 简体 next to it."""
import re, pathlib

STYLE = 'style="background:#fff;color:#1B4B66;border:none;"'

def add(path, zh_href, zhs_href):
    p = pathlib.Path(path)
    if not p.exists():
        print('  missing  ', path); return
    s = p.read_text(encoding='utf-8')
    before = s
    # Older version of this script added one button labelled 中文 -> relabel it 繁體.
    s = re.sub(r'(<a data-lang-zh [^>]*>)中文(</a>)', r'\g<1>繁體\2', s)
    m = re.search(r'<nav[^>]*>', s)
    if not m:
        print('  NO <nav> ', path, '- add the 繁體/简体 links by hand'); return
    links = ''
    if 'data-lang-zh ' not in s:
        links += f'\n      <a data-lang-zh href="{zh_href}" lang="zh-Hant" {STYLE}>繁體</a>'
    if 'data-lang-zhs' not in s:
        links += f'\n      <a data-lang-zhs href="{zhs_href}" lang="zh-Hans" {STYLE}>简体</a>'
    if links:
        # put the new links right after the existing 繁體 link if there is one, else at the start of <nav>
        old = re.search(r'<a data-lang-zh [^>]*>繁體</a>', s)
        at = old.end() if old else m.end()
        s = s[:at] + links + s[at:]
    if s != before:
        p.write_text(s, encoding='utf-8'); print('  updated  ', path)
    else:
        print('  skipped  ', path, '(already done)')

add('index.html', 'zh/index.html', 'zh-hans/index.html')
for n in range(1, 13):
    add(f'chapters/chapter-{n:02d}.html', f'../zh/chapters/chapter-{n:02d}.html', f'../zh-hans/chapters/chapter-{n:02d}.html')
print('Done. Commit and push.')
