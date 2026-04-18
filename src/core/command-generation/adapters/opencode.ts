/**
 * OpenCode Command Adapter
 *
 * Formats commands for OpenCode following its frontmatter specification.
 */

import path from 'path';
import { DEFAULT_COMMAND_NAMESPACE, type CommandContent, type CommandNamespace, type ToolCommandAdapter } from '../types.js';
import { transformToHyphenCommands } from '../../../utils/command-references.js';

/**
 * OpenCode adapter for command generation.
 * File path: .opencode/commands/opsx-<id>.md
 * Frontmatter: description
 */
export const opencodeAdapter: ToolCommandAdapter = {
  toolId: 'opencode',

  getFilePath(commandId: string, namespace: CommandNamespace = DEFAULT_COMMAND_NAMESPACE): string {
    return path.join('.opencode', 'commands', `${namespace}-${commandId}.md`);
  },

  formatFile(content: CommandContent): string {
    const namespace = content.namespace ?? DEFAULT_COMMAND_NAMESPACE;

    // Transform command references from colon to hyphen format for OpenCode
    const transformedBody = transformToHyphenCommands(content.body, namespace);

    return `---
description: ${content.description}
---

${transformedBody}
`;
  },
};
