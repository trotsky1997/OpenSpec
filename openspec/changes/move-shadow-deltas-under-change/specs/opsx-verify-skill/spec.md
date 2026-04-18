## MODIFIED Requirements

### Requirement: Shadow-spec closure verification

`/opsx:verify` SHALL verify that every managed file is fully closed against its
shadow `impl-spec` state using the change-owned delta path as the working delta
source of truth.

#### Scenario: Report missing change-owned delta before verification closes a file

- **WHEN** a managed source or test file lacks its required change-owned
  `.delta.md`
- **THEN** `/opsx:verify` SHALL report the file as a CRITICAL issue
- **AND** the report SHALL include the exact managed file path and missing
  change-owned delta path

#### Scenario: Report legacy delta migration conflict

- **WHEN** only a legacy colocated delta exists for a managed file
- **OR** a legacy delta and change-owned delta both exist but disagree
- **THEN** `/opsx:verify` SHALL report the migration issue as a CRITICAL issue
- **AND** it SHALL identify the conflicting paths so the user can reconcile
  them before closure

#### Scenario: Merge accepted change-owned delta and changelog on successful verify

- **WHEN** a managed file satisfies the OpenSpeX verification checks
- **THEN** `/opsx:verify` SHALL merge that file's accepted change-owned
  `.delta.md` into the canonical shadow `impl-spec`
- **AND** it SHALL append the matching shadow changelog entry before declaring
  the file closed

#### Scenario: Preserve accepted delta in archived change history

- **WHEN** `/opsx:verify` completes successfully for a managed file
- **THEN** it SHALL leave the accepted delta in the change directory for archive
  provenance
- **AND** the canonical shadow tree SHALL only contain the merged `impl-spec`
  and changelog state

#### Scenario: Report merge-back failure as critical

- **WHEN** `/opsx:verify` cannot complete the shadow-spec merge-back or
  changelog update for a managed file
- **THEN** it SHALL report the failure as a CRITICAL issue
- **AND** it SHALL not declare the change ready for completion
