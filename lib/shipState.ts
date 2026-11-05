// Shared mutable state read every frame (kept outside React to avoid re-renders).

export const input = {
  keyThrottle: 0,
  keyTurn: 0,
  touchThrottle: 0,
  touchTurn: 0,
};

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** -1..1 (forward positive) */
export const getThrottle = () => clamp(input.keyThrottle + input.touchThrottle, -1, 1);
/** -1..1 (left positive) */
export const getTurn = () => clamp(input.keyTurn + input.touchTurn, -1, 1);

export const ship = { x: 0, z: 0, heading: 0, speed: 0 };

// Must match the large-wave terms in the ocean vertex shader.
export function waveHeight(x: number, z: number, t: number) {
  return (
    Math.sin(x * 0.05 + t * 0.8) * 0.6 +
    Math.sin(z * 0.07 + t * 0.6) * 0.4 +
    Math.sin((x + z) * 0.11 + t * 1.3) * 0.2
  );
}

export const FOG_COLOR = '#a9d6e5';
export const FOG_NEAR = 90;
export const FOG_FAR = 280;
