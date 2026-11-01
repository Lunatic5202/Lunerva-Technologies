# LUNEVRA Component Observatory
## Product Specification

**Owner:** LUNEVRA Technologies  
**Product type:** Internal frontend engineering and animation laboratory  
**Initial deployment:** Local-first web application  
**Tagline:** Discover. Experiment. Evaluate. Integrate.

## 1. Purpose

The Component Observatory is an internal tool for discovering, previewing, evaluating, testing, cataloguing and reusing frontend components and animations across LUNEVRA projects.

It is more than a static gallery: components should be discoverable, previewable, testable and reusable, with source and licensing information attached.

## 2. Product principles

- Local-first for the initial release.
- Honest measurements; never fabricate performance scores.
- Explicit source attribution and licence records.
- Treat imported third-party code as untrusted.
- Isolate component previews from the main application.
- Keep the architecture modular and maintainable.
- Support accessibility and reduced-motion preferences.
- Avoid overengineering the first release.

## 3. Visual identity

Dark-first interface:
- Background: `#08090B`
- Secondary background: `#101216`
- Surface: `#171A1F`
- Primary text: `#F2F3F4`
- Secondary text: `#9299A3`
- Accent: restrained cyan, approximately `#75D9E8`
- Borders: subtle graphite.

The design should feel like premium developer tooling: technical, minimal, professional and readable. Avoid purple gradients, excessive glassmorphism, generic dashboard templates and decorative motion without purpose.

## 4. Main application areas

### 4.1 Dashboard
Display real derived statistics:
- Registered components.
- Favourites.
- Verified licences.
- Components requiring licence review.
- Recently viewed and recently added components.
- Favourite collections.
- Shortcuts to the Playground and Performance Lab.

Do not hardcode fake activity or statistics.

### 4.2 Component Library
Provide a searchable, filterable gallery with:
- Name, description, thumbnail, category and tags.
- Framework and dependencies.
- Source URL, repository and original author.
- Licence and attribution details.
- Reduced-motion support status.
- Favourite control.
- Preview availability and benchmark status.

Initial categories:
- Hero sections.
- Typography.
- Backgrounds.
- Cards and UI.
- Navigation.
- Transitions.
- 3D and WebGL.
- Interactive effects.
- Utilities.

Search by name, description and tags. Filter by category, framework, licence, animation type and favourite status. Sort by name, newest and recently viewed.

### 4.3 Live Playground
Render the actual component, not merely a screenshot.

Support:
- Start, pause and replay where applicable.
- Hover and click interactions.
- Reset.
- Fullscreen.
- Background selection.
- Adjustable preview dimensions.
- Desktop, tablet and mobile viewport presets.
- Custom viewport dimensions.
- Component-specific controls when provided by its preview adapter.

### 4.4 Performance Lab
Measure real browser-observable performance. Potential metrics:
- Average FPS.
- Frame time and frame-time variance.
- Approximate dropped frames.
- Long tasks.
- Initialisation time.
- JS heap usage when exposed by the browser.

Use `requestAnimationFrame`, the Performance API, `PerformanceObserver`, resource timing and optional Chromium-specific memory APIs where supported.

Benchmarking must include warm-up, a consistent sampling window and repeatable runs. Record timestamp, viewport, browser/device information where available, duration and component version.

Clearly distinguish unavailable metrics as N/A. Do not claim exact GPU utilisation or hardware-level measurements when browser APIs cannot provide them. Explain that the preview environment and Observatory overhead can influence results.

### 4.5 Reduced-motion testing
Provide normal-motion and reduced-motion modes. Apply `prefers-reduced-motion: reduce` inside the preview and allow a manual override.

Record observations about whether motion is disabled, simplified or replaced by an appropriate static state. Do not claim accessibility compliance merely because a toggle exists.

### 4.6 Source Studio
Show syntax-highlighted source, file selection for multi-file components, dependencies, installation instructions, required configuration and usage examples.

Provide copy actions for:
- Component source.
- Installation command.
- Usage example.
- Component metadata.

Copied source must preserve formatting and disclose required dependencies and companion files.

### 4.7 Favourites and Collections
Support favourite toggles, custom collections, descriptions, notes, tags, add/remove operations and exportable collection manifests.

Suggested initial collections:
- LUNEVRA Website.
- LUNA.
- Game Websites.
- Experimental Animations.
- Commercially Approved.

### 4.8 Licence Manager
Track:
- Licence name and version.
- Author and original source.
- Repository.
- Commercial-use permission.
- Modification permission.
- Redistribution restrictions.
- Attribution requirements.
- Verification status and date.
- Notes and source references.

Statuses:
- **Verified**
- **Review required**
- **Restricted**
- **Unknown**

Flag missing attribution, unknown licences, commercial-use restrictions, redistribution restrictions and conflicting information.

Do not assume a component's licence from its parent library. Do not provide legal guarantees. Require manual verification and retain a reference to the licence text or source.

### 4.9 Brand Workshop
Provide editable design tokens:
- Background, surface and elevated surface.
- Primary and secondary text.
- Accent and border.
- Heading and body fonts.
- Border radius.
- Spacing scale.

Initial presets:
1. **LUNEVRA Original:** graphite, silver and restrained cyan.
2. **LUNEVRA Monochrome:** black, white and neutral greys.
3. **LUNEVRA Experimental:** graphite with a configurable accent.

Support live preview, create/save, rename, duplicate, delete, reset, JSON export and validated JSON import. Apply themes through shared tokens without destructively rewriting component source.

## 5. Viewport presets

Desktop:
- 1920 × 1080
- 1440 × 900
- 1280 × 720

Tablet:
- 1024 × 768
- 768 × 1024

Mobile:
- 430 × 932
- 390 × 844
- 375 × 812
- 360 × 800

Allow custom dimensions and correctly scale the preview while preserving its actual viewport size.

## 6. Technical recommendations

Preferred initial stack:
- React + TypeScript.
- Vite.
- Tailwind CSS.
- shadcn/ui.
- Lucide icons.
- Motion for React.
- GSAP for advanced choreography where justified.
- Three.js only for components that genuinely require WebGL.
- Shiki for source highlighting.
- IndexedDB for local persistence.
- Vitest, React Testing Library and Playwright for tests.

Keep the persistence layer replaceable. The application should work without external accounts, API keys or a remote backend.

## 7. Preview isolation and security

Component previews must run in an isolated iframe or similarly constrained execution context.

- Do not execute arbitrary imported code in the main application.
- Use restrictive iframe sandbox permissions.
- Do not grant unnecessary same-origin access.
- Use controlled, reviewed component registrations.
- Validate messages exchanged between the preview and parent.
- Do not use `eval` or `Function` to execute source strings.
- Treat imported code and metadata as untrusted input.
- Make preview failures visible and recoverable.
- Clearly distinguish trusted local demos from unreviewed third-party imports.

A component should only become an executable preview after inspection and explicit registration.

## 8. Persistence and data management

Use IndexedDB for:
- Component metadata and source references.
- Favourites and collections.
- Theme presets.
- Benchmark results.
- Licence records.
- Notes and recently viewed items.

Implement schema versioning, validation, migrations, backup, restore, data export and import. Do not store large source files or benchmark history in localStorage.

## 9. Performance and accessibility

- Lazy-load previews.
- Do not mount every demo at once.
- Clean up animation loops and event listeners.
- Dispose of WebGL resources.
- Avoid unnecessary React re-renders.
- Virtualise large galleries if required.
- Keep the main dashboard responsive.
- Respect reduced-motion preferences.
- Provide keyboard navigation and semantic controls.
- Maintain sufficient contrast.
- Distinguish Observatory overhead from component performance.

## 10. Testing requirements

Unit and integration tests:
- Component registry.
- Search and filtering.
- Favourite persistence.
- Collections.
- Theme creation and persistence.
- Theme import/export.
- Clipboard actions.
- Viewport switching.
- Preview isolation and message validation.
- Reduced-motion mode.
- Benchmark execution and cancellation.
- Licence warnings.
- Backup and restore.

End-to-end tests should cover the primary user journeys on desktop and mobile layouts.

## 11. Definition of done

The initial release is complete when:
- Dashboard statistics derive from real data.
- Search and filters work.
- Actual component previews work.
- Viewport testing works.
- Performance metrics are genuine and clearly qualified.
- Reduced-motion testing works.
- Source can be copied.
- Favourites and collections persist.
- Licence records and warnings work.
- Theme editing and persistence work.
- Data import/export works.
- Mobile navigation works.
- Tests pass and production build succeeds.
- Documentation is complete.

No inert critical buttons, fake benchmark data or screenshots presented as live previews.

## 12. Future compatibility profiles

Plan metadata fields for compatibility with:
- React + Vite.
- Next.js.
- Tailwind CSS.
- Plain CSS.
- TypeScript.
- Mobile browsers.
- Static hosting.

A future **Export for Project** workflow may generate installation instructions and integration files for LUNEVRA projects. This is not required for the first release.

---

*LUNEVRA Technologies — Internal Engineering*
