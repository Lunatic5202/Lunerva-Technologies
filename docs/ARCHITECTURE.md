# Architecture

## Application

- `src/main.tsx` boots React and the global stylesheet.
- `src/domain/registry.ts` defines typed component metadata, provenance and preview availability.
- `src/domain/themes.ts` defines brand tokens and validates imported themes.
- `src/storage/database.ts` stores workspace data and benchmark history in IndexedDB, validates backups, and migrates the earlier `obs-*` localStorage preferences.
- `src/preview/documents.ts` builds standalone documents for the original local demos.
- `src/features/PreviewWorkspace.tsx` hosts demos in sandboxed iframes and collects approximate browser frame measurements.
- `src/features/` contains the licence, theme and collection management views.
- `src/App.tsx` composes the dashboard, catalogue, navigation and feature views.

## Trust boundaries

Only explicit local preview adapters are rendered. Third party records are metadata and source links, not executable code. Preview iframes use `sandbox="allow-scripts"` without same-origin privileges. Do not add `eval`, `Function`, or same-origin sandbox privileges to preview arbitrary source.

## Persistence

Workspace records use IndexedDB with a schema version. Backup imports are validated before state is restored. The backup contains catalogue IDs, user preferences, manual licence review notes, collections, themes and measurements; it does not contain imported source code. Keep migrations explicit when changing the stored shape.

## Measurement limits

The Performance Lab samples requestAnimationFrame timing in the current browser. Results include browser and Observatory overhead. Long task observation and JS heap availability vary by browser. Initialization timing is not measured and is shown as unavailable.
