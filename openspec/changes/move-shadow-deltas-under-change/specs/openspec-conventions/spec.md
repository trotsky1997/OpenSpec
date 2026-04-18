## MODIFIED Requirements

### Requirement: OpenSpeX shadow implementation tree

OpenSpec conventions SHALL define a canonical shadow implementation tree for
OpenSpeX-managed files and a separate change-owned tree for OpenSpeX deltas.

#### Scenario: Canonical shadow layout for a managed file

- **WHEN** conventions describe the stable shadow documentation for a managed
  file
- **THEN** they SHALL define one canonical shadow `impl-spec`
- **AND** they SHALL define the colocated canonical changelog for that same file
- **AND** they SHALL not require the live change delta to live inside the
  canonical shadow tree

#### Scenario: Change-owned delta layout for a managed file

- **WHEN** conventions describe where an OpenSpeX change stores its working
  delta for a managed file
- **THEN** they SHALL define a mirrored path rooted under
  `openspec/changes/<change>/shadow-deltas/`
- **AND** they SHALL preserve the repo-relative file path deterministically in
  that change-owned delta location

#### Scenario: Tests share the same shadow convention

- **WHEN** conventions describe how test files are documented in OpenSpeX
- **THEN** test files SHALL follow the same canonical shadow `impl-spec`
  convention as source files
- **AND** their change-owned deltas SHALL follow the same mirrored
  `shadow-deltas/` convention inside the change directory
- **AND** conventions SHALL not require a separate `test-spec` hierarchy

#### Scenario: Shadow layout remains deterministic across platforms

- **WHEN** conventions describe mapping code paths into canonical shadow paths
  and change-owned delta paths
- **THEN** they SHALL require deterministic repo-relative path preservation
- **AND** they SHALL require cross-platform path resolution behavior for both
  path families
