# Keeping Figma and Code in Sync

## Source of truth

Figma remains the source of truth for **design intent** (new components,
visual exploration, variant states). This repo is the source of truth for
**what ships** — the moment a token or component is coded and released here,
product code should reference the code, not re-derive values from Figma.

## Where the current tokens came from

`packages/tokens/src/*.json` was populated from the `Lumen-DS` Figma file
(library: "Lumen AI - DS - base"):

- Color primitives and the brand color: `Colors` page (Brand Color, Neutral
  Colors, and the 11 hue ramps — Red, Orange, Yellow, Green, Teal, Cyan,
  Blue, Light Blue, Indigo, Purple, Pink — each at 50/100/300/500/700/900).
- Typography scale: `Typography > Baseline` (Display/Headline/Title/Label/
  Body × Large/Medium/Small, font family Inter).
- Layout spacing scale: `Spacing > Spacing Scale` (3XS–3XL).

**Known gaps to close with design before this is fully authoritative:**
- Dark-theme semantic color mappings in `src/semantic/color.json` are an
  engineering extrapolation from the single light/dark example row found in
  the file (`Background Colors`) — validate the full dark palette with
  design before shipping a dark mode.
- Border radius and elevation/shadow scales were extended from a single
  observed value (~10px radius, one drop-shadow effect) into a standard
  scale — confirm exact per-component radii once Code Connect is set up.
- Icons (the Iconly set used throughout the library) are not yet extracted;
  see "Icons" below.
- Component variant props (states, sizes) for Primary/Secondary/Neutral/
  Error/Clear Button, Table Row, Container, Text Link, Button Groups, and
  Next/Prev pagination were rebuilt from the visible instances in the
  showcase file, not pulled from the component library file directly —
  reconcile against the library via Figma Dev Mode once available.

## Recommended ongoing workflow

1. Design changes/adds a component or token in Figma.
2. A designer or engineer runs Figma's **Code Connect** (`figma connect
   publish`) to link the Figma component to its `@lumen/ui` implementation,
   OR opens a PR here manually updating `src/*.json` (tokens) or the
   relevant component (structural changes).
3. `pnpm changeset` describes the change; CI publishes a new version.
4. Product repos bump the dependency (see `docs/versioning-and-releases.md`).

## Icons

The Figma library bundles the Iconly set (library: "Lumen AI - DS - base",
file `Lumen AI - DS - base`, frame "Icons"): **3 corner styles (Sharp,
Regular, Curved) × 6 weights (Bold, Light, Outline, Broken, Bulk, Two-tone)
× up to 125 icon names = 1,949 individual components.** Extracting all of
these mechanically (one Figma API call per icon) is impractical — the
supported path is a native Figma batch export by a human.

**What's shipped today:** a curated 22-icon starter set, all from the
`Sharp/Light` family (arrow-left, arrow-right, bookmark, calendar, chat,
close-square, danger-circle, delete, download, edit, filter, heart, hide,
home, info-square, notification, plus, profile, search, setting, show,
tick-square) — enough to cover the nav/table/form actions the existing
`@lumen/ui` components need. Source SVGs live in
`packages/ui/src/icons/svg/`; generated components in
`packages/ui/src/icons/generated/` (do not hand-edit — regenerate instead).

**To extend coverage:**

1. In Figma, select the icons you need under the "Icons" frame in the
   `Lumen AI - DS - base` library file and batch-export as SVG (Export
   panel). Name each file in kebab-case matching the icon (e.g. `Arrow -
   Right` → `arrow-right.svg`) — the import script derives the component
   name and registry key from the filename.
2. Drop the exported files into `packages/ui/src/icons/svg/`.
3. Run `pnpm --filter @lumen/ui icons:import`. This extracts the real
   geometry out of Figma's export (which includes page-background bleed
   from the enclosing frame — the script strips that automatically),
   recolors fixed hex strokes/fills to `currentColor` so icons inherit
   text color, runs SVGO, and regenerates every `{Name}Icon.tsx` component
   plus the `index.ts` barrel and `registry.ts` name lookup.
4. Import the specific `{Name}Icon` component directly in JSX for
   tree-shaking, or use `<Icon name="arrow-right" />` (from
   `packages/ui/src/primitives/Icon.tsx`) when the icon name is
   data-driven and not known until render.

If a future icon export uses a different weight/style than `Sharp/Light`,
confirm with design first (do not silently mix styles within one product
screen — see the design sign-off doc for the open items on this system).
