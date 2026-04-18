import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
	getManagedFilesManifestPath,
	getOpenSpexReadiness,
	readManagedFilesManifest,
	resolveLegacyManagedFileDeltaPath,
	resolveManagedFileArtifacts,
	scaffoldManagedFiles,
	setupOpenSpexWorkspace,
} from "../../src/utils/openspex.js";

describe("openspex utilities", () => {
	let testDir: string;
	let worktreePaths: string[];

	beforeEach(async () => {
		testDir = path.join(os.tmpdir(), `openspec-openspex-${randomUUID()}`);
		worktreePaths = [];
		await fs.mkdir(testDir, { recursive: true });
	});

	afterEach(async () => {
		for (const worktreePath of worktreePaths) {
			await fs.rm(worktreePath, { recursive: true, force: true });
		}
		await fs.rm(testDir, { recursive: true, force: true });
	});

	function initGitRepo(repoDir: string): void {
		execFileSync("git", ["init"], { cwd: repoDir, stdio: "ignore" });
		execFileSync("git", ["config", "user.email", "openspec@example.com"], {
			cwd: repoDir,
			stdio: "ignore",
		});
		execFileSync("git", ["config", "user.name", "OpenSpec Test"], {
			cwd: repoDir,
			stdio: "ignore",
		});
		execFileSync("git", ["add", "."], { cwd: repoDir, stdio: "ignore" });
		execFileSync("git", ["commit", "--allow-empty", "-m", "init"], {
			cwd: repoDir,
			stdio: "ignore",
		});
	}

	it("maps repo-relative files into canonical shadow paths and change-owned deltas", () => {
		const sourceEntry = resolveManagedFileArtifacts(
			"add-openspex",
			"src/commands/workflow/new-change.ts",
		);
		expect(sourceEntry.shadowSpec).toBe(
			"openspec/impl-specs/src/commands/workflow/new-change.ts/spec.md",
		);
		expect(sourceEntry.changelog).toBe(
			"openspec/impl-specs/src/commands/workflow/new-change.ts/CHANGELOG.md",
		);
		expect(sourceEntry.delta).toBe(
			"openspec/changes/add-openspex/shadow-deltas/src/commands/workflow/new-change.ts.delta.md",
		);
		expect(
			resolveLegacyManagedFileDeltaPath(
				"add-openspex",
				"src/commands/workflow/new-change.ts",
			),
		).toBe(
			"openspec/impl-specs/src/commands/workflow/new-change.ts/deltas/add-openspex.delta.md",
		);

		const testEntry = resolveManagedFileArtifacts(
			"add-openspex",
			"test/commands/apply.test.ts",
		);
		expect(testEntry.shadowSpec).toBe(
			"openspec/impl-specs/test/commands/apply.test.ts/spec.md",
		);
		expect(testEntry.delta).toBe(
			"openspec/changes/add-openspex/shadow-deltas/test/commands/apply.test.ts.delta.md",
		);
	});

	it("normalizes Windows-style managed file paths", () => {
		const entry = resolveManagedFileArtifacts(
			"add-openspex",
			"src\\utils\\openspex.ts",
		);
		expect(entry.path).toBe("src/utils/openspex.ts");
		expect(entry.shadowSpec).toBe(
			"openspec/impl-specs/src/utils/openspex.ts/spec.md",
		);
		expect(entry.delta).toBe(
			"openspec/changes/add-openspex/shadow-deltas/src/utils/openspex.ts.delta.md",
		);
	});

	it("scaffolds managed-file manifests and change-owned delta artifacts", async () => {
		const changeDir = path.join(
			testDir,
			"openspec",
			"changes",
			"openspex-change",
		);
		await fs.mkdir(changeDir, { recursive: true });

		const manifest = scaffoldManagedFiles(
			testDir,
			"openspex-change",
			changeDir,
			["src/app.ts", "test/app.test.ts"],
		);

		expect(manifest.files.map((file) => file.path)).toEqual([
			"src/app.ts",
			"test/app.test.ts",
		]);

		const persistedManifest = readManagedFilesManifest(changeDir);
		expect(persistedManifest?.files.map((file) => file.path)).toEqual([
			"src/app.ts",
			"test/app.test.ts",
		]);

		const manifestPath = getManagedFilesManifestPath(changeDir);
		await expect(fs.stat(manifestPath)).resolves.toMatchObject({
			isFile: expect.any(Function),
		});
		await expect(
			fs.stat(
				path.join(
					testDir,
					"openspec",
					"impl-specs",
					"src",
					"app.ts",
					"spec.md",
				),
			),
		).resolves.toMatchObject({ isFile: expect.any(Function) });
		await expect(
			fs.stat(
				path.join(
					testDir,
					"openspec",
					"impl-specs",
					"src",
					"app.ts",
					"CHANGELOG.md",
				),
			),
		).resolves.toMatchObject({ isFile: expect.any(Function) });
		await expect(
			fs.stat(
				path.join(
					testDir,
					"openspec",
					"changes",
					"openspex-change",
					"shadow-deltas",
					"src",
					"app.ts.delta.md",
				),
			),
		).resolves.toMatchObject({ isFile: expect.any(Function) });
	});

	it("creates an OpenSpeX worktree and branch in a git repository", async () => {
		initGitRepo(testDir);
		const worktreePath = path.join(
			os.tmpdir(),
			`openspec-worktree-${randomUUID()}`,
		);
		worktreePaths.push(worktreePath);

		const metadata = setupOpenSpexWorkspace(testDir, "openspex-change", {
			worktree: worktreePath,
		});

		expect(metadata.branch).toBe("openspex/openspex-change");
		expect(metadata.repoRoot).toBe(testDir);
		const branch = metadata.branch;
		expect(branch).toBeDefined();
		await expect(fs.stat(worktreePath)).resolves.toMatchObject({
			isDirectory: expect.any(Function),
		});

		const branches = execFileSync("git", ["branch", "--list", branch!], {
			cwd: testDir,
			encoding: "utf-8",
		});
		expect(branches).toContain(metadata.branch);
	});

	it("reports OpenSpeX readiness issues when the manifest is missing", async () => {
		initGitRepo(testDir);
		const worktreePath = path.join(
			os.tmpdir(),
			`openspec-worktree-${randomUUID()}`,
		);
		worktreePaths.push(worktreePath);
		const changeDir = path.join(
			testDir,
			"openspec",
			"changes",
			"openspex-change",
		);
		await fs.mkdir(changeDir, { recursive: true });

		const metadata = {
			schema: "spec-driven",
			variant: "openspex" as const,
			openspex: setupOpenSpexWorkspace(testDir, "openspex-change", {
				worktree: worktreePath,
			}),
		};

		const readiness = getOpenSpexReadiness(changeDir, testDir, metadata);
		expect(
			readiness?.blockingIssues.some((issue) =>
				issue.includes("Managed-file inventory is missing or empty"),
			),
		).toBe(true);
	});

	it("reports legacy delta migration when only the old delta path exists", async () => {
		initGitRepo(testDir);
		const worktreePath = path.join(
			os.tmpdir(),
			`openspec-worktree-${randomUUID()}`,
		);
		worktreePaths.push(worktreePath);
		const changeDir = path.join(
			testDir,
			"openspec",
			"changes",
			"openspex-change",
		);
		await fs.mkdir(changeDir, { recursive: true });
		scaffoldManagedFiles(testDir, "openspex-change", changeDir, ["src/app.ts"]);

		const changeOwnedDelta = path.join(
			testDir,
			"openspec",
			"changes",
			"openspex-change",
			"shadow-deltas",
			"src",
			"app.ts.delta.md",
		);
		const legacyDelta = path.join(
			testDir,
			"openspec",
			"impl-specs",
			"src",
			"app.ts",
			"deltas",
			"openspex-change.delta.md",
		);
		await fs.rm(changeOwnedDelta, { force: true });
		await fs.mkdir(path.dirname(legacyDelta), { recursive: true });
		await fs.writeFile(legacyDelta, "# legacy delta\n", "utf-8");

		const metadata = {
			schema: "spec-driven",
			variant: "openspex" as const,
			openspex: setupOpenSpexWorkspace(testDir, "openspex-change", {
				worktree: worktreePath,
			}),
		};

		const readiness = getOpenSpexReadiness(changeDir, testDir, metadata);
		expect(readiness?.managedFiles[0]?.state).toBe("legacy-only");
		expect(
			readiness?.blockingIssues.some((issue) =>
				issue.includes("Legacy OpenSpeX delta must move for src/app.ts"),
			),
		).toBe(true);
	});

	it("reports conflicting legacy and change-owned deltas", async () => {
		initGitRepo(testDir);
		const worktreePath = path.join(
			os.tmpdir(),
			`openspec-worktree-${randomUUID()}`,
		);
		worktreePaths.push(worktreePath);
		const changeDir = path.join(
			testDir,
			"openspec",
			"changes",
			"openspex-change",
		);
		await fs.mkdir(changeDir, { recursive: true });
		scaffoldManagedFiles(testDir, "openspex-change", changeDir, ["src/app.ts"]);

		const changeOwnedDelta = path.join(
			testDir,
			"openspec",
			"changes",
			"openspex-change",
			"shadow-deltas",
			"src",
			"app.ts.delta.md",
		);
		const legacyDelta = path.join(
			testDir,
			"openspec",
			"impl-specs",
			"src",
			"app.ts",
			"deltas",
			"openspex-change.delta.md",
		);
		await fs.mkdir(path.dirname(legacyDelta), { recursive: true });
		await fs.writeFile(changeOwnedDelta, "# new delta\n", "utf-8");
		await fs.writeFile(legacyDelta, "# legacy delta\n", "utf-8");

		const metadata = {
			schema: "spec-driven",
			variant: "openspex" as const,
			openspex: setupOpenSpexWorkspace(testDir, "openspex-change", {
				worktree: worktreePath,
			}),
		};

		const readiness = getOpenSpexReadiness(changeDir, testDir, metadata);
		expect(readiness?.managedFiles[0]?.state).toBe("conflict");
		expect(
			readiness?.blockingIssues.some((issue) =>
				issue.includes("Conflicting OpenSpeX delta locations for src/app.ts"),
			),
		).toBe(true);
	});
});
