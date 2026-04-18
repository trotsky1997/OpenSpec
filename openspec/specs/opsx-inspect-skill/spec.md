# opsx-inspect-skill Specification

## Purpose
Define `/opsx:inspect` behavior for deep, scoped implementation inspection within a change.

## Requirements

### Requirement: Inspect skill invocation

The system SHALL provide an `/opsx:inspect` skill for deep, scoped
implementation inspection within a change.

#### Scenario: Inspect with change and scope provided

- **WHEN** agent executes `/opsx:inspect <change-name> <scope>`
- **THEN** the agent SHALL inspect that specific scope within the specified
  change
- **AND** it SHALL produce a structured inspection report

#### Scenario: Inspect without change name

- **WHEN** agent executes `/opsx:inspect` without a change name
- **THEN** the agent SHALL prompt the user to choose from available active
  changes that have tasks or specs to inspect
- **AND** it SHALL not guess the target change automatically

#### Scenario: Inspect without scope

- **WHEN** agent has resolved the target change but not a task or feature scope
- **THEN** it SHALL prompt the user to choose a task or a feature requirement to
  inspect
- **AND** it SHALL show enough context to make that choice understandable

### Requirement: Scoped target resolution

`/opsx:inspect` SHALL resolve either one task target or one feature target.

#### Scenario: Inspect a task target

- **WHEN** the user identifies a task by checkbox ID or task description
- **THEN** the agent SHALL match that task from `tasks.md`
- **AND** it SHALL use that task as the primary inspection scope

#### Scenario: Inspect a feature target

- **WHEN** the user identifies a feature by requirement name or requirement-like
  feature description
- **THEN** the agent SHALL match the corresponding requirement from the change
  specs
- **AND** it SHALL use that requirement as the primary inspection scope

#### Scenario: Ambiguous scope match

- **WHEN** the provided scope could match multiple tasks or requirements
- **THEN** the agent SHALL show the candidate matches
- **AND** it SHALL prompt the user to choose one before continuing

#### Scenario: Scope not found

- **WHEN** no matching task or feature can be found in the selected change
- **THEN** the agent SHALL report that the requested scope could not be resolved
- **AND** it SHALL suggest the closest available tasks or requirements

### Requirement: Deep scoped inspection analysis

`/opsx:inspect` SHALL analyze the selected scope using verify-style evidence,
but only for that scope.

#### Scenario: Task inspection analysis

- **WHEN** inspecting a task scope
- **THEN** the agent SHALL trace the task into relevant code, tests, and change
  artifacts
- **AND** it SHALL report whether the task appears implemented, partial,
  missing, or divergent from intent

#### Scenario: Feature inspection analysis

- **WHEN** inspecting a feature requirement scope
- **THEN** the agent SHALL trace that requirement into relevant code, tests,
  and design context
- **AND** it SHALL report whether the feature appears implemented, partial,
  missing, or divergent from the requirement

#### Scenario: Scoped coherence analysis

- **WHEN** inspecting either a task or feature scope
- **THEN** the agent SHALL assess completeness, correctness, and coherence for
  that scope
- **AND** it SHALL avoid turning the report into a whole-change archive verdict

### Requirement: Inspection report format

`/opsx:inspect` SHALL produce a deeper, scope-centered report.

#### Scenario: Structured scoped report

- **WHEN** inspection completes
- **THEN** the report SHALL identify the selected change and inspected scope
- **AND** it SHALL summarize evidence such as relevant files, tests, and key
  findings
- **AND** it SHALL include actionable next steps for that scope only

#### Scenario: Scoped findings severity

- **WHEN** issues are found during inspection
- **THEN** the report SHALL group them as CRITICAL, WARNING, or SUGGESTION
- **AND** the findings SHALL refer only to the inspected task or feature scope

#### Scenario: Inspection finds strong evidence

- **WHEN** the selected scope appears well implemented and covered
- **THEN** the report SHALL say so explicitly
- **AND** it SHALL still cite the key supporting evidence
