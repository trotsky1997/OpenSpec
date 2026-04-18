/**
 * Qwen Code Command Adapter
 *
 * Formats commands for Qwen Code following its TOML specification.
 */

import path from 'path';
import { DEFAULT_COMMAND_NAMESPACE, type CommandContent, type CommandNamespace, type ToolCommandAdapter } from '../types.js';

/**
 * Qwen adapter for command generation.
 * File path: .qwen/commands/opsx-<id>.toml
 * Format: TOML with description and prompt fields
 */
export const qwenAdapter: ToolCommandAdapter = {
  toolId: 'qwen',

  getFilePath(commandId: string, namespace: CommandNamespace = DEFAULT_COMMAND_NAMESPACE): string {
    return path.join('.qwen', 'commands', `${namespace}-${commandId}.toml`);
  },

  formatFile(content: CommandContent): string {
    return `description = "${content.description}"

prompt = """
${content.body}
"""
`;
  },
};
