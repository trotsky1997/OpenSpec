## MODIFIED Requirements

### Requirement: OpenSpeX workflow evidence verification

`/opsx:verify` SHALL treat `SolidSpec` as the canonical internal strict-workflow
name while continuing to accept legacy `openspex` evidence.

#### Scenario: Canonical verification reports use SolidSpec naming
- **WHEN** `/opsx:verify` reports strict-workflow evidence, blockers, or merged
  shadow artifacts
- **THEN** it SHALL use canonical `SolidSpec` naming in maintained reports and
  code paths
- **AND** it SHALL not present `openspex` as the primary maintained internal
  name

#### Scenario: Legacy evidence remains readable
- **WHEN** verification encounters legacy `openspex` metadata or compatibility
  artifacts
- **THEN** it SHALL continue to interpret them as the same strict workflow
- **AND** it SHALL normalize them into the canonical `SolidSpec` verification
  model
