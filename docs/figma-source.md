# Lumen Figma Source

> Source-of-truth and synchronization contract for the **Lumen AI Design System**.

This document tells Claude Code, designers, and developers how to interpret the Lumen Figma library, which Figma artifacts are authoritative, how changes must be synchronized, and how to avoid unnecessary regeneration of the design system.

## Canonical source

- **Figma file:** Lumen AI Design System
- **File key:** `GJBYRm6ySR7XIECFcHMgy2`
- **Design Tokens node:** `426:4395`
- **Dev Mode URL:** https://www.figma.com/design/GJBYRm6ySR7XIECFcHMgy2/Lumen-AI-Design-System?node-id=426-4395&m=dev
- **Node name:** Design Tokens
- **Last reviewed:** 2026-07-15

## Related repository documents

Claude Code must read these files together:

```text
AGENTS.md
docs/figma-source.md
docs/design-tokens.md
docs/component-architecture.md
docs/changelog.md
```

Document responsibilities:

| File                        | Responsibility                                                                       |
| --------------------------- | ------------------------------------------------------------------------------------ |
| `figma-source.md`           | Defines Figma authority, source locations, synchronization, and validation rules     |
| `design-tokens.md`          | Defines token architecture, naming, values, aliases, and implementation rules        |
| `component-architecture.md` | Defines component hierarchy, API standards, states, testing, and Storybook structure |
| `changelog.md`              | Defines the exact scope of each incremental update                                   |
| `AGENTS.md`                 | Defines Claude Code operating instructions for the repository                        |

---

# 1. Source-of-truth hierarchy

Lumen uses the following authority order:

```text
Published Figma Variables and Components
    ↓
Approved Figma Dev Mode specification
    ↓
Exported machine-readable token files
    ↓
Repository documentation
    ↓
Framework packages (React today; Angular, Vue, and Web Components as they
    ↓                ship — see `docs/component-architecture.md` §0) and Storybook
```

When sources conflict:

1. The current approved and published Figma library takes precedence for visual and interaction specifications.
2. Exported token files take precedence for exact machine-readable values.
3. `changelog.md` defines which changes are authorized for implementation.
4. Existing code remains unchanged when Figma information is incomplete or ambiguous.
5. Claude Code must report conflicts instead of guessing.

## Figma owns

Figma is authoritative for:

- primitive token values
- semantic token aliases
- variable collections
- variable modes
- typography styles
- color styles
- effect styles
- grid styles
- component anatomy
- component variants
- component properties
- spacing and sizing
- radius
- visual states
- responsive intent
- accessibility annotations
- usage guidance
- deprecation status

## Code owns

The repository is authoritative for:

- framework package implementation details (React today)
- TypeScript APIs
- runtime behavior
- package exports
- build configuration
- tests
- accessibility implementation
- performance behavior
- server-side integration
- deployment
- Storybook configuration

Figma must not be treated as the source for undocumented business logic or runtime architecture.

---

# 2. Current Figma source structure

The referenced `Design Tokens` canvas contains the following top-level sections:

| Order | Section    | Figma node  |
| ----: | ---------- | ----------- |
|    01 | Colors     | `426:4396`  |
|    02 | Typography | `428:13769` |
|    03 | Scale      | `429:14216` |
|    04 | Spacing    | `511:2`     |
|    05 | Radius     | `511:78`    |

These sections form the current documented Lumen foundation.

## 2.1 Colors

- **Node:** `426:4396`
- Contains the Lumen color reference and palette documentation.
- Includes named swatches and displayed color codes.
- Exact variables, aliases, scopes, and modes must be retrieved from published Figma Variables or a direct export.
- Canvas labels and visual swatches must not be used as a substitute for machine-readable variable data.

## 2.2 Typography

- **Node:** `428:13769`
- Contains heading, body, label, utility, caption, and code specimens.
- Visible documented values include font sizes and line heights.
- Font family, font weight, letter spacing, text case, and text decoration must be verified from Figma styles or variables.

## 2.3 Scale

- **Node:** `429:14216`
- Contains the documented general scale.
- Scale labels are present, but exact values must be verified before code generation.
- Scale tokens should not replace semantic component sizing.

## 2.4 Spacing

- **Node:** `511:2`
- Uses an 8-point grid with 2px and 4px substeps.
- Documented values:

```text
0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 28, 32,
40, 48, 56, 64, 80, 96, 128
```

## 2.5 Radius

- **Node:** `511:78`
- Documented values:

```text
none = 0px
xs = 2px
sm = 4px
md = 6px
lg = 8px
xl = 12px
2xl = 16px
3xl = 24px
full = pill / 9999px
```

---

# 3. Required Figma library structure

The Lumen Figma file should maintain a clear separation between foundations, components, patterns, and documentation.

Recommended page structure:

```text
00 Cover and Guidance
01 Foundations
02 Primitives
03 Components
04 Enterprise Components
05 AI Components
06 Patterns
07 Templates
08 Accessibility
09 Release Review
99 Archive
```

The current Design Tokens canvas may remain inside the Foundations page.

## Foundation categories

```text
Colors
Typography
Scale
Spacing
Radius
Borders
Elevation
Opacity
Motion
Breakpoints
Grid
Iconography
Focus
```

## Component categories

```text
Actions
Inputs
Selection
Navigation
Feedback
Overlays
Data Display
Layout
AI
Enterprise Workflow
```

---

# 4. Variable collections

Lumen should use separate Figma Variable collections based on responsibility.

Recommended collections:

```text
Lumen Primitives
Lumen Semantic
Lumen Components
Lumen Layout
Lumen Motion
```

## 4.1 Lumen Primitives

Stores raw values:

```text
Color/Blue/600
Color/Neutral/900
Spacing/16
Radius/Lg
Font Size/16
Line Height/26
```

## 4.2 Lumen Semantic

Stores contextual aliases:

```text
Color/Background/Default
Color/Text/Primary
Color/Border/Focus
Color/Action/Primary/Default
```

## 4.3 Lumen Components

Stores component-specific aliases:

```text
Button/Primary/Background/Default
Button/Focus/Ring
Button/Disabled/Background
Input/Border/Focus
Card/Radius
```

## 4.4 Lumen Layout

Stores layout decisions:

```text
Breakpoint/Md
Container/Max Width/Lg
Grid/Columns/Desktop
```

## 4.5 Lumen Motion

Stores interaction timing:

```text
Motion/Duration/Fast
Motion/Easing/Standard
```

---

# 5. Figma modes

At minimum, the semantic collection should support:

```text
Light
Dark
```

Optional modes should be added only when approved:

```text
High Contrast
Brand Theme
Compact Density
Comfortable Density
```

## Mode rules

- Primitive tokens should remain stable across themes unless the primitive model explicitly supports modes.
- Semantic tokens should resolve to the correct primitives in each mode.
- Component tokens should normally alias semantic tokens.
- Dark mode must be intentionally mapped and not mechanically inverted.
- Every published mode must resolve without missing values.
- New modes require Storybook and visual-regression coverage.

---

# 6. Naming contract

Use slash-separated names in Figma.

```text
Color/Background/Default
Color/Text/Primary
Spacing/16
Radius/Lg
Button/Primary/Background/Hover
```

Use kebab-case CSS custom properties in code.

```css
--lumen-color-background-default
--lumen-color-text-primary
--lumen-spacing-16
--lumen-radius-lg
--lumen-button-primary-background-hover
```

## Naming requirements

- Use semantic intent rather than visual appearance.
- Do not use hex values in names.
- Do not use temporary labels such as `New Color`.
- Avoid generic Figma layer names such as `Frame 123`.
- Match Figma variant values to code variant names where practical.
- Use consistent state names:
  - `Default`
  - `Hover`
  - `Pressed`
  - `Focus`
  - `Disabled`
  - `Loading`
  - `Selected`
- Use consistent visual-role names:
  - `Background`
  - `Text`
  - `Icon`
  - `Border`

---

# 7. Component source requirements

Each published Figma component must define:

- purpose
- anatomy
- supported variants
- supported sizes
- supported states
- component properties
- Auto Layout behavior
- minimum and maximum dimensions
- text wrapping
- icon behavior
- accessibility guidance
- token bindings
- code mapping
- maturity status

## Component-set requirements

Use a component set when multiple supported variants exist.

Recommended dimensions:

```text
Variant
Size
State
Tone
Density
Orientation
Selected
Loading
```

Do not create unsupported combinatorial variants.

## Component properties

Use component properties for:

```text
Label
Supporting text
Leading icon visibility
Leading icon swap
Trailing icon visibility
Trailing icon swap
Loading
Disabled
```

## Layer naming

Recommended:

```text
Container
State layer
Content
Label
Supporting text
Leading icon
Trailing icon
Focus ring
```

Avoid:

```text
Frame 1
Rectangle 7
Group 24
Text copy
```

---

# 8. Figma-to-code mapping

Each stable Figma component should map to a production code component.

Recommended mapping record:

| Field             | Example                                                |
| ----------------- | ------------------------------------------------------ |
| Figma component   | Button                                                 |
| Figma node        | Component-set node ID                                  |
| Code component    | `Button`                                               |
| Source            | `packages/components/src/primitives/button/Button.tsx` |
| Storybook         | `Components/Primitives/Button`                         |
| Status            | Stable                                                 |
| Last synchronized | Release date                                           |

Use Figma Code Connect when available.

Do not map documentation-only frames to production components.

---

# 9. Token export contract

Exact values should be exported from Figma into machine-readable files.

Recommended outputs:

```text
packages/tokens/src/primitives.json
packages/tokens/src/semantic.json
packages/tokens/src/components.json
packages/tokens/src/themes/light.json
packages/tokens/src/themes/dark.json
packages/tokens/dist/tokens.json
packages/tokens/dist/tokens.css
packages/tokens/dist/tokens.ts
```

## Export rules

- Preserve aliases rather than flattening them where the pipeline supports references.
- Preserve mode names.
- Preserve descriptions.
- Preserve variable types.
- Preserve collection names.
- Do not round numeric values without approval.
- Do not manually edit generated output files.
- Generated files must identify their source and generation timestamp.
- Figma exports must be reviewed before publishing.

---

# 10. Incremental synchronization workflow

Use this workflow whenever Figma changes.

```text
Update Figma
    ↓
Publish or approve changes
    ↓
Export changed variables or component specification
    ↓
Document changes in changelog.md
    ↓
Claude Code applies only the documented delta
    ↓
Run validation
    ↓
Review Storybook
    ↓
Commit and publish
```

## Required sequence

1. Make and review the change in Figma.
2. Publish the updated variables, styles, or components when appropriate.
3. Export the affected token collection or provide the exact component node.
4. Record the change in `docs/changelog.md`.
5. Claude Code reads the required Markdown files.
6. Claude Code updates only affected files.
7. Run tests, Storybook, accessibility, and visual comparison.
8. Review the implementation against Figma.
9. Commit and publish after approval.

---

# 11. Change scope rules

Claude Code must use `changelog.md` as the update scope.

Allowed:

- update an affected token
- update components consuming that token
- update affected stories
- update relevant tests
- update relevant documentation
- update generated token output

Not allowed unless explicitly requested:

- regenerate all components
- rewrite the full token architecture
- refactor unrelated code
- rename unrelated tokens
- replace the Storybook structure
- change package APIs
- reformat the entire repository
- infer missing Figma values

---

# 12. Figma inspection protocol

When using the Figma connector, use node-specific URLs whenever possible.

## Foundation inspection

Use the following source nodes:

```text
Design Tokens: 426:4395
Colors: 426:4396
Typography: 428:13769
Scale: 429:14216
Spacing: 511:2
Radius: 511:78
```

## Component inspection

For component implementation or updates, provide the specific component-set URL rather than only the Design Tokens canvas.

A complete component inspection should capture:

- component-set metadata
- properties
- variants
- descendants
- variable bindings
- design context
- screenshot
- Code Connect mapping

## Variable inspection limitation

The Figma variable-definition request for the supplied canvas returned a selection-related error. Therefore:

- exact variable values and aliases must not be inferred from metadata alone
- a direct Figma Variables export or a valid concrete variable-bound node should be used
- unresolved values must be recorded in `changelog.md`
- existing code values must not be overwritten without verification

---

# 13. Validation requirements

Before accepting a Figma-to-code synchronization, verify:

## Figma validation

- [ ] Correct Figma file and node were used.
- [ ] Component or variable changes are published or approved.
- [ ] Variable aliases resolve correctly.
- [ ] Required modes are complete.
- [ ] Component properties are documented.
- [ ] Layers use semantic names.
- [ ] Auto Layout behavior is correct.
- [ ] Accessibility notes are available.
- [ ] Deprecated assets are identified.

## Token validation

- [ ] Token names match `design-tokens.md`.
- [ ] Values match the Figma export.
- [ ] No duplicate tokens were introduced.
- [ ] Semantic tokens alias primitives.
- [ ] Component tokens alias approved sources.
- [ ] Light and Dark mappings are complete.
- [ ] Generated files are current.

## Component validation

- [ ] Figma and code variants match, for every shipped framework package.
- [ ] Sizes match.
- [ ] States match.
- [ ] Typography matches.
- [ ] Spacing and radius match.
- [ ] Focus behavior matches accessibility requirements.
- [ ] Loading and disabled behavior are correct.
- [ ] Long text and localization were tested.

## Storybook validation

- [ ] All changed variants are documented.
- [ ] Controls expose only supported props.
- [ ] Light and Dark themes render correctly.
- [ ] Accessibility checks pass.
- [ ] Visual regression checks pass.
- [ ] Figma links are current.

---

# 14. Review status model

Every Figma source item should use one of these statuses:

```text
Draft
In Review
Approved
Published
Deprecated
Archived
```

Only `Approved` or `Published` items should be treated as production sources.

Draft or review-stage assets must not replace stable production implementation without explicit approval.

---

# 15. Source manifest

Maintain a source manifest in this file or a separate machine-readable file.

Recommended format:

| Domain     | Figma node             | Figma status          | Code status | Storybook status | Last sync    |
| ---------- | ---------------------- | --------------------- | ----------- | ---------------- | ------------ |
| Colors     | `426:4396`             | Review required       | Partial     | Partial          | 2026-07-12   |
| Typography | `428:13769`            | Documented            | Baseline    | Baseline         | 2026-07-12   |
| Scale      | `429:14216`            | Verification required | Pending     | Pending          | 2026-07-12   |
| Spacing    | `511:2`                | Documented            | Baseline    | Baseline         | 2026-07-12   |
| Radius     | `511:78`               | Documented            | Baseline    | Baseline         | 2026-07-12   |
| Buttons    | `1174:1349`             | Published (Light + Dark via Figma variable modes, not separate variant instances; Accent/Link variants declared, not yet authored) | Synced | Synced | 2026-07-24 |

Update this table after each approved synchronization.

---

# 16. Claude Code operating instructions

```markdown
Read:

- `AGENTS.md`
- `docs/figma-source.md`
- `docs/design-tokens.md`
- `docs/component-architecture.md`
- `docs/changelog.md`

Use the published Lumen Figma library as the design source of truth.
Use exported token files as the machine-readable source of exact values.
Use `changelog.md` as the only authorized scope for the current update.

Before changing code:

1. Identify the affected Figma nodes.
2. Identify affected token aliases and consuming components.
3. Inspect the current implementation.
4. Report any missing or ambiguous Figma information.

Then update only affected:

- token source files
- generated token outputs
- themes
- components
- Storybook stories
- tests
- documentation
- package exports

Do not regenerate the design system.
Do not refactor unrelated components.
Do not invent token values, aliases, variants, states, or behavior.
Preserve existing APIs unless a breaking change is explicitly approved.

Run validation and report:

1. Figma nodes used
2. files changed
3. tokens changed
4. components affected
5. tests and builds completed
6. unresolved Figma-to-code differences
```

---

# 17. Required information for future updates

For efficient incremental updates, provide Claude Code with:

```text
1. Exact Figma component or token node URL
2. Short changelog entry
3. Exported token delta, when variables changed
4. Screenshot only when visual comparison is required
5. Expected affected components
6. Whether the change is patch, minor, or major
```

Recommended prompt:

```markdown
Apply the changes under `[Unreleased]` in `docs/changelog.md`.

Figma source:
[insert exact node URL]

Update only the affected tokens, components, Storybook stories, tests, and documentation.
Preserve all unrelated files and APIs.
Do not regenerate the design system.
Run validation and report unresolved differences.
```

---

# 18. Current known limitations

The referenced Design Tokens canvas provides strong structural metadata for Colors, Typography, Scale, Spacing, and Radius.

The following still require direct verification from Figma Variables, Styles, or component-specific nodes:

- exact color values
- color aliases
- variable collection names
- variable modes
- variable scopes
- font families
- font weights
- letter spacing
- scale values
- elevation
- motion
- breakpoint values
- component inventories
- component properties
- Code Connect mappings

These gaps must not be filled through assumption.

**Resolved 2026-07-24:** the Button component-set node was previously pending ("Component URL required"). It is now `1174:1349`, inspected via `get_design_context`/`get_variable_defs` and synced into `packages/tokens/src/{primitives,semantic}/color.json` and the `Button` component — see `docs/changelog.md`'s `[Unreleased]` §Fixed entries and `docs/shadcn-integration.md` §7.8. Both Light and Dark are covered: this node's `Theme` variant property only has `Light` instances built (`get_metadata` confirms all 20 child symbols are `Theme=Light`), but the file resolves dark mode through Figma's variable *mode* system instead — the same bound variables on the same node resolve to different values depending which mode is active, with no separate variant instance required. Don't assume "no `Theme=Dark` symbols" means "no dark data" for other components synced from this file; re-query `get_variable_defs` with the live selection set to the mode you need. `Accent` and `Link` are declared style properties with no built visual states in either mode yet — both remain open gaps for a future sync once Figma authors them.
