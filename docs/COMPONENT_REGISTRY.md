# Component registry

The catalogue lives in `src/domain/registry.ts`. Each record includes an ID, name, description, category, tags, framework, dependencies, provenance, licence record, reduced-motion behavior, installation and usage notes, source files, preview kind, preview availability and date. The registry exports `validateRegistry` for shape checks.

`preview: true` means the entry selects an original local visual demonstration adapter. It does not mean a standalone source package exists. `preview: false` records third party discovery references that are not imported, executable or licence verified. Preserve that distinction when adding entries. The repository has not selected a distribution licence, so even original demonstrations are currently marked `Unknown`. A component's licence must be verified from its own source; do not infer it from its parent library.

Before a third party preview is enabled, record the exact component source, author, source repository, dependencies, licence text/reference, attribution, modification and redistribution terms, commercial permission, reduced-motion behavior and a reviewed preview adapter.
