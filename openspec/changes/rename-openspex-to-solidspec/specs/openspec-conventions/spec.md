## MODIFIED Requirements

### Requirement: OpenSpeX variant conventions

OpenSpec conventions SHALL define `SolidSpec` as the primary opt-in variant for
changes that need git-governed execution, file-level implementation
traceability, and strict code-discipline enforcement.

#### Scenario: Enable SolidSpec for a change

- **WHEN** authors choose the `SolidSpec` variant for a change
- **THEN** conventions SHALL require that change to follow dedicated worktree,
  branch, review, and merge rules
- **AND** conventions SHALL require that change to declare its code-discipline
  policy and required validation commands
- **AND** the stricter rules SHALL apply only to the changes that explicitly use
  that variant

#### Scenario: Legacy OpenSpeX metadata remains valid

- **WHEN** a change still uses legacy `openspex` metadata or variant values
- **THEN** the system SHALL continue to recognize it as the same strict
  workflow
- **AND** conventions SHALL treat `openspex` as a backward-compatible alias for
  `SolidSpec`

#### Scenario: Standard OpenSpec change remains unchanged

- **WHEN** authors create a regular OpenSpec change without the strict variant
- **THEN** the existing OpenSpec conventions SHALL continue to apply
- **AND** the project SHALL not retroactively require git-governed,
  code-discipline behavior for that change

### Requirement: OpenSpeX shadow implementation tree

OpenSpec conventions SHALL define a canonical shadow implementation tree for
`SolidSpec`-managed files.

#### Scenario: Canonical shadow layout for a managed file

- **WHEN** conventions describe the shadow documentation for a managed file in a
  `SolidSpec` change
- **THEN** they SHALL define one canonical shadow `impl-spec`
- **AND** they SHALL also define the colocated delta and changelog locations for
  that same file

#### Scenario: Tests share the same shadow convention

- **WHEN** conventions describe how test files are documented in `SolidSpec`
- **THEN** test files SHALL follow the same shadow `impl-spec` convention as
  source files
- **AND** conventions SHALL not require a separate `test-spec` hierarchy

#### Scenario: Shadow layout remains deterministic across platforms

- **WHEN** conventions describe mapping code paths into shadow paths for a
  `SolidSpec` change
- **THEN** they SHALL require deterministic repo-relative path preservation
- **AND** they SHALL require cross-platform path resolution behavior
