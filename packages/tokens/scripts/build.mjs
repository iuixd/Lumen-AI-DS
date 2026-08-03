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
const gradient = JSON.parse(readFileSync(path.join(srcDir, "gradient.json"), "utf8"));
const breakpoint = JSON.parse(readFileSync(path.join(srcDir, "breakpoint.json"), "utf8"));
const input = JSON.parse(readFileSync(path.join(srcDir, "input.json"), "utf8"));
const motion = JSON.parse(readFileSync(path.join(srcDir, "motion.json"), "utf8"));
const contentState = JSON.parse(readFileSync(path.join(srcDir, "content-state.json"), "utf8"));
const toast = JSON.parse(readFileSync(path.join(srcDir, "toast.json"), "utf8"));
const iconButton = JSON.parse(readFileSync(path.join(srcDir, "icon-button.json"), "utf8"));
const size = JSON.parse(readFileSync(path.join(srcDir, "size.json"), "utf8"));
const opacity = JSON.parse(readFileSync(path.join(srcDir, "opacity.json"), "utf8"));

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
css += "\n  /* gradient (raw CSS values — see gradient.json) */\n";
for (const [key, val] of Object.entries(gradient)) {
  if (key.startsWith("_")) continue;
  css += `  --gradient-${kebab(key)}: ${val.value};\n`;
}
css += "\n  /* typography */\n";
for (const [key, val] of Object.entries(typography.fontFamily)) {
  css += `  --font-${kebab(key)}: ${val.value.map((f) => (f.includes(" ") ? `"${f}"` : f)).join(", ")};\n`;
}
for (const [key, val] of Object.entries(typography.scale)) {
  css += `  --text-${key}-size: ${val.fontSize}px;\n`;
  css += `  --text-${key}-line-height: ${val.lineHeight}${typeof val.lineHeight === "number" ? "px" : ""};\n`;
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
// Motion carries three different unit conventions in one file, so unlike the
// px-only geometry files above it can't share a single emitter: durations are
// ms, easings are bare cubic-bezier()/keyword strings, and opacities are
// unitless numbers.
css += "\n  /* motion — see motion.json; every step except the skeleton group is provisional */\n";
for (const [key, val] of Object.entries(motion.duration)) {
  css += `  --duration-${kebab(key)}: ${val.value}ms;\n`;
}
for (const [key, val] of Object.entries(motion.easing)) {
  css += `  --easing-${kebab(key)}: ${val.value};\n`;
}
for (const [key, val] of Object.entries(motion.opacity)) {
  css += `  --opacity-${kebab(key)}: ${val.value};\n`;
}
// Stagger is authored as a fraction of the loop (portable if the loop
// duration is ever re-sourced) but is only ever consumed as an
// animation-delay, so it is resolved to ms here rather than in every caller.
for (const [key, val] of Object.entries(motion.stagger)) {
  if (key.startsWith("_")) continue;
  css += `  --duration-stagger-${kebab(key)}: ${val.value * motion.duration["skeleton-pulse"].value}ms;\n`;
}
css += "\n  /* ContentState component geometry */\n";
for (const [key, value] of Object.entries(flattenValueTokens(contentState))) {
  css += `  --content-state-${kebab(key)}: ${value}px;\n`;
}
css += "\n  /* Toast component geometry */\n";
for (const [key, value] of Object.entries(flattenValueTokens(toast))) {
  css += `  --toast-${kebab(key)}: ${value}px;\n`;
}
css += "\n  /* IconButton component geometry */\n";
for (const [key, value] of Object.entries(flattenValueTokens(iconButton))) {
  css += `  --icon-button-${kebab(key)}: ${value}px;\n`;
}
css += "\n  /* Size — component-scale dimensions (nav, header/footer, icon, avatar, touch target) */\n";
for (const [key, value] of Object.entries(flattenValueTokens(size))) {
  css += `  --size-${kebab(key)}: ${value}px;\n`;
}
css += "\n  /* generic Opacity primitive scale (distinct from motion.opacity's skeleton-specific keys) */\n";
for (const [key, val] of Object.entries(opacity)) {
  if (key.startsWith("_")) continue;
  css += `  --opacity-${kebab(key)}: ${val.value};\n`;
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
// Typography is fixed across themes/breakpoints by default (only colors vary
// by theme) — a scale entry can opt into a per-variant override via a
// sibling "dark"/"tablet"/"mobile" key. This one helper emits the
// `--text-*` declarations for whichever variant is requested; the caller
// wraps the result in the right selector ([data-theme="dark"] for "dark",
// an @media block for "tablet"/"mobile" — see below).
function typographyOverrideDeclarations(variantKey) {
  const entries = Object.entries(typography.scale).filter(([, val]) => val[variantKey]);
  if (entries.length === 0) return "";
  let block = `\n  /* typography: ${variantKey} overrides */\n`;
  for (const [key, val] of entries) {
    const v = val[variantKey];
    if (v.fontSize !== undefined) block += `  --text-${key}-size: ${v.fontSize}px;\n`;
    if (v.lineHeight !== undefined)
      block += `  --text-${key}-line-height: ${v.lineHeight}${typeof v.lineHeight === "number" ? "px" : ""};\n`;
    if (v.weight !== undefined) block += `  --text-${key}-weight: ${v.weight};\n`;
    if (v.letterSpacing !== undefined) block += `  --text-${key}-letter-spacing: ${v.letterSpacing}px;\n`;
  }
  return block;
}
css += typographyOverrideDeclarations("dark");
css += "}\n";

// Responsive typography: reuses breakpoint.json's already-approved
// thresholds (mobile <768, tablet 768-1023, desktop >=1024 — NOT Figma's
// raw reference-frame widths of 390/768/1440, which are canvas sizes, not
// approved transition points) as the only breakpoint vocabulary. CSS media
// conditions can't reference custom properties, so the pixel values are
// inlined here from breakpoint.json's already-parsed JS data. :root above
// keeps emitting the desktop value unconditionally as the default, so a
// scale entry with no tablet/mobile override is unaffected — this is
// additive, not a rewrite of the existing typography emission.
const tabletOverrides = typographyOverrideDeclarations("tablet");
if (tabletOverrides) {
  css += `\n@media (min-width: ${breakpoint.tablet.value}px) and (max-width: ${breakpoint.desktop.value - 1}px) {\n  :root {${tabletOverrides}  }\n}\n`;
}
const mobileOverrides = typographyOverrideDeclarations("mobile");
if (mobileOverrides) {
  css += `\n@media (max-width: ${breakpoint.tablet.value - 1}px) {\n  :root {${mobileOverrides}  }\n}\n`;
}

// ---- Motion keyframes ----
// The only rule set this file emits that isn't a custom-property declaration.
// It lives here, rather than in a component stylesheet, because @lumen/tokens'
// single `./css` export is the one stylesheet every consumer already imports
// (see packages/storybook/.storybook/tailwind.css) — a separate motion.css
// would need its own import in every app and would drift from motion.json.
// A keyframe percentage cannot reference a custom property, so the waveform's
// shape is inlined from motion.json's own values at build time; nothing here
// is hand-authored. The reduced-motion block is mandatory, not optional —
// see docs/accessibility.md §3.6.
const pulseFrom = motion.opacity["skeleton-pulse-from"].value;
const pulseTo = motion.opacity["skeleton-pulse-to"].value;
css += `
/* Skeleton pulse — exact waveform from Figma node 1174:1355. Consumed by
   @lumen/ui's ContentState loading state; see motion.json. */
@keyframes lumen-skeleton-pulse {
  0% { opacity: ${pulseFrom}; }
  30% { opacity: ${pulseTo}; }
  60%, 100% { opacity: ${pulseFrom}; }
}

.lumen-skeleton-pulse {
  animation: lumen-skeleton-pulse var(--duration-skeleton-pulse) var(--easing-skeleton-pulse) infinite;
  animation-delay: var(--lumen-skeleton-delay, 0ms);
}

@media (prefers-reduced-motion: reduce) {
  .lumen-skeleton-pulse {
    animation: none;
    opacity: ${pulseFrom};
  }
}

/* Toast auto-dismiss progress bar. Duration is direct user request, not
   Figma motion data — see motion.json's duration.toast. Reduced motion keeps
   the bar static and full rather than animating, so the toast's own
   disappearance at the end of the (still-running) JS timer remains the
   non-animated status cue — see docs/accessibility.md §3.6. */
@keyframes lumen-toast-progress {
  from { width: 100%; }
  to { width: 0%; }
}

.lumen-toast-progress {
  animation: lumen-toast-progress var(--duration-toast) linear forwards;
}

@media (prefers-reduced-motion: reduce) {
  .lumen-toast-progress {
    animation: none;
    width: 100%;
  }
}

/* EnterpriseLoginPage hero illustration ambient motion — direct user request,
   no Figma motion source (see motion.json's hero-rotate/hero-glimmer). A
   full, smooth, constant-speed clockwise rotation (linear timing, not an
   ease — an eased continuous spin visibly speeds up/slows down at the loop
   boundary, which reads as a stutter rather than "smooth"), plus a handful
   of staggered sparkle-dot twinkles layered over the illustration. */
@keyframes lumen-hero-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.lumen-hero-rotate {
  animation: lumen-hero-rotate var(--duration-hero-rotate) linear infinite;
  transform-origin: center;
}

@media (prefers-reduced-motion: reduce) {
  .lumen-hero-rotate {
    animation: none;
  }
}

@keyframes lumen-hero-glimmer {
  0%, 100% { opacity: 0; transform: scale(0.6); }
  50% { opacity: 1; transform: scale(1); }
}

.lumen-hero-glimmer {
  animation: lumen-hero-glimmer var(--duration-hero-glimmer) var(--easing-skeleton-pulse) infinite;
  animation-delay: var(--lumen-glimmer-delay, 0ms);
}

@media (prefers-reduced-motion: reduce) {
  .lumen-hero-glimmer {
    animation: none;
    opacity: 0;
  }
}
`;

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
export const motion = ${JSON.stringify(motion, null, 2)} as const;
export const contentState = ${JSON.stringify(contentState, null, 2)} as const;
export const toast = ${JSON.stringify(toast, null, 2)} as const;
export const iconButton = ${JSON.stringify(iconButton, null, 2)} as const;
export const size = ${JSON.stringify(size, null, 2)} as const;
export const opacity = ${JSON.stringify(opacity, null, 2)} as const;
export const gradient = ${JSON.stringify(gradient, null, 2)} as const;

export type ColorPrimitive = keyof typeof colorPrimitives;
export type SpacingLayoutKey = keyof typeof spacing.layout;
export type SpacingKey = keyof typeof spacing.space;
export type RadiusKey = Exclude<keyof typeof radius, "_comment">;
export type TypographyStyle = keyof typeof typography.scale;
export type InputTokenGroup = Exclude<keyof typeof input, "_comment">;
export type DurationKey = keyof typeof motion.duration;
export type EasingKey = keyof typeof motion.easing;
export type ContentStateToken = Exclude<keyof typeof contentState, "_comment">;
export type ToastToken = Exclude<keyof typeof toast, "_comment">;
export type IconButtonToken = Exclude<keyof typeof iconButton, "_comment">;
export type SizeToken = Exclude<keyof typeof size, "_comment">;
export type OpacityToken = Exclude<keyof typeof opacity, "_comment">;
`;
writeFileSync(path.join(distDir, "index.ts"), indexTs);

console.log("tokens build complete ->", distDir);
