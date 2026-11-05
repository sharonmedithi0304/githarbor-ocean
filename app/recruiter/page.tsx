import Link from 'next/link';
import type { Metadata } from 'next';
import { profile, projects } from '@/lib/projects';

export const metadata: Metadata = {
  title: `${profile.name} — Projects & Contact`,
};

export default function Recruiter() {
  return (
    <main className="recruiter">
      <Link href="/" className="back">
        ← Back to the voyage
      </Link>

      <header>
        <h1>{profile.name}</h1>
        <p className="role">{profile.role}</p>
        <div className="actions">
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={`mailto:${profile.email}`}>Email</a>
        </div>
      </header>

      <section>
        <h2>Projects</h2>
        <div className="grid">
          {projects.map((p) => (
            <article key={p.id} className="proj">
              <h3>{p.name}</h3>
              <p className="tagline">{p.tagline}</p>
              <div className="chips">
                {p.stack.map((s) => (
                  <span key={s} className="chip">
                    {s}
                  </span>
                ))}
              </div>
              <div className="actions">
                <a href={p.repo} target="_blank" rel="noreferrer">
                  Repo
                </a>
                {p.live && (
                  <a href={p.live} target="_blank" rel="noreferrer">
                    Live demo
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2>Skills</h2>
        <div className="chips">
          {profile.skills.map((s) => (
            <span key={s} className="chip">
              {s}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
