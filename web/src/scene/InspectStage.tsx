import { useEffect, useRef, useState } from 'react';
import type { MutableRefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import type { Element } from '@chemverse/shared';
import { spectrumOf } from '@chemverse/shared';
import { Atom, type AtomMode } from './Atom';
import { nucleusRadius, cameraDistance } from './atom-layout';
import { handsBus, gestureModeBus } from '../input/handsBus';
import { useI18n } from '../i18n';

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const ease = (k: number, dt: number) => 1 - Math.exp(-k * dt);
const ELECTRON = '#36e3ff';
const ZOOM_MIN = 0.3;
const ZOOM_MAX = 4.5;
const ROT_K = Math.PI * 3; // свайп через экран за секунду ≈ полтора оборота
const FRICTION = 1.6; // трение инерции, 1/с

/** Действия сцены, доступные кнопкам HUD. */
export interface AtomActions {
  excite: () => void;
  reset: () => void;
  setExplode: (on: boolean) => void;
}

/**
 * Жесты атома — конечный автомат вокруг ОДНОГО жеста-щипка (принцип Vision Pro):
 *   idle   — нейтраль: любая поза руки без щипка НИЧЕГО не делает
 *   rotate — щипок + движение: трекбол с инерцией (отпустил — крутится)
 *   two    — два щипка: относительный зум (от дистанции в момент захвата) + поворот Z
 * Вход в режим — ТОЛЬКО по фронту «щипок сомкнулся», выход — «разомкнулся».
 * Дискретные действия (возбуждение, оболочки, сброс) — кнопки HUD, не жесты.
 */
function HandControlledAtom({
  element,
  mode,
  onFlash,
  actionsRef,
}: {
  element: Element;
  mode: AtomMode;
  onFlash: (nm: number | null) => void;
  actionsRef: MutableRefObject<AtomActions | null>;
}) {
  const rotRef = useRef<THREE.Group>(null);
  const zoomRef = useRef<THREE.Group>(null);
  const exciteRef = useRef<THREE.Mesh>(null);
  const flashRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const photonRef = useRef<THREE.Mesh>(null);
  const explodeRef = useRef(0);

  const spectrum = spectrumOf(element.symbol);
  const flashColor = spectrum?.color ?? ELECTRON;
  const topNm = spectrum?.lines[0]?.nm ?? null;

  const st = useRef({
    mode: 'idle' as 'idle' | 'rotate' | 'two',
    prevPinches: 0,
    // rotate: последняя точка руки + накопленное время между сэмплами (руки ~30fps)
    drag: null as null | { x: number; y: number; dt: number },
    wx: 0, wy: 0, wz: 0,
    // two: база относительного зума
    twoBaseDist: 1, twoBaseZoom: 1, twoAngle: 0,
    zoom: 1, zoomTarget: 1,
    explodeTarget: 0,
    // возбуждение и вспышка
    exc: null as null | { mesh: THREE.Mesh; from: THREE.Vector3; dir: THREE.Vector3; phase: 'out' | 'hold' | 'back'; t: number },
    flash: 0,
    photon: null as null | { vel: THREE.Vector3; life: number },
    resetting: false,
    electrons: null as null | THREE.Mesh[],
  });

  const v3 = useRef({ b: new THREE.Vector3() }).current;

  const electronMeshes = (): THREE.Mesh[] => {
    const s = st.current;
    if (!s.electrons) {
      const out: THREE.Mesh[] = [];
      rotRef.current?.traverse((o) => {
        if ((o as THREE.Mesh).isMesh && o.name.startsWith('electron-')) out.push(o as THREE.Mesh);
      });
      s.electrons = out.length ? out : null;
    }
    return (s.electrons ?? []).filter((m) => m.visible);
  };
  // действия для кнопок HUD
  useEffect(() => {
    const s = st.current;
    actionsRef.current = {
      excite: () => {
        if (s.exc || mode !== 'bohr') return;
        const meshes = electronMeshes();
        const m = meshes[Math.floor(Math.random() * meshes.length)];
        const g = rotRef.current;
        if (!m || !g) return;
        const center = g.getWorldPosition(new THREE.Vector3());
        const from = m.getWorldPosition(new THREE.Vector3());
        s.exc = { mesh: m, from, dir: from.clone().sub(center).normalize(), phase: 'out', t: 0 };
        m.visible = false;
      },
      reset: () => {
        s.wx = 0; s.wy = 0; s.wz = 0;
        s.zoomTarget = 1;
        s.explodeTarget = 0;
        s.resetting = true;
      },
      setExplode: (on: boolean) => {
        s.explodeTarget = on ? 1 : 0;
      },
    };
    return () => { actionsRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, element.z]);

  useFrame((_, delta) => {
    const g = rotRef.current;
    if (!g) return;
    const s = st.current;
    const hands = handsBus.get();
    const pinched = hands.filter((h) => h.pinch);
    const n = pinched.length;

    // ——— конечный автомат: переходы только по фронтам щипка ———
    if (s.mode === 'idle') {
      if (n >= 2) {
        const [a, b] = pinched;
        s.mode = 'two';
        s.twoBaseDist = Math.max(1e-3, Math.hypot(a!.x - b!.x, a!.y - b!.y));
        s.twoBaseZoom = s.zoomTarget;
        s.twoAngle = Math.atan2(b!.y - a!.y, b!.x - a!.x);
      } else if (n === 1 && s.prevPinches === 0) {
        const h = pinched[0]!;
        s.mode = 'rotate';
        s.drag = { x: h.x, y: h.y, dt: 0 };
      }
    } else if (s.mode === 'rotate') {
      if (n === 0) {
        s.mode = 'idle';
        s.drag = null;
      } else if (n >= 2) {
        const [a, b] = pinched;
        s.mode = 'two';
        s.drag = null;
        s.twoBaseDist = Math.max(1e-3, Math.hypot(a!.x - b!.x, a!.y - b!.y));
        s.twoBaseZoom = s.zoomTarget;
        s.twoAngle = Math.atan2(b!.y - a!.y, b!.x - a!.x);
      } else {
        const h = pinched[0]!;
        if (s.drag) {
          s.drag.dt += delta;
          if (h.x !== s.drag.x || h.y !== s.drag.y) {
            const dt = Math.max(s.drag.dt, 1e-3);
            const twy = ((h.x - s.drag.x) / window.innerWidth / dt) * ROT_K;
            const twx = ((h.y - s.drag.y) / window.innerHeight / dt) * ROT_K;
            const k = ease(18, dt);
            s.wy += (twy - s.wy) * k;
            s.wx += (twx - s.wx) * k;
            s.drag = { x: h.x, y: h.y, dt: 0 };
          }
        }
      }
    } else if (s.mode === 'two') {
      if (n < 2) {
        s.mode = 'idle'; // зум замерзает на текущем значении («сцепление»)
      } else {
        const [a, b] = pinched;
        const d = Math.max(1e-3, Math.hypot(a!.x - b!.x, a!.y - b!.y));
        s.zoomTarget = clamp(s.twoBaseZoom * (d / s.twoBaseDist), ZOOM_MIN, ZOOM_MAX);
        const angle = Math.atan2(b!.y - a!.y, b!.x - a!.x);
        let da = angle - s.twoAngle;
        if (da > Math.PI) da -= 2 * Math.PI;
        if (da < -Math.PI) da += 2 * Math.PI;
        s.wz += (-da / Math.max(delta, 1e-3) - s.wz) * ease(14, delta);
        s.twoAngle = angle;
      }
    }
    s.prevPinches = n;

    // индикатор режима на курсоре
    gestureModeBus.set(s.mode === 'rotate' ? '⟳' : s.mode === 'two' ? '⤢' : '');

    // ——— возбуждение: прыжок электрона и фотон ———
    if (s.exc && exciteRef.current) {
      const e = s.exc;
      e.t += delta;
      const el = exciteRef.current;
      el.visible = true;
      const OUT = 0.28, HOLD = 0.12, BACK = 0.3, JUMP = 1.8;
      if (e.phase === 'out') {
        const k = clamp(e.t / OUT, 0, 1);
        const easeK = 1 - (1 - k) * (1 - k);
        el.position.copy(e.from).addScaledVector(e.dir, easeK * JUMP);
        if (k >= 1) { e.phase = 'hold'; e.t = 0; }
      } else if (e.phase === 'hold') {
        el.position.copy(e.from).addScaledVector(e.dir, JUMP);
        if (e.t >= HOLD) { e.phase = 'back'; e.t = 0; }
      } else {
        const target = e.mesh.getWorldPosition(v3.b);
        const k = clamp(e.t / BACK, 0, 1);
        el.position.lerp(target, ease(12 + k * 20, delta));
        if (k >= 1) {
          e.mesh.visible = true;
          el.visible = false;
          s.flash = 1;
          flashRef.current?.position.copy(target);
          flashRef.current?.scale.setScalar(0.12);
          lightRef.current?.position.copy(target);
          if (photonRef.current) {
            photonRef.current.position.copy(target);
            photonRef.current.visible = true;
          }
          s.photon = { vel: e.dir.clone().multiplyScalar(8), life: 1.1 };
          onFlash(topNm);
          s.exc = null;
        }
      }
    }

    // ——— затухание вспышки и полёт фотона ———
    if (s.flash > 0 && flashRef.current && lightRef.current) {
      s.flash = Math.max(0, s.flash - delta * 2.2);
      flashRef.current.visible = s.flash > 0;
      flashRef.current.scale.addScalar(delta * 7);
      (flashRef.current.material as THREE.MeshBasicMaterial).opacity = s.flash * 0.85;
      lightRef.current.intensity = s.flash * 90;
    }
    if (s.photon && photonRef.current) {
      s.photon.life -= delta;
      photonRef.current.position.addScaledVector(s.photon.vel, delta);
      (photonRef.current.material as THREE.MeshBasicMaterial).opacity = clamp(s.photon.life, 0, 1);
      if (s.photon.life <= 0) { photonRef.current.visible = false; s.photon = null; }
    }

    // ——— инерция, трение, сброс ———
    const fr = Math.exp(-FRICTION * delta);
    s.wx *= fr; s.wy *= fr; s.wz *= fr;
    g.rotation.y += s.wy * delta;
    g.rotation.x += s.wx * delta;
    g.rotation.z += s.wz * delta;
    if (Math.abs(g.rotation.x) > 1.3) {
      g.rotation.x += (Math.sign(g.rotation.x) * 1.3 - g.rotation.x) * ease(6, delta);
      s.wx *= Math.exp(-4 * delta);
    }
    if (s.resetting) {
      g.rotation.x += (0 - g.rotation.x) * ease(6, delta);
      g.rotation.z += (0 - g.rotation.z) * ease(6, delta);
      if (Math.abs(g.rotation.x) < 0.01 && Math.abs(g.rotation.z) < 0.01) s.resetting = false;
    }

    explodeRef.current += (s.explodeTarget - explodeRef.current) * ease(9, delta);
    s.zoom += (s.zoomTarget - s.zoom) * ease(8, delta);
    zoomRef.current?.scale.setScalar(s.zoom);
  });

  // при уходе со сцены — очистить индикатор режима
  useEffect(() => () => gestureModeBus.set(''), []);

  return (
    <>
      <group ref={zoomRef}>
        <group ref={rotRef}>
          <Atom element={element} mode={mode} explodeRef={explodeRef} />
        </group>
      </group>
      {/* мировые эффекты (не вращаются вместе с атомом) */}
      <mesh ref={exciteRef} visible={false}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={flashColor} emissive={flashColor} emissiveIntensity={1.4} roughness={0.3} />
      </mesh>
      <mesh ref={flashRef} visible={false}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial color={flashColor} transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={photonRef} visible={false}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshBasicMaterial color={flashColor} transparent opacity={1} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <pointLight ref={lightRef} intensity={0} distance={30} color={flashColor} />
    </>
  );
}

export function InspectStage({ element, mode = 'bohr', onClose }: { element: Element; mode?: AtomMode; onClose: () => void }) {
  const { t, locale } = useI18n();
  const dist = cameraDistance(element.shells.length, nucleusRadius(element.z + element.neutrons));
  const [nm, setNm] = useState<number | null>(null);
  const [exploded, setExploded] = useState(false);
  const nmTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const actionsRef = useRef<AtomActions | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    setNm(null);
    setExploded(false);
  }, [element.z]);

  const flash = (wavelength: number | null) => {
    setNm(wavelength);
    if (nmTimer.current) clearTimeout(nmTimer.current);
    nmTimer.current = setTimeout(() => setNm(null), 2000);
  };

  return (
    <div className="inspect-stage">
      <Canvas dpr={[1, 2]} camera={{ fov: 45, position: [0, 0.5, dist] }} gl={{ antialias: true }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[6, 8, 6]} intensity={140} distance={80} />
        <pointLight position={[-8, -4, -6]} intensity={70} distance={80} color="#8fb6ff" />
        <HandControlledAtom key={element.z} element={element} mode={mode} onFlash={flash} actionsRef={actionsRef} />
        <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.6} minDistance={2} maxDistance={dist * 2.4} enableDamping />
        <EffectComposer>
          <Bloom intensity={0.45} luminanceThreshold={0.6} luminanceSmoothing={0.9} mipmapBlur />
        </EffectComposer>
      </Canvas>

      <div className="inspect-head">
        <span className="inspect-sym">{element.symbol}</span>
        <span className="inspect-name">{element.names[locale]}</span>
      </div>
      {nm !== null && <div className="inspect-flash">λ ≈ {Math.round(nm)} nm</div>}

      {/* дискретные действия — честные кнопки (кликаются и мышью, и щипком) */}
      <div className="inspect-actions">
        {mode === 'bohr' && (
          <button onClick={() => actionsRef.current?.excite()} title={t.exciteBtn}>
            ⚡ <span>{t.exciteBtn}</span>
          </button>
        )}
        <button
          className={exploded ? 'active' : ''}
          onClick={() => { const v = !exploded; setExploded(v); actionsRef.current?.setExplode(v); }}
          title={t.shellsBtn}
        >
          ⊞ <span>{t.shellsBtn}</span>
        </button>
        <button onClick={() => { setExploded(false); actionsRef.current?.reset(); }} title={t.resetBtn}>
          ⟲ <span>{t.resetBtn}</span>
        </button>
      </div>

      <div className="inspect-hint">{t.inspectHint}</div>
      <button className="inspect-close" onClick={onClose} aria-label={t.close}>
        ✕
      </button>
    </div>
  );
}
