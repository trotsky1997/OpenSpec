## 1. Inspect workflow templates and generation

- [x] 1.1 Add `getInspectChangeSkillTemplate()` and
  `getOpsxInspectCommandTemplate()` to the workflow template set.
- [x] 1.2 Register inspect in shared skill and command generation so generated
  tools receive the new OPSX workflow.
- [x] 1.3 Update any generated workflow counts, workflow IDs, and setup output
  that assume the old inspect-free command set.

## 2. Scoped inspection behavior

- [x] 2.1 Implement the inspect prompt flow so it resolves a change first, then
  resolves either a task target or a feature / requirement target.
- [x] 2.2 Reuse verify-style evidence gathering in the inspect workflow while
  keeping the report scoped to the selected task or feature.
- [x] 2.3 Ensure inspect outputs a structured deep-dive report with evidence,
  findings, and scoped next steps instead of a whole-change archive verdict.

## 3. Documentation and validation

- [x] 3.1 Update init and onboarding references to include `/opsx:inspect` in
  generated command guidance.
- [x] 3.2 Add template generation and parity tests for the new inspect skill /
  command.
- [x] 3.3 Run build and test coverage to verify the new generated workflow is
  stable across supported tools.
