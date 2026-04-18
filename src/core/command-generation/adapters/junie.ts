/**
 * Junie Command Adapter
 *
 * Formats commands for Junie following its frontmatter specification.
 */

import path from 'path';
import { DEFAULT_COMMAND_NAMESPACE, type CommandContent, type CommandNamespace, type ToolCommandAdapter } from '../types.js';

/**
 * Junie adapter for command generation.
 * File path: .junie/commands/opsx-<id>.md
 * Frontmatter: description
 */
export const junieAdapter: ToolCommandAdapter = {
  toolId: 'junie',

  getFilePath(commandId: string, namespace: CommandNamespace = DEFAULT_COMMAND_NAMESPACE): string {
    return path.join('.junie', 'commands', `${namespace}-${commandId}.md`);
  },

  formatFile(content: CommandContent): string {
    return `---
description: ${content.description}
---

${content.body}
`;
  },
};
