/**
 * Crush Command Adapter
 *
 * Formats commands for Crush following its frontmatter specification.
 */

import path from 'path';
import { DEFAULT_COMMAND_NAMESPACE, type CommandContent, type CommandNamespace, type ToolCommandAdapter } from '../types.js';

/**
 * Crush adapter for command generation.
 * File path: .crush/commands/opsx/<id>.md
 * Frontmatter: name, description, category, tags
 */
export const crushAdapter: ToolCommandAdapter = {
  toolId: 'crush',

  getFilePath(commandId: string, namespace: CommandNamespace = DEFAULT_COMMAND_NAMESPACE): string {
    return path.join('.crush', 'commands', namespace, `${commandId}.md`);
  },

  formatFile(content: CommandContent): string {
    const tagsStr = content.tags.join(', ');
    return `---
name: ${content.name}
description: ${content.description}
category: ${content.category}
tags: [${tagsStr}]
---

${content.body}
`;
  },
};
