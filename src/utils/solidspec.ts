import { execFileSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import { z } from "zod";
import * as yaml from "yaml";
import type {
	ChangeMetadata,
	SolidSpecMetadata,
} from "../core/artifact-graph/types.js";
import { FileSystemUtils } from "./file-system.js";
import {
	OPENSPEX_DISPLAY_NAME,
	OPENSPEX_VARIANT,
	SOLIDSPEC_DISPLAY_NAME,
	SOLIDSPEC_VARIANT,
	isStrictWorkflowVariant,
} from "./strict-workflow.js";

export const SOLIDSPEC_MANAGED_FILES_FILENAME = "managed-files.yaml";
export const SOLIDSPEC_CHANGE_DELTAS_DIRNAME = "shadow-deltas";
export const SOLIDSPEC_DISCIPLINE_FILENAME = "discipline.yaml";
export const OPENSPEX_MANAGED_FILES_FILENAME = SOLIDSPEC_MANAGED_FILES_FILENAME;
export const OPENSPEX_CHANGE_DELTAS_DIRNAME = SOLIDSPEC_CHANGE_DELTAS_DIRNAME;
export const OPENSPEX_DISCIPLINE_FILENAME = SOLIDSPEC_DISCIPLINE_FILENAME;
const SOLIDSPEC_IMPL_SPECS_DIR = ["openspec", "impl-specs"];
const SOLIDSPEC_CHANGES_DIR = ["openspec", "changes"];

export class SolidSpecError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "SolidSpecError";
	}
}

export const OpenSpexError = SolidSpecError;

export const ManagedFileEntrySchema = z.object({
	path: z.string().min(1, { message: "managed file path is required" }),
	shadowDir: z.string().min(1, { message: "shadowDir is required" }),
	shadowSpec: z.string().min(1, { message: "shadowSpec is required" }),
	changelog: z.string().min(1, { message: "changelog is required" }),
	delta: z.string().min(1, { message: "delta is required" }),
});

export const ManagedFilesManifestSchema = z.object({
	version: z.literal(1),
	files: z.array(ManagedFileEntrySchema),
});

export const OpenSpexDisciplineWaiverSchema = z.object({
	id: z.string().min(1, { message: "waiver id is required" }),
	reason: z.string().min(1, { message: "waiver reason is required" }),
	paths: z.array(z.string().min(1)).default([]),
});

export const OpenSpexDisciplineManifestSchema = z.object({
	version: z.literal(1),
	modelPolicy: z.object({
		strict: z.boolean().default(true),
		summary: z.string().min(1, { message: "modelPolicy.summary is required" }),
		rules: z.array(z.string().min(1)).default([]),
	}),
	validation: z.object({
		commands: z.array(z.string().min(1)).default([]),
	}),
	waivers: z.array(OpenSpexDisciplineWaiverSchema).default([]),
});

export type ManagedFileEntry = z.infer<typeof ManagedFileEntrySchema>;
export type ManagedFilesManifest = z.infer<typeof ManagedFilesManifestSchema>;
export type OpenSpexDisciplineManifest = z.infer<
	typeof OpenSpexDisciplineManifestSchema
>;

export type ManagedFileState =
	| "ready"
	| "missing"
	| "legacy-only"
	| "conflict"
	| "dual-synced";

export interface ResolvedManagedFileEntry extends ManagedFileEntry {
	legacyDelta?: string;
	effectiveDelta?: string;
	state: ManagedFileState;
	issues: string[];
}

export interface SolidSpecWorkspaceOptions {
	branch?: string;
	worktree?: string;
	pr?: string;
	mergeCommit?: string;
}

export type SolidSpecDisciplineManifest = OpenSpexDisciplineManifest;
export const SolidSpecDisciplineWaiverSchema = OpenSpexDisciplineWaiverSchema;
export const SolidSpecDisciplineManifestSchema =
	OpenSpexDisciplineManifestSchema;
export type OpenSpexWorkspaceOptions = SolidSpecWorkspaceOptions;

export function getStrictWorkflowMetadata(
	metadata: ChangeMetadata | null | undefined,
): SolidSpecMetadata | undefined {
	return metadata?.solidspec ?? metadata?.openspex;
}

export const getSolidSpecMetadata = getStrictWorkflowMetadata;

export interface SolidSpecReadiness {
	manifestPath: string;
	disciplinePath: string;
	disciplineManifest: OpenSpexDisciplineManifest | null;
	validationCommands: string[];
	managedFiles: ResolvedManagedFileEntry[];
	blockingIssues: string[];
}

export type OpenSpexReadiness = SolidSpecReadiness;

function runGit(cwd: string, args: string[]): string {
	try {
		return execFileSync("git", ["-C", cwd, ...args], {
			encoding: "utf-8",
			stdio: ["ignore", "pipe", "pipe"],
		}).trim();
	} catch (error) {
		const detail = error instanceof Error ? error.message : String(error);
		throw new OpenSpexError(
			`Git command failed (${args.join(" ")}): ${detail}`,
		);
	}
}

function normalizeRepoRelativePath(filePath: string): string {
	const normalized = filePath.replace(/\\/g, "/").trim();

	if (!normalized) {
		throw new OpenSpexError("Managed file path cannot be empty");
	}

	if (path.posix.isAbsolute(normalized) || path.win32.isAbsolute(filePath)) {
		throw new OpenSpexError(
			`Managed file path must be repo-relative: ${filePath}`,
		);
	}

	const cleaned = path.posix.normalize(normalized);
	if (
		cleaned === "." ||
		cleaned === ".." ||
		cleaned.startsWith("../") ||
		cleaned.includes("/../")
	) {
		throw new OpenSpexError(
			`Managed file path must stay inside the repo: ${filePath}`,
		);
	}

	return cleaned;
}

function resolveProjectPath(
	projectRoot: string,
	relativePosixPath: string,
): string {
	return path.join(projectRoot, ...relativePosixPath.split("/"));
}

function pathExists(targetPath: string): boolean {
	try {
		fs.accessSync(targetPath);
		return true;
	} catch {
		return false;
	}
}

function toDisplayPath(projectRoot: string, relativePosixPath: string): string {
	const absolutePath = resolveProjectPath(projectRoot, relativePosixPath);
	return pathExists(absolutePath)
		? FileSystemUtils.canonicalizeExistingPath(absolutePath)
		: path.resolve(absolutePath);
}

function filesMatch(leftPath: string, rightPath: string): boolean {
	if (!pathExists(leftPath) || !pathExists(rightPath)) {
		return false;
	}

	return (
		fs.readFileSync(leftPath, "utf-8") === fs.readFileSync(rightPath, "utf-8")
	);
}

function ensureGitRepository(projectRoot: string): string {
	try {
		const repoRoot = runGit(projectRoot, ["rev-parse", "--show-toplevel"]);
		return FileSystemUtils.canonicalizeExistingPath(repoRoot);
	} catch (error) {
		const detail = error instanceof Error ? error.message : String(error);
		throw new OpenSpexError(
			`${SOLIDSPEC_DISPLAY_NAME} requires a git repository with worktree support. ${detail}`,
		);
	}
}

function branchExists(repoRoot: string, branchName: string): boolean {
	const output = runGit(repoRoot, ["branch", "--list", branchName]);
	return output.length > 0;
}

function generateDefaultWorktreePath(
	repoRoot: string,
	changeName: string,
): string {
	const repoName = path.basename(repoRoot);
	return path.resolve(repoRoot, "..", `${repoName}-${changeName}`);
}

function generateShadowSpecContent(filePath: string): string {
	return `# Impl Spec: ${filePath}

## File

- Managed file: \`${filePath}\`

## Current Contract

- Describe the implementation expectations for \`${filePath}\`.

## Notes

- Created for SolidSpec-managed implementation tracking.
`;
}

function generateChangelogContent(
	filePath: string,
	changeName: string,
): string {
	return `# Changelog: ${filePath}

## Entries

- Initialized for SolidSpec change \`${changeName}\`.
`;
}

function generateDeltaContent(filePath: string, changeName: string): string {
	return `# Delta: ${changeName} -> ${filePath}

## Planned Changes

- Describe the intended implementation updates for \`${filePath}\`.

## Acceptance Notes

- Update this delta before formal edits.
- Merge it into the canonical shadow impl spec during \`/opsx:verify\` closeout.
`;
}

function generateDisciplineManifest(): OpenSpexDisciplineManifest {
	return {
		version: 1,
		modelPolicy: {
			strict: true,
			summary:
				"Governed code must use explicit typed models/interfaces/classes for important state and boundaries.",
			rules: [
				"Use explicit typed models or interfaces/classes for stable domain and boundary concepts.",
				"Document any weakly typed or model-breaking escape hatch as an explicit waiver in this file.",
			],
		},
		validation: {
			commands: [],
		},
		waivers: [],
	};
}

function getChangeNameFromDir(changeDir: string): string {
	return path.basename(changeDir);
}

function getCanonicalShadowDir(filePath: string): string {
	const normalizedPath = normalizeRepoRelativePath(filePath);
	return path.posix.join(
		...SOLIDSPEC_IMPL_SPECS_DIR,
		...normalizedPath.split("/"),
	);
}

export function isOpenSpexVariant(
	metadata: ChangeMetadata | null | undefined,
): metadata is ChangeMetadata & {
	variant: typeof SOLIDSPEC_VARIANT | typeof OPENSPEX_VARIANT;
	solidspec?: SolidSpecMetadata;
	openspex?: SolidSpecMetadata;
} {
	return (
		isStrictWorkflowVariant(metadata?.variant) &&
		Boolean(getStrictWorkflowMetadata(metadata))
	);
}

export const isSolidSpecVariant = isOpenSpexVariant;

export function getManagedFilesManifestPath(changeDir: string): string {
	return path.join(changeDir, OPENSPEX_MANAGED_FILES_FILENAME);
}

export const getSolidSpecManagedFilesManifestPath = getManagedFilesManifestPath;

export function getOpenSpexDisciplinePath(changeDir: string): string {
	return path.join(changeDir, OPENSPEX_DISCIPLINE_FILENAME);
}

export const getSolidSpecDisciplinePath = getOpenSpexDisciplinePath;

export function resolveLegacyManagedFileDeltaPath(
	changeName: string,
	filePath: string,
): string {
	const shadowDir = getCanonicalShadowDir(filePath);
	return path.posix.join(shadowDir, "deltas", `${changeName}.delta.md`);
}

export function resolveManagedFileArtifacts(
	changeName: string,
	filePath: string,
): ManagedFileEntry {
	const normalizedPath = normalizeRepoRelativePath(filePath);
	const segments = normalizedPath.split("/");
	const fileName = segments[segments.length - 1];
	const parentSegments = segments.slice(0, -1);
	const shadowDir = getCanonicalShadowDir(normalizedPath);
	const delta = path.posix.join(
		...SOLIDSPEC_CHANGES_DIR,
		changeName,
		OPENSPEX_CHANGE_DELTAS_DIRNAME,
		...parentSegments,
		`${fileName}.delta.md`,
	);

	return {
		path: normalizedPath,
		shadowDir,
		shadowSpec: path.posix.join(shadowDir, "spec.md"),
		changelog: path.posix.join(shadowDir, "CHANGELOG.md"),
		delta,
	};
}

function resolveManagedFileState(
	changeDir: string,
	projectRoot: string,
	entry: ManagedFileEntry,
): ResolvedManagedFileEntry {
	const changeName = getChangeNameFromDir(changeDir);
	const normalizedEntry = resolveManagedFileArtifacts(changeName, entry.path);
	const legacyDelta = resolveLegacyManagedFileDeltaPath(changeName, entry.path);
	const changeOwnedDeltaPath = resolveProjectPath(
		projectRoot,
		normalizedEntry.delta,
	);
	const legacyDeltaPath = resolveProjectPath(projectRoot, legacyDelta);
	const changeOwnedExists = pathExists(changeOwnedDeltaPath);
	const legacyExists = pathExists(legacyDeltaPath);
	const issues: string[] = [];
	let state: ManagedFileState = "ready";
	let effectiveDelta: string | undefined = changeOwnedExists
		? normalizedEntry.delta
		: undefined;

	if (changeOwnedExists && legacyExists) {
		if (filesMatch(changeOwnedDeltaPath, legacyDeltaPath)) {
			state = "dual-synced";
		} else {
			state = "conflict";
			issues.push(
				`Conflicting ${SOLIDSPEC_DISPLAY_NAME} delta locations for ${normalizedEntry.path}: ${toDisplayPath(projectRoot, legacyDelta)} and ${toDisplayPath(projectRoot, normalizedEntry.delta)}`,
			);
		}
	} else if (changeOwnedExists) {
		state = "ready";
	} else if (legacyExists) {
		state = "legacy-only";
		effectiveDelta = legacyDelta;
		issues.push(
			`Legacy ${OPENSPEX_DISPLAY_NAME} delta must move for ${normalizedEntry.path}: ${toDisplayPath(projectRoot, legacyDelta)} -> ${toDisplayPath(projectRoot, normalizedEntry.delta)}`,
		);
	} else {
		state = "missing";
		issues.push(
			`Missing ${SOLIDSPEC_DISPLAY_NAME} delta for ${normalizedEntry.path}: ${toDisplayPath(projectRoot, normalizedEntry.delta)}`,
		);
	}

	return {
		...normalizedEntry,
		legacyDelta: legacyExists ? legacyDelta : undefined,
		effectiveDelta,
		state,
		issues,
	};
}

export function readManagedFilesManifest(
	changeDir: string,
): ManagedFilesManifest | null {
	const manifestPath = getManagedFilesManifestPath(changeDir);
	if (!pathExists(manifestPath)) {
		return null;
	}

	const content = fs.readFileSync(manifestPath, "utf-8");
	const parsed = yaml.parse(content);
	const result = ManagedFilesManifestSchema.safeParse(parsed);
	if (!result.success) {
		throw new OpenSpexError(
			`Invalid managed files manifest: ${result.error.message}`,
		);
	}

	return result.data;
}

export function readOpenSpexDisciplineManifest(
	changeDir: string,
): OpenSpexDisciplineManifest | null {
	const disciplinePath = getOpenSpexDisciplinePath(changeDir);
	if (!pathExists(disciplinePath)) {
		return null;
	}

	const content = fs.readFileSync(disciplinePath, "utf-8");
	const parsed = yaml.parse(content);
	const result = OpenSpexDisciplineManifestSchema.safeParse(parsed);
	if (!result.success) {
		throw new OpenSpexError(
			`Invalid ${SOLIDSPEC_DISPLAY_NAME} discipline manifest: ${result.error.message}`,
		);
	}

	return result.data;
}

export const readSolidSpecDisciplineManifest = readOpenSpexDisciplineManifest;

export function writeManagedFilesManifest(
	changeDir: string,
	manifest: ManagedFilesManifest,
): void {
	const manifestPath = getManagedFilesManifestPath(changeDir);
	const parseResult = ManagedFilesManifestSchema.safeParse(manifest);
	if (!parseResult.success) {
		throw new OpenSpexError(
			`Invalid managed files manifest: ${parseResult.error.message}`,
		);
	}

	const serialized = yaml.stringify(parseResult.data);
	fs.writeFileSync(manifestPath, serialized, "utf-8");
}

export function writeOpenSpexDisciplineManifest(
	changeDir: string,
	manifest: OpenSpexDisciplineManifest,
): void {
	const disciplinePath = getOpenSpexDisciplinePath(changeDir);
	const parseResult = OpenSpexDisciplineManifestSchema.safeParse(manifest);
	if (!parseResult.success) {
		throw new OpenSpexError(
			`Invalid ${SOLIDSPEC_DISPLAY_NAME} discipline manifest: ${parseResult.error.message}`,
		);
	}

	fs.writeFileSync(disciplinePath, yaml.stringify(parseResult.data), "utf-8");
}

export const writeSolidSpecDisciplineManifest = writeOpenSpexDisciplineManifest;

export function scaffoldOpenSpexDisciplineManifest(
	changeDir: string,
): OpenSpexDisciplineManifest {
	const existingManifest = readOpenSpexDisciplineManifest(changeDir);
	if (existingManifest) {
		return existingManifest;
	}

	const manifest = generateDisciplineManifest();
	writeOpenSpexDisciplineManifest(changeDir, manifest);
	return manifest;
}

export const scaffoldSolidSpecDisciplineManifest =
	scaffoldOpenSpexDisciplineManifest;

export function scaffoldManagedFiles(
	projectRoot: string,
	changeName: string,
	changeDir: string,
	filePaths: string[],
): ManagedFilesManifest {
	const existingManifest: ManagedFilesManifest = readManagedFilesManifest(
		changeDir,
	) ?? {
		version: 1 as const,
		files: [],
	};
	const byPath = new Map<string, ManagedFileEntry>(
		existingManifest.files.map((entry: ManagedFileEntry) => [
			entry.path,
			resolveManagedFileArtifacts(changeName, entry.path),
		]),
	);

	for (const filePath of filePaths) {
		const entry = resolveManagedFileArtifacts(changeName, filePath);
		byPath.set(entry.path, entry);

		const shadowSpecPath = resolveProjectPath(projectRoot, entry.shadowSpec);
		const changelogPath = resolveProjectPath(projectRoot, entry.changelog);
		const deltaPath = resolveProjectPath(projectRoot, entry.delta);

		if (!pathExists(shadowSpecPath)) {
			fs.mkdirSync(path.dirname(shadowSpecPath), { recursive: true });
			fs.writeFileSync(
				shadowSpecPath,
				generateShadowSpecContent(entry.path),
				"utf-8",
			);
		}

		if (!pathExists(changelogPath)) {
			fs.mkdirSync(path.dirname(changelogPath), { recursive: true });
			fs.writeFileSync(
				changelogPath,
				generateChangelogContent(entry.path, changeName),
				"utf-8",
			);
		}

		if (!pathExists(deltaPath)) {
			fs.mkdirSync(path.dirname(deltaPath), { recursive: true });
			fs.writeFileSync(
				deltaPath,
				generateDeltaContent(entry.path, changeName),
				"utf-8",
			);
		}
	}

	const manifest: ManagedFilesManifest = {
		version: 1,
		files: Array.from(byPath.values()).sort((left, right) =>
			left.path.localeCompare(right.path),
		),
	};

	writeManagedFilesManifest(changeDir, manifest);
	return manifest;
}

export function setupOpenSpexWorkspace(
	projectRoot: string,
	changeName: string,
	options: OpenSpexWorkspaceOptions = {},
): SolidSpecMetadata {
	const repoRoot = ensureGitRepository(projectRoot);
	const branch = options.branch?.trim() || `${SOLIDSPEC_VARIANT}/${changeName}`;
	const requestedWorktree = options.worktree?.trim();
	const worktreePath = requestedWorktree
		? path.resolve(projectRoot, requestedWorktree)
		: generateDefaultWorktreePath(repoRoot, changeName);

	const worktreeExists = pathExists(worktreePath);
	if (worktreeExists) {
		try {
			runGit(worktreePath, ["rev-parse", "--is-inside-work-tree"]);
		} catch {
			throw new OpenSpexError(
				`${SOLIDSPEC_DISPLAY_NAME} worktree path already exists but is not a git worktree: ${worktreePath}`,
			);
		}
	} else if (branchExists(repoRoot, branch)) {
		runGit(repoRoot, ["worktree", "add", worktreePath, branch]);
	} else {
		runGit(repoRoot, ["worktree", "add", "-b", branch, worktreePath]);
	}

	const metadata: SolidSpecMetadata = {
		repoRoot,
		branch,
		worktree: FileSystemUtils.canonicalizeExistingPath(worktreePath),
		cleanup: "pending",
	};

	if (options.pr) {
		metadata.pr = options.pr;
	}

	if (options.mergeCommit) {
		metadata.mergeCommit = options.mergeCommit;
	}

	return metadata;
}

export const setupSolidSpecWorkspace = setupOpenSpexWorkspace;

export function getOpenSpexReadiness(
	changeDir: string,
	projectRoot: string,
	metadata: ChangeMetadata | null | undefined,
): OpenSpexReadiness | null {
	if (!isOpenSpexVariant(metadata)) {
		return null;
	}

	const blockingIssues: string[] = [];
	const variantMetadata = getStrictWorkflowMetadata(metadata);
	if (!variantMetadata) {
		return null;
	}
	const disciplinePath = getOpenSpexDisciplinePath(changeDir);
	let disciplineManifest: OpenSpexDisciplineManifest | null = null;

	if (!variantMetadata.repoRoot) {
		blockingIssues.push(
			`Missing ${SOLIDSPEC_DISPLAY_NAME} git metadata: repo root is not recorded.`,
		);
	}

	if (!variantMetadata.branch) {
		blockingIssues.push(
			`Missing ${SOLIDSPEC_DISPLAY_NAME} git metadata: branch is not recorded.`,
		);
	}

	if (!variantMetadata.worktree) {
		blockingIssues.push(
			`Missing ${SOLIDSPEC_DISPLAY_NAME} git metadata: worktree path is not recorded.`,
		);
	} else if (!pathExists(variantMetadata.worktree)) {
		blockingIssues.push(
			`${SOLIDSPEC_DISPLAY_NAME} worktree path does not exist: ${variantMetadata.worktree}`,
		);
	}

	try {
		disciplineManifest = readOpenSpexDisciplineManifest(changeDir);
	} catch (error) {
		const detail = error instanceof Error ? error.message : String(error);
		blockingIssues.push(detail);
	}

	const disciplineDisplayPath = pathExists(disciplinePath)
		? FileSystemUtils.canonicalizeExistingPath(disciplinePath)
		: path.resolve(disciplinePath);
	if (!disciplineManifest) {
		blockingIssues.push(
			`${SOLIDSPEC_DISPLAY_NAME} discipline manifest is missing: ${disciplineDisplayPath}`,
		);
	} else if (disciplineManifest.validation.commands.length === 0) {
		blockingIssues.push(
			`${SOLIDSPEC_DISPLAY_NAME} validation command declarations are missing in ${disciplineDisplayPath}`,
		);
	}

	const manifestPath = getManagedFilesManifestPath(changeDir);
	const manifest = readManagedFilesManifest(changeDir);
	if (!manifest || manifest.files.length === 0) {
		blockingIssues.push(
			`Managed-file inventory is missing or empty: ${manifestPath}`,
		);
		return {
			manifestPath,
			disciplinePath,
			disciplineManifest,
			validationCommands: disciplineManifest?.validation.commands ?? [],
			managedFiles: [],
			blockingIssues,
		};
	}

	const managedFiles = manifest.files.map((entry) =>
		resolveManagedFileState(changeDir, projectRoot, entry),
	);
	for (const entry of managedFiles) {
		blockingIssues.push(...entry.issues);
	}

	return {
		manifestPath,
		disciplinePath,
		disciplineManifest,
		validationCommands: disciplineManifest?.validation.commands ?? [],
		managedFiles,
		blockingIssues,
	};
}

export const getSolidSpecReadiness = getOpenSpexReadiness;

function addContextFileAlias(
	contextFiles: Record<string, string[]>,
	canonicalKey: string,
	legacyKey: string,
	values: string[],
): void {
	if (values.length === 0) {
		return;
	}

	contextFiles[canonicalKey] = values;
	contextFiles[legacyKey] = values;
}

export function getSolidSpecContextFiles(
	projectRoot: string,
	readiness: SolidSpecReadiness,
): Record<string, string[]> {
	const contextFiles: Record<string, string[]> = {};

	if (pathExists(readiness.manifestPath)) {
		addContextFileAlias(
			contextFiles,
			"solidspecManagedFiles",
			"openspexManagedFiles",
			[FileSystemUtils.canonicalizeExistingPath(readiness.manifestPath)],
		);
	}

	if (pathExists(readiness.disciplinePath)) {
		addContextFileAlias(
			contextFiles,
			"solidspecDiscipline",
			"openspexDiscipline",
			[FileSystemUtils.canonicalizeExistingPath(readiness.disciplinePath)],
		);
	}

	const shadowSpecs: string[] = [];
	const changelogs: string[] = [];
	const deltas: string[] = [];
	const legacyDeltas: string[] = [];

	for (const entry of readiness.managedFiles) {
		const shadowSpecPath = resolveProjectPath(projectRoot, entry.shadowSpec);
		const changelogPath = resolveProjectPath(projectRoot, entry.changelog);
		const deltaPath = resolveProjectPath(projectRoot, entry.delta);

		if (pathExists(shadowSpecPath)) {
			shadowSpecs.push(
				FileSystemUtils.canonicalizeExistingPath(shadowSpecPath),
			);
		}

		if (pathExists(changelogPath)) {
			changelogs.push(FileSystemUtils.canonicalizeExistingPath(changelogPath));
		}

		if (pathExists(deltaPath)) {
			deltas.push(FileSystemUtils.canonicalizeExistingPath(deltaPath));
		}

		if (entry.legacyDelta) {
			const legacyPath = resolveProjectPath(projectRoot, entry.legacyDelta);
			if (pathExists(legacyPath)) {
				legacyDeltas.push(FileSystemUtils.canonicalizeExistingPath(legacyPath));
			}
		}
	}

	addContextFileAlias(
		contextFiles,
		"solidspecShadowSpecs",
		"openspexShadowSpecs",
		shadowSpecs,
	);
	addContextFileAlias(
		contextFiles,
		"solidspecChangelogs",
		"openspexChangelogs",
		changelogs,
	);
	addContextFileAlias(
		contextFiles,
		"solidspecDeltas",
		"openspexDeltas",
		deltas,
	);
	addContextFileAlias(
		contextFiles,
		"solidspecLegacyDeltas",
		"openspexLegacyDeltas",
		legacyDeltas,
	);

	return contextFiles;
}

export function getOpenSpexContextFiles(
	projectRoot: string,
	readiness: OpenSpexReadiness,
): Record<string, string[]> {
	return getSolidSpecContextFiles(projectRoot, readiness);
}
