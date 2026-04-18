## MODIFIED Requirements

### Requirement: OpenSpeX-aware change scaffolding

The artifact workflow SHALL treat `SolidSpec` as the canonical strict-workflow
identifier in generated runtime surfaces while still accepting legacy
`openspex` inputs.

#### Scenario: Canonical strict-workflow metadata uses SolidSpec names
- **WHEN** the workflow writes or reports new strict-workflow metadata and
  runtime context
- **THEN** it SHALL use canonical `solidspec`-named variants, fields, and keys
- **AND** it SHALL reserve `openspex` names for explicit compatibility paths

#### Scenario: Accept legacy OpenSpeX variant input
- **WHEN** a user or existing change still uses the legacy `openspex` variant
  name
- **THEN** the workflow SHALL continue to recognize it as the same strict
  workflow
- **AND** it SHALL preserve compatibility with previously written metadata

#### Scenario: Surface canonical runtime context keys
- **WHEN** apply or status output exposes strict-workflow context entries
- **THEN** the canonical key names SHALL use `solidspec` prefixes
- **AND** migration support for legacy `openspex` keys SHALL be explicit rather
  than accidental
