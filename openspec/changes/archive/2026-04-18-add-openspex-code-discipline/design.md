## Context

OpenSpeX already establishes strict git workflow discipline and strict
shadow-spec closure, but the implementation body is still governed mostly by
social convention. A contributor can satisfy worktree and delta rules while
still producing weakly typed, model-less, or analyzer-failing code. The user is
asking for a harsher regime: OpenSpeX should also demand explicit object/model
boundaries, explicit typing discipline, and mandatory static-analysis gates such
as `ruff`, `ty`, `pyright`, or project-equivalent lint/typecheck commands.

This needs to remain compatible with the current artifact-driven CLI, explicit
manifest philosophy, and cross-language reality. The repository itself is
TypeScript, but the new OpenSpeX rules should be language-agnostic enough to
cover Python-style `ruff` / `ty` workflows and TypeScript-style lint/typecheck
workflows under the same conceptual model.

## Goals / Non-Goals

**Goals:**

- Extend OpenSpeX from git-only rigor to code-discipline rigor.
- Require explicit declaration of validation commands for governed changes.
- Require explicit model/type boundaries for OpenSpeX-managed code.
- Block apply when an OpenSpeX change lacks its discipline profile.
- Fail verify when declared discipline gates fail or when governed code violates
  documented model/type rules.

**Non-Goals:**

- Replacing project-level linters, typecheckers, or build systems.
- Hardcoding one language stack or one analyzer family.
- Guaranteeing semantic correctness purely from static-analysis success.
- Retroactively applying strict model/type gates to non-OpenSpeX changes.

## Decisions

### 1. Add an explicit OpenSpeX discipline manifest per change

OpenSpeX should not guess which code-discipline rules apply to a change. Each
OpenSpeX change should declare an explicit discipline manifest, for example a
file such as `discipline.yaml` inside the change directory.

That manifest should describe:

- required validation commands
- the intended model/type discipline policy
- any explicit exceptions or waivers

Why this approach:

- it keeps enforcement explicit instead of magical
- it supports different languages and toolchains cleanly
- it matches the existing OpenSpeX preference for explicit manifests over
  heuristics

Alternative considered: infer required commands from the repo automatically.
Rejected because tool inference is brittle and hides the contract reviewers need
to see.

### 2. Treat model/type discipline as a first-class policy, not a style hint

The discipline manifest should express explicit policy expectations, such as:

- governed code must use explicit domain models or typed interfaces/classes for
  important state and boundaries
- loose or untyped escape hatches require an explicit documented exception
- language-appropriate strict typing must remain enabled for governed code

This keeps the rule set outcome-oriented while still being testable through
verify and inspect workflows.

### 3. Keep validation commands explicit and project-appropriate

Validation command definitions should be stored as an explicit list rather than a
fixed set of built-in command IDs. Example commands might include:

- `ruff check .`
- `ty check .`
- `pyright`
- `pnpm lint`
- `pnpm typecheck`

The system should care that:

- the commands are declared explicitly
- they are executed in the correct worktree context
- their pass/fail state is reflected in apply/verify logic

This avoids coupling OpenSpec too tightly to one ecosystem.

### 4. Apply blocks on missing discipline configuration, verify blocks on failures

The enforcement split should mirror the existing OpenSpeX pattern:

- **Apply readiness** requires that the discipline manifest and required command
  declarations exist.
- **Verify readiness** requires that the declared commands pass and that the
  governed code does not violate the declared model/type discipline without a
  documented waiver.

Alternative considered: force every validation command to pass before apply.
Rejected because it makes early iteration too rigid; declaration and command
availability are enough for apply, while successful execution belongs in verify.

### 5. Reuse inspect and verify as the main discipline audit surfaces

`/opsx:verify` should become the hard acceptance gate for discipline success.
`/opsx:inspect` can be used as a scoped aid to look at one feature or task's
model/type conformance, but the primary behavioral change belongs in verify and
apply-readiness logic.

This avoids inventing a separate audit command while still making discipline
analysis available at both broad and narrow scopes.

## Risks / Trade-offs

- [Cross-language ambiguity] Different languages express model/type rigor very
  differently -> Mitigation: enforce explicit per-change discipline manifests and
  project-specific command lists.
- [Over-constraining small changes] Strict discipline may feel heavy for tiny
  fixes -> Mitigation: keep the harsh rules scoped to OpenSpeX changes only.
- [False confidence] Passing lint/type gates does not prove design quality ->
  Mitigation: combine command success with explicit model/type policy checks in
  verify reporting.
- [Waiver abuse] Teams may overuse exceptions -> Mitigation: require explicit
  documented waivers inside the discipline manifest and surface them in verify.

## Migration Plan

1. Add a new discipline capability spec describing model/type and validation
   gate behavior.
2. Extend OpenSpeX conventions to include code-discipline policy.
3. Update apply-readiness logic to require a discipline manifest.
4. Update verify to run declared commands and report discipline violations.
5. Add tests and docs for both TypeScript-style and Python-style examples.

## Open Questions

- Should the first version store discipline configuration in `.openspec.yaml` or
  in a dedicated `discipline.yaml` file under the change directory?
- Should inspect explicitly gain a discipline-analysis subsection in a follow-up,
  or is verify plus the current scoped inspect model enough for v1?
