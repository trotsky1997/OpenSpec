# opsx-verify-skill Specification

## Purpose
Define `/opsx:verify` behavior for assessing implementation completeness, correctness, and coherence against change artifacts.

## Requirements
### Requirement: Verify Skill Invocation
The system SHALL provide an `/opsx:verify` skill that validates implementation against change artifacts.

#### Scenario: Verify with change name provided
- **WHEN** agent executes `/opsx:verify <change-name>`
- **THEN** the agent verifies implementation for that specific change
- **AND** produces a verification report

#### Scenario: Verify without change name
- **WHEN** agent executes `/opsx:verify` without a change name
- **THEN** the agent prompts user to select from available changes
- **AND** shows only changes that have implementation tasks

#### Scenario: Change has no tasks
- **WHEN** selected change has no tasks.md or tasks are empty
- **THEN** the agent reports "No tasks to verify"
- **AND** suggests running `/opsx:continue` to create tasks

### Requirement: Completeness Verification
The agent SHALL verify that all required work has been completed.

#### Scenario: Task completion check
- **WHEN** verifying completeness
- **THEN** the agent reads tasks.md
- **AND** counts tasks marked `- [x]` (complete) vs `- [ ]` (incomplete)
- **AND** reports completion status with specific incomplete tasks listed

#### Scenario: Spec coverage check
- **WHEN** verifying completeness
- **AND** delta specs exist in `openspec/changes/<name>/specs/`
- **THEN** the agent extracts all requirements from delta specs
- **AND** searches codebase for implementation of each requirement
- **AND** reports which requirements appear to have implementation vs which are missing

#### Scenario: All tasks complete
- **WHEN** all tasks are marked complete
- **THEN** report "Tasks: N/N complete"
- **AND** mark completeness dimension as passed

#### Scenario: Incomplete tasks found
- **WHEN** some tasks are incomplete
- **THEN** report "Tasks: X/N complete"
- **AND** list each incomplete task
- **AND** mark as CRITICAL issue
- **AND** suggest: "Complete remaining tasks or mark as done if already implemented"

### Requirement: Correctness Verification
The agent SHALL verify that implementation matches the specifications.

#### Scenario: Requirement implementation mapping
- **WHEN** verifying correctness
- **THEN** for each requirement in delta specs:
  - Search codebase for implementation
  - Identify relevant files and line numbers
  - Assess whether implementation satisfies the requirement

#### Scenario: Scenario coverage check
- **WHEN** verifying correctness
- **THEN** for each scenario in delta specs:
  - Check if the scenario's conditions are handled in code
  - Check if tests exist that cover the scenario
  - Report coverage status

#### Scenario: Implementation matches spec
- **WHEN** implementation appears to satisfy a requirement
- **THEN** report which files/lines implement it
- **AND** mark requirement as covered

#### Scenario: Implementation diverges from spec
- **WHEN** implementation exists but doesn't match spec intent
- **THEN** report the divergence as WARNING
- **AND** explain what differs
- **AND** suggest: either update implementation or update spec to match reality

#### Scenario: Missing implementation
- **WHEN** no implementation found for a requirement
- **THEN** report as CRITICAL issue
- **AND** suggest: "Implement requirement X" with guidance on what's needed

### Requirement: Coherence Verification
The agent SHALL verify that implementation is sensible and follows design decisions.

#### Scenario: Design.md adherence check
- **WHEN** verifying coherence
- **AND** design.md exists for the change
- **THEN** extract key decisions from design.md
- **AND** verify implementation follows those decisions
- **AND** report any deviations

#### Scenario: No design.md
- **WHEN** verifying coherence
- **AND** no design.md exists
- **THEN** skip design adherence check
- **AND** note "No design.md to verify against"

#### Scenario: Design decision followed
- **WHEN** implementation follows a design decision
- **THEN** report as confirmed
- **AND** cite evidence from code

#### Scenario: Design decision violated
- **WHEN** implementation contradicts a design decision
- **THEN** report as WARNING
- **AND** explain the contradiction
- **AND** suggest: either update implementation or update design.md

#### Scenario: Code pattern consistency
- **WHEN** verifying coherence
- **THEN** check if new code follows existing project patterns
- **AND** flag any significant deviations as suggestions

### Requirement: Verification Report Format
The agent SHALL produce a structured, prioritized report.

#### Scenario: Report summary
- **WHEN** verification completes
- **THEN** display summary scorecard:
  ```text
  ## Verification Report: <change-name>

  ### Summary
  | Dimension    | Status   |
  |--------------|----------|
  | Completeness | X/Y      |
  | Correctness  | X/Y      |
  | Coherence    | Followed |
  ```

#### Scenario: Issue prioritization
- **WHEN** issues are found
- **THEN** group and display in priority order:
  1. CRITICAL - Must fix before archive (missing implementation, incomplete tasks)
  2. WARNING - Should fix (divergence from spec/design, missing tests)
  3. SUGGESTION - Nice to fix (pattern inconsistencies, minor improvements)

#### Scenario: Actionable recommendations
- **WHEN** reporting an issue
- **THEN** include specific, actionable fix recommendation
- **AND** reference relevant files and line numbers where applicable
- **AND** avoid vague suggestions like "consider reviewing"

#### Scenario: All checks pass
- **WHEN** no issues found across all dimensions
- **THEN** display:
  ```text
  All checks passed. Ready for archive.
  ```

#### Scenario: Critical issues found
- **WHEN** CRITICAL issues exist
- **THEN** display:
  ```text
  X critical issue(s) found. Fix before archiving.
  ```
- **AND** do NOT suggest running archive

#### Scenario: Only warnings/suggestions
- **WHEN** no CRITICAL issues but warnings exist
- **THEN** display:
  ```text
  No critical issues. Y warning(s) to consider.
  Ready for archive (with noted improvements).
  ```

### Requirement: Flexible Artifact Handling
The agent SHALL gracefully handle changes with varying artifact completeness.

#### Scenario: Minimal change (tasks only)
- **WHEN** change has only tasks.md
- **THEN** verify task completion only
- **AND** skip spec and design checks
- **AND** note which checks were skipped

#### Scenario: Change with specs but no design
- **WHEN** change has tasks.md and delta specs but no design.md
- **THEN** verify completeness and correctness
- **AND** skip design adherence
- **AND** still check code coherence against project patterns

#### Scenario: Full change (all artifacts)
- **WHEN** change has proposal, design, specs, and tasks
- **THEN** perform all verification checks
- **AND** cross-reference artifacts for consistency

### Requirement: OpenSpeX workflow evidence verification

`/opsx:verify` SHALL treat `SolidSpec` as the canonical internal
strict-workflow name while continuing to accept legacy `openspex` evidence.

#### Scenario: Canonical verification reports use SolidSpec naming

- **WHEN** `/opsx:verify` reports strict-workflow evidence, blockers, or merged
  shadow artifacts
- **THEN** it SHALL use canonical `SolidSpec` naming in maintained reports and
  code paths
- **AND** it SHALL not present `openspex` as the primary maintained internal
  name

#### Scenario: Legacy evidence remains readable

- **WHEN** verification encounters legacy `openspex` metadata or compatibility
  artifacts
- **THEN** it SHALL continue to interpret them as the same strict workflow
- **AND** it SHALL normalize them into the canonical `SolidSpec` verification
  model

### Requirement: Shadow-spec closure verification

`/opsx:verify` SHALL verify that every managed file is fully closed against its
shadow `impl-spec` state.

#### Scenario: Report missing delta before verification closes a file

- **WHEN** a managed source or test file lacks its required `.delta.md`
- **THEN** `/opsx:verify` SHALL report the file as a CRITICAL issue
- **AND** the report SHALL include the exact managed file path and missing
  shadow artifact path

#### Scenario: Merge accepted delta and changelog on successful verify

- **WHEN** a managed file satisfies the SolidSpec verification checks
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

- **WHEN** `/opsx:apply` has completed the implementation tasks for an SolidSpec
  change
- **AND** shadow-spec closure or git-governance evidence is still missing
- **THEN** `/opsx:verify` SHALL fail the change with CRITICAL issues
- **AND** it SHALL explain that apply readiness does not imply completion

#### Scenario: Verify fails on model/type discipline violation

- **WHEN** an SolidSpec change introduces governed code that violates its
  declared model/type discipline without an explicit waiver
- **THEN** `/opsx:verify` SHALL report that violation as a CRITICAL issue
- **AND** it SHALL explain which file or scope appears to violate the declared
  discipline

#### Scenario: Verify fails on validation command failure

- **WHEN** any required validation command such as `ruff`, `ty`, `pyright`,
  `pnpm lint`, or `pnpm typecheck` fails for an SolidSpec change
- **THEN** `/opsx:verify` SHALL report the failing command as a CRITICAL issue
- **AND** it SHALL not treat the change as ready for completion

#### Scenario: Verify checks tests as managed files

- **WHEN** a test file appears in the SolidSpec managed-file inventory
- **THEN** `/opsx:verify` SHALL apply the same delta, shadow-spec, and changelog
  checks that it applies to source files
- **AND** it SHALL not downgrade test-file coverage to an optional suggestion

