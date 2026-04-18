## Context

OpenSpec already has a solid artifact workflow for `proposal.md`, `design.md`,
`specs/`, and `tasks.md`, but implementation is still largely trust-based after
that point. A change can exist without a dedicated git workspace, code can move
ahead of file-level documentation, and `/opsx:verify` currently acts more like a
best-effort audit than a hard release gate.

The requested OpenSpeX variant raises the rigor bar. It keeps the existing
artifact graph, but adds a stricter execution contract:

- every OpenSpeX change lives in its own worktree and branch
- every managed code file has a corresponding shadow `impl-spec`
- test files use the same shadow `impl-spec` model as source files
- every managed file must have a change-specific `.delta.md` before formal edits
- verification is responsible for proving the code, deltas, and shadow specs are
  back in sync before the change can be considered complete

This has to fit the current TypeScript CLI architecture, remain cross-platform,
and avoid a hard dependency on a specific forge API.

## Goals / Non-Goals

**Goals:**

- Add an opt-in OpenSpeX variant without breaking existing `spec-driven`
  changes.
- Enforce dedicated git worktree, branch, PR, and merge tracking for OpenSpeX
  changes.
- Add deterministic shadow `impl-spec` path resolution for both source and test
  files.
- Require delta-first editing for every OpenSpeX-managed file.
- Make `/opsx:verify` stricter than `/opsx:apply`, including shadow-spec and
  changelog closure checks.

**Non-Goals:**

- Replacing the default OpenSpec workflow for every project or every change.
- Introducing a separate `test-spec` track.
- Requiring live GitHub, GitLab, or Bitbucket API calls for PR state.
- Backfilling shadow specs for every untouched repository file in one migration.

## Decisions

### 1. Model OpenSpeX as a change-level variant on top of the existing schema

OpenSpeX should be a stricter mode layered on the existing artifact graph rather
than a separate CLI or a totally different schema family. The change metadata
can carry an explicit variant field plus an OpenSpeX-specific state block.

Why this approach:

- it preserves the existing `proposal -> design -> specs -> tasks -> apply`
  workflow instead of forking it
- current status and instruction loading already key off change metadata
- existing changes remain valid because the stricter rules only apply when the
  variant is explicitly enabled

Alternative considered: a fully separate `openspex` schema. Rejected because it
would duplicate most of the existing artifact graph while only changing the
execution rules.

### 2. Track git lifecycle through local metadata, not forge-specific APIs

OpenSpeX needs hard evidence that a change used its own worktree and branch and
reached PR/merge completion, but the first implementation should stay portable.
The CLI should use local git commands to create and inspect worktrees and store
explicit metadata for:

- repo root
- branch name
- worktree path
- PR reference or URL
- merge commit SHA
- cleanup state

This keeps the workflow host-agnostic. A future change can add provider-aware
validation, but v1 should treat PR references as explicit metadata plus local
merge evidence.

### 3. Store shadow specs in a mirrored directory tree rooted at `openspec/impl-specs/`

Each managed file should map to a stable shadow directory that preserves the
repo-relative path segments and uses the original file name as the terminal
folder. Example:

```text
openspec/impl-specs/src/commands/workflow/new-change.ts/spec.md
openspec/impl-specs/src/commands/workflow/new-change.ts/CHANGELOG.md
openspec/impl-specs/src/commands/workflow/new-change.ts/deltas/add-openspex-change-workflow.delta.md
```

Using a directory per managed file avoids file-name encoding tricks, works for
both source files and test files, and keeps `spec.md`, changelog, and per-change
deltas together.

Cross-platform rule: all resolver code must build these paths with
`path.join()` or `path.resolve()` from repo-relative segments. No string-based
slash replacement should be used.

### 4. Maintain an explicit managed-file manifest per change

OpenSpeX apply and verify cannot rely on guessing which files belong to a change.
Each OpenSpeX change should own a manifest inside its change directory that
lists the repo-relative managed files plus their resolved shadow paths.

That manifest becomes the source of truth for:

- which files need `.delta.md` documents before edits
- which shadow specs need merge-back and changelog updates
- which exact paths should be surfaced in status, apply, and verify output

This satisfies the existing project rule to prefer explicit lookups over glob or
regex inference.

### 5. Split execution into pre-edit, in-flight, and closeout checks

The stricter workflow needs three distinct checkpoints:

1. **Pre-edit gate**: change has OpenSpeX metadata, git workspace metadata, and
   delta files for every declared managed file.
2. **In-flight tracking**: apply works only against files listed in the managed
   manifest and records which deltas are still open.
3. **Closeout gate**: verify proves that each delta is reflected in code and,
   on success, merges it into the canonical shadow `impl-spec` and records the
   shadow changelog entry.

This keeps `/opsx:apply` focused on implementation readiness while making
`/opsx:verify` the stricter authority on closure.

### 6. Keep verify stricter than apply

`/opsx:apply` should remain the command that unblocks coding once prerequisites
exist. `/opsx:verify` should add the higher bar:

- worktree/branch metadata must still match repository state
- PR and merge evidence must be present for completion-ready changes
- every managed source or test file must have delta coverage
- every accepted delta must be mergeable back into the canonical shadow
  `impl-spec`
- every affected shadow spec must receive a changelog entry during verify

Alternative considered: making `/opsx:apply` enforce all closeout checks.
Rejected because it would make implementation progress difficult to stage and
would blur the boundary between “ready to code” and “ready to merge”.

## Risks / Trade-offs

- [Workflow overhead] More bookkeeping can make small changes feel heavier ->
  Mitigation: keep OpenSpeX opt-in and automate metadata/path generation.
- [Manifest drift] Managed-file manifests can fall out of sync with actual edits
  -> Mitigation: verify changed files against git diff and report undeclared
  files as critical issues.
- [Shadow tree growth] File-level shadow specs add many documents -> Mitigation:
  only require coverage for files managed by OpenSpeX changes and keep the path
  layout deterministic.
- [Host ambiguity] PR state is harder to verify without forge APIs -> Mitigation:
  require explicit PR reference metadata plus local merge evidence in v1.
- [Windows path bugs] Mirrored path trees are easy to break with slash
  assumptions -> Mitigation: centralize path resolution helpers and require
  Windows-specific tests.

## Migration Plan

1. Extend change metadata and workflow commands to recognize the OpenSpeX
   variant plus git state.
2. Add a shared shadow-path resolver and managed-file manifest format.
3. Add CLI/apply gating so OpenSpeX changes cannot start formal edits without
   manifest-backed delta files.
4. Extend verify to enforce git evidence, delta coverage, merge-back, and
   changelog closure.
5. Roll the same resolver and validation utilities into any follow-on archive or
   sync automation so closeout stays deterministic.

Rollback strategy: because OpenSpeX is variant-scoped, the code can disable the
variant check path without invalidating standard OpenSpec changes. Existing
change directories and specs remain readable even if OpenSpeX-specific metadata
is ignored.

## Open Questions

- Should PR state remain a manually recorded reference in v1, or is there enough
  value to include optional forge-provider adapters immediately?
- Do we want OpenSpeX to become selectable through a dedicated `--variant`
  switch, through schema defaults, or through both?
