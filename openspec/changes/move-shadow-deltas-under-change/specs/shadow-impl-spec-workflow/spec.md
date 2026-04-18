## ADDED Requirements

### Requirement: Legacy shadow delta migration

The system SHALL detect and reconcile active OpenSpeX changes that still use the
legacy colocated delta layout under the canonical shadow tree.

#### Scenario: Legacy delta exists without change-owned delta

- **WHEN** an active OpenSpeX change has a legacy delta under
  `openspec/impl-specs/.../deltas/`
- **AND** the new change-owned delta path is absent
- **THEN** the system SHALL surface a deterministic migration action or perform
  a deterministic migration into the change-owned delta path
- **AND** subsequent apply and verify flows SHALL use the change-owned delta
  path as the source of truth

#### Scenario: Legacy and change-owned deltas disagree

- **WHEN** both the legacy delta path and the change-owned delta path exist for
  the same managed file
- **AND** their contents do not match
- **THEN** the system SHALL block formal apply or verify for that file
- **AND** it SHALL report both exact paths so the conflict can be resolved

## MODIFIED Requirements

### Requirement: Explicit managed-file inventory

The system SHALL maintain an explicit managed-file inventory for each OpenSpeX
change instead of inferring governed files from broad path matching.

#### Scenario: Record managed files explicitly

- **WHEN** a file is brought under OpenSpeX management for a change
- **THEN** the change SHALL store the repo-relative file path in its managed-file
  inventory
- **AND** the inventory SHALL store the canonical shadow `impl-spec` path and
  canonical changelog path for that file
- **AND** the inventory SHALL also store the change-owned delta path for that
  file under the change directory

#### Scenario: Use explicit lookup during apply and verify

- **WHEN** apply or verify needs to know which files belong to an OpenSpeX
  change
- **THEN** the system SHALL read the managed-file inventory
- **AND** it SHALL use exact recorded entries instead of glob-based inference
- **AND** it SHALL treat the recorded change-owned delta path as the formal
  working delta location for that file

### Requirement: Delta-first managed edits

A managed file SHALL not enter formal OpenSpeX implementation until its
change-owned shadow delta exists.

#### Scenario: Block managed edit without delta

- **WHEN** a managed source or test file has no change-owned `.delta.md`
- **THEN** the system SHALL block formal implementation for that file
- **AND** it SHALL report the exact missing delta path under the change
  directory

#### Scenario: Multiple managed files require separate deltas

- **WHEN** an OpenSpeX change covers multiple managed files
- **THEN** each file SHALL have its own change-owned `.delta.md`
- **AND** the system SHALL not treat one file's delta as coverage for another

### Requirement: Merge-back and changelog maintenance

After successful verification, accepted change-owned deltas SHALL be merged into
canonical shadow `impl-spec` files, and each affected shadow spec SHALL receive
a changelog entry.

#### Scenario: Merge accepted delta into canonical shadow spec

- **WHEN** an OpenSpeX change passes its completion verification for a managed
  file
- **THEN** the system SHALL merge that file's accepted change-owned `.delta.md`
  content into the canonical shadow `impl-spec`
- **AND** subsequent checks SHALL treat the canonical shadow spec as the current
  truth for that file

#### Scenario: Record changelog entry for affected shadow spec

- **WHEN** a delta is accepted for a managed file
- **THEN** the system SHALL append a changelog entry to that file's shadow spec
  history
- **AND** the changelog entry SHALL identify the change that introduced the
  update

#### Scenario: Preserve change-owned delta for archive provenance

- **WHEN** a managed file's delta has been merged back successfully
- **THEN** the system SHALL preserve the accepted delta inside the change
  directory
- **AND** archiving the change SHALL retain that delta as part of the archived
  change record
