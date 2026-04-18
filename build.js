#!/usr/bin/env node

import { execFileSync } from "child_process";
import { existsSync, rmSync } from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

const maybeBootstrapBuildDeps = () => {
	try {
		require.resolve("typescript/bin/tsc");
		return;
	} catch {
		if (process.env.npm_lifecycle_event !== "prepare") {
			throw new Error(
				"TypeScript is not installed. Run your package manager install before building.",
			);
		}

		console.log("Installing build dependencies for git-based prepare...");
		execFileSync(
			"npm",
			[
				"install",
				"--global=false",
				"--include=dev",
				"--ignore-scripts",
				"--no-package-lock",
			],
			{
				stdio: "inherit",
				env: {
					...process.env,
					npm_config_global: "false",
					npm_config_local_prefix: process.cwd(),
				},
			},
		);
	}
};

const runTsc = (args = []) => {
	maybeBootstrapBuildDeps();
	const tscPath = require.resolve("typescript/bin/tsc");
	execFileSync(process.execPath, [tscPath, ...args], { stdio: "inherit" });
};

console.log("🔨 Building OpenSpec...\n");

// Clean dist directory
if (existsSync("dist")) {
	console.log("Cleaning dist directory...");
	rmSync("dist", { recursive: true, force: true });
}

// Run TypeScript compiler (use local version explicitly)
console.log("Compiling TypeScript...");
try {
	runTsc(["--version"]);
	runTsc();
	console.log("\n✅ Build completed successfully!");
} catch (error) {
	console.error("\n❌ Build failed!");
	process.exit(1);
}
