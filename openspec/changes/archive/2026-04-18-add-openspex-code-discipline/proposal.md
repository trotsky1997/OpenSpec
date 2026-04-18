## Why

OpenSpeX already enforces strict git worktree, branch, and merge discipline, but
it still leaves too much freedom inside the code itself. If the goal is a truly
high-discipline workflow, OpenSpeX also needs to require explicit model / type
boundaries, discourage loose or untyped implementation shortcuts, and enforce
language-appropriate static-analysis gates such as `ruff`, `ty`, `pyright`,
`pnpm lint`, or `pnpm typecheck` before a change can be considered acceptable.

## What Changes

- Add a new OpenSpeX code-discipline capability that requires explicit model /
  type programming discipline for governed changes.
- Require OpenSpeX changes to declare explicit validation commands for lint,
  type-check, and related static-analysis gates, using project-appropriate tools
  such as `ruff` / `ty` in Python projects or lint / typecheck commands in
  TypeScript projects.
- Block OpenSpeX apply-readiness unless the change declares its discipline
  profile and required validation command set.
- Make `/opsx:verify` enforce the stricter discipline by checking validation
  command success and flagging undocumented model/type escape hatches or missing
  typed-model boundaries as critical issues.
- Update OpenSpec conventions so OpenSpeX is explicitly defined as both a git
  discipline and a code-discipline workflow.

## Capabilities

### New Capabilities

- `openspex-code-discipline`: Define strict model/type programming rules and
  mandatory validation gates for OpenSpeX-managed changes.

### Modified Capabilities

- `openspec-conventions`: Extend OpenSpeX conventions to include code-discipline
  and validation-gate expectations in addition to git discipline.
- `cli-artifact-workflow`: Surface missing discipline profiles or validation
  command manifests as apply blockers for OpenSpeX changes.
- `opsx-verify-skill`: Enforce discipline-gate success and report model/type
  discipline violations during verify.

## Impact

- Affected code: OpenSpeX metadata or manifest handling, apply-readiness logic,
  verify workflow templates, and validation execution/reporting paths.
- Affected workflows: OpenSpeX changes gain mandatory static-analysis and
  type-discipline checks in addition to git and shadow-spec discipline.
- Affected projects: repos can express tool-appropriate strict gates such as
  `ruff` / `ty`, `pyright`, `pnpm lint`, or `pnpm typecheck` as required
  quality barriers for governed changes.
