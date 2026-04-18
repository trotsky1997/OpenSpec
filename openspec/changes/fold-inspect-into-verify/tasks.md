## 1. Internalize inspect and wire verify

- [x] 1.1 Refactor inspect workflow logic so it becomes an internal helper instead of a public generated workflow.
- [x] 1.2 Update verify to invoke or embed the internal inspect-style scoped analysis when deep task/feature inspection is needed.
- [x] 1.3 Preserve inspect-style report structure and scoped evidence gathering for internal workflow-to-workflow use.

## 2. Remove public inspect exposure

- [x] 2.1 Remove inspect from public workflow registration, generation, and profile-visible workflow inventories.
- [x] 2.2 Update init/update generation and related tests so no public inspect skill or slash command is installed.
- [x] 2.3 Update onboarding and clarify guidance so users are directed to verify instead of inspect.

## 3. Validation

- [x] 3.1 Add or update tests covering the missing public inspect surface and the new verify-owned scoped analysis behavior.
- [x] 3.2 Run build, targeted tests, full validation, and `openspec` change checks for `fold-inspect-into-verify`.
