## Why

OpenSpec currently treats a change as a documentation scaffold plus optional implementation follow-through, but it does not strictly enforce git-scoped execution or file-level spec traceability. That leaves too much room for branch drift, undocumented code edits, and weak acceptance checks that can miss whether the final implementation really honored the intended change contract.

## What Changes

- Introduce an OpenSpeX variant of the change workflow that requires every active change to live in a dedicated git worktree and branch, move through pull-request review, and finish through merge-driven completion.
- Require every OpenSpeX-managed code file to have a corresponding shadow `impl-spec`; test files are treated like any other managed code file and also get shadow `impl-spec` coverage rather than a separate `test-spec` track.
- Require a shadow-path `*.delta.md` file to exist before any managed source or test file can be formally edited for a change.
- Merge accepted delta content back into the canonical shadow `impl-spec` after implementation and verification, and append a changelog entry for every affected shadow spec.
- Strengthen `/opsx:verify` so it performs stricter readiness and acceptance checks than `/opsx:apply`, including git workflow evidence, delta-to-implementation coverage, and post-pass merge-back into shadow `impl-spec` files with changelog updates.

## Capabilities

### New Capabilities

- `git-change-governance`: Enforce worktree, branch, PR, and merge-based lifecycle rules for OpenSpeX changes.
- `shadow-impl-spec-workflow`: Define file-level shadow `impl-spec` mapping, delta-first editing, merge-back behavior, and changelog maintenance for managed code files.

### Modified Capabilities

- `openspec-conventions`: Update lifecycle and structure conventions to describe OpenSpeX shadow specs, delta-first editing, and merge-based completion.
- `cli-artifact-workflow`: Require git-aware change scaffolding and stricter apply-readiness checks before implementation can begin.
- `opsx-verify-skill`: Expand verification to enforce OpenSpeX workflow invariants and stricter acceptance gates.

## Impact

- Affected code: change scaffolding and apply-readiness logic, git/worktree orchestration utilities, verify skill templates, and shadow-spec synchronization helpers.
- Affected artifacts: `openspec/changes/<name>/` lifecycle metadata, per-file shadow `impl-spec` and `*.delta.md` documents, and changelog entries maintained alongside shadow specs.
- Affected workflows: proposing, applying, verifying, and closing a change now depend on git lifecycle state and shadow-spec hygiene instead of task completion alone.
