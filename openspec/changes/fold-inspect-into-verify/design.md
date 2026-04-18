## Context

Inspect and verify currently share most of their implementation shape: both load
change context, read the same artifact set, gather verify-style evidence, and
produce structured implementation analysis. The only durable difference is that
inspect narrows the report to one task or feature scope. That makes inspect a
poor standalone public workflow but a good internal helper that verify and other
skills can reuse.

The system already has public workflow registration, skill generation, slash
command generation, onboarding references, and clarify recommendations wired
around `inspect` as if it were a first-class user command. Folding inspect into
verify therefore requires coordinated changes across template generation,
workflow profiles, init/update output, and specs, not just a single prompt edit.

## Goals / Non-Goals

**Goals:**
- Remove `/opsx:inspect` from the public user-facing workflow surface.
- Preserve the scoped deep-analysis logic as an internal helper that other
  workflows can invoke.
- Let `/opsx:verify` own the public deep-analysis story for implementation
  validation.
- Update init/update/onboard/clarify guidance so users are no longer directed to
  a public inspect command.

**Non-Goals:**
- Removing or rewriting the underlying scoped-inspection logic entirely.
- Expanding verify into a brand-new public multi-command interface.
- Changing unrelated workflow IDs or command namespaces beyond removing inspect
  from the public set.

## Decisions

### 1. Keep inspect logic as an internal helper, not a public workflow

The inspect template logic should remain available as reusable internal logic,
but it should no longer be generated as a public skill or slash command. This
preserves the useful scoped-analysis behavior while shrinking the exposed user
surface.

Alternative considered: delete inspect entirely and inline everything into
verify. Rejected because scoped inspection is still useful as a reusable helper
for verify and possibly other future workflows.

### 2. Make verify the public owner of deep scoped implementation analysis

Public user guidance should point to `/opsx:verify` for deep implementation
analysis. Verify can internally trigger the inspect-style scoped pass when the
caller or workflow context needs a task- or feature-level drill-down.

Alternative considered: keep `/opsx:inspect` public but mark it advanced.
Rejected because it still leaves two highly overlapping public workflows.

### 3. Remove inspect from generated workflow inventories

Public generation surfaces should stop treating inspect as part of the installed
workflow set:
- no generated `openspec-inspect-change` public skill
- no generated `/opsx:inspect` command
- no public workflow list/profile entry for inspect

This keeps init/update/profile sync behavior explicit rather than relying on
hidden files or ad hoc filtering.

### 4. Update user guidance to redirect to verify

Onboarding, clarify, and other public guidance should stop recommending inspect.
Where the old guidance pointed to inspect for deep scoped analysis, it should now
point to verify, with wording that makes scoped deep analysis part of verify's
job.

## Risks / Trade-offs

- [Verify becomes heavier] -> Mitigation: keep inspect logic as an internal
  scoped helper so verify can opt into it only when needed.
- [Existing users remember `/opsx:inspect`] -> Mitigation: remove it from public
  generation and guidance consistently so the supported path is unambiguous.
- [Generation counts and tests drift] -> Mitigation: update cli-init specs,
  workflow lists, and generation tests together.
- [Internal helper becomes orphaned] -> Mitigation: explicitly document that the
  inspect capability remains internal and callable by other workflows.

## Migration Plan

1. Reclassify inspect as an internal helper in the workflow specs.
2. Update verify templates to own the public scoped-analysis path.
3. Remove inspect from skill/command generation and public workflow lists.
4. Update onboarding and clarify references.
5. Refresh tests and validate the new generated surface.
