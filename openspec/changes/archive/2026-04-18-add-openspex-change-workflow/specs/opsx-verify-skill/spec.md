## ADDED Requirements

### Requirement: OpenSpeX workflow evidence verification

`/opsx:verify` SHALL enforce git-governance evidence for OpenSpeX changes.

#### Scenario: Report missing git-governance evidence

- **WHEN** an OpenSpeX change is missing its recorded worktree, branch, PR, or
  merge evidence
- **THEN** `/opsx:verify` SHALL report the missing evidence as CRITICAL issues
- **AND** it SHALL not declare the change ready for completion

#### Scenario: Accept OpenSpeX git evidence when complete

- **WHEN** an OpenSpeX change has the expected worktree, branch, PR reference,
  and merge evidence recorded
- **THEN** `/opsx:verify` SHALL include those checks in its completion report
- **AND** it SHALL treat the git-governance dimension as satisfied

### Requirement: Shadow-spec closure verification

`/opsx:verify` SHALL verify that every managed file is fully closed against its
shadow `impl-spec` state.

#### Scenario: Report missing delta before verification closes a file

- **WHEN** a managed source or test file lacks its required `.delta.md`
- **THEN** `/opsx:verify` SHALL report the file as a CRITICAL issue
- **AND** the report SHALL include the exact managed file path and missing
  shadow artifact path

#### Scenario: Merge accepted delta and changelog on successful verify

- **WHEN** a managed file satisfies the OpenSpeX verification checks
- **THEN** `/opsx:verify` SHALL merge that file's accepted `.delta.md` into the
  canonical shadow `impl-spec`
- **AND** it SHALL append the matching shadow changelog entry before declaring
  the file closed

#### Scenario: Report merge-back failure as critical

- **WHEN** `/opsx:verify` cannot complete the shadow-spec merge-back or
  changelog update for a managed file
- **THEN** it SHALL report the failure as a CRITICAL issue
- **AND** it SHALL not declare the change ready for completion

### Requirement: Verification stricter than apply

`/opsx:verify` SHALL enforce completion checks that go beyond `/opsx:apply`
readiness.

#### Scenario: Apply-complete change still fails verify

- **WHEN** `/opsx:apply` has completed the implementation tasks for an OpenSpeX
  change
- **AND** shadow-spec closure or git-governance evidence is still missing
- **THEN** `/opsx:verify` SHALL fail the change with CRITICAL issues
- **AND** it SHALL explain that apply readiness does not imply completion

#### Scenario: Verify checks tests as managed files

- **WHEN** a test file appears in the OpenSpeX managed-file inventory
- **THEN** `/opsx:verify` SHALL apply the same delta, shadow-spec, and changelog
  checks that it applies to source files
- **AND** it SHALL not downgrade test-file coverage to an optional suggestion
