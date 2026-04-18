/**
 * Continue Command Adapter
 *
 * Formats commands for Continue following its .prompt specification.
 */

import path from 'path';
import { DEFAULT_COMMAND_NAMESPACE, type CommandContent, type CommandNamespace, type ToolCommandAdapter } from '../types.js';

/**
 * Continue adapter for command generation.
 * File path: .continue/prompts/opsx-<id>.prompt
 * Frontmatter: name, description, invokable
 */
export const continueAdapter: ToolCommandAdapter = {
  toolId: 'continue',

  getFilePath(commandId: string, namespace: CommandNamespace = DEFAULT_COMMAND_NAMESPACE): string {
    return path.join('.continue', 'prompts', `${namespace}-${commandId}.prompt`);
  },

  formatFile(content: CommandContent): string {
    const namespace = content.namespace ?? DEFAULT_COMMAND_NAMESPACE;

    return `---
name: ${namespace}-${content.id}
description: ${content.description}
invokable: true
---

${content.body}
`;
  },
};
