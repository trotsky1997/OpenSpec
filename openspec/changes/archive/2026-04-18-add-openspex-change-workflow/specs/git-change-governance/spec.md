## ADDED Requirements

### Requirement: Dedicated git workspace per OpenSpeX change

OpenSpeX SHALL require every active change to declare and use a dedicated git
worktree and branch before formal implementation begins.

#### Scenario: Create or attach a dedicated workspace

- **WHEN** an OpenSpeX change is created or prepared for implementation
- **THEN** the system SHALL record one explicit branch name and one explicit
  worktree path for that change
- **AND** the recorded workspace SHALL be treated as the only formal git
  workspace for that change

#### Scenario: Reject OpenSpeX workflow outside a git repository

- **WHEN** a user enables OpenSpeX for a project that is not inside a git
  repository
- **THEN** the system SHALL fail with an actionable error
- **AND** the error SHALL explain that worktree and branch isolation require a
  git repository

#### Scenario: Resolve worktree paths cross-platform

- **WHEN** the system computes or displays an OpenSpeX worktree path
- **THEN** it SHALL resolve the path with platform-aware path utilities
- **AND** it SHALL preserve the native path format on macOS, Linux, and Windows

### Requirement: Merge-governed completion

OpenSpeX SHALL treat pull-request review and merge evidence as part of change
completion, not as optional documentation.

#### Scenario: Change not ready for completion without review evidence

- **WHEN** an OpenSpeX change lacks its recorded PR reference or merge evidence
- **THEN** the system SHALL mark the change as not ready for completion
- **AND** it SHALL report which git-governance fields are still missing

#### Scenario: Completion-ready change records merge evidence

- **WHEN** an OpenSpeX change has completed implementation and review
- **THEN** the system SHALL record the PR reference and merge commit metadata
- **AND** completion checks SHALL use that metadata as explicit evidence that the
  change followed the review-and-merge path
