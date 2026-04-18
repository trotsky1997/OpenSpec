## ADDED Requirements

### Requirement: Explicit discipline manifest

Every OpenSpeX change SHALL declare an explicit code-discipline manifest before
formal implementation can proceed.

#### Scenario: Declare discipline profile for a change

- **WHEN** an OpenSpeX change is prepared for implementation
- **THEN** it SHALL declare its required model/type discipline policy
- **AND** it SHALL declare the exact validation commands that govern that
  change

#### Scenario: Discipline manifest contains explicit validation commands

- **WHEN** a discipline manifest is defined for an OpenSpeX change
- **THEN** it SHALL list each required validation command explicitly
- **AND** the listed commands MAY include language-appropriate tools such as
  `ruff`, `ty`, `pyright`, `pnpm lint`, or `pnpm typecheck`
- **AND** the system SHALL treat that explicit list as the source of truth

### Requirement: Model and type programming discipline

OpenSpeX-governed code SHALL follow explicit model/type programming rules.

#### Scenario: Governed code uses explicit models and types

- **WHEN** an OpenSpeX-managed file implements important state, boundaries, or
  domain concepts
- **THEN** it SHALL use explicit typed models, interfaces, classes, or
  equivalent typed constructs appropriate to the language
- **AND** it SHALL not rely on loose anonymous structures where a stable model
  boundary is expected

#### Scenario: Untyped escape hatch requires explicit waiver

- **WHEN** governed code needs an untyped or weakly typed escape hatch
- **THEN** the change SHALL record an explicit waiver in its discipline manifest
- **AND** the waiver SHALL include the reason for the exception

### Requirement: Mandatory validation gates

Declared validation commands SHALL be mandatory acceptance gates for OpenSpeX
changes.

#### Scenario: Validation command failure blocks acceptance

- **WHEN** a required validation command fails for an OpenSpeX change
- **THEN** the change SHALL not be considered discipline-complete
- **AND** the failure SHALL be reported as a blocking issue

#### Scenario: Validation command success satisfies gate

- **WHEN** all required validation commands pass for an OpenSpeX change
- **THEN** the validation-gate dimension SHALL be treated as satisfied
- **AND** later verification MAY rely on those successful command results as
  evidence
