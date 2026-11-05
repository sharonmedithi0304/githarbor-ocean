'use client';

import dynamic from 'next/dynamic';

const World = dynamic(() => import('./World'), {
  ssr: false,
  loading: () => <div className="loading">Hoisting the sails…</div>,
});

export default function WorldLoader() {
  return <World />;
}
