import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Molecule, moleculeRadius, type MolGeo } from './Molecule';

export function MoleculeCanvas({ molecule }: { molecule: MolGeo }) {
  const dist = moleculeRadius(molecule) * 2.3 + 2;
  return (
    <div className="mol-canvas">
      <Canvas dpr={[1, 2]} camera={{ fov: 45, position: [0, 0.6, dist] }} gl={{ antialias: true }}>
        <ambientLight intensity={0.55} />
        <pointLight position={[6, 8, 6]} intensity={130} distance={60} />
        <pointLight position={[-8, -3, -6]} intensity={70} distance={60} color="#8fb6ff" />

        <Molecule molecule={molecule} />

        <OrbitControls enablePan={false} autoRotate autoRotateSpeed={1.1} enableDamping />
        <EffectComposer>
          <Bloom intensity={0.4} luminanceThreshold={0.5} luminanceSmoothing={0.9} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
