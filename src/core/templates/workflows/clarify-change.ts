/**
 * Skill Template Workflow Modules
 *
 * Clarify ambiguous requests or change decisions through focused question rounds.
 */
import type { SkillTemplate, CommandTemplate } from "../types.js";

export function getClarifyChangeSkillTemplate(): SkillTemplate {
	return {
		name: "openspec-clarify-change",
		description:
			"Clarify ambiguous requests, requirements, or decisions before or during a change. Use when the user needs structured clarification rather than free-form exploration.",
		instructions: `Clarify an ambiguous request, requirement, or decision through focused interactive rounds.

**Input**: Optionally specify a change name or a topic to clarify. This workflow can be used with or without an existing change.

**Steps**

1. **Determine whether a change is in scope**

   If the user provided a change name, use it.

   Otherwise:
   - If the conversation clearly refers to one active change, you may use it as context
   - If multiple active changes are plausible, run \`openspec list --json\` and ask the user to choose
   - If no change is needed yet, continue in pre-change clarification mode

2. **Identify the main ambiguity**

   Restate what seems unclear. For example:
   - product scope
   - requirement interpretation
   - design trade-off
   - task readiness
   - next workflow step

   Make the ambiguity explicit before asking more questions.

3. **Run a focused clarification round**

   Ask a small set of targeted questions about that ambiguity.

   Prefer structured choice questions when concrete options exist.
   Use open-ended questions only when the ambiguity cannot be reduced to a useful option set.

   If a change is in scope, read the relevant artifacts first:
   - proposal
   - design
   - specs
   - tasks

4. **Summarize the current state of clarity**

   After each round, summarize:
   - confirmed decisions
   - assumptions
   - unresolved questions
   - recommended next step

5. **Decide whether another round is needed**

   If the ambiguity is still important, continue with another focused round.
   If the ambiguity has been reduced enough, stop and recommend the next workflow.

   Good next-step recommendations include:
   - \`/opsx:propose\` when the idea is clear enough to turn into artifacts
   - \`/opsx:apply\` when the user wants implementation-time validation or one task/feature needs deeper implementation analysis
   - another \`/opsx:clarify\` round when key uncertainty remains

**Output Format**

Use a concise structure like:

\`\`\`markdown
## Clarification Summary

**Topic:** <what was clarified>
**Change:** <change-name or none>

### Confirmed
- ...

### Assumptions
- ...

### Open Questions
- ...

### Recommended Next Step
1. ...
\`\`\`

**Guardrails**
- Keep each round focused on one main ambiguity
- Prefer explicit choices when useful
- Do not drift into free-form exploration when a focused question round will do
- Do not write code, tasks, or specs as part of clarify
- If a change is in scope, read relevant artifacts before asking questions
- Always end with a usable summary and next-step recommendation
`,
		license: "MIT",
		compatibility: "Requires openspec CLI.",
		metadata: { author: "openspec", version: "1.0" },
	};
}

export function getOpsxClarifyCommandTemplate(): CommandTemplate {
	return {
		name: "OPSX: Clarify",
		description:
			"Clarify ambiguous requests or change decisions through focused question rounds",
		category: "Workflow",
		tags: ["workflow", "clarify", "questions", "experimental"],
		content: `Clarify an ambiguous request, requirement, or decision through focused interactive rounds.

**Input**: Optionally specify a change name or a topic to clarify. This workflow can be used with or without an existing change.

**Steps**

1. **Determine whether a change is in scope**

   If the user provided a change name, use it.

   Otherwise:
   - If the conversation clearly refers to one active change, you may use it as context
   - If multiple active changes are plausible, run \`openspec list --json\` and ask the user to choose
   - If no change is needed yet, continue in pre-change clarification mode

2. **Identify the main ambiguity**

   Restate what seems unclear. For example:
   - product scope
   - requirement interpretation
   - design trade-off
   - task readiness
   - next workflow step

   Make the ambiguity explicit before asking more questions.

3. **Run a focused clarification round**

   Ask a small set of targeted questions about that ambiguity.

   Prefer structured choice questions when concrete options exist.
   Use open-ended questions only when the ambiguity cannot be reduced to a useful option set.

   If a change is in scope, read the relevant artifacts first:
   - proposal
   - design
   - specs
   - tasks

4. **Summarize the current state of clarity**

   After each round, summarize:
   - confirmed decisions
   - assumptions
   - unresolved questions
   - recommended next step

5. **Decide whether another round is needed**

   If the ambiguity is still important, continue with another focused round.
   If the ambiguity has been reduced enough, stop and recommend the next workflow.

   Good next-step recommendations include:
   - \`/opsx:propose\` when the idea is clear enough to turn into artifacts
   - \`/opsx:apply\` when the user wants implementation-time validation or one task/feature needs deeper implementation analysis
   - another \`/opsx:clarify\` round when key uncertainty remains

**Output Format**

Use a concise structure like:

\`\`\`markdown
## Clarification Summary

**Topic:** <what was clarified>
**Change:** <change-name or none>

### Confirmed
- ...

### Assumptions
- ...

### Open Questions
- ...

### Recommended Next Step
1. ...
\`\`\`

**Guardrails**
- Keep each round focused on one main ambiguity
- Prefer explicit choices when useful
- Do not drift into free-form exploration when a focused question round will do
- Do not write code, tasks, or specs as part of clarify
- If a change is in scope, read relevant artifacts before asking questions
- Always end with a usable summary and next-step recommendation
`,
	};
}
