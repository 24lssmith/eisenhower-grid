#!/usr/bin/env python3
"""Build the Claude-artifact version of Eisenhower Grid from index.html.

The standalone app (index.html) saves tasks in the browser. The artifact build
runs inside Claude, saves tasks to the artifact's database so they sync across
devices, and loads fonts from Google Fonts instead of the local fonts folder.

Usage: python3 tools/build-artifact.py [output-path]
"""
import re
import sys
from pathlib import Path

root = Path(__file__).resolve().parent.parent
src = (root / "index.html").read_text(encoding="utf-8")
out_path = Path(sys.argv[1]) if len(sys.argv) > 1 else root / "dist" / "eisenhower-grid-artifact.html"


def cut(pattern, text, flags=re.S):
    new, n = re.subn(pattern, "", text, flags=flags)
    if n != 1:
        raise SystemExit(f"build-artifact: expected one match for {pattern!r}, found {n}")
    return new


head_start = src.index("<!--APP-HEAD-->")
title_start = src.index("<title>")
style_end = src.index("</head>")
head = src[title_start:style_end]
head = head.replace("<!--ARTIFACT-HEAD\n", "").replace("/ARTIFACT-HEAD-->\n", "")
head = cut(r"/\*APP-FONTS\*/.*?/\*/APP-FONTS\*/\n", head)
head = cut(r"/\*APP-ONLY\*/.*?/\*/APP-ONLY\*/\n", head)

body_open = src.index("<body>") + len("<body>")
body_close = src.rindex("</body>")
body = src[body_open:body_close]
if "const BUILD = 'app';" not in body:
    raise SystemExit("build-artifact: BUILD flag not found")
body = body.replace("const BUILD = 'app';", "const BUILD = 'artifact';", 1)

out = head.rstrip() + "\n" + body.strip() + "\n"
out_path.parent.mkdir(parents=True, exist_ok=True)
out_path.write_text(out, encoding="utf-8")
print(f"wrote {out_path} ({len(out):,} bytes)")
