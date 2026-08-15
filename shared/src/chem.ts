// Построители 3D-геометрии молекул с реальными валентными углами.
// Координаты в условных единицах (масштабируются во вью). Каждая молекула
// центрируется по центроиду — удобно вращать.
import type { Bond } from './types';

type AtomPos = { z: number; pos: [number, number, number] };
export interface Geometry {
  atoms: AtomPos[];
  bonds: Bond[];
}

const LEN = 1.5; // базовая длина связи (усл. ед.)
const deg = (d: number) => (d * Math.PI) / 180;

function recenter(atoms: AtomPos[]): AtomPos[] {
  const n = atoms.length || 1;
  let cx = 0;
  let cy = 0;
  let cz = 0;
  for (const a of atoms) {
    cx += a.pos[0];
    cy += a.pos[1];
    cz += a.pos[2];
  }
  cx /= n;
  cy /= n;
  cz /= n;
  return atoms.map((a) => ({
    z: a.z,
    pos: [a.pos[0] - cx, a.pos[1] - cy, a.pos[2] - cz] as [number, number, number],
  }));
}

/** Двухатомная: A–B на оси X. */
export function diatomic(z1: number, z2: number, order: 1 | 2 | 3 = 1, len = LEN): Geometry {
  return {
    atoms: recenter([
      { z: z1, pos: [-len / 2, 0, 0] },
      { z: z2, pos: [len / 2, 0, 0] },
    ]),
    bonds: [{ a: 0, b: 1, order }],
  };
}

/** Линейная трёхатомная: X–C–X (180°). atoms[0] — центр. */
export function linear(zc: number, zo: number, order: 1 | 2 | 3 = 2, len = LEN): Geometry {
  return {
    atoms: recenter([
      { z: zc, pos: [0, 0, 0] },
      { z: zo, pos: [-len, 0, 0] },
      { z: zo, pos: [len, 0, 0] },
    ]),
    bonds: [
      { a: 0, b: 1, order },
      { a: 0, b: 2, order },
    ],
  };
}

/** Угловая (V): центр + два одинаковых атома под углом angle. */
export function bent(
  zc: number,
  zo: number,
  angle: number,
  order: 1 | 2 | 3 = 1,
  len = LEN,
): Geometry {
  const half = deg(angle) / 2;
  return {
    atoms: recenter([
      { z: zc, pos: [0, 0, 0] },
      { z: zo, pos: [-len * Math.sin(half), -len * Math.cos(half), 0] },
      { z: zo, pos: [len * Math.sin(half), -len * Math.cos(half), 0] },
    ]),
    bonds: [
      { a: 0, b: 1, order },
      { a: 0, b: 2, order },
    ],
  };
}

/** Тетраэдр: центр + 4 атома (109.5°). */
export function tetrahedral(zc: number, zo: number, order: 1 | 2 | 3 = 1, len = LEN): Geometry {
  const d: [number, number, number][] = [
    [1, 1, 1],
    [1, -1, -1],
    [-1, 1, -1],
    [-1, -1, 1],
  ];
  const k = len / Math.sqrt(3);
  const atoms: AtomPos[] = [{ z: zc, pos: [0, 0, 0] }];
  const bonds: Bond[] = [];
  d.forEach((v, i) => {
    atoms.push({ z: zo, pos: [v[0] * k, v[1] * k, v[2] * k] });
    bonds.push({ a: 0, b: i + 1, order });
  });
  return { atoms: recenter(atoms), bonds };
}

/** Тригональная пирамида (напр. NH3): центр + 3 атома, угол между связями ~angle. */
export function pyramidal(
  zc: number,
  zo: number,
  angle: number,
  order: 1 | 2 | 3 = 1,
  len = LEN,
): Geometry {
  // полярный угол от оси -Y подбираем так, чтобы межсвязный угол был ≈ angle
  // cos(angle) = cos^2(t)*? — берём приближение t от вертикали
  const t = deg(180 - angle) / 1.6 + deg(20); // эмпирически близко к 107° для NH3
  const atoms: AtomPos[] = [{ z: zc, pos: [0, 0, 0] }];
  const bonds: Bond[] = [];
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2;
    atoms.push({
      z: zo,
      pos: [len * Math.sin(t) * Math.cos(a), -len * Math.cos(t), len * Math.sin(t) * Math.sin(a)],
    });
    bonds.push({ a: 0, b: i + 1, order });
  }
  return { atoms: recenter(atoms), bonds };
}
