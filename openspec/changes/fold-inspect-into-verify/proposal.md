## Why

`/opsx:inspect` currently overlaps heavily with `/opsx:verify`: both load the same change context, gather verify-style evidence, and produce implementation analysis. Keeping inspect as a separate public workflow adds user-facing surface area without enough distinct value, while the deeper scoped-analysis logic is still useful as an internal helper for verify and other skills.

## What Changes

- Fold the existing inspect workflow into verify as an internal scoped-inspection helper instead of a separately exposed user command.
- Stop exposing `/opsx:inspect` as a public slash command or public generated skill during init/update flows.
- Let `/opsx:verify` reuse inspect-style scoped analysis internally when a task- or feature-level deep pass is needed.
- Update user-facing guidance, onboarding, and clarify recommendations so users are directed to `/opsx:verify` instead of `/opsx:inspect`.
- Keep inspect-style analysis logic available for internal skill-to-skill use rather than deleting the capability entirely.

## Capabilities

### New Capabilities
<!-- None. -->

### Modified Capabilities

- `opsx-inspect-skill`: change inspect from a public user-facing workflow into an internal helper skill that is invoked by other workflows instead of directly exposed.
- `opsx-verify-skill`: absorb scoped inspect-style analysis and define when verify invokes the internal helper.
- `cli-init`: stop generating public inspect skills and slash commands as part of the installed workflow surface.
- `opsx-onboard-skill`: remove inspect from the public command reference and onboarding recommendations.
- `opsx-clarify-skill`: stop recommending `/opsx:inspect` as a next step and redirect users toward verify or other remaining public workflows.

## Impact

- Affected code: inspect and verify workflow templates, skill/command generation, profile workflow lists, init/update flows, onboarding text, and clarify guidance.
- Affected UX: users no longer see `/opsx:inspect` as a public command, but scoped deep analysis remains available behind verify and internal workflow composition.
- Affected tests: skill generation, init/update command counts, onboarding references, clarify next-step guidance, and verify behavior need updates.
