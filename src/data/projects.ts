export type Discipline = 'Flagship Projects' | 'Products & Utilities' | 'Experiments' | 'Open Source'
export type ProjectLink = { label: string; href: string }
export type Status = 'In development' | 'Released' | 'Experimental'
export type Project = {
  slug: string
  number: string
  name: string
  category: string
  division: 'Digital' | 'Interactive'
  status: Status
  description: string
  /** Art treatment: the first three keep their bespoke backdrops, `shot` is a plain screenshot frame. */
  kind: 'luna' | 'tale' | 'water' | 'shot'
  discipline: Discipline
  /** Omitted when there is no honest screenshot yet; a plain placeholder is shown instead. */
  image?: string
  srcSet?: string
  width?: number
  height?: number
  imageAlt: string
  sourceLabel: string
  /** Where the image came from, shown in the detail dialog. */
  artworkNote: string
  platform: string
  stack: string[]
  highlights: string[]
  /** An honest caveat shown beside the links (disclaimers, demo data, fan-work notices). */
  note?: string
  links: ProjectLink[]
}

const gh = (repo: string) => 'https://github.com/Lunatic5202/' + repo

export const projects: Project[] = [
  {
    slug: 'luna',
    number: '01',
    name: 'LUNA',
    category: 'Software · Music',
    division: 'Digital',
    status: 'In development',
    description:
      'An offline-first Android music player with a live visualizer and color-shifting interface that responds to the music.',
    kind: 'luna',
    discipline: 'Flagship Projects',
    image: '/work/luna-540.webp',
    width: 540,
    height: 1201,
    imageAlt: 'LUNA Android now-playing screen with its live visualizer',
    sourceLabel: 'NOW PLAYING / ANDROID',
    artworkNote: 'From the project repository',
    platform: 'Android 8.0+',
    stack: ['Kotlin', 'Jetpack Compose', 'AndroidX Media3'],
    highlights: [
      'CD stack: hold the artwork and neighbouring tracks fan out like a stack of CDs',
      'Every track gets a mood from its album art, and the whole app shifts colour with the song',
      'Live spectrum visualizer that only reads LUNA’s own audio, with a synthetic fallback',
      'Synced lyrics, a 14-preset equalizer and Combos (playlists made your way)',
      'Library and combos stay on the device; audio files are never uploaded',
    ],
    links: [
      { label: 'Explore LUNA', href: gh('Luna') },
      { label: 'Latest release', href: gh('Luna') + '/releases/latest' },
    ],
  },
  {
    slug: 'twice-told-tale',
    number: '02',
    name: 'Twice-Told Tale',
    category: 'Interactive · Visual novel',
    division: 'Interactive',
    status: 'Released',
    description:
      'A 30-day otome visual novel where Scaramouche and the Wanderer exist at the same time, and a magical Folio records what happens.',
    kind: 'tale',
    discipline: 'Flagship Projects',
    image: '/work/tale-1200.webp',
    srcSet: '/work/tale-640.webp 640w, /work/tale-1200.webp 1200w',
    width: 1200,
    height: 674,
    imageAlt: 'Official Twice-Told Tale title artwork from the game repository',
    sourceLabel: 'OFFICIAL TITLE ART',
    artworkNote: 'From the project repository',
    platform: 'Desktop (Ren’Py)',
    stack: ['Ren’Py 8.5+', 'Python tooling', 'Pillow + NumPy'],
    highlights: [
      'Four acts plus a prologue, reaching ten endings tracked in a persistent gallery',
      'Backgrounds and CG plates are procedurally generated and deterministic',
      'Pages Collected, CG gallery, Music Room and credits screens',
      'Automated headless test suites for routes, endings and gallery unlocks',
    ],
    note: 'A private, non-commercial fan work; not affiliated with HoYoverse.',
    links: [
      { label: 'Play on itch.io', href: 'https://lunaticlayman.itch.io/twice-told-tale' },
      { label: 'Source & credits', href: gh('Twice-told-tale') },
    ],
  },
  {
    slug: 'what-the-water-keeps',
    number: '03',
    name: 'What the Water Keeps',
    category: 'Interactive · 2D Souls-like',
    division: 'Interactive',
    status: 'In development',
    description:
      'A gentle-on-the-surface 2D Souls-like platformer. Follow Lumi, a lantern-bearing wanderer, through lands shaped by the seven sins.',
    kind: 'water',
    discipline: 'Flagship Projects',
    image: '/work/water-427.webp',
    width: 427,
    height: 513,
    imageAlt: 'Lumi, the lantern-bearing wanderer, in the game’s original character art',
    sourceLabel: 'CHARACTER STUDY / LUMI',
    artworkNote: 'From the project repository',
    platform: 'Windows and Linux',
    stack: ['Godot 4', 'GDScript', 'GL Compatibility renderer'],
    highlights: [
      'Seven doors lead to seven lands, each built from one of the seven sins; the last boss is Lumi’s own reflection',
      'No buffs: mechanics punish ignoring a region’s lesson with debuffs instead',
      'Two fighting styles (Lantern Swing and Open Hand) and a bench-only save system',
      'Gentle, Normal and Hard difficulty, with a hidden no-hit challenge',
    ],
    note: 'An early prototype: the Greed and Slumber Hollow regions exist, but much of it has not been playtested in Godot yet.',
    links: [{ label: 'Follow development', href: gh('what-the-water-keeps') }],
  },
  {
    slug: 'mediqueue',
    number: '04',
    name: 'MediQueue',
    category: 'Software · Clinical decision support',
    division: 'Digital',
    status: 'Experimental',
    description:
      'An early-warning system for emergency-department patient deterioration: it scores a rolling four-hour vitals history and proposes queue priorities that clinicians confirm, reject or override.',
    kind: 'shot',
    discipline: 'Flagship Projects',
    image: '/work/mediqueue-1200.webp',
    srcSet: '/work/mediqueue-640.webp 640w, /work/mediqueue-1200.webp 1200w',
    width: 1200,
    height: 717,
    imageAlt: 'MediQueue live queue dashboard',
    sourceLabel: 'LIVE QUEUE / DASHBOARD',
    artworkNote: 'Screenshot from the project repository',
    platform: 'Web (self-hosted)',
    stack: ['FastAPI', 'LightGBM', 'React 19 + MUI', 'SQLite / PostgreSQL', 'WebSocket', 'Docker'],
    highlights: [
      'Scores heart rate, SpO₂, blood pressure and temperature with a versioned LightGBM model',
      'Deduplicated alerts with structured explanations; overrides require a rationale',
      'Append-only audit trail written in the same transaction as each action',
      'Live updates over WebSocket with a polling fallback, plus a synthetic replay simulator',
    ],
    note: 'A research and teaching prototype, not prospectively validated. Its reported scores come from a synthetic corpus and are not clinical evidence.',
    links: [{ label: 'Explore MediQueue', href: gh('MediQueue') }],
  },
  {
    slug: 'face-attendance-tracker',
    number: '05',
    name: 'Face Attendance Tracker',
    category: 'Software · Attendance',
    division: 'Digital',
    status: 'In development',
    description:
      'An employee attendance system that recognises faces at a kiosk to record check-ins and check-outs, with an administrator console behind a password.',
    kind: 'shot',
    discipline: 'Products & Utilities',
    imageAlt: 'No screenshot yet',
    sourceLabel: 'KIOSK / ADMIN CONSOLE',
    artworkNote: 'No screenshot published yet',
    platform: 'Web kiosk with admin console',
    stack: ['FastAPI', 'OpenCV (SFace)', 'React 19 + Vite', 'PostgreSQL', 'Docker'],
    highlights: [
      'SFace face embeddings matched by cosine distance',
      'Server-enforced late marking, check-in buffer and minimum work time before check-out',
      'A field-crew mode that logs visits instead of shifts',
      'Employee data, attendance timestamps and face templates encrypted at rest',
    ],
    links: [{ label: 'Explore the code', href: gh('Attendance-tracker') }],
  },
  {
    slug: 'careerx',
    number: '06',
    name: 'CareerX',
    category: 'Software · Career tools',
    division: 'Digital',
    status: 'In development',
    description:
      'An AI-assisted career platform for software engineers: an ATS resume optimiser, an embedded coding IDE and a Kanban application tracker.',
    kind: 'shot',
    discipline: 'Products & Utilities',
    imageAlt: 'No screenshot yet',
    sourceLabel: 'CAREER WORKFLOW / WEB APP',
    artworkNote: 'No screenshot published yet',
    platform: 'Web',
    stack: ['React 18 + Vite + TypeScript', 'Tailwind CSS', 'FastAPI', 'MongoDB Atlas', 'Groq'],
    highlights: [
      'Resume scoring and bullet-point enhancement driven by the Groq API',
      'Monaco editor for data-structures practice in several languages',
      'Kanban tracker for interview loops, assessments and offers',
      'Standalone frontend and backend with JWT authentication',
    ],
    links: [{ label: 'Explore the code', href: gh('Job-Application-Tracker') }],
  },
  {
    slug: 'style-in-store',
    number: '07',
    name: 'Style In Store',
    category: 'Software · Retail discovery',
    division: 'Digital',
    status: 'In development',
    description:
      'A location-aware store discovery and shopping-browse experience for finding clothing from nearby stores.',
    kind: 'shot',
    discipline: 'Products & Utilities',
    imageAlt: 'No screenshot yet',
    sourceLabel: 'STORE DISCOVERY / WEB APP',
    artworkNote: 'No screenshot published yet',
    platform: 'Web',
    stack: ['React 18 + Vite + TypeScript', 'Tailwind CSS + shadcn/ui', 'Supabase', 'Leaflet', 'TanStack Query'],
    highlights: [
      'Location selection and nearby-store discovery on a map',
      'Browse route with search and filters',
      'Store-product scraping isolated behind its own module',
    ],
    note: 'Product listings in the browse view are templates, not verified live inventory.',
    links: [{ label: 'Explore the code', href: gh('style-in-store') }],
  },
  {
    slug: 'bt-projects-website',
    number: '08',
    name: 'BT Projects website',
    category: 'Software · Company website',
    division: 'Digital',
    status: 'In development',
    description:
      'A full-stack company website for B T Projects Private Limited, an engineering and infrastructure firm working in water supply, sewage management and plant operation.',
    kind: 'shot',
    discipline: 'Products & Utilities',
    imageAlt: 'No screenshot yet',
    sourceLabel: 'COMPANY WEBSITE',
    artworkNote: 'No screenshot published yet',
    platform: 'Web',
    stack: ['React 19 + Vite', 'TypeScript', 'Express + tRPC', 'Drizzle ORM + MySQL', 'Tailwind CSS v4', 'Vitest'],
    highlights: [
      'React frontend with a server-side API, shared types and database schema',
      'Deployment configuration included in the repository',
    ],
    links: [{ label: 'Explore the code', href: gh('bt--projects') }],
  },
  {
    slug: 'drishti-mission-console',
    number: '09',
    name: 'DRISHTI Mission Console',
    category: 'Experiment · Data visualisation',
    division: 'Digital',
    status: 'Experimental',
    description:
      'An ISRO-inspired mission-control dashboard concept that walks an exoplanet candidate through a full transit-detection pipeline, from raw signal to verdict.',
    kind: 'shot',
    discipline: 'Experiments',
    image: '/work/drishti-1200.webp',
    srcSet: '/work/drishti-640.webp 640w, /work/drishti-1200.webp 1200w',
    width: 1200,
    height: 750,
    imageAlt: 'DRISHTI mission console overview with a light curve and classification card',
    sourceLabel: 'OVERVIEW / MISSION CONSOLE',
    artworkNote: 'Captured from the running app',
    platform: 'Web',
    stack: ['TanStack Start (React 19)', 'TypeScript + Vite', 'Tailwind CSS v4', 'shadcn/ui', 'Recharts'],
    highlights: [
      'Nine tabs: overview, raw signal, processed, events, AI classification, model fit, MCMC, verdict and export',
      'Client-side export of results as CSV, a text report and an SVG figure',
    ],
    note: 'All mission data is synthetic and generated in the browser. There is no backend, telescope feed or trained model.',
    links: [{ label: 'Explore the code', href: gh('drishti-mission-cosmos') }],
  },
  {
    slug: 'carbonex',
    number: '10',
    name: 'CarboNex',
    category: 'Experiment · Sensing & early warning',
    division: 'Digital',
    status: 'Experimental',
    description:
      'A prototype for monitoring potential ground movement in underground coal mines, combining a sensor-fusion model, a Dash analysis dashboard and a Flask API for ESP32-style telemetry.',
    kind: 'shot',
    discipline: 'Experiments',
    image: '/work/carbonex-1200.webp',
    srcSet: '/work/carbonex-640.webp 640w, /work/carbonex-1200.webp 1200w',
    width: 1200,
    height: 750,
    imageAlt: 'CarboNex landing page with the headline See the ground before it moves',
    sourceLabel: 'LANDING PAGE / PROTOTYPE',
    artworkNote: 'Captured from the running app',
    platform: 'Web, with ESP32 telemetry input',
    stack: ['Python', 'scikit-learn', 'Flask', 'Dash + Plotly', 'React frontend'],
    highlights: [
      'Isolation Forest anomaly detection with rolling trend features and weighted multi-sensor risk scoring',
      'Tilt, displacement, strain and vibration inputs mapped to four risk bands',
      'Replay simulation, what-if views and batch CSV scoring',
    ],
    note: 'A research and engineering prototype, not a certified mine-safety instrument. The figures on the landing page are illustrative.',
    links: [{ label: 'Explore the code', href: gh('Carbonex') }],
  },
  {
    slug: 'maitri',
    number: '11',
    name: 'MAITRI',
    category: 'Experiment · Audio emotion detection',
    division: 'Digital',
    status: 'Experimental',
    description:
      'A full-stack audio emotion-classification project: a FastAPI service, audio preprocessing and a React interface that returns a predicted state with a confidence.',
    kind: 'shot',
    discipline: 'Experiments',
    image: '/work/maitri-1200.webp',
    srcSet: '/work/maitri-640.webp 640w, /work/maitri-1200.webp 1200w',
    width: 1200,
    height: 750,
    imageAlt: 'MAITRI emotion detection screen with voice and facial analysis panels',
    sourceLabel: 'EMOTION DETECTION / WEB APP',
    artworkNote: 'Captured from the running app, with no model server connected',
    platform: 'Web',
    stack: ['Python + FastAPI', 'React + TypeScript + Vite', 'Trained model assets (.pt)', 'Docker Compose'],
    highlights: [
      'Records or accepts audio, preprocesses it and compares it with emotion signatures',
      'Exposes a health route and a classify route',
    ],
    note: 'Research and demo software. Predictions are experimental outputs, not clinical or psychological assessments.',
    links: [{ label: 'Explore the code', href: gh('Maitri') }],
  },
  {
    slug: 'journey-to-discover',
    number: '12',
    name: 'Journey to Discover',
    category: 'Experiment · Data analysis',
    division: 'Digital',
    status: 'Experimental',
    description:
      'An R analysis of Google review counts for Indian tourist destinations, looking for underrated hidden gems that popularity alone would miss.',
    kind: 'shot',
    discipline: 'Experiments',
    imageAlt: 'No screenshot yet',
    sourceLabel: 'REVIEW ANALYSIS / R',
    artworkNote: 'No screenshot published yet',
    platform: 'R, RStudio and Shiny',
    stack: ['R', 'tidyverse', 'Shiny + bslib', 'plotly'],
    highlights: [
      'Joins a 325-place review dataset with 100 curated destinations by state',
      'Finds that popularity is a poor guide: high-rated places appear at every review tier',
      'An interactive Shiny explorer with a hidden-gem score',
    ],
    note: 'A team project by Trio Explorers (CSE Data Science).',
    links: [{ label: 'Explore the analysis', href: gh('Journey-To-Discover') }],
  },
]

export const filters = ['All work', 'Flagship Projects', 'Products & Utilities', 'Experiments', 'Open Source'] as const
export type Filter = (typeof filters)[number]

export const nav = [
  { label: 'Home', href: '#home' },
  { label: 'Work', href: '#work' },
  { label: 'Labs', href: '#labs' },
  { label: 'Journal', href: '#journal' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
] as const

export const countFor = (filter: Filter) =>
  String(filter === 'All work' ? projects.length : projects.filter(p => p.discipline === filter).length).padStart(2, '0')
