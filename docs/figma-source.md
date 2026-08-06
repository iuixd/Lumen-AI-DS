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

- **Node:** `429:14216` (original static frame — still no bound Variables, unchanged legacy reference)
- **Resolved 2026-08-04:** two new frames, `1716:3625` (Radius scale) and `1716:3692` (Typography scale), now carry real live variable bindings — see `docs/figma-sync.md`'s Scale row for the full verification record. All values match `packages/tokens/src/{radius,typography}.json` exactly; no code changes were needed.
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
| Radius     | `511:78`               | Published (`pill` corrected `100`->`999` against a fresh Primitives export; other steps not re-verified in this pass) | Partial | Partial | 2026-08-04 |
| Buttons    | `1174:1349`             | Published (Light + Dark via Figma variable modes, not separate variant instances; real `Theme=Dark` instances also confirmed 2026-08-04 — `neutral`/`neutral-solid`/disabled/`ghost-on-action` corrected against them; base label typography also corrected 2026-08-05 to explicitly request `Instrument Sans` (`font-interface`), and `ghost-on-action` dark corrected again to `primary.50`; Accent/Link variants declared, not yet authored) | Synced | Synced | 2026-08-05 |
| Modal      | `1737:4152`/`1737:4154` | Published (Light only; "Modal"/"Modal Mask" components) | Synced | Synced | 2026-08-05 |
| Badge      | `1079:893`              | Published (Light + Dark; real `Theme=Dark` instances built for the first time 2026-08-04) | Synced | Synced | 2026-08-04 |
| Toast      | `1475:5100`             | Published (Light; Dark resolved via Figma variable modes) | Partially Synced | Partially Synced | 2026-08-04 |
| IconButton | `1565:3815`             | Published (Light + Dark) | Partially Synced | Partially Synced | 2026-08-04 |
| AI Panel   | `1079:3141`             | Published (Light + Dark; real `Theme=Dark` instances built for the first time 2026-08-04) | Synced | Synced | 2026-08-04 |
| Input      | `1262:1181`             | Published (Light + Dark; real `Theme=Dark` instances built for the first time 2026-08-04) | Synced | Synced | 2026-08-04 |
| Radio      | `1278:2153`             | Published (Light + Dark; real `Theme=Dark` instances built for the first time 2026-08-04) | Synced | Synced | 2026-08-05 |
| Checkbox   | `1278:2207`             | Published (Light + Dark; real `Theme=Dark` instances built for the first time 2026-08-05) | Synced | Synced | 2026-08-05 |
| ContentState | `1174:1355`           | Published (Light + Dark; real `Theme=Dark` instances built for the first time 2026-08-05) | Synced | Synced | 2026-08-05 |

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

The referenced Design Tokens canvas provides strong structural metadata for Colors, Typography, Scale, Spacing, Radius, and (as of 2026-08-06) Elevation.

The following still require direct verification from Figma Variables, Styles, or component-specific nodes:

- ~~exact color values~~ — **substantially verified 2026-08-05**, see the dated addenda below. Primitives layer fully re-verified (all 14 hue-ramp base values byte-exact). Real corrections found and fixed: `dark.status.success`/`.warning`, `dark.badge.default-bg`, `dark.border.focus` (repointed twice the same window — see the dated addendum below for the full back-and-forth, settled 2026-08-06 on `deep-purple.300` per a raw Figma token export). A large batch of claimed-missing `input`/`radio-checkbox` tokens were checked and disproven. Two items remain genuinely open, not just unchecked — action items:
  - [ ] **Add `input.primary-icon`.** Confirmed real via `get_variable_defs` on node `1262:1181` (light: `#262626`/`neutral.800`, exact match). Dark value (`nightshade.200`) is user-reported but not yet independently re-verified by pulling a dark-themed Input-with-icon instance directly — do that before implementing, don't take the light-mode confirmation as covering both modes. Add to `semantic/color.json`'s `light.input`/`dark.input` groups, rebuild tokens, then wire into `packages/ui/src/components/internal/input.tsx`'s icon slot — currently unstyled (no dedicated color class; relies on inherited/default text color), so this is a real, visible gap, not a redundant token.
  - [ ] **Resolve the 4 unverified `input/search/*` claims** (`placeholder-text`, `text`, `hover-bg`, `error-border`). Blocked on finding the right node: node `1262:1181`'s directly-listed symbols are all `Type=Bordered` — no distinct `Type=Search` state instances exist there, yet a `get_variable_defs` pull on that same node did surface other `search/*` fields (`bg`, `border`, `hover-border`, `focused-border`, `icon`), meaning the Search variant's states live somewhere else in the aggregate pull's scope. Likely candidate: AppShell's header search field, sourced earlier from a different node (`1127:4196`/`1127:4197` per the AppShell row above) — check there first before searching blind. Do not implement any of the 4 until each is confirmed against a real node; of the 10 claims from this same table that were actually checked, only 1 (`primary/icon`) held up — the other 9 were disproven by direct query. Treat every remaining unverified line as noise until checked, not as likely-true.
- ~~color aliases~~ — **resolved 2026-08-05**: confirmed this repo's token resolver is deliberately single-hop only (semantic → primitive, never semantic → semantic) — see `semantic/color.json`'s `_appShellComment`. A claimed 23-entry "semantic-to-semantic alias" architecture, and a separate `_base/*` intermediary layer, don't apply to this codebase; where Figma's own graph may route through such an intermediary, this repo's build already flattens the same final value directly onto a primitive (confirmed exact for every dark-mode divergence checked: `text/success`, `text/warning`, `icon/nav-default`, `icon/nav-hover`).
- ~~variable collection names~~ — **resolved 2026-08-04** (folded back into this list 2026-08-06; the finding itself predates that date, see `docs/figma-sync.md`'s Colors row): exactly 3 collections exist — `Primitives` (325 vars, single "Default" mode), `Lumen/Theme` (251 vars, Light+Dark modes), `Typography` (260 vars, Desktop/Tablet/Mobile modes). No separate "Gray"/"Foundation"/"Lumen Crimson" collection, confirmed directly against the live file.
- variable modes — still open as a category (see the 2026-08-04/05 dated addendum below: real but scoped to 9 named components, not a system-wide sweep).
- variable scopes — still open; no tool available in this session's Figma MCP surface returns a variable's scope configuration (`get_variable_defs` returns resolved name:value pairs only), so this remains genuinely unauditable without a different method.
- ~~font families~~ — **substantially verified 2026-08-06**: live data confirms Figma's bound families (Instrument Sans for Body/Label, Space Mono for Caption, Source Serif Pro for Heading) match `typography.json`'s `sans`/`interface`/`brand`/`mono`/`editorial` values exactly — see that file's own comment for the reconciliation record. Found and fixed a real bug in the process: `PageHeader.tsx`/`CrudListPage.tsx`/`SettingsPage.tsx` applied the wrong family (`font-interface` or inherited, not `font-editorial`) to heading-scale text. 4 other heading consumers were already correct.
- font weights — partially checked, one real finding NOT yet fixed: Figma's Label/Large-Medium-Small samples are weight 500 (Medium); `label-lg`/`label-md`/`label-sm` in code are weight 600. Not changed — `text-label-*` has 31 consumers across nearly every shadcn-internal primitive (`button`, `select`, `tabs`, `form`, `label`, etc.), several of which layer their own explicit weight override on top (e.g. `label.tsx` adds `font-medium` after `text-label-lg`), so the real effective rendered weight needs per-consumer verification before this shared token can safely change. Left open, flagged rather than bulk-changed.
- letter spacing — spot-checked against the live Typography Scale frame (node `1716:3625`): no explicit tracking on any generic Heading/Body/Label/Caption sample, consistent with code (no `letterSpacing` set on those generic tiers either). No discrepancy found on the generic scale; the file's several one-off tiers with explicit `letterSpacing` (`ai-library-*`, `content-state-title`, `app-button*`, `standard-button-*`) were already independently Figma-sourced in earlier sessions, not re-checked here.
- ~~scale values~~ — **resolved** (already fully verified 2026-08-04 via `docs/figma-sync.md`'s "Scale" manifest row, only just struck through here): both live sample frames (Radius `1716:3692`, Typography `1716:3625` — this row's node IDs were swapped since first written, corrected 2026-08-06) confirmed exact matches against `radius.json`/`typography.json`.
- ~~elevation~~ — **resolved 2026-08-06**: a live "Scale / Elevation (Live)" frame (node `1770:7`, user-supplied URL) gave this repo its first real generic elevation scale — 5 steps, added as `elevation.1`-`elevation.5` in `shadow.json`. Figma's real naming is numeric, not the aspirational `None/Sm/Md/Lg/Xl` `docs/design-tokens.md` §6 previously documented — corrected there too. See `docs/figma-sync.md`'s new Elevation row.
- motion — still open as a category (see the existing Motion manifest row: duration mostly evidenced, `standard`/`enter`/`exit` easing exact matches, `emphasized` easing still genuinely provisional, no Figma curve found for it in any session).
- breakpoint values — still open; no source node located, and no raw export supplied. Not guessed.
- component inventories — still open as a category (real incremental progress on individual components — Modal, Button/Neutral Outline — but no comprehensive full-inventory sweep).
- component properties — still open as a category, same incremental-progress caveat as component inventories.
- ~~Code Connect mappings~~ — **resolved as blocked, 2026-08-06**: not a data gap. `list_file_components_for_code_connect` returns *"You need a Dev or Full seat on an Organization or Enterprise plan to use Code Connect"* — a hard account/plan limitation, not something further Figma auditing can resolve.

These gaps must not be filled through assumption. Items struck through above are resolved to the extent Figma evidence allows — see their own dated addenda for exactly what was checked and what (if anything) remains open; they are not claimed 100% complete where a specific residual gap is called out.

**Resolved 2026-07-24:** the Button component-set node was previously pending ("Component URL required"). It is now `1174:1349`, inspected via `get_design_context`/`get_variable_defs` and synced into `packages/tokens/src/{primitives,semantic}/color.json` and the `Button` component — see `docs/changelog.md`'s `[Unreleased]` §Fixed entries and `docs/shadcn-integration.md` §7.8. Both Light and Dark are covered: this node's `Theme` variant property only has `Light` instances built (`get_metadata` confirms all 20 child symbols are `Theme=Light`), but the file resolves dark mode through Figma's variable *mode* system instead — the same bound variables on the same node resolve to different values depending which mode is active, with no separate variant instance required. Don't assume "no `Theme=Dark` symbols" means "no dark data" for other components synced from this file; re-query `get_variable_defs` with the live selection set to the mode you need. `Accent` and `Link` are declared style properties with no built visual states in either mode yet — both remain open gaps for a future sync once Figma authors them. **2026-08-06 addendum**: this node now has 28 state symbols, not the original 20 — `Neutral Outline` (added 2026-07-31) and `Neutral Solid` (added 2026-08-04) extended the component set after this entry was first written. Same day, the user reported and fixed a Figma-side authoring bug affecting 3 of 4 `Neutral Outline` states (Disabled/Focused/Hover misbound to the Secondary variant's border token); re-verified live via `get_variable_defs` on all 4 state symbols and corrected in `@lumen/ui` — see `docs/changelog.md`'s `[Unreleased]` §Fixed entry and `semantic/color.json`'s `_neutralOutlineBorderComment`. `@lumen/web-components`/`@lumen/angular` have no plain `neutral` (outline) variant to sync — out of scope for both, documented in their own Button source comments.

**Resolved 2026-08-04 through 2026-08-05:** the "variable modes"/"component properties" dark-mode gap flagged above is now closed for nine components. Figma began publishing genuine `Theme=Dark` sibling component instances (not just mode-resolution on a Light-only node, the mechanism the Button entry above documents) for Badge (`1079:893`), Toast (`1475:5100`, resolved via variable modes rather than separate instances), IconButton (`1565:3815`), AI Panel (`1079:3141`), Input (`1262:1181`), Radio (`1278:2153`), Checkbox (`1278:2207`), and ContentState (`1174:1355`) — plus a further, real `Theme=Dark` publish for Button (`1174:1349`) itself, extending the 2026-07-24 entry above (`neutral`/`neutral-solid`'s dark treatment inverts light's mirrored guess; disabled-state and `ghost-on-action` corrected). Every one of these had previously shipped with unverified, ramp-mirrored, or otherwise provisional dark values; each is now corrected against real Figma dark data, with full per-field before/after records in `docs/figma-sync.md`'s manifest and `docs/changelog.md`'s `[Unreleased]` §Fixed entries — this file intentionally doesn't duplicate that level of detail. Radius's `pill` step (`511:78`) was also corrected `100`→`999` against a fresh Primitives export in the same window; the rest of the Radius scale was not independently re-verified in this pass, so `511:78` remains flagged in the manifest above rather than marked fully synced. Don't infer "no dark data exists" for any component from an absence of visible `Theme=Dark` symbols in an older `get_metadata` pull — Figma has been adding real dark instances incrementally across this file; always re-query before assuming a gap documented here is still open.

**Progress 2026-08-05, "exact color values" item specifically** (a structured, one-by-one audit of this section's own list, per direct user request — see the user-supplied token/alias tables cross-checked against live `get_variable_defs` pulls throughout): primitives layer independently re-verified clean (all 14 hue-ramp base/500 values byte-exact against `primitives/color.json`). Semantic layer: confirmed this repo's resolver is genuinely single-hop only (semantic → primitive, never semantic → semantic) — a deliberate, already-documented design choice (see `semantic/color.json`'s `_appShellComment`), not a gap; a user-supplied "23 semantic-to-semantic alias" table describing a different, multi-hop architecture doesn't apply to this codebase. Real corrections found and fixed: `dark.status.success`/`dark.status.warning` (generic, multi-consumer tokens) were unverified ramp-mirror guesses (`green.300`/`orange.300`) — real values are `status.green`/`status.amber`, already independently confirmed this session for Toast's own scoped accents, now confirmed for the generic role too. `dark.badge.default-bg` — claimed exact in the 2026-08-04 Badge dark-mode pass — was actually still wrong (`app-shell.dark.border` vs. the real `teal.900`), a miss in that original 10-field sweep, caught here via direct user Figma re-check. See `semantic/color.json`'s `_statusDarkModeComment` and `_badgeDarkModeComment` addendum for the full record. One real, previously-uncaptured token identified but **not yet implemented, pending explicit scope confirmation**: `input/primary/icon` (`neutral.800` light, `nightshade.200` dark per the user's table, light value independently confirmed via `get_variable_defs` on node `1262:1181`) — no `input.primary-icon` semantic token exists in code today. **Resolved same day, immediate follow-up, then reversed 2026-08-06**: the `dark.border.focus`/`accent.purple` conflict noted above was first closed by repointing to `primary.200` and deleting the `accent` primitive family, on the strength of a user report that no `stroke/focus` variable exists in Figma and that `Accent/Purple` had been deleted. That report turned out to be mistaken. A complete raw W3C-format export of Figma's live `Dark.tokens.json`/`Light.tokens.json` collections (explicit `com.figma.aliasData.targetVariableName` alias chains, not a summary), corroborated by a Variables-panel screenshot, shows `stroke.focus` dark mode is a real, current alias to `_base/Accent/Purple` (Light=Deep Purple/400, Dark=Deep Purple/300, #9E86D0). `dark.border.focus` is now repointed to the existing `deep-purple.300` primitive (#9E86D0); no `accent` primitive family reintroduced, since `_base/Accent/Purple` is just Figma-side naming for the same ramp step. `light.border.focus` (`primary.500`) unchanged throughout. See `docs/figma-sync.md`'s Colors row and `semantic/color.json`'s `_borderFocusComment` for the full record. A large batch of `input/radio-checkbox/*` and `input/search/*` variable claims from the same user-supplied table (border, hover-border, focused-border, error-border, text, icon, placeholder-text under `radio-checkbox`) were directly disproven via live `get_variable_defs` pulls on Checkbox's own state nodes — none of those bindings exist; Checkbox/Radio simply reuse `input/primary/*` directly, exactly as this repo's code already does.

**Resolved 2026-08-05, separately:** the "component inventories" gap is now closed for one more component — Figma's canonical "Modal" (`1737:4152`, plus "Modal Mask" `1737:4154` for the overlay), previously unaudited entirely. Turned out to already be implemented — the shadcn/Radix `Dialog` component was already rendering this exact title+description+separator+actions structure (`DataExtractionOnboardingPage`'s "Remove file?" confirmation is Figma's own example content for this component, byte-for-byte) — so this was a chrome-correction pass (radius, shadow, overlay color, typography, footer separator) against `Dialog`, not a from-scratch build; a pre-existing, unrelated, zero-consumer `Modal` composite was retired rather than kept as a duplicate. See `docs/figma-sync.md`'s new Modal row for the full field-by-field record, including two same-day follow-up corrections (a repo-wide missing-`font-interface` bug affecting both `Dialog` and `Button` text, and a `Button`/`Modal` dark-mode color correction) found via direct user reports after the initial sync rendered.
