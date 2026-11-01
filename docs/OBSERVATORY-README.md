# LUNEVRA Component Observatory

**Discover. Experiment. Evaluate. Integrate.** A local first frontend component and animation laboratory for LUNEVRA Technologies, styled from the supplied identity board with obsidian, graphite, silver and lunar white.

## Start locally

Requires Node.js and pnpm. Run `pnpm install`, then `pnpm dev` and open the local URL printed by Vite. `pnpm build` creates the production bundle.

## Included in this first implementation

- Dashboard with real recently viewed history and direct workflow shortcuts; searchable, filterable, sortable component catalogue with platform aware keyboard search.
- Component detail views with working Overview, Source & Usage and Licence tabs, plus original local visual studies and clearly marked third party discovery references.
- Isolated Playground with viewport presets, custom dimensions, motion preference, canvas color, fullscreen, controls and copyable HTML/CSS source.
- Performance Lab with configurable warm-up and sampling, frame rate/time, variance, dropped-frame estimate, long task count, and browser-dependent heap reading. Results are approximate and include harness overhead.
- Local IndexedDB persistence for favourites, collections, manual licence notes, themes, recent entries and benchmark records.
- Theme Workshop with brand presets, token editing, saved palettes, JSON import/export and validation.
- Collections with membership, descriptions, notes and tags.
- Workspace backup and restore, plus responsive navigation and layouts.

## Limits and provenance

The original demonstrations are visual studies. The repository has no distribution licence, so their reuse terms remain Unknown. Third party records are discovery links only; their code is not bundled or executed and no exact external component has been reviewed. Licence fields are a manual record, not a legal verification service. Performance values describe the current browser session and do not represent controlled benchmarks. WebGL and framework-specific executable previews, automated licence verification, and source syntax highlighting are not included in this first slice.

See [`ARCHITECTURE.md`](ARCHITECTURE.md), [`COMPONENT_REGISTRY.md`](COMPONENT_REGISTRY.md), and [`LICENSING.md`](LICENSING.md) for implementation and contribution guidance.
