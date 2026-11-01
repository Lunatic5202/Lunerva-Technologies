# OpenCode Implementation Prompt — LUNEVRA Component Observatory

Copy the prompt below into OpenCode from the repository root.

---

## ROLE

You are the principal frontend engineer building the **LUNEVRA Component Observatory**, an internal frontend engineering and animation laboratory for LUNEVRA Technologies.

Build a complete, functional and maintainable application. This must not be a static dashboard mockup. Every major feature must work, or be represented by an honest, documented unavailable state.

## PRODUCT IDENTITY

Name: LUNEVRA Component Observatory  
Tagline: Discover. Experiment. Evaluate. Integrate.

The application is a local-first developer tool for discovering, previewing, evaluating, testing, cataloguing and reusing frontend components and animations.

Use a premium dark-first visual system:
- Background: #08090B
- Secondary background: #101216
- Surface: #171A1F
- Primary text: #F2F3F4
- Secondary text: #9299A3
- Restrained cyan accent: #75D9E8
- Subtle graphite borders.

Make it technical, minimal, professional and readable. Avoid purple gradients, excessive glassmorphism, generic dashboard templates and decorative animation without purpose.

## FIRST ACTION: INSPECT

Inspect the existing repository before changing anything:
- Identify framework, dependencies, scripts and project structure.
- Check existing functionality and preserve working code.
- Identify the default branch and existing conventions.
- Do not blindly replace the project.

If the repository is empty, initialise a suitable React + TypeScript + Vite application.

## APPLICATION LAYOUT

Implement responsive navigation with these areas:

OVERVIEW
- Dashboard

LIBRARY
- All Components
- Hero Sections
- Typography
- Backgrounds
- Cards & UI
- Navigation
- Transitions
- 3D & WebGL
- Interactive Effects

WORKSPACE
- Playground
- Performance Lab
- Collections
- Favourites

CONFIGURATION
- Brand Workshop
- Licence Manager
- Settings

Use a persistent desktop sidebar and compact mobile navigation. Provide functional routing, active states, loading states, empty states and error handling.

## DASHBOARD

Show real, derived statistics:
- Registered components.
- Favourites.
- Verified licences.
- Components requiring licence review.
- Recently viewed and added components.
- Favourite collections.
- Shortcuts to the Playground and Performance Lab.

Never hardcode fake statistics or activity.

## COMPONENT REGISTRY AND LIBRARY

Create a typed, validated component registry. Each entry should support:
- Unique ID, name and description.
- Category, tags and preview thumbnail.
- Component source or source-file references.
- Source URL, repository URL and original author.
- Framework and dependencies.
- Installation instructions and usage example.
- Licence name/version and attribution requirements.
- Commercial-use and redistribution information.
- Reduced-motion support status.
- Favourite and collection references.
- Notes and last-updated timestamp.
- Preview adapter/configuration.

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

Implement search across name, description and tags; filters for category, framework, licence, animation type and favourites; sorting by name, newest and recently viewed; and a clear-filters action.

Build a polished gallery with meaningful metadata. Do not depend solely on static screenshots.

## LIVE PLAYGROUND

Render the actual registered component, not a screenshot.

Support where applicable:
- Start, pause, replay and reset.
- Hover and click interactions.
- Fullscreen.
- Preview background selection.
- Adjustable dimensions.
- Desktop, tablet and mobile presets.
- Custom viewport sizes.
- Component-specific controls through preview adapters.

### Preview security

Run previews in a constrained iframe or similarly isolated context.

- Never execute arbitrary imported code in the main application.
- Use restrictive sandbox permissions.
- Do not grant unnecessary same-origin access.
- Use explicit, reviewed component registrations.
- Validate all messages between preview and parent.
- Do not use eval or Function to execute source strings.
- Treat third-party code and metadata as untrusted.
- Show useful preview errors and allow recovery.

Unreviewed third-party imports must not become executable previews automatically.

## VIEWPORT TESTING

Presets:
- Desktop: 1920×1080, 1440×900, 1280×720.
- Tablet: 1024×768, 768×1024.
- Mobile: 430×932, 390×844, 375×812, 360×800.

Allow custom dimensions. Preserve actual preview viewport dimensions while scaling the preview to fit the workspace. Switching presets must not reload the whole application.

## PERFORMANCE LAB

Measure actual browser-observable performance. Potential metrics:
- Average FPS.
- Frame time and frame-time variance.
- Approximate dropped frames.
- Long tasks.
- Initialisation time.
- JS heap usage when available.

Use requestAnimationFrame, Performance API, PerformanceObserver, resource timing and optional Chromium-specific memory APIs where supported.

Provide:
- Start, stop and reset.
- Warm-up period.
- Configurable sampling duration.
- Repeated runs.
- Results comparison.
- Charts and readable metric cards.

Record viewport, browser/device details where available, sampling duration, component version and timestamp.

Never fabricate measurements. Display N/A when unavailable. Do not claim exact GPU utilisation. Explain that browser measurements are approximate and may include preview/Observatory overhead. Avoid allowing benchmark instrumentation to dominate the measured animation.

## REDUCED-MOTION TESTING

Provide normal-motion and reduced-motion modes. Apply prefers-reduced-motion: reduce inside the preview and allow a manual override.

Test and record whether motion is disabled, simplified or replaced by a suitable static state. Display warnings when motion continues unnecessarily. Do not claim accessibility compliance merely because a toggle exists.

## SOURCE STUDIO

Use Shiki or an appropriate syntax highlighter.

Display:
- Syntax-highlighted source.
- Multi-file selection.
- Dependencies.
- Installation instructions.
- Required configuration.
- Usage examples.
- Licence and attribution information.

Provide functional actions to copy source, installation commands, usage examples and metadata. Preserve formatting and disclose companion files and dependencies.

## FAVOURITES AND COLLECTIONS

Implement favourite toggles, create/rename/delete collections, add/remove components, descriptions, notes, tags and exportable collection manifests.

Initial collections:
- LUNEVRA Website.
- LUNA.
- Game Websites.
- Experimental Animations.
- Commercially Approved.

Persist all changes across browser sessions.

## LICENCE MANAGER

Record:
- Licence name and version.
- Author.
- Original source and repository.
- Commercial-use permission.
- Modification permission.
- Redistribution restrictions.
- Attribution requirements.
- Verification status/date.
- Notes and licence reference.

Statuses: VERIFIED, REVIEW REQUIRED, RESTRICTED, UNKNOWN.

Flag unknown licences, missing attribution, commercial-use restrictions, redistribution restrictions and conflicting licence information.

Do not assume a component's licence from its parent library. Do not provide legal guarantees. Provide a manual verification workflow and retain source references.

## BRAND WORKSHOP

Editable tokens:
- Background and surfaces.
- Primary and secondary text.
- Accent and border.
- Heading and body fonts.
- Border radius.
- Spacing scale.

Presets:
1. LUNEVRA Original — graphite, silver, restrained cyan.
2. LUNEVRA Monochrome — black, white and neutral greys.
3. LUNEVRA Experimental — graphite and configurable accent.

Implement live preview, save, rename, duplicate, delete, reset, JSON export and validated JSON import. Apply themes through shared tokens without rewriting component source.

## PERSISTENCE

Use IndexedDB behind a modular persistence layer.

Persist component metadata/references, favourites, collections, themes, benchmark results, licence records, notes and recently viewed items.

Implement schema versioning, validation, migrations, backup, restore, import and export. Do not store large source files or benchmark history in localStorage. Do not introduce a remote backend or external account requirement for the initial release.

## SOURCING AND STARTER CATALOGUE

Curate real entries from:
- https://reactbits.dev/
- https://magicui.design/
- https://21st.dev/
- https://ui.aceternity.com/
- https://motion-primitives.com/
- https://animate-ui.com/
- https://gsap.com/
- https://threejs.org/
- https://rive.app/
- https://spline.design/

Use exact source links and identify actual components. Do not claim a component has been imported, tested or licence-verified unless that work has actually been done.

For the initial release, include a curated selection of real, properly attributed entries and original working demonstration components. Each entry must have source attribution, dependency information, a licence record and either a working preview adapter or a clear unavailable-preview state.

## RESPONSIVE DESIGN

Support desktop, laptop, tablet and mobile.

Desktop: persistent sidebar, large preview canvas, metadata and source panels.  
Tablet: collapsible sidebar and flexible workspace.  
Mobile: compact navigation, stacked preview/metadata and touch-friendly controls.

## PERFORMANCE AND ACCESSIBILITY

- Lazy-load component previews.
- Do not mount every demo simultaneously.
- Clean up animation loops, event listeners and observers.
- Dispose of WebGL resources.
- Avoid unnecessary React re-renders.
- Virtualise large galleries if required.
- Respect reduced-motion preferences.
- Provide keyboard navigation and semantic controls.
- Maintain sufficient contrast.
- Distinguish Observatory overhead from preview performance.

## RECOMMENDED STACK

- React + TypeScript + Vite.
- Tailwind CSS.
- shadcn/ui.
- Lucide.
- Motion for React.
- GSAP for advanced choreography when justified.
- Three.js only when WebGL is necessary.
- Shiki.
- IndexedDB.
- Vitest, React Testing Library and Playwright.

Keep the architecture modular. Do not add dependencies without a clear reason.

## TESTING

Test:
1. Registry validation.
2. Search and filtering.
3. Favourite persistence.
4. Collections.
5. Theme creation, persistence and import/export.
6. Clipboard actions.
7. Viewport switching.
8. Preview isolation and message validation.
9. Reduced-motion mode.
10. Benchmark execution and cancellation.
11. Licence warnings.
12. Backup and restore.
13. Mobile navigation.

Run unit, integration and end-to-end tests. Fix build errors and regressions.

## DOCUMENTATION

Create and maintain:
- README.md
- ARCHITECTURE.md
- COMPONENT_REGISTRY.md
- LICENSING.md
- CONTRIBUTING.md

## DEFINITION OF DONE

The dashboard, library, search, filters, live previews, viewport testing, genuine performance measurements, reduced-motion testing, source copying, favourites, collections, licence manager, theme workshop and data import/export must work.

No fake statistics, fake benchmark results, inert critical controls or screenshots presented as live previews.

If a third-party integration cannot be completed, provide an honest unavailable state and document the limitation.

## IMPLEMENTATION WORKFLOW

1. Inspect the repository.
2. Establish design tokens, routing, persistence and layout.
3. Implement registry, gallery, search and filters.
4. Implement isolated previews and viewport controls.
5. Implement performance and reduced-motion testing.
6. Implement source inspection and clipboard actions.
7. Implement favourites, collections and notes.
8. Implement licence manager.
9. Implement Brand Workshop.
10. Polish responsive design, accessibility and error handling.
11. Run tests and production build.
12. Update documentation.

Work autonomously through the implementation. Make sensible decisions without asking for approval after every section. Preserve existing working code.

**Final creative principle:** Make it feel expensive, not flashy. Make it useful, not decorative. Build it as infrastructure that can serve multiple future LUNEVRA products.

Begin by inspecting the repository and proceed with implementation.
