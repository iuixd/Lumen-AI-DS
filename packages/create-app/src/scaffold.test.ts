import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { buildPackageJson, buildTailwindConfig, renderTemplate, scaffoldApp } from "./scaffold.js";

const TEMPLATE_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "templates",
  "react-vite"
);

describe("buildPackageJson", () => {
  it("includes @lumen/patterns only when selected", () => {
    const withPatterns = buildPackageJson({ projectName: "demo-app", includePatterns: true });
    const withoutPatterns = buildPackageJson({ projectName: "demo-app", includePatterns: false });

    expect((withPatterns.dependencies as Record<string, string>)["@lumen/patterns"]).toBe("workspace:*");
    expect((withoutPatterns.dependencies as Record<string, string>)["@lumen/patterns"]).toBeUndefined();
  });

  it("always includes @lumen/tokens, @lumen/ui, react, and react-dom as workspace/pinned deps", () => {
    const packageJson = buildPackageJson({ projectName: "demo-app", includePatterns: false });
    const dependencies = packageJson.dependencies as Record<string, string>;

    expect(dependencies["@lumen/tokens"]).toBe("workspace:*");
    expect(dependencies["@lumen/ui"]).toBe("workspace:*");
    expect(dependencies.react).toMatch(/^\^18\./);
    expect(dependencies["react-dom"]).toMatch(/^\^18\./);
  });

  it("uses the normalized project name and required scripts", () => {
    const packageJson = buildPackageJson({ projectName: "demo-app", includePatterns: false });

    expect(packageJson.name).toBe("demo-app");
    expect(packageJson.private).toBe(true);
    expect(packageJson.type).toBe("module");
    expect(packageJson.scripts).toMatchObject({
      dev: "vite",
      build: "tsc -b && vite build",
      typecheck: "tsc --noEmit -p tsconfig.app.json",
      preview: "vite preview"
    });
  });
});

describe("buildTailwindConfig", () => {
  it("includes the patterns content path only when patterns are selected", () => {
    const withPatterns = buildTailwindConfig({ projectName: "demo-app", includePatterns: true });
    const withoutPatterns = buildTailwindConfig({ projectName: "demo-app", includePatterns: false });

    expect(withPatterns).toContain("../../packages/patterns/src/**/*.{ts,tsx}");
    expect(withoutPatterns).not.toContain("packages/patterns");
  });

  it("excludes *.test.{ts,tsx} files from every package it scans", () => {
    const withPatterns = buildTailwindConfig({ projectName: "demo-app", includePatterns: true });
    const withoutPatterns = buildTailwindConfig({ projectName: "demo-app", includePatterns: false });

    expect(withoutPatterns).toContain("!../../packages/ui/src/**/*.test.{ts,tsx}");
    expect(withPatterns).toContain("!../../packages/ui/src/**/*.test.{ts,tsx}");
    expect(withPatterns).toContain("!../../packages/patterns/src/**/*.test.{ts,tsx}");
  });

  it("always scans the ui package source and local app source", () => {
    const config = buildTailwindConfig({ projectName: "demo-app", includePatterns: false });

    expect(config).toContain("../../packages/ui/src/**/*.{ts,tsx}");
    expect(config).toContain("./src/**/*.{ts,tsx}");
    expect(config).toContain('require("@lumen/tokens/tailwind-preset")');
  });
});

describe("renderTemplate", () => {
  it("substitutes all occurrences of a placeholder", () => {
    const result = renderTemplate("Hello {{NAME}}, welcome {{NAME}}!", { NAME: "Lumen" });
    expect(result).toBe("Hello Lumen, welcome Lumen!");
  });

  it("leaves unmatched placeholders untouched", () => {
    const result = renderTemplate("{{KNOWN}} {{UNKNOWN}}", { KNOWN: "value" });
    expect(result).toBe("value {{UNKNOWN}}");
  });
});

describe("scaffoldApp", () => {
  let tempDir: string;

  afterEach(async () => {
    if (tempDir) await rm(tempDir, { recursive: true, force: true });
  });

  it("writes a generated package.json, tailwind config, README, and copies static source", async () => {
    tempDir = await mkdtemp(path.join(tmpdir(), "lumen-scaffold-"));
    const targetDir = path.join(tempDir, "apps", "demo-app");

    await scaffoldApp(
      { projectName: "demo-app", includePatterns: true },
      { repoRoot: tempDir, targetDir, templateDir: TEMPLATE_DIR }
    );

    const packageJson = JSON.parse(await readFile(path.join(targetDir, "package.json"), "utf8"));
    expect(packageJson.name).toBe("demo-app");
    expect(packageJson.dependencies["@lumen/patterns"]).toBe("workspace:*");

    const tailwindConfig = await readFile(path.join(targetDir, "tailwind.config.cjs"), "utf8");
    expect(tailwindConfig).toContain("packages/patterns");

    const readme = await readFile(path.join(targetDir, "README.md"), "utf8");
    expect(readme).toContain("# demo-app");
    expect(readme).not.toContain("{{");

    const mainSource = await readFile(path.join(targetDir, "src", "main.tsx"), "utf8");
    expect(mainSource).toContain('import "@lumen/tokens/css"');

    const appSource = await readFile(path.join(targetDir, "src", "App.tsx"), "utf8");
    expect(appSource).toContain('from "@lumen/ui"');

    const tsconfigApp = JSON.parse(await readFile(path.join(targetDir, "tsconfig.app.json"), "utf8"));
    expect(tsconfigApp.extends).toBe("../../tsconfig.base.json");
    expect(tsconfigApp.compilerOptions.types).toContain("node");
  });

  it("does not leave any *.template file behind", async () => {
    tempDir = await mkdtemp(path.join(tmpdir(), "lumen-scaffold-"));
    const targetDir = path.join(tempDir, "apps", "demo-app");

    await scaffoldApp(
      { projectName: "demo-app", includePatterns: false },
      { repoRoot: tempDir, targetDir, templateDir: TEMPLATE_DIR }
    );

    for (const leftover of [
      "README.md.template",
      "tsconfig.json.template",
      "tsconfig.app.json.template",
      "tsconfig.node.json.template"
    ]) {
      await expect(readFile(path.join(targetDir, leftover), "utf8")).rejects.toThrow();
    }

    for (const expected of ["README.md", "tsconfig.json", "tsconfig.app.json", "tsconfig.node.json"]) {
      await expect(readFile(path.join(targetDir, expected), "utf8")).resolves.not.toBe("");
    }
  });
});
