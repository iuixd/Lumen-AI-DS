# Lumen Design Tokens

> Canonical design-token specification for the **Lumen AI Design System**.  
> Figma is the design source of truth. Code, Storybook, documentation, and published packages must mirror the approved Figma variables and styles.

## Source

- **Figma file:** Lumen AI Design System
- **Dev Mode node:** `426:4395`
- **Reference:** https://www.figma.com/design/GJBYRm6ySR7XIECFcHMgy2/Lumen-AI-Design-System?node-id=426-4395&m=dev
- **Repository role:** This document defines token architecture, naming, usage, synchronization rules, and the currently documented token scales.
- **Last reviewed:** 2026-07-15

## Authority and synchronization rules

1. The published Figma library is the canonical source for approved token names, values, modes, and aliases.
2. Token exports are the canonical machine-readable source for code generation.
3. This Markdown file explains intent, architecture, and governance. It must not become a manually maintained duplicate of generated token data.
4. Claude Code must update only affected tokens, components, stories, tests, and documentation listed in `changelog.md`.
5. Never regenerate the entire design system for an incremental token change.
6. Never hardcode values in components when an approved token exists.
7. Preserve backward compatibility unless a breaking change is explicitly documented.
8. Every removed or renamed token requires a migration note and deprecation window.

---

## Token architecture

Lumen uses a layered token model:

```text
Primitive tokens
    ↓
Semantic tokens
    ↓
Component tokens
```

### 1. Primitive tokens

Primitive tokens store raw values such as color ramps, spacing, radius, font sizes, and line heights.

Examples:

```text
color/blue/600
spacing/16
radius/lg
font-size/16
line-height/26
```

Primitive tokens must not communicate UI intent.

### 2. Semantic tokens

Semantic tokens describe purpose and adapt across themes or modes.

Examples:

```text
color/background/default
color/background/brand
color/text/primary
color/text/secondary
color/border/subtle
color/action/primary/default
color/action/primary/hover
```

Application components should consume semantic tokens whenever possible.

### 3. Component tokens

Component tokens define values scoped to a specific component or pattern.

Examples:

```text
button/primary/background/default
button/primary/background/hover
button/primary/text/default
button/primary/radius
button/focus-ring
button/disabled/bg
button/disabled/on-action
input/primary/bg
input/primary/border
input/primary/hover-border
input/primary/focused-border
input/primary/error-border
input/search/bg
input/search/icon
input/radio-checkbox/selected
input/radio-checkbox/selected-text
input/radio-checkbox/disabled-border
```

Component tokens should alias semantic or primitive tokens rather than duplicate raw values.

The Input, Radio, and Checkbox collections at Figma nodes `1262:1181`,
`1278:2153`, and `1278:2207` map these component roles in
`packages/tokens/src/semantic/color.json`. Exact component geometry lives in
`packages/tokens/src/input.json` and emits `--input-*` variables for field
border widths, control/indicator sizes, Radio dots, Checkbox radii and exact
exported checked/indeterminate glyph bounds, and focus geometry. The retained
`input-check-stroke-width-*` values document the source-vector strokes; the
component does not mutate those strokes at runtime. Size-specific
`input-{check,indeterminate}-offset-{x,y}-*` tokens preserve the Figma icon
frames' subpixel placement. `input-sm`, `input-md`, `input-lg`, and
`input-shortcut` preserve exact component typography instead of reusing body
styles with different line heights or weights. Figma currently publishes only
the light mode; dark aliases remain provisional until dark control collections
are published.

The Badge collection at Figma node `1079:893` maps its exact light variables to
the `badge.*` group in `packages/tokens/src/semantic/color.json`. The only new
raw color is `badge.default-bg` (`#191919`); every other Badge color aliases an
existing ramp step. `badge-sm`, `badge-md`, and `badge-lg` preserve the exact
Instrument Sans medium typography, `radius.pill` preserves Figma's 100px pill
radius, and existing `spacing.*` tokens provide the gap, padding, and dot sizes.
Dark Badge roles now use the exact values evidenced in the canonical AppShell
light/dark variants at Figma node `1007:3700`; Badge modes outside that
composition remain governed by the standalone Badge collection.

The canonical AppShell component set at Figma node `1174:1357` supplies exact
light and dark semantic roles for the application canvas, surfaces, borders,
text, icons, avatars, navigation, buttons, badges, assistant treatment, and
Theme Toggle. AppShell code consumes only the `app-shell.*` roles or the
component-scoped `button.*` and `badge.*` roles that AppShell remaps at its
root. This prevents generic dark-mode aliases from overriding the published
AppShell modes.

AppShell also scopes the shared `Input` component's primary and search roles
to its published `background`, `border-input`, and `text-placeholder` values.
In the dark mode this resolves both header search and AI Panel query fields to
`#0E0B0E`, `#3D3039`, and `#A8939F` respectively, while focus continues to use
the global semantic focus border. Geometry remains owned by `Input`: the
header uses the search anatomy with `md` typography/border/padding constrained
to 36px height, while the AI Panel uses the standard `sm` configuration.

The Figma `btn/nav/*` roles map to `app-shell.nav-{bg,on-action,active,
selected-on-action}`; the user-directed `app-shell.nav-hover` interaction role
uses the corresponding light/dark `nav-active` color at 50% alpha, without
changing the full-opacity selected state. `icon/default`, `icon/secondary`, and
`bg/avatar` map to their matching AppShell roles. Theme Toggle uses
`app-shell.toggle-{track,on-action,on-bg,off-action,off-bg}` and a fixed 54 x
24 two-cell layout. The Figma `brand/dark` role maps to
`app-shell.brand-dark` (`primary.600`) and is used for branded data indicators,
not the danger/error status role. Except for the explicitly directed
50%-opacity hover derivative, these AppShell roles are Figma-authored in both
modes; this does not change the provisional status of unrelated dark mappings.

---

## Naming convention

Use slash-separated names in Figma and kebab-case CSS custom properties in code.

### Figma

```text
Color/Background/Default
Color/Text/Primary
Spacing/16
Radius/Lg
Button/Primary/Background/Default
```

### CSS

```css
--lumen-color-background-default
--lumen-color-text-primary
--lumen-spacing-16
--lumen-radius-lg
--lumen-button-primary-background-default
```

### Naming rules

- Use nouns for categories and roles.
- Use state suffixes such as `default`, `hover`, `pressed`, `focus`, `disabled`, and `selected`.
- Use `background`, `text`, `icon`, and `border` consistently.
- Avoid implementation-specific names such as `blue-button`.
- Avoid visual-position names such as `left-padding`.
- Avoid duplicate values with different names unless the semantic meaning is intentionally different.
- Do not include hex values in token names.
- Do not use ambiguous labels such as `light`, `dark`, `normal`, or `regular` without context.

---

# 1. Color tokens

The Figma source contains the Lumen color foundations and semantic color definitions. Exact color values must be exported directly from Figma Variables to the repository token source.

## Required color groups

### Primitive palettes

```text
Color/Brand/*
Color/Neutral/*
Color/Blue/*
Color/Green/*
Color/Yellow/*
Color/Orange/*
Color/Red/*
Color/Purple/*
Color/Cyan/*
Color/White
Color/Black
Color/Transparent
```

Each chromatic palette should use a consistent numeric scale. Recommended range:

```text
50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
```

### Semantic colors

```text
Color/Background/Default
Color/Background/Subtle
Color/Background/Muted
Color/Background/Inverse
Color/Background/Brand
Color/Background/Success
Color/Background/Warning
Color/Background/Danger
Color/Background/Info

Color/Text/Primary
Color/Text/Secondary
Color/Text/Tertiary
Color/Text/Disabled
Color/Text/Inverse
Color/Text/Brand
Color/Text/Success
Color/Text/Warning
Color/Text/Danger
Color/Text/Info

Color/Icon/Primary
Color/Icon/Secondary
Color/Icon/Disabled
Color/Icon/Inverse
Color/Icon/Brand
Color/Icon/Success
Color/Icon/Warning
Color/Icon/Danger
Color/Icon/Info

Color/Border/Default
Color/Border/Subtle
Color/Border/Strong
Color/Border/Disabled
Color/Border/Focus
Color/Border/Brand
Color/Border/Success
Color/Border/Warning
Color/Border/Danger
Color/Border/Info
```

### Interactive state colors

```text
Color/Action/Primary/Default
Color/Action/Primary/Hover
Color/Action/Primary/Pressed
Color/Action/Primary/Focus
Color/Action/Primary/Disabled

Color/Action/Secondary/Default
Color/Action/Secondary/Hover
Color/Action/Secondary/Pressed
Color/Action/Secondary/Focus
Color/Action/Secondary/Disabled

Color/Action/Ghost/Default
Color/Action/Ghost/Hover
Color/Action/Ghost/Pressed
Color/Action/Ghost/Focus
Color/Action/Ghost/Disabled

Color/Action/Danger/Default
Color/Action/Danger/Hover
Color/Action/Danger/Pressed
Color/Action/Danger/Focus
Color/Action/Danger/Disabled
```

## Color modes

At minimum, the system should support:

```text
Light
Dark
```

Optional enterprise modes:

```text
High Contrast
Brand Theme
Data Visualization
```

All semantic color tokens must resolve correctly in every published mode.

## Color quality requirements

- Text and interactive states must meet WCAG 2.2 AA.
- Focus indicators must remain visible against adjacent colors.
- Status colors must not rely on color alone.
- Disabled states must remain distinguishable without implying interactivity.
- Dark mode values must be semantically remapped, not mechanically inverted.
- Data visualization palettes must support categorical differentiation and color-vision deficiencies.

> **Implementation note:** Do not copy color values manually from this document. Export them from Figma Variables and validate aliases before publishing.

---

# 2. Typography tokens

The Figma source documents heading, body, label, utility, caption, and code scales.

## Font families

The exact family names must match the published Figma typography variables and styles.

Recommended token structure:

```text
Typography/Font Family/Sans
Typography/Font Family/Mono
```

## Heading scale

| Token                   | Font size | Line height |
| ----------------------- | --------: | ----------: |
| `Typography/Heading/H1` |      60px |        72px |
| `Typography/Heading/H2` |      50px |        60px |
| `Typography/Heading/H3` |      40px |        50px |
| `Typography/Heading/H4` |      32px |        42px |
| `Typography/Heading/H5` |      24px |        32px |
| `Typography/Heading/H6` |      20px |        28px |

## Body scale

| Token                | Font size | Line height |
| -------------------- | --------: | ----------: |
| `Typography/Body/Lg` |      20px |        32px |
| `Typography/Body/Md` |      16px |        26px |
| `Typography/Body/Sm` |      14px |        22px |
| `Typography/Body/Xs` |      12px |        20px |

## Label scale

| Token                 | Font size | Line height |
| --------------------- | --------: | ----------: |
| `Typography/Label/Lg` |      14px |        20px |
| `Typography/Label/Md` |      12px |        18px |
| `Typography/Label/Sm` |      11px |        16px |

## Utility scale

| Token                         | Font size | Line height | Usage                         |
| ----------------------------- | --------: | ----------: | ----------------------------- |
| `Typography/Utility/Overline` |      11px |        16px | Section labels and categories |
| `Typography/Utility/Caption`  |      11px |        18px | Supporting metadata           |

## Code scale

| Token                | Font size | Line height |
| -------------------- | --------: | ----------: |
| `Typography/Code/Md` |      14px |        22px |
| `Typography/Code/Sm` |      12px |        20px |

## Typography composition

Each typography style should explicitly define:

```text
font-family
font-size
font-weight
line-height
letter-spacing
text-case
text-decoration
```

Avoid implicit browser defaults.

## Typography quality requirements

- Use semantic text styles instead of raw font-size variables in components.
- Maintain readable line lengths for body text.
- Do not encode color into typography styles.
- Use a dedicated monospaced family for code.
- Ensure text scaling does not clip or break component layouts.
- Validate all weights used in Figma are loaded in Storybook and production builds.

---

# 3. Scale tokens

The Figma source includes a documented scale section used to align sizing decisions across the system.

Scale tokens should remain generic and reusable:

```text
Scale/1
Scale/2
Scale/3
...
```

Where possible, prefer explicit domain scales for implementation:

```text
Icon/Size/Sm
Icon/Size/Md
Icon/Size/Lg
Control/Height/Sm
Control/Height/Md
Control/Height/Lg
Container/Width/Md
```

Do not use scale tokens as a substitute for semantic component sizing.

---

# 4. Spacing tokens

Lumen spacing is built on an 8-point grid with 2px and 4px substeps for compact UI requirements.

| Figma token   | Value |
| ------------- | ----: |
| `Spacing/0`   |     0 |
| `Spacing/2`   |   2px |
| `Spacing/4`   |   4px |
| `Spacing/6`   |   6px |
| `Spacing/8`   |   8px |
| `Spacing/10`  |  10px |
| `Spacing/12`  |  12px |
| `Spacing/16`  |  16px |
| `Spacing/20`  |  20px |
| `Spacing/24`  |  24px |
| `Spacing/28`  |  28px |
| `Spacing/32`  |  32px |
| `Spacing/40`  |  40px |
| `Spacing/48`  |  48px |
| `Spacing/56`  |  56px |
| `Spacing/64`  |  64px |
| `Spacing/80`  |  80px |
| `Spacing/96`  |  96px |
| `Spacing/128` | 128px |

## Spacing usage

- `2–6px`: optical alignment and compact internal spacing
- `8–16px`: standard component spacing
- `20–32px`: larger component groups and section spacing
- `40–64px`: page sections and responsive layout gaps
- `80–128px`: major page-level separation

## Spacing rules

- Use tokens for padding, margins, gaps, offsets, and layout spacing.
- Do not introduce arbitrary values in component code.
- New values require design-system review.
- Prefer component tokens for repeated component-specific spacing combinations.

---

# 5. Radius tokens

| Figma token   |         Value | Typical usage                         |
| ------------- | ------------: | ------------------------------------- |
| `Radius/None` |           0px | Tables, edge-to-edge surfaces         |
| `Radius/Xs`   |           2px | Small indicators and compact elements |
| `Radius/Sm`   |           4px | Inputs and compact controls           |
| `Radius/Md`   |           6px | Standard controls                     |
| `Radius/Lg`   |           8px | Buttons, cards, menus                 |
| `Radius/Xl`   |          12px | Large cards and panels                |
| `Radius/2xl`  |          16px | Dialogs and feature surfaces          |
| `Radius/3xl`  |          24px | Prominent containers                  |
| `Radius/Full` | Pill / 9999px | Pills, avatars, tags                  |

## Radius rules

- Components must reference radius tokens.
- Do not use arbitrary radius values.
- Preserve the intended hierarchy between compact controls and large surfaces.
- `Radius/Full` should be implemented with a sufficiently large value such as `9999px`.

---

# 6. Required enterprise token categories

The following categories should exist before Lumen is considered complete for large-scale enterprise use.

## Border

```text
Border/Width/0
Border/Width/1
Border/Width/2
Border/Width/4
```

## Elevation

```text
Elevation/None
Elevation/Sm
Elevation/Md
Elevation/Lg
Elevation/Xl
```

Elevation tokens should define complete shadow values, not only blur radius.

## Opacity

```text
Opacity/0
Opacity/4
Opacity/8
Opacity/12
Opacity/16
Opacity/24
Opacity/40
Opacity/60
Opacity/80
Opacity/100
```

## Motion

```text
Motion/Duration/Instant
Motion/Duration/Fast
Motion/Duration/Moderate
Motion/Duration/Slow

Motion/Easing/Standard
Motion/Easing/Enter
Motion/Easing/Exit
Motion/Easing/Emphasized
```

## Z-index

```text
Z-Index/Base
Z-Index/Dropdown
Z-Index/Sticky
Z-Index/Overlay
Z-Index/Modal
Z-Index/Toast
Z-Index/Tooltip
```

## Breakpoints

```text
Breakpoint/Mobile = 0px
Breakpoint/Tablet = 768px
Breakpoint/Desktop = 1024px
```

These three responsive ranges are sourced from the canonical AppShell variant
set (node `1007:3700`): mobile `<768px`, tablet `768–1023px`, and desktop
`≥1024px`. They are published as CSS custom properties, TypeScript values, and
the Tailwind `tablet`/`desktop` screens from `packages/tokens/src/breakpoint.json`.

## Control sizing

```text
Control/Height/Sm
Control/Height/Md
Control/Height/Lg
Control/Height/Xl

Icon/Size/Xs
Icon/Size/Sm
Icon/Size/Md
Icon/Size/Lg
Icon/Size/Xl
```

## Focus

```text
Focus/Ring/Width
Focus/Ring/Offset
Focus/Ring/Color
```

---

# 7. Button token contract

Button styles must be composed from tokens rather than fixed values.

## Required button variants

```text
Primary
Secondary
Tertiary
Ghost
Link
Danger
AI
Icon
```

## Required button states

```text
Default
Hover
Pressed
Focus
Disabled
Loading
```

## Required button sizes

```text
Sm
Md
Lg
```

## Button token structure

```text
Button/{Variant}/Background/{State}
Button/{Variant}/Text/{State}
Button/{Variant}/Icon/{State}
Button/{Variant}/Border/{State}

Button/Radius
Button/Border/Width
Button/Focus/Ring/Width
Button/Focus/Ring/Offset
```

Example:

```text
Button/Primary/Background/Default
Button/Primary/Background/Hover
Button/Primary/Text/Default
Button/Focus/Ring
Button/Disabled/Background
Button/Disabled/On Action
```

## Published theme-aware button roles

The final standard Button collection at node `1027:3733` publishes semantic
roles for `primary`, `accent`, `secondary`, `outline`, `ghost`, `link`, and
`destructive`. Each variant exposes its evidenced default and hover surface,
content, and border roles through `--color-button-{variant}-*` variables.
Shared interaction roles are:

| Role                    | CSS custom property                 | Light     | Dark      |
| ----------------------- | ----------------------------------- | --------- | --------- |
| Focus ring              | `--color-button-focus-ring`         | `#E599B1` | `#E599B1` |
| Disabled background     | `--color-button-disabled-bg`        | `#DFDFDF` | `#231C24` |
| Disabled action content | `--color-button-disabled-on-action` | `#7F7F7F` | `#7B777C` |

The older `--color-button-disabled-background`,
`--color-button-disabled-border`, and `--color-button-disabled-text` roles
remain temporarily for `AIButton` and `SplitButton`; the final standard
Button does not consume them.

`text/brand`, `icon/brand`, and `stroke/brand` are also published as
`--color-text-brand`, `--color-icon-brand`, and `--color-border-brand`.
They are available for exact component bindings, but must not replace older
brand tokens globally until a component-specific Figma binding proves that
usage.

---

# 8. Figma implementation rules

- Use Figma Variables for values that require theming, modes, or code synchronization.
- Use aliases to connect semantic and component tokens to primitives.
- Avoid assigning primitive colors directly to production components.
- Group variables by domain and semantic role.
- Add descriptions to every semantic and component token.
- Define scopes correctly so variables appear only in relevant Figma controls.
- Publish only reviewed collections.
- Keep deprecated tokens available for at least one migration cycle where feasible.
- Do not rename published tokens without documenting the change.

---

# 9. Code implementation rules

Generated outputs should include:

```text
tokens.json
tokens.css
tokens.ts
tailwind-theme.ts
```

Recommended source structure:

```text
packages/tokens/
├── src/
│   ├── primitives.json
│   ├── semantic.json
│   ├── components/
│   │   └── button.json
│   └── themes/
│       ├── light.json
│       └── dark.json
├── dist/
│   ├── tokens.css
│   ├── tokens.json
│   └── tokens.d.ts
└── README.md
```

### CSS example

```css
:root {
  --lumen-spacing-16: 1rem;
  --lumen-radius-lg: 0.5rem;
}

[data-theme="dark"] {
  /* Semantic color overrides generated from the Dark Figma mode */
}
```

### Component rule

```tsx
// Correct
className = "bg-[var(--lumen-button-primary-background-default)]";

// Incorrect
className = "bg-[#0c77da]";
```

---

# 10. Storybook requirements

Storybook must document:

- Primitive token palettes
- Semantic token mappings
- Light and dark modes
- Typography specimens
- Spacing scale
- Radius scale
- Elevation scale
- Button token matrix
- Interactive states
- Accessibility and contrast results
- Deprecated tokens

Token documentation should be generated from the same exported token data used by components.

---

# 11. Quality checklist

Before publishing token changes, verify:

- [ ] Figma variable names follow the naming convention.
- [ ] Semantic tokens alias primitives.
- [ ] Component tokens alias semantic or primitive tokens appropriately.
- [ ] No duplicated tokens exist without distinct semantic intent.
- [ ] No component contains hardcoded color, spacing, radius, or typography values.
- [ ] All required modes resolve without missing aliases.
- [ ] Light and dark themes are visually reviewed.
- [ ] Text and controls meet WCAG 2.2 AA.
- [ ] Focus states are visible.
- [ ] Storybook token documentation is updated.
- [ ] Visual regression tests pass.
- [ ] TypeScript and build checks pass.
- [ ] `changelog.md` records additions, updates, deprecations, and removals.
- [ ] Generated outputs are committed.
- [ ] Package version is incremented according to semantic versioning.

---

# 12. Claude Code update protocol

Claude Code must follow this sequence:

1. Read:
   - `AGENTS.md`
   - `docs/figma-source.md`
   - `docs/design-tokens.md`
   - `docs/component-architecture.md`
   - `docs/changelog.md`
2. Inspect the current exported token source.
3. Compare only the changes documented in `changelog.md`.
4. Update only affected:
   - token files
   - theme files
   - components
   - Storybook stories
   - tests
   - documentation
5. Run validation and report changed files.
6. Do not regenerate or refactor unrelated parts of the design system.
7. Do not invent missing Figma values.
8. Flag unresolved token mappings for human review.

## Reusable Claude Code instruction

```markdown
Read `docs/design-tokens.md` and `docs/changelog.md`.

Treat the published Figma library and exported token files as the source of truth.
Apply only the token changes documented in the changelog.

Update only affected token files, themes, components, Storybook stories, tests, and documentation.
Preserve existing names and APIs unless a breaking change is explicitly approved.
Do not regenerate the entire design system.
Do not modify unrelated files.
Run validation and summarize the exact files changed, warnings, and unresolved mappings.
```

---

# 13. Change management

Use semantic versioning:

- **Patch:** value correction with no API or visual contract change
- **Minor:** additive token or non-breaking semantic enhancement
- **Major:** renamed, removed, or behavior-changing token

Every change must be captured in `changelog.md` using:

```markdown
## Added

## Changed

## Deprecated

## Removed

## Fixed

## Migration
```

---

# 14. Known extraction status

The referenced Figma node exposes the documented token sections for:

- Colors
- Typography
- Scale
- Spacing
- Radius

Spacing, radius, and visible typography values are documented above.

Exact color variable names, aliases, mode values, font families, font weights, letter spacing, and the underlying scale values must be synchronized from the actual published Figma Variables export. They should not be inferred from canvas labels or screenshots.

---

# 15. Token architecture and source of truth

## Purpose

Lumen Design Tokens are derived from published Figma Variables.

Figma Variables define the canonical design language for the Lumen AI Design System and serve as the single source of truth for all design tokens used throughout the design, development, and documentation workflow.

All token implementations should remain synchronized with approved Figma Variables through controlled, incremental updates.

## Token hierarchy

```text
Published Figma Variables
        ↓
Primitive Tokens
        ↓
Semantic Tokens
        ↓
Component Tokens
        ↓
Framework Packages     (React today; Angular, Vue, and Web Components as they
        ↓                ship — see `docs/component-architecture.md` §0)
Storybook
        ↓
Applications
```

Each layer builds upon the previous layer and should not bypass the established hierarchy.

## Token sources

### Primitive tokens

Primitive Tokens define foundational values such as:

- Colors
- Typography
- Spacing
- Radius
- Borders
- Elevation
- Motion
- Opacity
- Breakpoints
- Density

Primitive Tokens originate directly from published Figma Variables.

### Semantic tokens

Semantic Tokens express design intent.

Examples:

```text
Color/Text/Primary
Color/Action/Primary
Color/Border/Subtle
Surface/Primary
```

Semantic Tokens should reference Primitive Tokens through aliases whenever possible.

### Component tokens

Component Tokens define component appearance.

Examples:

```text
Button/Primary/Background
Button/Primary/Text
Input/Border
Dialog/Surface
```

Component Tokens should reference Semantic Tokens rather than Primitive Tokens whenever practical.

## Figma Variables policy

`docs/project-governance.md` §17 defines the full policy: when to read
Variables, what to compare against, the report/recommend/confirm sequence,
and what never to infer. `docs/figma-sync.md` defines the step-by-step sync
procedure. This document defines only the token architecture those two
populate — the hierarchy and layer definitions above.

---

# 16. Duplicate and conflicting Variables

## Purpose

This section defines how Claude Code should handle duplicate, ambiguous, or conflicting Figma Variables.

When multiple Variables have similar names, overlapping purposes, or conflicting values, Claude Code must recommend a resolution before making implementation changes.

---

## Conflict resolution policy

When multiple Figma Variables use the same or similar names but resolve to different values, Claude Code must not automatically select one.

Claude Code should:

1. Identify all conflicting Variables.
2. Record their collection, name, value, aliases, modes, and known consumers.
3. Classify each Variable as:
   - Primitive Token
   - Semantic Token
   - Component Token
   - Exact duplicate
   - Naming conflict
4. Recommend one canonical Variable for each purpose.
5. Provide a rename, merge, deprecation, and migration proposal.
6. Wait for user confirmation before changing Figma or the repository.

---

## Exact duplicates

Variables with identical values and the same intended purpose should be consolidated.

Keep one canonical Variable and deprecate the duplicate.

Example:

```text
Neutral Colors/Black = #141414
Neutral/Black 700 = #141414
```

---

## Same name, different values

Variables with similar names but different values must not be treated as duplicates automatically.

Example:

```text
Neutral/Black = #000000
Neutral Colors/Black = #141414
Brand Colors/Black = #212121
```

Claude Code should determine whether these represent:

- pure black
- neutral scale values
- semantic text colors
- brand-specific colors

The final names should describe purpose or scale position instead of using the generic name `Black`.

---

## Collection naming

Use one approved collection name for each token domain.

Preferred:

```text
Neutral
```

Avoid maintaining overlapping collections such as:

```text
Neutral
Neutral Colors
```

unless they have clearly documented purposes.

---

## Semantic text colors

Text-purpose Variables should use semantic names.

Preferred examples:

```text
Color/Text/Heading
Color/Text/Body
Color/Text/Secondary
Color/Text/Disabled
```

Avoid storing text-purpose Variables under `Brand Colors` unless they genuinely represent brand colors.

---

## Canonical selection criteria

Determine the canonical Variable using:

1. documented semantic purpose
2. existing aliases and consumers
3. token architecture
4. theme behavior
5. accessibility requirements
6. migration impact

Value alone is not sufficient.

---

## Required recommendation format

Before implementation, Claude Code should present:

| Current Variable | Value | Classification | Recommended action | Proposed canonical name |
| ---------------- | ----- | -------------- | ------------------ | ----------------------- |

Also include:

- affected aliases
- affected components
- affected Storybook documentation
- repository migration impact
- Figma migration impact
- deprecation requirements

No Variable should be renamed, merged, deleted, or tokenized until the user confirms the recommendation.
