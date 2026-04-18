## MODIFIED Requirements

### Requirement: Explicit managed-file inventory

The system SHALL maintain an explicit managed-file inventory for each
`SolidSpec` change instead of inferring governed files from broad path matching.

#### Scenario: Record managed files explicitly
- **WHEN** a file is brought under `SolidSpec` management for a change
- **THEN** the change SHALL store the repo-relative file path in its managed-file
  inventory
- **AND** the inventory SHALL also store the resolved shadow `impl-spec` path for
  that file

#### Scenario: Use explicit lookup during apply and verify
- **WHEN** apply or verify needs to know which files belong to a `SolidSpec`
  change
- **THEN** the system SHALL read the managed-file inventory
- **AND** it SHALL use exact recorded entries instead of glob-based inference

### Requirement: Delta-first managed edits

A managed file SHALL not enter formal `SolidSpec` implementation until its
change-specific shadow delta exists.

#### Scenario: Block managed edit without delta
- **WHEN** a managed source or test file has no change-specific `.delta.md`
- **THEN** the system SHALL block formal implementation for that file
- **AND** it SHALL report the exact missing delta path using canonical
  `SolidSpec` naming

#### Scenario: Multiple managed files require separate deltas
- **WHEN** a `SolidSpec` change covers multiple managed files
- **THEN** each file SHALL have its own change-specific `.delta.md`
- **AND** the system SHALL not treat one file's delta as coverage for another
