## 1. Delta ownership model and manifest updates

- [x] 1.1 Update the OpenSpeX path resolver and constants so change-owned deltas
  live under `openspec/changes/<change>/shadow-deltas/` while canonical shadow
  specs and changelogs remain under `openspec/impl-specs/`.
- [x] 1.2 Extend the managed-file manifest format and helpers to store canonical
  shadow paths separately from the change-owned delta path.
- [x] 1.3 Update scaffolding for new OpenSpeX managed files so the change-owned
  delta file is created in the new location.

## 2. Compatibility and workflow integration

- [x] 2.1 Add compatibility handling for active changes that still use the
  legacy colocated delta layout, including deterministic migration or
  path-specific blocking messages.
- [x] 2.2 Update `openspec new change`, `openspec status`, and `openspec
  instructions apply` to surface the new delta location and any migration needs.
- [x] 2.3 Update verify-time merge-back so it reads from the change-owned delta
  path and preserves accepted deltas in the change for archive provenance.

## 3. Validation and documentation

- [x] 3.1 Add unit and integration tests for change-owned delta path
  resolution, manifest persistence, and legacy delta migration behavior.
- [x] 3.2 Add workflow tests for apply and verify behavior with missing,
  migrated, and conflicting delta paths, including Windows-focused path cases.
- [x] 3.3 Update specs, docs, and generated workflow templates to explain that
  OpenSpeX deltas are change-owned while canonical shadow specs remain file-owned.
