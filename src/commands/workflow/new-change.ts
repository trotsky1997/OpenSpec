/**
 * New Change Command
 *
 * Creates a new change directory with optional description and schema.
 */

import ora from "ora";
import path from "path";
import { createChange, validateChangeName } from "../../utils/change-utils.js";
import type { StrictWorkflowVariant } from "../../utils/strict-workflow.js";
import { validateSchemaExists } from "./shared.js";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface NewChangeOptions {
	description?: string;
	schema?: string;
	variant?: StrictWorkflowVariant;
	branch?: string;
	worktree?: string;
	pr?: string;
	mergeCommit?: string;
	manageFile?: string[];
}

// -----------------------------------------------------------------------------
// Command Implementation
// -----------------------------------------------------------------------------

export async function newChangeCommand(
	name: string | undefined,
	options: NewChangeOptions,
): Promise<void> {
	if (!name) {
		throw new Error("Missing required argument <name>");
	}

	const validation = validateChangeName(name);
	if (!validation.valid) {
		throw new Error(validation.error);
	}

	const projectRoot = process.cwd();

	// Validate schema if provided
	if (options.schema) {
		validateSchemaExists(options.schema, projectRoot);
	}

	const schemaDisplay = options.schema
		? ` with schema '${options.schema}'`
		: "";
	const variantDisplay = options.variant ? ` (${options.variant})` : "";
	const spinner = ora(
		`Creating change '${name}'${schemaDisplay}${variantDisplay}...`,
	).start();

	try {
		const result = await createChange(projectRoot, name, {
			schema: options.schema,
			variant: options.variant,
			branch: options.branch,
			worktree: options.worktree,
			pr: options.pr,
			mergeCommit: options.mergeCommit,
			managedFiles: options.manageFile,
		});

		// If description provided, create README.md with description
		if (options.description) {
			const { promises: fs } = await import("fs");
			const changeDir = path.join(projectRoot, "openspec", "changes", name);
			const readmePath = path.join(changeDir, "README.md");
			await fs.writeFile(
				readmePath,
				`# ${name}\n\n${options.description}\n`,
				"utf-8",
			);
		}

		spinner.succeed(
			`Created change '${name}' at openspec/changes/${name}/ (schema: ${result.schema}${options.variant ? `, variant: ${options.variant}` : ""})`,
		);
	} catch (error) {
		spinner.fail(`Failed to create change '${name}'`);
		throw error;
	}
}
