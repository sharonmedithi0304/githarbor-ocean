'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { getThrottle, getTurn, ship, waveHeight } from '@/lib/shipState';
import { projects } from '@/lib/projects';

const MAX_SPEED = 14;
const MAX_REVERSE = 4;
const TURN_RATE = 1.1;
const SHIP_RADIUS = 2.5;

export default function Ship() {
  const group = useRef<THREE.Group>(null!);
  const camera = useThree((s) => s.camera);
  const camReady = useRef(false);
  const desired = useRef(new THREE.Vector3());
  const look = useRef(new THREE.Vector3());

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const t = state.clock.elapsedTime;
    const throttle = getThrottle();
    const turn = getTurn();

    // Speed: ease toward target, coast when no input.
    const target = throttle > 0 ? throttle * MAX_SPEED : throttle * MAX_REVERSE;
    const k = throttle === 0 ? 0.6 : 1.2;
    ship.speed += (target - ship.speed) * Math.min(1, dt * k);

    // Steering: needs some way on; inverted when reversing.
    const steer = Math.min(1, 0.35 + Math.abs(ship.speed) / MAX_SPEED);
    const dir = ship.speed < -0.5 ? -1 : 1;
    ship.heading += turn * TURN_RATE * steer * dir * dt;

    const fx = -Math.sin(ship.heading);
    const fz = -Math.cos(ship.heading);
    ship.x += fx * ship.speed * dt;
    ship.z += fz * ship.speed * dt;

    // Island collision: push the ship back out.
    for (const p of projects) {
      const dx = ship.x - p.x;
      const dz = ship.z - p.z;
      const d = Math.hypot(dx, dz) || 0.0001;
      const min = p.radius + SHIP_RADIUS;
      if (d < min) {
        ship.x += (dx / d) * (min - d);
        ship.z += (dz / d) * (min - d);
        ship.speed *= 0.92;
      }
    }

    // Bob on the waves: sample heights fore/aft and port/starboard.
    const rx = Math.cos(ship.heading);
    const rz = -Math.sin(ship.heading);
    const h = waveHeight(ship.x, ship.z, t);
    const hF = waveHeight(ship.x + fx * 2, ship.z + fz * 2, t);
    const hB = waveHeight(ship.x - fx * 2, ship.z - fz * 2, t);
    const hR = waveHeight(ship.x + rx * 1.2, ship.z + rz * 1.2, t);
    const hL = waveHeight(ship.x - rx * 1.2, ship.z - rz * 1.2, t);
    const pitch = Math.atan2(hF - hB, 4) * 0.8;
    const roll = Math.atan2(hR - hL, 2.4) * 0.8;

    const g = group.current;
    g.position.set(ship.x, h + 0.2, ship.z);
    g.rotation.order = 'YXZ';
    g.rotation.set(pitch, ship.heading, roll);

    // Chase camera.
    desired.current.set(ship.x - fx * 13, 6.5, ship.z - fz * 13);
    look.current.set(ship.x + fx * 8, 1.5, ship.z + fz * 8);
    if (!camReady.current) {
      camera.position.copy(desired.current);
      camReady.current = true;
    } else {
      camera.position.lerp(desired.current, 1 - Math.exp(-dt * 3));
    }
    camera.lookAt(look.current);
  });

  return (
    <group ref={group}>
      {/* hull */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[2.2, 0.9, 5]} />
        <meshStandardMaterial color="#7a4a2b" flatShading />
      </mesh>
      {/* bow */}
      <mesh position={[0, 0.2, -3.6]} rotation={[-Math.PI / 2, Math.PI / 4, 0]} scale={[1, 1, 0.41]}>
        <coneGeometry args={[1.556, 2.2, 4]} />
        <meshStandardMaterial color="#7a4a2b" flatShading />
      </mesh>
      {/* deck */}
      <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={[1.9, 0.1, 5]} />
        <meshStandardMaterial color="#c8935a" flatShading />
      </mesh>
      {/* mast */}
      <mesh position={[0, 3.6, -0.5]}>
        <cylinderGeometry args={[0.08, 0.1, 6, 6]} />
        <meshStandardMaterial color="#5b3a22" />
      </mesh>
      {/* yard */}
      <mesh position={[0, 5.5, -0.5]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 3.8, 6]} />
        <meshStandardMaterial color="#5b3a22" />
      </mesh>
      {/* sail */}
      <mesh position={[0, 3.8, -0.45]}>
        <planeGeometry args={[3.4, 3.3]} />
        <meshStandardMaterial color="#f4efe6" side={THREE.DoubleSide} />
      </mesh>
      {/* pennant */}
      <mesh position={[0.35, 6.55, -0.5]}>
        <boxGeometry args={[0.7, 0.35, 0.04]} />
        <meshStandardMaterial color="#ff9f1c" emissive="#ff9f1c" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}
