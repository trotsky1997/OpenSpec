## MODIFIED Requirements

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
  `/opsx:verify`, or another clarify round
- **AND** it SHALL not direct users to a public `/opsx:inspect` command
- **AND** it SHALL explain why the recommended next step fits the current level
  of clarity
