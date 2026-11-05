'use client';

import Link from 'next/link';
import { projects } from '@/lib/projects';
import { input } from '@/lib/shipState';

function Pad({ label, aria, onChange }: { label: string; aria: string; onChange: (on: boolean) => void }) {
  return (
    <button
      className="pad"
      aria-label={aria}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        onChange(true);
      }}
      onPointerUp={() => onChange(false)}
      onPointerCancel={() => onChange(false)}
      onContextMenu={(e) => e.preventDefault()}
    >
      {label}
    </button>
  );
}

export default function Hud({ near, discovered, total }: { near: string | null; discovered: number; total: number }) {
  const project = near ? projects.find((p) => p.id === near) : null;

  return (
    <>
      <div className="hud-brand">⚓ GitHarbor</div>
      <Link href="/recruiter" className="hud-skip">
        Skip the voyage →
      </Link>
      <div className="hud-progress">
        Discovered {discovered} / {total}
      </div>
      <div className="hud-hint">W A S D or arrow keys to sail</div>

      {project && (
        <div className="card">
          <h2>{project.name}</h2>
          <p className="tagline">{project.tagline}</p>
          <p>{project.description}</p>
          <div className="chips">
            {project.stack.map((s) => (
              <span key={s} className="chip">
                {s}
              </span>
            ))}
          </div>
          <div className="actions">
            <a href={project.repo} target="_blank" rel="noreferrer">
              Repo
            </a>
            {project.live && (
              <a href={project.live} target="_blank" rel="noreferrer">
                Live demo
              </a>
            )}
          </div>
        </div>
      )}

      <div className="pads">
        <div className="pad-group">
          <Pad label="◀" aria="Turn left" onChange={(on) => (input.touchTurn = on ? 1 : 0)} />
          <Pad label="▶" aria="Turn right" onChange={(on) => (input.touchTurn = on ? -1 : 0)} />
        </div>
        <div className="pad-group">
          <Pad label="▲" aria="Sail forward" onChange={(on) => (input.touchThrottle = on ? 1 : 0)} />
          <Pad label="▼" aria="Reverse" onChange={(on) => (input.touchThrottle = on ? -1 : 0)} />
        </div>
      </div>
    </>
  );
}
