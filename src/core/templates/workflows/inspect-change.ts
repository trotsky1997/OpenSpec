/**
 * Skill Template Workflow Modules
 *
 * Inspect change implementation in a scoped, verify-derived way.
 */
import type { SkillTemplate, CommandTemplate } from "../types.js";

export function getInspectChangeSkillTemplate(): SkillTemplate {
	return {
		name: "openspec-inspect-change",
		description:
			"Inspect one task or feature inside an OpenSpec change. Use when the user wants a deep implementation review of a specific scoped target rather than a whole-change verify pass.",
		instructions: `Inspect a specific task or feature inside an OpenSpec change.

**Input**: Optionally specify a change name and a scope target. The scope can be a task from tasks.md or a feature / requirement from the change specs. If either is missing or ambiguous you MUST prompt.

**Steps**

1. **Resolve the change**

   If a change name is provided, use it. Otherwise:
   - Infer it from recent conversation only if the user has been explicitly working on one change
   - If ambiguous, run \
   \
   \
   \`openspec list --json\` and prompt the user to choose from active changes that have tasks or specs to inspect

   Always announce: "Inspecting change: <name>" and how to override.

2. **Load change status and context**

   \
   \
   \
   \`openspec status --change "<name>" --json\`

   \
   \
   \
   \`openspec instructions apply --change "<name>" --json\`

   Parse the output to understand:
   - schema name
   - available context files
   - whether tasks and specs exist

3. **Resolve the inspection scope**

   Inspect must target one of:
   - **Task scope**: a checkbox item from \
   \`tasks.md\`
   - **Feature scope**: a requirement or feature-sized requirement cluster from the change specs

   Resolution rules:
   - If the user gave a task ID or task text, match against pending/completed tasks
   - If the user gave a feature name, match against requirement headers in the change specs
   - If there are multiple plausible matches, show the candidates and prompt the user to choose
   - If no scope was provided, prompt the user to pick either a task or a feature to inspect

4. **Read the relevant context**

   Read all apply context files first.

   Then focus on the scope:
   - **Task scope**: read the specific task item, nearby task group, proposal, design, and related specs
   - **Feature scope**: read the matching requirement and related scenarios, then design and tasks that mention or support it

5. **Inspect the scoped implementation**

   Reuse verify-style evidence gathering, but only for the selected scope:

   **Completeness**
   - Is this task / feature implemented?
   - Does the code appear partial, missing, or complete?

   **Correctness**
   - Which files appear to implement it?
   - Which tests appear to cover it?
   - Does the code match the task intent or requirement behavior?

   **Coherence**
   - Does the implementation fit the design and surrounding project patterns?
   - Are there obvious divergences, shortcuts, or mismatches for this scope?

6. **Produce a scoped inspection report**

   Use a report structure like:

   \
   \
   \
   \`\`\`markdown
   ## Inspection Report: <change-name>

   **Scope:** <task or feature>

   ### Evidence
   - Files: ...
   - Tests: ...
   - Specs/Tasks: ...

   ### Findings
   - CRITICAL: ...
   - WARNING: ...
   - SUGGESTION: ...

   ### Assessment
   <implemented / partial / missing / divergent>

   ### Next Steps
   1. ...
   2. ...
   \`\`\`

   The report is scope-centered. Do NOT turn it into a whole-change archive verdict by default.

**Guardrails**
- Always resolve both the change and the scope explicitly
- If the scope is ambiguous, prompt instead of guessing
- Reuse verify-style evidence, but keep the report limited to the chosen task or feature
- Cite file paths and tests when possible
- Do not modify code, tasks, or specs as part of inspect
- If the user wants full readiness judgment, suggest using \
\`/opsx:verify\`
`,
		license: "MIT",
		compatibility: "Requires openspec CLI.",
		metadata: { author: "openspec", version: "1.0" },
	};
}

export function getOpsxInspectCommandTemplate(): CommandTemplate {
	return {
		name: "OPSX: Inspect",
		description:
			"Inspect one task or feature inside a change with a deeper, scoped report",
		category: "Workflow",
		tags: ["workflow", "inspect", "analysis", "experimental"],
		content: `Inspect a specific task or feature inside an OpenSpec change.

**Input**: Optionally specify a change name and a scope target after \
\`/opsx:inspect\`. The scope can be a task from tasks.md or a feature / requirement from the change specs. If either is missing or ambiguous you MUST prompt.

**Steps**

1. **Resolve the change**

   If a change name is provided, use it. Otherwise:
   - Infer it from recent conversation only if the user has been explicitly working on one change
   - If ambiguous, run \
   \`openspec list --json\` and prompt the user to choose from active changes that have tasks or specs to inspect

   Always announce: "Inspecting change: <name>" and how to override.

2. **Load change status and context**

   \
   \`openspec status --change "<name>" --json\`

   \
   \`openspec instructions apply --change "<name>" --json\`

   Parse the output to understand:
   - schema name
   - available context files
   - whether tasks and specs exist

3. **Resolve the inspection scope**

   Inspect must target one of:
   - **Task scope**: a checkbox item from \
   \`tasks.md\`
   - **Feature scope**: a requirement or feature-sized requirement cluster from the change specs

   Resolution rules:
   - If the user gave a task ID or task text, match against pending/completed tasks
   - If the user gave a feature name, match against requirement headers in the change specs
   - If there are multiple plausible matches, show the candidates and prompt the user to choose
   - If no scope was provided, prompt the user to pick either a task or a feature to inspect

4. **Read the relevant context**

   Read all apply context files first.

   Then focus on the scope:
   - **Task scope**: read the specific task item, nearby task group, proposal, design, and related specs
   - **Feature scope**: read the matching requirement and related scenarios, then design and tasks that mention or support it

5. **Inspect the scoped implementation**

   Reuse verify-style evidence gathering, but only for the selected scope:

   **Completeness**
   - Is this task / feature implemented?
   - Does the code appear partial, missing, or complete?

   **Correctness**
   - Which files appear to implement it?
   - Which tests appear to cover it?
   - Does the code match the task intent or requirement behavior?

   **Coherence**
   - Does the implementation fit the design and surrounding project patterns?
   - Are there obvious divergences, shortcuts, or mismatches for this scope?

6. **Produce a scoped inspection report**

   Use a report structure like:

   \
   \`\`\`markdown
   ## Inspection Report: <change-name>

   **Scope:** <task or feature>

   ### Evidence
   - Files: ...
   - Tests: ...
   - Specs/Tasks: ...

   ### Findings
   - CRITICAL: ...
   - WARNING: ...
   - SUGGESTION: ...

   ### Assessment
   <implemented / partial / missing / divergent>

   ### Next Steps
   1. ...
   2. ...
   \`\`\`

   The report is scope-centered. Do NOT turn it into a whole-change archive verdict by default.

**Guardrails**
- Always resolve both the change and the scope explicitly
- If the scope is ambiguous, prompt instead of guessing
- Reuse verify-style evidence, but keep the report limited to the chosen task or feature
- Cite file paths and tests when possible
- Do not modify code, tasks, or specs as part of inspect
- If the user wants full readiness judgment, suggest using \
\`/opsx:verify\`
`,
	};
}
