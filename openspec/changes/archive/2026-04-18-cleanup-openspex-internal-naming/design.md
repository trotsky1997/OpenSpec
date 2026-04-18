## Context

The first SolidSpec rename intentionally left several `openspex`-named internals
in place to reduce risk. That succeeded for user-facing surfaces, but the repo
now has mixed internal naming across source files, exported helpers, spec
folders, test file names, and machine-facing instruction payload keys. The
remaining cleanup should make `SolidSpec` the canonical internal name without
breaking existing repositories or tests that still import or inspect
`openspex`-named surfaces.

## Goals / Non-Goals

**Goals:**
- Rename the canonical internal implementation entry points from `openspex` to
  `solidspec`.
- Replace remaining `OpenSpeX`-named spec folders, test files, and context key
  names with `SolidSpec` equivalents.
- Keep narrow compatibility shims where existing imports or metadata still need
  a migration window.
- Preserve cross-platform path behavior while renaming files and generated
  lookup keys.

**Non-Goals:**
- Removing all support for legacy `openspex` metadata in the same change.
- Renaming `/opsx:*` commands; those are already intentionally retained.
- Rewriting archived change history to match the new internal names.

## Decisions

### 1. Rename source-of-truth modules, keep thin legacy wrappers

The main utility module should move from `src/utils/openspex.ts` to a canonical
`src/utils/solidspec.ts`, with the old module becoming a compatibility re-export
only if existing imports still rely on it. This pattern keeps new development on
one canonical module while avoiding immediate breakage.

### 2. Canonicalize machine-facing keys to `solidspec*`

Apply/status/instruction context payloads should expose canonical
`solidspecManagedFiles`, `solidspecDiscipline`, and related keys. Legacy
`openspex*` reads may remain temporarily where tests or downstream consumers
still need them, but new code should stop generating new `openspex*` names.

### 3. Rename strict-workflow specs and tests where the old name is no longer a compatibility surface

Spec folder names, test filenames, and describe-block labels that exist only for
maintainer comprehension should move to `solidspec` names. Compatibility-only
surfaces like legacy metadata aliases can continue mentioning `openspex`
explicitly where that documents supported migration behavior.

### 4. Migrate in layers: modules and exports first, then tests and spec IDs

The cleanup should proceed in a safe order:
1. canonical modules/types/constants
2. compatibility exports and import rewrites
3. machine-facing key renames
4. spec/test/file renames and parity/hash refreshes

This keeps the build green at each stage and narrows the blast radius when a
rename touches generated files or snapshots.

## Risks / Trade-offs

- [Compatibility shim drift] -> Mitigation: keep thin wrappers minimal and test
  both canonical and legacy import paths during the migration window.
- [Machine-facing key breakage] -> Mitigation: rename canonical keys explicitly
  and add targeted regression tests before removing any legacy aliases.
- [Large file rename churn] -> Mitigation: do the rename in a focused follow-up
  change with updated parity hashes and targeted test coverage.
- [Spec folder rename confusion] -> Mitigation: document the new canonical spec
  IDs and add migration notes where old capability names are still referenced.

## Migration Plan

1. Introduce canonical `solidspec` modules and exported symbols.
2. Repoint imports and runtime call sites to the new names.
3. Rename canonical context keys and update tests.
4. Rename spec folders and test files that are not part of the compatibility
   contract.
5. Run full build/test/spec validation before archiving.

## Open Questions

- Should legacy `openspex*` context keys be emitted alongside the new
  `solidspec*` keys for one release, or should they be read-only compatibility
  aliases?
