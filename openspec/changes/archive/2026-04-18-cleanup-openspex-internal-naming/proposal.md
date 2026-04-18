## Why

The first `SolidSpec` rename made the strict workflow user-facing name consistent, but the codebase still carries a large tail of internal `openspex` module names, spec folders, test files, and context keys. That mixed naming now creates avoidable maintenance cost because every strict-workflow change has to remember which surfaces are canonical and which are legacy leftovers.

## What Changes

- Rename the remaining internal strict-workflow implementation modules, types, helpers, and tests so `SolidSpec` becomes the canonical name inside the codebase.
- Move strict-workflow implementation entry points from `openspex`-named files and symbols to `solidspec`-named ones, while keeping thin compatibility shims where imports still need a migration window.
- Rename canonical spec and capability identifiers that still use `openspex` naming when they are intended to describe the `SolidSpec` workflow moving forward.
- Update status/apply/context payload keys and similar internal machine-facing surfaces so new `solidspec*` names are canonical, with explicit compatibility handling for legacy `openspex*` keys where needed.
- Refresh tests, fixtures, and generated references so future changes no longer extend the old internal name by accident.

## Capabilities

### New Capabilities

- `solidspec-internal-compatibility`: defines canonical internal `SolidSpec` identifiers and the compatibility guarantees for legacy `openspex` imports, keys, and metadata surfaces.

### Modified Capabilities

- `openspec-conventions`: make `SolidSpec` the canonical strict-workflow name not just in UX, but also in maintained spec and implementation naming guidance.
- `cli-artifact-workflow`: expose canonical `solidspec`-named runtime/context surfaces while preserving compatibility for legacy `openspex` inputs during migration.
- `git-change-governance`: update the strict git-governance capability naming and examples so the canonical internal workflow name is `SolidSpec`.
- `shadow-impl-spec-workflow`: update managed-file and shadow-spec requirements to refer to canonical `SolidSpec` naming in both code and documentation.
- `opsx-verify-skill`: update strict-workflow verification artifacts and evidence naming so new internal references use `SolidSpec`.

## Impact

- Affected code: strict-workflow utility modules, change metadata/types, instruction loading, workflow templates, tests, and spec folder naming.
- Affected compatibility surfaces: legacy `openspex` imports, machine-facing context keys, and archived test fixtures that still rely on the old identifiers.
- Affected maintainers: future strict-workflow changes can use one internal vocabulary instead of mixing `SolidSpec` and `openspex` names.
