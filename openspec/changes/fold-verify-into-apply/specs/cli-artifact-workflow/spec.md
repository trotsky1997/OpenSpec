## ADDED Requirements

### Requirement: Internal verification during apply

The artifact workflow SHALL allow apply to invoke internal verify-style
validation when implementation-time checks are needed.

#### Scenario: Apply invokes internal verification helper
- **WHEN** apply needs to assess implementation readiness, correctness, or
  closeout-style evidence during a change
- **THEN** it SHALL invoke the internal verify helper for that change
- **AND** it SHALL fold the returned findings into the apply flow instead of
  sending the user to a separate public verify command

#### Scenario: Apply remains the public implementation workflow
- **WHEN** users need implementation plus validation guidance for an active
  change
- **THEN** the supported public workflow SHALL be `/opsx:apply`
- **AND** the system SHALL not require a separate public `/opsx:verify`
  command to perform that validation
