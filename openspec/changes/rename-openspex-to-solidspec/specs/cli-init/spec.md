## MODIFIED Requirements

### Requirement: Slash Command Generation

The command SHALL generate both `opsx` and `ssx` slash commands for selected AI
tools.

#### Scenario: Generating slash commands for a tool

- **WHEN** a tool is selected during initialization
- **THEN** create the standard `opsx` slash command files using the tool's
  command adapter for:
  - `/opsx:explore`
  - `/opsx:new`
  - `/opsx:continue`
  - `/opsx:apply`
  - `/opsx:ff`
  - `/opsx:verify`
  - `/opsx:inspect`
  - `/opsx:clarify`
  - `/opsx:sync`
  - `/opsx:archive`
  - `/opsx:bulk-archive`
- **AND** use tool-specific path conventions for that namespace (for example,
  `.claude/commands/opsx/` for Claude)
- **AND** include tool-specific frontmatter format

#### Scenario: Generating SolidSpec alias commands for a tool

- **WHEN** a tool is selected during initialization
- **THEN** create the matching `ssx` alias command files for the same workflow
  set
- **AND** use the explicit tool-specific path conventions for the `ssx`
  namespace instead of pattern-based path rewriting
- **AND** generate alias file content from the same workflow definitions so the
  `opsx` and `ssx` instructions stay in sync
