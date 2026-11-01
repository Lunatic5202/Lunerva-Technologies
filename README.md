# LUNEVRA Technologies

**Independent by design. Built to create.**

The public portfolio for LUNEVRA Technologies, an independent, founder-led technology studio working across software, digital applications and interactive entertainment.

## The site

- **Home** — letter-by-letter hero reveal, scroll-linked parallax, a faint pointer-following light, and a ticker of real project statuses.
- **Work** — LUNA, Twice-Told Tale and What the Water Keeps with truthful statuses, category filters (counts are computed), and project dialogs that deep-link at `#project/<slug>`.
- **Labs** and **Journal** — honest empty states. Add entries to `src/data/labs.ts` and `src/data/journal.ts` and they render automatically.
- **About** — sticky-scroll philosophy section.
- **Contact** — links only to the studio's existing GitHub presence.

Artwork is loaded from the projects' own public repositories and falls back to a labelled placeholder if an image fails. No metrics, contact email, employees, clients or company history are claimed.

## Motion

| Pattern | Where | Built with |
|---|---|---|
| Letter reveal, fade-ups, nav underline, scroll progress, hero parallax, image clip reveal and parallax | Hero, header, work | Motion |
| Magnetic buttons, 3D image tilt with pointer light | CTAs, project images | Motion springs |
| Word-by-word scroll scrub | Manifesto | GSAP ScrollTrigger (loaded on demand) |
| Scrambled mono labels | Section numbers | custom, Motion `useInView` |
| Sticky scroll reveal | About | custom, Motion |
| Status marquee | Under the hero | CSS |

Everything respects `prefers-reduced-motion`: transforms and loops are disabled, content is shown immediately, and touch devices skip pointer effects.

### Component sources

Aceternity UI, React Bits and Magic UI informed the interaction patterns (magnetic button, sticky scroll reveal, tilt, scramble text, marquee), but the components here are original implementations in the LUNEVRA design system, not pasted source. The packages actually installed are Motion, GSAP (free under its standard licence), Radix UI Dialog and Lucide.

## Development

Requires Node.js and pnpm.

```sh
pnpm install
pnpm dev
pnpm build      # type-check + production build
pnpm preview
```

## Structure

- `src/App.tsx` — page composition, work filtering, hash-synced project dialog.
- `src/components/` — `Hero`, `Header`, `ProjectRow`, `ProjectDetail` (Radix Dialog), `Principles`, `StatusMarquee`, `ScrubText`, `ScrambleText`, `MagneticLink`, `Reveal`, `SplitChars`, `Artwork`.
- `src/data/` — `projects.ts`, `labs.ts`, `journal.ts`.
- `src/styles.css` — visual system, responsive rules, reduced-motion rules.
- `docs/` — notes from the earlier Component Observatory experiment, which is no longer part of the site.

## Studio

LUNEVRA Digital, LUNEVRA Interactive and LUNEVRA Labs describe internal creative areas of one independent studio, not separate companies or staffed departments.


## Build and publishing checks

The public studio site is a React/TypeScript + Vite application. Use the package manager and scripts in the current `package.json`; the checked-in project currently defines `dev`, `build` and `preview`. Build before publishing and verify the deployed route, mobile navigation, project links, image loading and reduced-motion behavior.

Keep the portfolio factual: project cards must link to real repositories/releases, and development status, affiliations, metrics and contact information must not be invented. The separate `docs/` directory contains supporting component/experiment documentation; the former Component Observatory is not the public-facing portfolio.

## License

LUNEVRA Technologies is a proprietary project. No license is granted to copy, modify, distribute, or commercially reuse this repository without prior written permission from the relevant rights holder. Third-party packages and assets remain subject to their respective licenses; see the project dependencies and their upstream license terms.
