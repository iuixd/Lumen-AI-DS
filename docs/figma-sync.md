# Lumen Figma Sync

> Synchronization contract for keeping the **Lumen AI Design System** aligned across Figma, design-token source files, generated code, framework packages (React today), Storybook, tests, and release documentation.

## Source

- **Figma file:** Lumen AI Design System
- **File key:** `GJBYRm6ySR7XIECFcHMgy2`
- **Design Tokens node:** `426:4395`
- **Dev Mode URL:** https://www.figma.com/design/GJBYRm6ySR7XIECFcHMgy2/Lumen-AI-Design-System?node-id=426-4395&m=dev
- **Local Storybook:** http://localhost:6006/?path=/docs/introduction--docs
- **Last reviewed:** 2026-07-16

## Related documents

```text
CLAUDE.md
AGENTS.md
docs/project-governance.md
docs/figma-source.md
docs/figma-sync.md
docs/design-tokens.md
docs/component-architecture.md
docs/component-specifications.md
docs/accessibility.md
docs/storybook-guidelines.md
docs/development-guidelines.md
docs/quality-checklist.md
docs/design-review.md
docs/release-process.md
docs/roadmap.md
docs/changelog.md
```

---

# 1. Purpose

This document defines how approved Figma changes are synchronized into the Lumen codebase without regenerating or rewriting unrelated parts of the design system.

The synchronization process must:

- preserve Figma-to-code traceability
- update only affected tokens and components
- maintain semantic token relationships
- preserve public APIs
- keep Storybook current
- include accessibility and test updates
- record every approved delta
- prevent silent drift between Figma and implementation

---

# 2. Source-of-truth hierarchy

Use this authority order:

```text
Approved and Published Figma Variables and Components
    ↓
Approved component-specific Dev Mode specification
    ↓
Machine-readable token export
    ↓
Repository token source files
    ↓
Generated token outputs
    ↓
Framework packages (React today; Angular, Vue, and Web Components as they ship —
    ↓                see `docs/component-architecture.md` §0)
Storybook
    ↓
Consuming applications
```

## Conflict rules

When sources differ:

1. Approved and published Figma assets define visual intent.
2. Machine-readable exports define exact token values, aliases, and modes.
3. Component specifications define interaction, behavior, and accessibility.
4. `changelog.md` defines the authorized synchronization scope.
5. Existing implementation remains unchanged when Figma evidence is incomplete.
6. Missing values or behavior must be reported, not inferred.
7. Accessibility behavior must not be removed merely to match a visual frame.

---

# 3. Current Figma source map

The supplied Design Tokens node contains:

| Section    | Node ID     | Current sync role                   |
| ---------- | ----------- | ----------------------------------- |
| Colors     | `426:4396`  | Palette and color reference         |
| Typography | `428:13769` | Type scale and text-style reference |
| Scale      | `429:14216` | General scale reference             |
| Spacing    | `511:2`     | Confirmed spacing-token reference   |
| Radius     | `511:78`    | Confirmed radius-token reference    |

## Confirmed spacing values

```text
0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 28, 32,
40, 48, 56, 64, 80, 96, 128
```

## Confirmed radius values

```text
none = 0px
xs = 2px
sm = 4px
md = 6px
lg = 8px
xl = 12px
2xl = 16px
3xl = 24px
full = infinite / pill
```

## Confirmed typography sizes and line heights

```text
H1 = 60 / 72
H2 = 50 / 60
H3 = 40 / 50
H4 = 32 / 42
H5 = 24 / 32
H6 = 20 / 28

Body lg = 20 / 32
Body md = 16 / 26
Body sm = 14 / 22
Body xs = 12 / 20

Label lg = 14 / 20
Label md = 12 / 18
Label sm = 11 / 16

Overline = 11 / 16
Caption = 11 / 18

Code md = 14 / 22
Code sm = 12 / 20
```

Exact color variables, aliases, modes, font families, weights, letter spacing, scale values, and component properties require direct variable or component-level evidence.

---

# 4. Sync direction

Lumen supports two controlled sync directions.

## Figma to code

Use when:

- token values or aliases change
- a component is added or updated
- a variant or state is introduced
- a theme mapping changes
- typography or layout foundations change
- Storybook must reflect an approved design update

## Code to Figma

Use only when:

- implementation reveals a documented design constraint
- Code Connect mappings need correction
- a production component exposes a missing Figma property
- a proven accessibility or responsive behavior must be represented in Figma
- the design-system team approves the update

Code-to-Figma synchronization must not overwrite design intent automatically.

---

# 5. Synchronization unit

The smallest approved change is the synchronization unit.

A synchronization unit may be:

```text
One token
One token group
One semantic alias
One component state
One component variant
One component size
One component API mapping
One Storybook story
One accessibility correction
One documentation update
```

Do not use a page, package, or entire design system as the default synchronization unit.

---

# 6. Required sync inputs

Every synchronization request should include:

```text
Exact Figma node URL
Change summary
Changelog entry
Affected tokens
Affected components
Expected code impact
Expected Storybook impact
Accessibility impact
Release type
```

Recommended request format:

```markdown
## Figma sync request

- Figma source:
- Change summary:
- Changelog section:
- Affected tokens:
- Affected components:
- Expected stories:
- Accessibility impact:
- API impact:
- Release type:
- Known open questions:
```

---

# 7. Sync workflow

```text
1. Read changelog scope
2. Validate Figma source
3. Extract or export delta
4. Compare with repository source
5. Produce impact report
6. Apply approved changes
7. Regenerate affected outputs
8. Update affected components
9. Update Storybook and tests
10. Validate parity
11. Record sync result
12. Release through normal process
```

---

# 8. Stage 1: Read the authorized scope

Before modifying files:

- read `[Unreleased]` in `docs/changelog.md`
- identify the exact intended delta
- identify directly affected dependencies
- reject unrelated changes
- report any missing source evidence

No implementation should begin without a clear synchronization scope.

---

# 9. Stage 2: Validate the Figma source

Confirm:

- [ ] Correct file key is used.
- [ ] Correct node ID is used.
- [ ] The asset is Approved or Published.
- [ ] The node is not a detached duplicate.
- [ ] Variable or component changes are final.
- [ ] Required modes are published.
- [ ] Component descriptions are current.
- [ ] Deprecated assets are marked.
- [ ] Component-specific URLs are used for component work.

A foundation-level URL is insufficient for implementing a complete component.

---

# 10. Stage 3: Extract the delta

## Tokens

Preferred evidence:

```text
Figma Variables export
Variables API output
Approved JSON token export
Verified plugin export
```

Capture:

- collection
- variable name
- variable type
- mode
- value
- alias target
- scope
- description
- previous value
- new value

## Components

Capture:

- component-set node ID
- properties
- variant options
- layer anatomy
- token bindings
- dimensions
- Auto Layout behavior
- supported states
- accessibility annotations
- Code Connect mapping

## Do not infer

Do not infer exact values from:

- swatch appearance
- screenshots
- approximate dimensions
- layer names alone
- visual similarity
- existing code when Figma is intended to change

---

# 11. Stage 4: Compare with repository source

Compare the Figma delta with:

```text
Token source files
Generated token files
Theme files
Component source
Type definitions
Package exports
Storybook stories
Tests
Documentation
Code Connect mappings
```

## Required impact report

Before edits, report:

```markdown
## Sync impact

- Figma nodes:
- Tokens added:
- Tokens changed:
- Tokens removed:
- Aliases changed:
- Modes affected:
- Components affected:
- Public APIs affected:
- Stories affected:
- Tests affected:
- Generated files affected:
- Release impact:
- Unresolved differences:
```

---

# 12. Token synchronization rules

## Layering

Preserve:

```text
Primitive
    ↓
Semantic
    ↓
Component
```

## Rules

- Preserve semantic aliases.
- Do not replace aliases with raw values unless required by the build pipeline.
- Do not create duplicate tokens for the same intent.
- Do not rename tokens silently.
- Do not remove tokens without migration guidance.
- Validate every supported mode.
- Do not manually edit generated outputs.
- Regenerate only affected outputs where the tooling supports scoped generation.
- Review all downstream consumers of changed semantic tokens.

## Example

```text
Color/Blue/600
    ↓
Color/Action/Primary/Default
    ↓
Button/Primary/Background/Default
```

A primitive change may affect many consumers. A component-token change should remain narrowly scoped.

---

# 13. Component synchronization rules

For each changed component:

- update only the approved properties, variants, states, or dimensions
- preserve existing public APIs unless a breaking change is approved
- map Figma variant names to semantic code values
- keep unsupported combinations unavailable
- preserve native semantics
- update accessibility behavior where required
- update only affected stories and tests
- record intentional Figma-to-code differences

## Component sync matrix

The right column is framework-neutral; it names each shipped framework package's implementation, not a single canonical one. Today the only shipped framework package is React (`@lumen/ui`).

| Figma                 | Code (React reference implementation today) |
| --------------------- | ------------------------------------------- |
| Component set         | Component                                   |
| Variant property      | Typed variant property                      |
| Boolean property      | Boolean property                            |
| Text property         | Content property or children/slot           |
| Instance swap         | Icon or slot property                       |
| Auto Layout           | Flexible CSS layout                         |
| Variable binding      | CSS custom property or token reference      |
| Component description | Storybook and API documentation             |

---

# 14. Storybook synchronization

Local reference:

```text
http://localhost:6006/?path=/docs/introduction--docs
```

For every affected token or component:

- update documentation
- update controls
- update examples
- update token references
- update accessibility notes
- update change history
- update visual-regression coverage

## Customized UI protection

Synchronization must preserve:

- Lumen branding
- customized manager theme
- dark background consistency
- navigation hierarchy
- Docs layout
- typography hierarchy
- improved discovery behavior
- brand-aligned spacing and styling

Do not reset Storybook to the default UI during upgrades or synchronization.

---

# 15. Accessibility synchronization

Read:

```text
docs/accessibility.md
```

Every sync must evaluate:

- contrast
- semantic role
- accessible name
- keyboard interaction
- focus behavior
- status announcements
- target size
- zoom and reflow
- reduced motion
- screen-reader impact

Accessibility changes must be synchronized across:

```text
Figma annotations
Component specification
Code implementation
Storybook documentation
Tests
Changelog
```

---

# 16. Code Connect synchronization

For every Stable component, maintain:

```text
Figma node ID
Code component name
Source path
Framework label
Property mapping
Last synchronized date
```

## Rules

- Do not map documentation frames to production components.
- Use component-specific node IDs.
- Keep mappings aligned with public APIs.
- Review mappings after prop or variant changes.
- Track unmapped Stable components.
- Treat Code Connect as traceability, not a replacement for tests.

---

# 17. Sync status model

Use:

```text
Not Synced
Figma Ahead
Code Ahead
Partially Synced
Blocked
In Review
Synced
Deprecated
```

## Definitions

### Figma Ahead

Approved Figma changes are not yet implemented.

### Code Ahead

Implementation contains approved behavior not yet represented in Figma.

### Partially Synced

Some but not all required artifacts are aligned.

### Blocked

Required source evidence or approval is missing.

### Synced

Figma, token source, generated outputs, code, Storybook, tests, and documentation agree within documented exceptions.

---

# 18. Source manifest

Maintain a synchronization manifest.

| Domain                     | Figma node                                                                                                   | Code source                                                                                                                                                               | Storybook                                                                                                   | Status                                                                                                                                                                                                                                                                                                                                                                 | Last sync    |
| -------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| Colors                     | `426:4396`                                                                                                   | Token source required                                                                                                                                                     | Foundation page required                                                                                    | Partially Synced                                                                                                                                                                                                                                                                                                                                                       | 2026-07-12   |
| Typography                 | `428:13769`                                                                                                  | Token source required                                                                                                                                                     | Foundation page required                                                                                    | Partially Synced                                                                                                                                                                                                                                                                                                                                                       | 2026-07-12   |
| Scale                      | `429:14216`                                                                                                  | Verification required                                                                                                                                                     | Foundation page required                                                                                    | Blocked                                                                                                                                                                                                                                                                                                                                                                | 2026-07-12   |
| Spacing                    | `511:2`                                                                                                      | Token source required                                                                                                                                                     | Foundation page required                                                                                    | Partially Synced                                                                                                                                                                                                                                                                                                                                                       | 2026-07-12   |
| Radius                     | `511:78`                                                                                                     | Token source required                                                                                                                                                     | Foundation page required                                                                                    | Partially Synced                                                                                                                                                                                                                                                                                                                                                       | 2026-07-12   |
| Button                     | `1027:3733` (collection frame `1174:1349`)                                                                   | `packages/ui/src/primitives/Button.tsx`, `packages/web-components/src/button/lumen-button.ts`, `packages/angular/src/button/lumen-button.ts`                              | `Primitives/Button` (`FinalVariantCollection`)                                                              | Synced — final seven variants, standardized 34px geometry, and exact light/dark Default/Hover/Focused/Disabled roles; former node `475:7210` collection superseded                                                                                                                                                                                                     | 2026-07-20   |
| Input                      | `1262:1181`                                                                                                  | `packages/ui/src/primitives/Input.tsx`                                                                                                                                    | `Primitives/Input` (`VariantCollection`)                                                                    | Partially Synced — updated lg typography, exact size-specific border weights, sm/md/lg geometry, Default/Hover/Focused/Error roles, and search anatomy are bound; dark aliases are provisional because Figma publishes no dark Input mode; React is the current reference implementation                                                                               | 2026-07-21   |
| Radio                      | `1278:2153`                                                                                                  | `packages/ui/src/primitives/Radio.tsx`                                                                                                                                    | `Primitives/Radio` (`VariantCollection`)                                                                    | Partially Synced — exact sm/md/lg targets and indicators plus Default/Hover/Focused/Selected/Disabled/Error roles are token-bound; dark aliases are provisional because Figma publishes no dark Radio mode; React is the current reference implementation                                                                                                              | 2026-07-21   |
| Checkbox                   | `1278:2207`                                                                                                  | `packages/ui/src/primitives/Checkbox.tsx`, `packages/ui/src/icons/generated/CheckIcon.tsx`, `packages/ui/src/assets/input-checkbox-indeterminate.svg`                     | `Primitives/Checkbox` (`VariantCollection`)                                                                 | Partially Synced — exact sm/md/lg targets, indicators, shared CheckIcon checked glyph with exact bold Figma bounds/strokes, exact indeterminate glyph, and Default/Hover/Focused/Checked/Disabled/Error/Indeterminate roles are token-bound; dark aliases are provisional because Figma publishes no dark Checkbox mode; React is the current reference implementation | 2026-07-21   |
| Split Button               | `555:300`                                                                                                    | `packages/ui/src/composite/SplitButton.tsx`                                                                                                                               | `Composite/SplitButton`                                                                                     | Partially Synced — sm dropdown segment squared to 36px vs. Figma's 30px, see `docs/component-specifications.md` §43; corner radius (6px→8px) resolved 2026-07-16                                                                                                                                                                                                       | 2026-07-16   |
| Filter Chip                | `581:409`                                                                                                    | `packages/ui/src/primitives/FilterChip.tsx`                                                                                                                               | `Primitives/FilterChip`                                                                                     | Synced                                                                                                                                                                                                                                                                                                                                                                 | 2026-07-14   |
| Choice Chip                | `581:485`                                                                                                    | `packages/ui/src/primitives/ChoiceChip.tsx`                                                                                                                               | `Primitives/ChoiceChip`                                                                                     | Partially Synced — Hover/Focus/Disabled inferred from Filter Chip's identical tokens, not independently sourced per state; `tone`/`icon` (2026-07-16) independently confirmed                                                                                                                                                                                          | 2026-07-16   |
| AI Button                  | `760:1965`                                                                                                   | `packages/ui/src/primitives/AIButton.tsx`                                                                                                                                 | `AI Components/AI Button`                                                                                   | Partially Synced — React implements raised/link/status; Web Components and Angular retain the four-variant baseline without status; exact xs height remains 32px vs. Figma's 28px; specialized API remains independent of final standard Button node `1027:3733`                                                                                                       | 2026-07-20   |
| Segmented Control          | `958:5058`, `958:5090`                                                                                       | `packages/ui/src/primitives/SegmentedControl.tsx`                                                                                                                         | `Primitives/SegmentedControl`                                                                               | Partially Synced — `sm`/`md`/`lg` per-size padding and type independently verified 2026-07-16 against the "Size Rows" example; `lg` height rounded 44→48px and container padding rounded 3→4px remain (both off the confirmed spacing scale, no visible-difference risk)                                                                                               | 2026-07-16   |
| Toggle Group               | `969:5151`                                                                                                   | `packages/ui/src/primitives/ChoiceChip.tsx` (`tone="subtle"`)                                                                                                             | `Primitives/ChoiceChip` (`ToggleGroup` story)                                                               | Synced — workspace-summary caption added 2026-07-16                                                                                                                                                                                                                                                                                                                    | 2026-07-16   |
| Split Button AI            | `969:5761`                                                                                                   | `packages/ui/src/composite/SplitButton.stories.tsx` (composition only, no new component/variant)                                                                          | `Composite/SplitButton` (`AI` story)                                                                        | Synced — expanded to all 3 Figma examples with full menu keyboard/hover interaction 2026-07-16                                                                                                                                                                                                                                                                         | 2026-07-16   |
| KPICard                    | `1007:3700` canonical `1119:3343`-`45`, verified in all six breakpoint/theme compositions                    | `packages/ui/src/primitives/KPICard.tsx`, `packages/web-components/src/kpi-card/lumen-kpi-card.ts`, `packages/angular/src/kpi-card/lumen-kpi-card.ts`                     | `Primitives/KPICard`; composed in `Layout/AppShell`                                                         | Synced for AppShell — exact AppShell label/value typography and light/dark status surfaces are token-bound; React/WC/Angular standalone parity remains tracked separately                                                                                                                                                                                              | 2026-07-20   |
| Theme Toggle               | `1007:3700` (`1127:4196`, `1127:4197`, `1175:2521`, `1175:2522`)                                             | `packages/ui/src/primitives/ThemeToggle.tsx`, `packages/web-components/src/theme-toggle/lumen-theme-toggle.ts`, `packages/angular/src/theme-toggle/lumen-theme-toggle.ts` | `Primitives/ThemeToggle`; composed in `Layout/AppShell`                                                     | Synced for AppShell — exact 54px track, checked travel, and light/dark token binding                                                                                                                                                                                                                                                                                   | 2026-07-20   |
| Page Header                | `1007:3700` canonical `1119:3341`, verified in desktop/tablet compositions                                   | `packages/ui/src/composite/PageHeader.tsx`                                                                                                                                | `Composite/PageHeader`; composed in `Layout/AppShell`                                                       | Synced for AppShell — exact breadcrumb/title/body typography and semantic colors; React only, no cross-framework equivalent expected                                                                                                                                                                                                                                   | 2026-07-20   |
| Footer                     | `1007:3700` canonical `1119:3352`, re-verified against example `1197:1652` (`1102:6529`)                     | `packages/ui/src/layout/Footer.tsx`, `packages/web-components/src/footer/lumen-footer.ts`, `packages/angular/src/footer/lumen-footer.ts`                                  | `Layout/Footer` (React only — WC/Angular not covered)                                                       | Synced — link color corrected gray→blue (`text.link-subtle`) against the canonical instance; React/WC/Angular parity complete; Angular's projected links are unstyled by default (no non-deprecated `::slotted` equivalent), documented known gap                                                                                                                      | 2026-07-20   |
| AppShell (responsive)      | `1007:3700`; desktop `1127:4196`/`1127:4197`, tablet `1175:2521`/`1175:2522`, mobile `1175:2588`/`1175:2589` | `packages/ui/src/layout/AppShell.tsx`                                                                                                                                     | `Layout/AppShell` (`DesktopLight`, `DesktopDark`, `TabletLight`, `TabletDark`, `MobileLight`, `MobileDark`) | Synced — desktop ≥1024px uses 224px sidebar (or opt-in 64px rail), 52px header, 304px assistant and 36px footer; tablet 768–1023px uses 64px rail and 72px header; mobile <768px uses status/app headers and 74px bottom navigation. Both themes are bound to the AppShell semantic token group.                                                                       | 2026-07-20   |
| AI Panel                   | `1007:3700` (`1079:3141`, light instance `1119:3351`, desktop compositions `1127:4196`/`1127:4197`)          | `packages/ui/src/composite/AIPanel.tsx`                                                                                                                                   | `Composite/AIPanel`; composed in `Layout/AppShell`                                                          | Synced — exact 304px structure, theme tokens, and exported `lm-ai-outline` glyph; inline actions now compose the final standard secondary Button from node `1027:3733`; live-region behavior covered structurally, React only                                                                                                                                          | 2026-07-20   |
| DashboardPage (reconciled) | `1197:1652` (body composition)                                                                               | `packages/patterns/src/DashboardPage.tsx`                                                                                                                                 | `Patterns/DashboardPage` (`RenewalPipeline` story)                                                          | Synced — composes PageHeader/KPICard/DataTable/Badge, no new component needed for the table                                                                                                                                                                                                                                                                            | 2026-07-20   |
| Avatar (`tone="neutral"`)  | `1197:1652` (`I1102:6515;1079:1889`)                                                                         | `packages/ui/src/primitives/Avatar.tsx`                                                                                                                                   | `Primitives/Avatar` (`Tones` story)                                                                         | Synced — additive, existing `tone="brand"` unchanged                                                                                                                                                                                                                                                                                                                   | 2026-07-20   |
| Other components           | Component nodes required                                                                                     | Component package                                                                                                                                                         | Component stories                                                                                           | Not Synced                                                                                                                                                                                                                                                                                                                                                             | Not verified |

Update this manifest only with evidence.

---

# 19. Drift detection

Drift exists when Figma and implementation differ without an approved exception.

## Types of drift

```text
Value drift
Alias drift
Naming drift
Mode drift
Variant drift
State drift
Dimension drift
Behavior drift
Accessibility drift
Documentation drift
Code Connect drift
```

## Detection methods

- token-file comparison
- generated-output checks
- visual regression
- Storybook review
- Code Connect inspection
- component API comparison
- accessibility tests
- manual design review

## Drift response

1. Classify severity.
2. Identify the authoritative source.
3. Record the issue.
4. Apply the smallest correction.
5. Re-run validation.
6. Update the sync manifest.

---

# 20. Breaking sync changes

A synchronization is breaking when it changes:

- public token names
- public component props
- package exports
- default behavior
- semantic meaning
- theme contracts
- supported variants
- accessibility interaction model

Breaking changes require:

- Major version
- migration guide
- deprecation plan where practical
- release approval
- Storybook notice
- changelog entry
- consumer communication

---

# 21. Validation

## Tokens

- [ ] Names match.
- [ ] Values match.
- [ ] Aliases match.
- [ ] Modes match.
- [ ] No alias cycles exist.
- [ ] Generated files are current.
- [ ] No unrelated token changed.

## Components

- [ ] Anatomy matches.
- [ ] Variants match.
- [ ] Sizes match.
- [ ] States match.
- [ ] Token usage matches.
- [ ] Responsive behavior matches.
- [ ] Public API remains valid.
- [ ] Accessibility is preserved.

## Storybook

- [ ] Changed stories render.
- [ ] Controls match supported props.
- [ ] Light and Dark themes work.
- [ ] Customized UI remains intact.
- [ ] No new console errors exist.
- [ ] Visual differences are approved.

## Code

- [ ] Lint passes.
- [ ] Type checking passes.
- [ ] Unit tests pass.
- [ ] Accessibility tests pass.
- [ ] Production build passes.
- [ ] Storybook build passes.

---

# 22. Sync record template

```markdown
# Figma Sync Record

## Summary

- Date:
- Figma source:
- Figma status:
- Changelog:
- Reviewer:
- Implementer:

## Delta

- Tokens added:
- Tokens changed:
- Tokens deprecated:
- Components changed:
- Stories changed:
- Tests changed:

## Validation

- Token validation:
- Type checking:
- Unit tests:
- Accessibility tests:
- Storybook build:
- Visual review:
- Figma parity:

## Exceptions

## Unresolved differences

## Status

Not Synced | Figma Ahead | Code Ahead | Partially Synced | Blocked | In Review | Synced
```

---

# 23. Claude Code synchronization protocol

Before synchronization, Claude Code must read:

```text
CLAUDE.md
AGENTS.md
docs/figma-source.md
docs/figma-sync.md
docs/design-tokens.md
docs/component-architecture.md
docs/component-specifications.md
docs/accessibility.md
docs/storybook-guidelines.md
docs/development-guidelines.md
docs/quality-checklist.md
docs/design-review.md
docs/release-process.md
docs/changelog.md
```

## Audit pass

Claude Code must first:

1. Read `[Unreleased]`.
2. Inspect the exact Figma nodes.
3. Inspect existing token and component source.
4. Identify downstream consumers.
5. Report the synchronization impact.
6. Report unresolved Figma evidence.
7. Make no changes during the audit pass.

## Implementation pass

After approval:

1. Apply only the approved delta.
2. Update affected token source.
3. Regenerate affected outputs.
4. Update affected components.
5. Update affected stories, tests, and documentation.
6. Preserve unrelated files and public APIs.
7. Run available validation.
8. Update the sync record and changelog.
9. Report remaining drift.

## Reusable prompt

```markdown
Read:

- `docs/figma-source.md`
- `docs/figma-sync.md`
- `docs/design-tokens.md`
- `docs/component-architecture.md`
- `docs/component-specifications.md`
- `docs/accessibility.md`
- `docs/storybook-guidelines.md`
- `docs/development-guidelines.md`
- `docs/quality-checklist.md`
- `docs/design-review.md`
- `docs/release-process.md`
- `docs/changelog.md`

Synchronize only the changes listed under `[Unreleased]`.

First perform an audit without modifying files.

Report:

1. Figma nodes inspected
2. tokens added, changed, removed, or aliased
3. affected components
4. affected Storybook stories
5. affected tests and generated outputs
6. public API impact
7. accessibility impact
8. unresolved Figma evidence
9. proposed minimal file changes

After approval, apply only the approved delta.

Do not:

- regenerate the entire design system
- refactor unrelated files
- invent missing values
- flatten semantic aliases unnecessarily
- remove accessibility behavior
- reset customized Storybook UI
- publish packages or deploy Storybook without explicit instruction

Run available lint, type-check, tests, accessibility checks, production build, Storybook build, and visual-regression checks.

Return one sync status:

- Synced
- Partially Synced
- Blocked
```

---

# 24. Current connector status

The Figma metadata request succeeded for node `426:4395`.

The Figma variable-definition request returns `"You currently have nothing
selected"` when scoped to the top-level Design Tokens canvas node
(`426:4395`) — that error is about node scope, not a live selection
requirement. Scoped to a specific child frame (e.g. `426:4396`), it returns
real bound variables. See `docs/project-governance.md` §17 for the verified
per-section variable counts and the corrected query procedure.

Therefore:

- the current page structure is verified
- spacing, radius, and visible typography values are documented
- exact variable definitions are verified for the Colors and Typography
  section frames (see §17); Scale, Spacing, and Radius have no bound
  variables in the supplied node
- exact color values, aliases, modes, scopes, font metadata, and scale values
  beyond what §17 lists must not be inferred
- component synchronization requires component-specific Dev Mode URLs
- exact machine-readable token synchronization for Scale/Spacing/Radius
  remains blocked until a valid export or variable-bound node is available

---

## Latest published role delta (2026-07-20)

The `Lumen/Theme` collection now includes `text/brand`, `icon/brand`,
`stroke/brand`, and `btn/disabled/{bg,border,text}`. Code publishes all six
roles. The disabled roles are bound across the React, Web Components, and
Angular Button, AIButton, and SplitButton implementations. The three brand
roles currently have no bound component instance in the Figma file; they
remain exported and unconsumed until a component-specific binding establishes
their intended scope.

# 25. Variable synchronization

The Variable-specific policy (when to read Variables, what to compare
against, the report/recommend/confirm sequence, what never to infer) lives
in `docs/project-governance.md` §17 — read it rather than a copy here. What
this section adds is specific to this document's own Stage 1-11 sync
procedure above: a Variable-triggered sync still goes through those same
stages (read `[Unreleased]` → validate source → extract delta → compare →
report → implement → validate → record), with the delta in Stage 3 coming
from `get_variable_defs` results instead of canvas-label reading, scoped
per §24's corrected node guidance.
