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

The Figma library bundles a large third-party icon set (Iconly). Rather than
hand-transcribing hundreds of icons through automated extraction, the
recommended path is: export the icon set as SVGs from Figma (Export panel,
batch export), then add a small `icons:import` script under
`packages/ui/scripts/` that runs each SVG through SVGO and generates a typed
`Icon` component per file, consistent with how `packages/ui/src/primitives`
components are authored. That script does not exist yet in this repo — it's
the next concrete step for whoever picks up icon coverage.
