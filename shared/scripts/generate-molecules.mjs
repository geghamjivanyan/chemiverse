// Build-time генератор молекул: PubChem (3D-геометрия) + CAS Common Chemistry (свойства).
// Запуск: CAS_KEY=<token> node shared/scripts/generate-molecules.mjs
// Лимиты неважны — это разовый прогон при сборке, с троттлингом.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const CAS_KEY = process.env.CAS_KEY ?? '';

// символ элемента → атомный номер (из нашего же датасета)
const periodic = JSON.parse(readFileSync(resolve(here, '../data/periodic-table-source.json'), 'utf8'));
const Z = {};
for (const e of periodic.elements) Z[e.symbol] = e.number;

// стартовый список: имя в PubChem + CAS RN для свойств
const LIST = [
  { name: 'water', cas: '7732-18-5' },
  { name: 'nitric acid', cas: '7697-37-2' },
  { name: 'sulfuric acid', cas: '7664-93-9' },
  { name: 'ammonia', cas: '7664-41-7' },
  { name: 'methane', cas: '74-82-8' },
  { name: 'ethanol', cas: '64-17-5' },
  { name: 'acetic acid', cas: '64-19-7' },
  { name: 'carbon dioxide', cas: '124-38-9' },
  { name: 'glucose', cas: '50-99-7' },
  { name: 'caffeine', cas: '58-08-2' },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Парсинг V2000 MOL/SDF → {atoms:[{z,pos}], bonds:[{a,b,order}]} */
function parseSDF(sdf) {
  const lines = sdf.split('\n');
  const counts = lines[3];
  const nAtoms = parseInt(counts.slice(0, 3), 10);
  const nBonds = parseInt(counts.slice(3, 6), 10);
  const atoms = [];
  for (let i = 0; i < nAtoms; i++) {
    const p = lines[4 + i].trim().split(/\s+/);
    const sym = p[3];
    atoms.push({ z: Z[sym] ?? 0, pos: [+p[0], +p[1], +p[2]] });
  }
  const bonds = [];
  for (let i = 0; i < nBonds; i++) {
    const l = lines[4 + nAtoms + i];
    bonds.push({ a: parseInt(l.slice(0, 3), 10) - 1, b: parseInt(l.slice(3, 6), 10) - 1, order: parseInt(l.slice(6, 9), 10) });
  }
  return { atoms, bonds };
}

async function pubchem3d(name) {
  const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(name)}/SDF?record_type=3d`;
  const r = await fetch(url, { headers: { 'User-Agent': 'ChemverseBuild/1.0' } });
  if (!r.ok) throw new Error(`PubChem ${r.status}`);
  return parseSDF(await r.text());
}

async function casDetail(cas) {
  if (!CAS_KEY || !cas) return null;
  const r = await fetch(`https://commonchemistry.cas.org/api/detail?cas_rn=${cas}`, {
    headers: { 'X-API-KEY': CAS_KEY },
  });
  if (!r.ok) return null;
  const d = await r.json();
  const prop = (n) => d.experimentalProperties?.find((p) => p.name === n)?.property ?? null;
  return {
    cas: d.rn,
    name: d.name,
    formula: (d.molecularFormula ?? '').replace(/<\/?sub>/g, ''),
    mass: d.molecularMass ? Number(d.molecularMass) : null,
    smiles: d.canonicalSmile ?? null,
    boilingPoint: prop('Boiling Point'),
    meltingPoint: prop('Melting Point'),
    density: prop('Density'),
    synonyms: (d.synonyms ?? []).slice(0, 6),
  };
}

const out = [];
for (const item of LIST) {
  try {
    const geo = await pubchem3d(item.name);
    await sleep(250);
    const cas = await casDetail(item.cas);
    await sleep(250);
    out.push({
      query: item.name,
      formula: cas?.formula ?? null,
      nameEn: cas?.name ?? item.name,
      atoms: geo.atoms,
      bonds: geo.bonds,
      props: cas
        ? { mass: cas.mass, bp: cas.boilingPoint, mp: cas.meltingPoint, density: cas.density, cas: cas.cas }
        : null,
      synonyms: cas?.synonyms ?? [],
    });
    console.log(`✓ ${item.name}: ${geo.atoms.length} атомов, ${geo.bonds.length} связей${cas ? ` · ${cas.formula} · bp ${cas.boilingPoint}` : ''}`);
  } catch (e) {
    console.log(`✗ ${item.name}: ${e.message}`);
  }
}

writeFileSync(resolve(here, '../data/molecules.json'), JSON.stringify(out, null, 2), 'utf8');
console.log(`\nготово: ${out.length} молекул → shared/data/molecules.json`);
