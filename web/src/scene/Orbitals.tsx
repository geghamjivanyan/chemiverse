import { useMemo } from 'react';
import * as THREE from 'three';
import type { Element } from '@chemverse/shared';
import { shellRadius } from './atom-layout';

// цвета по орбитальному квантовому числу l: s, p, d, f
const L_COLOR = ['#36e3ff', '#b06bff', '#ffb04d', '#51cf66'];
const CAP = [2, 6, 10, 14]; // ёмкость s,p,d,f
// порядок заполнения (Aufbau, правило n+l): [n, l]
const AUFBAU: [number, number][] = [
  [1, 0], [2, 0], [2, 1], [3, 0], [3, 1], [4, 0], [3, 2], [4, 1], [5, 0],
  [4, 2], [5, 1], [6, 0], [4, 3], [5, 2], [6, 1], [7, 0], [5, 3], [6, 2], [7, 1],
];

interface Sub {
  n: number;
  l: number;
  count: number;
}
/** Реальная электронная конфигурация по Z (по Aufbau; известные исключения игнорируем). */
function subshells(z: number): Sub[] {
  const out: Sub[] = [];
  let e = z;
  for (const [n, l] of AUFBAU) {
    if (e <= 0) break;
    const c = Math.min(CAP[l]!, e);
    out.push({ n, l, count: c });
    e -= c;
  }
  return out;
}

// направления лепестков орбиталей (нормализуются при сборке)
const LOBES: Record<number, [number, number, number][]> = {
  1: [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]],
  2: [
    [1, 1, 0], [-1, 1, 0], [-1, -1, 0], [1, -1, 0],
    [1, 0, 1], [-1, 0, 1], [-1, 0, -1], [1, 0, -1],
    [0, 1, 1], [0, -1, 1], [0, -1, -1], [0, 1, -1],
    [0, 0, 1], [0, 0, -1],
  ],
  3: [
    [1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1],
    [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1],
  ],
};

function randUnit(): THREE.Vector3 {
  const th = 2 * Math.PI * Math.random();
  const ph = Math.acos(2 * Math.random() - 1);
  return new THREE.Vector3(Math.sin(ph) * Math.cos(th), Math.sin(ph) * Math.sin(th), Math.cos(ph));
}
/** случайный единичный вектор в плоскости, перпендикулярной a */
function randPerp(a: THREE.Vector3): THREE.Vector3 {
  const t = Math.abs(a.x) < 0.9 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
  const p1 = new THREE.Vector3().crossVectors(a, t).normalize();
  const p2 = new THREE.Vector3().crossVectors(a, p1).normalize();
  const ang = Math.random() * 2 * Math.PI;
  return p1.multiplyScalar(Math.cos(ang)).addScaledVector(p2, Math.sin(ang));
}

/** Облако точек: плотность повторяет форму орбиталей (s — шар, p/d/f — лепестки). */
function buildCloud(subs: Sub[], nucleusR: number): { positions: Float32Array; colors: Float32Array } {
  const P: number[] = [];
  const C: number[] = [];
  const col = new THREE.Color();
  for (const sub of subs) {
    const R = shellRadius(sub.n - 1, nucleusR);
    col.set(L_COLOR[sub.l]!);
    const n = sub.count * 120; // больше электронов — плотнее облако
    if (sub.l === 0) {
      // s — нечёткий шар
      for (let i = 0; i < n; i++) {
        const r = R * 0.5 * (0.45 + 0.55 * Math.cbrt(Math.random()));
        const v = randUnit().multiplyScalar(r);
        P.push(v.x, v.y, v.z);
        C.push(col.r, col.g, col.b);
      }
    } else {
      const axes = LOBES[sub.l]!.map((d) => new THREE.Vector3(...d).normalize());
      const reach = R * 0.95;
      const width = R * 0.34;
      for (let i = 0; i < n; i++) {
        const a = axes[(Math.random() * axes.length) | 0]!;
        const u = 0.12 + 0.88 * Math.random(); // вдоль лепестка (0 центр → 1 кончик)
        const along = reach * u;
        const cross = width * Math.sin(Math.PI * u) * Math.sqrt(Math.random()); // толще в середине
        const p = a.clone().multiplyScalar(along).addScaledVector(randPerp(a), cross);
        P.push(p.x, p.y, p.z);
        C.push(col.r, col.g, col.b);
      }
    }
  }
  return { positions: new Float32Array(P), colors: new Float32Array(C) };
}

export function Orbitals({ element, nucleusR }: { element: Element; nucleusR: number }) {
  // показываем внешние (валентные) оболочки — у тяжёлых атомов всё облако нечитаемо
  const subs = useMemo(() => {
    const all = subshells(element.z);
    const maxN = Math.max(...all.map((s) => s.n));
    return all.filter((s) => s.n >= maxN - 1);
  }, [element.z]);

  const { positions, colors } = useMemo(() => buildCloud(subs, nucleusR), [subs, nucleusR]);
  const count = positions.length / 3;

  return (
    <points key={count}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial size={0.075} vertexColors transparent opacity={0.85} depthWrite={false} sizeAttenuation />
    </points>
  );
}
