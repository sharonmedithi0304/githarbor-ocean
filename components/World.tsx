'use client';

import { useCallback, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Ocean from './Ocean';
import Ship from './Ship';
import Islands from './Islands';
import Hud from './Hud';
import { projects } from '@/lib/projects';
import { FOG_COLOR, FOG_FAR, FOG_NEAR, input } from '@/lib/shipState';

function useKeyboard() {
  useEffect(() => {
    const down = new Set<string>();
    const update = () => {
      input.keyThrottle = (down.has('w') || down.has('arrowup') ? 1 : 0) - (down.has('s') || down.has('arrowdown') ? 1 : 0);
      input.keyTurn = (down.has('a') || down.has('arrowleft') ? 1 : 0) - (down.has('d') || down.has('arrowright') ? 1 : 0);
    };
    const onDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k.startsWith('arrow')) e.preventDefault();
      down.add(k);
      update();
    };
    const onUp = (e: KeyboardEvent) => {
      down.delete(e.key.toLowerCase());
      update();
    };
    const onBlur = () => {
      down.clear();
      update();
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      window.removeEventListener('blur', onBlur);
    };
  }, []);
}

export default function World() {
  const [near, setNear] = useState<string | null>(null);
  const [visited, setVisited] = useState<string[]>([]);
  useKeyboard();

  const handleNear = useCallback((id: string | null) => {
    setNear(id);
    if (id) setVisited((v) => (v.includes(id) ? v : [...v, id]));
  }, []);

  return (
    <div className="stage">
      <Canvas camera={{ fov: 60, near: 0.5, far: 1200, position: [0, 6.5, 13] }} dpr={[1, 2]}>
        <color attach="background" args={[FOG_COLOR]} />
        <fog attach="fog" args={[FOG_COLOR, FOG_NEAR, FOG_FAR]} />
        <hemisphereLight args={['#dff3ff', '#2a6f97', 0.9]} />
        <directionalLight position={[40, 60, 20]} intensity={1.4} />
        <Ocean />
        <Ship />
        <Islands onNear={handleNear} visited={visited} />
      </Canvas>
      <Hud near={near} discovered={visited.length} total={projects.length} />
    </div>
  );
}
