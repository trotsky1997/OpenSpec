/**
 * CoStrict Command Adapter
 *
 * Formats commands for CoStrict following its frontmatter specification.
 */

import path from 'path';
import { DEFAULT_COMMAND_NAMESPACE, type CommandContent, type CommandNamespace, type ToolCommandAdapter } from '../types.js';

/**
 * CoStrict adapter for command generation.
 * File path: .cospec/openspec/commands/opsx-<id>.md
 * Frontmatter: description, argument-hint
 */
export const costrictAdapter: ToolCommandAdapter = {
  toolId: 'costrict',

  getFilePath(commandId: string, namespace: CommandNamespace = DEFAULT_COMMAND_NAMESPACE): string {
    return path.join('.cospec', 'openspec', 'commands', `${namespace}-${commandId}.md`);
  },

  formatFile(content: CommandContent): string {
    return `---
description: "${content.description}"
argument-hint: command arguments
---

${content.body}
`;
  },
};
