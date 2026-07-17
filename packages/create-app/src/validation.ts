import { existsSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";

export class ValidationError extends Error {}

const PROJECT_NAME_PATTERN = /^[A-Za-z0-9_-]+$/;
const MAX_NAME_LENGTH = 214;

/**
 * Validates raw CLI/prompt input and normalizes it into an npm-package-name-safe
 * string. Throws ValidationError (not a raw exception) on any rejection, since
 * callers surface `.message` directly to the user without a stack trace.
 */
export function normalizeProjectName(rawInput: string): string {
  const trimmed = rawInput.trim();

  if (!trimmed) {
    throw new ValidationError("Project name cannot be empty.");
  }
  if (!PROJECT_NAME_PATTERN.test(trimmed)) {
    throw new ValidationError("Project name may only contain letters, numbers, hyphens, and underscores.");
  }
  if (trimmed.length > MAX_NAME_LENGTH) {
    throw new ValidationError(`Project name must be ${MAX_NAME_LENGTH} characters or fewer.`);
  }

  const normalized = trimmed.toLowerCase();
  if (/^[._]/.test(normalized)) {
    throw new ValidationError("Project name cannot start with a dot or underscore.");
  }

  return normalized;
}

/** Rejects only when targetDir exists AND is non-empty; a missing or empty dir is fine. */
export async function assertTargetDirAvailable(targetDir: string): Promise<void> {
  if (!existsSync(targetDir)) return;

  const entries = await readdir(targetDir);
  if (entries.length > 0) {
    throw new ValidationError(`Directory already exists and is not empty: ${targetDir}`);
  }
}

/** Workspace mode only runs from the Lumen repository root — verify the tells before scaffolding. */
export async function assertWorkspaceRoot(repoRoot: string): Promise<void> {
  const requiredRelativePaths = [
    "pnpm-workspace.yaml",
    path.join("packages", "tokens", "package.json"),
    path.join("packages", "ui", "package.json")
  ];

  const missing = requiredRelativePaths.filter((relativePath) => !existsSync(path.join(repoRoot, relativePath)));

  if (missing.length > 0) {
    throw new ValidationError(
      `This doesn't look like the Lumen repository root (missing: ${missing.join(", ")}). ` +
        "Run `pnpm create:react` from the repository root."
    );
  }
}
