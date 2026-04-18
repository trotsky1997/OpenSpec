## 1. OpenSpeX metadata and git governance foundation

- [x] 1.1 Extend change metadata parsing and validation to persist the OpenSpeX
  variant plus branch, worktree, PR, and merge fields.
- [x] 1.2 Implement OpenSpeX worktree and branch setup flows, including
  actionable failures when the project is not in a git repository.
- [x] 1.3 Add command-level tests for OpenSpeX creation, metadata persistence,
  and git-governance status reporting.

## 2. Shadow impl-spec infrastructure

- [x] 2.1 Add a shared resolver that maps repo-relative source and test files
  into `openspec/impl-specs/` shadow paths using cross-platform path utilities.
- [x] 2.2 Define the managed-file inventory format and helper utilities that
  resolve canonical `spec.md`, `CHANGELOG.md`, and `<change>.delta.md` paths by
  explicit lookup.
- [x] 2.3 Implement scaffolding helpers for shadow `impl-spec`, changelog, and
  per-change delta documents for newly managed files.

## 3. Apply gating and workflow integration

- [x] 3.1 Update `openspec new change`, `openspec status`, and `openspec
  instructions apply` to surface OpenSpeX variant state and missing git
  prerequisites.
- [x] 3.2 Block apply when an OpenSpeX change lacks its managed-file inventory
  or any declared managed file lacks the required `.delta.md`.
- [x] 3.3 Carry managed-file and shadow-path context into apply instructions so
  agents only make formal edits against declared files.

## 4. Verify-driven closeout

- [x] 4.1 Extend `/opsx:verify` generation and workflow logic to validate git
  evidence, managed-file inventory, and delta coverage for both source and test
  files.
- [x] 4.2 Implement verify-time merge-back from accepted deltas into canonical
  shadow `impl-spec` files plus matching changelog updates.
- [x] 4.3 Fail verify on undeclared changed files, missing completion evidence,
  or any shadow merge-back error.

## 5. Validation and documentation

- [x] 5.1 Add unit and integration tests for shadow-path resolution,
  managed-file gating, and verify closeout behavior.
- [x] 5.2 Add Windows-focused coverage for worktree and shadow-path handling in
  automated tests or CI.
- [x] 5.3 Update workflow docs and generated command/skill templates to explain
  OpenSpeX variant selection, delta-first editing, and verify-driven shadow
  closure.
