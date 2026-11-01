# LUNEVRA Technologies

**Independent by design. Built to create.**

The public-facing portfolio for LUNEVRA Technologies, an independent, founder-led technology studio working across software, digital applications and interactive entertainment.

## The site

- **Home** — cinematic studio introduction and brand identity.
- **Selected work** — LUNA, Twice-Told Tale and What the Water Keeps, with truthful development statuses and expandable project summaries.
- **LUNEVRA Labs** — a home for experiments and prototypes, with no fabricated work listed.
- **About** — studio philosophy and creative practice.
- **Journal** — an editorial structure ready for future dispatches.
- **Contact** — links to the studio's existing GitHub presence.

Portfolio artwork is loaded from the projects' own public repositories: LUNA's Android player screenshot, Twice-Told Tale's title artwork, and Lumi's character art from What the Water Keeps. Each is labelled by its real context. Project cards link to the actual repositories, LUNA release page and Twice-Told Tale's itch.io release. The fan-work relationship for Twice-Told Tale is disclosed. No project metrics, contact email, or unverified history are claimed.

The experience uses staggered hero entrances, slow orbital motion, scroll-triggered section reveals and restrained image transitions. Essential content remains available with reduced motion enabled.

## Development

Requires Node.js and pnpm.

```sh
pnpm install
pnpm dev
```

Create a production build with:

```sh
pnpm build
```

Preview the build locally with `pnpm preview`.

## Structure

- `src/App.tsx` — homepage, work filtering, accessible mobile navigation and project detail dialogs.
- `src/styles.css` — responsive visual system, original project art treatments, transitions and reduced-motion rules.
- `index.html` — document metadata and social preview metadata.

The former Component Observatory remains documented in `docs/` as a separate local experiment; it is no longer the public website.

## Studio

LUNEVRA Digital, LUNEVRA Interactive and LUNEVRA Labs describe internal creative areas of one independent studio, not separate companies or staffed departments.


## Build and publishing checks

The public studio site is a React/TypeScript + Vite application. Use the package manager and scripts in the current `package.json`; the checked-in project currently defines `dev`, `build` and `preview`. Build before publishing and verify the deployed route, mobile navigation, project links, image loading and reduced-motion behavior.

Keep the portfolio factual: project cards must link to real repositories/releases, and development status, affiliations, metrics and contact information must not be invented. The separate `docs/` directory contains supporting component/experiment documentation; the former Component Observatory is not the public-facing portfolio.
