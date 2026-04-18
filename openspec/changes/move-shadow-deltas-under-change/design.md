## Context

The first OpenSpeX implementation deliberately colocated change deltas under the
canonical shadow `impl-spec` tree so every managed file kept all of its related
artifacts together. That works mechanically, but it mixes two different kinds of
state:

- file-owned, long-lived shadow truth (`spec.md` and `CHANGELOG.md`)
- change-owned, short-lived implementation deltas

The user question behind this change is whether delta shadow paths should be
managed by the change instead. The answer is yes: deltas are authored for one
change, reviewed in the context of that change, and should archive naturally
with that change. The stable shadow tree should keep only canonical file-level
history.

## Goals / Non-Goals

**Goals:**

- Make OpenSpeX implementation deltas change-owned rather than shadow-tree-owned.
- Preserve canonical per-file `impl-spec` and changelog files under
  `openspec/impl-specs/`.
- Keep managed-file manifests explicit, deterministic, and cross-platform.
- Support migration or compatibility handling for active changes created under
  the legacy colocated-delta layout.
- Make archive provenance more intuitive by keeping deltas inside the change
  directory that produced them.

**Non-Goals:**

- Changing the canonical location of shadow `impl-spec` or `CHANGELOG.md` files.
- Replacing the existing managed-file manifest with glob-based discovery.
- Changing git worktree, branch, PR, or merge metadata behavior.
- Removing archived legacy changes or rewriting already archived delta paths.

## Decisions

### 1. Split file-owned artifacts from change-owned artifacts

The canonical shadow tree should remain file-owned and contain only stable
artifacts:

```text
openspec/impl-specs/<repo-relative-file>/spec.md
openspec/impl-specs/<repo-relative-file>/CHANGELOG.md
```

Change-specific deltas move into a mirrored subtree under the change itself:

```text
openspec/changes/<change>/shadow-deltas/<repo-relative-file>.delta.md
```

This makes ownership obvious:

- canonical shadow spec and changelog belong to the managed file
- the working delta belongs to the change

Alternative considered: keep deltas under `openspec/impl-specs/.../deltas/` and
only improve documentation. Rejected because the path itself continues to encode
file ownership instead of change ownership.

### 2. Extend the managed-file inventory to store both canonical and change-owned paths

OpenSpeX already relies on explicit managed-file inventory entries. That
manifest should now persist:

- repo-relative managed file path
- canonical shadow spec path
- canonical changelog path
- change-owned delta path

This avoids any need to infer delta ownership from path conventions alone, and
it keeps apply/verify/archive flows aligned on the same explicit record.

### 3. Use a deterministic mirrored delta path rooted at `shadow-deltas/`

The change-owned delta root should be named `shadow-deltas/` to distinguish it
from behavior-spec deltas under `specs/`. The repo-relative file path should be
preserved deterministically, with a `.delta.md` suffix appended to the managed
file name.

Example:

```text
openspec/changes/move-shadow-deltas-under-change/shadow-deltas/src/utils/openspex.ts.delta.md
```

Implementation rule: compute these paths with `path.join()` or `path.resolve()`
from normalized path segments so macOS, Linux, and Windows all behave the same.

### 4. Treat legacy colocated deltas as migratable compatibility input

Active OpenSpeX changes created before this update may already have deltas in
`openspec/impl-specs/.../deltas/<change>.delta.md`. The workflow should not fail
silently or ignore them.

The resolver should support a migration step or explicit warning path:

- if the new change-owned delta exists, use it
- if only the legacy delta exists, surface a migration action or move it into
  the new change-owned location
- if both exist and disagree, block apply/verify until the user resolves the
  conflict explicitly

This keeps the behavior deterministic and avoids hidden precedence.

### 5. Verify merges from the change-owned delta, not the shadow tree

`/opsx:verify` should read accepted deltas from the change-owned path and merge
that content into the canonical shadow `impl-spec`, then append changelog
entries in the stable shadow tree. The delta remains inside the change so the
archived change preserves the exact input that was reviewed and merged.

Alternative considered: delete or relocate the delta during verify after
merge-back. Rejected because it weakens archive provenance and makes post-hoc
review harder.

## Risks / Trade-offs

- [Two path roots instead of one] More roots can look more complex -> Mitigation:
  keep the ownership model explicit and encode both paths in the managed-file
  manifest.
- [Migration edge cases] Existing active changes may have legacy deltas already
  edited in place -> Mitigation: add explicit compatibility checks and
  path-specific error messages before apply/verify proceeds.
- [Naming confusion] `shadow-deltas/` could be confused with behavior-spec
  deltas -> Mitigation: keep it nested inside each change and document the
  difference clearly in workflow templates and conventions.
- [Windows suffix/path bugs] Appending `.delta.md` to mirrored file names can be
  mishandled by naive string operations -> Mitigation: centralize path-building
  helpers and add Windows-focused tests.

## Migration Plan

1. Update path resolvers and manifest schema to compute and store change-owned
   delta paths.
2. Update scaffolding so new OpenSpeX managed files create deltas under
   `openspec/changes/<change>/shadow-deltas/`.
3. Add apply/verify compatibility checks for legacy colocated deltas.
4. Update verify merge-back logic to read from the change-owned delta path while
   still writing canonical shadow spec and changelog files.
5. Update docs, templates, and tests to reflect the new ownership model.

Rollback strategy: because the canonical shadow `impl-spec` and changelog paths
stay unchanged, disabling the new delta resolver mostly means reverting to the
legacy delta location without disturbing file-owned shadow history.

## Open Questions

- Should compatibility mode auto-move legacy colocated deltas on first use, or
  should it always require an explicit migration command or confirmation?
- Is `shadow-deltas/` the clearest root name, or would `impl-spec-deltas/` be
  more self-explanatory despite being longer?
