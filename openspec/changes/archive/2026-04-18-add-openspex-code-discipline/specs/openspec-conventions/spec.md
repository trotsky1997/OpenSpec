## MODIFIED Requirements

### Requirement: OpenSpeX variant conventions

OpenSpec conventions SHALL define OpenSpeX as an opt-in variant for changes that
need git-governed execution, file-level implementation traceability, and strict
code-discipline enforcement.

#### Scenario: Enable OpenSpeX for a change

- **WHEN** authors choose the OpenSpeX variant for a change
- **THEN** conventions SHALL require that change to follow dedicated worktree,
  branch, review, and merge rules
- **AND** conventions SHALL require that change to declare its code-discipline
  policy and required validation commands
- **AND** the stricter rules SHALL apply only to the changes that explicitly use
  the variant

#### Scenario: Standard OpenSpec change remains unchanged

- **WHEN** authors create a regular OpenSpec change without the OpenSpeX variant
- **THEN** the existing OpenSpec conventions SHALL continue to apply
- **AND** the project SHALL not retroactively require git-governed,
  code-discipline behavior for that change
