import { useMemo, useRef } from 'react';
import type { MutableRefObject } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { byZ } from '@chemverse/shared';
import { nucleonLayout } from '../scene/atom-layout';
import { useI18n } from '../i18n';
import { LanguageSwitcher } from '../i18n/LanguageSwitcher';

const CARBON = byZ.get(6)!; // углерод: Z=6, 6 нейтронов, оболочки [2,4]
const LEVELS = 5;
const W = 1 / LEVELS;

const easeIO = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

// плавный «горб» видимости вокруг центра уровня → мягкий crossfade между соседями
function bump(p: number, center: number, half: number) {
  const d = Math.abs(p - center) / half;
  return d >= 1 ? 0 : Math.pow(Math.cos((d * Math.PI) / 2), 2);
}

// ---------- решётка алмаза (чистая геометрия, без текстур) ----------
function buildDiamond(R: number) {
  const basis = [
    [0, 0, 0], [0, 0.5, 0.5], [0.5, 0, 0.5], [0.5, 0.5, 0],
    [0.25, 0.25, 0.25], [0.25, 0.75, 0.75], [0.75, 0.25, 0.75], [0.75, 0.75, 0.25],
  ];
  const seen = new Set<string>();
  const atoms: THREE.Vector3[] = [];
  for (let i = -1; i <= 2; i++)
    for (let j = -1; j <= 2; j++)
      for (let k = -1; k <= 2; k++)
        for (const b of basis) {
          const v = new THREE.Vector3(b[0]! + i - 0.5, b[1]! + j - 0.5, b[2]! + k - 0.5);
          if (v.length() > R) continue;
          const key = v.toArray().map((x) => x.toFixed(2)).join(',');
          if (seen.has(key)) continue;
          seen.add(key);
          atoms.push(v);
        }
  const bl = Math.sqrt(3) / 4;
  const bonds: [THREE.Vector3, THREE.Vector3][] = [];
  for (let a = 0; a < atoms.length; a++)
    for (let b = a + 1; b < atoms.length; b++)
      if (Math.abs(atoms[a]!.distanceTo(atoms[b]!) - bl) < 0.05) bonds.push([atoms[a]!, atoms[b]!]);
  return { atoms, bonds };
}

function Bond({ a, b, r = 0.028, color = '#7d8597' }: { a: THREE.Vector3; b: THREE.Vector3; r?: number; color?: string }) {
  const { pos, quat, len } = useMemo(() => {
    const dir = new THREE.Vector3().subVectors(b, a);
    const len = dir.length();
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    const pos = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
    return { pos, quat, len };
  }, [a, b]);
  return (
    <mesh position={pos} quaternion={quat}>
      <cylinderGeometry args={[r, r, len, 10]} />
      <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} transparent />
    </mesh>
  );
}

// 1 — бриллиант (огранка: павильон-конус + корона-усечённый конус, 8 граней)
function GemLevel() {
  const pav = useMemo(() => new THREE.ConeGeometry(1, 1.5, 8), []);
  const crown = useMemo(() => new THREE.CylinderGeometry(0.45, 1, 0.5, 8), []);
  const pavEdges = useMemo(() => new THREE.EdgesGeometry(pav), [pav]);
  const crownEdges = useMemo(() => new THREE.EdgesGeometry(crown), [crown]);
  return (
    <group position={[0, 0.22, 0]} scale={0.6}>
      {/* павильон (низ, остриём вниз) */}
      <mesh geometry={pav} rotation={[Math.PI, 0, 0]} position={[0, -0.75, 0]}>
        <meshStandardMaterial color="#dff3ff" metalness={0.35} roughness={0.03} flatShading transparent emissive="#2a6fc0" emissiveIntensity={0.14} />
      </mesh>
      <lineSegments geometry={pavEdges} rotation={[Math.PI, 0, 0]} position={[0, -0.75, 0]}>
        <lineBasicMaterial color="#bff0ff" transparent opacity={0.8} />
      </lineSegments>
      {/* корона (верх, стол сверху) */}
      <mesh geometry={crown} position={[0, 0.25, 0]}>
        <meshStandardMaterial color="#dff3ff" metalness={0.35} roughness={0.03} flatShading transparent emissive="#2a6fc0" emissiveIntensity={0.14} />
      </mesh>
      <lineSegments geometry={crownEdges} position={[0, 0.25, 0]}>
        <lineBasicMaterial color="#bff0ff" transparent opacity={0.8} />
      </lineSegments>
    </group>
  );
}

// 2 — кристаллическая решётка углерода (ball-and-stick)
function LatticeLevel() {
  const { atoms, bonds } = useMemo(() => buildDiamond(1.25), []);
  return (
    <group>
      {atoms.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.1, 20, 20]} />
          <meshStandardMaterial color="#cfd6e4" roughness={0.35} metalness={0.15} transparent emissive="#26406b" emissiveIntensity={0.15} />
        </mesh>
      ))}
      {bonds.map(([a, b], i) => (
        <Bond key={i} a={a} b={b} />
      ))}
    </group>
  );
}

// 3 — атом углерода в решётке (центр + 4 тетраэдрические связи)
function AtomLevel() {
  const dirs = useMemo(
    () => [new THREE.Vector3(1, 1, 1), new THREE.Vector3(1, -1, -1), new THREE.Vector3(-1, 1, -1), new THREE.Vector3(-1, -1, 1)].map((d) => d.normalize().multiplyScalar(1.15)),
    [],
  );
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial color="#dfe6f2" roughness={0.3} metalness={0.2} transparent emissive="#2a4a7a" emissiveIntensity={0.12} />
      </mesh>
      {dirs.map((d, i) => (
        <group key={i}>
          <Bond a={new THREE.Vector3(0, 0, 0)} b={d} r={0.05} color="#8b93a6" />
          <mesh position={d}>
            <sphereGeometry args={[0.26, 24, 24]} />
            <meshStandardMaterial color="#aeb7c9" roughness={0.4} transparent opacity={0.85} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// одна электронная оболочка: наклонённое кольцо + электроны, бегущие по нему
function Shell({ radius, count, tilt, speed }: { radius: number; count: number; tilt: [number, number, number]; speed: number }) {
  const spin = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (spin.current) spin.current.rotation.z = s.clock.elapsedTime * speed;
  });
  return (
    <group rotation={tilt}>
      <mesh>
        <torusGeometry args={[radius, 0.016, 12, 96]} />
        <meshBasicMaterial color="#36e3ff" transparent opacity={0.6} />
      </mesh>
      <group ref={spin}>
        {Array.from({ length: count }, (_, i) => {
          const a = (i / count) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * radius, Math.sin(a) * radius, 0]}>
              <sphereGeometry args={[0.08, 18, 18]} />
              <meshBasicMaterial color="#9be9ff" />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

// 4 — электронные оболочки (ядро + наклонённые кольца + электроны), углерод [2,4]
function ShellsLevel() {
  return (
    <group>
      <mesh userData={{ keepOpaque: true }}>
        <sphereGeometry args={[0.38, 32, 32]} />
        <meshStandardMaterial color="#ff7a7a" emissive="#ff4040" emissiveIntensity={0.7} roughness={0.4} />
      </mesh>
      <Shell radius={0.85} count={2} tilt={[1.05, 0, 0]} speed={0.9} />
      <Shell radius={1.5} count={4} tilt={[1.05, 0, 1.15]} speed={-0.55} />
    </group>
  );
}

// 5 — ядро (6 протонов + 6 нейтронов)
function NucleusLevel() {
  const { protonPos, neutronPos, radius } = useMemo(() => nucleonLayout(CARBON.z, CARBON.neutrons), []);
  const total = CARBON.z + CARBON.neutrons;
  const nR = (radius / Math.cbrt(total)) * 0.66;
  const scale = 1.25 / radius;
  return (
    <group scale={scale}>
      {protonPos.map((p, i) => (
        <mesh key={`p${i}`} position={p}>
          <sphereGeometry args={[nR, 20, 20]} />
          <meshStandardMaterial color="#ff5a5a" emissive="#ff3a3a" emissiveIntensity={0.5} roughness={0.4} transparent />
        </mesh>
      ))}
      {neutronPos.map((p, i) => (
        <mesh key={`n${i}`} position={p}>
          <sphereGeometry args={[nR, 20, 20]} />
          <meshStandardMaterial color="#aab2c0" emissive="#aab2c0" emissiveIntensity={0.2} roughness={0.5} transparent />
        </mesh>
      ))}
    </group>
  );
}

const STAGES = [GemLevel, LatticeLevel, AtomLevel, ShellsLevel, NucleusLevel];

function ZoomController({
  target,
  onStep,
}: {
  target: MutableRefObject<number>;
  onStep: (i: number) => void;
}) {
  const prog = useRef(target.current);
  const refs = [useRef<THREE.Group>(null), useRef<THREE.Group>(null), useRef<THREE.Group>(null), useRef<THREE.Group>(null), useRef<THREE.Group>(null)];
  const step = useRef(-1);

  useFrame((_, delta) => {
    prog.current += (target.current - prog.current) * Math.min(1, delta * 5);
    const P = prog.current;
    for (let i = 0; i < LEVELS; i++) {
      const g = refs[i]!.current;
      if (!g) continue;
      const center = (i + 0.5) * W;
      const op = bump(P, center, 0.13);
      if (op <= 0.01) {
        g.visible = false;
        continue;
      }
      g.visible = true;
      const grow = clamp01((P - (center - 0.18)) / 0.36);
      const sc = 0.7 + easeIO(grow) * 4.6;
      g.scale.setScalar(sc);
      g.traverse((o) => {
        if (o.userData?.keepOpaque) return; // ядро всегда непрозрачное → корректная глубина
        const m = (o as THREE.Mesh).material as THREE.Material | undefined;
        if (m && 'opacity' in m) {
          m.transparent = true;
          (m as THREE.MeshStandardMaterial).opacity = op;
          m.depthWrite = op > 0.85;
        }
      });
    }
    const cur = Math.max(0, Math.min(LEVELS - 1, Math.round(P / W - 0.5)));
    if (cur !== step.current) {
      step.current = cur;
      onStep(cur);
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 6, 8]} intensity={2.2} />
      <pointLight position={[-6, -3, 4]} intensity={45} distance={40} color="#7fb0ff" />
      <pointLight position={[5, -2, 3]} intensity={35} distance={36} color="#ff5ad0" />
      <pointLight position={[0, 5, 5]} intensity={30} distance={36} color="#ffffff" />
      <OrbitControls makeDefault enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} rotateSpeed={0.7} />
      {STAGES.map((Stage, i) => (
        <group key={i} ref={refs[i]} visible={false}>
          <Stage />
        </group>
      ))}
      <EffectComposer>
        <Bloom intensity={0.85} luminanceThreshold={0.35} luminanceSmoothing={0.9} mipmapBlur />
      </EffectComposer>
    </>
  );
}

export function LandingPage() {
  const { t } = useI18n();
  const target = useRef(0.1);
  const captionRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const captions = [t.zoomDiamond, t.zoomLattice, t.zoomAtom, t.zoomShells, t.zoomNucleus];

  const onStep = (i: number) => {
    if (captionRef.current) captionRef.current.textContent = captions[i] ?? '';
    if (dotsRef.current)
      Array.from(dotsRef.current.children).forEach((d, k) => {
        (d as HTMLElement).style.backgroundColor = k === i ? 'var(--foreground)' : 'transparent';
      });
    if (fadeRef.current) {
      fadeRef.current.style.opacity = i > 0 ? '0' : '1';
      fadeRef.current.style.pointerEvents = i > 0 ? 'none' : 'auto';
    }
  };

  const onWheel = (e: React.WheelEvent) => {
    target.current = clamp01(target.current + e.deltaY * 0.0006);
  };

  return (
    <div className="relative h-screen overflow-hidden bg-background" onWheel={onWheel}>
      <div className="absolute inset-0">
        <Canvas dpr={[1, 2]} camera={{ fov: 50, position: [0, 0, 7] }} gl={{ antialias: true }}>
          <ZoomController target={target} onStep={onStep} />
        </Canvas>
      </div>

      <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-6 py-4">
        <div className="text-lg font-bold tracking-tight">
          CHEM<span className="text-muted-foreground">VERSE</span>
        </div>
        <LanguageSwitcher />
      </header>

      <div
        ref={captionRef}
        className="absolute inset-x-0 top-24 z-10 text-center text-sm font-medium tracking-wide text-foreground/80"
      >
        {t.zoomDiamond}
      </div>

      <div ref={dotsRef} className="absolute right-6 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-2.5">
        {captions.map((c, i) => (
          <button
            key={i}
            title={c}
            style={{ backgroundColor: i === 0 ? 'var(--foreground)' : 'transparent' }}
            onClick={() => {
              target.current = (i + 0.5) * W;
            }}
            className="size-2.5 rounded-full border border-foreground/50 transition-colors"
          />
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-[8vh] z-10 flex flex-col items-center px-4 text-center">
        <div ref={fadeRef} className="flex flex-col items-center transition-opacity duration-500">
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">{t.heroTitle}</h1>
          <p className="mt-3 max-w-md text-sm text-muted-foreground md:text-base">{t.heroSubtitle}</p>
        </div>
        <Button asChild size="lg" className="mt-7 rounded-full px-8">
          <Link to="/login">{t.start} →</Link>
        </Button>
        <div className="mt-4 animate-pulse text-xs text-muted-foreground">{t.scrollHint} ↕</div>
      </div>
    </div>
  );
}
