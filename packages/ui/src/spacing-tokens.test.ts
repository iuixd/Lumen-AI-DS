import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spacing } from "@lumen/tokens";

/**
 * Guards against the exact bug that broke the Icon Only `sm` Button: source
 * code referencing `var(--spacing-36)` when no `--spacing-36` custom
 * property is ever generated. An undefined CSS variable silently invalidates
 * whatever property used it (height collapses to auto, etc.) instead of
 * erroring — nothing in the type system or build catches it, so it has to be
 * checked statically against the actual token source.
 */
function collectSourceFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "generated") continue; // icon SVGs don't use spacing tokens
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      collectSourceFiles(fullPath, out);
    } else if (/\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)) {
      // Excludes test files (including this one) — their descriptions/comments
      // are prose about the pattern, not real usages of the token in rendered UI.
      out.push(fullPath);
    }
  }
  return out;
}

describe("var(--spacing-N) references", () => {
  it("every referenced spacing key actually exists in @lumen/tokens", () => {
    const srcDir = join(dirname(fileURLToPath(import.meta.url)));
    const definedKeys = new Set(Object.keys(spacing.space));
    const missing: string[] = [];

    for (const file of collectSourceFiles(srcDir)) {
      const content = readFileSync(file, "utf8");
      for (const match of content.matchAll(/var\(--spacing-(\w+)\)/g)) {
        const key = match[1];
        if (!definedKeys.has(key)) {
          missing.push(`${key} (in ${file})`);
        }
      }
    }

    expect(missing).toEqual([]);
  });
});
