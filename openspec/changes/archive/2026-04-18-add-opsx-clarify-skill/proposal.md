## Why

Users often know they are blocked by ambiguity before they know whether they
should explore, propose, inspect, or implement. OpenSpec currently relies on ad
hoc clarifying questions inside other workflows, but it lacks a dedicated,
interactive clarification flow that can systematically narrow uncertainty,
surface trade-offs, and summarize what has been decided before the user moves to
a more concrete step.

## What Changes

- Add a new `/opsx:clarify` skill and slash command for interactive
  clarification of ambiguous requests, requirements, design choices, and next
  steps.
- Let `/opsx:clarify` work either before a change exists or in the context of an
  existing change, using structured question rounds to narrow ambiguity.
- Require the clarify workflow to produce a concise clarification summary with
  confirmed decisions, open questions, assumptions, and recommended next steps.
- Generate the new clarify skill/command alongside the existing OPSX workflows
  during init/setup.
- Update onboarding and command references so users can discover clarify as the
  dedicated ambiguity-resolution workflow.

## Capabilities

### New Capabilities

- `opsx-clarify-skill`: Interactively clarify ambiguous intent, constraints,
  decisions, and next actions before or during an OpenSpec change.

### Modified Capabilities

- `cli-init`: Generate the additional clarify skill directory and slash command
  for supported tools.
- `opsx-onboard-skill`: Include `/opsx:clarify` in guided command references and
  explain its role alongside explore, propose, inspect, and verify.

## Impact

- Affected code: workflow template generation, skill/command registries,
  profile-aware workflow listings, and onboarding references.
- Affected UX: users gain a dedicated ambiguity-resolution step that sits before
  or between other OPSX workflows.
- Affected artifacts: generated tool integrations gain one more OPSX skill and
  one more slash command.
