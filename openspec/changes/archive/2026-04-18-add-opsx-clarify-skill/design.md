## Context

OpenSpec already has multiple workflows that ask clarifying questions when they
need to, but those questions are embedded inside broader flows such as propose,
apply, archive, verify, or inspect. That means ambiguity handling is present,
but it is not a first-class workflow users can invoke intentionally when they
know the problem is still fuzzy.

`/opsx:clarify` should be the dedicated "let's narrow this down" workflow. It
sits earlier than propose, can be used mid-flight when implementation reveals
new uncertainty, and should end with a concrete summary of what is known, what
is still unknown, and what workflow the user should use next.

## Goals / Non-Goals

**Goals:**

- Add a dedicated `/opsx:clarify` skill and slash command.
- Support clarification with or without an existing active change.
- Use structured interactive rounds to resolve ambiguity around scope,
  requirements, trade-offs, and next steps.
- Produce a reusable clarification summary after each run.
- Integrate clarify into generated workflows and onboarding references.

**Non-Goals:**

- Replacing explore as the open-ended thinking workflow.
- Replacing propose as the artifact creation workflow.
- Automatically editing change artifacts or code as part of clarify.
- Building a general-purpose conversational agent outside the OPSX workflow
  model.

## Decisions

### 1. Model clarify as a dedicated workflow, not a mode inside explore or propose

`/opsx:clarify` should be its own workflow template and generated slash command.

Why:

- explore remains intentionally free-form and non-prescriptive
- propose remains artifact-driven and output-oriented
- clarify can be explicitly optimized for narrowing ambiguity through
  interactive question rounds and summary output

Alternative considered: fold clarify into `/opsx:explore`. Rejected because
explore is deliberately broad, while clarify needs a more explicit question /
summary rhythm.

### 2. Support two entry modes: pre-change and change-scoped

Clarify should work in either of these contexts:

- **Pre-change clarification**: the user has an idea or request, but no change
  exists yet
- **Change-scoped clarification**: the user is already working on a change and
  needs to resolve uncertainty about a requirement, task, or design choice

If a change is provided or clearly in context, clarify should use it. Otherwise,
it should clarify the request without requiring a change first.

### 3. Use iterative clarification rounds with explicit summaries

Each clarify session should follow a lightweight cycle:

1. identify the ambiguous topic
2. ask a small set of focused clarification questions
3. summarize what is now understood
4. decide whether another round is needed or whether the user should move on

This gives the user visible progress without making the workflow feel as open
ended as explore.

### 4. Prefer structured question sets when concrete options exist

When the ambiguity is about discrete choices, clarify should prefer structured
multiple-choice questions. When the ambiguity cannot be cleanly enumerated, it
can still ask open-ended follow-ups, but the workflow should bias toward making
choices explicit.

That approach matches the existing AskUserQuestion interaction model and makes
clarification summaries easier to produce.

### 5. End with a next-step recommendation, not just a transcript

Clarify should always conclude with an actionable recommendation such as:

- proceed to `/opsx:propose`
- continue with another clarify round
- update an existing proposal/design/tasks file
- use `/opsx:inspect` or `/opsx:verify` for deeper implementation analysis

This keeps clarify useful as a bridge into the next workflow rather than a dead
end.

## Risks / Trade-offs

- [Overlap with explore] Users may be unsure whether to use clarify or explore ->
  Mitigation: document clarify as structured ambiguity resolution and explore as
  broader thinking.
- [Too many questions] A clarification flow can feel bureaucratic if it over-asks
  -> Mitigation: keep each round focused and small, with explicit stop points.
- [Weak summaries] If the summary does not reduce ambiguity, the workflow feels
  redundant -> Mitigation: require every run to produce confirmed decisions,
  assumptions, open questions, and next-step guidance.
- [Cross-tool consistency] Clarify must generate correctly across all supported
  tools -> Mitigation: implement it through the existing shared template and
  registry system.

## Migration Plan

1. Add the new clarify capability spec and supporting design.
2. Add clarify workflow templates and register them in shared skill/command
   generation.
3. Update init-generation and onboarding references to include clarify.
4. Add tests for template generation, workflow registries, and command
   references.
5. Validate generated content and the affected specs.

## Open Questions

- Should clarify support persisting its summary into a file in a follow-up
  change, or should it stay purely conversational for the first version?
- Should clarify prefer existing active changes when one likely matches the
  conversation, or always ask the user to confirm first?
