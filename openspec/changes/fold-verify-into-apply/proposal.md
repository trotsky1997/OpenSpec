## Why

`/opsx:verify` and `/opsx:apply` now overlap the same implementation loop more than they differ: both load change context, inspect task progress, and reason about whether implementation is ready to continue or close out. Keeping verify as a separate public workflow adds surface area for users, while the verification logic itself is still valuable as an internal helper that apply and other workflows can call.

## What Changes

- Fold the existing verify workflow into apply as an internal verification helper instead of a separately exposed public user command.
- Stop exposing `/opsx:verify` as a public slash command or public generated skill during init/update flows.
- Let `/opsx:apply` invoke verify-style validation internally when it needs implementation-readiness, scoped analysis, or closeout-style checks during execution.
- Update user-facing guidance, onboarding, and clarify recommendations so users are directed to `/opsx:apply` instead of `/opsx:verify`.
- Keep verify-style validation logic available for internal skill-to-skill use rather than deleting the capability entirely.

## Capabilities

### New Capabilities
<!-- None. -->

### Modified Capabilities

- `opsx-verify-skill`: change verify from a public user-facing workflow into an internal helper skill that is invoked by other workflows instead of directly exposed.
- `cli-artifact-workflow`: absorb verify-style validation into apply as the public implementation workflow.
- `cli-init`: stop generating public verify skills and slash commands as part of the installed workflow surface.
- `opsx-onboard-skill`: remove verify from the public command reference and onboarding recommendations.
- `opsx-clarify-skill`: stop recommending `/opsx:verify` as a next step and redirect users toward apply or other remaining public workflows.

## Impact

- Affected code: verify and apply workflow templates, skill/command generation, profile workflow lists, init/update flows, onboarding text, and clarify guidance.
- Affected UX: users no longer see `/opsx:verify` as a public command, but verification logic remains available behind apply and internal workflow composition.
- Affected tests: skill generation, init/update command counts, onboarding references, clarify next-step guidance, and apply behavior need updates.
