# solidspec-internal-compatibility Specification

## Purpose
Define canonical internal SolidSpec identifiers and compatibility guarantees for
legacy `openspex` imports, keys, and metadata surfaces.

## Requirements
### Requirement: Canonical SolidSpec internal identifiers

The system SHALL use `SolidSpec` as the canonical internal identifier set for
strict-workflow source modules, exported helpers, and machine-facing runtime
keys.

#### Scenario: Canonical source modules use SolidSpec naming
- **WHEN** the codebase defines strict-workflow implementation modules or types
- **THEN** the canonical source-of-truth file names and exported symbols SHALL
  use `solidspec` naming
- **AND** new internal development SHALL not introduce new `openspex`-named
  source-of-truth modules

#### Scenario: Canonical runtime keys use SolidSpec naming
- **WHEN** status, apply, or instruction payloads expose strict-workflow
  machine-facing keys
- **THEN** those canonical keys SHALL use `solidspec` prefixes
- **AND** the system SHALL not treat legacy `openspex` key names as the primary
  canonical output

### Requirement: Legacy openspex compatibility shims

The system SHALL provide an explicit migration path for legacy `openspex`
imports and metadata while the internal cleanup is in progress.

#### Scenario: Legacy import path remains available during migration
- **WHEN** existing code or tests still import a legacy `openspex` module path
- **THEN** the system SHALL provide a compatibility shim or equivalent migration
  path
- **AND** the canonical implementation SHALL still live behind the `solidspec`
  name

#### Scenario: Legacy metadata stays readable
- **WHEN** a change or test fixture still uses legacy `openspex` metadata
- **THEN** the system SHALL continue to parse it correctly
- **AND** canonical internal processing SHALL normalize it to the `SolidSpec`
  workflow model
