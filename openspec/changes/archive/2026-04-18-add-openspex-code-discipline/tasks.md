## 1. Discipline manifest and policy model

- [x] 1.1 Define the OpenSpeX code-discipline manifest format and where it
  lives for each governed change.
- [x] 1.2 Extend OpenSpeX metadata or manifest loading to surface discipline
  policy and required validation commands explicitly.
- [x] 1.3 Add scaffolding or setup helpers so new OpenSpeX changes can declare
  discipline rules and required commands deterministically.

## 2. Apply and verify enforcement

- [x] 2.1 Update apply-readiness logic to block OpenSpeX changes that lack a
  discipline manifest or explicit validation command declarations.
- [x] 2.2 Update `/opsx:verify` to enforce declared validation commands and
  report discipline failures as critical issues.
- [x] 2.3 Add verify-time reporting for model/type discipline violations and
  documented waivers in governed code.

## 3. Documentation and validation

- [x] 3.1 Add tests for discipline manifest parsing, apply blockers, and verify
  command-failure handling.
- [x] 3.2 Add cross-language examples or fixtures covering Python-style
  `ruff`/`ty` gates and TypeScript-style lint/typecheck gates.
- [x] 3.3 Update workflow docs and generated guidance so OpenSpeX is documented
  as both a git-discipline and code-discipline workflow.
