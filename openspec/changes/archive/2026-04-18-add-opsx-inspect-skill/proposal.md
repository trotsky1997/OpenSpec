## Why

`/opsx:verify` is good at deciding whether a whole change is ready, but it is
not optimized for a deep investigation of one specific feature or one specific
task. Users need a narrower workflow that can inspect a scoped slice of
implementation in detail, trace it through code/tests/specs, and explain what is
implemented, missing, or divergent without forcing a full archive-readiness
judgment.

## What Changes

- Add a new `/opsx:inspect` skill and slash command for deep, scoped
  implementation inspection.
- Allow `/opsx:inspect` to focus on either a task from `tasks.md` or a feature /
  requirement from the change specs.
- Reuse verify-style evidence gathering, but narrow the analysis to the selected
  scope and produce a deeper implementation report instead of a whole-change
  readiness verdict.
- Generate the new inspect skill/command alongside the existing OPSX workflows
  during init/setup.
- Update onboarding and command references so users can discover when to use
  inspect versus verify.

## Capabilities

### New Capabilities

- `opsx-inspect-skill`: Deeply inspect the implementation state of one feature
  or one task inside a change using verify-style evidence and scoped reporting.

### Modified Capabilities

- `cli-init`: Generate the additional inspect skill directory and slash command
  for supported tools.
- `opsx-onboard-skill`: Include `/opsx:inspect` in the guided command reference
  and explain its role alongside `/opsx:verify`.

## Impact

- Affected code: workflow template generation, skill/command registries, and
  onboarding references for OPSX workflows.
- Affected UX: users gain a new scoped analysis workflow for implementation
  auditing before, during, or after apply.
- Affected artifacts: generated tool integrations gain one more OPSX skill and
  one more slash command.
