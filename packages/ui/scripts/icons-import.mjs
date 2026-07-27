// Converts raw SVGs batch-exported from Figma (see docs/figma-sync.md
// "Icons") into typed React icon components.
//
// Input:  src/icons/svg/*.svg — one file per icon, named in kebab-case
//         (e.g. "arrow-right.svg", "checkbox-checked.svg"). Three source
//         shapes are supported, all a byproduct of exporting one icon node
//         out of a much larger Figma page/frame rather than a standalone
//         icon file:
//           1. Legacy Iconly library exports (the old "Lumen AI - DS - base"
//              file): real geometry lives one level deep inside a single
//              <g id="Iconly/Sharp/Light/..."> group, alongside page-
//              background bleed from the enclosing frame.
//           2. Lumen-DS-2027 "Icons" page exports (download_assets, svg
//              format): real geometry lives inside <g id="Icons"><rect .../>
//              <g id="...">HERE</g></g> — the outer wrapper plus a giant
//              bleed-border rect tracing the whole page's bounds.
//           3. Lumen-DS-2027's bulk icon library (canvas 432:14782, ~1,900
//              icons across ~51 category frames) — these are already
//              pre-extracted and normalized by scripts/icons-bulk-split.mjs
//              (which pulls each icon's <g> out of a combined per-category
//              export and translates it into its own 0 0 W H viewBox), so
//              the whole file *is* the geometry — no wrapper to strip.
//         Either way this script extracts just the real geometry group.
// Output: src/icons/generated/{PascalCase}Icon.tsx — one component per icon,
//         plus an index.ts barrel and a name -> component registry.
//
// Usage: pnpm --filter @lumen/ui icons:import
// Re-run any time src/icons/svg/ changes (new exports, updated icons).

import { readdir, readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { optimize } from "svgo";

const here = dirname(fileURLToPath(import.meta.url));
const svgDir = join(here, "../src/icons/svg");
const outDir = join(here, "../src/icons/generated");

const ICONLY_GROUP_RE = /<g[^>]*id="Iconly\/[^"]*"[^>]*>([\s\S]*?)<\/g>/;
const PAGE_EXPORT_GROUP_RE = /<g[^>]*id="Icons"[^>]*>[\s\S]*?<g[^>]*>([\s\S]*?)<\/g>\s*<\/g>/;
const BULK_SPLIT_RE = /<svg[^>]*>([\s\S]*)<\/svg>/;
// Matches any fixed fill/stroke value, not just hex — Figma sometimes exports
// named colors (fill="black") instead of hex, and those need recoloring too
// or they slip through untouched (and can get minified to a hex code like
// "#000" by the SVGO pass below, which then looks like a legitimate color).
const FIXED_COLOR_RE = /(fill|stroke)="(?!none"|currentColor")[^"]*"/g;
const FIXED_OPACITY_RE = /\s*fill-opacity="[^"]*"/g;
// Multi-color brand marks (packages/ui/src/icons/svg/*-logo.svg) must keep
// their authored colors — forcing currentColor would flatten e.g. Google
// Cloud's 4-color mark into a single blob and destroy the brand identity.
const PRESERVE_COLOR_SUFFIX = "-logo";

function toPascalCase(kebab) {
  return kebab
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function extractIconGroup(rawSvg, fileName, kebabName) {
  const match =
    rawSvg.match(ICONLY_GROUP_RE) ?? rawSvg.match(PAGE_EXPORT_GROUP_RE) ?? rawSvg.match(BULK_SPLIT_RE);
  if (!match) {
    throw new Error(
      `${fileName}: couldn't find a recognized icon geometry group (none of the ` +
        `<g id="Iconly/...">, <g id="Icons"><g>...</g></g> page-export, or bare-<svg> ` +
        `bulk-split shapes matched). Inspect the raw export and adjust icons-import.mjs ` +
        `if the source shape differs.`
    );
  }
  if (kebabName.endsWith(PRESERVE_COLOR_SUFFIX)) {
    return match[1];
  }
  return match[1].replace(FIXED_OPACITY_RE, "").replace(FIXED_COLOR_RE, '$1="currentColor"');
}

async function buildIconSvg(innerMarkup) {
  const wrapped = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">${innerMarkup}</svg>`;
  const { data } = optimize(wrapped, {
    multipass: true,
    plugins: [
      {
        name: "preset-default",
        params: {
          overrides: {
            removeViewBox: false,
            // currentColor isn't a real color to SVGO's minifyStyles pass — leave as-is.
            removeUselessDefs: false
          }
        }
      }
    ]
  });
  // Pull the inner markup back out of SVGO's cleaned document.
  const cleaned = data.match(/<svg[^>]*>([\s\S]*)<\/svg>/)?.[1] ?? innerMarkup;
  // JSX requires camelCase SVG attributes (stroke-width -> strokeWidth) —
  // React renders kebab-case ones fine but warns on every mount.
  return convertInlineStyleAttrs(escapeStyleBlocks(cleaned))
    .trim()
    .replace(/([a-z]+)-([a-z]+)=/g, (_, a, b) => `${a}${b[0].toUpperCase()}${b.slice(1)}=`);
}

// A <style> tag's CSS (e.g. an animated icon's @keyframes) is plain text in
// real SVG/HTML, but JSX parses a literal `{`/`}` in an element's children as
// the start of a JS expression — so raw CSS text breaks compilation the
// moment a rule appears. Wrap it as a template-literal expression instead,
// which JSX children fully support as-is. Escaping order matters: backslash
// first, then backtick/${, so we don't double-escape the backslashes those
// introduce.
function escapeStyleBlocks(markup) {
  return markup.replace(/<style>([\s\S]*?)<\/style>/g, (_, css) => {
    const escaped = css.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
    return `<style>{\`${escaped}\`}</style>`;
  });
}

// A per-element style="..." attribute (e.g. SVGO hoisting an animated icon's
// CSS-selector rule onto the element it targets) is a plain string in real
// SVG/HTML, but React's JSX `style` prop is typed as a CSSProperties object,
// not a string — so it fails to typecheck as-is. Parse the declaration list
// and emit the equivalent object literal instead.
function convertInlineStyleAttrs(markup) {
  return markup.replace(/style="([^"]*)"/g, (_, css) => {
    const props = css
      .split(";")
      .map((decl) => decl.trim())
      .filter(Boolean)
      .map((decl) => {
        const i = decl.indexOf(":");
        const prop = decl.slice(0, i).trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        const value = decl.slice(i + 1).trim();
        return `${prop}: ${JSON.stringify(value)}`;
      })
      .join(", ");
    return `style={{${props}}}`;
  });
}

function componentSource(componentName, innerSvg) {
  return `import { forwardRef, type SVGProps } from "react";

/** Generated by scripts/icons-import.mjs — do not edit by hand. */
export const ${componentName} = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      aria-hidden="true"
      {...props}
    >
      ${innerSvg}
    </svg>
  )
);
${componentName}.displayName = "${componentName}";
`;
}

async function main() {
  const files = (await readdir(svgDir)).filter((f) => f.endsWith(".svg"));
  if (files.length === 0) {
    console.error(`No .svg files found in ${svgDir}`);
    process.exit(1);
  }

  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  const icons = [];

  for (const file of files.sort()) {
    const kebabName = file.replace(/\.svg$/, "");
    const componentName = `${toPascalCase(kebabName)}Icon`;
    const raw = await readFile(join(svgDir, file), "utf8");
    const innerMarkup = extractIconGroup(raw, file, kebabName);
    const cleanedInner = await buildIconSvg(innerMarkup);
    await writeFile(join(outDir, `${componentName}.tsx`), componentSource(componentName, cleanedInner));
    icons.push({ kebabName, componentName });
  }

  const indexSource =
    icons.map((i) => `export { ${i.componentName} } from "./${i.componentName}";`).join("\n") + "\n";
  await writeFile(join(outDir, "index.ts"), indexSource);

  const registrySource = `import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from "react";
${icons.map((i) => `import { ${i.componentName} } from "./${i.componentName}";`).join("\n")}

type IconComponent = ForwardRefExoticComponent<SVGProps<SVGSVGElement> & RefAttributes<SVGSVGElement>>;

/** Generated by scripts/icons-import.mjs — do not edit by hand. */
export const iconRegistry: Record<string, IconComponent> = {
${icons.map((i) => `  "${i.kebabName}": ${i.componentName}`).join(",\n")}
};

export type IconName = keyof typeof iconRegistry;
`;
  await writeFile(join(outDir, "registry.ts"), registrySource);

  console.log(`icons:import complete -> generated ${icons.length} icon components in ${outDir}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
