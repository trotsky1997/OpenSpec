## MODIFIED Requirements

### Requirement: Skill Generation

The command SHALL generate Agent Skills for selected AI tools for the public
workflow surface only.

#### Scenario: Generating skills for a tool
- **WHEN** a tool is selected during initialization
- **THEN** create 9 public skill directories under `.<tool>/skills/`:
  - `openspec-explore/SKILL.md`
  - `openspec-new-change/SKILL.md`
  - `openspec-continue-change/SKILL.md`
  - `openspec-apply-change/SKILL.md`
  - `openspec-ff-change/SKILL.md`
  - `openspec-clarify-change/SKILL.md`
  - `openspec-sync-specs/SKILL.md`
  - `openspec-archive-change/SKILL.md`
  - `openspec-bulk-archive-change/SKILL.md`
- **AND** it SHALL not generate a public `openspec-verify-change/SKILL.md`
  artifact
- **AND** each generated `SKILL.md` SHALL contain YAML frontmatter with name and
  description
- **AND** each generated `SKILL.md` SHALL contain the skill instructions

### Requirement: Slash Command Generation

The command SHALL generate public opsx slash commands for selected AI tools.

#### Scenario: Generating slash commands for a tool
- **WHEN** a tool is selected during initialization
- **THEN** create 9 public slash command files using the tool's command adapter:
  - `/opsx:explore`
  - `/opsx:new`
  - `/opsx:continue`
  - `/opsx:apply`
  - `/opsx:ff`
  - `/opsx:clarify`
  - `/opsx:sync`
  - `/opsx:archive`
  - `/opsx:bulk-archive`
- **AND** it SHALL not generate a public `/opsx:verify` command
- **AND** it SHALL use tool-specific path conventions and frontmatter formats
