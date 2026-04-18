## MODIFIED Requirements

### Requirement: OpenSpeX-aware change scaffolding

The artifact workflow SHALL support creating and tracking `SolidSpec` changes
with explicit git-governance metadata.

#### Scenario: Create a SolidSpec change

- **WHEN** a user creates a change using the `SolidSpec` variant
- **THEN** the workflow SHALL persist that strict-workflow variant in the change
  metadata
- **AND** it SHALL persist explicit git-governance fields for branch and
  worktree tracking

#### Scenario: Accept legacy OpenSpeX variant input

- **WHEN** a user or existing change still uses the legacy `openspex` variant
  name
- **THEN** the workflow SHALL continue to recognize it as the same strict
  workflow
- **AND** it SHALL preserve compatibility with previously written metadata

#### Scenario: Surface actionable git setup guidance

- **WHEN** a `SolidSpec` change is missing required git-governance metadata
- **THEN** status and instruction output SHALL report the missing fields
- **AND** the output SHALL identify the exact next setup action needed before
  implementation can begin

### Requirement: OpenSpeX apply readiness checks

The artifact workflow SHALL block apply for `SolidSpec` changes until git,
shadow-spec, and code-discipline prerequisites are satisfied.

#### Scenario: Apply blocked by missing managed-file delta

- **WHEN** a `SolidSpec` change declares a managed file whose `.delta.md` is
  missing
- **THEN** `openspec instructions apply --change <id>` SHALL report a blocked
  state
- **AND** it SHALL list the exact missing delta path for that file

#### Scenario: Apply blocked by missing managed-file inventory

- **WHEN** a `SolidSpec` change has no managed-file inventory yet
- **THEN** the workflow SHALL not treat the change as implementation-ready
- **AND** it SHALL instruct the user or agent to declare managed files before
  coding

#### Scenario: Apply blocked by missing discipline manifest

- **WHEN** a `SolidSpec` change has no declared code-discipline manifest
- **THEN** `openspec instructions apply --change <id>` SHALL report a blocked
  state
- **AND** it SHALL tell the user or agent to declare the discipline policy and
  validation commands before coding

#### Scenario: Apply blocked by missing validation command declarations

- **WHEN** a `SolidSpec` change has no explicit list of required validation
  commands
- **THEN** `openspec instructions apply --change <id>` SHALL report a blocked
  state
- **AND** it SHALL identify that the discipline gate configuration is incomplete

#### Scenario: Apply becomes ready after strict-workflow prerequisites exist

- **WHEN** git-governance metadata, managed-file inventory, required deltas,
  code-discipline policy, and validation command declarations all exist for a
  `SolidSpec` change
- **THEN** the workflow SHALL allow apply to proceed
- **AND** it SHALL carry the discipline context into the apply instructions
