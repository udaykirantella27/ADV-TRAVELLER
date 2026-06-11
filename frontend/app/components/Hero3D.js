'use client';
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function TerrainGrid() {
  const meshRef = useRef();
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(40, 40, 80, 80);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, Math.sin(x * 0.4) * Math.cos(y * 0.3) * 1.5 + Math.random() * 0.2);
    }
    pos.needsUpdate = true;
    g.computeVertexNormals();
    return g;
  }, []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = clock.elapsedTime * 0.02;
      const pos = meshRef.current.geometry.attributes.position;
      const t = clock.elapsedTime;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        pos.setZ(i, Math.sin(x * 0.4 + t * 0.3) * Math.cos(y * 0.3 + t * 0.2) * 1.5);
      }
      pos.needsUpdate = true;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geo} rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -3, -5]}>
      <meshStandardMaterial color="#FF4500" wireframe transparent opacity={0.08} />
    </mesh>
  );
}

function FloatingParticles() {
  const ref = useRef();
  const count = 200;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.01;
      ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.05) * 0.1;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#FF4500" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

export default function Hero3D() {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
      <Canvas camera={{ position: [0, 2, 10], fov: 60 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} color="#FF4500" />
        <TerrainGrid />
        <FloatingParticles />
        <fog attach="fog" args={['#080808', 8, 25]} />
      </Canvas>
    </div>
  );
}
