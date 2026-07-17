import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it, afterEach } from "vitest";
import { assertTargetDirAvailable, assertWorkspaceRoot, normalizeProjectName, ValidationError } from "./validation.js";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..");

describe("normalizeProjectName", () => {
  it("normalizes valid names to lowercase", () => {
    expect(normalizeProjectName("My-App_1")).toBe("my-app_1");
  });

  it("trims surrounding whitespace", () => {
    expect(normalizeProjectName("  lumen-ai-saas  ")).toBe("lumen-ai-saas");
  });

  it("rejects an empty name", () => {
    expect(() => normalizeProjectName("")).toThrow(ValidationError);
    expect(() => normalizeProjectName("   ")).toThrow(ValidationError);
  });

  it("rejects names with disallowed characters", () => {
    expect(() => normalizeProjectName("my app")).toThrow(ValidationError);
    expect(() => normalizeProjectName("my@app")).toThrow(ValidationError);
    expect(() => normalizeProjectName("my/app")).toThrow(ValidationError);
  });

  it("rejects names starting with a dot or underscore", () => {
    expect(() => normalizeProjectName("_private")).toThrow(ValidationError);
    expect(() => normalizeProjectName(".hidden")).toThrow(ValidationError);
  });

  it("rejects names over the npm length limit", () => {
    expect(() => normalizeProjectName("a".repeat(215))).toThrow(ValidationError);
  });
});

describe("assertTargetDirAvailable", () => {
  let tempDir: string;

  afterEach(async () => {
    if (tempDir) await rm(tempDir, { recursive: true, force: true });
  });

  it("allows a directory that does not exist", async () => {
    tempDir = await mkdtemp(path.join(tmpdir(), "lumen-create-app-"));
    await expect(assertTargetDirAvailable(path.join(tempDir, "does-not-exist"))).resolves.toBeUndefined();
  });

  it("allows an existing empty directory", async () => {
    tempDir = await mkdtemp(path.join(tmpdir(), "lumen-create-app-"));
    await expect(assertTargetDirAvailable(tempDir)).resolves.toBeUndefined();
  });

  it("rejects an existing non-empty directory", async () => {
    tempDir = await mkdtemp(path.join(tmpdir(), "lumen-create-app-"));
    await writeFile(path.join(tempDir, "keep.txt"), "not empty");
    await expect(assertTargetDirAvailable(tempDir)).rejects.toThrow(ValidationError);
  });
});

describe("assertWorkspaceRoot", () => {
  let fakeRoot: string;

  afterEach(async () => {
    if (fakeRoot) await rm(fakeRoot, { recursive: true, force: true });
  });

  it("passes for the real Lumen repository root", async () => {
    await expect(assertWorkspaceRoot(REPO_ROOT)).resolves.toBeUndefined();
  });

  it("rejects a directory missing pnpm-workspace.yaml and packages", async () => {
    fakeRoot = await mkdtemp(path.join(tmpdir(), "lumen-create-app-fake-root-"));
    await expect(assertWorkspaceRoot(fakeRoot)).rejects.toThrow(ValidationError);
  });

  it("rejects a directory with pnpm-workspace.yaml but no packages/ui", async () => {
    fakeRoot = await mkdtemp(path.join(tmpdir(), "lumen-create-app-fake-root-"));
    await writeFile(path.join(fakeRoot, "pnpm-workspace.yaml"), "packages:\n  - packages/*\n");
    await mkdir(path.join(fakeRoot, "packages", "tokens"), { recursive: true });
    await writeFile(path.join(fakeRoot, "packages", "tokens", "package.json"), "{}");
    await expect(assertWorkspaceRoot(fakeRoot)).rejects.toThrow(ValidationError);
  });
});
