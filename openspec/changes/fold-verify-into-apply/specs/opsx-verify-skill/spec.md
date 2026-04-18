## MODIFIED Requirements

### Requirement: Verify Skill Invocation

The system SHALL provide verify as an internal helper skill that validates
implementation against change artifacts instead of exposing `/opsx:verify` as a
public user workflow.

#### Scenario: Internal verify helper invoked by another workflow
- **WHEN** apply or another workflow needs a readiness or correctness pass
- **THEN** the system SHALL invoke the internal verify helper for that change
- **AND** it SHALL return a structured verification result to the calling
  workflow

#### Scenario: Verify is not exposed as a public workflow
- **WHEN** public workflow surfaces are generated or documented
- **THEN** the system SHALL not expose `/opsx:verify` as a user-facing command
- **AND** it SHALL treat verify as an internal helper only

### Requirement: Verification Report Format

The internal verify helper SHALL produce a structured prioritized report for the
calling workflow.

#### Scenario: Structured verification result for caller
- **WHEN** internal verification completes
- **THEN** the result SHALL summarize completeness, correctness, and coherence
- **AND** it SHALL include CRITICAL, WARNING, or SUGGESTION findings for the
  calling workflow to consume
- **AND** it SHALL not require a separate public `/opsx:verify` user command to
  expose that report
