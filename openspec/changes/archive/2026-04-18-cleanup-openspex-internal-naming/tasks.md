## 1. Canonical module and type renames

- [x] 1.1 Move strict-workflow source-of-truth utilities and exported symbols from `openspex` names to `solidspec` names.
- [x] 1.2 Update imports, types, constants, and helper names across the CLI/runtime to use the canonical `solidspec` identifiers.
- [x] 1.3 Keep only the minimum legacy compatibility shims needed for old `openspex` imports and metadata.

## 2. Runtime payload and spec naming cleanup

- [x] 2.1 Rename canonical strict-workflow context keys and internal payload fields from `openspex*` to `solidspec*`.
- [x] 2.2 Rename maintained spec folders or capability identifiers that still use the old `openspex` name where they are no longer compatibility surfaces.
- [x] 2.3 Update workflow/docs references so maintained internal guidance stops extending old `openspex` terminology.

## 3. Tests and validation

- [x] 3.1 Rename and refresh tests/fixtures that still use `openspex` as the maintained internal identifier.
- [x] 3.2 Add regression coverage for compatibility shims and canonical `solidspec*` runtime outputs.
- [x] 3.3 Run build, focused tests, full validation, and `openspec` checks for `cleanup-openspex-internal-naming`.
