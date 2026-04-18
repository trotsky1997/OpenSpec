## 1. Internalize verify and wire apply

- [x] 1.1 Refactor verify workflow logic so it becomes an internal helper instead of a public generated workflow.
- [x] 1.2 Update apply to invoke or embed the internal verify-style validation when readiness, correctness, or closeout checks are needed.
- [x] 1.3 Preserve verify-style reporting structure and evidence gathering for internal workflow-to-workflow use.

## 2. Remove public verify exposure

- [x] 2.1 Remove verify from public workflow registration, generation, and profile-visible workflow inventories.
- [x] 2.2 Update init/update generation and related tests so no public verify skill or slash command is installed.
- [x] 2.3 Update onboarding and clarify guidance so users are directed to apply instead of verify.

## 3. Validation

- [x] 3.1 Add or update tests covering the missing public verify surface and the new apply-owned validation behavior.
- [x] 3.2 Run build, targeted tests, full validation, and `openspec` change checks for `fold-verify-into-apply`.
