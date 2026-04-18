## Context

Verify and apply are now much closer than their original separation implied.
Apply already loads all artifact context, tracks implementation progress, and
knows when work is blocked or finished. Verify performs another full pass over
that same change to judge readiness and consistency. That duplicate public
surface makes sense if verify stays meaningfully distinct, but the design goal
here is to make verification an internal helper for apply rather than a
standalone user workflow.

The current system exposes verify in generated skills, slash commands, workflow
profiles, onboarding, and clarify recommendations. Folding verify into apply
therefore requires coordinated changes across public workflow generation,
templates, profile-visible workflow lists, and user guidance, while preserving
verify-style logic for internal workflow-to-workflow use.

## Goals / Non-Goals

**Goals:**
- Remove `/opsx:verify` from the public user-facing workflow surface.
- Preserve verify-style validation logic as an internal helper that apply and
  other workflows can invoke.
- Let `/opsx:apply` own the public implementation + validation path.
- Update init/update/onboard/clarify guidance so users are directed to apply
  instead of verify.

**Non-Goals:**
- Deleting the underlying validation logic entirely.
- Replacing apply with a separate new public workflow family.
- Removing unrelated command aliases or non-verify workflows.

## Decisions

### 1. Keep verify logic as an internal helper, not a public workflow

The verify template logic should remain available as reusable internal logic, but
it should no longer be generated as a public skill or slash command. This keeps
the validation behavior available without maintaining an extra public command.

Alternative considered: delete verify entirely and inline all validation wording
into apply. Rejected because the validation logic is still valuable as a
reusable helper for apply and future internal workflow composition.

### 2. Make apply the public owner of implementation-time validation

Public user guidance should point to `/opsx:apply` for both implementation and
validation. Apply can internally trigger verify-style passes when it needs
readiness checks, scoped analysis, or closure-style assessment during the
implementation loop.

Alternative considered: keep `/opsx:verify` public but de-emphasize it.
Rejected because it still leaves two overlapping public workflows.

### 3. Remove verify from generated workflow inventories

Public generation surfaces should stop treating verify as part of the installed
workflow set:
- no generated `openspec-verify-change` public skill
- no generated `/opsx:verify` command
- no public workflow list/profile entry for verify

This keeps init/update/profile sync behavior explicit and prevents public drift.

### 4. Redirect user guidance to apply

Onboarding, clarify, and related public guidance should stop recommending
verify. Where the old guidance pointed to verify for readiness or deep analysis,
it should now point to apply, with wording that makes internal validation part
of apply's job.

## Risks / Trade-offs

- [Apply becomes heavier] -> Mitigation: keep verify logic as an internal helper
  so apply can invoke it only when needed.
- [Existing users remember `/opsx:verify`] -> Mitigation: remove it from public
  generation and guidance consistently so the supported path is unambiguous.
- [Generation counts and workflow lists drift] -> Mitigation: update cli-init
  specs, profile lists, and generation tests together.
- [Internal validation helper becomes disconnected] -> Mitigation: explicitly
  document that verify remains internal and callable by other workflows.

## Migration Plan

1. Reclassify verify as an internal helper in the workflow specs.
2. Update apply templates to own the public implementation + validation path.
3. Remove verify from skill/command generation and public workflow lists.
4. Update onboarding and clarify references.
5. Refresh tests and validate the new generated surface.
