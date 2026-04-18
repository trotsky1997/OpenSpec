## ADDED Requirements

### Requirement: OpenSpeX variant conventions

OpenSpec conventions SHALL define OpenSpeX as an opt-in variant for changes that
need git-governed execution and file-level implementation traceability.

#### Scenario: Enable OpenSpeX for a change

- **WHEN** authors choose the OpenSpeX variant for a change
- **THEN** conventions SHALL require that change to follow dedicated worktree,
  branch, review, and merge rules
- **AND** the stricter rules SHALL apply only to the changes that explicitly use
  the variant

#### Scenario: Standard OpenSpec change remains unchanged

- **WHEN** authors create a regular OpenSpec change without the OpenSpeX variant
- **THEN** the existing OpenSpec conventions SHALL continue to apply
- **AND** the project SHALL not retroactively require git-governed shadow-spec
  behavior for that change

### Requirement: OpenSpeX shadow implementation tree

OpenSpec conventions SHALL define a canonical shadow implementation tree for
OpenSpeX-managed files.

#### Scenario: Canonical shadow layout for a managed file

- **WHEN** conventions describe the shadow documentation for a managed file
- **THEN** they SHALL define one canonical shadow `impl-spec`
- **AND** they SHALL also define the colocated delta and changelog locations for
  that same file

#### Scenario: Tests share the same shadow convention

- **WHEN** conventions describe how test files are documented in OpenSpeX
- **THEN** test files SHALL follow the same shadow `impl-spec` convention as
  source files
- **AND** conventions SHALL not require a separate `test-spec` hierarchy

#### Scenario: Shadow layout remains deterministic across platforms

- **WHEN** conventions describe mapping code paths into shadow paths
- **THEN** they SHALL require deterministic repo-relative path preservation
- **AND** they SHALL require cross-platform path resolution behavior
