# Lumen Design Tokens Changelog

All notable changes to the **Lumen Design Tokens** are recorded in this file.

This changelog follows the principles of [Keep a Changelog](https://keepachangelog.com/) and uses semantic versioning.

## Source

- **Figma file:** Lumen DS 2027
- **Dev Mode node:** `426:4395`
- **Reference:** https://www.figma.com/design/GJBYRm6ySR7XIECFcHMgy2/Lumen-DS-2027?node-id=426-4395&m=dev
- **Related documents:**
  - `docs/figma-source.md`
  - `docs/design-tokens.md`
  - `docs/component-architecture.md`

## Purpose

This file is the primary scope-control document for Claude Code.

Claude Code must:

1. Read the latest unreleased section first.
2. Apply only the changes explicitly listed there.
3. Update only affected tokens, components, Storybook stories, tests, documentation, and generated files.
4. Preserve all unrelated design-system files.
5. Never regenerate the entire Lumen Design System for an incremental update.
6. Report unresolved Figma-to-code differences instead of inventing values.

---

## Changelog conventions

Use the following headings for every release:

```markdown
## [Unreleased]

### Added
### Changed
### Deprecated
### Removed
### Fixed
### Migration
### Validation
```

### Versioning rules

- **Patch**: token correction, documentation fix, alias correction, or non-breaking accessibility fix
- **Minor**: new token, new semantic role, new mode, or additive component token
- **Major**: removed token, renamed public token, changed semantic meaning, or incompatible theme behavior

### Change-entry format

Each change should identify:

- affected token group
- Figma source or node
- old value or behavior
- new value or behavior
- affected code files
- affected components
- migration requirement
- validation status

Example:

```markdown
- Updated `Color/Action/Primary/Hover`
  - Figma source: Button color variables
  - Previous: alias to `Color/Blue/600`
  - Current: alias to `Color/Blue/700`
  - Affects: Button, Icon Button
  - Migration: none
  - Validation: Storybook visual test passed
```

---

## [Unreleased]

### Added

- Added the initial `design-tokens.md` specification for Lumen.
- Added the initial `component-architecture.md` specification.
- Added changelog governance for incremental Figma-to-code synchronization.
- Added documented enterprise token categories that require future implementation or verification:
  - border width
  - elevation
  - opacity
  - motion
  - z-index
  - breakpoints
  - control sizing
  - icon sizing
  - focus ring
- Added the required button token contract covering:
  - Primary
  - Secondary
  - Tertiary
  - Ghost
  - Link
  - Danger
  - AI
  - Icon
- Added required interaction states:
  - Default
  - Hover
  - Pressed
  - Focus
  - Disabled
  - Loading
- Added `Spacing/14` and `Spacing/18`
  - Figma source: Buttons page (node `475:7210`), the `Left`/`Right` icon-position instances added to Primary, Raised, Secondary, Tertiary, and Link
  - Value: 14px (Button size `xs`), 18px (Button sizes `md`/`lg`); 16px reused the existing `Spacing/16`
  - Affects: `@lumen/ui` `Button`'s `iconStart`/`iconEnd` icon sizing. No new `Button` variant or prop was needed — those props already reproduced the Left/Right instances' box model (6px gap, unchanged per-size padding) exactly; only the icon glyph's own size was undocumented.
  - Storybook: added `WithIcons` and `WithIconsBySize` stories to `Primitives/Button`
  - Migration: none
  - Validation: `tsc --noEmit` passed for `@lumen/ui`; `Button.test.tsx` (18 tests) passed; new stories confirmed registered and rendering via the running Storybook instance
  - Changeset: `.changeset/icon-position-buttons.md` (`@lumen/tokens` minor, `@lumen/ui` patch)
- Added `Color/Cobalt`, `Color/Japonica`, `Color/Deep Purple`, and `Color/Forest`
  - Figma source: Colors page (node `426:4396`), `get_variable_defs` Variables export (a later publish exposed the full color system; the initial read only returned a handful of neutral/brand-chrome variables)
  - Value: each a full 9-step `50`-`800` ramp, added as `cobalt`/`japonica`/`deep-purple`/`forest` in `packages/tokens/src/primitives/color.json`, matching the existing family step convention exactly
  - Affects: `@lumen/tokens` primitives only — no semantic alias, component, or Storybook usage added yet
  - Migration: none (purely additive)
  - Validation: `pnpm --filter @lumen/tokens build` regenerated `dist/css/variables.css`, `dist/tailwind-preset.cjs`, and `dist/index.ts` with all four families (36 new CSS variables each)
- Resolved the `Gray`/`Foundation` vs. `Neutral` and `Lumen Crimson` vs. `Primary` naming collisions flagged above
  - Figma source: Colors page (node `426:4396`), re-verified via `get_variable_defs`
  - Resolution: `Gray`, `Foundation`, and `Lumen Crimson` collections were retired in Figma. `Neutral` and `Primary` are canonical (per `docs/design-tokens.md` §16's selection criteria: already-shipped primitive/semantic names win over duplicate or brand-descriptive names with no functional benefit)
  - Affects: none — no code or token change required; the surviving `Neutral`/`Primary` Variables match `packages/tokens/src/primitives/color.json` exactly, step for step, with zero drift
  - Migration: none
  - Validation: re-queried `get_variable_defs` on node `426:4396` after the Figma fix; confirmed no `Gray`/`Foundation`/`Lumen Crimson` entries remain and every remaining value matches the existing primitive source

### Changed

- No confirmed token-value changes are recorded yet.
- Future updates must be added here before Claude Code modifies implementation files.
- Applied the Introduction page code typography and syntax text colors to all Storybook Docs code blocks.
  - Source: local Storybook Introduction page (`Introduction.mdx`); no Figma node is involved
  - Previous: the shared font and syntax-color selectors depended on `.docblock-source`, which did not guarantee coverage of every autogenerated story source wrapper
  - Current: all preformatted code inside `.sbdocs-wrapper` receives the same JetBrains Mono stack, base code color, and light/dark syntax-token colors
  - Affects: `packages/storybook/.storybook/tailwind.css`; MDX fenced examples and autogenerated source blocks across Primitives, Composite, Layout, and Patterns Docs pages
  - Migration: none
  - Validation: `corepack pnpm --filter @lumen/storybook build-storybook` passed
  - Changeset: none (`@lumen/storybook` is private and no published package API changed)
- Updated textarea controls across Storybook Docs ArgsTables.
  - Source: local Storybook Docs control table; no Figma node is involved
  - Previous: Storybook applied a `1px` inset box shadow, a `200ms` box-shadow/opacity transition, and `6px` horizontal padding
  - Current: no box shadow or transition, `6px 16px` padding, `16px` radius, and `16px` font size
  - Affects: `packages/storybook/.storybook/tailwind.css`; textarea controls in all Storybook Docs pages
  - Migration: none; production Lumen form controls are unaffected
  - Validation: `corepack pnpm --filter @lumen/storybook build-storybook` passed
  - Changeset: none (`@lumen/storybook` is private and no published package API changed)
- Applied the same Docs-only control treatment to text inputs and dropdowns.
  - Source: local Storybook Docs control table; no Figma node is involved
  - Previous: Storybook text inputs and selects retained their default inset shadow, transition, padding, and radius
  - Current: no box shadow or transition, `6px 16px` padding, `16px` radius, and `16px` font size
  - Affects: `packages/storybook/.storybook/tailwind.css`; text-input and native select controls in all Storybook Docs pages
  - Migration: none; boolean toggles and production Lumen controls are unaffected
  - Validation: `corepack pnpm --filter @lumen/storybook build-storybook` passed
  - Changeset: none (`@lumen/storybook` is private and no published package API changed)
- Updated Storybook Docs ArgsTable type badges.
  - Source: local Storybook Docs control table; no Figma node is involved
  - Previous: type badges inherited the shared Docs body-small font size and Storybook text color
  - Current: `14px` font size and `rgba(46, 52, 56, 1)` text color
  - Affects: `packages/storybook/.storybook/tailwind.css`; type badges such as `string` and `boolean` across all Storybook Docs pages
  - Migration: none; inline code outside ArgsTables and production Lumen Badge components are unaffected
  - Validation: `corepack pnpm --filter @lumen/storybook build-storybook` passed
  - Changeset: none (`@lumen/storybook` is private and no published package API changed)
- Added automated Storybook deployment from `main` to GitHub Pages.
  - Source: repository release workflow; no Figma node is involved
  - Previous: CI built Storybook but did not publish the static output
  - Current: `.github/workflows/deploy-storybook.yml` builds Storybook, uploads the static artifact, and deploys it through the protected `github-pages` environment
  - Affects: GitHub Actions and the published Storybook only
  - Migration: repository administrators must select GitHub Actions as the Pages publishing source if it is not already enabled
  - Validation: local production Storybook build passed; remote deployment remains pending the first workflow run
  - Changeset: none (`@lumen/storybook` is private and no published package API changed)

### Deprecated

- None.

### Removed

- None.

### Fixed

- None.

### Migration

- None required for the initial documentation baseline.

### Validation

- The referenced Figma node was reviewed as the design-token foundation source.
- The visible sections include:
  - Colors
  - Typography
  - Scale
  - Spacing
  - Radius
- Exact Figma variable definitions could not be retrieved during this changelog creation because the Figma connector reported that no layer was selected.
- Exact color aliases, color mode values, font families, font weights, letter spacing, and scale values remain pending direct variable export or node-specific verification.

---

## [0.1.0] - 2026-07-12

### Added

#### Token foundation

Established the initial documented Lumen token foundation based on the supplied Figma Dev Mode node.

The baseline includes:

- color foundations
- typography hierarchy
- scale guidance
- spacing scale
- radius scale
- token naming rules
- primitive, semantic, and component token architecture
- Figma-to-code synchronization rules
- Storybook token-documentation requirements
- accessibility and quality gates

#### Spacing tokens

Added the following documented spacing tokens:

| Token | Value |
|---|---:|
| `Spacing/0` | 0 |
| `Spacing/2` | 2px |
| `Spacing/4` | 4px |
| `Spacing/6` | 6px |
| `Spacing/8` | 8px |
| `Spacing/10` | 10px |
| `Spacing/12` | 12px |
| `Spacing/16` | 16px |
| `Spacing/20` | 20px |
| `Spacing/24` | 24px |
| `Spacing/28` | 28px |
| `Spacing/32` | 32px |
| `Spacing/40` | 40px |
| `Spacing/48` | 48px |
| `Spacing/56` | 56px |
| `Spacing/64` | 64px |
| `Spacing/80` | 80px |
| `Spacing/96` | 96px |
| `Spacing/128` | 128px |

#### Radius tokens

Added the following documented radius tokens:

| Token | Value |
|---|---:|
| `Radius/None` | 0px |
| `Radius/Xs` | 2px |
| `Radius/Sm` | 4px |
| `Radius/Md` | 6px |
| `Radius/Lg` | 8px |
| `Radius/Xl` | 12px |
| `Radius/2xl` | 16px |
| `Radius/3xl` | 24px |
| `Radius/Full` | Pill / 9999px |

#### Typography tokens

Added the documented heading scale:

| Token | Font size | Line height |
|---|---:|---:|
| `Typography/Heading/H1` | 60px | 72px |
| `Typography/Heading/H2` | 50px | 60px |
| `Typography/Heading/H3` | 40px | 50px |
| `Typography/Heading/H4` | 32px | 42px |
| `Typography/Heading/H5` | 24px | 32px |
| `Typography/Heading/H6` | 20px | 28px |

Added the documented body scale:

| Token | Font size | Line height |
|---|---:|---:|
| `Typography/Body/Lg` | 20px | 32px |
| `Typography/Body/Md` | 16px | 26px |
| `Typography/Body/Sm` | 14px | 22px |
| `Typography/Body/Xs` | 12px | 20px |

Added the documented label scale:

| Token | Font size | Line height |
|---|---:|---:|
| `Typography/Label/Lg` | 14px | 20px |
| `Typography/Label/Md` | 12px | 18px |
| `Typography/Label/Sm` | 11px | 16px |

Added the documented utility scale:

| Token | Font size | Line height |
|---|---:|---:|
| `Typography/Utility/Overline` | 11px | 16px |
| `Typography/Utility/Caption` | 11px | 18px |

Added the documented code scale:

| Token | Font size | Line height |
|---|---:|---:|
| `Typography/Code/Md` | 14px | 22px |
| `Typography/Code/Sm` | 12px | 20px |

#### Color architecture

Added the required color-token architecture for:

- primitive palettes
- semantic backgrounds
- semantic text
- semantic icons
- semantic borders
- interactive action states
- Light mode
- Dark mode

Exact color values and aliases remain governed by the published Figma Variables library.

#### Governance

Added the following implementation rules:

- Figma is the canonical design source.
- Exported token files are the canonical machine-readable source.
- Components must not hardcode token-backed values.
- Semantic tokens should alias primitives.
- Component tokens should alias semantic or primitive tokens.
- Token removals and renames require migration documentation.
- Storybook token documentation must be generated from the same exported data used by components.

### Changed

- Established slash-separated token naming in Figma.
- Established kebab-case CSS custom-property naming in code.
- Established layered token architecture:
  - primitive
  - semantic
  - component

### Deprecated

- Direct primitive-color use inside production components is discouraged and should be migrated to semantic or component aliases.
- Arbitrary spacing and radius values outside the approved scale are discouraged.

### Removed

- None.

### Fixed

- None.

### Migration

For existing components:

1. Replace hardcoded colors with semantic or component tokens.
2. Replace arbitrary spacing with approved `Spacing/*` tokens.
3. Replace arbitrary radius values with approved `Radius/*` tokens.
4. Preserve current public APIs unless a breaking change is approved.
5. Update Storybook and visual tests only for affected components.

### Validation

Initial documentation validation completed for:

- spacing scale
- radius scale
- visible typography sizes and line heights
- token architecture
- naming rules
- incremental update workflow

Pending validation:

- exact color values
- color aliases
- Light and Dark mode mappings
- font families
- font weights
- letter spacing
- complete scale-token values
- elevation values
- motion values
- component-specific token mappings

---

## Pending Figma synchronization

The following items must be populated from the published Figma Variables export or verified node-specific Dev Mode data.

### Colors

- [ ] Confirm all primitive palette names.
- [ ] Confirm all color values.
- [ ] Confirm semantic aliases.
- [ ] Confirm Light mode mappings.
- [ ] Confirm Dark mode mappings.
- [ ] Confirm interactive state colors.
- [ ] Confirm focus-ring color.
- [ ] Confirm disabled-state mappings.
- [ ] Confirm status colors.
- [ ] Confirm data-visualization palettes.

### Typography

- [ ] Confirm primary font family.
- [ ] Confirm monospaced font family.
- [ ] Confirm font weights.
- [ ] Confirm letter spacing.
- [ ] Confirm text case.
- [ ] Confirm text decoration.
- [ ] Confirm Figma text-style names.

### Scale

- [ ] Confirm all scale-token names.
- [ ] Confirm all scale-token values.
- [ ] Confirm intended usage for each scale value.

### Additional enterprise tokens

- [ ] Border widths
- [ ] Elevation
- [ ] Opacity
- [ ] Motion duration
- [ ] Motion easing
- [ ] Z-index
- [ ] Breakpoints
- [ ] Control heights
- [ ] Icon sizes
- [ ] Focus ring width and offset

---

## Claude Code execution template

Copy this section into a Claude Code task after updating the latest `Unreleased` entries.

```markdown
Read:

- `AGENTS.md`
- `docs/figma-source.md`
- `docs/design-tokens.md`
- `docs/component-architecture.md`
- `docs/changelog.md`

Treat the published Lumen Figma library and exported token files as the source of truth.

Apply only the changes listed under `[Unreleased]`.

Update only affected:

- token source files
- generated token outputs
- theme files
- components
- Storybook stories
- tests
- documentation
- package exports

Do not regenerate the design system.
Do not modify unrelated files.
Do not rename or remove public tokens unless the changelog explicitly approves a breaking change.
Do not invent missing Figma values.

Run:

- token validation
- type checking
- unit tests
- accessibility tests
- Storybook build
- visual regression checks where available

Report:

1. files changed
2. token changes applied
3. components affected
4. validation results
5. unresolved Figma-to-code differences
```

---

## Release-entry template

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added

- Added `Token/Name`
  - Figma source:
  - Value or alias:
  - Affects:
  - Storybook:
  - Tests:

### Changed

- Changed `Token/Name`
  - Previous:
  - Current:
  - Reason:
  - Affects:

### Deprecated

- Deprecated `Token/Name`
  - Replacement:
  - Removal target:

### Removed

- Removed `Token/Name`
  - Replacement:
  - Breaking change:

### Fixed

- Fixed:
  - Root cause:
  - Validation:

### Migration

- Required migration steps:

### Validation

- Figma review:
- Token build:
- Type check:
- Unit tests:
- Accessibility:
- Storybook:
- Visual regression:
```
