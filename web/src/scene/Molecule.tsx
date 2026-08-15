import { useMemo } from 'react';
import * as THREE from 'three';
import { byZ } from '@chemverse/shared';

// геометрия молекулы (совместима и с самописной, и с ответом API)
export interface MolGeo {
  atoms: { z: number; pos: [number, number, number] }[];
  bonds: { a: number; b: number; order: number }[];
}

const UP = new THREE.Vector3(0, 1, 0);
const BOND_COLOR = '#aeb8d0';

function atomRadius(z: number): number {
  const p = byZ.get(z)?.period ?? 2;
  return 0.28 + 0.05 * p;
}

interface Cyl {
  pos: [number, number, number];
  quat: [number, number, number, number];
  len: number;
}

/** Раскладывает связи (с учётом кратности) в набор цилиндров. */
function bondCylinders(mol: MolGeo): Cyl[] {
  const out: Cyl[] = [];
  for (const b of mol.bonds) {
    const a = mol.atoms[b.a];
    const c = mol.atoms[b.b];
    if (!a || !c) continue;
    const vA = new THREE.Vector3(...a.pos);
    const vB = new THREE.Vector3(...c.pos);
    const dir = vB.clone().sub(vA);
    const len = dir.length();
    const mid = vA.clone().add(vB).multiplyScalar(0.5);
    const q = new THREE.Quaternion().setFromUnitVectors(UP, dir.clone().normalize());

    // перпендикуляр для разнесения кратных связей
    let perp = new THREE.Vector3(1, 0, 0).cross(dir);
    if (perp.lengthSq() < 1e-6) perp = new THREE.Vector3(0, 0, 1).cross(dir);
    perp.normalize();

    const off = 0.13;
    const offsets =
      b.order === 1 ? [0] : b.order === 2 ? [-off, off] : [-off * 1.6, 0, off * 1.6];
    for (const o of offsets) {
      const p = mid.clone().addScaledVector(perp, o);
      out.push({ pos: [p.x, p.y, p.z], quat: [q.x, q.y, q.z, q.w], len });
    }
  }
  return out;
}

export function Molecule({ molecule }: { molecule: MolGeo }) {
  const cylinders = useMemo(() => bondCylinders(molecule), [molecule]);

  return (
    <group>
      {/* атомы */}
      {molecule.atoms.map((a, i) => (
        <mesh key={i} position={a.pos}>
          <sphereGeometry args={[atomRadius(a.z), 32, 32]} />
          <meshStandardMaterial
            color={byZ.get(a.z)?.color ?? '#cccccc'}
            emissive={byZ.get(a.z)?.color ?? '#cccccc'}
            emissiveIntensity={0.25}
            roughness={0.35}
            metalness={0.15}
          />
        </mesh>
      ))}
      {/* связи */}
      {cylinders.map((c, i) => (
        <mesh key={i} position={c.pos} quaternion={c.quat}>
          <cylinderGeometry args={[0.075, 0.075, c.len, 16]} />
          <meshStandardMaterial color={BOND_COLOR} roughness={0.5} metalness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

/** Габаритный радиус молекулы — для дистанции камеры. */
export function moleculeRadius(mol: MolGeo): number {
  let max = 0.5;
  for (const a of mol.atoms) {
    const r = Math.hypot(...a.pos) + atomRadius(a.z);
    if (r > max) max = r;
  }
  return max;
}
