## MODIFIED Requirements

### Requirement: Dedicated git workspace per OpenSpeX change

`SolidSpec` SHALL require every active strict-workflow change to declare and use
one dedicated git worktree and branch before formal implementation begins.

#### Scenario: Create or attach a dedicated workspace
- **WHEN** a `SolidSpec` change is created or prepared for implementation
- **THEN** the system SHALL record one explicit branch name and one explicit
  worktree path for that change
- **AND** the recorded workspace SHALL be treated as the only formal git
  workspace for that change

#### Scenario: Reject strict workflow outside a git repository
- **WHEN** a user enables `SolidSpec` for a project that is not inside a git
  repository
- **THEN** the system SHALL fail with an actionable error
- **AND** the error SHALL explain that worktree and branch isolation require a
  git repository

#### Scenario: Resolve worktree paths cross-platform
- **WHEN** the system computes or displays a `SolidSpec` worktree path
- **THEN** it SHALL resolve the path with platform-aware path utilities
- **AND** it SHALL preserve the native path format on macOS, Linux, and Windows
