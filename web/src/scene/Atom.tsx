import { useLayoutEffect, useMemo, useRef } from 'react';
import type { MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Element } from '@chemverse/shared';
import {
  nucleonLayout,
  shellRadius,
  electronAngles,
  type Vec3,
} from './atom-layout';
import { Orbitals } from './Orbitals';

const PROTON = '#ff5a5a';
const NEUTRON = '#9aa3b2';
const ELECTRON = '#36e3ff';

/** Группа одинаковых сфер через instancedMesh. */
function Nucleons({ positions, color, radius }: { positions: Vec3[]; color: string; radius: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    positions.forEach((p, i) => {
      dummy.position.set(p[0], p[1], p[2]);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [positions, dummy]);

  if (positions.length === 0) return null;
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, positions.length]} castShadow>
      <sphereGeometry args={[radius, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.35}
        roughness={0.45}
        metalness={0.1}
      />
    </instancedMesh>
  );
}

/** Одна электронная оболочка: кольцо + электроны, вращается вокруг наклонённой оси. */
function Shell({
  count,
  radius,
  index,
}: {
  count: number;
  radius: number;
  index: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const speed = 0.5 / (index + 1) + 0.15; // внутренние быстрее
  const angles = useMemo(() => electronAngles(count), [count]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += speed * delta;
  });

  return (
    // наклон плоскости оболочки, чтобы они не лежали друг на друге
    <group rotation={[index * 0.6, index * 0.4, index * 0.25]}>
      {/* кольцо-орбита (лежит в плоскости XZ) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.012, 8, 96]} />
        <meshBasicMaterial color={ELECTRON} transparent opacity={0.28} />
      </mesh>
      {/* электроны (имя — для жестов: захват/возбуждение находят их обходом сцены) */}
      <group ref={ref}>
        {angles.map((a, i) => (
          <mesh key={i} name={`electron-${index}-${i}`} position={[radius * Math.cos(a), 0, radius * Math.sin(a)]}>
            <sphereGeometry args={[0.13, 16, 16]} />
            <meshStandardMaterial color={ELECTRON} emissive={ELECTRON} emissiveIntensity={0.5} roughness={0.4} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export type AtomMode = 'bohr' | 'orbitals';

export function Atom({
  element,
  mode = 'bohr',
  explodeRef,
}: {
  element: Element;
  mode?: AtomMode;
  explodeRef?: MutableRefObject<number>; // 0..1 — «раскрытие» атома (жест Тони Старка)
}) {
  const { protonPos, neutronPos, radius } = useMemo(
    () => nucleonLayout(element.z, element.neutrons),
    [element.z, element.neutrons],
  );
  const total = element.z + element.neutrons;
  const nucleonR = (radius / Math.cbrt(total)) * 0.64;
  // в орбитальном режиме ядро крошечное — главное облако (и так физически вернее)
  const nucScale = mode === 'orbitals' ? 0.45 : 1;

  const nucRef = useRef<THREE.Group>(null);
  const shellRefs = useRef<(THREE.Group | null)[]>([]);

  // раскрытие: ядро раздвигается, оболочки разлетаются наружу (внешние дальше)
  useFrame(() => {
    if (!explodeRef) return;
    const e = explodeRef.current;
    if (nucRef.current) nucRef.current.scale.setScalar(nucScale * (1 + e * 1.5));
    shellRefs.current.forEach((g, i) => {
      if (g) g.scale.setScalar(1 + e * (0.7 + i * 0.55));
    });
  });

  return (
    <group>
      <group ref={nucRef} scale={nucScale}>
        <Nucleons positions={protonPos} color={PROTON} radius={nucleonR} />
        <Nucleons positions={neutronPos} color={NEUTRON} radius={nucleonR} />
      </group>
      {mode === 'bohr' ? (
        element.shells.map((cnt, i) => (
          <group key={i} ref={(el) => { shellRefs.current[i] = el; }}>
            <Shell count={cnt} radius={shellRadius(i, radius)} index={i} />
          </group>
        ))
      ) : (
        <group ref={(el) => { shellRefs.current[0] = el; }}>
          <Orbitals element={element} nucleusR={radius} />
        </group>
      )}
    </group>
  );
}
