'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { FOG_COLOR, FOG_FAR, FOG_NEAR, ship } from '@/lib/shipState';

const SIZE = 600;
const SEG = 200;
const CELL = SIZE / SEG;

const vertexShader = /* glsl */ `
uniform float uTime;
varying vec3 vWorld;
varying float vHeight;

float wave(vec2 p, float t) {
  float big = sin(p.x * 0.05 + t * 0.8) * 0.6
            + sin(p.y * 0.07 + t * 0.6) * 0.4
            + sin((p.x + p.y) * 0.11 + t * 1.3) * 0.2;
  float small = sin(p.x * 0.35 + t * 1.8) * 0.08
              + sin(p.y * 0.40 - t * 1.5) * 0.08;
  return big + small;
}

void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  float h = wave(w.xz, uTime);
  w.y += h;
  vHeight = h;
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;

const fragmentShader = /* glsl */ `
uniform vec3 uDeep;
uniform vec3 uShallow;
uniform vec3 uFog;
uniform float uFogNear;
uniform float uFogFar;
varying vec3 vWorld;
varying float vHeight;

void main() {
  vec3 n = normalize(cross(dFdx(vWorld), dFdy(vWorld)));
  if (n.y < 0.0) n = -n;
  vec3 V = normalize(cameraPosition - vWorld);
  vec3 L = normalize(vec3(0.4, 0.8, 0.3));

  vec3 col = mix(uDeep, uShallow, smoothstep(-1.0, 1.0, vHeight));
  col += max(dot(n, L), 0.0) * 0.15;

  vec3 H = normalize(L + V);
  col += pow(max(dot(n, H), 0.0), 90.0) * 0.6;

  float fres = pow(1.0 - max(dot(n, V), 0.0), 3.0);
  col = mix(col, uFog, fres * 0.35);

  float d = distance(vWorld, cameraPosition);
  col = mix(col, uFog, smoothstep(uFogNear, uFogFar, d));

  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}
`;

export default function Ocean() {
  const mesh = useRef<THREE.Mesh>(null!);
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(SIZE, SIZE, SEG, SEG);
    g.rotateX(-Math.PI / 2);
    return g;
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDeep: { value: new THREE.Color('#0b4f7a') },
      uShallow: { value: new THREE.Color('#2fa4c7') },
      uFog: { value: new THREE.Color(FOG_COLOR) },
      uFogNear: { value: FOG_NEAR },
      uFogFar: { value: FOG_FAR },
    }),
    [],
  );

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    // Follow the ship, snapped to the grid so vertices never "swim".
    mesh.current.position.x = Math.round(ship.x / CELL) * CELL;
    mesh.current.position.z = Math.round(ship.z / CELL) * CELL;
  });

  return (
    <mesh ref={mesh} geometry={geometry} frustumCulled={false}>
      <shaderMaterial uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} />
    </mesh>
  );
}
