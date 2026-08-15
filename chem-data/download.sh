#!/bin/bash
cd /var/www/chem-data/sdf
base="https://ftp.ncbi.nlm.nih.gov/pubchem/Compound_3D/01_conf_per_cmpd/SDF"
for start in $(seq 1 25000 475001); do
  end=$((start + 24999))
  f=$(printf "%08d_%08d.sdf.gz" "$start" "$end")
  [ -s "$f" ] && { echo "уже есть: $f"; continue; }
  echo "качаю: $f"
  curl -fsSL --retry 3 --max-time 300 -O "$base/$f" || echo "ОШИБКА: $f"
  sleep 1
done
echo "ВСЕГО ФАЙЛОВ: $(ls *.sdf.gz | wc -l), РАЗМЕР: $(du -sh . | cut -f1)"
echo "DOWNLOAD_DONE"
