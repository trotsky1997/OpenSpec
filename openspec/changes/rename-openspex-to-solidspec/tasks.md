## 1. Variant metadata and compatibility

- [x] 1.1 Extend strict-workflow metadata parsing so `solidspec` is the primary variant while legacy `openspex` metadata and variant values still load correctly.
- [x] 1.2 Update change creation and scaffolding so new strict-workflow changes write the SolidSpec-facing variant and user-visible defaults.
- [x] 1.3 Update status/apply/instruction loading so strict-workflow detection and messages present `SolidSpec` consistently.

## 2. Command alias generation

- [x] 2.1 Make command generation and adapter paths namespace-aware so both `opsx` and `ssx` command files can be emitted explicitly.
- [x] 2.2 Update command-reference transforms and generated workflow content so hyphen-based tools emit both `opsx-*` and `ssx-*` aliases correctly.
- [x] 2.3 Update init/update/drift handling and welcome/setup messaging so both command namespaces are tracked and documented.

## 3. Workflow guidance and verification

- [x] 3.1 Update workflow templates, onboarding guidance, and strict-workflow help text to teach `SolidSpec` as the primary name while preserving `/opsx:*` references.
- [x] 3.2 Update strict-workflow verify/apply/readiness copy to mention legacy `openspex` compatibility only where needed.

## 4. Tests and validation

- [x] 4.1 Add regression tests for SolidSpec variant parsing/writing and legacy openspex compatibility.
- [x] 4.2 Add command-generation tests for `/ssx:*` aliases across representative adapter path styles, including Windows-safe path expectations.
- [x] 4.3 Run build, targeted tests, full validation, and `openspec` change checks for `rename-openspex-to-solidspec`.
