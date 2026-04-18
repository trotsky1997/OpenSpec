## Why

OpenSpeX currently stores each managed file's change delta under the canonical
shadow `impl-spec` tree, which makes a change-scoped document feel file-owned
instead of change-owned. That blurs the mental model: the canonical shadow spec
is stable project history, while the delta is temporary change evidence that is
more intuitive to create, review, and archive alongside the change itself.

## What Changes

- Move OpenSpeX managed-file delta documents out of `openspec/impl-specs/...`
  and into mirrored paths rooted under `openspec/changes/<change>/`.
- Keep canonical shadow `impl-spec` files and their changelogs in
  `openspec/impl-specs/...`, so only stable per-file documentation remains in
  the shadow tree.
- Update managed-file inventories, apply readiness checks, and verify merge-back
  logic to use the change-owned delta path as the source of truth for in-flight
  implementation work.
- Add migration behavior for active OpenSpeX changes that still use the legacy
  colocated delta layout, with clear path-specific guidance when migration or
  reconciliation is needed.
- Preserve the change-owned delta record through archive so the archived change
  naturally carries its own implementation delta history.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `shadow-impl-spec-workflow`: Change delta storage from shadow-tree-owned to
  change-owned while preserving canonical shadow spec and changelog behavior.
- `openspec-conventions`: Update OpenSpeX path conventions so canonical shadow
  specs remain file-owned and implementation deltas become change-owned.
- `cli-artifact-workflow`: Update scaffolding, managed-file inventory, and apply
  readiness checks to resolve and validate the new delta location.
- `opsx-verify-skill`: Update verification and merge-back rules to read from
  change-owned deltas and report legacy-path migration issues clearly.

## Impact

- Affected code: OpenSpeX path resolvers, managed-file manifest/schema,
  scaffolding helpers, apply instruction generation, and verify closeout logic.
- Affected artifacts: `openspec/changes/<name>/` gains a canonical
  `shadow-deltas/` subtree, while `openspec/impl-specs/` stops owning live
  change deltas.
- Affected workflows: OpenSpeX creation, apply, verify, migration of active
  changes, and archive provenance all become more change-centric and easier to
  reason about.
