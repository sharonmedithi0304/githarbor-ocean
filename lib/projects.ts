// PLACEHOLDER DATA — next step: generate this from the GitHub REST API.
// Each project becomes an island. x/z are world coordinates (ship starts at 0,0 facing -z).

export type Project = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  stack: string[];
  repo: string;
  live?: string;
  color: string; // island foliage colour
  x: number;
  z: number;
  radius: number;
};

export const profile = {
  name: 'Shreya',
  role: 'Full-stack developer',
  github: 'https://github.com/your-github-username',
  email: 'you@example.com',
  skills: ['TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'Three.js', 'PostgreSQL', 'Tailwind CSS'],
};

export const projects: Project[] = [
  {
    id: 'lighthouse-api',
    name: 'Lighthouse API',
    tagline: 'Fast REST backend with auth and rate limiting',
    description: 'Placeholder project. Replace with a real repo description pulled from GitHub.',
    stack: ['Node.js', 'Express', 'PostgreSQL'],
    repo: 'https://github.com/your-github-username/lighthouse-api',
    live: 'https://example.com',
    color: '#4caf6a',
    x: -35,
    z: -75,
    radius: 8,
  },
  {
    id: 'compass-ui',
    name: 'Compass UI',
    tagline: 'Accessible React component library',
    description: 'Placeholder project. Replace with a real repo description pulled from GitHub.',
    stack: ['React', 'TypeScript', 'Storybook'],
    repo: 'https://github.com/your-github-username/compass-ui',
    color: '#6fbf73',
    x: 60,
    z: -120,
    radius: 10,
  },
  {
    id: 'tidewatch',
    name: 'Tidewatch',
    tagline: 'Realtime analytics dashboard',
    description: 'Placeholder project. Replace with a real repo description pulled from GitHub.',
    stack: ['Next.js', 'WebSockets', 'Recharts'],
    repo: 'https://github.com/your-github-username/tidewatch',
    live: 'https://example.com',
    color: '#3f9c8f',
    x: 125,
    z: -30,
    radius: 9,
  },
  {
    id: 'driftnotes',
    name: 'Driftnotes',
    tagline: 'Offline-first notes app',
    description: 'Placeholder project. Replace with a real repo description pulled from GitHub.',
    stack: ['React Native', 'SQLite'],
    repo: 'https://github.com/your-github-username/driftnotes',
    color: '#8bc34a',
    x: -110,
    z: -25,
    radius: 10,
  },
  {
    id: 'kraken-bot',
    name: 'Kraken Bot',
    tagline: 'Automation bot with a plugin system',
    description: 'Placeholder project. Replace with a real repo description pulled from GitHub.',
    stack: ['Python', 'Docker', 'Redis'],
    repo: 'https://github.com/your-github-username/kraken-bot',
    color: '#5aa469',
    x: 10,
    z: -190,
    radius: 11,
  },
];
