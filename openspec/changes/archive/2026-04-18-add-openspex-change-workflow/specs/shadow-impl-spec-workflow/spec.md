## ADDED Requirements

### Requirement: Explicit managed-file inventory

The system SHALL maintain an explicit managed-file inventory for each OpenSpeX
change instead of inferring governed files from broad path matching.

#### Scenario: Record managed files explicitly

- **WHEN** a file is brought under OpenSpeX management for a change
- **THEN** the change SHALL store the repo-relative file path in its managed-file
  inventory
- **AND** the inventory SHALL also store the resolved shadow `impl-spec` path for
  that file

#### Scenario: Use explicit lookup during apply and verify

- **WHEN** apply or verify needs to know which files belong to an OpenSpeX change
- **THEN** the system SHALL read the managed-file inventory
- **AND** it SHALL use exact recorded entries instead of glob-based inference

### Requirement: Deterministic shadow impl-spec mapping

Every OpenSpeX-managed code file SHALL map to one canonical shadow `impl-spec`
path, including test files.

#### Scenario: Source file receives a shadow impl-spec

- **WHEN** a source file is added to an OpenSpeX change
- **THEN** the system SHALL resolve one canonical shadow `impl-spec` location for
  that file
- **AND** future delta and changelog operations for that file SHALL use the same
  shadow location

#### Scenario: Test file uses the same model as source code

- **WHEN** a test file is added to an OpenSpeX change
- **THEN** the system SHALL treat it as a managed code file
- **AND** it SHALL create and maintain a shadow `impl-spec` using the same path
  resolution rules instead of a separate `test-spec` track

#### Scenario: Shadow path resolution is cross-platform

- **WHEN** the system resolves shadow paths for a managed file
- **THEN** it SHALL preserve repo-relative path segments deterministically
- **AND** it SHALL compute the shadow path with platform-aware path utilities on
  macOS, Linux, and Windows

### Requirement: Delta-first managed edits

A managed file SHALL not enter formal OpenSpeX implementation until its
change-specific shadow delta exists.

#### Scenario: Block managed edit without delta

- **WHEN** a managed source or test file has no change-specific `.delta.md`
- **THEN** the system SHALL block formal implementation for that file
- **AND** it SHALL report the exact missing delta path

#### Scenario: Multiple managed files require separate deltas

- **WHEN** an OpenSpeX change covers multiple managed files
- **THEN** each file SHALL have its own change-specific `.delta.md`
- **AND** the system SHALL not treat one file's delta as coverage for another

### Requirement: Merge-back and changelog maintenance

After successful verification, accepted deltas SHALL be merged into the
canonical shadow `impl-spec`, and each affected shadow spec SHALL receive a
changelog entry.

#### Scenario: Merge accepted delta into canonical shadow spec

- **WHEN** an OpenSpeX change passes its completion verification for a managed
  file
- **THEN** the system SHALL merge that file's accepted `.delta.md` content into
  the canonical shadow `impl-spec`
- **AND** subsequent checks SHALL treat the canonical shadow spec as the current
  truth for that file

#### Scenario: Record changelog entry for affected shadow spec

- **WHEN** a delta is accepted for a managed file
- **THEN** the system SHALL append a changelog entry to that file's shadow spec
  history
- **AND** the changelog entry SHALL identify the change that introduced the
  update
