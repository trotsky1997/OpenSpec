## MODIFIED Requirements

### Requirement: Skill Generation

The command SHALL generate Agent Skills for selected AI tools.

#### Scenario: Generating skills for a tool

- **WHEN** a tool is selected during initialization
- **THEN** create 10 skill directories under `.<tool>/skills/`:
  - `openspec-explore/SKILL.md`
  - `openspec-new-change/SKILL.md`
  - `openspec-continue-change/SKILL.md`
  - `openspec-apply-change/SKILL.md`
  - `openspec-ff-change/SKILL.md`
  - `openspec-verify-change/SKILL.md`
  - `openspec-inspect-change/SKILL.md`
  - `openspec-sync-specs/SKILL.md`
  - `openspec-archive-change/SKILL.md`
  - `openspec-bulk-archive-change/SKILL.md`
- **AND** each SKILL.md SHALL contain YAML frontmatter with name and
  description
- **AND** each SKILL.md SHALL contain the skill instructions

### Requirement: Slash Command Generation

The command SHALL generate opsx slash commands for selected AI tools.

#### Scenario: Generating slash commands for a tool

- **WHEN** a tool is selected during initialization
- **THEN** create 10 slash command files using the tool's command adapter:
  - `/opsx:explore`
  - `/opsx:new`
  - `/opsx:continue`
  - `/opsx:apply`
  - `/opsx:ff`
  - `/opsx:verify`
  - `/opsx:inspect`
  - `/opsx:sync`
  - `/opsx:archive`
  - `/opsx:bulk-archive`
- **AND** use tool-specific path conventions (e.g., `.claude/commands/opsx/`
  for Claude)
- **AND** include tool-specific frontmatter format
