/**
 * Command Reference Utilities
 *
 * Utilities for transforming command references to tool-specific formats.
 */

import {
	DEFAULT_COMMAND_NAMESPACE,
	type CommandNamespace,
} from "../core/command-generation/types.js";

export function rewriteCommandNamespace(
	text: string,
	namespace: CommandNamespace = DEFAULT_COMMAND_NAMESPACE,
): string {
	const upperNamespace = namespace.toUpperCase();
	return text
		.replace(/\/opsx:/g, `/${namespace}:`)
		.replace(/\/opsx-/g, `/${namespace}-`)
		.replace(/\bOPSX:/g, `${upperNamespace}:`);
}

/**
 * Transforms colon-based command references to hyphen-based format.
 * Converts `/opsx:` patterns to `/opsx-` for tools that use hyphen syntax.
 *
 * @param text - The text containing command references
 * @returns Text with command references transformed to hyphen format
 *
 * @example
 * transformToHyphenCommands('/opsx:new') // returns '/opsx-new'
 * transformToHyphenCommands('Use /opsx:apply to implement') // returns 'Use /opsx-apply to implement'
 */
export function transformToHyphenCommands(
	text: string,
	namespace: CommandNamespace = DEFAULT_COMMAND_NAMESPACE,
): string {
	return rewriteCommandNamespace(text, namespace).replace(
		new RegExp(`/${namespace}:`, "g"),
		`/${namespace}-`,
	);
}
