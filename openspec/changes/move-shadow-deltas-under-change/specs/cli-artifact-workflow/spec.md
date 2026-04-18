## MODIFIED Requirements

### Requirement: OpenSpeX-aware change scaffolding

The artifact workflow SHALL support creating and tracking OpenSpeX changes with
explicit git-governance metadata and change-owned shadow delta paths.

#### Scenario: Create an OpenSpeX change

- **WHEN** a user creates a change using the OpenSpeX variant
- **THEN** the workflow SHALL persist that variant in the change metadata
- **AND** it SHALL persist explicit git-governance fields for branch and
  worktree tracking
- **AND** it SHALL scaffold change-owned shadow delta paths for any managed
  files declared during change setup

#### Scenario: Surface actionable git setup guidance

- **WHEN** an OpenSpeX change is missing required git-governance metadata
- **THEN** status and instruction output SHALL report the missing fields
- **AND** the output SHALL identify the exact next setup action needed before
  implementation can begin

### Requirement: OpenSpeX apply readiness checks

The artifact workflow SHALL block apply for OpenSpeX changes until both git and
shadow-spec prerequisites are satisfied.

#### Scenario: Apply blocked by missing managed-file delta

- **WHEN** an OpenSpeX change declares a managed file whose change-owned
  `.delta.md` is missing
- **THEN** `openspec instructions apply --change <id>` SHALL report a blocked
  state
- **AND** it SHALL list the exact missing delta path under the change directory
  for that file

#### Scenario: Apply blocked by missing managed-file inventory

- **WHEN** an OpenSpeX change has no managed-file inventory yet
- **THEN** the workflow SHALL not treat the change as implementation-ready
- **AND** it SHALL instruct the user or agent to declare managed files before
  coding

#### Scenario: Apply surfaces legacy delta migration need

- **WHEN** an OpenSpeX change only has a legacy colocated delta path for a
  managed file
- **THEN** the workflow SHALL report that migration is required before formal
  implementation continues
- **AND** it SHALL identify both the legacy path and the expected change-owned
  delta path

#### Scenario: Apply becomes ready after OpenSpeX prerequisites exist

- **WHEN** git-governance metadata, managed-file inventory, and required
  change-owned deltas all exist for an OpenSpeX change
- **THEN** the workflow SHALL allow apply to proceed
- **AND** it SHALL carry the exact managed-file, canonical shadow-path, and
  change-owned delta context into the apply instructions
