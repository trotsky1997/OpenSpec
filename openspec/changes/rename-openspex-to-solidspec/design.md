## Context

The strict OpenSpec workflow is currently exposed as `OpenSpeX` in variant
names, CLI help, workflow templates, specs, and generated commands. The same
strict workflow is also represented internally by `openspex` metadata, helper
names, branch defaults, readiness output, and a command-generation stack that
hardcodes the `/opsx:*` namespace into adapter paths and body rewriting.

The rename has to do more than swap strings. New users should encounter
`SolidSpec` as the primary name, but existing repositories that already store
`variant: openspex`, `openspex:` metadata, or generated `/opsx:*` commands must
continue to work. The repo is cross-platform, so any command alias generation
must continue to use explicit adapter paths and path utilities instead of
hand-built slash assumptions.

## Goals / Non-Goals

**Goals:**
- Make `SolidSpec` the primary user-facing name for the strict workflow.
- Accept `solidspec` as the primary strict-workflow variant while preserving
  legacy `openspex` compatibility.
- Generate `/ssx:*` command aliases without removing `/opsx:*` commands.
- Update status, apply, verify, onboarding, and setup messaging to say
  `SolidSpec` by default.
- Keep the implementation explicit and adapter-driven rather than relying on
  fragile string guessing.

**Non-Goals:**
- Fully renaming every internal file, module, or spec folder that still contains
  `openspex` in its identifier.
- Removing `/opsx:*` commands or forcing existing repos to migrate in one step.
- Auto-rewriting archived changes or already-generated user files outside the
  normal init/update flows.

## Decisions

### 1. Treat `SolidSpec` as the new public variant while accepting legacy inputs

The metadata layer should accept both `variant: solidspec` and legacy
`variant: openspex`. New scaffolding should write the new primary value, while
legacy metadata remains readable.

To minimize breakage, metadata parsing should also accept legacy `openspex:`
blocks and new `solidspec:` blocks, then normalize them through a shared helper
that downstream code can use. This keeps compatibility logic in one place
instead of scattering alias checks across status, apply, verify, and scaffolding
code.

Alternative considered: keep `variant: openspex` internally and only rename
strings in prompts/docs. Rejected because it would leave the primary user-facing
CLI contract inconsistent with the new name.

### 2. Keep existing helper/module names where that reduces churn

The repo already has utilities, tests, and file names such as
`src/utils/openspex.ts` and `openspec/specs/solidspec-code-discipline/`. Those
internal identifiers can stay for now as compatibility scaffolding, as long as
user-visible output consistently says `SolidSpec`.

Alternative considered: rename every helper, folder, and test file in the same
change. Rejected for now because it adds large churn without changing runtime
behavior, and the user explicitly allowed compatibility aliases.

### 3. Make command generation namespace-aware and emit both prefixes

The current command generation path is hardcoded around `opsx` in adapters,
welcome text, update text, and reference transforms. To add `/ssx:*` aliases
cleanly, the generation layer should become namespace-aware and emit both
command sets from the same workflow templates.

That means:
- adapters need a way to generate file paths for both `opsx` and `ssx`
- hyphen-based tools need reference transforms for both `/opsx:` and `/ssx:`
- init/update/drift logic must treat both namespaces as OpenSpec-managed output

Alternative considered: post-process generated `opsx` files by renaming their
paths with generic string replacement. Rejected because the repo prefers
explicit adapter logic over pattern-based mutation, and several adapters encode
namespace differently in paths and frontmatter.

### 4. Keep workflow templates `opsx`-centric but teach the `SolidSpec` name

The workflow IDs and skill names can remain under the existing `opsx` family,
while the body text and CLI guidance explain that `SolidSpec` is the strict
workflow and that `/ssx:*` aliases are available. This matches the user's choice
to keep `/opsx:*` and add `/ssx:*` rather than replacing the whole command
family.

### 5. Verify compatibility with focused tests before wider validation

The most fragile areas are metadata parsing, new-change scaffolding, command
adapter paths, and generated command content. Tests should first cover those
surfaces directly, then run the broader build/test validation once the alias and
rename behavior is stable.

## Risks / Trade-offs

- [Mixed naming remains internally] -> Mitigation: normalize strict-workflow
  detection behind shared helpers and switch all user-facing strings to
  `SolidSpec`.
- [Command alias generation doubles generated outputs] -> Mitigation: make
  namespace emission explicit and update drift/update logic to manage both sets.
- [Legacy metadata compatibility becomes inconsistent] -> Mitigation: validate
  both old and new metadata shapes in one schema path and add regression tests.
- [Spec and template churn gets broad] -> Mitigation: keep the change scoped to
  strict-workflow naming, aliases, and compatibility rather than wider cleanup.
