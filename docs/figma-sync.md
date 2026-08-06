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

| Domain                     | Figma node                                                                                                       | Code source                                                                                                                                                               | Storybook                                                                                                   | Status                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Last sync    |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------ |
| Colors                     | `426:4396`; full Variables export (Primitives/Default collection, no single node — see note below)              | `packages/tokens/src/primitives/color.json`                                                                                                                                     | `Foundations` (added 2026-08-02)                                                                             | Partially Synced — 2026-08-02: a fresh full Variables export closed the long-open `blue`/`status.info` gap (added a full `blue` ramp, 50-950, matching the export's real `Blue` family exactly; `status.info` now aliases `blue.500` in both themes) and added 900/950 tail steps to nearly every existing ramp plus two new families (`lumen-dark`, `nightshade`) backing most of the Dark theme. Two alpha-tint primitives were corrected (`primary.500-a10`→`500-a8`, `primary.300-a24`→`300-a20`). The pre-existing "Gray"/"Foundation"/"Lumen Crimson" duplicate-collection naming question remains open. **Actually already resolved, long before this note was written — this row just never got updated to say so**: `docs/changelog.md` (search `Resolved the Gray/Foundation vs. Neutral and Lumen Crimson vs. Primary naming collisions`) records that `Gray`/`Foundation`/`Lumen Crimson` were retired from Figma and the surviving `Neutral`/`Primary` Variables already matched `packages/tokens/src/primitives/color.json` step-for-step, zero drift — a genuine Figma-side cleanup, re-verified at the time via `get_variable_defs`. **Independently reconfirmed 2026-08-04** (direct user check against the live Figma file, prompted by this row still reading "open"): there are exactly 3 variable collections in the file today — `Primitives` (325 vars, single "Default" mode — raw ramps: `Lumen Gray/50-950`, `Nightshade/50-950`, Alpha channels, plus radius/size), `Lumen/Theme` (251 vars, Light+Dark modes — semantic `bg/`/`text/`/`stroke/`/`icon/` roles aliasing into Primitives), and `Typography` (260 vars, Desktop/Tablet/Mobile modes) — no separate "Gray"/"Foundation"/"Lumen Crimson" collection exists, consistent with the earlier resolution. "Lumen Gray" and "Nightshade" are ramp-group names within `Primitives`, matching this repo's existing `lumen-gray`/`nightshade` primitive families exactly; the crimson ramp appears as `Primary`/`Alpha` entries, matching the existing `primary` family. No naming or value change needed either time — this row's own "remains open" language was simply stale documentation, not an unresolved design question. **Same-day follow-up** from a fuller Primitives export: added a new `accent` family (`Accent/Purple`, #B48EE0) and corrected `dark.border.focus` to use it (was `primary.300`, an unevidenced placeholder — twice-confirmed now, by this primitive and by the earlier Dark-theme export's own `stroke/focus` binding). Added a systematic ~90-token "Alpha" tint collection (8/16/24/40/60/80% steps) across most families, purely additive, no consumer yet — kept by explicit user confirmation despite being currently unconsumed. **Second same-day follow-up** (direct user request that colors match Figma exactly): `status.info-subtle` repointed to `blue.50`/`blue.800`, and the now-fully-unreferenced legacy `blue` family (500=`#0E17FF`) was deleted outright. Same day, a live screenshot of Figma's own Variables panel confirmed the canonical group name really is "Blue" (not "Sky", which this repo had used as a placeholder name to avoid colliding with the not-yet-deleted old family) — renamed accordingly across primitives, semantic aliases, and Storybook. **Third same-day follow-up** (user reported the Storybook Palettes page shows families not actually in Figma): `sand`/`lemon-green`/`japonica`/`forest` had zero consumers anywhere and were deleted outright; `cobalt`/`deep-purple`/`purple`/`pink` still back real Badge/toaster semantic tokens so they're kept but flagged PENDING REPLACEMENT pending real values from the user. `icon-gray` was also reported as not a real Figma collection — its two values were exact duplicates of `nightshade.400`/`.300`, so it was deleted and its consumers repointed straight at `nightshade` instead of flagged. **Fourth same-day follow-up** (user pasted the raw `Default.tokens.json` Primitives export directly, authoritative rather than a screenshot): resolved the four PENDING REPLACEMENT families — `purple`/`deep-purple`/`pink` confirmed real (exact value matches, plus new `900`/`950` steps for two of them), flags removed; `cobalt` confirmed genuinely absent and, per explicit user instruction, deleted, with its 3 (component-unconsumed) semantic consumers repointed to `blue.50`/`blue.800` — finally resolving this file's own previously-flagged `background.badge` vs. the export's `bg.badge`/`Blue/50` near-miss. The same export also showed `primary.10` and `neutral.250`/`neutral.850` aren't real (zero consumers, deleted) and evidenced two real new `nightshade` steps (`100`, `500`, added) while leaving `nightshade.350`/`850` unconfirmed (kept, flagged, still consumed). **Fifth same-day follow-up** (user pasted a second raw Primitives export): its Alpha collection showed `nightshade`'s real alpha tints are scoped to `500` (only just confirmed real), not `600` as an earlier partial Alpha export had claimed — renamed `nightshade.600-a8..a80` → `500-a8..a80`, zero consumers, straight swap. **2026-08-03 follow-up** (user pasted a third Primitives export and reported "removed 300- alpha color tokens"): three consecutive Alpha exports now consistently omit any `-300-`/`-400-` entries. Unlike prior deletions, `primary.300-a20`/`primary.300-a40`/`blue.300-a60` (the latter itself renamed from the original `300-a24`/mislabeled `Blue/400-60` corrections referenced above) were all actively consumed — user explicitly instructed removal, repointed to the closest standardized `500-a*` step: `dark.button.secondary-border`→`primary.500-a40` (exact 40% match), `dark.background.info`→`blue.500-a60` (exact 60% match), `dark.button.secondary-bg`→`primary.500-a24` (nearest of the equidistant 16/24 options, a documented judgment call, not further-evidenced). **2026-08-03 second follow-up** (user directed resolving the `nightshade.350`/`850` PENDING REPLACEMENT flag, confirming Figma itself consolidated these two steps away): deleted both from `primitives/color.json`; remapped the 3 consumers per the user's given mapping — `background.code`→`nightshade.300`, `background.brand-tint`/`border.toaster`→`nightshade.900`. **Reversed 2026-08-05**: the `accent` family (`Accent/Purple`) added in the "Same-day follow-up" entry above, claimed then as "twice-confirmed" via a real `stroke/focus` binding, turned out not to be — a fresh, direct user re-check of the live file found no `border/focus`/`stroke/focus` variable anywhere, and the user then deleted `Accent/Purple` from Figma itself, confirming it was never a real, current binding (the original claim was mistaken, not stale). `dark.border.focus` repointed to `primary.200` — the one value with real corroboration (every scoped `*/focused-border` field in this system independently resolves to it in dark mode) rather than Figma evidence for this specific generic role, which no longer exists. The `accent` primitive family was deleted outright, now fully unconsumed. **Reversed again 2026-08-06**: the 2026-08-05 "no `border/focus`/`stroke/focus` variable exists" finding was itself mistaken. The user supplied a complete raw W3C-format export of Figma's live `Dark.tokens.json`/`Light.tokens.json` collections (explicit `com.figma.aliasData.targetVariableName` alias chains, not a summary) showing `stroke.focus` dark mode is a real, current alias to `_base/Accent/Purple`, which resolves to #9E86D0 / Deep Purple-300 — corroborated by a Variables-panel screenshot (Light=Deep Purple/400, Dark=Deep Purple/300). `dark.border.focus` repointed to the existing `deep-purple.300` primitive (#9E86D0); no `accent` primitive family reintroduced, since `_base/Accent/Purple` is just Figma-side naming for the same ramp step. `light.border.focus` (`primary.500`) unaffected throughout.                                                                                                                                                                                                                                                                                                                                                                                     | 2026-08-06   |
| Typography                 | `428:13769`; full Variables export (Typography collection, Desktop/Tablet/Mobile modes, no single node)          | `packages/tokens/src/typography.json`                                                                                                                                                     | `Foundations` (added 2026-08-02)                                                                             | Partially Synced — 2026-08-02: the same export revealed a previously-unknown responsive Typography collection with three modes. Diffed all three against each other: only `display-lg/md/sm` (H1-H3), `headline-lg/md` (H4/H5 — H6 has no variance), and `standard-button-sm/lg/xl` actually vary by breakpoint; every other tier is identical across Desktop/Tablet/Mobile. Added `tablet`/`mobile` override keys to those entries, emitted as new `@media` blocks in `build.mjs` (reusing `breakpoint.json`'s thresholds, not Figma's raw frame widths). Figma's own "Button Large" (16/24) and "Button Small" (13/20) tiers have no confident match against any existing key (this repo's legacy `button-sm`/`button-xs` are close-but-not-exact) — deliberately left unmapped, not guessed. The pre-existing gap (only `Body/*` variables are live-bound; Heading/Label/Overline/Caption/Code remain documentation-only) is unchanged.                                                                                                                                                                                                                                                                                                                                                                                     | 2026-08-02   |
| Scale                      | `429:14216` (original static frame, unchanged legacy reference); `1716:3692` (new live-bound Radius scale), `1716:3625` (new live-bound Typography scale) — **corrected 2026-08-06**, these two IDs were swapped in this row since it was first written; re-verified live via `get_variable_defs` on both (`1716:3692` returns Radius/xs-pill, `1716:3625` returns Heading/Body/Label/Caption fontSize+lineHeight) | `packages/tokens/src/{radius,typography}.json`                                                                                                                                                     | Foundation page required                                                                                    | Synced — **2026-08-04**, direct user re-verification: Figma added two new frames with real live variable bindings, resolving the prior "Blocked/zero bound Variables" finding for this section (`429:14216` itself is untouched, still static). Radius: all 8 sample shapes (`xs`/`s`/`m`/`l`/`xl`/`xxl`/`xxxl`/`pill`) have `cornerRadius` bound to `Primitives` collection variables — values (2/4/6/8/10/14/18/999px) match `radius.json` exactly, zero drift, confirming the Radius sync (see that row above) was already fully correct. Typography: all 16 sample nodes (Heading H1-H6, Body Large-XSmall, Label Large-Small, Caption Large-Small) have `fontSize` bound to `Typography` collection variables; 13 of 16 also have `lineHeight` bound (Body variants don't, since the Typography collection defines no separate `lineHeight` variables for Body styles — not a binding gap, a real absence). No value drift reported against `typography.json`, no code changes needed — this was a documentation-status fix, not a value fix. | 2026-08-04   |
| Spacing                    | `511:2`                                                                                                          | `packages/tokens/src/spacing.json`                                                                                                                                                     | `Foundations` (added 2026-08-02)                                                                             | Partially Synced — re-confirmed 2026-07-26: zero bound Variables (static text only); code's base scale matches the documented static values exactly, nothing to reconcile. 2026-08-02: new `size.json` component-scale aliases added on top of this same scale (see the Size row below) — no `spacing.json` values changed.                                                                                                                                                                                                                                                                                                                                                                                     | 2026-08-02   |
| Radius                     | `511:78`; full Variables export (Primitives/Default collection)                                                  | `packages/tokens/src/radius.json`                                                                                                                                                     | `Foundations` (added 2026-08-02)                                                                             | Partially Synced — 2026-08-02: the fresh export's generic `Radius.xl` reads 10px, not the 12px previously documented — corrected, and now agrees with the already-correct `button`/`input`/`app-search` component-scoped tokens (all three were 10px all along; the generic scale was the stale value). Everything else re-confirmed unchanged from the 2026-07-26 pass. **Same-day follow-up**: a fuller Primitives export added generic `xxl`(14px), a new step between `xl`(10) and `2xl`(16). That same export's `pill`=999 did NOT match this repo's then-`pill`=100 (independently sourced from Badge, node 1079:893) — flagged in `radius.json`'s own comment, deliberately not changed pending a dedicated check. **Resolved 2026-08-04**: direct user decision to treat the generic Radius primitive scale as unambiguous source of truth — `pill` corrected 100→999. Verified zero visual regression first: both current consumers (`Badge.tsx`, `EnterpriseLoginPage.tsx`'s two hero badges) are under ~40px tall, and CSS `border-radius` clamps to 50% of an element's shortest side, so 100 and 999 render pixel-identical for all of them.                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 2026-08-04   |
| Elevation                  | `1770:7` ("Scale / Elevation (Live)" frame, user-supplied URL)                                                   | `packages/tokens/src/shadow.json`                                                                                                                                                     | Foundation page required                                                                                    | Synced — **2026-08-06**: this repo's first real evidence of the full generic Elevation scale, closing the gap `docs/design-tokens.md` §6 had flagged since it was written. 5 steps read directly off the frame's own text annotations (`get_metadata`): Elevation/1 `0px 2px 4px rgba(0,0,0,0.04)` through Elevation/5 `0px 24px 48px rgba(0,0,0,0.24)`. Added as `elevation.1`-`elevation.5`. Figma's real naming is numeric, not the doc's prior aspirational `None/Sm/Md/Lg/Xl` — `design-tokens.md` §6 renamed to match. Pre-existing `elevation.sm` (KPICard-sourced) does not byte-match any of the 5 new values, so it is NOT part of this real numbered scale despite the name — kept separate. `elevation.4` is byte-identical to the pre-existing `modal.default`, confirming that tier really is generic Elevation/4.                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 2026-08-06   |
| Motion                     | Full Variables export (Primitives/Default collection, `Motion.Duration`)                                         | `packages/tokens/src/motion.json`                                                                                                                                                     | `Foundations` (added 2026-08-02)                                                                             | Partially Synced — 2026-08-02: first real Figma evidence for the generic `duration` scale (previously all-provisional except `skeleton-pulse`). `instant`/`fast`/`moderate` were already exact; `slow` corrected 400ms→300ms; `slower` (500ms) added, no consumer yet. **Same-day follow-up**: Figma also publishes real `Motion.Easing` primitives after all — `standard`/`enter`/`exit` are exact matches for `ease-in-out`/`ease-out`/`ease-in` respectively (kept under existing names), no longer provisional. New `linear`/`spring` tokens added, no consumer yet. `emphasized` remains genuinely provisional — no matching Figma curve exists.                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 2026-08-02   |
| Size                       | Full Variables export (Primitives/Default collection, `Size` group)                                              | `packages/tokens/src/size.json` (new), `packages/ui/src/layout/{AppShell,SideNav}.tsx`                                                                                                  | `Foundations` (added 2026-08-02)                                                                             | Partially Synced — new file added 2026-08-02; every value already existed as a generic `spacing.space.N` key. `header-h`/`nav-expanded`/`nav-collapsed`/`ai-panel-w` are wired into their one existing call site each. `footer-h`/`icon-sm/md/lg`/`avatar-sm/md/lg`/`touch-target` are declared but not yet consumed anywhere — no existing component API to attach to (Avatar has no size variant, icon sizing is ad hoc across ~15+ call sites) — adopting them is follow-up component work, explicitly out of scope for this sync.                                                                                                                                                                                                                                                                                                                                                                                     | 2026-08-02   |
| Badge                      | `1079:893`                                                                                                       | `packages/tokens/src/{primitives/color,semantic/color,typography,radius}.json`, `packages/ui/src/primitives/Badge.tsx`                                                    | `Primitives/Badge` (`VariantCollection`)                                                                    | Synced — all 10 concrete Default/Gray/Success/Warning/Error/Deep Purple/Purple/Light Blue/Yellow/Pink variants, sm/md/lg geometry, optional dots, and exact light roles are bound; legacy `tone` remains for compatibility. **2026-08-04**: Figma published real `Theme=Dark` instances for this node (30 — all 10 statuses x 3 sizes) for the first time; the previously-provisional dark aliases were re-verified against all 10 via `get_variable_defs` and 6 of 10 backgrounds were found genuinely wrong (`gray-bg` was a different family entirely, `error`/`purple`/`light-blue`/`yellow`/`pink`-bg were each one step off — a different step per family, not a uniform pattern; `gray-text`/`yellow-text` were also wrong). All corrected — see `packages/tokens/src/semantic/color.json`'s `_badgeDarkModeComment` for the full before/after and the WCAG re-check. **Corrected again 2026-08-05**, direct user-verified live Figma check (part of the broader `docs/figma-source.md` §18 "exact color values" audit): `default-bg` (dark) — claimed exact in the pass above — was actually still wrong, `app-shell.dark.border` (#3D3039) rather than the real `teal.900` (#002121), a family miss the original 10-field sweep didn't catch. Corrected; see `_badgeDarkModeComment`'s dated addendum.                                                                                                                                                                                                                                                                                                                                                                                                                        | 2026-08-05   |
| Button                     | `1027:3733` (variant/state collection `1174:1349`); `1034:4459` (sizes, superseded — see note)                   | `packages/ui/src/components/button/Button.tsx` (thin re-export of `../internal/button.tsx`), `packages/web-components/src/button/lumen-button.ts`, `packages/angular/src/button/lumen-button.ts` | `Primitives/Button`                                                                                          | Corrected 2026-07-29 (this row was stale, pointing at a `packages/ui/src/primitives/Button.tsx` that no longer exists): React's `Button` is the shadcn-adapted component promoted after the original hand-built primitive was retired — see `docs/shadcn-integration.md` §7.8 for its own sync record and authority; this row no longer duplicates that. Its variant vocabulary is `default`/`destructive`/`outline`/`secondary`/`ghost`/`link` (shadcn's set, colors bound to the same `--color-button-*` tokens as before) and its size scale is unrelated to node `1034:4459`'s 30/34/38/42px (`h-9`/`h-8`/`h-10`/`h-9` via `default`/`sm`/`lg`/`icon`) — node `1034:4459` no longer governs React `Button` at all; its live consumer is `AIButton` (see that row) and, as of 2026-07-29, the new `IconButton` (see that row). Web Components/Angular `Button` retain the pre-retirement `primary`/`accent`/`secondary`/`outline`/`ghost`/`destructive` contract and were not re-audited in this pass — flagged, not verified, whether they still match React. **Second correction, same day** (direct user request to "sync all new updated button tokens from Figma," re-auditing the full canonical collection `1174:1349` beyond just sizes): found and fixed 3 more drifts, all React-only (Web Components/Angular not re-audited) — `ghost-on-action` was `app-shell.light.text-heading` (generic dark neutral), Figma's real `btn/ghost/on-action` is `#BE003C`/primary.500, the same crimson every other variant's text uses; `ghost-hover-bg` was `lumen-gray.200` (gray), Figma's real `btn/ghost/hover-bg` is `#F9E6EC`/primary.50 (light pink); radius was shadcn's own untokened `rounded-md` (6px)/documented-as-8px, Figma's bound `radius/xl` on this node resolves to 10px — added as the new `radius.button` token (10px), by direct user confirmation to treat it as the component's real current value rather than a Figma-side inconsistency to flag back to design. `Outline`'s border also thickened from 1px to the Figma-evidenced 1.5px; `Secondary` remains 1px, unchanged. Dark-mode values for the ghost fix were not re-verified (this node's Theme property has only Light instances built) and are unchanged. **Third correction, 2026-08-04** (direct user request against a fresh `get_design_context` pull on node `1565:3797`, a reorganized "Variants" showcase for the same canonical set `1174:1349`, LIGHT theme, all 7 styles × 4 states): re-verified every hex/rgba for `Primary`/`Secondary`/`Outline`/`Ghost`/`Destructive`/`Disabled` against the live token source — zero drift, all exact. Found real drift in `Neutral`: Figma actually has two styles, `Style=Neutral Outline` and `Style=Neutral Solid`, not one. `Neutral Outline`'s hover state was wrong in code (`neutral.50`, a light tint) vs. Figma's real solid dark fill (`lumen-gray.800`/`#424849`) with text flipping to white — fixed, plus a new `neutral-hover-on-action` token for the text flip. `Neutral Solid` didn't exist in code at all — added as a new `neutral-solid` variant (React `Button`) reusing `neutral.700`/`neutral.white`/`neutral.black`, all exact. Per direct user request, `neutral-solid` was also added to Web Components' and Angular's `lumen-button` (neither has plain `neutral`/outline-style at all — that gap was not filled, only the explicitly-requested `neutral-solid`, an intentional asymmetry). See `packages/tokens/src/semantic/color.json`'s `_neutralButtonComment` for the full token record. **Fourth correction, same day**: Figma published real `Theme=Dark` instances for this same node hours later (28, matching Light 1:1) — re-audited Default+Hover for all 7 styles against them. `Primary`/`Secondary`/`Outline`/`Danger` dark values were all byte-exact, confirming the 2026-07-24 sync was solid. Real drift found in 3 places: `Ghost`'s dark text (`app-shell.dark.text-primary`->`primary.25`); `Neutral` (outline) and `Neutral Solid`'s entire dark treatment, which inverts from what light-mode mirroring assumed (light border/fill/text in dark mode, not a darker one — see `_neutralButtonComment` for the full field-by-field record, including one flagged discrepancy against the user's own resolution table); and the globally-shared Disabled state (`disabled-bg` `app-shell.dark.surface`->`neutral.900`, `disabled-on-action` `neutral.400`, both affecting every Button *and* IconButton variant in dark mode). See `_buttonComment` for the Disabled/Ghost record. **Fifth correction, same day**: chasing the still-open "Button Large"/"Button Small" typography question surfaced a different, real bug instead — this canonical node's actual bound label typography (all styles, size=md) is `Body/Small Medium` (14px/22/weight-500), but code was rendering `text-label-md font-medium` (a "helper labels" preset, 12px/18, wrong role entirely — the weight only accidentally landed right because `font-medium` won the cascade). Fixed to the existing, already-Figma-sourced `body-sm-w500` token (renamed same day from `body-sm-medium`, direct user request, when this became a second consumer alongside `FileUploadProgressList`). The original "Button Large"/"Button Small" size-variant question itself remains unresolved — this node still only has `size=md` instances, no new evidence for `sm`/`lg`. **Sixth correction, 2026-08-05**, direct user report ("Button label font style also not matching the Figma Design"), found while investigating the same complaint on `Dialog`'s title (see the Modal row below): `body-sm-w500`, like every typography-scale utility in this repo, only carries font-size/line-height/weight, never font-family — `Button`'s base `cva` class string never paired it with an explicit `font-interface` class, and with no repo-wide font-family reset, every Button label was silently rendering in Tailwind Preflight's generic system-UI stack instead of the bound `Instrument Sans` webfont (loaded via Storybook's Google Fonts import, but never requested) — added `font-interface` to the base class string, affecting every variant/size. Web Components'/Angular's `lumen-button` were not affected — both already set `font-family: var(--font-interface)` directly in plain CSS, a React/Tailwind-utility-composition-specific gap. Separately, a direct user-supplied token table found `dark.button.ghost-on-action` (corrected in the Fourth correction above to `primary.25`) had changed again on the Figma side — an explicit Light-mode-only override was removed, and the field now resolves via variable mode like every other field to `primary.50` (#F9E6EC), a different, adjacent step, not a reversal of the earlier finding.               | 2026-08-05   |
| Modal                       | `1737:4152` ("Modal" component); `1737:4154` ("Modal Mask", overlay); `1737:3834` (in-context usage frame, "Step 5 - File-upload Component")                  | `packages/ui/src/components/{dialog/Dialog.tsx,internal/dialog.tsx}`, `packages/ui/src/composite/{Modal.tsx,Modal.test.tsx,Modal.stories.tsx}`, `packages/patterns/src/DataExtractionOnboardingPage.tsx`                                                                                                                               | `Composite/Modal` (`Playground`, `TitleAndDescriptionOnly`, `TitleOnly`)                                          | Synced — added 2026-08-05, direct user request ("Please add Modal component to the codebase"). Audited first: `Dialog` (shadcn/Radix, already actively rendering exactly this title+description+separator+actions structure for `DataExtractionOnboardingPage`'s "Remove file?" confirmation — Figma's own example content for this component, byte-for-byte) turned out to already be the real implementation of Figma's canonical "Modal"; the pre-existing, unrelated `Modal` composite (dependency-free, zero consumers, no Figma source) was retired rather than kept as a second, duplicate component (`CLAUDE.md` hard rule #2). `Dialog`'s chrome was corrected to match: radius 8px→14px (`radius.xxl`, pre-existing token), width capped at Figma's exact 550px (was `max-w-lg`/512px), the flat shadcn border removed (Figma's Modal has none), `shadow-lg`→new `shadow.modal.default` (Figma's own "Elevation/4 — Modal" effect, `0px 16px 24px rgba(0,0,0,0.16)`), overlay `black/40`+`blur-sm`(4px)→new `modal.overlay` (`deep-purple.900-a30`, `rgba(27,14,51,0.3)`, sourced from "Modal Mask")+`blur-[5px]` — scoped to `Dialog` only; `Drawer`/`Sheet` were previously kept in deliberate visual parity with the old overlay value but weren't re-audited against their own Figma sources here, so they remain on `black/40`, a known, flagged divergence. Footer gained a `border-t` separator (`border.separator`, exact match for `stroke/separator`) with 24px padding above the buttons, matching Figma's "Actions" frame exactly; button gap 8px→16px. Title/description typography corrected from shadcn's generic `text-lg font-semibold`/`text-sm text-muted-foreground` to the real bound "Body/Large SemiBold" (20/32/600, new `body-lg-w600` tier) and "Body/Medium Regular" (16/26/400, exact match for existing `body-md`). New `Modal` composite added as a thin wrapper over the corrected `Dialog` primitives (not a reimplementation) with a `title`/`description`/`actions` prop API matching Figma's anatomy; `DataExtractionOnboardingPage`'s dialog migrated to it as its first real consumer. **Two follow-up corrections, same day**, both from direct user reports after the initial sync rendered: (1) the title's font-family was still wrong — `body-lg-w600` (like every typography-scale utility in this repo) carries no font-family, and neither `DialogTitle`/`DialogDescription` nor `Button`'s own base classes had ever paired a `font-interface` class with them; with no repo-wide font-family reset, all of this text was silently rendering in Tailwind Preflight's generic system-UI stack instead of the bound Instrument Sans webfont — added `font-interface` to both. This surfaced the same gap on `Button` (see that row's Sixth correction) via the user's own side-by-side comparison of the "Keep file"/"Remove file" actions. Verified correct at every layer (source, production build, and a freshly-started dev server's live CSS) before concluding the remaining variable was browser-side font loading, which the user then confirmed fixed it. (2) A direct user-supplied token table found the title's dark color didn't match the generic `text.primary` token it had been borrowing (`text.primary`'s existing dark value aliases a stale app-shell-scoped primitive, `#F5EFF3`) — Figma's real bound dark value is `primary.25` (`#FFF5F8`); added a dedicated `modal.title-text` token (light exact match for `text.primary`, dark diverges) rather than repointing the shared token (real other consumers: `AIResponseCard`, `EnterpriseLoginPage`, neither re-verified against this same node). React only — no Web Components/Angular equivalent (`Modal`/`Dialog` aren't among either package's shipped components).                                                                                                                          | 2026-08-05   |
| IconButton                 | `1034:4459` ("Sizes" reference frame; instance `1035:4738` "Icon Only - light"); `1565:3815` (dedicated icon-only reference frame, "ico only - 34px")                                  | `packages/ui/src/primitives/IconButton.tsx`                                                                                                                               | `Primitives/IconButton` (`VariantCollection`, `Sizes`, `Examples`)                                          | Partially Synced — new primitive, first real Figma evidence for a standalone icon-only button. Only `variant="secondary"` at `size="md"` (34px) matches the literal Figma instance (bg/border ~8%/24% alpha crimson, 1.5px border, exact); reuses `Button`'s already-synced `--color-button-*` tokens for the other five variants (`default`/`destructive`/`outline`/`ghost`/`link`) and infers `sm`/`lg`/`xl` icon-glyph sizes (12/16/18px) from this same frame's Primary Button icon sizes, not independent icon-only instances. **2026-08-04** (direct user request, sourced from node `1565:3815`): that frame shows 3 icon-only types — "Primary" (binds to `--btn/secondary/*`, reconfirming the existing exact `secondary` match, not new), "Outline" (binds to `--btn/neutral/secondary/border`, gray `#dbe1e2` — a different color family from this component's existing crimson `outline`, so added as a new `neutral-outline` variant rather than changing `outline`), and "Solid" (`#393939` dark fill — added as `neutral-solid`, reusing Button's new `neutral-solid` tokens). Only `size="md"` (34px) has a literal instance in this frame; `sm`/`lg`/`xl` for the two new variants use the same disclosed-inference pattern as every other variant. **Confirmed permanent, same day**: direct user search of the whole file for any component or component-set named "IconButton" (any casing) found none — there is no dedicated multi-size icon-only component to source `sm`/`lg`/`xl` from, and none is coming without Figma authoring one. Every `sm`/`lg`/`xl` icon-glyph size in this component (all 8 variants) is inference-by-consistency with Button's own icon-size ladder, permanently, not a temporary gap pending a future sync. **Corrected same day**, direct user re-confirmation against the full icon-only color table: `Primary` (via `secondary`) and `Solid` (via `neutral-solid`) both re-verified byte-exact, safe to keep inheriting Button's tokens — but `neutral-outline`'s dark border genuinely diverges from Button's own Neutral Outline style (`#FFFFFF` here vs. Button's `#5E5E5E`), a real per-component difference, not safe to inherit blindly. Added a dedicated `icon-button.neutral-outline-border` token (light unchanged, dark now icon-button-specific) rather than continuing the shared-token assumption for that one field. React only — no Web Components/Angular equivalent (`IconButton` isn't among either package's 9 shipped components).                                                                                                                          | 2026-08-04   |
| Input                      | `1262:1181`                                                                    | `packages/ui/src/components/input/Input.tsx` (thin re-export of `../internal/input.tsx`)                                                                                                                                    | `Primitives/Input` (`VariantCollection`)                                                                    | Synced — updated lg typography, exact size-specific border weights, sm/md/lg geometry, Default/Hover/Focused/Error roles, and search anatomy are bound. **2026-08-04** (direct user report): Figma published real `Theme=Dark` instances for the whole collection for the first time (24, matching Light 1:1) — re-verified every field. `primary-border`/`primary-focused-border`/`primary-placeholder-text`/`search-icon`/`search-focused-border` were already exact. Real drift fixed: `primary-bg`/`search-bg` (`app-shell.dark.background`->`lumen-gray.950`), `primary-hover-border` (`lumen-gray.100`->`nightshade.300`), `primary-error-border` (`red.300`->`red.400`), `search-border` (`app-shell.dark.border`->the same `app-shell.dark.text-muted` primitive `primary-border` already correctly used). Also implemented a previously-flagged, never-actioned 2026-07-31 finding, now reconfirmed with real dark evidence too: Error state's typed-value text is SemiBold at a distinct new `input.primary-text` token (light `neutral.950`/#111111, dark `nightshade.50`/#F9F3F7), plus 2px extra horizontal padding at `sm`/`md` (`lg`'s error padding already equals its default, no override needed). React is the current reference implementation                                                                                                                                                                                                                                                               | 2026-08-04   |
| Radio                      | `1278:2153`                                                                                                      | `packages/ui/src/primitives/Radio.tsx`                                                                                                                                    | `Primitives/Radio` (`VariantCollection`)                                                                    | Synced — exact sm/md/lg targets and indicators plus Default/Hover/Focused/Selected/Disabled/Error roles are token-bound. **2026-08-04** (direct user report): Figma published real `Theme=Dark` instances for the whole collection for the first time (18, matching Light 1:1). Radio reuses Input's shared `input.*` tokens directly (`primary-bg`/`-border`/`-hover-border`/`-focused-border`/`-error-border`) — all already fixed by the same-day Input dark-mode audit, re-verified exact here too, no separate action needed. Two Radio-specific fields were wrong: `radio-checkbox-selected` (dark) was `neutral.white` — real value `nightshade.200`/#C9C2C7; `radio-checkbox-disabled-border` (dark, previously flagged unverified) was `app-shell.dark.button-disabled-border` — real value is the same `app-shell.dark.text-muted` primitive `primary-border` already uses. React is the current reference implementation                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | 2026-08-04   |
| Checkbox                   | `1278:2207`                                                                                                      | `packages/tokens/src/input.json`, `packages/ui/src/components/internal/checkbox.tsx` (public re-export `packages/ui/src/components/checkbox/Checkbox.tsx`), `packages/ui/src/assets/input-checkbox-{check,indeterminate}-{sm,md,lg}.svg`                 | `Primitives/Checkbox` (`VariantCollection`)                                                                 | Synced — exact exported sm/md/lg Checked and Indeterminate SVG images, subpixel placement offsets, targets, indicators, and Default/Hover/Focused/Checked/Disabled/Error/Indeterminate roles are token-bound. **2026-08-05** (direct user report): Figma published real `Theme=Dark` instances for the whole collection for the first time (21, matching Light 1:1). Checkbox reuses Input/Radio's shared `input.radio-checkbox-*`/`input.primary-*` tokens directly — all already fixed by the same-day Input/Radio dark-mode audits, re-verified exact here too. Two Checkbox-specific findings: `radio-checkbox-disabled-fill` (dark) was `neutral.600`, a 2026-07-31 ramp-mirror placeholder — real value is `nightshade.950`, a different family. Checkbox's `Hover` state also binds a background fill (`input/radio-checkbox/hover-bg`, light `lumen-gray.50`, dark `nightshade.800`) that had no token and no code at all before — the component only ever changed border color on hover; added as a new token and wired into `checkbox.tsx`. React is the current reference implementation.                                                                                                                                                                                                                                                                                                                                                                                    | 2026-08-05   |
| Split Button               | `555:300`                                                                                                        | `packages/ui/src/composite/SplitButton.tsx`                                                                                                                               | `Composite/SplitButton`                                                                                     | Partially Synced — sm dropdown segment squared to 36px vs. Figma's 30px, see `docs/component-specifications.md` §43; corner radius (6px→8px) resolved 2026-07-16                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 2026-07-16   |
| Filter Chip                | `581:409`                                                                                                        | `packages/ui/src/primitives/FilterChip.tsx`                                                                                                                               | `Primitives/FilterChip`                                                                                     | Synced                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 2026-07-14   |
| Choice Chip                | `581:485`                                                                                                        | `packages/ui/src/primitives/ChoiceChip.tsx`                                                                                                                               | `Primitives/ChoiceChip`                                                                                     | Partially Synced — Hover/Focus/Disabled inferred from Filter Chip's identical tokens, not independently sourced per state; `tone`/`icon` (2026-07-16) independently confirmed                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 2026-07-16   |
| AI Button                  | `760:1965`; split sublayers `817:9861` (`1381:854`–`1381:856`); split dropdown `1046:1875`; label typography `1034:4459` | `packages/ui/src/primitives/AIButton.tsx`; framework parity implementations                                                                                              | `AI Components/One AI Button, Every Capability`                                                             | Synced with directed extension — canonical treatments, exact size scale, icon-only geometry, Loading, React split corners, and the keyboard-accessible dropdown are implemented. The menu retains Figma's anatomy but uses user-directed automatic width and an eight-row maximum visible area with an interaction-only compact scrollbar. Web Components/Angular match the core visual contract, while capability lookup, split composition, and its menu remain React APIs. Corrected 2026-07-29: `standard-button-{sm,md,lg,xl}` label typography (the React-only `text-standard-button-*` classes) was re-verified against a fresh `get_variable_defs` pull on `1034:4459` — weight SemiBold/600 (was 500), letter-spacing exactly 0 (was a positive per-size value), and exact line-heights 18/22/28px (was unset). `lg` is now 18px/28px, identical to `xl`, since Figma has no independent `Button/Large` variable (direct user confirmation, not inference). Web Components/Angular were not re-audited for this typography correction — flagged, not verified               | 2026-07-29   |
| Segmented Control          | `958:5058`, `958:5090`                                                                                           | `packages/ui/src/primitives/SegmentedControl.tsx`                                                                                                                         | `Primitives/SegmentedControl`                                                                               | Partially Synced — `sm`/`md`/`lg` per-size padding and type independently verified 2026-07-16 against the "Size Rows" example; `lg` height rounded 44→48px and container padding rounded 3→4px remain (both off the confirmed spacing scale, no visible-difference risk)                                                                                                                                                                                                                                                                                                                                                                                                                                                             | 2026-07-16   |
| Toggle Group               | `969:5151`                                                                                                       | `packages/ui/src/primitives/ChoiceChip.tsx` (`tone="subtle"`)                                                                                                             | `Primitives/ChoiceChip` (`ToggleGroup` story)                                                               | Synced — workspace-summary caption added 2026-07-16                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 2026-07-16   |
| Split Button AI            | `969:5761`                                                                                                       | `packages/ui/src/composite/SplitButton.stories.tsx` (composition only, no new component/variant)                                                                          | `Composite/SplitButton` (`AI` story)                                                                        | Synced — expanded to all 3 Figma examples with full menu keyboard/hover interaction 2026-07-16                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 2026-07-16   |
| KPICard                    | `1007:3700` canonical `1119:3343`-`45`, verified in all six breakpoint/theme compositions                        | `packages/ui/src/primitives/KPICard.tsx`, `packages/web-components/src/kpi-card/lumen-kpi-card.ts`, `packages/angular/src/kpi-card/lumen-kpi-card.ts`                     | `Primitives/KPICard`; composed in `Layout/AppShell`                                                         | Synced for AppShell — exact AppShell label/value typography and light/dark status surfaces are token-bound; React/WC/Angular standalone parity remains tracked separately                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | 2026-07-20   |
| Theme Toggle               | `1007:3700`; Light `1079:1723`, Dark `1330:2282`; verified in `1127:4196`, `1127:4197`, `1175:2521`, `1175:2522` | `packages/ui/src/primitives/ThemeToggle.tsx`, `packages/web-components/src/theme-toggle/lumen-theme-toggle.ts`, `packages/angular/src/theme-toggle/lumen-theme-toggle.ts` | `Primitives/ThemeToggle` (`Light`, `Dark`, `Interactive`); composed in `Layout/AppShell`                    | Synced for AppShell — exact 54×24px track, fixed 20px cells, four directly rendered Light/Dark Figma SVG exports, five `btn/toggle/*` mode roles, and native switch behavior across React, Web Components, and Angular                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 2026-07-22   |
| Page Header                | `1007:3700` canonical `1119:3341`, verified in desktop/tablet compositions                                       | `packages/ui/src/composite/PageHeader.tsx`                                                                                                                                | `Composite/PageHeader`; composed in `Layout/AppShell`                                                       | Synced for AppShell — exact breadcrumb/title/body typography and published link/tertiary/body roles; React only, no cross-framework equivalent expected                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 2026-07-22   |
| Footer                     | `1007:3700` canonical `1119:3352`, re-verified against example `1197:1652` (`1102:6529`)                         | `packages/ui/src/layout/Footer.tsx`, `packages/web-components/src/footer/lumen-footer.ts`, `packages/angular/src/footer/lumen-footer.ts`                                  | `Layout/Footer` (React only — WC/Angular not covered)                                                       | Synced for AppShell — links use the published `text/link` mode values (`primary.500` light, `primary.200` dark); React/WC/Angular parity complete; Angular's projected links are unstyled by default (no non-deprecated `::slotted` equivalent), documented known gap                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 2026-07-22   |
| AppShell (responsive)      | `1007:3700`; desktop `1127:4196`/`1127:4197`, tablet `1175:2521`/`1175:2522`, mobile `1175:2588`/`1175:2589`     | `packages/ui/src/layout/AppShell.tsx`                                                                                                                                     | `Layout/AppShell` (`DesktopLight`, `DesktopDark`, `TabletLight`, `TabletDark`, `MobileLight`, `MobileDark`) | Synced — all six variants were re-extracted and the complete published color contract is mapped: app/surface, text, tertiary/link, icons, breakpoint-aware avatar, navigation foreground/background/selection, borders, badges, status, primary/secondary/accent buttons, assistant, `brand/dark`, Theme Toggle, and scoped primary/search Input roles. Desktop dark header search and AI query fields use exact AppShell background/border/placeholder values; the header restores Figma's search icon, shortcut, and 400×36 geometry. A user-directed `nav-hover` role derives 50% alpha from each mode's active color while selection remains full opacity. The story registers the exact 1440×900, 768×1024, and 390×844 frames. | 2026-07-22   |
| AI Panel                   | `1079:3141` (canonical AIPanel component, re-verified 2026-07-26 after a live user edit — supersedes the AppShell-composition source `1007:3700`/`1119:3351`/`1127:4196`/`1127:4197` for this component's own anatomy); response-actions anatomy sourced from the separate `1412:3030` ("AI Conversation Components") documentation frame              | `packages/ui/src/composite/AIPanel.tsx`                                                                                                                                   | `AI Components/AIPanel` (`WithResponseActions` story, renamed from `Conversation` 2026-07-26; moved from `Composite/AIPanel` 2026-07-27); composed in `Layout/AppShell`                                                          | Synced — exact 304px structure, theme tokens, and exported `lm-ai-outline` glyph; the composer uses standard `Input` plus a one-off black/34px/`radius.lg` send-button treatment (not a Button variant), and live-region behavior is covered structurally. Bubble corners (`radius.chat-bubble`, 18px, fully-square sharp corner), the bot-avatar icon, and in-bubble `followUps` (`outline`/`link` variants) were resynced against the canonical `1079:3141` node on 2026-07-26, correcting an earlier pass against `1412:3030` alone (see `docs/changelog.md`'s two Changed entries for the full before/after). `responseActions`/timestamp remain sourced from `1412:3030` as documented optional extras, not part of `1079:3141`'s own default instance. **2026-08-04** (direct user report, real Dark instances now exist for AIPanel for the first time): re-verified every field in the row above against the new Dark variant. `chat-response-bg`, `prompt-bg` (chat input bg), `assistant-icon-bg`, `text-tertiary` (timestamp), `text-on-brand` (user prompt text), and `border.default` were all already exact — no change. Two real drifts found and fixed: `app-shell.text-primary` (dark) — drives the Assistant label and bot-response text — had drifted to an unrelated component-scoped primitive (#F5EFF3); Figma's real value is `#FFF5F8` (`primary.25`). `button.link-on-action` (dark, "Show sources") was `primary.300`/#D8668A — deliberately set that way in an earlier session to match `TextLink`'s own dark color rather than Figma's literal (borrowed) binding; direct user instruction this same day re-affirmed Figma as source of truth even here, reverting to the literal `primary.100`/#F2CCD8 binding — a deliberate re-reversal, not an oversight of the earlier reasoning; see `_aiConversationComment` in `semantic/color.json`. One item flagged, not resolved: a `stroke/separator` value was reported but `AIPanel.tsx` has no divider/separator element at all to attach it to — unclear whether this needs a new UI element built, pending clarification on which element it belongs to. React only                                                                                                                                                                                                                                                                                                                                                                                                                                         | 2026-08-04   |
| DashboardPage (reconciled) | `1197:1652` (body composition)                                                                                   | `packages/patterns/src/DashboardPage.tsx`                                                                                                                                 | `Patterns/DashboardPage` (`RenewalPipeline` story)                                                          | Synced — composes PageHeader/KPICard/DataTable/Badge, no new component needed for the table                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 2026-07-20   |
| Avatar (`tone="neutral"`)  | `1197:1652` (`I1102:6515;1079:1889`)                                                                             | `packages/ui/src/primitives/Avatar.tsx`                                                                                                                                   | `Primitives/Avatar` (`Tones` story)                                                                         | Synced — additive, existing `tone="brand"` unchanged                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 2026-07-20   |
| ContentState               | `1174:1355` (component set; variants `1073:4486` Empty, `1073:4484` Loading, `1073:4483` Error; dark siblings `1698:3514` Empty, `1698:3520` Loading, `1698:3643` Error)                   | `packages/tokens/src/{motion,content-state,typography,semantic/color}.json`, `packages/ui/src/composite/{ContentState.tsx,ContentState.test.tsx,ContentState.stories.tsx}`                                                  | `Composite/ContentState` (`VariantCollection`, `Responsive`, `Do / Don't`)                                   | Synced — all three variants' layout, geometry, radii, and color roles (light + dark) are exactly bound, and the loading skeleton's 2s waveform, 0.4 dim stop, and five stagger offsets are exact from `get_motion_context`. Two recorded differences, none inferred: (1) Figma frames this at a fixed 600×400 and publishes no breakpoint evidence, so the shipped component is fluid with a 400px min-height — a deliberate code-side decision, not a match; (2) Figma binds the Empty variant's CTA fill to a raw `--lumen-dark/default` (#231C24) rather than to any `btn/*` variable, unlike the Error variant's correctly-bound `btn/destructive/default/bg` — treated as a Figma authoring gap, so both CTAs use the standard `Button` and no #231C24 button token was added. React only — `@lumen/web-components` and `@lumen/angular` have neither `EmptyState` nor `Skeleton`, so cross-framework parity is an explicit deferral, not drift. **2026-08-04** (direct user report): Figma added real accessibility annotations to all 3 variants for the first time — previously none existed, so the live-region/alert/focus behavior had been an unverified code-side decision. `loading`'s `role="status"`/`aria-live="polite"`/`aria-busy` and `error`'s `role="alert"` were already exact matches. Real gaps found and fixed: `empty` had no `role`/label at all, now `role="region"` + `aria-labelledby` (pointed at the visible title element, not a hardcoded string); `loading` gained an explicit `aria-label`; `error`'s "focus moves to the retry button automatically" requirement had no implementation at all — added, via a `display:contents` ref wrapper around the opaque `action` slot (no prop exists to attach a ref to it directly) that finds and focuses the first focusable element on mount. **2026-08-05** (direct user report): Figma published real `Theme=Dark` sibling instances for all 3 variants for the first time (frame width doubled 1864px→3712px). Every color role previously borrowed a shared, multi-consumer generic token (`background.app`, `text.body`, `text.secondary`/`.tertiary`, `border.table`/`.subtle`, `background.raised`/`.nav-active`, `status.error`/`.-subtle`) whose real dark value diverged — sometimes an entirely different color family. Replaced with a new, fully self-contained `content-state.*` semantic token group (11 fields, light+dark), the same pattern as `toast.*`, rather than repointing tokens with other real consumers (`AIResponseCard`, `EmptyState`, `Modal`, `FileUploadProgressList`, `Toast`). Two bugs independent of dark mode found in the same pass: `border.table`'s light value never actually matched this node's real `stroke/table` (`lumen-gray.300`, not `.200` — missed in the original 2026-07-28 sync); the Empty-state icon glyph's color was wrong in *both* themes (bound to a distinct sub-node variable, not the `text.secondary` role previously assumed — real light value matches the existing `text.title` token, `neutral.800`, not `text.secondary`). One item flagged, not silently implemented as literal: the corrected dark icon-glyph color (`neutral.900`) against its own dark badge background (`nightshade.800`) computes to ~1.3:1 contrast, reading as a likely Figma authoring inconsistency — implemented exactly as specified per the standing Figma-source-of-truth instruction, but worth flagging back to design. | 2026-08-05   |
| Toast                       | `1475:5100` (frame; instances `1475:5099` Default/Info, `1475:5101` Variant2/Warning, `1475:5115` Variant3/Error) | `packages/tokens/src/{motion,shadow,toast,semantic/color}.json`, `packages/ui/src/composite/Toast.tsx`                                                                    | `Composite/Toast` (`Playground`, `AllTones`, `PauseOnHover`, `ManualDismiss`)                                | Partially Synced — the card's exact border/background/shadow, the info/warning/error accent+icon colors, and the "Body/Medium Bold"/"Body/Small" title/description typography are all exact from `get_design_context`/`get_variable_defs` (title/description typography and the neutral border/background colors turned out to already be exact matches for existing tokens — `input-lg`, `body-sm`, `border.default`, `background.raised` — no new tokens needed there). `get_motion_context` returned no keyframe data on this node — it's a static mockup (3 snapshot instances at different progress-bar widths), not an animated prototype, so the 6-second auto-dismiss duration and the progress-bar animation are direct user instruction, not Figma-sourced; icon size (28px) was likewise raised from the Figma-read 24px by direct user instruction after the initial sync. `success`/`neutral` tones have no instance in this node and keep their pre-existing generic, Figma-unevidenced treatment unchanged. Discovered, not fixed at the time: this node's evidenced info color (then named `sky.500`, #2563EB) did not match the existing generic `status.info` (`blue.500`, #0E17FF) — already flagged above as an unresolved Colors gap; this sync added the exact value as the Toast-scoped `toast.info-accent` rather than repointing the shared token and its other consumers. **Resolved 2026-08-02**: the Colors row above's same-day follow-ups renamed `sky`→`blue` (once Figma's own Variables panel confirmed that's the real name) and repointed `status.info`/`status.info-subtle` to alias this exact ramp — `status.info` and `toast.info-accent` now resolve to the identical `#2563EB`, closing this gap. `toast.info-accent` was left in place as a distinct token rather than collapsed into `status.info` (no consumers repointed), since that's outside this row's own synchronization unit. Also discovered, not fixed repo-wide: `shadow-[var(--shadow-*)]` (Tailwind arbitrary-value syntax) compiles to a shadow-*color* hint, not the full shadow value — confirmed in the built Storybook CSS for Toast's own `--shadow-toast-default` and the pre-existing, identically-broken `--shadow-menu-default`/`--shadow-elevation-sm` usages in `Card`/`Popover`/`DropdownMenu`/`Command`/etc.; fixed for Toast only via a direct inline `boxShadow` style, the wider fix is a separate change. React only — `@lumen/web-components`/`@lumen/angular` have no Toast equivalent, an explicit deferral (both are Button-only proofs of concept), not drift. **2026-08-04** (direct user dark-mode/dimension audit): the "success/neutral have no instance" note above is now half-stale — `success` gained real Figma dark evidence (a distinct muted `status.green`, #0B8A3E, diverging from the generic `status.success` dark value), `neutral` still has none. `warning`'s dark accent also diverged from the generic `status.warning` it had been reusing (a distinct muted `status.amber`, #C97A2E) — both promoted to new `toast.{warning,success}-accent` tokens. Three more toast-scoped tokens added (values differed from their generic equivalents, mostly in dark): `container-bg` (was `background.raised`), `body-text` (was `text.secondary`), `icon-default` for the dismiss button (was `text.secondary`, wrong in both themes). `title-text` dark corrected `lumen-gray.50`->`nightshade.50` (a family mismatch found alongside the others). `--toast-width` corrected 450px->448px (2px transcription drift). `error`'s distinct accent color was briefly removed to literally match Figma (this tone has no bound accent-bar/icon-stroke variable, relying on the icon shape alone) — reverted same-day after direct user review of the rendered result: a colorless error toast reads as informational, not a failure; kept on the pre-existing generic `status.error` as a deliberate usability call, not an oversight. Info accent and `celebration`/SystemInfo bg (both themes) re-verified byte-exact, unchanged. **Same day, second follow-up**: Figma added a genuine `Type=Neutral` instance (node `1716:3818`) that didn't exist during the audit above — its accent (`Neutral/300`, #9F9F9F, already an existing primitive) added as new `toast.neutral-accent`, replacing the generic `border.default` placeholder `neutral` had been using. See `packages/tokens/src/semantic/color.json`'s `_toastComment` for the full record. | 2026-08-04   |
| CodeBlock                  | `1484:2905` ("AI Response Components" frame, code-block region)                                                  | `packages/ui/src/primitives/CodeBlock.tsx`                                                                                                                                | `Primitives/CodeBlock` (`Playground`, `TypeScript`, `JsonExample`, `Bash`)                                   | Partially Synced — dark `bg/code` and the two evidenced syntax colors (keyword/operator/builtin pink, string/char green) are exact; real tokenization via `prism-react-renderer` (new dependency, direct user request) rather than a hand-rolled parser, so every other Prism token type has no Figma evidence and stays plain-colored. React only.                                                                                                                                                                                                                                                                                                                                                                              | 2026-07-29   |
| AIResponseCard              | `1484:2905` ("AI Response Components" frame)                                                                     | `packages/ui/src/composite/AIResponseCard.tsx`                                                                                                                            | `AI Components/AIResponseCard` (`Playground`, `SingleSection`, `NoTableOrCode`, `Interactive`)               | Partially Synced — the first real Figma evidence for what `docs/component-architecture.md` §8/`component-specifications.md` §31 had only described aspirationally; named `AIResponseCard` (Figma's own label) by direct user confirmation. Header, table, code block, and follow-up-actions colors/typography are all exact or reused-exact (see §56's Tokens section for the full mapping) except: the table renders its own markup rather than reusing `DataTable` (whose fixed styling doesn't match this frame and has no override props — `DataTable` itself unchanged); the suggested-action pill's border uses the `green.100` primitive directly as a one-off (not promoted to a new status-border role); Copy/Regenerate icons reuse the existing generic `icon.default` (#262626) rather than this frame's exact #2B2F2F. The expand/collapse control is genuinely interactive, built on the existing `Collapsible` primitive per direct user request, not a static visual. React only — composite/page-level, same reasoning as `AIPanel`/`PageHeader`.                                                                                                            | 2026-07-29   |
| SideNav                     | `1498:2877` ("SideNav" frame; children `1079:2427` `State=Expanded`, `1498:2878` `State=collapsed`)               | `packages/ui/src/layout/SideNav.tsx`                                                                                                                                       | `Layout/SideNav` (`Expanded`, `Collapsed`, `WithWorkspace`, `Interactive`)                                    | Partially Synced — every color/radius/typography value on this node matched an existing token exactly, no new tokens needed. Spacing matched too, confirmed via a **second, dedicated `get_design_context` pull directly on the collapsed node** (`1498:2878` alone, not the parent's ternary-merged extraction) after a user-reported layout bug prompted re-verification: the container's `pt-[13px]` (asymmetric against `pb-[12px]`) is real, consistent Figma spacing, not a code-gen artifact — added as the new `--spacing-13` token rather than rounded to `--spacing-12` as first assumed. Collapsed NavItems likewise really do use `px-12 py-8 gap-10` (the same box model as expanded items, `h-40` fixed instead of auto) — not the previous `NavigationRail`'s centered/unpadded sizing as first assumed; the label's absence, not a `justify-center` override, is what visually centers the icon. `get_motion_context` returned no keyframe data (static two-state mockup) — the width transition's duration/easing reuse the existing provisional `duration.moderate`/`easing.standard` motion tokens rather than new values. The collapsed footer icon is Figma's same `circle-arrow-left` asset reused from the expanded Collapse button; kept the existing `CircleArrowRightIcon` for Expand instead (semantically "outward," already the tested/shipped choice) rather than matching the asset literally. Two accessibility/UX additions beyond the literal node, at direct user request: hover tooltips on every collapsed icon-only control (built on the existing `Tooltip`), and the "ADMIN"-style section label uses `text-secondary` rather than Figma's literal `text/tertiary` binding, which axe flagged as a WCAG AA contrast failure (3.32:1, needs 4.5:1) — `text-secondary` passes (~5.46:1) and is already used elsewhere in this component. This component absorbs what were previously two separate, undocumented components (`Sidebar`, `NavigationRail`, both private to `AppShell.tsx`) into one Figma-node-backed, independently exported component — see `component-specifications.md` §57 for the full spec. React only — `@lumen/web-components`/`@lumen/angular` have no `AppShell`/navigation equivalent yet (both Button-only proofs of concept), no parity gap introduced. | 2026-07-29   |
| LumenLogo                   | `1174:1354` ("Header" frame; `Breakpoint=Desktop` `1079:1890` > "Brand" `1079:1883` > "Lumen DS Logo" instance)   | `packages/ui/src/assets/lumen-logo.svg`, `packages/ui/src/primitives/LumenLogo.tsx`                                                                                       | `Primitives/LumenLogo` (`Default`, `Large`, `Decorative`)                                                    | Synced — exact asset, downloaded via `download_assets` and committed verbatim (not redrawn/approximated): a 7-path, multi-gradient SVG (deep purple through crimson to gold), 21.2423×21.8788px, rendered at that exact natural aspect ratio rather than stretched into the 28×28 bounding box it sits inside in the Header. No color/spacing/radius tokens involved — the asset bakes in its own fixed gradients, the same treatment as `ThemeToggle`'s and Checkbox's committed static icon assets, not the `currentColor`-based generated icon set. Replaces a placeholder (a plain crimson square with a literal "L" character) previously used in both `AppShell.stories.tsx`'s `Brand` mockup and `SideNav`'s example custom-logo usage. React only — `@lumen/web-components`/`@lumen/angular` have no header/brand-mark equivalent yet (both Button-only proofs of concept), no parity gap introduced. | 2026-07-29   |
| Other components           | Component nodes required                                                                                         | Component package                                                                                                                                                         | Component stories                                                                                           | Not Synced                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Not verified |

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
