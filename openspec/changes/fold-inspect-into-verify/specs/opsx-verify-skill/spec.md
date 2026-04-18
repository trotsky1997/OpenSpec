## ADDED Requirements

### Requirement: Scoped deep analysis within verify

`/opsx:verify` SHALL be able to invoke the internal inspect helper when it needs
 deeper scoped implementation analysis for one task or feature.

#### Scenario: Verify invokes scoped inspect helper
- **WHEN** verify determines that one task or feature needs a deeper scoped
  pass
- **THEN** it SHALL invoke the internal inspect helper for that scope
- **AND** it SHALL incorporate the returned scoped evidence into the verification
  report

#### Scenario: Scoped verification remains part of verify
- **WHEN** users need deep implementation analysis for one task or feature
- **THEN** the supported public workflow SHALL be `/opsx:verify`
- **AND** the system SHALL not require a separate public `/opsx:inspect`
  command to perform that analysis
