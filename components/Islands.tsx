'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { projects, type Project } from '@/lib/projects';
import { ship } from '@/lib/shipState';

const NEAR_MARGIN = 16;

function Island({ project, index, visited }: { project: Project; index: number; visited: boolean }) {
  const r = project.radius;
  const hillH = r * 0.9;

  const trees = Array.from({ length: 5 }, (_, k) => {
    const a = k * 1.26 + index;
    const d = r * 0.6;
    return { x: Math.cos(a) * d, z: Math.sin(a) * d, s: 0.8 + ((k * 37 + index * 11) % 10) / 20 };
  });

  return (
    <group position={[project.x, 0, project.z]}>
      {/* sand */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[r, r * 1.25, 2.4, 14]} />
        <meshStandardMaterial color="#e8d9a8" flatShading />
      </mesh>
      {/* hill */}
      <mesh position={[0, 1.4 + hillH / 2, 0]}>
        <coneGeometry args={[r * 0.72, hillH, 8]} />
        <meshStandardMaterial color={project.color} flatShading />
      </mesh>
      {/* trees */}
      {trees.map((t, i) => (
        <group key={i} position={[t.x, 1.4, t.z]} scale={t.s}>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.12, 0.16, 1, 5]} />
            <meshStandardMaterial color="#6b4423" />
          </mesh>
          <mesh position={[0, 1.8, 0]}>
            <coneGeometry args={[0.7, 1.9, 6]} />
            <meshStandardMaterial color="#2f7d4f" flatShading />
          </mesh>
        </group>
      ))}
      {/* beacon: visible from anywhere so you can navigate to it */}
      <mesh position={[0, 16, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 30, 6]} />
        <meshBasicMaterial color={visited ? '#8fe3cf' : '#ffd166'} transparent opacity={visited ? 0.18 : 0.45} fog={false} />
      </mesh>
      <Html center position={[0, hillH + 5, 0]} distanceFactor={28} style={{ pointerEvents: 'none' }}>
        <div className={`island-label${visited ? ' visited' : ''}`}>{project.name}</div>
      </Html>
    </group>
  );
}

export default function Islands({
  onNear,
  visited,
}: {
  onNear: (id: string | null) => void;
  visited: string[];
}) {
  const current = useRef<string | null>(null);

  useFrame(() => {
    let best: string | null = null;
    let bestD = Infinity;
    for (const p of projects) {
      const d = Math.hypot(ship.x - p.x, ship.z - p.z);
      if (d < p.radius + NEAR_MARGIN && d < bestD) {
        best = p.id;
        bestD = d;
      }
    }
    if (best !== current.current) {
      current.current = best;
      onNear(best);
    }
  });

  return (
    <>
      {projects.map((p, i) => (
        <Island key={p.id} project={p} index={i} visited={visited.includes(p.id)} />
      ))}
    </>
  );
}
