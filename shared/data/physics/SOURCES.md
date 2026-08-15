# Физические базы данных — источники (скачано 2026-07-03)

Ядерные/атомные данные — public domain (NIST, IAEA, NNDC/BNL, LBNL). Учебный контент (OpenStax, PhET) — Creative Commons, **лицензии различаются, см. разделы ниже — это важно для монетизации**.

## iaea/ — IAEA Live Chart of Nuclides
- **ground_states.csv** (900 КБ, 3387 нуклидов) — массы (AME2020), периоды полураспада, моды распада с %, спины/чётности, распространённость, энергии связи, магнитные/квадрупольные моменты, год открытия.
  - API: `https://nds.iaea.org/relnsd/v1/data?fields=ground_states&nuclides=all` (CSV)
  - Уровни/гаммы через это API отдаются только понуклидно — для массовой выгрузки взят RIPL-3 (ниже).
- **levels.zip** (6.1 МБ) — RIPL-3 Discrete Level Schemes: уровни + гамма-переходы всех ядер, файлы z001.dat…z118.dat.
  - URL: `https://www-nds.iaea.org/RIPL-3/levels/levels.zip`

## ensdf/ — ENSDF (NNDC, Brookhaven)
- **ensdf_260601.zip** (41 МБ) — полная Evaluated Nuclear Structure Data File, дистрибутив June 2026. Уровни, распады, гаммы, все оценённые данные ядерной структуры. Формат — 80-колоночный ENSDF (парсеры: npm нет зрелого, есть python `ensdf`; свой парсер по надобности).
  - URL: `https://www.nndc.bnl.gov/ensdfarchivals/distributions/dist26/ensdf_260601.zip`

## amdc/ — Atomic Mass Data Center (AME2020 / NUBASE2020)
- **mass_1.mas20.txt** — атомные массы и погрешности (fixed-width, формат описан в шапке файла).
- **rct1.mas20.txt, rct2_1.mas20.txt** — энергии реакций и сепарации (S(n), S(p), Q-значения).
- **nubase_4.mas20.txt** — NUBASE2020: свойства основных и изомерных состояний.
  - URL: `https://www-nds.iaea.org/amdc/ame2020/`
  - Цитирование: Kondev et al., Chin. Phys. C45, 030001 (2021).

## pdg/ — Particle Data Group (LBNL), издание 2026
- **pdg-2026.0.sqlite** (25 МБ) — сводные значения Review of Particle Physics.
- **pdgall-2026.0.sqlite** (65 МБ) — то же + все отдельные измерения.
  - Таблицы: `pdgparticle` (1170 частиц: name, mcid, charge, quantum numbers), `pdgdecay` (каналы распада), `pdgdata` (массы/ширины/BR), `pdgmeasurement`.
  - Читается штатным `node:sqlite` (Node ≥ 22.5): `new DatabaseSync(path, { readOnly: true })`.
  - URL: `https://pdg.lbl.gov/2026/api/`, REST: `https://pdgapi.lbl.gov/`
  - Схема: `https://pdgapi.lbl.gov/doc/schema.html`

## codata/ — фундаментальные константы
- **codata2022-allascii.txt** (366 строк, ~350 констант) — CODATA 2022 adjustment: значение, погрешность, единица. Fixed-width ASCII.
  - URL: `https://physics.nist.gov/cuu/Constants/Table/allascii.txt`

## nist-asd/ — NIST Atomic Spectra Database (SRD 78)
- **lines/<Sym>-I.tsv** — видимые (380–780 нм) эмиссионные линии нейтральных атомов: длина волны (воздух), интенсивность, вероятность перехода Aki, конфигурации/термы уровней.
- **fetch-lines.mjs** — скрипт выгрузки (CGI-параметры капризные: обязателен полный astroquery-набор, `limits_type` НЕ передавать, иначе «Invalid Column Setting»).
  - URL: `https://physics.nist.gov/cgi-bin/ASD/lines1.pl` (format=3 → TSV)

## openstax/ — учебники физики OpenStax (git clone, CNXML)
Машиночитаемые исходники: `modules/mXXXXX/index.cnxml` (текст, формулы MathML, примеры с решениями) + `collections/*.collection.xml` (полная таксономия тем). Парсер: официальная python-библиотека `openstax/cnxml`, но CNXML — это просто XML, парсится и из Node.
- **osbooks-physics** (131 МБ) — High School Physics («первая книга», физика с нуля). **Лицензия CC BY 4.0 — можно всё, включая коммерческое, с атрибуцией. Это наша безопасная база.**
- **osbooks-college-physics-bundle** (849 МБ) — College Physics 2e + AP-версия, 318 модулей. **CC BY-NC-SA 4.0 — только некоммерческое!**
- **osbooks-university-physics-bundle** (414 МБ) — University Physics тома 1–3. **CC BY-NC-SA 4.0 — только некоммерческое!**
- Проверено deep-research 3-0: никакой «двусмысленности» нет, college/university именно NC. Коммерческое разрешение — запрос через help.openstax.org.

## phet/ — PhET Interactive Simulations (CU Boulder)
- **metadata-en.json** — каталог всех 119 HTML5-симуляций (категории, описания, learning goals, локали).
- **sims/<name>_all.html** — самодостаточные файлы симуляций, все переводы внутри (`?locale=ru`).
- **ВАЖНО, лицензионный перелом 2026-03-29**: версии, опубликованные ДО этой даты — CC BY 4.0 навсегда («Historical Software Agreement», снапшот в licensing-html-snapshot.html: «may be freely used and/or redistributed … for non-commercial or commercial purposes»). Версии ПОСЛЕ — CC **BY-NC** 4.0 (+ платная модель PhET Studio). Все 119 «latest» в каталоге сейчас BY-NC (перевыпущены 2026-06-24).
- Поэтому два слоя, оба скачаны полностью (по 119/119, ~400 МБ каждый):
  - `sims/` — latest (BY-NC), перевыпуски 2026-06-24; ок, пока проект некоммерческий;
  - `sims-historical/<name>_<version>_all.html` — последние до-срезовые версии (CC BY 4.0), безопасны при монетизации. Русская и армянская локали внутри есть (проверено).
- Манифест: historical-manifest.json. Версии — из релизных веток `major.minor` phetsims/* (тегов у них нет!), patch-версии перебором на CDN, дата — Last-Modified. Нюанс: у старых симуляций patch до 60+ (charges-and-fields 1.0.12 — апрель 2019), сканировать с большим допуском пропусков.
- Атрибуция обязательна: «Simulation by PhET Interactive Simulations, University of Colorado Boulder, licensed under CC BY 4.0 (https://phet.colorado.edu)», логотип PhET в симуляции не скрывать.

## Учебный контент — итоги deep-research (2026-07-03, 102 агента, 23 подтверждённых утверждения)
- **Формулы**: Wikidata P2534 «defining formula» (~113 тыс. statements, CC0). Внимание: SPARQL через `wdt:P2534` отдаёт MathML, не LaTeX — за LaTeX идти в Entity API / statement-level.
- **Задачи**: Open Physics Problem Bank (github.com/open-resources/physics_bank) — 896 задач, 22 темы; но лишь ~190 (из OpenStax) под CC BY, остальные BY-NC-SA. Также OpenStaxQA — 18 332 пары задача-решение (en/es/pl).
- **Образец схемы данных формул**: TheorIA dataset (theoria-dataset.github.io) — JSON-схема с выводами по шагам, CC BY 4.0.
- **RU/HY**: готового учебного контента нет ни у кого; названия понятий — Wikidata (CC0, hy покрыт), тексты переводим сами в i18n. У PhET переводы симуляций: ru — почти всё, hy — проверить по факту в _all.html.

## Генераторы (сделаны 2026-07-03, по образцу химии)
Все в `shared/scripts/`, вывод в `shared/src/physics/` (экспорт через `@chemverse/shared`), тесты — `shared/src/physics/physics.test.ts` (15 шт.).
1. `generate-nuclides.mjs` → `nuclides.ts` — 3386 нуклидов (244 стабильных): массы, T½, моды распада, jp, распространённость.
2. `generate-particles.mjs` → `particles.ts` — 616 частиц с MC ID (485 с массой). Нюанс PDG: `limit_type` 'U'/'L' — пределы (не значения!), 'R' — диапазон (центральное значение годится).
3. `generate-constants.mjs` → `constants.ts` — 355 констант CODATA + объект `PHYS` с 22 короткими символами (PHYS.c, PHYS.h…).
4. `generate-spectra.mjs` → `spectra.ts` — 98 элементов: топ-12 видимых линий + цвет свечения. Нюанс: intens и Aki — несравнимые шкалы, внутри элемента только одна (Aki — фолбэк для Fr, у которого intens пуст).

## Ещё не сделано
- Названия частиц/нуклидов на en/ru/hy — Wikidata SPARQL (как wikidata-names.json у химии).
- Каналы распада частиц (pdgdecay) и уровни ядер (RIPL/ENSDF) — в датасеты пока не выгружены.
- Парсер таксономии тем из OpenStax CNXML (HS Physics, CC BY).
