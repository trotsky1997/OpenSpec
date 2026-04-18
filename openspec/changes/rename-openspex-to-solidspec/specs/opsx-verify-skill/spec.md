## MODIFIED Requirements

### Requirement: OpenSpeX workflow evidence verification

`/opsx:verify` SHALL enforce both git-governance evidence and code-discipline
evidence for `SolidSpec` changes.

#### Scenario: Report missing discipline evidence

- **WHEN** a `SolidSpec` change lacks its declared discipline manifest or
  required validation command results
- **THEN** `/opsx:verify` SHALL report the missing discipline evidence as
  CRITICAL issues
- **AND** it SHALL not declare the change ready for completion

#### Scenario: Accept discipline evidence when complete

- **WHEN** a `SolidSpec` change has the expected worktree, branch, PR reference,
  merge evidence, discipline manifest, and successful validation command results
- **THEN** `/opsx:verify` SHALL include those checks in its completion report
- **AND** it SHALL treat both the git-governance and discipline dimensions as
  satisfied

### Requirement: Shadow-spec closure verification

`/opsx:verify` SHALL verify that every managed file is fully closed against its
shadow `impl-spec` state.

#### Scenario: Report missing delta before verification closes a file

- **WHEN** a managed source or test file lacks its required `.delta.md` in a
  `SolidSpec` change
- **THEN** `/opsx:verify` SHALL report the file as a CRITICAL issue
- **AND** the report SHALL include the exact managed file path and missing
  shadow artifact path

#### Scenario: Merge accepted delta and changelog on successful verify

- **WHEN** a managed file satisfies the `SolidSpec` verification checks
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

- **WHEN** `/opsx:apply` has completed the implementation tasks for a
  `SolidSpec` change
- **AND** shadow-spec closure or git-governance evidence is still missing
- **THEN** `/opsx:verify` SHALL fail the change with CRITICAL issues
- **AND** it SHALL explain that apply readiness does not imply completion

#### Scenario: Verify fails on model/type discipline violation

- **WHEN** a `SolidSpec` change introduces governed code that violates its
  declared model/type discipline without an explicit waiver
- **THEN** `/opsx:verify` SHALL report that violation as a CRITICAL issue
- **AND** it SHALL explain which file or scope appears to violate the declared
  discipline

#### Scenario: Verify fails on validation command failure

- **WHEN** any required validation command such as `ruff`, `ty`, `pyright`,
  `pnpm lint`, or `pnpm typecheck` fails for a `SolidSpec` change
- **THEN** `/opsx:verify` SHALL report the failing command as a CRITICAL issue
- **AND** it SHALL not treat the change as ready for completion

#### Scenario: Verify checks tests as managed files

- **WHEN** a test file appears in the `SolidSpec` managed-file inventory
- **THEN** `/opsx:verify` SHALL apply the same delta, shadow-spec, and changelog
  checks that it applies to source files
- **AND** it SHALL not downgrade test-file coverage to an optional suggestion
