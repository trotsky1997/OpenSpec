## MODIFIED Requirements

### Requirement: OpenSpeX variant conventions

OpenSpec conventions SHALL define `SolidSpec` as both the canonical public and
canonical internal name for the strict workflow, while treating `openspex` as a
legacy compatibility alias only.

#### Scenario: Canonical naming guidance uses SolidSpec
- **WHEN** conventions describe the strict workflow for maintained code or specs
- **THEN** they SHALL use `SolidSpec` as the canonical name
- **AND** they SHALL not require new maintained files or capability identifiers
  to keep the old `openspex` name

#### Scenario: Legacy alias remains documented only for migration
- **WHEN** conventions mention `openspex`
- **THEN** they SHALL describe it as a legacy compatibility alias
- **AND** they SHALL explain that new maintained internals should use
  `SolidSpec` naming instead

#### Scenario: Standard OpenSpec change remains unchanged
- **WHEN** authors create a regular OpenSpec change without the strict variant
- **THEN** the existing OpenSpec conventions SHALL continue to apply
- **AND** the project SHALL not retroactively require git-governed,
  code-discipline behavior for that change
