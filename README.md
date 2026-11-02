# LUNEVRA Technologies

**Independent by design. Built to create.**

The public portfolio for LUNEVRA Technologies, an independent, founder-led technology studio working across software, digital applications and interactive entertainment.

## The site

- **Home** — letter-by-letter hero reveal, generated tagline, pointer depth layers, floating navbar and a ticker of real project statuses.
- **Work** — LUNA, Twice-Told Tale and What the Water Keeps in a sticky scroll showcase with truthful statuses, category filters (counts are computed), and project dialogs that deep-link at `#project/<slug>`.
- **Labs** and **Journal** — honest empty states. Add entries to `src/data/labs.ts` and `src/data/journal.ts` and they render automatically.
- **About** — sticky-scroll philosophy section.
- **Contact** — links only to the studio's existing GitHub presence.

Artwork is loaded from the projects' own public repositories and falls back to a labelled placeholder if an image fails. No metrics, contact email, employees, clients or company history are claimed.

## Motion

| Pattern | Where | Built with |
|---|---|---|
| Letter-by-letter wordmark, word-by-word blur-in tagline | Hero | Motion |
| Pointer depth layers, coordinate tag that follows the cursor, soft light | Hero | Motion springs (no React re-renders) |
| Floating navbar: hides while scrolling down, returns on scroll up or keyboard focus | Header | Motion |
| Sliding nav underline, scroll progress line | Header | Motion `layoutId`, `useScroll` |
| Magnetic buttons | Hero CTA, contact | Motion springs |
| Sticky scroll reveal: text scrolls, one pinned artwork panel crossfades | Work (wide screens) | Motion |
| Tracing beam beside the project list | Work (wide screens) | Motion `useScroll` |
| Direction-aware hover: details panel enters and leaves from the pointer's edge | Project images | Motion controls |
| 3D tilt with pointer light | Project images | Motion springs |
| Colour-reveal mask that follows the pointer | Project dialog artwork | CSS mask |
| Word-by-word scroll scrub | Manifesto | GSAP ScrollTrigger (loaded on demand) |
| Scrambled mono labels | Section numbers | custom |
| Sticky principles with counter | About | Motion |
| Self-drawing background lines | Labs | Motion `pathLength` |
| Outline wordmark lit by the pointer | Footer | SVG mask + Motion |
| Static page grain | Whole page | one SVG noise tile, no animation |
| Status ticker | Under the hero | CSS |

Layout adapts: screens at least 1051px wide get the sticky showcase; tablet and mobile get stacked project rows. Everything respects `prefers-reduced-motion` (loops, transforms and pointer effects are disabled and content shows immediately), and touch devices skip pointer-only effects.

### Component sources

The brief references Aceternity UI, React Bits and Magic UI. Their interaction patterns informed the work above (floating navbar, text generate, sticky scroll reveal, tracing beam, direction-aware hover, SVG mask, background lines, noise, text hover, magnetic button, marquee), but each is an original implementation in the LUNEVRA design system rather than pasted source. Aceternity's licence forbids redistributing its source files and React Bits adds a Commons Clause, so nothing from those libraries is copied in. Installed packages: Motion, GSAP (free under its standard licence), Radix UI Dialog and Lucide.

Not built yet from the brief: Liquid Glass navigation surface (skipped on purpose to keep glass minimal), Images Slider (no gallery assets yet), per-project case-study pages, and the Products & Utilities entries beyond the filter category.

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
- `src/components/` — `Hero`, `Header`, `Showcase`, `TracingBeam`, `ProjectImage`, `ProjectInfo`, `ProjectRow`, `ProjectDetail` (Radix Dialog), `Principles`, `StatusMarquee`, `BackgroundLines`, `TextHover`, `GenerateText`, `ScrubText`, `ScrambleText`, `MagneticLink`, `Reveal`, `SplitChars`, `Artwork`.
- `src/data/` — `projects.ts`, `labs.ts`, `journal.ts`.
- `src/styles.css` — visual system, responsive rules, reduced-motion rules.
- `archive/component-observatory/` — source of the earlier Component Observatory experiment, kept for reference. It is not compiled or bundled and is not part of the site.
- `docs/` — design notes from that experiment.

## Studio

LUNEVRA Digital, LUNEVRA Interactive and LUNEVRA Labs describe internal creative areas of one independent studio, not separate companies or staffed departments.


## Build and publishing checks

The public studio site is a React/TypeScript + Vite application. Use the package manager and scripts in the current `package.json`; the checked-in project currently defines `dev`, `build` and `preview`. Build before publishing and verify the deployed route, mobile navigation, project links, image loading and reduced-motion behavior.

Keep the portfolio factual: project cards must link to real repositories/releases, and development status, affiliations, metrics and contact information must not be invented. The separate `docs/` directory contains supporting component/experiment documentation; the former Component Observatory is not the public-facing portfolio.

## License

LUNEVRA Technologies is a proprietary project. No license is granted to copy, modify, distribute, or commercially reuse this repository without prior written permission from the relevant rights holder. Third-party packages and assets remain subject to their respective licenses; see the project dependencies and their upstream license terms.
