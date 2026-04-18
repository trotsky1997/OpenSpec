import { z } from "zod";
import {
	OPENSPEX_VARIANT,
	SOLIDSPEC_VARIANT,
} from "../../utils/strict-workflow.js";

// Artifact definition schema
export const ArtifactSchema = z.object({
	id: z.string().min(1, { error: "Artifact ID is required" }),
	generates: z.string().min(1, { error: "generates field is required" }),
	description: z.string(),
	template: z.string().min(1, { error: "template field is required" }),
	instruction: z.string().optional(),
	requires: z.array(z.string()).default([]),
});

// Apply phase configuration for schema-aware apply instructions
export const ApplyPhaseSchema = z.object({
	// Artifact IDs that must exist before apply is available
	requires: z
		.array(z.string())
		.min(1, { error: "At least one required artifact" }),
	// Path to file with checkboxes for progress (relative to change dir), or null if no tracking
	tracks: z.string().nullable().optional(),
	// Custom guidance for the apply phase
	instruction: z.string().optional(),
});

// Full schema YAML structure
export const SchemaYamlSchema = z.object({
	name: z.string().min(1, { error: "Schema name is required" }),
	version: z
		.number()
		.int()
		.positive({ error: "Version must be a positive integer" }),
	description: z.string().optional(),
	artifacts: z
		.array(ArtifactSchema)
		.min(1, { error: "At least one artifact required" }),
	// Optional apply phase configuration (for schema-aware apply instructions)
	apply: ApplyPhaseSchema.optional(),
});

// Derived TypeScript types
export type Artifact = z.infer<typeof ArtifactSchema>;
export type ApplyPhase = z.infer<typeof ApplyPhaseSchema>;
export type SchemaYaml = z.infer<typeof SchemaYamlSchema>;

export const SolidSpecMetadataSchema = z.object({
	repoRoot: z
		.string()
		.min(1, { message: "solidspec.repoRoot cannot be empty" })
		.optional(),
	branch: z
		.string()
		.min(1, { message: "solidspec.branch cannot be empty" })
		.optional(),
	worktree: z
		.string()
		.min(1, { message: "solidspec.worktree cannot be empty" })
		.optional(),
	pr: z.string().min(1, { message: "solidspec.pr cannot be empty" }).optional(),
	mergeCommit: z
		.string()
		.regex(/^[0-9a-fA-F]{7,40}$/, {
			message: "solidspec.mergeCommit must be a git commit SHA",
		})
		.optional(),
	cleanup: z.enum(["pending", "completed"]).optional(),
});

export const OpenSpexMetadataSchema = SolidSpecMetadataSchema;

// Per-change metadata schema
// Note: schema field is validated at parse time against available schemas
// using a lazy import to avoid circular dependencies
const ChangeMetadataBaseSchema = z.object({
	// Required: which workflow schema this change uses
	schema: z.string().min(1, { message: "schema is required" }),

	// Optional: creation timestamp (ISO date string)
	created: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, {
			message: "created must be YYYY-MM-DD format",
		})
		.optional(),

	// Optional: change execution variant
	variant: z.enum([SOLIDSPEC_VARIANT, OPENSPEX_VARIANT]).optional(),

	// Optional: strict-workflow metadata (new and legacy keys)
	solidspec: SolidSpecMetadataSchema.optional(),
	openspex: SolidSpecMetadataSchema.optional(),
});

export const ChangeMetadataSchema = ChangeMetadataBaseSchema.superRefine(
	(
		metadata: z.infer<typeof ChangeMetadataBaseSchema>,
		ctx: z.RefinementCtx,
	) => {
		const strictMetadata = metadata.solidspec ?? metadata.openspex;

		if (metadata.solidspec && metadata.openspex) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message:
					"Use either solidspec or openspex metadata, not both in the same change",
				path: ["solidspec"],
			});
		}

		if (
			(metadata.variant === SOLIDSPEC_VARIANT ||
				metadata.variant === OPENSPEX_VARIANT) &&
			!strictMetadata
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message:
					"solidspec or openspex metadata is required for strict-workflow variants",
				path: ["solidspec"],
			});
		}

		if (strictMetadata && !metadata.variant) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message:
					"variant must be solidspec or openspex when strict-workflow metadata is present",
				path: ["variant"],
			});
		}
	},
);

export type ChangeMetadata = z.infer<typeof ChangeMetadataSchema>;
export type SolidSpecMetadata = z.infer<typeof SolidSpecMetadataSchema>;
export type OpenSpexMetadata = SolidSpecMetadata;

// Runtime state types (not Zod - internal only)

// Slice 1: Simple completion tracking via filesystem
export type CompletedSet = Set<string>;

// Return type for blocked query
export interface BlockedArtifacts {
	[artifactId: string]: string[];
}
