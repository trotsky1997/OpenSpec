# opsx-clarify-skill Specification

## Purpose
Define `/opsx:clarify` behavior for interactive ambiguity resolution before or during a change.

## Requirements

### Requirement: Clarify skill invocation

The system SHALL provide an `/opsx:clarify` skill for interactive ambiguity
resolution before or during a change.

#### Scenario: Clarify without an existing change

- **WHEN** agent executes `/opsx:clarify` for an ambiguous request that is not
  yet tied to a change
- **THEN** the agent SHALL clarify the request directly
- **AND** it SHALL not require a change to exist before starting

#### Scenario: Clarify with a change name provided

- **WHEN** agent executes `/opsx:clarify <change-name>`
- **THEN** the agent SHALL use that change as the clarification context
- **AND** it SHALL tailor its questions to the change artifacts that exist

#### Scenario: Clarify with ambiguous change context

- **WHEN** the user appears to be clarifying an existing change but the target
  change is ambiguous
- **THEN** the agent SHALL prompt the user to choose the change explicitly
- **AND** it SHALL not guess the target change automatically

### Requirement: Iterative clarification rounds

`/opsx:clarify` SHALL run in focused clarification rounds.

#### Scenario: Focused question round

- **WHEN** a clarification round begins
- **THEN** the agent SHALL identify the main ambiguity it is trying to reduce
- **AND** it SHALL ask a small set of targeted questions about that ambiguity
- **AND** it SHALL avoid turning the round into an unfocused general interview

#### Scenario: Structured choice questions

- **WHEN** the ambiguity involves concrete alternatives or trade-offs
- **THEN** the agent SHALL prefer structured question choices
- **AND** it SHALL make the differences between options explicit

#### Scenario: Continue another round

- **WHEN** one round reduces ambiguity but important questions remain
- **THEN** the agent SHALL summarize what is now known
- **AND** it SHALL identify the remaining open questions
- **AND** it SHALL continue with another clarification round only if needed

### Requirement: Clarification summary output

`/opsx:clarify` SHALL end with a concise structured summary.

#### Scenario: Summary after clarification

- **WHEN** a clarify session pauses or completes
- **THEN** the agent SHALL summarize confirmed decisions, assumptions,
  unresolved questions, and recommended next steps
- **AND** the summary SHALL be understandable without rereading the full
  question history

#### Scenario: Next-step recommendation

- **WHEN** the clarify session has reduced ambiguity enough to proceed
- **THEN** the agent SHALL recommend a next workflow such as `/opsx:propose`,
  `/opsx:inspect`, `/opsx:verify`, or another clarify round
- **AND** it SHALL explain why that next step fits the current level of clarity

### Requirement: Change-aware clarification

`/opsx:clarify` SHALL use change artifacts when a change is in scope.

#### Scenario: Clarify against existing artifacts

- **WHEN** a target change has proposal, design, specs, or tasks artifacts
- **THEN** the agent SHALL read the relevant artifacts before asking questions
- **AND** it SHALL anchor clarification to the actual documented ambiguity

#### Scenario: Clarify mid-implementation

- **WHEN** implementation uncovers uncertainty inside an active change
- **THEN** `/opsx:clarify` SHALL help narrow that uncertainty without becoming
  a code-editing workflow
- **AND** it SHALL point the user back to the appropriate next action once the
  ambiguity is reduced
