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
and Storybook from Lumen-AI-Design-System node `1027:3733` on 2026-07-20.
This final collection supersedes the previous standard Button collection's
multiple sizes, Raised/Tertiary variants,
Pressed/Loading/status states, Pill, or Icon-only modifiers.

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
Link
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

### Link

Use for the lowest-emphasis blue/teal text action. Use a semantic link element
when the action navigates.

### Accent

Use for an emphasized action whose application-context treatment is distinct
from Primary. It is near-black in light mode and teal in dark mode.

### Destructive

Use for destructive or irreversible actions. Significant consequences still
require confirmation.

## Sizes

The final collection has one standardized size: 34px height, 14px inline
padding, 7px block padding, 8px content gap, 8px radius, 1px border, 14px
icons, and Instrument Sans Medium 14/20 with 0.14px letter spacing.

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
variant   enum: primary | accent | secondary | outline | ghost | link | destructive
disabled  boolean
iconStart renderable content (icon)
iconEnd   renderable content (icon)
```

Reference implementation — React (`@lumen/ui`, `packages/ui/src/primitives/Button.tsx`):

```ts
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "accent" | "secondary" | "outline" | "ghost" | "link" | "destructive";
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
}
```

## Behavior

- Activation occurs through pointer click, Enter, or Space.
- Disabled buttons do not receive interaction.
- Focus-visible treatment appears for keyboard navigation.
- Link-styled buttons must use semantic anchors for navigation.
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
Final Variant Collection (all seven variants and four states, light and dark)
Icon Positions
```

The React Storybook implements all three required stories.

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
Neutral
Brand
Info
Success
Warning
Danger
AI
```

## Sizes

```text
Sm
Md
```

## Requirements

- Do not use Badge as an interactive control unless explicitly implemented as one.
- Status must not rely solely on color.
- Keep labels concise.
- Use icon support only when it improves comprehension.

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

## Status

Baseline specification, added 2026-07-14. Supersedes the variant/state
lists in §30 "AI Action Button" (see that section's Status note) — §30's
purpose/examples/requirements prose remains the intent this component
serves; only its old, pre-Figma variant and state lists were wrong.

## Figma source

- Node: `760:1965` ("AI Communication Component Library", Buttons page)
- Component set: AI Button (Primary/Secondary/Tertiary/Outline AI, plus
  Icon-Only and Split Button AI sub-sections)
- Last synchronized: 2026-07-15 — re-verified the leading-icon instance
  swap on the Secondary Icon Only AI sub-section (`get_design_context`
  showed a component explicitly named `lm-aisymbol`, nodes `843:7818`–
  `843:7824`); the initial 2026-07-14 sync had approximated this as a
  generic sparkle glyph before that instance swap was visible

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
derived from the final standard Button, which now has one 34px size.

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
- Split Button AI (a dropdown-toggle pairing analogous to `SplitButton`,
  documented under node `760:1965`) is not implemented — no shipped
  component composes `AIButton` with a dropdown segment yet.
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
- 2026-07-15: added the `capability` prop and its backing
  `ai-capabilities.ts` catalog (React only), renamed the Storybook category
  from `Primitives/AIButton` to `AI Components/AI Button`, refactored the
  Capability Catalog story to be data-driven, and added the
  `AI Components/AI Button Component Library` documentation page.

# 47. KPICard

## Status

Baseline specification, added 2026-07-20.

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

- Node: `1197:1652` ("appshell-desktop-closed-light" reference screen),
  Header instance `I1102:6515;1124:1193`
- Last synchronized: 2026-07-20

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
├── Thumb (slides between Sun/Moon)
├── Sun icon
└── Moon icon
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
color.background.subtle (track)
color.background.default (thumb)
color.text.title / color.text.muted (icon tint)
color.border.focus
spacing.{2,20,24,32,56}
```

## Known limitations

- Only the Light-theme instance was sourced; no Dark-theme or
  mid-interaction instance was available, so the sliding-thumb interaction
  is the conventional accessible-toggle pattern, not independently
  Figma-confirmed.
- Track width rounds Figma's 54px to `--spacing-56` so the thumb's
  translate distance lands on a real spacing token (`--spacing-32`)
  instead of an unbacked 30px — the same "round to the nearest existing
  token" treatment already applied to `SplitButton`'s `sm` dropdown
  segment.
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

`Primitives/ThemeToggle` — Playground, Checked, Interactive.

## Testing

Unit tests cover the default accessible name, `aria-label` override,
click-to-toggle behavior, and label/input association.

## Change history

- 2026-07-20: added, sourced from node `1197:1652`.

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
    ├── Text input
    └── Send button
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

- The header icon uses the existing `LmAisymbolIcon` rather than Figma's
  `lm-ai-outline`, which has no corresponding entry in this repo's icon set.
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

`Composite/AIPanel` — Playground, Interactive, Empty.

## Testing

Unit tests cover title/message rendering, assistant-message actions, the
conditional "+Thread" control, submit-and-clear behavior, empty-submission
rejection, and the labeled live region.

## Change history

- 2026-07-20: added, sourced from node `1007:3700`.
- 2026-07-20: standardized inline response actions on the final secondary
  Button from node `1027:3733`.
