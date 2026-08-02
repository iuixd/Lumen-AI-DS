# Lumen Component Specifications

> Canonical specification framework for components in the **Lumen AI Design System**.

This document defines the required specification structure, behavior contract, token usage, accessibility requirements, Storybook coverage, and Figma-to-code synchronization rules for every Lumen component.

## Source

- **Figma file:** Lumen AI Design System
- **File key:** `GJBYRm6ySR7XIECFcHMgy2`
- **Design Tokens node:** `426:4395`
- **Dev Mode URL:** https://www.figma.com/design/GJBYRm6ySR7XIECFcHMgy2/Lumen-AI-Design-System?node-id=426-4395&m=dev
- **Last reviewed:** 2026-07-15

## Related documents

```text
AGENTS.md
docs/figma-source.md
docs/design-tokens.md
docs/component-architecture.md
docs/component-specifications.md
docs/changelog.md
```

## Scope

The referenced Figma node documents the Lumen foundations:

- Colors
- Typography
- Scale
- Spacing
- Radius

It does not expose the complete component inventory or all component-set properties. Therefore, this document defines the required specification contract and approved baseline components. Exact variant values, node IDs, properties, and token aliases must be synchronized from each component-specific Figma URL before implementation.

---

# 1. Specification authority

Use the following authority order:

```text
Published Figma component
    ↓
Approved component-specific Dev Mode node
    ↓
Component token definitions
    ↓
This specification                       (framework-neutral contract)
    ↓
Framework package implementation          (React today; Angular, Vue, and
    ↓                                       Web Components are future peers,
    ↓                                       not replacements)
Storybook and tests
```

This specification is the component contract every framework package implements — it does not belong to React or any other single framework. React is currently the only shipped framework package (`@lumen/ui`, `@lumen/patterns`), so today it is also the only place this specification is realized in code; that is a statement about what has been built, not about which layer is authoritative. See `docs/component-architecture.md` §0 for the full layer diagram.

When information conflicts:

1. Approved and published Figma components define visual anatomy and supported variants.
2. Exported token files define exact machine-readable values.
3. This document defines behavior, governance, accessibility, and documentation requirements — independent of framework.
4. `changelog.md` defines the authorized update scope.
5. A framework package's implementation must conform to this specification; if a package's real behavior differs, the package is wrong, not the spec.
6. Claude Code must report ambiguity instead of inventing behavior or values.

---

# 2. Required component specification structure

Every production component must include the following sections.

```markdown
# Component name

## Status

Draft | Experimental | Beta | Stable | Deprecated

## Figma source

Component URL, node ID, component-set name, and last synchronization date.

## Purpose

What the component enables.

## When to use

Approved use cases.

## When not to use

Misuse cases and recommended alternatives.

## Anatomy

Named component regions.

## Variants

Supported semantic variants.

## Sizes

Supported size options.

## States

Supported interaction and validation states.

## Properties

Figma properties and the framework-neutral property contract (canonical name, type, and meaning — independent of any single framework's API syntax).

## Behavior

Interaction rules, state transitions, layout, and content behavior.

## Content

Labels, descriptions, truncation, localization, and tone.

## Tokens

Semantic and component token dependencies.

## Accessibility

Semantics, keyboard interaction, focus, announcements, and contrast.

## Responsive behavior

Resizing, wrapping, density, and breakpoint expectations.

## Storybook

Required stories, controls, and documentation.

## Testing

Unit, accessibility, visual, and integration coverage.

## Code mapping

One entry per shipped framework package: export or custom-element name, source path, and Code Connect mapping. React is the only shipped framework package today.

## Change history

Component-specific additions, changes, and deprecations.
```

---

# 3. Cross-component standards

## 3.1 Naming

Use semantic names.

Recommended:

```text
Primary
Secondary
Tertiary
Ghost
Danger
Success
Warning
Info
```

Avoid implementation names:

```text
Blue
Gray
Outlined Blue
Filled Dark
```

Use these standard state names:

```text
Default
Hover
Pressed
Focus
Disabled
Loading
Selected
Checked
Indeterminate
Expanded
Read Only
Invalid
Success
Warning
Error
```

## 3.2 Sizes

Use the shared size vocabulary:

```text
Sm
Md
Lg
```

Add `Xs` or `Xl` only after design-system review.

## 3.3 Density

Enterprise components may support:

```text
Comfortable
Compact
```

Density must resolve through approved tokens and must not be implemented using arbitrary overrides.

## 3.4 Token usage

All components must use:

- semantic color tokens
- component-specific color tokens where necessary
- spacing tokens
- radius tokens
- typography styles
- elevation tokens
- motion tokens
- focus tokens

Do not hardcode token-backed values.

## 3.5 Layout

Production components should use Figma Auto Layout and equivalent flexible layout behavior in code.

Validate:

- Hug, Fill, and Fixed behavior
- minimum and maximum dimensions
- long text
- wrapping
- localization expansion
- icon alignment
- nested spacing
- responsive resizing

## 3.6 Accessibility

All stable components must meet WCAG 2.2 AA.

Every component specification must identify:

```text
Role
Accessible name
Keyboard interaction
Focus behavior
ARIA attributes
Announcements
Contrast
Touch target
Reduced-motion behavior
Known constraints
```

---

# 4. Foundation-to-component mapping

The current Figma source provides the following foundations.

## Typography

| Role       | Size | Line height |
| ---------- | ---: | ----------: |
| Heading H1 | 60px |        72px |
| Heading H2 | 50px |        60px |
| Heading H3 | 40px |        50px |
| Heading H4 | 32px |        42px |
| Heading H5 | 24px |        32px |
| Heading H6 | 20px |        28px |
| Body Lg    | 20px |        32px |
| Body Md    | 16px |        26px |
| Body Sm    | 14px |        22px |
| Body Xs    | 12px |        20px |
| Label Lg   | 14px |        20px |
| Label Md   | 12px |        18px |
| Label Sm   | 11px |        16px |
| Overline   | 11px |        16px |
| Caption    | 11px |        18px |
| Code Md    | 14px |        22px |
| Code Sm    | 12px |        20px |

## Spacing

```text
0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 28, 32,
40, 48, 56, 64, 80, 96, 128
```

## Radius

```text
None = 0px
Xs = 2px
Sm = 4px
Md = 6px
Lg = 8px
Xl = 12px
2xl = 16px
3xl = 24px
Full = pill / 9999px
```

Exact color values, aliases, modes, font families, font weights, letter spacing, and general scale values must come from Figma Variables or component-specific Dev Mode nodes.

---

# 5. Button

## Status

Final specification, synchronized across React, Web Components, Angular,
and Storybook from Lumen-AI-Design-System variant/state node `1027:3733`/`1174:1349`
and size node `1034:4459`. The size collection was synchronized on 2026-07-23.
The final contract supersedes the previous Raised/Tertiary variants,
Pressed/Loading/status states, Pill, or Icon-only modifiers.

**Naming note:** React's live `Button` is the shadcn-adapted component (see
`docs/shadcn-integration.md` §7.8) and names these variants
`default`/`destructive`/`outline`/`secondary`/`ghost`/`link` rather than
`Primary`/`Destructive`/`Outline`/`Secondary`/`Ghost`/(no Link) below —
this section still describes the Figma-side variant/color contract, which
the live component's `--color-button-*` tokens implement under those
different names; it was not rewritten to match React's exact prop values.
`Accent` remains declared in Figma with no built visual states in either
mode, same as before.

## Purpose

Buttons trigger immediate actions such as submitting data, creating records, confirming decisions, opening workflows, or invoking AI-assisted operations.

## When to use

Use a Button when:

- the user initiates an action
- the outcome occurs in the current product context
- a form is submitted
- a workflow advances
- a confirmation or destructive action is required
- an AI-assisted operation is explicitly initiated

## When not to use

Do not use a Button for:

- navigation to another location when a Link is more appropriate
- persistent on/off state when a Switch is appropriate
- selecting one option from a group
- opening passive explanatory content without a clear action
- icon-only actions without an accessible label

## Anatomy

```text
Button
├── Container
├── Content
│   ├── Leading icon
│   ├── Label
│   └── Trailing icon
└── Focus ring
```

## Variants

```text
Primary
Accent
Secondary
Outline
Ghost
Destructive
```

### Primary

Use for the highest-priority action in a logical region. Flat fill, no elevation.

### Secondary

Use for important supporting actions on a neutral bordered surface.

### Outline

Use for a transparent, brand-colored bordered action.

### Ghost

Use for a lower-emphasis action without a visible boundary at rest.

### Accent

Use for an emphasized action whose application-context treatment is distinct
from Primary. The current Figma collection uses the crimson primary surface
in both themes, with mode-specific hover roles.

### Destructive

Use for destructive or irreversible actions. Significant consequences still
require confirmation.

## Sizes

| Size | Height | Inline padding | Gap | Icon | Label                                              |
| ---- | -----: | -------------: | --: | ---: | -------------------------------------------------- |
| `sm` |   30px |           14px | 6px | 12px | Instrument Sans Medium 12px, 0.12px letter spacing |
| `md` |   34px |           16px | 8px | 14px | Instrument Sans Medium 14px, 0.14px letter spacing |
| `lg` |   38px |           16px | 8px | 16px | Instrument Sans Medium 16px, 0.16px letter spacing |
| `xl` |   42px |           16px | 8px | 18px | Instrument Sans Medium 18px, 0.18px letter spacing |

`md` is the default. All variants use a 10px radius (corrected 2026-07-29
from the previously documented 8px — Figma's own bound `radius/xl`
variable on the canonical collection resolves to 10px, not 8px; see
`packages/tokens/src/radius.json`'s `button` step). `Outline`'s border is
1.5px (also corrected 2026-07-29); other bordered variants (`Secondary`)
use a 1px border.

## States

The final collection defines only:

```text
Default
Hover
Focused
Disabled
```

Pressed, Loading, and status states are not part of this collection and must
not be inferred.

The published Hover colors are:

| Variant     | Light surface | Light foreground | Light border | Dark surface | Dark foreground | Dark border |
| ----------- | ------------- | ---------------- | ------------ | ------------ | --------------- | ----------- |
| Primary     | `#720024`     | `#FFFFFF`        | -            | `#CB3363`    | `#FFFFFF`       | -           |
| Accent      | `#720024`     | `#FFF5F8`        | -            | `#CB3363`    | `#FFF5F8`       | -           |
| Secondary   | `#DBE1E2`     | `#2B2F2F`        | `#A4B3B7`    | `#A8939F`    | `#17101A`       | `#3D3039`   |
| Outline     | `#F2CCD8`     | `#BE003C`        | `#D8668A`    | `#F9E6EC`    | `#980030`       | `#E599B1`   |
| Ghost       | `#DBE1E2`     | `#424849`        | -            | `#A8939F`    | `#17101A`       | -           |
| Destructive | `#AE1820`     | `#FFFFFF`        | -            | `#E14B53`    | `#FFFFFF`       | -           |

## Properties

Figma properties:

```text
Variant
State
Label
Show leading icon
Leading icon
Show trailing icon
Trailing icon
```

Property contract (framework-neutral — every framework package exposes these, named and typed identically in spirit):

```text
variant   enum: primary | accent | secondary | outline | ghost | destructive
size      enum: sm | md | lg | xl (default: md)
disabled  boolean
iconStart renderable content (icon)
iconEnd   renderable content (icon)
```

Reference implementation — React (`@lumen/ui`, `packages/ui/src/primitives/Button.tsx`):

```ts
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "accent" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg" | "xl";
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
}
```

## Behavior

- Activation occurs through pointer click, Enter, or Space.
- Disabled buttons do not receive interaction.
- Focus-visible treatment appears for keyboard navigation.
- Navigation uses a semantic link component rather than Button.
- Destructive or irreversible actions use `destructive` and should use
  confirmation when consequences are significant.

## Content

- Use concise, action-oriented labels.
- Begin with a verb where practical.
- Avoid generic labels such as “Click here.”
- Avoid truncating critical action labels.
- Account for localization expansion.

## Tokens

Required token structure:

```text
Button/{Variant}/Background/{State}
Button/{Variant}/Text/{State}
Button/{Variant}/Icon/{State}
Button/{Variant}/Border/{State}

Button/Radius
Button/Border/Width
Button/Focus/Ring/Width
Button/Focus/Ring/Offset
Button/Focus/Ring/Color
```

Runtime roles use the generated `--color-button-*` semantic variables. Every
role has light and dark values sourced from node `1027:3733`.

## Accessibility

- Use `<button>` for actions.
- Use `<a>` for navigation.
- Do not rely on color alone for disabled states.
- Focus must remain visible.
- Touch target should meet the approved minimum target size.

## Storybook

Required stories:

```text
Playground
Final Variant Collection (all six variants and four states, light and dark)
Icon Positions
Sizes
```

The React Storybook implements all four required stories.

## Testing

- activation by click, Enter, and Space
- disabled behavior
- accessible name
- focus-visible behavior
- variant rendering
- icon alignment
- dark mode
- reduced motion
- visual regression

---

# 6. Icon Button

> Superseded 2026-07-29: §54 is the Figma-sourced, implemented
> specification. This section's Purpose/Requirements prose remains the
> intent the component serves; the Variants/Sizes lists and the
> `variant="danger"` example below predate any real evidence and don't
> match the shipped API — §54's `default | destructive | outline |
> secondary | ghost | link` variant set (reusing `Button`'s own live token
> family) replaces `Primary | Secondary | Ghost | Danger | AI` below.

## Purpose

Icon Button provides a compact control for a familiar action represented by an icon.

## Variants

```text
Primary
Secondary
Ghost
Danger
AI
```

## Sizes

```text
Sm
Md
Lg
```

## Requirements

- Accessible name is mandatory.
- Tooltip is recommended when the meaning is not universally clear.
- Icon and control target sizes must remain separate.
- Loading must not cause layout shift.
- Destructive icon buttons require clear context or confirmation.

## Reference implementation (React)

```tsx
<IconButton aria-label="Delete record" icon={<TrashIcon />} variant="danger" size="md" />
```

---

# 7. Link

## Purpose

Link navigates users to another destination or resource.

## Variants

```text
Default
Subtle
Inverse
Danger
```

## States

```text
Default
Hover
Pressed
Focus
Visited
Disabled
```

## Requirements

- Use a semantic anchor for navigation.
- Provide visible focus.
- Do not remove underlines unless another persistent affordance exists.
- External links should be communicated when opening a new context.
- Disabled links should normally be rendered as non-interactive text rather than inaccessible anchors.

---

# 8. Form Field

## Purpose

Form Field combines a label, control, supporting text, validation message, and required indicator into a consistent accessible unit.

## Anatomy

```text
Form Field
├── Label row
│   ├── Label
│   ├── Required indicator
│   └── Optional text
├── Control
├── Supporting text
└── Validation message
```

## States

```text
Default
Focus
Disabled
Read Only
Invalid
Success
Warning
```

## Requirements

- Label must be programmatically associated with the control.
- Validation message must be associated using `aria-describedby`.
- Invalid controls must use `aria-invalid`.
- Required status must be conveyed semantically.
- Supporting and error text must remain distinguishable without color alone.

---

# 9. Text Input

## Purpose

Text Input collects a single line of user-entered text.

## Variants

```text
Default
Search
```

## Sizes

```text
Sm
Md
Lg
```

## States

```text
Default
Hover
Focus
Invalid
```

## Anatomy

```text
Input
├── Container
├── Leading icon
├── Input text
├── Placeholder
├── Trailing action
└── Focus ring
```

## Behavior

- Placeholder does not replace a label.
- Clear action must be keyboard accessible.
- Password visibility toggle requires an accessible name.
- Search input may use a clear action and submit behavior.
- Read-only and disabled must remain visually distinct.

## Figma and code mapping

- Source: Lumen AI Design System node `1262:1181`.
- Dark base-role source: canonical desktop dark AppShell node `1127:4197`,
  header Input instance `I1119:3337;1079:1884` and AI Panel Input instance
  `I1166:4827;1337:2450`. These instances define the shared dark default/search
  background (`#0E0B0E`), border (`#3D3039`), and placeholder/search icon
  (`#A8939F`). Dark hover, focus, and invalid states remain provisional.
- `size="sm" | "md" | "lg"` maps to 36px, 44px, and 60px control heights.
- `variant="search"` adds the 14px search icon, search surface roles, and an
  optional keyboard-shortcut badge; `leadingIcon` may replace the default glyph.
- `invalid` maps the Error state and sets `aria-invalid`.
- Numeric `size` values continue to pass through to the native HTML input
  attribute; string values select Lumen visual geometry.
- Disabled and read-only remain native HTML behaviors. They are supported by
  the component API but are not part of this Figma collection's four-state matrix.

---

# 10. Select and Combobox

## Purpose

Select chooses one value from a predefined list. Combobox supports typed filtering or freeform input where approved.

## States

```text
Closed
Open
Focus
Disabled
Read Only
Invalid
Loading
No Results
```

## Keyboard behavior

- Arrow keys move through options.
- Enter confirms the active option.
- Escape closes without committing.
- Home and End navigate where supported.
- Typed search follows the selected interaction model.

## Accessibility

Use the correct select or combobox semantics. Do not recreate complex behavior without an established accessible primitive.

---

# 11. Checkbox

## Purpose

Checkbox allows independent selection of one or more options.

## States

```text
Unchecked
Checked
Indeterminate
Hover
Focus
Disabled
Invalid
```

## Sizes

```text
Sm — 24px target, 16px indicator
Md — 28px target, 18.667px indicator
Lg — 32px target, 21.333px indicator
```

Figma source: node `1278:2207`. `invalid` maps Error, `indeterminate` sets the
native DOM property, and Disabled remains the native `disabled` behavior.
Checked and Indeterminate render their exact size-specific Figma-exported SVGs
as image assets, including the published per-size X/Y placement offsets. This
preserves each glyph's bounds, rounded caps, and bold stroke instead of
stretching the generic 24px `CheckIcon` or converting the source to a mask.
Difference blending preserves the source's white-on-black light appearance and
the provisional inverse dark treatment. Both states use the
`input.radio-checkbox.*` roles.

## Requirements

- Label must be clickable.
- Indeterminate must be exposed programmatically.
- Group labels should use fieldset and legend where appropriate.
- Checked state must not rely on color alone.

---

# 12. Radio Group

## Purpose

Radio Group allows one selection from a mutually exclusive set.

## Requirements

- Use one tab stop for the group.
- Arrow keys move selection.
- A visible group label is required.
- Do not use a Radio Group for multi-select behavior.

Individual `Radio` controls use Figma node `1278:2153`: `sm`, `md`, and `lg`
provide 24px, 28px, and 32px targets around exact 16px, 18.667px, and 21.333px
indicators. Default, Hover, Focused, Selected, Disabled, and Error appearances
bind to the shared `input.primary.*` and `input.radio-checkbox.*` roles. Error
is visual on the control; semantic validation belongs on the containing
radiogroup/fieldset because `aria-invalid` is not supported on role `radio`.

---

# 13. Switch

## Purpose

Switch controls an immediate binary setting.

## States

```text
Off
On
Hover
Focus
Disabled
```

## Requirements

- Use for immediate state changes.
- Use Checkbox when the choice is submitted with a form.
- Label must describe the setting, not the current state.
- Expose checked state programmatically.

---

# 14. Badge

## Purpose

Badge communicates compact status, classification, or metadata.

## Variants

```text
Default
Gray
Success
Warning
Error
Deep Purple
Purple
Light Blue
Yellow
Pink
```

## Sizes

```text
Sm — 11/16 medium label, 8px inline and 2px block padding, 6px dot
Md — 12/18 medium label, 10px inline and 4px block padding, 7px dot
Lg — 14/20 medium label, 12px inline and 6px block padding, 8px dot
```

Figma source: node `1079:893`. All statuses bind component-scoped
`badge.{status}.{bg,text}` roles. Figma publishes only the light variables;
dark aliases use the repository's provisional ramp-mirroring convention.
`showDot` controls the decorative leading status dot and defaults to `true`.
`status` is the canonical variant prop. The former `tone` API remains as a
compatibility alias; `neutral` maps to `gray`, while legacy `brand` and `info`
remain available for existing consumers but are not part of the current Figma
collection.

## Requirements

- Do not use Badge as an interactive control unless explicitly implemented as one.
- Status must not rely solely on color.
- Keep labels concise.
- Use the status dot as reinforcement only; the label must carry the meaning.

---

# 15. Alert

## Purpose

Alert communicates important contextual feedback.

## Variants

```text
Info
Success
Warning
Danger
AI
```

## Anatomy

```text
Alert
├── Status icon
├── Title
├── Description
├── Actions
└── Dismiss action
```

## Behavior

- Persistent alerts remain until resolved or dismissed.
- Temporary feedback should use Toast.
- Urgent errors may use an assertive live region.
- Dismiss actions require accessible labels.

---

# 16. Toast

> Replaced 2026-07-29: §53 is the Figma-sourced, implemented specification.
> This section's purpose/behavior prose remains the intent the component
> serves; the aspirational "Danger" naming below is superseded by §53's
> shipped `error` tone value.

## Purpose

Toast communicates brief, non-blocking feedback following an action.

## Variants

```text
Neutral
Info
Success
Warning
Danger
```

## Behavior

- Do not use Toast for information users must retain.
- Provide sufficient reading time.
- Pause dismissal on hover or focus where auto-dismiss is used.
- Keep actionable toasts keyboard accessible.
- Avoid stacking excessive messages.
- Announce content through an appropriate live region.

---

# 17. Tooltip

## Purpose

Tooltip provides concise supplementary information for a focused or hovered trigger.

## Requirements

- Must appear on hover and keyboard focus.
- Must dismiss on Escape.
- Must not contain essential information unavailable elsewhere.
- Avoid interactive content inside a standard tooltip.
- Use Popover for interactive supplementary content.

---

# 18. Dialog

## Purpose

Dialog focuses attention on a task, decision, or critical information.

## Variants

```text
Modal
Non-modal
Alert Dialog
```

## Sizes

```text
Sm
Md
Lg
Full Screen
```

## Requirements

- Move focus into the dialog when opened.
- Trap focus for modal dialogs.
- Return focus to the trigger when closed.
- Support Escape unless the workflow explicitly prevents dismissal.
- Provide an accessible name and optional description.
- Destructive confirmations should use Alert Dialog behavior.

---

# 19. Drawer

## Purpose

Drawer provides contextual tasks or details without fully replacing the current page.

## Positions

```text
Start
End
Bottom
```

## Requirements

- Modal and non-modal behavior must be explicit.
- Focus behavior must match the selected modality.
- Content must support scrolling without hiding critical actions.
- Responsive behavior may convert a side drawer into a bottom sheet.

---

# 20. Tabs

## Purpose

Tabs switch between related content views within the same context.

## Variants

```text
Underline
Contained
Pill
```

## Keyboard behavior

- Arrow keys move focus.
- Home and End move to first and last tabs.
- Activation may be automatic or manual, but the behavior must be consistent.
- Selected tab must be programmatically exposed.

---

# 21. Accordion

## Purpose

Accordion progressively discloses sections of related content.

## Requirements

- Trigger uses a button.
- Expanded state uses `aria-expanded`.
- Panel association uses `aria-controls`.
- Multiple-open and single-open behavior must be explicit.
- Do not hide information that users need to compare simultaneously.

---

# 22. Breadcrumb

## Purpose

Breadcrumb communicates hierarchy and supports navigation to parent levels.

## Requirements

- Use semantic navigation.
- Mark the current page using `aria-current="page"`.
- Do not make the current page link to itself.
- Support truncation without removing critical hierarchy.

---

# 23. Pagination

## Purpose

Pagination navigates a large result set divided into pages.

## Requirements

- Current page must be exposed programmatically.
- Previous and Next controls require accessible names.
- Disabled boundary controls must not be interactive.
- Preserve search and filter state across pages.
- Consider cursor-based navigation for large or changing datasets.

---

# 24. Table

## Purpose

Table displays structured data with meaningful row and column relationships.

## Variants

```text
Standard
Compact
Comfortable
Selectable
Sortable
```

## States

```text
Loading
Empty
Error
Partial
Selected
Disabled Row
```

## Requirements

- Use semantic table markup for tabular data.
- Headers must identify scope.
- Sorting state must be announced.
- Row selection must have accessible labels.
- Do not place unrelated layout content in a data table.
- Sticky headers and columns must preserve keyboard and screen-reader usability.

---

# 25. Data Grid

## Purpose

Data Grid supports advanced enterprise interaction with large datasets.

## Capabilities

Optional capabilities include:

```text
Sorting
Filtering
Column resizing
Column reordering
Row selection
Bulk actions
Inline editing
Grouping
Pinning
Virtualization
Export
```

## Requirements

- Data and interaction state must remain separable from presentation.
- Keyboard navigation must be fully specified.
- Virtualization must not prevent assistive-technology access.
- Empty, loading, error, and partial states are required.
- Density must use approved tokens.
- Capabilities must be additive and individually testable.

---

# 26. Card

## Purpose

Card groups related information and actions.

## Variants

```text
Default
Interactive
Selected
Elevated
Outlined
```

## Requirements

- Do not make the entire card interactive when it contains multiple independent actions.
- Use heading hierarchy correctly.
- Preserve clear action priority.
- Interactive cards require focus treatment and semantic interaction.

---

# 27. Empty State

## Purpose

Empty State explains why content is unavailable and provides an appropriate next step.

## Types

```text
First Use
No Results
No Data
Permission Restricted
Error
Filtered Empty
```

## Anatomy

```text
Illustration or icon
Title
Description
Primary action
Secondary action
```

## Requirements

- Explain the cause when known.
- Provide a meaningful recovery action.
- Avoid blaming the user.
- Do not use decorative empty states for loading.

---

# 28. Skeleton and Spinner

## Skeleton

Use when the approximate content structure is known.

Requirements:

- Match the expected layout.
- Avoid excessive animation.
- Respect reduced motion.
- Do not present skeleton content to assistive technology as real content.

## Spinner

Use for indeterminate progress when structure is unknown or the affected region is small.

Requirements:

- Provide an accessible status label when the wait is meaningful.
- Avoid blocking the entire page unnecessarily.
- Preserve control dimensions when used inside buttons.

---

# 29. Progress

## Types

```text
Linear
Circular
Determinate
Indeterminate
Stepped
```

## Requirements

- Determinate progress exposes current value, minimum, and maximum.
- Provide a text equivalent where useful.
- Use Stepper for discrete workflow stages.
- Do not use progress indicators as decorative animation.

---

# 30. AI Action Button

## Status

This section predates any AI-specific Figma component and was aspirational
when written. On 2026-07-14, Figma published a real "AI Communication
Component Library" (node `760:1965`) and it was implemented as `AIButton`
(`packages/ui/src/primitives/AIButton.tsx`) — see §46 for the reconciled,
Figma-sourced specification. The Variants and States below do not match the
real component and are kept only as a historical record of the pre-Figma
design intent:

- Variants: Figma ships `Primary AI | Primary Raised AI | Secondary AI |
Tertiary AI | Outline AI | Link AI`, not `Primary AI | Secondary AI |
Ghost AI | Icon AI` — there is no
  "Ghost AI"; "Icon AI" is an `iconOnly` modifier in the real component
  rather than a variant.
- States: Figma's real AI Button has its own Default/Hover/Active/Focus/
  Disabled/Loading and Success/Error/Warning states (see §46) — not an
  AI-process state machine (Idle/Generating/Streaming/Complete/Needs
  Review/Cancelled/Unavailable). Those AI-process states may still be the
  right model for a future AI _response_ surface (see
  `docs/component-architecture.md` §8's `AIResponse`/`AIStatus` primitives,
  still unbuilt) — they just aren't what the Button-shaped trigger control
  implements.

## Purpose

AI Action Button initiates an explicit AI-assisted action while keeping the user in control.

## Examples

```text
Summarize
Draft
Rewrite
Fix Grammar
Explain Data
Generate Report
Extract Information
Auto-Triage
Next Best Action
```

## Requirements

- Clearly communicate that the action is AI-assisted.
- Provide generation status.
- Allow cancellation when operations are lengthy.
- Preserve user-authored content.
- Provide edit, accept, reject, regenerate, and undo where applicable.
- Avoid implying certainty when output is probabilistic.
- Use the AI visual treatment consistently and sparingly.

These requirements remain aspirational guidance for a future AI response
surface; §46 documents which of them the shipped `AIButton` trigger control
actually satisfies today.

---

# 31. AI Response Panel

> Superseded 2026-07-29: §56 (`AIResponseCard`) is the Figma-sourced,
> implemented specification, named after Figma's own literal label
> ("AI Response Card") rather than "AI Response Panel". This section's
> purpose/requirements remain the intent the component serves; its anatomy
> list below predates any real evidence and doesn't fully match the shipped
> anatomy — §56 documents what's actually evidenced and shipped. Edit/
> Accept/Reject/Feedback controls remain unbuilt — not evidenced by node
> `1484:2905`, not invented.

## Purpose

AI Response Panel presents generated content, evidence, status, and human-review controls.

## Anatomy

```text
Header
AI status
Generated response
Sources or citations
Confidence or limitations
Feedback controls
Edit action
Accept action
Reject action
Regenerate action
```

## Requirements

- Identify generated content.
- Show sources where available.
- Support correction and human review.
- Preserve an audit trail for high-impact workflows.
- Clearly distinguish system content from user-authored content.
- Provide error and partial-result states.

---

# 32. AI Confidence Indicator

## Purpose

AI Confidence Indicator communicates model certainty only where the metric is meaningful and calibrated.

## Requirements

- Do not present arbitrary confidence values.
- Pair numeric confidence with explanatory language.
- Do not use color alone.
- Clarify whether confidence applies to a field, record, or complete response.
- Provide guidance for low-confidence outcomes.

---

# 33. File Upload

## Purpose

File Upload supports selecting, dropping, validating, and processing files.

## States

```text
Idle
Drag Active
Uploading
Processing
Complete
Warning
Error
Cancelled
```

## Requirements

- Support keyboard file selection.
- Communicate accepted formats and limits.
- Show per-file status when multiple files are uploaded.
- Provide retry and removal actions.
- Announce validation errors.
- Do not rely only on drag and drop.

---

# 34. Search Field

## Purpose

Search Field initiates or filters search results.

## Behavior models

```text
Submit search
Live filtering
Autocomplete
Command search
```

The selected model must be documented.

## Requirements

- Provide a visible or accessible label.
- Clear action must be accessible.
- Loading and no-results states must be supported.
- Debounce live search responsibly.
- Preserve user input during errors.

---

# 35. Menu and Dropdown

## Purpose

Menu presents a collection of actions. Dropdown is a general placement pattern and must use the correct internal semantics.

## Menu item types

```text
Action
Checkbox item
Radio item
Submenu
Separator
Label
```

## Requirements

- Use roving focus.
- Support Arrow keys, Enter, Space, Escape, Home, and End.
- Disabled items remain perceivable but not actionable.
- Do not use menu semantics for ordinary navigation lists without menu behavior.

---

# 36. Command Palette

## Purpose

Command Palette provides keyboard-first access to actions and destinations.

## Requirements

- Support search, grouping, and keyboard navigation.
- Clearly distinguish navigation from actions.
- Show shortcuts where available.
- Announce result count and active result.
- Preserve focus and return it on close.
- Support empty and loading states.

---

# 37. Component Storybook contract

Every stable component page must contain:

```text
Overview
Figma source
Purpose
Anatomy
Variants
Sizes
States
Properties
Behavior
Content guidance
Accessibility
Token references
Examples
Do and Don't
Change history
```

Every stable component must include stories for:

```text
Default
All variants
All sizes
All applicable states
Dark mode
Long content
Localization
Keyboard focus
Accessibility
Edge cases
```

---

# 38. Testing contract

## Unit

Test:

- rendering
- props
- events
- state transitions
- controlled and uncontrolled behavior

## Accessibility

Test:

- semantics
- accessible names
- keyboard interaction
- focus behavior
- ARIA state
- automated accessibility rules

## Visual regression

Test:

- variants
- sizes
- states
- themes
- density
- responsive layouts

## Integration

Use for:

- focus-managed overlays
- forms
- menus
- grids
- AI streaming
- upload workflows
- multi-component patterns

---

# 39. Component maturity

Use:

```text
Draft
Experimental
Beta
Stable
Deprecated
Removed
```

A component can be Stable only when:

- Figma is approved or published
- token mappings are complete
- code API is reviewed
- accessibility is validated
- tests pass
- Storybook documentation is complete
- Figma and code are synchronized
- changelog is updated

---

# 40. Claude Code update protocol

Before implementation, read:

```text
AGENTS.md
docs/figma-source.md
docs/design-tokens.md
docs/component-architecture.md
docs/component-specifications.md
docs/changelog.md
```

Then:

1. Read the latest `[Unreleased]` section.
2. Identify the exact component-specific Figma node.
3. Inspect the existing component, stories, tests, and token dependencies.
4. Compare only the documented delta.
5. Update only affected files.
6. Preserve existing APIs unless a breaking change is approved.
7. Run validation.
8. Report unresolved differences.
9. Never regenerate the entire design system.
10. Never invent missing Figma values or properties.

## Reusable prompt

```markdown
Read:

- `docs/figma-source.md`
- `docs/design-tokens.md`
- `docs/component-architecture.md`
- `docs/component-specifications.md`
- `docs/changelog.md`

Apply only the changes under `[Unreleased]`.

Use the component-specific Figma URL as the source of truth.
Update only affected tokens, component source, Storybook stories, tests, documentation, and exports.

Preserve existing APIs and unrelated files.
Do not regenerate the design system.
Do not infer missing values, states, variants, or behavior.

Run type checks, tests, accessibility checks, Storybook build, and visual regression checks.
Report changed files, validation results, and unresolved Figma-to-code differences.
```

---

# 41. Component specification template

```markdown
# [Component Name]

## Status

[Draft | Experimental | Beta | Stable | Deprecated]

## Figma source

- URL:
- Node ID:
- Component set:
- Last synchronized:

## Purpose

## When to use

## When not to use

## Anatomy

## Variants

## Sizes

## States

## Figma properties

## Property contract

Framework-neutral property names, types, and meanings.

## Reference implementation (React)

The current shipped implementation of the property contract above. Add one additional "Reference implementation ([Framework])" section per additional framework package once it ships.

## Behavior

## Content guidance

## Token dependencies

## Accessibility

## Responsive behavior

## Storybook stories

## Tests

## Code mapping

## Known limitations

## Change history
```

---

# 42. Current verification status

Verified from the supplied Figma Design Tokens node:

- foundation section structure
- typography sizes and line heights visible in the canvas
- spacing scale
- radius scale
- presence of color and scale documentation

Not yet verified:

- complete component inventory
- component-set node IDs
- component properties
- button sizes and measurements
- exact component color aliases
- component-specific token mappings
- component Code Connect mappings
- complete Light and Dark mode behavior

A component-specific Figma Dev Mode URL is required before Claude Code should implement or materially update that component.

---

# 43. Split Button — 2026-07-14 expansion

`packages/ui/src/composite/SplitButton.tsx` (not previously given its own
numbered section in this document) grew past its original `lg`-only,
Primary/Raised/Secondary scope. Sourced from node `555:300` via
`get_design_context` on the sm/md size instances and the Outline type
instances.

## Sizes

```text
Sm (36px)
Md (40px)
Lg (48px, previous default, preserved as the component default)
```

## Variants

```text
Primary
Raised
Secondary
Outline   (new — reuses Secondary's border/text/divider tokens but shows
           the border at rest, using the new brand.border-strong token)
```

## Properties added

```text
size        enum: sm | md | lg (default lg)
iconStart   renderable content (icon), rendered before the label
```

## Known limitation

Figma's `sm` dropdown-toggle segment is a non-square 30px width against a
36px-tall container; 30px isn't on the approved spacing scale
(`docs/design-tokens.md` §4), so the shipped `sm` dropdown segment is
squared off to 36px (`--spacing-36`) instead of inventing a new token for
one edge case. Flagged for design-system review rather than silently
matched pixel-for-pixel.

## Change history

- 2026-07-14: added `size` (sm/md/lg) and the `outline` variant; added an
  optional `iconStart` slot. Source: Lumen-AI-Design-System node `555:300`.

---

# 44. Filter Chip

## Status

Baseline specification, added 2026-07-14.

## Figma source

- Node: `581:409` ("Filter Chip", Buttons page)
- Component set: Filter Chip
- Last synchronized: 2026-07-14

## Purpose

A toggleable pill representing a filter that can be added to or removed
from an active filter set.

## When to use

- Faceted search and filtering UIs where a user builds up a set of active
  filters.

## When not to use

- A single, mutually-exclusive choice — use Choice Chip instead.
- A persistent on/off setting unrelated to filtering — use Switch.

## Anatomy

```text
Filter Chip
├── Leading icon (plus, unselected; retained when selected per Figma)
├── Label
├── Trailing icon (remove/X, selected only)
└── Focus ring
```

## Variants

None — Filter Chip has no `variant` property, only the `selected` state
below.

## Sizes

```text
Lg (36px) — the only size Figma specs.
```

## States

```text
Default
Hover
Selected
Hover+Selected
Focus
Disabled
```

`Pressed`/`Active` was not found as a distinct instance in the sourced
node; not implemented.

## Properties

Figma properties: `Label`, `State` (Default/Selected/Hover/Hover+Selected/
Focus/Disabled), `Size` (Lg only), `chipAddIcon` (instance swap),
`chipDeleteIcon` (instance swap, Selected only).

Property contract (framework-neutral):

```text
selected    boolean
disabled    boolean
icon        renderable content (icon), leading — defaults to the Figma-specced plus glyph
removeIcon  renderable content (icon), trailing, shown only when selected — defaults to an X glyph
```

## Reference implementation (React)

```ts
export interface FilterChipProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "disabled"
> {
  selected?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  removeIcon?: React.ReactNode;
}
```

Source: `packages/ui/src/primitives/FilterChip.tsx`.

## Behavior

- Clicking toggles the caller's `selected` state via `onClick` — the
  component is presentation-only and does not manage selection state
  itself (consistent with `onClick`-driven components elsewhere in this
  package, e.g. `SplitButton`).
- Disabled chips do not receive interaction.

## Content

Use short, scannable filter-category labels (e.g. "Status", "Owner").

## Tokens

```text
Color/Brand/Border-Strong  (new, primary.200 — unselected border)
Color/Brand/Default        (selected fill/border)
Color/Brand/Subtle         (unselected hover fill/border)
Color/Brand/Hover          (selected hover fill/border)
Radius/Full
Spacing/36 (height), Spacing/12, Spacing/16, Spacing/6 (gap)
```

## Accessibility

- Renders a native `<button>` with `aria-pressed` reflecting `selected`.
- Uses `aria-disabled` rather than the native `disabled` attribute,
  matching the Buttons page's "02 Accessibility & WCAG 2.1" guidance
  already followed by Button and SplitButton, so a disabled chip stays
  keyboard-reachable.
- Icons are `aria-hidden`; the accessible name comes from the label text.

## Storybook

`Primitives/FilterChip`: Playground, States (Default/Selected/Disabled),
Interactive (stateful toggle demo).

## Testing

`packages/ui/src/primitives/FilterChip.test.tsx`: default render, selected
aria-pressed, unselected aria-pressed, icon count by selection state,
onClick, disabled behavior, padding by selection state.

## Code mapping

| Framework | Export       | Source                                      |
| --------- | ------------ | ------------------------------------------- |
| React     | `FilterChip` | `packages/ui/src/primitives/FilterChip.tsx` |

## Known limitations

- Only the `lg` size is implemented — no other size is specced in Figma.
- `Pressed`/`Active` interaction state not found in the sourced Figma
  instances.

## Change history

- 2026-07-14: added, sourced from node `581:409`.

---

# 45. Choice Chip

## Status

Baseline specification, added 2026-07-14.

## Figma source

- Node: `581:485` ("Choice Chip", Buttons page)
- Component set: Choice Chip
- Last synchronized: 2026-07-14

## Purpose

A toggleable pill representing one value in a single-choice set (visually
similar to Filter Chip, semantically a selection rather than a filter
add/remove action).

## When to use

- A small set of mutually-exclusive options presented as pills rather than
  a Radio Group (e.g. size pickers, quick filters with a single active
  value).

## When not to use

- A multi-select, addable/removable filter — use Filter Chip.
- A large option set better served by Select or Radio Group.

## Anatomy

```text
Choice Chip
├── Leading icon (check, selected only)
├── Label
└── Focus ring
```

## Variants

None — no `variant` property, only the `selected` state below.

## Sizes

```text
Lg (36px) — the only size Figma specs.
```

## States

```text
Default
Selected
```

Hover/Focus/Disabled were not independently sourced for Choice Chip but
reuse the identical semantic tokens Filter Chip's corresponding states use
(`--button/border/secondary/default`, `--button/surface`, `--button/
surface/disabled`, etc. — confirmed identical token names across both
components' Default/Selected instances), so the same treatment is applied
in code. Flagged as inferred-by-consistency, not independently verified
per-state.

## Properties

Figma properties: `Label`, `State` (Default/Selected), `Size` (Lg only).

Property contract (framework-neutral):

```text
selected  boolean
disabled  boolean
```

## Reference implementation (React)

```ts
export interface ChoiceChipProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "disabled"
> {
  selected?: boolean;
  disabled?: boolean;
}
```

Source: `packages/ui/src/primitives/ChoiceChip.tsx`.

## Behavior

- Clicking toggles the caller's `selected` state via `onClick` — same
  presentation-only pattern as Filter Chip.
- Disabled chips do not receive interaction.

## Content

Use short option labels (e.g. "Small", "Medium", "Large").

## Tokens

Same token set as Filter Chip (see §44) — Choice Chip's Default/Selected
instances bind identical variable names.

## Accessibility

Same pattern as Filter Chip: native `<button>` with `aria-pressed`,
`aria-disabled` instead of the native `disabled` attribute.

## Storybook

`Primitives/ChoiceChip`: Playground, States (Default/Selected/Disabled),
SingleChoiceGroup (stateful single-selection demo).

## Testing

`packages/ui/src/primitives/ChoiceChip.test.tsx`: default render (no
icon), selected render (check icon), aria-pressed, onClick, disabled
behavior.

## Code mapping

| Framework | Export       | Source                                      |
| --------- | ------------ | ------------------------------------------- |
| React     | `ChoiceChip` | `packages/ui/src/primitives/ChoiceChip.tsx` |

## Known limitations

- Only the `lg` size is implemented.
- Hover/Focus/Disabled states are inferred from Filter Chip's identical
  token usage, not independently sourced from Choice-Chip-specific Figma
  instances for every state.

## Change history

- 2026-07-14: added, sourced from node `581:485`.

---

# 46. AI Button

> Replaced 2026-07-23: the canonical contract is the “One AI button, every
> capability” collection at Figma node `760:1965`. The legacy details below
> are retained only as pre-release history and no longer describe the shipped
> API.

## Canonical contract

- Variants: `primary | secondary | ghost | outline | destructive`
- Sizes: `sm | md | lg | xl` = 30/34/38/42px
- Modifiers: `iconOnly`, `isLoading`, and React `split`
- Split variants: Primary, Secondary, and Outline, with separately focusable
  main and dropdown actions and the shared four-option AI capability menu
- Loading: spinner replaces the leading icon while “Generating...” remains
  visible
- Capability catalog: the exact four Figma categories and 24 labels,
  descriptions, and glyphs in `ai-capabilities.ts`
- Storybook: `AI Components/One AI Button, Every Capability` (`Playground`
  and the fullscreen `Library` reference composition)
- Removed: Raised, Tertiary, Link, status tints, legacy 32/36/40/48px
  `xs/sm/md/lg`, behavioral-only `destructive`, and
  `AIButtonComponentLibrary.mdx`
- React source: `packages/ui/src/primitives/AIButton.tsx`
- Web Components source:
  `packages/web-components/src/ai-button/lumen-ai-button.ts`
- Angular source: `packages/angular/src/ai-button/lumen-ai-button.ts`

## Status

Baseline specification, added 2026-07-14. Supersedes the variant/state
lists in §30 "AI Action Button" (see that section's Status note) — §30's
purpose/examples/requirements prose remains the intent this component
serves; only its old, pre-Figma variant and state lists were wrong.

## Figma source

- Nodes: `760:1965` ("AI Communication Component Library", Buttons page);
  `1046:1875` (Split Button AI dropdown menu)
- Component set: AI Button (Primary/Secondary/Tertiary/Outline AI, plus
  Icon-Only and Split Button AI sub-sections)
- Last synchronized: 2026-07-15 — re-verified the leading-icon instance
  swap on the Secondary Icon Only AI sub-section (`get_design_context`
  showed a component explicitly named `lm-aisymbol`, nodes `843:7818`–
  `843:7824`); the initial 2026-07-14 sync had approximated this as a
  generic sparkle glyph before that instance swap was visible
- Dropdown synchronized 2026-07-23 from node `1046:1875`: 12px radius,
  8px vertical inset, 32px rows, 16px inline padding, 10px icon gap, 14px
  icons, and regular 14/16 text. The original 200px frame width was
  subsequently made content-driven by user direction.

## Split dropdown

Every React `split` treatment opens the same built-in capability menu:
AI Summarize, AI Rewrite, AI Fix Grammar, and AI Translate. Consumers may
replace that ordered subset with `dropdownOptions` and receive the selected
catalog entry through `onDropdownOptionSelect`. `onDropdownClick` continues
to report activation of the chevron segment.

The menu width is automatic. Up to eight option rows are visible; additional
options remain available through vertical overflow. Its compact scrollbar is
visually hidden at rest and appears only while the menu is hovered or contains
keyboard focus. Menus with eight or fewer options do not show a scrollbar.

The trigger supports Enter/Space through native button behavior and opens
with Arrow Down or Arrow Up. Within the menu, Arrow keys wrap, Home/End jump
to the first/last option, Escape closes and returns focus, Tab closes, and
pointer interaction outside closes the menu.

## Purpose

Initiates an explicit AI-assisted action while keeping the user in
control — see §30 for the full purpose/examples/requirements narrative
this component implements.

## When to use

- A single, explicit, user-initiated AI action (e.g. "Summarize", "Draft
  reply") — see the Capability Catalog story for the full set of example
  actions Figma documents, grouped by category.

## When not to use

- An implicit or automatic AI action the user didn't request.
- Presenting AI-generated output itself — use a future `AIResponsePanel`
  (still unbuilt, see `docs/component-architecture.md` §8).

## Anatomy

```text
AI Button
├── Leading icon (`lm-aisymbol` by default, swappable per capability —
│   mandatory, every Figma instance has one)
├── Label
├── Loading indicator (replaces the leading icon)
└── Focus ring
```

## Variants

```text
Primary
Raised
Secondary  (filled-tint look: brand-subtle fill + brand-border-strong
            border — not the final standard Button `secondary`)
Tertiary   (AI-specific legacy treatment; no final standard Button equivalent)
Outline    (AI-specific brand-border-strong treatment)
Link       (AI-specific underlined treatment)
```

## Modifiers

### Icon only

Square, label-less button showing just the leading icon. Documented in
Figma as its own "Icon Only" sub-section (Primary/Secondary/Outline, 3
sizes each) rather than a variant — modeled here as `iconOnly`. The final
standard Button collection has no icon-only modifier.

### Destructive

Behavioral only. Figma's "Destructive AI" instance uses the exact same
surface/border/text tokens as Secondary AI — there is no dedicated color.
Callers must add their own confirmation step before invoking `onClick`
when `destructive` is set; the prop documents intent for calling code and
sets `data-destructive` for hook-in, but changes no styling itself.

## Sizes

```text
Xs
Sm
Md
Lg
```

Retains the independently sourced 32/36/40/48px AI Button size scale. Figma's
`xs` AI Button is 28px tall and remains a known limitation. This scale is not
derived from the standard Button's 30/34/38/42px `sm`/`md`/`lg`/`xl` scale.

## States

```text
Default
Hover
Pressed
Focus
Disabled
Loading
```

The AI Button's own States sub-section under node `760:1965` also defines
Success, Warning, and Error. `AIButton` implements these as an independent
`status` modifier; this specialized status API is not part of the final
standard Button collection.

## Properties

Figma properties (per the AI Button instances on node `760:1965`):
`Type` (Primary/Raised/Secondary/Tertiary/Outline/Link), `Size` (Xs/Sm/Md/Lg), `State`,
`Label`, an instance-swappable leading icon.

Property contract (framework-neutral):

```text
variant     enum: primary | raised | secondary | tertiary | outline | link
size        enum: xs | sm | md | lg
status      enum: success | warning | error, optional
icon        renderable content (icon) — always rendered; defaults to the `lm-aisymbol` glyph
iconOnly    boolean
loading     boolean
disabled    boolean
destructive boolean (behavioral only — no visual change)
capability  string (React only, see Known limitations) — not a Figma property;
            looks up a shared capability catalog (`packages/ui/src/primitives/
            ai-capabilities.ts`) for a default label/icon, and stamps
            `data-capability`/`data-ai-analytics-event` for a consuming app's
            own action/tracking hook-in. Explicit `icon`/label props still win.
```

## Reference implementation (React)

```ts
export interface AIButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "raised" | "secondary" | "tertiary" | "outline" | "link";
  size?: "xs" | "sm" | "md" | "lg";
  status?: "success" | "warning" | "error";
  icon?: React.ReactNode;
  isLoading?: boolean;
  iconOnly?: boolean;
  destructive?: boolean;
}
```

Source: `packages/ui/src/primitives/AIButton.tsx`. Not a variant of
the final standard `Button` — it retains a separately sourced variant, size,
loading, status, and icon-only contract.

## Behavior

- Activation uses pointer click, Enter, or Space; `aria-disabled` (not the native `disabled` attribute)
  so a disabled AI Button stays keyboard-reachable; loading preserves
  width and prevents duplicate activation.
- Loading swaps the leading icon for a spinner and is expected to pair
  with a label change (e.g. "Generating…") — confirmed via the Loading AI
  Figma instance, otherwise identical to Primary AI.
- Destructive AI actions require confirmation before running, same rule
  the same confirmation principle as standard destructive actions —
  `destructive` only marks intent, the caller owns the
  confirmation UI.

## Content

Same content guidance as Button (§5) — concise, action-oriented labels,
verb-first where practical.

## Tokens

```text
Color/Brand/Default, Hover, Pressed          (primary variant)
Color/Brand/Subtle, Subtle-Pressed           (secondary/tertiary/outline fills)
Color/Brand/Border-Strong                    (secondary/outline border, new — see Split Button §43)
Radius/Lg
Spacing/32,36,40,48 (heights), /8 (icon gap), /10,12,16,20 (padding)
```

No new tokens were required beyond `brand.border-strong`, already added
for Split Button's Outline type (§43).

## Accessibility

Same accessibility contract as Button (§5): native `<button>`,
`aria-disabled`, `aria-busy` while loading, mandatory `aria-label` for
icon-only instances (dev-mode console warning if omitted).

## Storybook

`AI Components/AI Button` (renamed 2026-07-15 from `Primitives/AIButton`):
Playground, All Variants, Sizes, Icon Only, Custom Icon, Loading,
Destructive, Disabled, By Capability, and a Capability Catalog composition
story (the category → example-action mapping from node `860:9109`, shown
as a story rather than a new `packages/patterns` pattern — see Known
limitations; both capability stories are now data-driven from
`packages/ui/src/primitives/ai-capabilities.ts` rather than a hardcoded
local array).

`AI Components/AI Button Component Library`
(`packages/ui/src/primitives/AIButtonComponentLibrary.mdx`, new
2026-07-15): a standalone documentation page reproducing the Figma AI
Communication Component Library's layout — Hero, Component Variants,
Sizes, States, Capability Catalog, Best Practices, Accessibility, Design
Tokens, Do & Don't, Code Examples, plus a Split Button AI "not yet
implemented" note. Built entirely from `<Canvas of={...}>` embeds of the
real stories above (no screenshots) so it can't drift from the actual
component.

## Testing

`packages/ui/src/primitives/AIButton.test.tsx`: label + default icon
render, onClick, disabled behavior, loading aria-disabled/aria-busy,
loading blocks onClick, icon-only accessible-name warning, all four
variants render, destructive data-attribute, custom icon override,
capability label/icon resolution and override precedence, capability
data-attributes, capability icon-only aria-label fallback, unrecognized
capability dev warning + fallback.

`packages/ui/src/primitives/ai-capabilities.test.ts` (new): catalog
data-integrity checks (every entry has a label/description/category/
analyticsEvent/icon, ids are unique) and `getAICapability` lookup
behavior.

## Code mapping

| Framework | Export                                                                | Source                                          |
| --------- | --------------------------------------------------------------------- | ----------------------------------------------- |
| React     | `AIButton`                                                            | `packages/ui/src/primitives/AIButton.tsx`       |
| React     | `aiCapabilities`, `AICapability`, `AICapabilityId`, `getAICapability` | `packages/ui/src/primitives/ai-capabilities.ts` |

## Known limitations

- `status` (Success/Warning/Error) not implemented — see States above.
- `xs` size is 32px tall in code vs. Figma's 28px — see Sizes above.
- The Capability Catalog is shown only as a Storybook story (now data-
  driven, see Storybook above), not shipped as a `packages/patterns`
  composition — it has no interaction behavior beyond the individual
  `AIButton`s themselves, so promoting it to a real pattern was deferred
  pending a concrete consumer need.
- `capability` is React-only — `@lumen/web-components`'s `<lumen-ai-button>`
  and `@lumen/angular`'s `LumenAIButtonComponent` don't yet have an
  equivalent property/input; parity is a tracked follow-up, matching this
  repo's established pattern of shipping a React change first and bringing
  the other two frameworks to parity in a separate PR.
- `capability`'s icon-per-action mapping is an editorial choice, not
  literally specified in Figma — the Capability Catalog frame (node
  `860:9109`) uses the default `lm-aisymbol` glyph on every instance with
  no per-action icon override documented there.

## Change history

- 2026-07-14: added, sourced from node `760:1965`.
- 2026-07-23: corrected `split` Primary/Secondary/Outline segment geometry
  from updated node `817:9861` (`1381:854`–`1381:856`). The main action now
  owns the 8px top-left/bottom-left corners and the dropdown action owns the
  8px top-right/bottom-right corners; inner corners remain square.
- 2026-07-23: added the built-in four-option dropdown menu to all React
  `split` treatments from node `1046:1875`, including keyboard navigation,
  outside-click dismissal, `dropdownOptions`, and
  `onDropdownOptionSelect`.
- 2026-07-23: changed the menu to automatic content width and capped its
  visible area at eight rows, with an interaction-only compact scrollbar
  for longer option sets.
- 2026-07-15: added the `capability` prop and its backing
  `ai-capabilities.ts` catalog (React only), renamed the Storybook category
  from `Primitives/AIButton` to `AI Components/AI Button`, refactored the
  Capability Catalog story to be data-driven, and added the
  `AI Components/AI Button Component Library` documentation page.

# 47. KPICard

## Status

Stable specification, corrected against the canonical light/dark variants on 2026-07-22.

## Figma source

- Node: `1197:1652` ("appshell-desktop-closed-light" reference screen),
  instances `1102:6521`-`1102:6523`
- Last synchronized: 2026-07-20

## Purpose

A metric tile — a short label, a large value, and an optional colored
delta line — for dashboard-style KPI rows.

## When to use

- Summarizing a small number (2-4) of top-line metrics at the head of a
  dashboard or report page.

## When not to use

- A generic bordered container for arbitrary content — use `Card`. `Card`
  was reviewed before adding this component; its fixed 8px radius, flat
  24px padding, and lack of elevation don't cover this shape without new
  props, so this ships standalone per the "extend before duplicate" rule
  rather than overloading `Card`.

## Anatomy

```text
KPICard
├── Label
├── Value
└── Delta (optional, colored by tone)
```

## Variants

None — no `variant` property.

## Sizes

None — single size, matching the sourced Figma instances.

## States

Static content only; no interactive states.

## Properties

Property contract (framework-neutral):

```text
label       string, required
value       string, required
delta       string, optional — free text so callers compose their own delta glyph/copy
deltaTone   "success" | "warning" | "error", optional, default "success"
```

## Tokens

```text
color.border.subtle           (new, see docs/design-tokens.md and the
                                2026-07-20 changelog entry)
color.background.default
color.text.secondary          (new)
color.text.body
color.status.{success,warning,error}
shadow.elevation.sm           (new — first entry in the generic Elevation
                                scale docs/design-tokens.md §6 calls for)
radius.xl (12px)
spacing.{4,16,20}
```

## Known limitations

- Typography rounds to the nearest existing type-scale tier rather than
  adding one-off entries: label uses `label-md` (12px/18, weight 600 —
  Figma specs 12px/16, weight 500); value uses `headline-lg` (32px/42 —
  Figma specs 32px/40).
- The success-delta background color used by the sourced instance
  (`bg/status-success` #E5F9EC) is close to but not an exact match for the
  existing `status.success-subtle` token (green.50, #E6F7E6) — observed,
  not acted on pending direct re-verification.
- Cross-framework parity: `@lumen/web-components`'s `<lumen-kpi-card>` and
  `@lumen/angular`'s `LumenKPICardComponent` ship the same contract
  (2026-07-20) — no Storybook coverage for those two yet, see each
  package's README.

## Reference implementation (React)

```ts
export interface KPICardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: "success" | "warning" | "error";
}
```

Source: `packages/ui/src/primitives/KPICard.tsx`.

## Storybook

`Primitives/KPICard` — Playground, Row (three-up), WithoutDelta.

## Testing

Unit tests cover label/value rendering and conditional delta rendering.
No accessibility-specific behavior beyond standard text contrast (static
content, no interactive semantics).

## Change history

- 2026-07-20: added, sourced from node `1197:1652`.

# 48. Theme Toggle

## Status

Baseline specification, added 2026-07-20.

## Figma source

- Canonical AppShell page: `1007:3700`
- Light Theme Toggle: `1079:1723`
- Dark Theme Toggle: `1330:2282`
- Verified in desktop and tablet compositions: `1127:4196`, `1127:4197`,
  `1175:2521`, and `1175:2522`
- Last synchronized: 2026-07-22

## Purpose

A Sun/Moon pill switch for toggling Light/Dark theme, typically placed in
an app header's right-actions area.

## When to use

- Exactly one Light/Dark theme control per application shell.

## When not to use

- A generic on/off setting — use `Switch`.

## Anatomy

```text
Theme Toggle
├── Track
├── Sun cell (selected in Light mode)
└── Moon cell (selected in Dark mode)
```

## Variants

None.

## Sizes

None — single size, matching the sourced instance.

## States

```text
Default (Light)
Checked (Dark)
Focus
Disabled (native input semantics)
```

## Properties

Property contract (framework-neutral): a boolean toggle exposed through
native checkbox/switch semantics (`checked`, `onChange`, `disabled`,
`name`, `id`) — the same accessible-toggle approach `Switch` already uses,
not a new interaction model.

## Tokens

```text
color.app-shell.toggle-track
color.app-shell.toggle-on-action
color.app-shell.toggle-on-bg
color.app-shell.toggle-off-action
color.app-shell.toggle-off-bg
color.border.focus
spacing.{2,20,24,32,54}
```

The four committed 20px Figma exports embed the exact selected/unselected
visuals for Light Sun, Light Moon, Dark Sun, and Dark Moon. Their fills and
strokes are the rendered output of the five `btn/toggle/*` mode roles above;
the track continues to bind `toggle-track` directly at runtime.

## Known limitations

- Figma publishes Light and Dark visual modes but no separate disabled or
  pressed visual. Native disabled semantics and the shared focus ring remain
  the framework-neutral behavior for those states.
- Cross-framework parity: `@lumen/web-components`'s `<lumen-theme-toggle>`
  fires a bubbling, composed `lumen-change` `CustomEvent` (a native
  `change` on the internal `<input>` can't cross the shadow boundary);
  `@lumen/angular`'s `LumenThemeToggleComponent` exposes a `checkedChange`
  `EventEmitter` for `[(checked)]` two-way binding — both complete as of
  2026-07-20, no Storybook coverage for either yet.

## Reference implementation (React)

```ts
export interface ThemeToggleProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {}
```

Native checkbox props (`checked`, `defaultChecked`, `onChange`, `disabled`,
`name`, `id`, `aria-label`) pass through directly.

Source: `packages/ui/src/primitives/ThemeToggle.tsx`.

## Storybook

`Primitives/ThemeToggle` — Light, Dark, Interactive.

## Testing

Unit tests cover the default accessible name, `aria-label` override,
click-to-toggle behavior, label/input association, exact 54px track, fixed
cell positions, and the four directly rendered 20px Figma assets in all three
frameworks.

## Change history

- 2026-07-20: added, sourced from node `1197:1652`.
- 2026-07-22: corrected from a 56px sliding-thumb approximation to the exact
  54px fixed two-cell Light/Dark design from nodes `1079:1723` and `1330:2282`.
- 2026-07-22: replaced duplicated inline path markup with the four exact
  committed Light/Dark Figma exports across React, Web Components, and Angular.

# 49. Page Header

## Status

Baseline specification, added 2026-07-20.

## Figma source

- Node: `1197:1652` ("appshell-desktop-closed-light" reference screen),
  instance `1102:6519`
- Last synchronized: 2026-07-20

## Purpose

The standard page-level header for content pages: breadcrumbs, a title
with trailing actions, and an optional description line.

## When to use

- The top of any content page inside `AppShell`, especially list/detail/
  dashboard patterns.

## When not to use

- A component-level header (e.g. inside `Card` or `Dialog`) — those have
  their own, smaller-scoped header conventions.

## Anatomy

```text
Page Header
├── Breadcrumbs (optional)
├── Title (h1) + Actions (optional, trailing)
└── Description (optional)
```

Breadcrumbs render inline within this component rather than composing the
separately-specified Breadcrumb component (§22) — a reconciliation between
the two is a tracked follow-up, not done in this pass.

## Variants

None.

## Sizes

None.

## States

Static layout; no interactive states of its own (actions are typically
`Button` instances, which carry their own states).

## Properties

Property contract (framework-neutral):

```text
breadcrumbs   array of { label, href? }, optional — last entry (or any
              entry without href) renders as the current page
title         string, required
description   string, optional
actions       renderable content, optional, trailing next to the title
```

## Accessibility

- Breadcrumbs render as a `<nav aria-label="Breadcrumb">` with the current
  page marked `aria-current="page"`.
- Title renders as a native `<h1>`.

## Tokens

```text
color.text.title (title)
color.text.secondary (breadcrumbs, description — new token)
color.text.muted (breadcrumb separators)
color.text.body (current breadcrumb)
spacing.{6,8,10,16,20,24,32}
```

## Known limitations

- Typography rounds to the nearest existing type-scale tier: title uses
  `headline-md` (24px/32 — exact match); breadcrumbs round to `label-md`
  (12px/18, weight 600 — Figma specs 12px/16, weight 400); description
  rounds to `body-xs` (12px/20 — Figma specs 13px/20).
- React only — no cross-framework equivalent; this and `Footer`/`AppShell`
  `rail` variant/`DashboardPage` are page/layout-level, not expected to
  need Web Components/Angular parity the way primitives do (`@lumen/patterns`
  is React-only per `CLAUDE.md`).

## Reference implementation (React)

```ts
export interface Breadcrumb {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  breadcrumbs?: Breadcrumb[];
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}
```

Source: `packages/ui/src/composite/PageHeader.tsx`.

## Storybook

`Composite/PageHeader` — Playground, WithoutBreadcrumbs, WithoutActions.

## Testing

Unit tests cover the h1 title, breadcrumb nav landmark with
`aria-current`, description rendering, actions rendering, and omission of
the breadcrumb nav when not provided.

## Change history

- 2026-07-20: added, sourced from node `1197:1652`.

# 50. Footer

## Status

Baseline specification, added 2026-07-20.

## Figma source

- Node: `1197:1652` ("appshell-desktop-closed-light" reference screen),
  instance `1102:6529`
- Last synchronized: 2026-07-20

## Purpose

The app-shell bottom bar: platform version, a live-status indicator, and a
trailing link row.

## When to use

- Once per `AppShell`, passed via `AppShell`'s new `footer` prop.

## When not to use

- Page-level or section-level footers — compose those from other
  primitives instead.

## Anatomy

```text
Footer
├── Version text (optional)
├── Status indicator: dot + label (optional)
├── Spacer
└── Links (optional)
```

## Variants

None.

## Sizes

None.

## States

`statusTone` (`success | warning | error`) changes the status dot's color
only; not an interaction state.

## Properties

Property contract (framework-neutral):

```text
version       string, optional
statusLabel   string, optional
statusTone    "success" | "warning" | "error", optional, default "success"
links         array of { label, href }, optional
```

## Accessibility

Renders as a native `<footer>` (accessible `contentinfo` landmark). Links
render as real `<a>` elements per `docs/accessibility.md`'s "navigation
uses a link, not a button."

## Tokens

```text
color.background.default
color.border.default
color.text.muted
color.status.{success,warning,error}
spacing.{6,10,16,24}
```

## Known limitations

- The link list (Privacy/Terms/Security in the sourced instance) is
  generalized as a `links` prop since those are page-specific, not a fixed
  Lumen contract.
- Cross-framework parity: `@lumen/web-components`'s `<lumen-footer>`
  (2026-07-20) projects the link row through a default `<slot>` styled via
  `::slotted(a)`; `@lumen/angular`'s `LumenFooterComponent` projects the
  same content via `<ng-content>` but leaves it unstyled by default — no
  non-deprecated `::slotted` equivalent exists under Angular's emulated
  view encapsulation, so the consumer applies its own link styling. No
  Storybook coverage for either yet.

## Reference implementation (React)

```ts
export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  version?: string;
  statusLabel?: string;
  statusTone?: "success" | "warning" | "error";
  links?: FooterLink[];
}
```

Source: `packages/ui/src/layout/Footer.tsx`.

## Storybook

`Layout/Footer` — Playground, StatusTones.

## Testing

Unit tests cover the `contentinfo` landmark, version/status text
rendering, link rendering as real anchors, and omission of version/status
when not provided.

## Change history

- 2026-07-20: added, sourced from node `1197:1652`.

# 51. AI Panel

## Status

Baseline specification, added 2026-07-20.

## Figma source

- Node: `1007:3700` (canonical "AppShell" page), `AIPanel` component
  `1079:3141`, re-verified against the `Breakpoint=Desktop/Theme=Light`
  composition `1127:4196`, instance `1119:3351`
- Last synchronized: 2026-07-20

## Purpose

A persistent right-side assistant chat panel within an application shell —
header, a scrollable conversation, and a message input.

## When to use

- Alongside `AppShell`'s content area, for AI-assisted workflows where the
  assistant should stay visible while the user works the primary content.

## When not to use

- A one-off AI response inline in page content — use `AIResponse`/
  `AIConfidence` (§31–32) instead.
- A modal or transient AI interaction — this is a persistent panel, not an
  overlay.

## Anatomy

```text
AI Panel
├── Header
│   ├── Icon
│   ├── Title ("Assistant")
│   └── "+Thread" control (optional)
├── Conversation
│   ├── User prompt bubble (right-aligned)
│   └── Assistant response bubble (left-aligned)
│       └── Action buttons (optional, e.g. "Review draft")
└── Input row
    ├── Standard Input (`size="sm"`)
    └── Standard accent Button (icon-only send action)
```

## Variants

None.

## Sizes

None — fixed 304px width, matching the sourced instance.

## States

Conversation content is caller-supplied (`messages` prop); the panel itself
has no state beyond the text input's own value.

## Properties

Property contract (framework-neutral):

```text
title            string, optional, default "Assistant"
messages         array of { role: "user" | "assistant", content, actions? }, required
inputPlaceholder string, optional
onSend           (value: string) => void, optional — called with the trimmed input value on submit
onNewThread      () => void, optional — shows the "+Thread" control when provided
```

## Behavior

- Submitting the input (Enter or the send button) calls `onSend` with the
  trimmed value and clears the input; empty/whitespace-only submissions are
  ignored.
- The panel does not manage conversation state itself — the caller owns
  `messages` and appends to it in response to `onSend`.
- Use the final standard `Button variant="secondary"` for actions below an
  assistant response (Button node `1027:3733`).
- Compose the input row from the standard `Input size="sm"` and an icon-only
  `Button variant="accent"`; do not recreate either primitive with native,
  hand-styled elements.

## Accessibility

- The message list is exposed as `role="log"` with `aria-label="Conversation"`
  and `aria-live="polite"` so new messages are announced without being
  overly disruptive — not independently verified with a screen reader this
  pass; manual review recommended before marking Stable (`docs/
accessibility.md` §20/§21 requires manual screen-reader testing for
  critical interactions).
- The input has a visually-hidden `<label>` ("Message") rather than relying
  on the placeholder as a label, per `docs/accessibility.md` §9.
- The send button has `aria-label="Send message"` (icon-only).

## Content guidance

- Keep assistant responses concise; long responses should still read
  naturally inside a 304px-wide bubble.
- Action button labels should be specific verbs ("Review draft"), not
  generic ("OK").

## Tokens

```text
color.background.default / color.background.subtle
color.background.prompt      (new — user prompt bubble fill)
color.background.badge       (new — "+Thread" control fill)
color.text.link-subtle       (new — "+Thread" control text)
color.border.default / color.border.table (new — response bubble border)
color.border.input           (new — text input border)
color.border.focus
color.app-shell.button-secondary-bg / -border / -text
```

## Known limitations

- React only — no `@lumen/web-components`/`@lumen/angular` equivalent;
  not expected, this is a composite/layout-level piece like `PageHeader`,
  not a primitive.
- Screen-reader behavior for the live region is not independently verified.

## Reference implementation (React)

```ts
export interface AIPanelMessage {
  role: "user" | "assistant";
  content: React.ReactNode;
  actions?: React.ReactNode;
}

export interface AIPanelProps {
  title?: string;
  messages: AIPanelMessage[];
  inputPlaceholder?: string;
  onSend?: (value: string) => void;
  onNewThread?: () => void;
  className?: string;
}
```

Source: `packages/ui/src/composite/AIPanel.tsx`.

## Storybook

`AI Components/AIPanel` — Playground, Interactive, Empty. Moved from `Composite/AIPanel` 2026-07-27 (grouped with the other AI-specific components in Storybook's sidebar).

## Testing

Unit tests cover title/message rendering, assistant-message actions, the
conditional "+Thread" control, submit-and-clear behavior, empty-submission
rejection, and the labeled live region.

## Change history

- 2026-07-20: added, sourced from node `1007:3700`.
- 2026-07-20: standardized inline response actions on the final secondary
  Button from node `1027:3733`.
- 2026-07-22: replaced the hand-styled message input and send control with
  the standard `Input` and icon-only accent `Button`; the AppShell header
  search fixture now also composes the standard `Input`.
- 2026-07-22: scoped the shared Input roles through AppShell so the AI query
  field retains the exact dark background, border, and placeholder colors.

---

# 52. ContentState

## Status

Baseline specification, added 2026-07-28.

## Figma source

- Node: `1174:1355` ("ContentState" component set)
- Variants: `1073:4486` (Empty), `1073:4484` (Loading), `1073:4483` (Error)
- Verified with `get_metadata`, `get_design_context`, `get_variable_defs`,
  and `get_motion_context`
- Last synchronized: 2026-07-28

## Purpose

The full-region state a content area shows *instead of* its content:
nothing to show yet, still loading, or failed to load.

## When to use

- A page body, panel, or route-level region with no content to render.
- The wait before that region's data arrives.
- The failure when it doesn't.

## When not to use

- Inside a card, table, or other surface — use `EmptyState`, which is the
  inline treatment. `ContentState` paints the app-canvas background
  (`color.background.app`) and will look wrong on a raised surface.
- A transient, dismissible failure — use `Toast` or `Alert`.
- A single loading placeholder with no surrounding layout — use `Skeleton`
  directly.

## Anatomy

```text
ContentState (state = empty | error)
├── Icon badge (circular, 64px)
│   └── Icon slot, or the variant's own fallback glyph
├── Title            (content-state-title)
├── Description      (optional)
└── Action slot      (optional — a standard Button)

ContentState (state = loading)
├── Visually hidden live-region label
└── Skeleton (default anatomy, or a caller-supplied replacement)
    ├── Title bar
    ├── Subtitle bar
    ├── 3 cards  x 3 bars
    └── 3 rows   x 4 bars
```

## Variants

`state` is the only variant property, mapping 1:1 onto Figma's:

```text
empty    (default)
loading
error
```

`loading` ignores `title`, `description`, `icon`, and `action` entirely —
its accessible name comes from `loadingLabel`.

## Sizes

None. Figma publishes a single 600x400 frame. The shipped component is
fluid (`width: 100%`) with a 400px min-height — see "Known differences".

## States

No interactive states. `ContentState` is not itself focusable or
interactive; interactivity lives in whatever is passed to `action`.

## Motion

The loading skeleton's pulse is exact from Figma's own keyframe data: a 2s
loop, opacity 1 -> 0.4 -> 1 with `ease-in-out` on the dip segments, and
five stagger offsets (0/150/300/450/600ms) that produce a wave rather than
a single synchronized flash. Implemented as one shared `@keyframes
lumen-skeleton-pulse` plus a per-bar `animation-delay`, both emitted from
`packages/tokens/src/motion.json` by the token build. Deliberately not
Tailwind's `animate-pulse`, whose 0.5 dim stop is close but wrong; the
shared `Skeleton` primitive keeps `animate-pulse` and is unchanged.

## Accessibility

Figma carries no accessibility annotations on any of the three variants,
so all of the following are code-side decisions:

- `loading` is a `role="status"` region with `aria-live="polite"` and
  `aria-busy="true"`. Every placeholder bar is `aria-hidden`, so the only
  thing announced is the visually hidden `loadingLabel` — a screen-reader
  user hears "Loading projects", not twenty anonymous placeholders.
- `error` is `role="alert"`: a load failure is an unrequested, interruptive
  change. `empty` gets no live semantics — it is an expected result.
- The pulse stops entirely under `prefers-reduced-motion: reduce`, holding
  every bar at full opacity. Loading is never signaled by animation alone;
  the live region carries it.
- Both icon badges are `aria-hidden` — they are decorative, and the title
  already carries the meaning.

## Design tokens

```text
color.background.app          (new — canvas, all three variants)
color.background.raised       (skeleton cards/rows)
color.background.nav-active   (empty icon badge fill)
color.border.table            (skeleton bar fill)
color.border.subtle           (skeleton card/row border)
color.text.body               (title)
color.text.tertiary           (new — empty description)
color.text.secondary          (error description, empty glyph stroke)
color.status.error-subtle     (error badge fill)
color.status.error            (error glyph)
typography.content-state-title (new)
radius.sm / md / lg / xl / full
motion.duration.skeleton-pulse / easing.skeleton-pulse /
  opacity.skeleton-pulse-* / stagger.skeleton-step-*  (all new)
content-state.*               (new — skeleton bar geometry)
```

## Known differences from Figma

Recorded rather than silently closed — see `docs/figma-sync.md`:

- **Fluid width.** Figma frames this at a fixed 600x400 and publishes no
  breakpoint evidence. The component fills its container instead, with the
  400px height applied as a min-height.
- **Empty CTA fill.** Figma binds the Empty variant's button fill to a raw
  `--lumen-dark/default` (#231C24) rather than to any `btn/*` variable,
  unlike the Error variant's correctly-bound `btn/destructive/default/bg`.
  Treated as a Figma authoring gap; both CTAs use the standard `Button`,
  and no #231C24 button token was added.
- **`text/body` shade.** This set's `text/body` reads #424849
  (lumen-gray.800); the generic `text.body` role is neutral.700 (#393939).
  Reused as-is rather than re-pointing a token with 9+ consumers — the same
  call already recorded for the AI EmptyState frame.
- **Dark mode.** This set publishes Light only. Dark values are ramp
  mirrors, not Figma-authored.

## Known limitations

- React only. `@lumen/web-components` and `@lumen/angular` ship neither
  `EmptyState` nor `Skeleton`, so parity would require porting the
  dependency chain first — an explicit deferral, not undetected drift.
- Screen-reader announcement behavior is covered structurally by unit
  tests, not verified with a real screen reader.
- No visual-regression coverage; the repo has no such tooling configured.

## Reference implementation (React)

```ts
export type ContentStateStatus = "empty" | "loading" | "error";

export interface ContentStateProps {
  state?: ContentStateStatus;
  title?: string;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  loadingLabel?: string;
  skeleton?: React.ReactNode;
  className?: string;
}
```

Source: `packages/ui/src/composite/ContentState.tsx`.

## Storybook

`Composite/ContentState` — Default, Playground, State: Empty, State:
Loading, State: Error, VariantCollection, Responsive, CustomSkeleton,
Do / Don't.

## Testing

17 unit tests covering: default state; title/description/icon/action slots
per variant; the empty and error fallback glyphs; the tertiary-vs-secondary
description roles; `role="alert"` on error and its absence on empty; the
loading live region's `aria-live`/`aria-busy`; the default and overridden
`loadingLabel`; `aria-hidden` on every bar; the default skeleton's 23-bar
anatomy; the token-sourced per-bar stagger delays; `animate-none` replacing
`animate-pulse`; the caller-supplied `skeleton` override; loading ignoring
the empty/error props; and the app-canvas background across all three
states.

## Change history

- 2026-07-28: added, sourced from node `1174:1355`.

---

# 53. Toast

## Status

Baseline specification, added 2026-07-29.

## Figma source

- Node: `1475:5100` ("Toast" frame)
- Instances: `1475:5099` (Default/Info), `1475:5101` (Variant2/Warning),
  `1475:5115` (Variant3/Error)
- Verified with `get_metadata`, `get_design_context`, `get_variable_defs`;
  `get_motion_context` returned no keyframe data — this frame is a static
  mockup, not an animated prototype
- Last synchronized: 2026-07-29

## Purpose

Brief, non-blocking feedback following an action — see §16 for the full
purpose/behavior narrative this component implements.

## When to use

- Confirming an action succeeded, failed, or needs attention, without
  blocking the user's current task.

## When not to use

- Information the user must retain — use `Alert` (persistent) instead.
- A full-region load failure — use `ContentState`'s `error` state.

## Anatomy

```text
Toast
├── Status icon        (info/warning/error only — Figma-evidenced)
├── Title
├── Description         (optional)
├── Close button        (top-right)
└── Progress bar         (bottom edge, animated countdown)
```

## Variants

`tone` maps onto Figma's 3 built instances plus 2 pre-existing,
Figma-unevidenced values carried over unchanged from the prior
implementation:

```text
info       Figma-evidenced (Default instance)
warning    Figma-evidenced (Variant2)
error      Figma-evidenced (Variant3)
success    not in this Figma node — pre-existing generic treatment, unchanged
neutral    not in this Figma node — pre-existing generic treatment, unchanged
```

`success`/`neutral` render no default status icon (nothing to match in
Figma); a caller can still pass `icon` explicitly for either.

## Sizes

None. Figma specs one fixed 450px card width, used directly as the
component's width (`toast.width` token) — unlike `ContentState`, a
floating notification card is the expected fixed-width pattern here, not a
region that should fill its container.

## States

No Figma-authored interaction states beyond the always-present anatomy.
Two code-side behavioral states, both direct user instruction (not
Figma-sourced — see "Known differences"):

```text
running   default — 6s countdown timer + animated progress bar
paused    on hover or keyboard focus — timer and bar both freeze,
          then resume from where they left off
```

## Properties

Figma properties: none exposed as component properties on this frame (3
separate instances, not a component-set with variant properties).

Property contract (framework-neutral):

```text
title        string, required
description  string, optional
tone         enum: neutral | info | success | warning | error (default: neutral)
icon         renderable content (icon), optional — overrides the tone's
             default icon; pass null to force no icon
```

## Reference implementation (React)

```ts
export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  tone?: "neutral" | "info" | "success" | "warning" | "error";
  icon?: React.ReactNode;
}
```

`useToast().push(toast)` adds a toast; `ToastProvider` renders the stack and
owns each toast's auto-dismiss lifecycle. Source:
`packages/ui/src/composite/Toast.tsx`.

## Behavior

- Auto-dismisses after 6 seconds (`motion.duration.toast`).
- The bottom progress bar animates from 100% to 0% width over the same 6
  seconds (`lumen-toast-progress` keyframes, emitted by the token build).
- Hovering or focusing a toast pauses both the dismiss timer and the
  progress-bar animation; leaving/blurring resumes both from the remaining
  time, not a full reset.
- The close button dismisses immediately, independent of the timer.
- `prefers-reduced-motion: reduce` freezes the progress bar at a static
  full width; the dismiss timer is JS-driven and keeps running regardless,
  so the toast's own disappearance remains the non-animated status cue.

## Content

- Keep titles short and specific; use description for supporting detail.
- Avoid duplicating the title in the description.

## Tokens

```text
color.toast.title-text     (new)
color.toast.info-accent    (new — exact Figma blue.500, #2563EB; kept as a
                             distinct Toast-scoped token even though
                             status.info now resolves to this same value
                             — see semantic/color.json's _toastComment)
color.status.warning       (reused, exact)
color.status.error         (reused, exact)
color.status.success       (reused — not Figma-evidenced for Toast)
color.border.default       (reused, exact — frame border and neutral accent)
color.background.raised    (reused, exact — card background)
color.text.secondary       (reused, exact — description)
typography.input-lg        (reused, exact — "Body/Medium Bold" title)
typography.body-sm         (reused, exact — "Body/Small" description)
radius.lg                  (reused, exact)
shadow.toast.default        (new — exact two-layer drop shadow)
motion.duration.toast       (new — user-directed, not Figma-sourced)
toast.*                     (new — width, icon-size, close-size,
                             progress-height, accent-width geometry)
```

## Accessibility

- `role="status"` on each toast card; content is announced through a
  polite live region.
- Focus is never moved to a toast automatically.
- The close button has an explicit accessible name ("Dismiss notification")
  and is a native `<button>`, reachable by keyboard independent of the
  auto-dismiss timer.
- Status icons are `aria-hidden` — decorative reinforcement; the title text
  carries the meaning, not color or icon alone.
- Hover/focus pausing satisfies "pause dismissal on hover or focus where
  auto-dismiss is used" (§16, `docs/accessibility.md` §19).
- Reduced motion removes the animated cue but not the underlying timer, so
  dismissal timing is unaffected — see "Behavior".

## Responsive behavior

Fixed 450px width, per Figma. Not tested at narrow viewports as part of
this sync (no Figma breakpoint evidence for Toast).

## Storybook stories

`Composite/Toast` — Playground (all 5 tones), AllTones (info/warning/error
stacked with distinct contextual copy), PauseOnHover, ManualDismiss.

## Tests

`packages/ui/src/composite/Toast.test.tsx`: `useToast` outside a provider
throws; a pushed toast renders with `role="status"`; default icon presence
per tone (info/warning/error yes, success/neutral no); caller-supplied
icon overrides for any tone; the close button's accessible name and click
dismissal; the 6-second auto-dismiss boundary; hover pause/resume; focus
pause/resume.

## Code mapping

| Framework | Export                    | Source                                  |
| --------- | ------------------------- | ---------------------------------------- |
| React     | `ToastProvider`/`useToast` | `packages/ui/src/composite/Toast.tsx`    |

## Known differences from Figma

Recorded rather than silently closed — see `docs/figma-sync.md`:

- **6-second duration and progress-bar animation are not Figma-sourced.**
  `get_motion_context` returned no keyframe data on this node; the 3
  instances are a static illustration of the countdown concept (different
  snapshot bar widths), not an animated prototype. Duration and animation
  are direct user instruction.
- **Icon size (28px) overrides the Figma-read 24px.** Direct user
  instruction, applied after the initial sync.
- **`success`/`neutral` tones have no Figma instance in this node.** They
  keep their pre-existing generic colors and render no default icon, rather
  than an invented Figma-styled treatment.
- **`status.info`/`status.info-subtle` mismatch — resolved 2026-08-02.**
  At the time of this sync, this frame's evidenced info color (then named
  `sky.500`, #2563EB) didn't match the existing generic `status.info`
  (the old, stale `blue.500`, #0E17FF) — a gap `docs/figma-sync.md` §18
  flagged as unresolved, so the value was added as its own Toast-scoped
  `toast.info-accent` rather than repointing the shared token. A later
  same-day Figma token refresh renamed `sky`→`blue` (the real Figma name)
  and repointed `status.info`/`status.info-subtle` to this exact ramp —
  `status.info` and `toast.info-accent` now both resolve to `#2563EB`.
  `toast.info-accent` is kept as its own token rather than collapsed into
  `status.info`, since no existing consumer was repointed.
- **Drop shadow bypasses Tailwind's `shadow-[...]` arbitrary-value
  utility.** `shadow-[var(--shadow-toast-default)]` compiles to a shadow
  *color* hint (`--tw-shadow-color`), not the full shadow value, so nothing
  renders — a pre-existing, repo-wide Tailwind parsing issue also present
  in `Card`/`Popover`/`DropdownMenu`/`Command`/etc.'s identical
  `shadow-[var(--shadow-menu-default)]`/`shadow-[var(--shadow-elevation-sm)]`
  usages, confirmed in the built Storybook CSS. Fixed for `Toast` only via
  a direct inline `boxShadow` style; the repo-wide fix is out of this
  sync's scope.

## Known limitations

- React only. `@lumen/web-components` and `@lumen/angular` are
  Button-only proofs of concept; no Toast equivalent exists there — an
  explicit deferral, not drift.
- No visual-regression coverage; the repo has no such tooling configured.
- Not verified with a real screen reader.

## Change history

- 2026-07-29: added, sourced from node `1475:5100`. Icon size adjusted to
  28px per direct user instruction after the initial sync.

---

# 54. IconButton

## Status

Baseline specification, added 2026-07-29. Supersedes §6's Variants/Sizes
lists — see that section's Status note.

## Figma source

- Node: `1034:4459` ("Sizes" reference frame)
- Instance: `1035:4738` ("Icon Only - light")
- Verified with `get_metadata`, `get_design_context`, `get_variable_defs`
- Last synchronized: 2026-07-29

## Purpose

A compact control for a familiar action represented by an icon alone — see
§6 for the full purpose/requirements narrative this component implements.

## When to use

- A familiar, unambiguous action in a compact space (toolbar, table row,
  card header) where a labeled `Button` would be too wide.

## When not to use

- The action's meaning isn't universally clear without a label — use
  `Button` with a visible label instead, or pair with a tooltip.

## Anatomy

```text
IconButton
└── Icon slot (aria-hidden — the accessible name comes from aria-label)
```

## Variants

Reuses `Button`'s live variant vocabulary and `--color-button-*` token
family directly — the same shadcn-adapted set `Button` and `AIButton`
already share:

```text
default
destructive
outline
secondary   (default — the only variant with a literal Figma instance)
ghost
link
```

Only `secondary` at `size="md"` matches the Figma "Icon Only - light"
instance exactly. The other five variants reuse the same already-Figma-synced
`--color-button-*` roles applied to this new icon-only geometry —
consistent by construction, not independently sourced per variant.

## Sizes

```text
sm    30px, 12px icon
md    34px, 14px icon   (default — the only size with a literal Figma instance)
lg    38px, 16px icon
xl    42px, 18px icon
```

Heights reuse the same `--spacing-{30,34,38,42}` tokens `AIButton` and this
same Figma frame's Primary Button sizes use. Icon-glyph sizes at
`sm`/`lg`/`xl` are inferred by consistency with this frame's Primary Button
icon sizes (12/16/18px) — not independently sourced icon-only instances.

## States

```text
Default
Hover     (via Button's existing per-variant hover tokens)
Focus     (Button's shared focus-ring token)
Disabled  (native disabled attribute; Button's disabled tokens)
```

No Loading state — not evidenced by this Figma instance, not implemented.

## Properties

Figma properties: none exposed as component properties on this frame (a
single instance alongside the four Button sizes, not a component-set with
variant properties).

Property contract (framework-neutral):

```text
icon      renderable content (icon), required — IconButton has no text label
variant   enum: default | destructive | outline | secondary | ghost | link (default: secondary)
size      enum: sm | md | lg | xl (default: md)
disabled  boolean
```

Plus every native `<button>` attribute (`onClick`, `type`, `aria-label`,
`aria-labelledby`, etc.).

## Reference implementation (React)

```ts
export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  icon: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "sm" | "md" | "lg" | "xl";
}
```

Source: `packages/ui/src/primitives/IconButton.tsx`.

```tsx
<IconButton aria-label="Delete record" icon={<TrashIcon />} variant="destructive" size="md" />
```

## Behavior

- Native `<button type="button">` — never submits an enclosing form.
- Disabled buttons do not receive interaction (native `disabled` attribute).
- Focus-visible treatment uses the shared `--color-button-focus-ring` token.

## Content

- No visible label. The accessible name is the only text a screen-reader
  user gets — keep it a short, specific verb phrase ("Delete record"), not
  a generic one ("More").

## Tokens

```text
color.button.{variant}-{bg,on-action,border,hover-*}   (reused, exact —
                                                          same tokens Button/AIButton use)
radius.lg                                               (reused, exact — 8px)
icon-button.border-width                                (new — 1.5px, exact)
icon-button.icon-size-{sm,md,lg,xl}                     (new — md exact,
                                                          sm/lg/xl inferred by consistency)
spacing.{30,34,38,42}                                   (reused, exact — same scale as AIButton)
```

## Accessibility

- An accessible name (`aria-label` or `aria-labelledby`) is required — a
  dev-time `console.warn` fires when both are missing, matching `AIButton`'s
  `iconOnly` convention.
- The icon itself is `aria-hidden` — decorative; the accessible name
  carries the meaning, not the glyph.
- Target size: `sm` (30px) is below the 44×44 preferred touch target
  (`docs/accessibility.md` §3.3) but meets the 24×24 minimum; `md`/`lg`/`xl`
  (34/38/42px) meet the preferred minimum in one dimension.

## Responsive behavior

Fixed square dimensions per size, per Figma. No responsive variants.

## Storybook stories

`Primitives/IconButton` — Playground, VariantCollection, Sizes, Examples,
Disabled.

## Tests

`packages/ui/src/primitives/IconButton.test.tsx`: the Figma-evidenced
secondary/md default; each variant binds a `--color-button-*` token; each
size binds its geometry; the icon is `aria-hidden`; `aria-labelledby` works
as an alternative to `aria-label`; the dev-time accessible-name warning
fires (and doesn't, when a name is present); `onClick`/`disabled` behavior;
the native `type="button"` default.

## Code mapping

| Framework | Export       | Source                                       |
| --------- | ------------ | --------------------------------------------- |
| React     | `IconButton` | `packages/ui/src/primitives/IconButton.tsx`  |

## Known differences from Figma

- **Only one variant/size combination is a literal Figma instance.** The
  other 23 combinations reuse already-Figma-synced `Button` color tokens
  and this same frame's Primary Button icon-size ladder, by consistency —
  not independently sourced. Recorded, not silently presented as verified.
- **Variant vocabulary reuses `Button`'s live token family**, not the
  Primary/Secondary/Ghost/Danger/AI list in §6 — direct user decision,
  since that older vocabulary has no live component behind it (the
  original `Button` primitive it described was retired; see
  `docs/shadcn-integration.md` §7.8).

## Known limitations

- React only. No `@lumen/web-components`/`@lumen/angular` equivalent —
  both packages are Button-only proofs of concept.
- No Loading state (not evidenced).
- No visual-regression coverage; the repo has no such tooling configured.

## Change history

- 2026-07-29: added, sourced from node `1034:4459`'s "Icon Only - light"
  instance.

---

# 55. CodeBlock

## Status

Baseline specification, added 2026-07-29.

## Figma source

- Node: `1484:2905` ("AI Response Components" frame), the code-block region
- Verified with `get_design_context`, `get_variable_defs`
- Last synchronized: 2026-07-29

## Purpose

A syntax-highlighted, read-only code display.

## When to use

- Displaying a code sample, query, or configuration snippet — inline
  content within `AIResponseCard` or anywhere else in the product.

## When not to use

- Editable code — this is a display-only primitive, not an editor.

## Anatomy

```text
CodeBlock
└── <pre> (dark background, monospace, syntax-colored tokens)
```

## Variants

None — one visual treatment, parameterized by `language`.

## Sizes

None.

## States

None — static display.

## Properties

Property contract (framework-neutral):

```text
code      string, required — the source to display
language  string, optional (default "sql") — a Prism language identifier
```

## Reference implementation (React)

```ts
export interface CodeBlockProps {
  code: string;
  language?: Language; // from `prism-react-renderer`
  className?: string;
}
```

Source: `packages/ui/src/primitives/CodeBlock.tsx`. Built on
`prism-react-renderer` (real Prism-grammar tokenization, not a hand-rolled
parser), by direct user request ("full fledge reusable codeblock component
with real syntax highlighter, and reuse this across this design system") —
this is a new runtime dependency of `@lumen/ui`.

## Behavior

- Renders whatever language grammar Prism supports; not limited to the
  Figma-evidenced SQL example.
- No copy button, no line numbers, no editing — kept minimal to what's
  evidenced. A consumer wanting a copy affordance composes one alongside it
  (as `AIResponseCard` does, at the card-footer level, not attached to the
  code block itself — matching Figma's own anatomy).

## Content

Pass real source text; the component does not reformat or validate it.

## Tokens

```text
color.code.bg               (new primitive, theme-invariant — code blocks
                              stay dark regardless of app theme)
color.code.syntax-keyword    (new primitive — SQL keywords/operators, the
                              only evidenced keyword-family color)
color.code.syntax-string     (new primitive — string literals, the only
                              evidenced string-family color)
color.text.inverse           (reused, exact — plain/unhighlighted token color)
radius.button                (reused — same 10px value as Button's radius.
                              corner radius token; see that token's own note
                              on the shared naming)
typography.code-md           (reused, exact — Figma "Code/Inline Medium",
                              14/22/400)
font-mono                    (reused — Space Mono)
```

Only 2 of Prism's many token types (`keyword`/`operator`/`builtin`,
`string`/`char`) have Figma-evidenced colors. Every other token type
(comment, number, function, punctuation, etc.) renders in the plain
`text.inverse` color rather than an invented one — recorded as a known
limitation below, not silently presented as fully designed.

## Accessibility

- Renders semantic `<pre>`; content remains selectable text (not an image).
- No interactive elements inside the block itself.
- Color is not the only way information is conveyed — the code's own
  structure/text carries meaning; syntax color is a enhancement, not the
  sole signal.

## Responsive behavior

`overflow-x-auto` on the `<pre>` — long lines scroll horizontally rather
than wrapping or clipping.

## Storybook stories

`Primitives/CodeBlock` — Playground (SQL, the evidenced example),
TypeScript, JsonExample, Bash — demonstrating real multi-language
tokenization, not just the one evidenced example.

## Tests

`packages/ui/src/primitives/CodeBlock.test.tsx`: renders code inside a
`<pre>`; the Figma-exact keyword and string colors apply to the correct
tokens; plain tokens (identifiers) are not colored as keyword or string;
a second language (TypeScript) tokenizes correctly, proving this isn't
hardcoded to the one evidenced SQL example; the `sql` default.

## Code mapping

| Framework | Export      | Source                                    |
| --------- | ----------- | ------------------------------------------ |
| React     | `CodeBlock` | `packages/ui/src/primitives/CodeBlock.tsx` |

## Known limitations

- Only 2 Prism token-type colors are Figma-evidenced; all others use the
  plain text color, not an invented palette.
- React only. No `@lumen/web-components`/`@lumen/angular` equivalent.
- No visual-regression coverage; the repo has no such tooling configured.

## Change history

- 2026-07-29: added, sourced from node `1484:2905`.

---

# 56. AIResponseCard

## Status

Baseline specification, added 2026-07-29. Supersedes §31's anatomy list —
see that section's Status note.

## Figma source

- Node: `1484:2905` ("AI Response Components" frame)
- Verified with `get_metadata`, `get_design_context`, `get_variable_defs`
- Last synchronized: 2026-07-29

## Purpose

A structured AI-generated response: title, summary bullets, an optional
data table, an optional code block, additional collapsed sections, and
follow-up actions — see §31 for the fuller purpose/requirements narrative
this component implements (Edit/Accept/Reject/Feedback remain unbuilt,
not evidenced here).

## When to use

- Presenting a multi-part AI-generated analysis or report inline in the
  product, where the user needs to review structured content (summary,
  data, a query) alongside source count and follow-up actions.

## When not to use

- A single short AI reply in a conversational thread — use `AIPanel`'s
  message bubble instead.

## Anatomy

```text
AIResponseCard
├── Header
│   ├── Bot icon
│   ├── Title (default "AI Response Card")
│   └── Model badge (optional, e.g. "claude-fable-5")
├── First section (always visible)
│   ├── Section title
│   ├── Bullet list (optional)
│   ├── Data table (optional)
│   └── Code block (optional, via CodeBlock)
├── Expand control (only when more than one section)
│   └── "{multiPartLabel} · {N} more section(s)" — reveals remaining sections
└── Follow-up actions
    ├── Suggested-action pill (optional, green success styling)
    ├── Source count (optional, e.g. "2 sources")
    ├── Copy icon action
    └── Regenerate icon action
```

## Variants

None.

## Sizes

None — fluid width, fills its container.

## States

```text
Sections collapsed (default, when more than one section exists)
Sections expanded  (via the Collapsible expand control)
```

## Properties

Property contract (framework-neutral):

```text
title             string, optional (default "AI Response Card")
model             string, optional — model badge, omitted when absent
sections          array, required — { title, bullets?, table?, code? }[];
                   first renders inline, the rest behind the expand control
multiPartLabel    string, optional (default "Multi-part response")
sourcesCount      number, optional — renders "{N} source(s)"
suggestedAction   { label, onClick? }, optional — the green pill
onCopy            function(copiedText), optional — called after a
                   successful clipboard write
onRegenerate      function, optional — may return a Promise
```

## Reference implementation (React)

```ts
export interface AIResponseCardSection {
  title: string;
  bullets?: string[];
  table?: { columns: { key: string; header: string }[]; rows: Record<string, React.ReactNode>[] };
  code?: { code: string; language?: Language };
}

export interface AIResponseCardProps {
  title?: string;
  model?: string;
  sections: AIResponseCardSection[];
  multiPartLabel?: string;
  sourcesCount?: number;
  suggestedAction?: { label: string; onClick?: () => void };
  onCopy?: (copiedText: string) => void;
  onRegenerate?: () => void | Promise<void>;
  className?: string;
}
```

Source: `packages/ui/src/composite/AIResponseCard.tsx`.

## Behavior

- Only the first section renders unconditionally; additional sections are
  hidden behind an expand control built on the existing `Collapsible`
  primitive (Radix) — real keyboard-accessible expand/collapse, not a
  static visual, per direct user request.
- The expand control's label is computed: `{multiPartLabel} · {N} more
  section{s}`, singular/plural handled automatically.
- The expand control itself is omitted entirely when only one section
  exists — nothing to expand.
- **Copy** is fully functional, not a bare passthrough (2026-07-29, direct
  user request: "make Copy and Refresh iconButtons interactive and
  functional"): it writes a plain-text rendering of every section (title,
  bullets, table, code — not just the visible first section) to the
  clipboard via `navigator.clipboard.writeText`, then shows a temporary
  "Copied" confirmation (icon swaps to a checkmark, accessible name changes
  to "Copied", reverts after 2s) before calling the optional
  `onCopy(copiedText)`. If the Clipboard API rejects (denied permission,
  insecure context), `onCopy` still fires so the caller can offer a
  fallback.
- **Regenerate** is genuinely async-aware: while an `onRegenerate` promise
  is pending, the button shows a spinner, sets `aria-busy="true"`, and
  disables itself (preventing duplicate triggers) — the same CSS-spinner
  treatment already used by `AIButton`/`SplitButton`. This still does not
  call an AI model or manage generation state itself — it only manages the
  button's own pending visual state around whatever async work the
  caller's `onRegenerate` performs.
- **While Regenerate is pending, the section body (first section plus the
  expand control) is replaced with a loading skeleton** (`ResponseSkeleton`,
  built from the existing `Skeleton` primitive) rather than staying static
  underneath a spinning button — direct user request ("refresh should show
  the demo skeleton loading... for every refresh"), not Figma-evidenced
  (this frame has no loading state). `role="status"`/`aria-live="polite"`/
  `aria-busy="true"` with a visually hidden "Regenerating response" label,
  the same live-region pattern `ContentState`'s loading state already
  established.
- Both Copy and Regenerate have `Tooltip`s (the existing Radix-based
  `Tooltip` component), direct user request — the tooltip text tracks
  current state ("Copied"/"Regenerating…") rather than staying static.
- The suggested-action pill remains a presentational trigger; the caller
  supplies its behavior via `onClick`.

## Content

- Section titles should be short and scannable ("Executive Summary", not
  a full sentence).
- Table headers should be short; long cell content should wrap rather than
  truncate silently (not yet tested against very long cell values).

## Tokens

```text
color.text.primary        (new — card title; promoted from app-shell)
color.text.heading        (new — section titles, table header/cell text;
                            promoted from app-shell)
color.text.body           (reused — bullet text; same "text/body reads
                            lumen-gray.800 vs generic neutral.700" accepted
                            imperceptible difference already documented for
                            ContentState/EmptyState)
color.border.input        (reused, exact — table and card border)
color.background.app      (reused, exact — table header row background)
color.background.nav-active (reused, exact — model badge background)
color.background.raised   (reused — card background)
color.status.success / .success-subtle (reused, exact — suggested-action
                            pill text/background)
color.green.100            (primitive, referenced directly — the pill's
                            border; a one-off, not promoted to a new
                            semantic status-border role for a single usage)
color.icon.default         (reused — Copy/Regenerate icon color; Figma's
                            exact value is #2B2F2F, this token is #262626 —
                            an accepted close-but-not-exact reuse, not a new
                            one-off token for two small secondary icons)
radius.2xl / radius.button / radius.full (reused, exact)
typography.input-lg / button-md / title-sm / body-sm / code-sm (all
                            reused, exact matches for every text style this
                            frame uses — no new typography tokens needed)
```

## Accessibility

- The expand control is a real `<button>` (via `CollapsibleTrigger`) with
  native `aria-expanded` state from Radix; the chevron rotates based on
  `data-state`, not color alone.
- Copy and Regenerate actions have explicit `aria-label`s ("Copy response",
  "Regenerate response") — icon-only controls, no visible text label. Copy's
  accessible name changes to "Copied" during the temporary confirmation
  state, not just a visual icon swap, so screen-reader users get the same
  confirmation sighted users see. Regenerate sets `aria-busy="true"` and the
  native `disabled` attribute while its promise is pending — the pending
  state is exposed programmatically, not by spinner color alone.
- The table uses semantic `<table>`/`<th>`/`<td>` markup.
- Bullet lists use a semantic `<ul>`/`<li>`.

## Responsive behavior

Fluid width. Table content is not tested against narrow viewports in this
pass — no Figma breakpoint evidence for this frame.

## Storybook stories

`AI Components/AIResponseCard` — Playground (full anatomy: table + code +
a second collapsed section), SingleSection (expand control hidden),
NoTableOrCode (bullets-only section), Interactive (real clipboard copy and
a simulated 1.5s async regenerate, demonstrating the spinner/disabled
state).

## Tests

`packages/ui/src/composite/AIResponseCard.test.tsx`: title/model badge/
first section render; model badge omitted when absent; table renders
headers and rows; code block renders; expand control hidden with one
section; expand control shows the correct singular/plural count and stays
collapsed until activated; expanding reveals additional sections; the
suggested-action pill and source count render and fire `onClick`; Copy
writes a plain-text rendering of every section (not just the visible one)
to the clipboard, calls `onCopy` with that text and shows the "Copied"
confirmation, and still calls `onCopy` when the Clipboard API rejects;
Regenerate fires a synchronous `onRegenerate`, shows a spinner and disables
itself (`aria-busy`/`disabled`) for the duration of an async
`onRegenerate`, and ignores extra clicks while one is already pending.

## Code mapping

| Framework | Export           | Source                                          |
| --------- | ---------------- | ------------------------------------------------ |
| React     | `AIResponseCard` | `packages/ui/src/composite/AIResponseCard.tsx`   |

## Known differences from Figma

Recorded rather than silently closed — see `docs/figma-sync.md`:

- **Table is not built on the existing `DataTable` composite.**
  `DataTable`'s hardcoded typography/color/radius don't match this frame's
  evidenced values, and it exposes no override props; rather than force
  an inexact reuse or widen its API for one new consumer, this renders its
  own semantic `<table>`. `DataTable` itself was not changed.
- **Copy/Regenerate icon color** uses the existing generic `icon.default`
  (`#262626`), not Figma's exact `#2B2F2F` — a small, accepted difference
  for two secondary icon actions rather than a new one-off token.
- **Code-block/collapse-trigger radius (10px)** reuses the same
  `radius.button` token added for Button's own radius correction — same
  underlying Figma `radius/xl` variable value, flagged (not resolved) as
  possibly deserving a more generic name in a future foundation pass.

## Known limitations

- React only. No `@lumen/web-components`/`@lumen/angular` equivalent —
  composite/page-level, same reasoning as `AIPanel`/`PageHeader`.
- No visual-regression coverage; the repo has no such tooling configured.
- Not verified with a real screen reader.
- Long table cell content and very long code lines are not tested against
  narrow viewports.

## Change history

- 2026-07-29: added, sourced from node `1484:2905`.
- 2026-07-29 (same day): made Copy and Regenerate functional — real
  clipboard writes with a temporary "Copied" confirmation, and async-aware
  Regenerate with a spinner/disabled state — per direct user request
  ("make Copy and Refresh iconButtons interactive and functional").
  `onCopy`'s signature changed from `() => void` to
  `(copiedText: string) => void` and `onRegenerate`'s from `() => void` to
  `() => void | Promise<void>` — both still pre-release (unshipped in any
  published version), so this is not recorded as a breaking change.
- 2026-07-29 (same day): added a loading skeleton during Regenerate and
  tooltips on both footer icon actions, per direct user follow-up requests.

# 57. SideNav

## Status

Baseline specification, added 2026-07-29.

## Figma source

- Node: `1498:2877` ("SideNav" frame; children `1079:2427` `State=Expanded`,
  `1498:2878` `State=collapsed`)
- Verified with `get_metadata`, `get_design_context`, `get_variable_defs`,
  `get_motion_context`
- Last synchronized: 2026-07-29

## Purpose

Lumen's collapsible desktop application-navigation column: a labeled nav
list that the user can collapse to an icon-only rail and expand back,
with a real animated transition rather than a hard swap.

## When to use

- The primary navigation column of `AppShell` (its only current consumer),
  or any standalone product surface needing the same collapsible-rail
  pattern.

## When not to use

- Mobile bottom navigation — use `AppShell`'s `mobileNavigation` slot.
- A tablet-only always-compact rail with no user-facing toggle — `SideNav`
  already forces the compact rail at tablet regardless of `expanded`; no
  separate component is needed for that case.

## Anatomy

```text
SideNav
├── Header (optional)
│   ├── Workspace mark or `logo`
│   └── Workspace name + plan text (expanded only)
├── Nav sections
│   ├── Section label (expanded only; an 8px spacer when collapsed)
│   └── Nav items
│       ├── Icon
│       ├── Label (expanded only) + badge (expanded only)
│       └── Tooltip (collapsed only — reveals the label on hover)
├── Divider
└── Footer control
    ├── "Collapse" (labeled row, shown when expanded)
    └── "Expand navigation" (icon-only + Tooltip, shown when collapsed)
```

## Variants

None — one component, two visual states driven by `expanded`.

## Sizes

None — width is fixed per state (224px expanded, 64px collapsed at
desktop; always 64px at tablet), not a size scale.

## States

```text
Expanded  (desktop only, expanded=true)
Collapsed (desktop, expanded=false; always, at tablet)
```

## Properties

Property contract (framework-neutral):

```text
nav          array, required — { label?, items: NavItem[] }[]
expanded     boolean, required — true shows full labels at desktop
onCollapse   function, optional — renders the "Collapse" control
onExpand     function, optional — renders the "Expand navigation" control
workspace    { name, plan?, logo? }, optional
logo         ReactNode, optional — header content when no `workspace`
className    string, optional
```

## Reference implementation (React)

```ts
export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
  icon?: ReactNode;
  badge?: string | number;
}

export interface NavSection {
  label?: string;
  items: NavItem[];
}

export interface WorkspaceInfo {
  name: string;
  plan?: string;
  logo?: ReactNode;
}

export interface SideNavProps {
  nav: NavSection[];
  expanded: boolean;
  onCollapse?: () => void;
  onExpand?: () => void;
  workspace?: WorkspaceInfo;
  logo?: ReactNode;
  className?: string;
}
```

Source: `packages/ui/src/layout/SideNav.tsx`.

## Behavior

- One persistent component, not two swapped trees: the outer `<aside>`'s
  width transitions between `--spacing-224` and `--spacing-64`
  (`transition-[width] duration-[var(--duration-moderate)]
  ease-[var(--easing-standard)]`) — a real CSS animation. It relies on the
  parent row's `items-stretch` for height (no explicit `height`/`h-full` on
  the `<aside>` itself — an explicit `h-full` was tried and reverted after
  it broke the stretch, since `height: 100%` needs a CSS-definite parent
  height that a flex-grown row doesn't have; see Known differences).
- Content (labels, workspace text, section headers, badges, which footer
  control renders) is gated on `expanded && useIsDesktop()`, not `expanded`
  alone. This is what makes tablet always show the icon-only rail
  regardless of `expanded` — without it, expanded content would render
  inside a CSS-forced 64px tablet width and overflow.
- Collapsed nav items get `aria-label` set to the item's label (compensating
  for the hidden visible text) and a `Tooltip` (hover reveals the label);
  expanded items render icon + label + optional badge inline, no tooltip
  needed since the label is already visible.
- The footer shows at most one control at a time: "Collapse" (a full-width
  nav-list row, not the shared `Button`, since it visually matches its
  list siblings) when expanded and `onCollapse` is provided; the icon-only
  "Expand navigation" `Button` (wrapped in a `Tooltip`) when collapsed and
  `onExpand` is provided. Omitting the relevant callback hides that control
  entirely.

## Content

- Nav item labels, section labels, and the workspace name/plan come from
  the consumer via `nav`/`workspace` — no hardcoded copy.
- Default accessible name for the collapsed Expand control:
  "Expand navigation" (also its tooltip text).

## Tokens

Every color/radius/typography value this Figma node specifies matched an
existing token exactly:

- Colors: `--color-app-shell-nav-bg`, `--color-app-shell-nav-on-action`,
  `--color-app-shell-nav-active`, `--color-app-shell-nav-selected-on-action`,
  `--color-app-shell-nav-hover`, `--color-app-shell-icon-secondary`,
  `--color-app-shell-text-secondary`, `--color-app-shell-text-placeholder`,
  `--color-app-shell-text-heading`, `--color-app-shell-border-default`,
  `--color-badge-default-bg`, `--color-badge-default-text`,
  `--color-app-shell-brand-primary`, `--color-app-shell-text-on-brand`.
  (Not `--color-app-shell-text-tertiary`, Figma's literal binding for the
  section label — see Accessibility.)
- Spacing/radius: `--spacing-224`, `--spacing-64`, `--spacing-20`,
  `--spacing-40`, `--spacing-13` (new — see below), `--spacing-12`,
  `--spacing-10`, `--spacing-8`, `--spacing-4`, `--spacing-2`,
  `--radius-lg`.
- Typography: `text-app-nav` (13/20/500), `text-app-admin` (10/14/600,
  0.8 tracking), `text-badge-sm` (11/16/500), `text-app-workspace`,
  `text-app-meta`, `text-app-logo-compact`/`text-app-logo-rail`.
- Motion: `--duration-moderate` (200ms), `--easing-standard` — reused,
  not new; `get_motion_context` returned no keyframe data for this node
  (a static two-state mockup).

One new token: `--spacing-13` (`packages/tokens/src/spacing.json`), for
this node's own asymmetric container top padding (`pt-13px` against
`pb-12px`) — confirmed real via a dedicated single-state Figma pull, not a
code-gen artifact (see Known differences' history).

## Accessibility

- Each nav section renders as a `<nav>` with `aria-label` (the section's
  own label, or "Primary" for the first unlabeled section).
- The active item carries `aria-current="page"`.
- Collapsed items expose their label via `aria-label` and a hover
  `Tooltip`, since the visible text is not rendered in that state.
- The footer toggle is a real `<button>` in both states, reachable and
  operable via keyboard; also wrapped in a `Tooltip` when collapsed.
- The "ADMIN"-style section label uses `--color-app-shell-text-secondary`
  (lumen-gray.700, `#626B6E`, ~5.46:1 on white), not Figma's literal
  `text/tertiary` binding (lumen-gray.600, `#838F92`, 3.32:1) — an axe
  "Serious" WCAG AA contrast violation (needs 4.5:1 for 10px text) caught
  after the initial sync. Scoped to this one label rather than changing
  the shared `text-tertiary` token, which `AIPanel`/`PageHeader`/other
  consumers also use at sizes/contexts not audited here.

## Responsive behavior

- Hidden below the tablet breakpoint (768px) — `AppShell` uses
  `mobileNavigation` there instead.
- Tablet (768–1023px): always the collapsed icon-only rail, regardless of
  `expanded`.
- Desktop (≥1024px): follows `expanded` — 224px labeled, or 64px
  icon-only.

## Storybook stories

`Expanded`, `Collapsed`, `WithWorkspace`, `Interactive` (real, clickable
expand/collapse) — `packages/ui/src/layout/SideNav.stories.tsx`.

## Tests

12 tests in `packages/ui/src/layout/SideNav.test.tsx`: default (non-desktop)
rendering, expanded/collapsed content and footer control selection at
desktop, `aria-current`, badge rendering, `onCollapse`/`onExpand` firing,
workspace name/plan visibility, the desktop width classes, tooltip-on-hover
for a collapsed nav item and the Expand control, and the section label's
accessible color class.

## Code mapping

`packages/ui/src/layout/SideNav.tsx`. Consumed by `AppShell.tsx`, which
replaced its previous private `Sidebar`/`NavigationRail` pair with a
single `<SideNav>` instance.

## Known differences from Figma

- The collapsed-state footer icon in Figma's export reuses the same
  `circle-arrow-left` asset as the expanded Collapse button. Kept the
  existing, already-shipped `CircleArrowRightIcon` for Expand instead
  (semantically "outward," and the already-tested behavior) rather than
  matching the asset literally.
- The "ADMIN" section label uses `text-secondary`, not Figma's literal
  `text/tertiary` binding — a deliberate WCAG AA accessibility correction,
  not drift; see Accessibility above.
- History: the initial sync logged two spacing values as Figma-code-gen
  artifacts and normalized them away (`pt-13px` rounded to `--spacing-12`;
  collapsed items given the previous `NavigationRail`'s centered/unpadded
  sizing instead of Figma's `px-12 py-8 gap-10`). A user-reported layout
  bug (the `<aside>` not filling its parent's height, caused by an
  unrelated `h-full` regression — now removed) prompted re-verification
  with a dedicated `get_design_context` pull directly on the collapsed
  node, which confirmed both values are real, consistent Figma spacing,
  not artifacts. Corrected same session; the `--spacing-13` token and the
  literal `px-12 py-8 gap-10` collapsed-item box model are current.

## Known limitations

- No cross-framework equivalent — `@lumen/web-components`/`@lumen/angular`
  have no `AppShell`/navigation component yet (both Button-only proofs of
  concept).
- No persisted collapse state across reloads — `expanded` is fully
  controlled by the consumer (e.g. `AppShell`'s `variant` prop);
  persistence, if wanted, is the consumer's responsibility.

## Change history

- 2026-07-29: added, sourced from node `1498:2877`, replacing `AppShell`'s
  previous private `Sidebar`/`NavigationRail` pair with one persistent,
  animated component.
- 2026-07-29 (same day, user-reported follow-up): fixed a height regression
  (`h-full` broke the inherited flex stretch); corrected 5 mismatched demo
  icons in the Storybook nav data; re-verified and corrected two spacing
  values previously (wrongly) treated as Figma code-gen artifacts, adding
  the new `--spacing-13` token; added hover tooltips on all collapsed
  icon-only controls; fixed a WCAG AA contrast violation on the section
  label; and fixed the public `Button` wrapper's missing ref forwarding
  (needed for the Expand control's `TooltipTrigger asChild`).

# 58. LumenLogo

## Status

Baseline specification, added 2026-07-29.

## Figma source

- Node: `1174:1354` ("Header" frame; `Breakpoint=Desktop` `1079:1890` >
  "Brand" `1079:1883` > "Lumen DS Logo" instance)
- Verified with `get_metadata`, `get_design_context`, `download_assets`
- Last synchronized: 2026-07-29

## Purpose

The Lumen brand mark — a fixed graphic asset, not a themeable icon.

## When to use

- Anywhere Lumen's own product branding is shown: a header's brand lockup,
  a workspace's default logo mark, marketing/about surfaces.

## When not to use

- As a per-tenant/customer workspace mark — use `SideNav`'s
  `workspace.name`-derived initial-letter fallback (or the consumer's own
  uploaded logo via `workspace.logo`) instead; this asset represents Lumen
  the product, not an arbitrary customer's brand.
- Anywhere a recolorable, `currentColor`-based icon is needed — use the
  generated icon set (`packages/ui/src/icons/generated`) instead; this
  asset bakes in its own fixed gradients and cannot be recolored via CSS.

## Anatomy

A single `<img>` — no sub-parts.

## Variants

None.

## Sizes

None — sized entirely via `className` (Tailwind `h-*`/`w-*`); no default
size scale, since consumers place it in varied contexts (a 28px header
mark, a larger marketing lockup, etc.).

## States

None — a static image.

## Properties

Property contract (framework-neutral):

```text
title       string, optional (default "Lumen") — accessible name; pass ""
            for decorative use (e.g. beside text that already says "Lumen")
className   string, optional
```

Plus any other native `<img>` attribute except `src`/`alt` (fixed).

## Reference implementation (React)

```ts
export interface LumenLogoProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> {
  title?: string;
}
```

Source: `packages/ui/src/primitives/LumenLogo.tsx`.

## Behavior

- Renders `packages/ui/src/assets/lumen-logo.svg` (a committed static
  asset, resolved via `new URL(..., import.meta.url).href` — the same
  Vite-asset pattern already used by `ThemeToggle`'s sun/moon icons) as a
  plain `<img>`.
- `className` merges with the component's own default sizing classes via
  `cn()` (tailwind-merge), so a consumer's `h-*`/`w-*` wins over the
  default.

## Content

- `alt` is fixed to `title`, defaulting to `"Lumen"`. Pass `title=""` for
  a decorative instance (the accessible name is then empty, matching the
  `alt=""` convention for images whose meaning is already conveyed by
  adjacent text).

## Tokens

None. The asset is a fixed, multi-gradient graphic (deep purple through
crimson to gold) with no themeable color roles — it does not vary by
light/dark mode or any semantic token, the same treatment already applied
to `ThemeToggle`'s and Checkbox's committed icon assets.

## Accessibility

- Renders with a real accessible name (`alt="Lumen"`) by default; supports
  marking itself decorative (`title=""`) when adjacent text already
  conveys "Lumen", avoiding a redundant announcement.

## Responsive behavior

None — a fixed-aspect-ratio image sized entirely by the consumer.

## Storybook stories

`Default`, `Large`, `Decorative` —
`packages/ui/src/primitives/LumenLogo.stories.tsx`.

## Tests

4 tests in `packages/ui/src/primitives/LumenLogo.test.tsx`: default
accessible name, decorative (`title=""`) mode, `className` merging, and
that `src` resolves to the committed asset.

## Code mapping

`packages/ui/src/primitives/LumenLogo.tsx`, asset at
`packages/ui/src/assets/lumen-logo.svg`. Consumed by
`AppShell.stories.tsx`'s `Brand` (the header mockup) and by
`AppShell.stories.tsx`'s/`SideNav.stories.tsx`'s `workspace.logo` demo
wiring.

## Known differences from Figma

None — the asset is committed byte-for-byte from Figma's own export, and
rendered at its exact natural aspect ratio (21.2423×21.8788px) rather than
stretched or cropped into the 28×28 bounding box it sits inside in the
Header.

## Known limitations

- No cross-framework equivalent — `@lumen/web-components`/`@lumen/angular`
  have no header/brand-mark component yet (both Button-only proofs of
  concept).

## Change history

- 2026-07-29: added, sourced from node `1174:1354`, replacing a placeholder
  (a plain crimson square with a literal "L" character) used in
  `AppShell.stories.tsx`'s `Brand` mockup and demonstrated as `SideNav`'s
  example custom `workspace.logo`, at direct user request.
