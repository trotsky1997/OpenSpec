## MODIFIED Requirements

### Requirement: OpenSpeX workflow evidence verification

`/opsx:verify` SHALL enforce both git-governance evidence and code-discipline
evidence for OpenSpeX changes.

#### Scenario: Report missing discipline evidence

- **WHEN** an OpenSpeX change lacks its declared discipline manifest or required
  validation command results
- **THEN** `/opsx:verify` SHALL report the missing discipline evidence as
  CRITICAL issues
- **AND** it SHALL not declare the change ready for completion

#### Scenario: Accept discipline evidence when complete

- **WHEN** an OpenSpeX change has the expected worktree, branch, PR reference,
  merge evidence, discipline manifest, and successful validation command results
- **THEN** `/opsx:verify` SHALL include those checks in its completion report
- **AND** it SHALL treat both the git-governance and discipline dimensions as
  satisfied

### Requirement: Verification stricter than apply

`/opsx:verify` SHALL enforce completion checks that go beyond `/opsx:apply`
readiness.

#### Scenario: Verify fails on model/type discipline violation

- **WHEN** an OpenSpeX change introduces governed code that violates its
  declared model/type discipline without an explicit waiver
- **THEN** `/opsx:verify` SHALL report that violation as a CRITICAL issue
- **AND** it SHALL explain which file or scope appears to violate the declared
  discipline

#### Scenario: Verify fails on validation command failure

- **WHEN** any required validation command such as `ruff`, `ty`, `pyright`,
  `pnpm lint`, or `pnpm typecheck` fails for an OpenSpeX change
- **THEN** `/opsx:verify` SHALL report the failing command as a CRITICAL issue
- **AND** it SHALL not treat the change as ready for completion
