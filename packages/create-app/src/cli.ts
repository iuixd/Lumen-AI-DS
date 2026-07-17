#!/usr/bin/env node
import * as p from "@clack/prompts";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { parseCliFlags } from "./cli-args.js";
import { runCommand } from "./process.js";
import { scaffoldApp } from "./scaffold.js";
import type { ScaffoldOptions } from "./types.js";
import { assertTargetDirAvailable, assertWorkspaceRoot, normalizeProjectName } from "./validation.js";

const DEFAULT_PROJECT_NAME = "lumen-ai-saas";

function printError(error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${message}`);
}

async function main(): Promise<void> {
  // Not process.cwd(): the root "create:react" script runs this via
  // `pnpm --filter @lumen/create-app start`, and pnpm always executes a
  // filtered package's script with that package's own directory as cwd —
  // never the directory the outer `pnpm create:react` was invoked from.
  // The repo root is instead fixed relative to this compiled file's own
  // location: packages/create-app/dist/cli.js is always three levels below it.
  const moduleDir = path.dirname(fileURLToPath(import.meta.url));
  const repoRoot = path.resolve(moduleDir, "..", "..", "..");

  try {
    await assertWorkspaceRoot(repoRoot);
  } catch (error) {
    printError(error);
    process.exitCode = 1;
    return;
  }

  let flags: ReturnType<typeof parseCliFlags>;
  try {
    flags = parseCliFlags(process.argv.slice(2));
  } catch (error) {
    printError(error);
    process.exitCode = 1;
    return;
  }

  const patternsFlag = flags.includePatterns;
  const installFlag = flags.installDeps;

  p.intro("Lumen — create a React application");

  let projectName: string;
  if (flags.name !== undefined) {
    try {
      projectName = normalizeProjectName(flags.name);
    } catch (error) {
      p.cancel(error instanceof Error ? error.message : String(error));
      process.exitCode = 1;
      return;
    }
  } else {
    const answer = await p.text({
      message: "Project name:",
      placeholder: DEFAULT_PROJECT_NAME,
      defaultValue: DEFAULT_PROJECT_NAME,
      validate: (value) => {
        try {
          normalizeProjectName(value || DEFAULT_PROJECT_NAME);
          return undefined;
        } catch (error) {
          return error instanceof Error ? error.message : String(error);
        }
      }
    });
    if (p.isCancel(answer)) {
      p.cancel("Cancelled.");
      return;
    }
    projectName = normalizeProjectName(answer || DEFAULT_PROJECT_NAME);
  }

  const targetDir = path.join(repoRoot, "apps", projectName);
  try {
    await assertTargetDirAvailable(targetDir);
  } catch (error) {
    p.cancel(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
    return;
  }

  let includePatterns: boolean;
  if (patternsFlag !== undefined) {
    includePatterns = patternsFlag;
  } else {
    const answer = await p.confirm({ message: "Include @lumen/patterns?", initialValue: true });
    if (p.isCancel(answer)) {
      p.cancel("Cancelled.");
      return;
    }
    includePatterns = answer;
  }

  let installDeps: boolean;
  if (installFlag !== undefined) {
    installDeps = installFlag;
  } else {
    const answer = await p.confirm({ message: "Install dependencies now?", initialValue: true });
    if (p.isCancel(answer)) {
      p.cancel("Cancelled.");
      return;
    }
    installDeps = answer;
  }

  const options: ScaffoldOptions = { projectName, includePatterns };
  const templateDir = path.join(moduleDir, "..", "templates", "react-vite");

  const spinner = p.spinner();
  spinner.start(`Scaffolding apps/${projectName}`);
  try {
    await scaffoldApp(options, { repoRoot, targetDir, templateDir });
    spinner.stop(`Scaffolded apps/${projectName}`);
  } catch (error) {
    spinner.stop("Scaffolding failed");
    printError(error);
    process.exitCode = 1;
    return;
  }

  if (installDeps) {
    p.log.step("Installing dependencies from the repository root...");
    try {
      await runCommand("corepack", ["pnpm", "install"], { cwd: repoRoot });
    } catch (error) {
      printError(error);
      p.outro("Scaffolding succeeded, but dependency installation failed. Run `corepack pnpm install` manually.");
      process.exitCode = 1;
      return;
    }
  }

  p.outro(
    [
      "Next steps:",
      `  cd apps/${projectName}`,
      "  corepack pnpm dev",
      "",
      `Or from the repository root: corepack pnpm --filter ${projectName} dev`
    ].join("\n")
  );
}

main().catch((error: unknown) => {
  printError(error);
  process.exitCode = 1;
});
