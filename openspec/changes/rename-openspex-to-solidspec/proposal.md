## Why

`OpenSpeX` now covers more than the original experimental branding, but the name is still baked into user-facing guidance, variant flags, workflow text, and generated commands. Renaming it to `SolidSpec` makes the stricter workflow easier to explain while still requiring a safe compatibility path for existing `openspex` repositories and prompts.

## What Changes

- Rename the user-facing `OpenSpeX` workflow and variant to `SolidSpec` across CLI help, workflow prompts, readiness output, and docs.
- Accept `--variant solidspec` as the primary strict-workflow variant while keeping legacy `openspex` metadata and variant values working as compatibility aliases.
- Add `/ssx:*` command aliases for generated workflow commands while preserving the current `/opsx:*` command set.
- Update generated onboarding and setup guidance to teach `SolidSpec` as the primary strict workflow name and mention the `/ssx:*` alias surface.
- Update verification, apply, and shadow-spec guidance so the strict workflow is described as `SolidSpec` in user-visible output.

## Capabilities

### New Capabilities
<!-- None. -->

### Modified Capabilities

- `openspec-conventions`: rename the strict variant to `SolidSpec` in the documented conventions and define compatibility expectations for legacy `openspex` metadata.
- `cli-artifact-workflow`: accept the new `solidspec` variant, preserve legacy `openspex` compatibility, and update strict-workflow status/apply output wording.
- `cli-init`: generate `/ssx:*` command aliases alongside `/opsx:*` commands and present `SolidSpec` as the strict workflow during setup.
- `opsx-onboard-skill`: teach `SolidSpec` as the strict workflow while referencing both `/opsx:*` and `/ssx:*` entry points.
- `shadow-impl-spec-workflow`: update the governed-file and shadow-spec requirements to describe the strict workflow as `SolidSpec`.
- `solidspec-code-discipline`: present strict code-discipline requirements as `SolidSpec` behavior while keeping compatibility with legacy capability naming.
- `opsx-verify-skill`: update strict workflow verification language to use `SolidSpec` while accepting legacy `openspex` evidence.

## Impact

- Affected code: variant parsing/metadata, new-change scaffolding, status/apply/instruction output, workflow templates, init/update flows, command generation, and command-reference transforms.
- Affected compatibility surfaces: `.openspec.yaml` variant metadata, generated slash command files, onboarding docs, and test fixtures.
- Affected users: new users will see `SolidSpec` as the primary name, while existing repositories using `openspex` or `/opsx:*` continue to work.
