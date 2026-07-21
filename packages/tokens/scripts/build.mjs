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

const colorPrimitives = JSON.parse(
  readFileSync(path.join(srcDir, "primitives/color.json"), "utf8")
);
const semanticColor = JSON.parse(readFileSync(path.join(srcDir, "semantic/color.json"), "utf8"));
const typography = JSON.parse(readFileSync(path.join(srcDir, "typography.json"), "utf8"));
const spacing = JSON.parse(readFileSync(path.join(srcDir, "spacing.json"), "utf8"));
const radius = JSON.parse(readFileSync(path.join(srcDir, "radius.json"), "utf8"));
const shadow = JSON.parse(readFileSync(path.join(srcDir, "shadow.json"), "utf8"));
const divider = JSON.parse(readFileSync(path.join(srcDir, "divider.json"), "utf8"));
const breakpoint = JSON.parse(readFileSync(path.join(srcDir, "breakpoint.json"), "utf8"));
const input = JSON.parse(readFileSync(path.join(srcDir, "input.json"), "utf8"));

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

function flattenValueTokens(obj, prefix = []) {
  const out = {};
  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith("_")) continue;
    if (val && typeof val === "object" && "value" in val) {
      out[[...prefix, key].join("-")] = val.value;
    } else if (val && typeof val === "object") {
      Object.assign(out, flattenValueTokens(val, [...prefix, key]));
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
css += "\n  /* shadow (elevation) */\n";
for (const [group, groupTokens] of Object.entries(shadow)) {
  if (group.startsWith("_")) continue;
  for (const [name, val] of Object.entries(groupTokens)) {
    css += `  --shadow-${group}-${kebab(name)}: ${val.value};\n`;
  }
}
css += "\n  /* divider (translucent, raw rgba — see divider.json) */\n";
for (const [group, groupTokens] of Object.entries(divider)) {
  if (group.startsWith("_")) continue;
  for (const [name, val] of Object.entries(groupTokens)) {
    css += `  --divider-${group}-${kebab(name)}: ${val.value};\n`;
  }
}
css += "\n  /* typography */\n";
for (const [key, val] of Object.entries(typography.fontFamily)) {
  css += `  --font-${kebab(key)}: ${val.value.map((f) => (f.includes(" ") ? `"${f}"` : f)).join(", ")};\n`;
}
for (const [key, val] of Object.entries(typography.scale)) {
  css += `  --text-${key}-size: ${val.fontSize}px;\n`;
  css += `  --text-${key}-line-height: ${val.lineHeight}px;\n`;
  css += `  --text-${key}-weight: ${val.weight};\n`;
  if (val.letterSpacing !== undefined)
    css += `  --text-${key}-letter-spacing: ${val.letterSpacing}px;\n`;
}
css += "\n  /* responsive breakpoints */\n";
for (const [key, val] of Object.entries(breakpoint)) {
  if (key.startsWith("_")) continue;
  css += `  --breakpoint-${kebab(key)}: ${val.value}px;\n`;
}
css += "\n  /* input, radio, and checkbox component geometry */\n";
for (const [key, value] of Object.entries(flattenValueTokens(input))) {
  css += `  --input-${kebab(key)}: ${value}px;\n`;
}

// :root carries the light theme as the default — every consuming app gets
// correct colors with zero setup. [data-theme="dark"] below overrides them.
css += "\n  /* semantic: light (default) */\n";
for (const [group, groupTokens] of Object.entries(semanticColor.light)) {
  for (const [name, ref] of Object.entries(groupTokens)) {
    const resolved = resolvePrimitive(ref);
    css += `  --color-${group}-${kebab(name)}: ${resolved};\n`;
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

// Tailwind's core theme already defines numeric spacing keys (2, 4, 6, 8, ...96) on a
// proportional ~4px-per-unit scale. Our `space` scale reuses the SAME numeric keys but
// with a literal-pixel meaning (key "8" = 8px, not core's 32px). Merging all of them into
// theme.extend.spacing would silently override core Tailwind's meaning for every matching
// key across every spacing-based utility (h-*, w-*, p-*, gap-*, inset-*, ...) — including
// plain utility classes that were never meant to reference this token scale at all. Only
// merge keys core Tailwind does NOT already define, so existing classes like `h-8`/`px-4`/
// `gap-2` keep their standard Tailwind meaning. The full `space` scale remains available as
// `--spacing-*` CSS variables and the `spacing.space` JS export for exact token values, e.g.
// `className="h-[var(--spacing-8)]"`.
const TAILWIND_CORE_SPACING_KEYS = new Set([
  "0",
  "px",
  "0.5",
  "1",
  "1.5",
  "2",
  "2.5",
  "3",
  "3.5",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "14",
  "16",
  "20",
  "24",
  "28",
  "32",
  "36",
  "40",
  "44",
  "48",
  "52",
  "56",
  "60",
  "64",
  "72",
  "80",
  "96"
]);
const tailwindSpacing = {};
for (const key of Object.keys(spacing.space)) {
  if (TAILWIND_CORE_SPACING_KEYS.has(key)) continue;
  tailwindSpacing[key] = `var(--spacing-${key})`;
}
for (const key of Object.keys(spacing.layout))
  tailwindSpacing[`layout-${key}`] = `var(--spacing-layout-${key})`;

const tailwindRadius = {};
for (const key of Object.keys(radius)) {
  if (key.startsWith("_")) continue;
  tailwindRadius[key] = `var(--radius-${key})`;
}

const tailwindFontSize = {};
for (const key of Object.keys(typography.scale)) {
  tailwindFontSize[key] = [
    `var(--text-${key}-size)`,
    { lineHeight: `var(--text-${key}-line-height)`, fontWeight: `var(--text-${key}-weight)` }
  ];
}

const preset = `// AUTO-GENERATED by scripts/build.mjs. Do not edit by hand — edit src/*.json instead.
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: ${JSON.stringify(tailwindColors, null, 2)},
      spacing: ${JSON.stringify(tailwindSpacing, null, 2)},
      borderRadius: ${JSON.stringify(tailwindRadius, null, 2)},
      fontSize: ${JSON.stringify(tailwindFontSize, null, 2)},
      fontFamily: {
        ${Object.keys(typography.fontFamily)
          .map((key) => `${JSON.stringify(kebab(key))}: ["var(--font-${kebab(key)})"]`)
          .join(",\n        ")}
      },
      screens: {
        tablet: "${breakpoint.tablet.value}px",
        desktop: "${breakpoint.desktop.value}px"
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
export const divider = ${JSON.stringify(divider, null, 2)} as const;
export const breakpoint = ${JSON.stringify(breakpoint, null, 2)} as const;
export const input = ${JSON.stringify(input, null, 2)} as const;

export type ColorPrimitive = keyof typeof colorPrimitives;
export type SpacingLayoutKey = keyof typeof spacing.layout;
export type SpacingKey = keyof typeof spacing.space;
export type RadiusKey = Exclude<keyof typeof radius, "_comment">;
export type TypographyStyle = keyof typeof typography.scale;
export type InputTokenGroup = Exclude<keyof typeof input, "_comment">;
`;
writeFileSync(path.join(distDir, "index.ts"), indexTs);

console.log("tokens build complete ->", distDir);
