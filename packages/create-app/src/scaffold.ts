import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ResolvedPaths, ScaffoldOptions } from "./types.js";

/** React/react-dom versions pinned to match packages/ui and packages/patterns' devDependencies. */
const REACT_VERSION = "^18.3.1";
const REACT_DOM_VERSION = "^18.3.1";

export function buildPackageJson(options: ScaffoldOptions): Record<string, unknown> {
  const dependencies: Record<string, string> = {
    "@lumen/tokens": "workspace:*",
    "@lumen/ui": "workspace:*"
  };
  if (options.includePatterns) {
    dependencies["@lumen/patterns"] = "workspace:*";
  }
  dependencies.react = REACT_VERSION;
  dependencies["react-dom"] = REACT_DOM_VERSION;

  return {
    name: options.projectName,
    version: "0.1.0",
    private: true,
    type: "module",
    scripts: {
      dev: "vite",
      build: "tsc -b && vite build",
      // Not bare `tsc --noEmit`: the root tsconfig.json here is a solution-style file
      // (`references` only, no `include`) — outside `--build` mode, tsc treats it as
      // zero input files and exits clean without checking anything. Target the real
      // app project directly so `typecheck` actually type-checks `src/`.
      typecheck: "tsc --noEmit -p tsconfig.app.json",
      preview: "vite preview"
    },
    dependencies,
    devDependencies: {
      "@types/node": "^20.14.15",
      "@types/react": "^18.3.3",
      "@types/react-dom": "^18.3.0",
      "@vitejs/plugin-react": "^4.3.1",
      autoprefixer: "^10.4.20",
      postcss: "^8.4.47",
      tailwindcss: "^3.4.13",
      typescript: "^5.5.4",
      vite: "^5.4.8"
    }
  };
}

/**
 * Matches packages/storybook/tailwind.config.cjs's own content-scanning convention, with one
 * addition: `*.test.{ts,tsx}` is excluded (Tailwind's `!`-prefixed negation glob) because
 * Tailwind's content scanner regex-tokenizes raw file text rather than parsing JS/TS — a
 * regex literal like `/(?<![-:\w])border-\[...\]/` in a *.test.tsx assertion reads, to that
 * scanner, as a real arbitrary-value class candidate. The bogus rule it generates is dead
 * CSS (never referenced by any real className), but esbuild's CSS minifier still warns on
 * its invalid property/value shape at build time. Scanning source, not tests, is also just
 * the more correct scope for "does this app's build actually use this utility class".
 */
export function buildTailwindConfig(options: ScaffoldOptions): string {
  const contentPaths = [
    '"./index.html"',
    '"./src/**/*.{ts,tsx}"',
    '"../../packages/ui/src/**/*.{ts,tsx}"',
    '"!../../packages/ui/src/**/*.test.{ts,tsx}"'
  ];
  if (options.includePatterns) {
    contentPaths.push('"../../packages/patterns/src/**/*.{ts,tsx}"', '"!../../packages/patterns/src/**/*.test.{ts,tsx}"');
  }

  return `const lumenPreset = require("@lumen/tokens/tailwind-preset");

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [lumenPreset],
  content: [
    ${contentPaths.join(",\n    ")}
  ]
};
`;
}

export function renderTemplate(template: string, vars: Record<string, string>): string {
  return Object.entries(vars).reduce((acc, [key, value]) => acc.split(`{{${key}}}`).join(value), template);
}

/**
 * Files that aren't valid at their template path and only become correct once copied to
 * apps/<name>/ — either because they contain unresolved {{PLACEHOLDER}} tokens (README), or
 * because a relative path inside them (tsconfig "extends") is only correct at the copied
 * location's directory depth, not the template's. The `.template` suffix keeps editors from
 * treating the at-rest file as live JSON/Markdown (e.g. resolving "extends" and reporting a
 * missing parent config) — the same reason `package.json` isn't a template file, generated
 * from scratch instead of copied.
 */
const TEMPLATE_FILES = [
  { from: "README.md.template", to: "README.md" },
  { from: "tsconfig.json.template", to: "tsconfig.json" },
  { from: "tsconfig.app.json.template", to: "tsconfig.app.json" },
  { from: "tsconfig.node.json.template", to: "tsconfig.node.json" }
];

export async function scaffoldApp(options: ScaffoldOptions, paths: ResolvedPaths): Promise<void> {
  await mkdir(paths.targetDir, { recursive: true });
  await cp(paths.templateDir, paths.targetDir, { recursive: true });

  const packageJson = buildPackageJson(options);
  await writeFile(path.join(paths.targetDir, "package.json"), `${JSON.stringify(packageJson, null, 2)}\n`, "utf8");

  const tailwindConfig = buildTailwindConfig(options);
  await writeFile(path.join(paths.targetDir, "tailwind.config.cjs"), tailwindConfig, "utf8");

  const vars: Record<string, string> = {
    PROJECT_NAME: options.projectName,
    PATTERNS_DEPENDENCY_NOTE: options.includePatterns ? ", and `@lumen/patterns`" : "",
    PATTERNS_PACKAGE_LINE: options.includePatterns ? "\n- `@lumen/patterns` → `../../packages/patterns`" : ""
  };

  for (const { from, to } of TEMPLATE_FILES) {
    const fromPath = path.join(paths.targetDir, from);
    const template = await readFile(fromPath, "utf8");
    await writeFile(path.join(paths.targetDir, to), renderTemplate(template, vars), "utf8");
    await rm(fromPath);
  }
}
