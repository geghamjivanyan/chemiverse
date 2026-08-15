// Клиент к базе молекул на сервере (Postgres через /api).

export interface MolGeometry {
  atoms: { z: number; pos: [number, number, number] }[];
  bonds: { a: number; b: number; order: number }[];
}

export interface ApiMolecule {
  cid: number;
  formula: string;
  name: string | null;
  name_ru: string | null;
  name_hy: string | null;
  atom_count: number;
  geometry: MolGeometry;
}

/** Название молекулы на нужном языке (фоллбэк: англ. → формула). */
export function moleculeName(m: ApiMolecule, locale: 'en' | 'hy' | 'ru'): string {
  if (locale === 'hy' && m.name_hy) return m.name_hy;
  if (locale === 'ru' && m.name_ru) return m.name_ru;
  return m.name ?? m.formula;
}

/** Молекула по формуле (Хилл). null — если в базе нет такой комбинации. */
export async function fetchMolecule(formula: string, signal?: AbortSignal): Promise<ApiMolecule | null> {
  const r = await fetch(`/api/molecules/${encodeURIComponent(formula)}`, { signal });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`api ${r.status}`);
  return (await r.json()) as ApiMolecule;
}
