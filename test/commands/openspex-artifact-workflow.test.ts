import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { runCLI } from "../helpers/run-cli.js";

describe("OpenSpeX artifact workflow", () => {
	let tempDir: string;
	let worktreePaths: string[];

	beforeEach(async () => {
		tempDir = path.join(os.tmpdir(), `openspec-openspex-cli-${randomUUID()}`);
		worktreePaths = [];
		await fs.mkdir(path.join(tempDir, "openspec", "changes"), {
			recursive: true,
		});
	});

	afterEach(async () => {
		for (const worktreePath of worktreePaths) {
			await fs.rm(worktreePath, { recursive: true, force: true });
		}
		await fs.rm(tempDir, { recursive: true, force: true });
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
		execFileSync("git", ["commit", "--allow-empty", "-m", "init"], {
			cwd: repoDir,
			stdio: "ignore",
		});
	}

	async function completeSpecDrivenArtifacts(changeDir: string): Promise<void> {
		await fs.writeFile(
			path.join(changeDir, "proposal.md"),
			"## Why\n\nTest proposal.\n\n## What Changes\n\n- Test change\n",
		);
		await fs.writeFile(
			path.join(changeDir, "design.md"),
			"## Context\n\nTest design.\n",
		);
		await fs.mkdir(path.join(changeDir, "specs"), { recursive: true });
		await fs.writeFile(
			path.join(changeDir, "specs", "test-spec.md"),
			"## ADDED Requirements\n\n### Requirement: Test\nThe system SHALL test.\n\n#### Scenario: Test\n- **WHEN** running\n- **THEN** it works\n",
		);
		await fs.writeFile(
			path.join(changeDir, "tasks.md"),
			"## 1. Tasks\n\n- [ ] 1.1 Test task\n",
		);
	}

	it("rejects OpenSpeX change creation outside a git repository", async () => {
		const worktreePath = path.join(
			os.tmpdir(),
			`openspec-worktree-${randomUUID()}`,
		);
		worktreePaths.push(worktreePath);

		const result = await runCLI(
			[
				"new",
				"change",
				"openspex-no-git",
				"--variant",
				"openspex",
				"--worktree",
				worktreePath,
			],
			{ cwd: tempDir, timeoutMs: 60000 },
		);

		expect(result.exitCode).toBe(1);
		expect(result.stdout + result.stderr).toContain(
			"OpenSpeX requires a git repository",
		);
	});

	it("creates an OpenSpeX change with metadata, manifest, and shadow files", async () => {
		initGitRepo(tempDir);
		const worktreePath = path.join(
			os.tmpdir(),
			`openspec-worktree-${randomUUID()}`,
		);
		worktreePaths.push(worktreePath);

		const result = await runCLI(
			[
				"new",
				"change",
				"openspex-managed",
				"--variant",
				"openspex",
				"--worktree",
				worktreePath,
				"--manage-file",
				"src/app.ts",
				"--manage-file",
				"test/app.test.ts",
			],
			{ cwd: tempDir, timeoutMs: 60000 },
		);

		expect(result.exitCode).toBe(0);
		const metadata = await fs.readFile(
			path.join(
				tempDir,
				"openspec",
				"changes",
				"openspex-managed",
				".openspec.yaml",
			),
			"utf-8",
		);
		expect(metadata).toContain("variant: openspex");
		expect(metadata).toContain("branch: openspex/openspex-managed");
		expect(metadata).toContain("worktree:");

		const manifest = await fs.readFile(
			path.join(
				tempDir,
				"openspec",
				"changes",
				"openspex-managed",
				"managed-files.yaml",
			),
			"utf-8",
		);
		expect(manifest).toContain("path: src/app.ts");
		expect(manifest).toContain("path: test/app.test.ts");

		await expect(
			fs.stat(
				path.join(
					tempDir,
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
					tempDir,
					"openspec",
					"changes",
					"openspex-managed",
					"shadow-deltas",
					"src",
					"app.ts.delta.md",
				),
			),
		).resolves.toMatchObject({ isFile: expect.any(Function) });
	}, 20000);

	it("surfaces OpenSpeX readiness and legacy migration in status and apply instructions", async () => {
		initGitRepo(tempDir);
		const worktreePath = path.join(
			os.tmpdir(),
			`openspec-worktree-${randomUUID()}`,
		);
		worktreePaths.push(worktreePath);

		const createResult = await runCLI(
			[
				"new",
				"change",
				"openspex-ready",
				"--variant",
				"openspex",
				"--worktree",
				worktreePath,
				"--manage-file",
				"src/app.ts",
			],
			{ cwd: tempDir, timeoutMs: 60000 },
		);
		expect(createResult.exitCode).toBe(0);

		const changeDir = path.join(
			tempDir,
			"openspec",
			"changes",
			"openspex-ready",
		);
		await completeSpecDrivenArtifacts(changeDir);

		const applyReady = await runCLI(
			["instructions", "apply", "--change", "openspex-ready", "--json"],
			{ cwd: tempDir, timeoutMs: 60000 },
		);
		expect(applyReady.exitCode).toBe(0);
		const applyJson = JSON.parse(applyReady.stdout);
		expect(applyJson.variant).toBe("openspex");
		expect(applyJson.state).toBe("ready");
		expect(applyJson.managedFiles).toEqual(["src/app.ts"]);
		expect(applyJson.contextFiles.openspexManagedFiles).toHaveLength(1);
		expect(applyJson.contextFiles.openspexShadowSpecs).toHaveLength(1);
		expect(applyJson.contextFiles.openspexDeltas).toHaveLength(1);
		expect(applyJson.contextFiles.openspexLegacyDeltas).toBeUndefined();

		const changeOwnedDelta = path.join(
			tempDir,
			"openspec",
			"changes",
			"openspex-ready",
			"shadow-deltas",
			"src",
			"app.ts.delta.md",
		);
		const legacyDelta = path.join(
			tempDir,
			"openspec",
			"impl-specs",
			"src",
			"app.ts",
			"deltas",
			"openspex-ready.delta.md",
		);
		await fs.rm(changeOwnedDelta, { force: true });
		await fs.mkdir(path.dirname(legacyDelta), { recursive: true });
		await fs.writeFile(legacyDelta, "# legacy delta\n", "utf-8");

		const statusResult = await runCLI(
			["status", "--change", "openspex-ready", "--json"],
			{
				cwd: tempDir,
				timeoutMs: 60000,
			},
		);
		expect(statusResult.exitCode).toBe(0);
		const statusJson = JSON.parse(statusResult.stdout);
		expect(statusJson.variant).toBe("openspex");
		expect(
			statusJson.readinessIssues.some((issue: string) =>
				issue.includes("Legacy OpenSpeX delta must move for src/app.ts"),
			),
		).toBe(true);

		const blockedApply = await runCLI(
			["instructions", "apply", "--change", "openspex-ready", "--json"],
			{ cwd: tempDir, timeoutMs: 60000 },
		);
		expect(blockedApply.exitCode).toBe(0);
		const blockedApplyJson = JSON.parse(blockedApply.stdout);
		expect(blockedApplyJson.state).toBe("blocked");
		expect(
			blockedApplyJson.blockingIssues.some((issue: string) =>
				issue.includes("Legacy OpenSpeX delta must move for src/app.ts"),
			),
		).toBe(true);
		expect(blockedApplyJson.contextFiles.openspexLegacyDeltas).toHaveLength(1);
	}, 20000);

	it("blocks apply when the change-owned delta is missing and no legacy delta exists", async () => {
		initGitRepo(tempDir);
		const worktreePath = path.join(
			os.tmpdir(),
			`openspec-worktree-${randomUUID()}`,
		);
		worktreePaths.push(worktreePath);

		const createResult = await runCLI(
			[
				"new",
				"change",
				"openspex-missing",
				"--variant",
				"openspex",
				"--worktree",
				worktreePath,
				"--manage-file",
				"src/app.ts",
			],
			{ cwd: tempDir, timeoutMs: 60000 },
		);
		expect(createResult.exitCode).toBe(0);

		const changeDir = path.join(
			tempDir,
			"openspec",
			"changes",
			"openspex-missing",
		);
		await completeSpecDrivenArtifacts(changeDir);

		await fs.rm(
			path.join(
				tempDir,
				"openspec",
				"changes",
				"openspex-missing",
				"shadow-deltas",
				"src",
				"app.ts.delta.md",
			),
			{ force: true },
		);

		const blockedApply = await runCLI(
			["instructions", "apply", "--change", "openspex-missing", "--json"],
			{ cwd: tempDir, timeoutMs: 60000 },
		);
		expect(blockedApply.exitCode).toBe(0);
		const blockedApplyJson = JSON.parse(blockedApply.stdout);
		expect(blockedApplyJson.state).toBe("blocked");
		expect(
			blockedApplyJson.blockingIssues.some((issue: string) =>
				issue.includes("Missing OpenSpeX delta for src/app.ts"),
			),
		).toBe(true);
		expect(blockedApplyJson.contextFiles.openspexLegacyDeltas).toBeUndefined();
	}, 20000);
});
