# Dependency inventory status

**Status:** initial manifest review only.

The repository contains a `pnpm-lock.yaml` file. Its presence is a positive reproducibility signal, but its package graph and license metadata were not parsed in this pass. No npm lockfile was found.

## Required before release

1. Use the repository's pnpm version/package-manager declaration and frozen-lockfile installation in CI.
2. Generate a license inventory from the resolved pnpm dependency graph.
3. Verify third-party fonts, images, icons, and other assets independently.
4. Review any proprietary or company-owned components separately from open-source dependencies.

Do not treat this document as a third-party license notice or a statement that dependencies have been legally cleared. Update it after a machine-generated license report is reviewed.
