// Builds CSS variables, a Tailwind preset, and typed JS/TS exports from the
// JSON token sources in src/. This is the single build step that keeps
// design.tokens -> code in sync. Run via `pnpm --filter @lumen/tokens build`.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const srcDir = path.join(root, "src");
const distDir = path.join(root, "dist");
mkdirSync(distDir, { recursive: true });
mkdirSync(path.join(distDir, "css"), { recursive: true });

const colorPrimitives = JSON.parse(readFileSync(path.join(srcDir, "primitives/color.json"), "utf8"));
const semanticColor = JSON.parse(readFileSync(path.join(srcDir, "semantic/color.json"), "utf8"));
const typography = JSON.parse(readFileSync(path.join(srcDir, "typography.json"), "utf8"));
const spacing = JSON.parse(readFileSync(path.join(srcDir, "spacing.json"), "utf8"));
const radius = JSON.parse(readFileSync(path.join(srcDir, "radius.json"), "utf8"));
const shadow = JSON.parse(readFileSync(path.join(srcDir, "shadow.json"), "utf8"));

function kebab(str) {
  return String(str).replace(/[._]/g, "-");
}

function flattenPrimitiveColors(obj, prefix = []) {
  const out = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val && typeof val === "object" && "value" in val) {
      out[[...prefix, key].join(".")] = val.value;
    } else if (val && typeof val === "object") {
      Object.assign(out, flattenPrimitiveColors(val, [...prefix, key]));
    }
  }
  return out;
}

const flatPrimitives = flattenPrimitiveColors(colorPrimitives);

function resolvePrimitive(dotPath) {
  const value = flatPrimitives[dotPath];
  if (!value) throw new Error(`Unknown color primitive reference: ${dotPath}`);
  return value;
}

// ---- CSS custom properties ----
let css = ":root {\n";
css += "  /* color primitives */\n";
for (const [key, value] of Object.entries(flatPrimitives)) {
  css += `  --color-${kebab(key)}: ${value};\n`;
}
css += "\n  /* spacing (layout scale, Figma-sourced) */\n";
for (const [key, val] of Object.entries(spacing.layout)) {
  css += `  --spacing-layout-${key}: ${val.value}px;\n`;
}
css += "\n  /* spacing (fine component scale) */\n";
for (const [key, val] of Object.entries(spacing.space)) {
  css += `  --spacing-${key}: ${val.value}px;\n`;
}
css += "\n  /* radius */\n";
for (const [key, val] of Object.entries(radius)) {
  if (key.startsWith("_")) continue;
  css += `  --radius-${key}: ${val.value}px;\n`;
}
css += "\n  /* shadow */\n";
for (const [key, val] of Object.entries(shadow)) {
  if (key.startsWith("_")) continue;
  css += `  --shadow-${key}: ${val.value};\n`;
}
css += "\n  /* typography */\n";
css += `  --font-sans: ${typography.fontFamily.sans.value.map((f) => (f.includes(" ") ? `"${f}"` : f)).join(", ")};\n`;
css += `  --font-mono: ${typography.fontFamily.mono.value.map((f) => (f.includes(" ") ? `"${f}"` : f)).join(", ")};\n`;
for (const [key, val] of Object.entries(typography.scale)) {
  css += `  --text-${key}-size: ${val.fontSize}px;\n`;
  css += `  --text-${key}-line-height: ${val.lineHeight}px;\n`;
  css += `  --text-${key}-weight: ${val.weight};\n`;
}

for (const [theme, tokens] of Object.entries(semanticColor)) {
  if (theme.startsWith("_")) continue;
  css += "\n  /* semantic: " + theme + " */\n";
  for (const [group, groupTokens] of Object.entries(tokens)) {
    for (const [name, ref] of Object.entries(groupTokens)) {
      const resolved = resolvePrimitive(ref);
      css += `  --color-${group}-${kebab(name)}${theme === "dark" ? "" : ""}: ${theme === "light" ? resolved : "var(--_placeholder)"};\n`;
    }
  }
}
css += "}\n\n";

css += '[data-theme="dark"] {\n';
for (const [group, groupTokens] of Object.entries(semanticColor.dark)) {
  for (const [name, ref] of Object.entries(groupTokens)) {
    const resolved = resolvePrimitive(ref);
    css += `  --color-${group}-${kebab(name)}: ${resolved};\n`;
  }
}
css += "}\n";

writeFileSync(path.join(distDir, "css/variables.css"), css);

// ---- Tailwind preset (CommonJS, framework-agnostic) ----
const semanticColorKeys = new Set();
for (const tokens of Object.values(semanticColor)) {
  if (typeof tokens !== "object") continue;
  for (const [group, groupTokens] of Object.entries(tokens)) {
    for (const name of Object.keys(groupTokens)) {
      semanticColorKeys.add(`${group}-${kebab(name)}`);
    }
  }
}

const tailwindColors = {};
for (const key of Object.keys(flatPrimitives)) {
  tailwindColors[kebab(key)] = `var(--color-${kebab(key)})`;
}
for (const key of semanticColorKeys) {
  tailwindColors[key] = `var(--color-${key})`;
}

const tailwindSpacing = {};
for (const key of Object.keys(spacing.space)) tailwindSpacing[key] = `var(--spacing-${key})`;
for (const key of Object.keys(spacing.layout)) tailwindSpacing[`layout-${key}`] = `var(--spacing-layout-${key})`;

const tailwindRadius = {};
for (const key of Object.keys(radius)) {
  if (key.startsWith("_")) continue;
  tailwindRadius[key] = `var(--radius-${key})`;
}

const tailwindShadow = {};
for (const key of Object.keys(shadow)) {
  if (key.startsWith("_")) continue;
  tailwindShadow[key] = `var(--shadow-${key})`;
}

const tailwindFontSize = {};
for (const [key, val] of Object.entries(typography.scale)) {
  tailwindFontSize[key] = [`var(--text-${key}-size)`, { lineHeight: `var(--text-${key}-line-height)`, fontWeight: `var(--text-${key}-weight)` }];
}

const preset = `// AUTO-GENERATED by scripts/build.mjs. Do not edit by hand — edit src/*.json instead.
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: ${JSON.stringify(tailwindColors, null, 2)},
      spacing: ${JSON.stringify(tailwindSpacing, null, 2)},
      borderRadius: ${JSON.stringify(tailwindRadius, null, 2)},
      boxShadow: ${JSON.stringify(tailwindShadow, null, 2)},
      fontSize: ${JSON.stringify(tailwindFontSize, null, 2)},
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"]
      }
    }
  }
};
`;
writeFileSync(path.join(distDir, "tailwind-preset.cjs"), preset);

// ---- TS/JS runtime export + types ----
const indexTs = `// AUTO-GENERATED by scripts/build.mjs. Do not edit by hand — edit src/*.json instead.
export const colorPrimitives = ${JSON.stringify(flatPrimitives, null, 2)} as const;
export const semanticColor = ${JSON.stringify(semanticColor, null, 2)} as const;
export const typography = ${JSON.stringify(typography, null, 2)} as const;
export const spacing = ${JSON.stringify(spacing, null, 2)} as const;
export const radius = ${JSON.stringify(radius, null, 2)} as const;
export const shadow = ${JSON.stringify(shadow, null, 2)} as const;

export type ColorPrimitive = keyof typeof colorPrimitives;
export type SpacingLayoutKey = keyof typeof spacing.layout;
export type SpacingKey = keyof typeof spacing.space;
export type RadiusKey = Exclude<keyof typeof radius, "_comment">;
export type ShadowKey = Exclude<keyof typeof shadow, "_comment">;
export type TypographyStyle = keyof typeof typography.scale;
`;
writeFileSync(path.join(distDir, "index.ts"), indexTs);

console.log("tokens build complete ->", distDir);
