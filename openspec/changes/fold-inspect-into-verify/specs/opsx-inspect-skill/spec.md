## MODIFIED Requirements

### Requirement: Inspect skill invocation

The system SHALL provide inspect as an internal helper skill for deep, scoped
implementation inspection within a change instead of exposing `/opsx:inspect` as
 a public user workflow.

#### Scenario: Internal inspect helper invoked by another workflow
- **WHEN** verify or another workflow needs a deep task- or feature-level
  implementation analysis
- **THEN** the system SHALL invoke the internal inspect helper for that scope
- **AND** it SHALL return a structured scoped inspection result to the calling
  workflow

#### Scenario: Inspect is not exposed as a public workflow
- **WHEN** public workflow surfaces are generated or documented
- **THEN** the system SHALL not expose `/opsx:inspect` as a user-facing command
- **AND** it SHALL treat inspect as an internal helper only

### Requirement: Scoped target resolution

The internal inspect helper SHALL resolve either one task target or one feature
 target.

#### Scenario: Inspect a task target internally
- **WHEN** a calling workflow requests inspection for a task by checkbox ID or
  task description
- **THEN** the helper SHALL match that task from `tasks.md`
- **AND** it SHALL use that task as the primary inspection scope

#### Scenario: Inspect a feature target internally
- **WHEN** a calling workflow requests inspection for a feature by requirement
  name or requirement-like description
- **THEN** the helper SHALL match the corresponding requirement from the change
  specs
- **AND** it SHALL use that requirement as the primary inspection scope

#### Scenario: Ambiguous internal scope match
- **WHEN** the requested scope could match multiple tasks or requirements
- **THEN** the helper SHALL surface the candidate matches back to the caller
- **AND** it SHALL require the caller to resolve the ambiguity before
  continuing

### Requirement: Deep scoped inspection analysis

The internal inspect helper SHALL analyze the selected scope using verify-style
 evidence, but only for that scope.

#### Scenario: Internal task inspection analysis
- **WHEN** inspecting a task scope internally
- **THEN** the helper SHALL trace the task into relevant code, tests, and change
  artifacts
- **AND** it SHALL report whether the task appears implemented, partial,
  missing, or divergent from intent

#### Scenario: Internal feature inspection analysis
- **WHEN** inspecting a feature requirement scope internally
- **THEN** the helper SHALL trace that requirement into relevant code, tests,
  and design context
- **AND** it SHALL report whether the feature appears implemented, partial,
  missing, or divergent from the requirement

### Requirement: Inspection report format

The internal inspect helper SHALL produce a structured scope-centered report for
 the calling workflow.

#### Scenario: Structured scoped result for caller
- **WHEN** internal inspection completes
- **THEN** the result SHALL identify the selected change and inspected scope
- **AND** it SHALL summarize evidence such as relevant files, tests, and key
  findings
- **AND** it SHALL include actionable next steps for that scope only
