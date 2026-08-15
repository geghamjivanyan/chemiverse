#!/usr/bin/env bash
# Постранично: PDF → самодостаточный HTML (pdf2htmlEX, идентично PDF) + патч слоёв.
# Usage: pdf2webbook.sh <input.pdf> <out-dir> <first> <last>
set -e
SRC="$1"; OUT="$2"; F="${3:-1}"; L="${4:-10}"
DATA=/opt/squashfs-root/usr/local/share/pdf2htmlEX
APP=/opt/squashfs-root/AppRun
mkdir -p "$OUT"
for i in $(seq "$F" "$L"); do
  pdfseparate -f "$i" -l "$i" "$SRC" /tmp/_pg.pdf
  "$APP" --data-dir "$DATA" --zoom 1.5 --embed-javascript 0 --process-outline 0 --dest-dir "$OUT" /tmp/_pg.pdf "p$i.html" >/dev/null 2>&1
  python3 - "$OUT/p$i.html" <<'PY'
import sys
f=sys.argv[1]; html=open(f,encoding='utf-8').read()
style='<style>img{-webkit-user-drag:none;user-drag:none;pointer-events:none}.bi{-webkit-user-select:none;user-select:none}.t{cursor:text;-webkit-user-select:text;user-select:text}#sidebar,#outline,#pf-loading{display:none}::selection{background:#9ec5fe}</style>'
html=html.replace('</head>', style+'</head>',1)
open(f,'w',encoding='utf-8').write(html)
PY
done
