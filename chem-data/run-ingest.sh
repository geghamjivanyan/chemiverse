#!/bin/bash
export PATH=/opt/node/bin:$PATH
# ждём все 40 файлов и завершения загрузчика (макс ~20 мин)
for i in $(seq 1 240); do
  n=$(ls /var/www/chem-data/sdf/*.sdf.gz 2>/dev/null | wc -l)
  if [ "$n" -ge 40 ] && ! pgrep -f 'bash /var/www/chem-data/download.sh' >/dev/null; then break; fi
  sleep 5
done
echo "=== загрузка завершена: $(ls /var/www/chem-data/sdf/*.sdf.gz | wc -l) файлов, $(du -sh /var/www/chem-data/sdf | cut -f1) ==="
echo "=== старт заливки в Postgres ==="
cd /var/www/chemistry
node server/scripts/ingest-molecules.mjs
echo "INGEST_DONE"
