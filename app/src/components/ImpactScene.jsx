import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  OrbitControls,
  Preload,
  RoundedBox,
} from "@react-three/drei";
import * as THREE from "three";

function Blade({ side = 1 }) {
  const group = useRef();
  const baseRotation = side === 1 ? 2.42 : -0.72;

  useFrame((state) => {
    const wave = Math.sin(state.clock.elapsedTime * 1.15 + side) * 0.035;
    group.current.rotation.z = baseRotation + wave;
  });

  return (
    <group
      ref={group}
      position={[side * 1.15, side * -0.12, side * 0.12]}
      rotation={[side * 0.28, side * -0.18, baseRotation]}
    >
      <RoundedBox args={[2.2, 0.16, 0.1]} radius={0.055} smoothness={4}>
        <meshStandardMaterial
          color={side === 1 ? "#f4f0e8" : "#b9bdc4"}
          metalness={0.92}
          roughness={0.2}
        />
      </RoundedBox>
      <mesh position={[1.18, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.13, 0.35, 4]} />
        <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.16} />
      </mesh>
      <RoundedBox args={[0.13, 0.6, 0.16]} radius={0.04} position={[-1.08, 0, 0]}>
        <meshStandardMaterial color="#ef493e" metalness={0.35} roughness={0.4} />
      </RoundedBox>
      <RoundedBox args={[0.58, 0.14, 0.14]} radius={0.045} position={[-1.38, 0, 0]}>
        <meshStandardMaterial color="#292b30" metalness={0.65} roughness={0.33} />
      </RoundedBox>
    </group>
  );
}

function Sparks() {
  const sparks = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => {
        const angle = (index / 18) * Math.PI * 2;
        const distance = 0.75 + ((index * 37) % 10) * 0.085;
        return {
          key: index,
          position: [
            Math.cos(angle) * distance,
            Math.sin(angle) * distance,
            ((index % 5) - 2) * 0.11,
          ],
          rotation: [angle * 0.5, angle, angle * 0.25],
          scale: 0.035 + (index % 4) * 0.012,
        };
      }),
    [],
  );

  return sparks.map((spark) => (
    <Float
      key={spark.key}
      speed={1.2 + (spark.key % 4) * 0.22}
      rotationIntensity={1.4}
      floatIntensity={0.45}
    >
      <mesh
        position={spark.position}
        rotation={spark.rotation}
        scale={spark.scale}
      >
        <tetrahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={spark.key % 3 === 0 ? "#fff5e8" : "#f1493d"}
          emissive={spark.key % 3 === 0 ? "#5a1a14" : "#a3130a"}
          emissiveIntensity={1.4}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>
    </Float>
  ));
}

function ImpactCore() {
  const core = useRef();
  const rings = useRef();

  useFrame((state, delta) => {
    core.current.rotation.x += delta * 0.24;
    core.current.rotation.y += delta * 0.38;
    rings.current.rotation.z -= delta * 0.08;
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.2) * 0.045;
    core.current.scale.setScalar(pulse);
  });

  return (
    <group>
      <mesh ref={core}>
        <icosahedronGeometry args={[0.44, 1]} />
        <meshPhysicalMaterial
          color="#ef3f34"
          emissive="#7b0d08"
          emissiveIntensity={1.7}
          metalness={0.25}
          roughness={0.15}
          clearcoat={1}
          clearcoatRoughness={0.08}
        />
      </mesh>
      <group ref={rings} rotation={[0.82, 0.22, 0]}>
        <mesh>
          <torusGeometry args={[0.78, 0.012, 8, 96]} />
          <meshBasicMaterial color="#ef665c" transparent opacity={0.85} />
        </mesh>
        <mesh rotation={[1.15, 0.5, 0.35]}>
          <torusGeometry args={[1.06, 0.009, 8, 96]} />
          <meshBasicMaterial color="#f2eee7" transparent opacity={0.42} />
        </mesh>
      </group>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[4, 5, 6]} intensity={3.2} color="#fff5ea" />
      <pointLight position={[0, 0.2, 2]} intensity={14} distance={7} color="#ff493f" />
      <pointLight position={[-3, -2, -1]} intensity={5} distance={8} color="#6c7280" />
      <hemisphereLight args={["#dce2ed", "#191114", 1.25]} />
      <Float speed={1.05} rotationIntensity={0.1} floatIntensity={0.24}>
        <group rotation={[-0.12, 0.32, 0]} scale={1.02}>
          <Blade side={-1} />
          <Blade side={1} />
          <ImpactCore />
          <Sparks />
        </group>
      </Float>
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={(Math.PI * 2) / 3}
        autoRotate
        autoRotateSpeed={0.42}
      />
      <Preload all />
    </>
  );
}

export default function ImpactScene() {
  return (
    <Canvas
      camera={{ position: [0, 0.1, 5.7], fov: 38 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
      fallback={<div className="scene-fallback">Interactive 3D preview</div>}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
