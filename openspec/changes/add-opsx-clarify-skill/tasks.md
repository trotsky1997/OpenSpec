## 1. Clarify workflow templates and generation

- [x] 1.1 Add `getClarifyChangeSkillTemplate()` and
  `getOpsxClarifyCommandTemplate()` to the workflow template set.
- [x] 1.2 Register clarify in shared skill and command generation so generated
  tools receive the new OPSX workflow.
- [x] 1.3 Update workflow registries, counts, and setup output that currently
  assume the pre-clarify workflow set.

## 2. Interactive clarification behavior

- [x] 2.1 Implement the clarify prompt flow so it can work with or without an
  existing change and resolve the right clarification context.
- [x] 2.2 Define the structured clarification round behavior and summary output
  for `/opsx:clarify`.
- [x] 2.3 Ensure clarify ends with recommended next steps instead of becoming a
  code-editing or artifact-writing workflow.

## 3. Documentation and validation

- [x] 3.1 Update init and onboarding references to include `/opsx:clarify` in
  generated command guidance.
- [x] 3.2 Add template generation, registry, and parity tests for the new
  clarify skill / command.
- [x] 3.3 Run build and test coverage to verify the new generated workflow is
  stable across supported tools.
