/**
 * Profile System
 *
 * Defines workflow profiles that control which workflows are installed.
 * Profiles determine WHICH workflows; delivery (in global config) determines HOW.
 */

import type { Profile } from "./global-config.js";

/**
 * Core workflows included in the 'core' profile.
 * These provide the streamlined experience for new users.
 */
export const CORE_WORKFLOWS = [
	"propose",
	"explore",
	"apply",
	"archive",
] as const;

/**
 * All available workflows in the system.
 */
export const ALL_WORKFLOWS = [
	"propose",
	"explore",
	"new",
	"continue",
	"apply",
	"ff",
	"sync",
	"archive",
	"bulk-archive",
	"verify",
	"inspect",
	"clarify",
	"onboard",
] as const;

/**
 * Public workflows exposed to users through generated skills, commands, and
 * profile selection surfaces. Internal helpers such as inspect stay out of
 * this list so existing installs can be cleaned up without keeping them public.
 */
export const PUBLIC_WORKFLOWS = [
	"propose",
	"explore",
	"new",
	"continue",
	"apply",
	"ff",
	"sync",
	"archive",
	"bulk-archive",
	"clarify",
	"onboard",
] as const;

export type WorkflowId = (typeof ALL_WORKFLOWS)[number];
export type CoreWorkflowId = (typeof CORE_WORKFLOWS)[number];
export type PublicWorkflowId = (typeof PUBLIC_WORKFLOWS)[number];

/**
 * Resolves which workflows should be active for a given profile configuration.
 *
 * - 'core' profile always returns CORE_WORKFLOWS
 * - 'custom' profile returns the provided customWorkflows, or empty array if not provided
 */
export function getProfileWorkflows(
	profile: Profile,
	customWorkflows?: string[],
): readonly string[] {
	const publicSet = new Set<string>(PUBLIC_WORKFLOWS as readonly string[]);

	if (profile === "custom") {
		return (customWorkflows ?? []).filter((workflow) =>
			publicSet.has(workflow),
		);
	}
	return CORE_WORKFLOWS;
}
