export type Discipline = 'Flagship Projects' | 'Products & Utilities' | 'Experiments' | 'Open Source'
export type ProjectLink = { label: string; href: string }
export type Project = {
  slug: string
  number: string
  name: string
  category: string
  division: 'Digital' | 'Interactive'
  status: 'In development' | 'Released'
  description: string
  kind: 'luna' | 'tale' | 'water'
  discipline: Discipline
  image: string
  srcSet?: string
  width: number
  height: number
  imageAlt: string
  sourceLabel: string
  links: ProjectLink[]
}

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
    links: [
      { label: 'Explore LUNA', href: 'https://github.com/Lunatic5202/Luna' },
      { label: 'Latest release', href: 'https://github.com/Lunatic5202/Luna/releases/latest' },
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
    links: [
      { label: 'Play on itch.io', href: 'https://lunaticlayman.itch.io/twice-told-tale' },
      { label: 'Source & credits', href: 'https://github.com/Lunatic5202/Twice-told-tale' },
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
    links: [{ label: 'Follow development', href: 'https://github.com/Lunatic5202/what-the-water-keeps' }],
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
