import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Molecule } from '../scene/Molecule';
import { fetchMolecule, type ApiMolecule } from '../lab/api';
import type { Effect, Reaction } from '../lab/reactions';

const rs = (a: number) => (Math.random() - 0.5) * a;
const randDir = (sp: number) => new THREE.Vector3(rs(2), rs(2), rs(2)).normalize().multiplyScalar(sp * (0.6 + Math.random() * 0.6));

interface FxCfg {
  color: string;
  size: number;
  gravity: number;
  vel: () => THREE.Vector3;
  flash?: string;
}
const FX: Record<Effect, FxCfg> = {
  flame: { color: '#ff8a3a', size: 0.16, gravity: 0.9, vel: () => new THREE.Vector3(rs(0.5), 1.4 + Math.random(), rs(0.5)), flash: '#ff7a3a' },
  explosion: { color: '#ffcf6b', size: 0.2, gravity: -1.4, vel: () => randDir(4), flash: '#ffd27a' },
  gas: { color: '#9fe0ff', size: 0.11, gravity: 0.5, vel: () => new THREE.Vector3(rs(0.4), 1.0 + Math.random() * 0.6, rs(0.4)) },
  fizz: { color: '#bfe9ff', size: 0.1, gravity: 0.6, vel: () => new THREE.Vector3(rs(0.5), 1.2 + Math.random() * 0.5, rs(0.5)) },
  heat: { color: '#ffb454', size: 0.14, gravity: 0.5, vel: () => new THREE.Vector3(rs(0.3), 0.9, rs(0.3)) },
  light: { color: '#fff2c0', size: 0.18, gravity: 0, vel: () => randDir(2), flash: '#fff2c0' },
  precipitate: { color: '#9aa3b2', size: 0.12, gravity: -1.6, vel: () => new THREE.Vector3(rs(0.4), 0.2, rs(0.4)) },
};

const N = 150;
function Particles({ active, cfg }: { active: boolean; cfg: FxCfg }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => new Float32Array(N * 3).fill(-999), []);
  const parts = useMemo(() => Array.from({ length: N }, () => ({ life: 0, pos: new THREE.Vector3(), vel: new THREE.Vector3() })), []);

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05);
    for (let i = 0; i < N; i++) {
      const p = parts[i]!;
      if (p.life <= 0) {
        if (active && Math.random() < 0.5) {
          p.life = 0.6 + Math.random() * 0.9;
          p.pos.set(rs(1.2), -0.5 + rs(0.3), rs(1.2));
          p.vel.copy(cfg.vel());
        } else {
          positions[i * 3 + 1] = -999;
          continue;
        }
      } else {
        p.life -= dt;
        p.vel.y += cfg.gravity * d;
        p.pos.addScaledVector(p.vel, d);
      }
      positions[i * 3] = p.pos.x;
      positions[i * 3 + 1] = p.pos.y;
      positions[i * 3 + 2] = p.pos.z;
    }
    if (ref.current) ref.current.geometry.attributes.position!.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={N} />
      </bufferGeometry>
      <pointsMaterial color={cfg.color} size={cfg.size} transparent opacity={0.92} depthWrite={false} sizeAttenuation toneMapped={false} />
    </points>
  );
}

function Flash({ trigger, color }: { trigger: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  const life = useRef(0);
  const last = useRef(0);
  useFrame((_, dt) => {
    if (trigger !== last.current) { last.current = trigger; life.current = 1; }
    const m = ref.current;
    if (!m) return;
    life.current = Math.max(0, life.current - dt * 2.2);
    const s = 0.4 + (1 - life.current) * 3;
    m.scale.setScalar(s);
    (m.material as THREE.MeshBasicMaterial).opacity = life.current * 0.55;
    m.visible = life.current > 0.01;
  });
  return (
    <mesh ref={ref} visible={false}>
      <sphereGeometry args={[1, 24, 24]} />
      <meshBasicMaterial color={color} transparent opacity={0} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

function Beaker() {
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[1.15, 1, 2.4, 36, 1, true]} />
        <meshStandardMaterial color="#bcdcff" transparent opacity={0.1} roughness={0.1} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -1.18, 0]}>
        <cylinderGeometry args={[1, 1, 0.06, 36]} />
        <meshStandardMaterial color="#bcdcff" transparent opacity={0.18} />
      </mesh>
      <mesh position={[0, -0.55, 0]}>
        <cylinderGeometry args={[0.95, 0.95, 1.2, 36]} />
        <meshStandardMaterial color="#2a6f9e" transparent opacity={0.4} emissive="#2a6f9e" emissiveIntensity={0.15} />
      </mesh>
    </group>
  );
}

function Product({ mol, show }: { mol: ApiMolecule | null; show: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    const targetY = show ? 1.4 : -0.4;
    const targetS = show ? 1 : 0.01;
    g.position.y += (targetY - g.position.y) * Math.min(1, dt * 4);
    const s = g.scale.x + (targetS - g.scale.x) * Math.min(1, dt * 4);
    g.scale.setScalar(Math.max(0.001, s));
    g.rotation.y += dt * 0.6;
  });
  if (!mol) return null;
  return (
    <group ref={ref} position={[0, -0.4, 0]} scale={0.01}>
      <Molecule molecule={mol.geometry} />
    </group>
  );
}

export function ReactionPlayer({ reaction }: { reaction: Reaction }) {
  const [mol, setMol] = useState<ApiMolecule | null>(null);
  const [active, setActive] = useState(false);
  const [show, setShow] = useState(false);
  const [flash, setFlash] = useState(0);
  const timers = useRef<number[]>([]);
  const cfg = FX[reaction.effect];

  useEffect(() => {
    setMol(null);
    fetchMolecule(reaction.right[0]!.f).then(setMol).catch(() => {});
  }, [reaction]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const play = () => {
    timers.current.forEach(clearTimeout);
    setShow(false);
    setActive(true);
    setFlash((f) => f + 1);
    timers.current = [
      window.setTimeout(() => setShow(true), 850),
      window.setTimeout(() => setActive(false), 1700),
    ];
  };

  return (
    <div className="relative h-72 overflow-hidden rounded-lg border bg-card [&>div]:h-full">
      <Canvas dpr={[1, 2]} camera={{ fov: 45, position: [0, 0.6, 6] }} gl={{ antialias: true }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 6, 5]} intensity={120} distance={50} />
        <pointLight position={[-6, -2, -4]} intensity={50} distance={50} color="#8fb6ff" />
        <Beaker />
        <Particles active={active} cfg={cfg} />
        {cfg.flash && <Flash trigger={flash} color={cfg.flash} />}
        <Product mol={mol} show={show} />
        <EffectComposer>
          <Bloom intensity={0.9} luminanceThreshold={0.3} luminanceSmoothing={0.9} mipmapBlur />
        </EffectComposer>
      </Canvas>

      <button
        onClick={play}
        className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-105"
      >
        {show ? '↻' : '▶'} {reaction.effect === 'explosion' ? '💥' : ''}
      </button>
    </div>
  );
}
