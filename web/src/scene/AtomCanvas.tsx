import { useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import type { Element } from '@chemverse/shared';
import { Atom, type AtomMode } from './Atom';
import { nucleusRadius, cameraDistance } from './atom-layout';

/** Подгоняет дистанцию камеры под размер текущего атома. */
function CameraRig({ dist }: { dist: number }) {
  const camera = useThree((s) => s.camera);
  useEffect(() => {
    camera.position.set(0, 0.4, dist);
    camera.updateProjectionMatrix();
  }, [dist, camera]);
  return null;
}

export function AtomCanvas({ element, mode = 'bohr' }: { element: Element; mode?: AtomMode }) {
  const nucleusR = nucleusRadius(element.z + element.neutrons);
  const dist = cameraDistance(element.shells.length, nucleusR);

  return (
    <div className="atom-canvas">
      <Canvas dpr={[1, 2]} camera={{ fov: 45, position: [0, 0.4, dist] }} gl={{ antialias: true }}>
        <CameraRig dist={dist} />
        <ambientLight intensity={0.5} />
        <pointLight position={[6, 8, 6]} intensity={120} distance={60} />
        <pointLight position={[-8, -4, -6]} intensity={60} distance={60} color="#8fb6ff" />

        <Atom element={element} mode={mode} />

        <OrbitControls
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.7}
          minDistance={2}
          maxDistance={dist * 2.2}
          enableDamping
        />
        <EffectComposer>
          <Bloom intensity={0.45} luminanceThreshold={0.6} luminanceSmoothing={0.9} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
