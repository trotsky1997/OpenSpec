## MODIFIED Requirements

### Requirement: OpenSpeX apply readiness checks

The artifact workflow SHALL block apply for OpenSpeX changes until git,
shadow-spec, and code-discipline prerequisites are satisfied.

#### Scenario: Apply blocked by missing discipline manifest

- **WHEN** an OpenSpeX change has no declared code-discipline manifest
- **THEN** `openspec instructions apply --change <id>` SHALL report a blocked
  state
- **AND** it SHALL tell the user or agent to declare the discipline policy and
  validation commands before coding

#### Scenario: Apply blocked by missing validation command declarations

- **WHEN** an OpenSpeX change has no explicit list of required validation
  commands
- **THEN** `openspec instructions apply --change <id>` SHALL report a blocked
  state
- **AND** it SHALL identify that the discipline gate configuration is incomplete

#### Scenario: Apply becomes ready after discipline prerequisites exist

- **WHEN** git-governance metadata, managed-file inventory, required deltas,
  code-discipline policy, and validation command declarations all exist for an
  OpenSpeX change
- **THEN** the workflow SHALL allow apply to proceed
- **AND** it SHALL carry the discipline context into the apply instructions
