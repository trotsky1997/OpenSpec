## Context

OpenSpec already provides `/opsx:verify` for whole-change validation, but users
sometimes need a deeper diagnostic pass over only one feature or one task. That
kind of investigation is narrower than archive readiness and often happens
mid-flight: a contributor wants to understand whether one requirement is really
implemented, whether one task is actually complete, or where the relevant code
and tests live.

The new `/opsx:inspect` workflow should therefore feel like a scoped,
verify-derived analysis tool rather than a second archive gate. It should reuse
verify-style evidence gathering, but focus its report on one selected slice of a
change.

## Goals / Non-Goals

**Goals:**

- Add a dedicated `/opsx:inspect` skill and slash command.
- Support inspection of either one task from `tasks.md` or one feature /
  requirement from the change specs.
- Reuse verify-style evidence gathering and reporting dimensions.
- Integrate inspect into generated tool workflows and onboarding references.
- Keep the workflow usable before, during, or after apply.

**Non-Goals:**

- Replacing `/opsx:verify` as the whole-change acceptance workflow.
- Introducing new CLI subcommands beyond generated skill/command content.
- Automatically modifying code, tasks, or specs as part of inspect.
- Requiring every inspect run to produce an archive-style pass/fail verdict.

## Decisions

### 1. Model inspect as a separate workflow built on verify heuristics

`/opsx:inspect` should be a distinct skill/command pair rather than an option
flag bolted onto `/opsx:verify`.

Why:

- it gives users a clear mental model: verify = broad gate, inspect = deep dive
- it keeps verify prompts shorter and focused on readiness
- it allows inspect to ask for scope-specific clarification without affecting
  verify behavior

Alternative considered: add a `--scope` mode to verify. Rejected because it
would overload one command with two different primary jobs.

### 2. Resolve scope in two stages: change first, then task or feature

Inspect should first resolve the target change, then resolve one scoped subject:

- task scope from `tasks.md` checkbox items
- feature scope from delta-spec requirements / requirement names

If the user provides neither clearly, the workflow should prompt. If the user
provides something ambiguous, the workflow should show the likely matches and
let them choose.

This keeps the workflow deterministic while still supporting natural language
requests like “inspect task 2.3” or “inspect the shadow delta migration
feature”.

### 3. Keep the inspection report deeper than verify, but scoped rather than global

Inspect should still use the three familiar lenses from verify:

- completeness
- correctness
- coherence

But unlike verify, it should limit the report to the selected scope and produce
more evidence detail, such as:

- which files appear to implement the target
- which tests cover the target
- what looks partial, missing, or divergent
- recommended follow-up work for just that target

It should not default to a whole-change “ready for archive” conclusion.

### 4. Generate inspect alongside the other OPSX workflows

The implementation should follow the established generated-template pattern used
for explore, new, continue, apply, ff, verify, sync, and archive:

- add `getInspectChangeSkillTemplate()`
- add `getOpsxInspectCommandTemplate()`
- register both in shared skill/command generation
- update init-generated workflow counts and onboarding command references

This keeps inspect consistent with the existing architecture and avoids one-off
static files.

### 5. Prefer requirement names over capability-level summaries for feature inspection

For spec-backed feature inspection, the workflow should primarily inspect a
specific requirement or scenario from the change deltas, not just a broad
capability folder.

Why:

- requirements are the most precise behavior unit already used by verify
- requirement names are what users are most likely to quote when asking about a
  feature
- tasks and requirements together cover both implementation and behavior views

Capability-level context can still be read, but the report should anchor itself
on one requirement when possible.

## Risks / Trade-offs

- [Scope ambiguity] Users may ask for a feature name that matches multiple
  requirements -> Mitigation: require an explicit selection when ambiguity is
  detected.
- [Report overlap with verify] Inspect could feel redundant if the output is too
  generic -> Mitigation: bias inspect toward deeper evidence and scoped next
  steps, not archive readiness.
- [Generated workflow sprawl] Another OPSX command increases setup surface area
  -> Mitigation: keep the implementation in the existing template-generation
  system and update docs/reference tables consistently.
- [Cross-platform file references] Inspect will cite many file paths ->
  Mitigation: use existing path canonicalization and avoid hardcoded separators.

## Migration Plan

1. Add the new inspect capability spec and supporting design for its scoped
   behavior.
2. Add inspect workflow templates and register them in skill/command generation.
3. Update init generation and onboarding references to include inspect.
4. Add tests for template generation and command surface updates.
5. Validate generated content and the affected spec files.

## Open Questions

- Should inspect support inspecting one scenario directly, or is requirement/task
  granularity enough for the first version?
- Should inspect always require a change name, or should it allow inspection of
  a main spec capability outside a change in a later follow-up?
