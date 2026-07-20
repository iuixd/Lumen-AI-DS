# Lumen Component Architecture

> Canonical component architecture for the **Lumen AI Design System**.  
> Figma is the design source of truth. The component contract defined in this document and in `docs/component-specifications.md` — not any single framework package — is what every framework implementation, Storybook story, test, and published package must mirror. React is Lumen's current reference implementation of that contract, not the contract itself; see "0. Architecture layers" below.

## Source

- **Figma file:** Lumen AI Design System
- **Dev Mode node:** `426:4395`
- **Reference:** https://www.figma.com/design/GJBYRm6ySR7XIECFcHMgy2/Lumen-AI-Design-System?node-id=426-4395&m=dev
- **Related specification:** `docs/design-tokens.md`
- **Last reviewed:** 2026-07-15

## Purpose

This document defines how Lumen components are structured, named, composed, implemented, tested, documented, synchronized, and released.

It exists to ensure that:

- Figma and code use the same component model
- components remain reusable and composable
- tokens are applied consistently
- Storybook reflects the current Figma library
- Claude Code performs incremental updates only
- component APIs remain stable and predictable
- enterprise-scale patterns do not become monolithic components

---

# 0. Architecture layers

Lumen is structured as a framework-agnostic design-system core with separate framework packages, so it can support React today and Angular, Vue, or Web Components later without re-deriving the design language per framework.

```text
Figma Variables
    ↓
Design Tokens              (@lumen/tokens — CSS variables, Tailwind preset, typed exports)
    ↓
Framework-Agnostic Foundations   (layout, motion, density, and interaction rules that
    ↓                              apply regardless of implementation framework)
Component Specifications   (docs/component-specifications.md — anatomy, variants,
    ↓                        sizes, states, behavior, accessibility, and token
    ↓                        dependencies, expressed independent of any framework)
Framework Packages
    ├── React            (@lumen/ui, @lumen/patterns — reference implementation)
    ├── Web Components     (@lumen/web-components — proof of concept, Button only)
    ├── Angular           (@lumen/angular — proof of concept, Button only, Angular 20 LTS)
    └── Vue                (not yet built)
```

The shared layers (tokens through component specifications) define the design language and the component contract once. Each framework package implements that same contract using framework-native APIs and idioms — a `variant` or `loading` property means the same thing everywhere, but a React package exposes it as a typed prop, an Angular package as an `@Input()`, and a Web Components package as an HTML attribute.

Consequences for how this repo is read and changed:

- **Figma remains the design source of truth** (§1.1 below) — that does not change.
- **No framework package is the source of truth for the component contract.** `docs/component-specifications.md` is. A framework package that drifts from the spec is a bug in that package, not a redefinition of the contract.
- Sections of this document and `docs/component-specifications.md` written in React-specific terms (prop interfaces, JSX examples) describe Lumen's current React reference implementation of the contract, not the contract itself. They are labeled as such.
- Adding a new framework package means implementing the existing contract, not inventing a new one. It does not require changes to `docs/component-specifications.md` unless the contract itself is incomplete or ambiguous for that framework.

---

# 1. Architecture principles

Lumen components must follow these principles.

## 1.1 Figma is the source of truth

Figma owns:

- visual anatomy
- component variants
- component properties
- layout behavior
- spacing
- typography
- color roles
- radius
- elevation
- interactive states
- responsive intent
- usage guidance

Code must implement the approved Figma specification without introducing undocumented visual behavior.

## 1.2 Tokens before values

Components must consume approved tokens.

```text
Primitive tokens
    ↓
Semantic tokens
    ↓
Component tokens
    ↓
Component implementation
```

Do not hardcode colors, spacing, radius, typography, shadows, or motion when a token exists.

## 1.3 Composition before duplication

Build complex experiences by composing smaller components rather than duplicating markup or creating large all-purpose components.

## 1.4 Stable public APIs

A component’s public API must remain small, semantic, typed, and backward compatible.

## 1.5 Accessibility is part of the contract

Keyboard interaction, focus management, semantics, contrast, announcements, and reduced motion are implementation requirements, not optional enhancements.

## 1.6 Incremental synchronization

A Figma change should update only the affected component, token, story, test, and documentation files.

Never regenerate the entire design system for an incremental change.

---

# 2. Component hierarchy

Lumen uses five architectural levels.

```text
Foundations
    ↓
Primitives
    ↓
Composites
    ↓
Enterprise Components
    ↓
Patterns and Templates
```

## 2.1 Foundations

Foundations are system-wide decisions rather than UI components.

Examples:

- color
- typography
- spacing
- scale
- radius
- elevation
- borders
- opacity
- motion
- breakpoints
- iconography
- focus treatment
- grid and layout

Source:

```text
docs/design-tokens.md
```

## 2.2 Primitive components

Primitives are low-level reusable controls with minimal product-specific behavior.

Examples:

```text
Button
Icon Button
Link
Text
Heading
Icon
Badge
Avatar
Divider
Spinner
Progress
Skeleton
Tooltip
Checkbox
Radio
Switch
Input
Textarea
Select
```

Primitive components should:

- support controlled and uncontrolled usage where appropriate
- expose semantic props
- accept standard HTML attributes
- avoid product-specific business logic
- remain visually aligned with Figma variants

## 2.3 Composite components

Composite components combine primitives into reusable interaction units.

Examples:

```text
Form Field
Search Field
Password Field
Date Picker
Combobox
Menu
Dropdown
Tabs
Accordion
Breadcrumb
Pagination
Toast
Alert
Card
Dialog
Drawer
Popover
Table
Empty State
File Upload
```

Composite components should:

- compose primitives rather than reimplement them
- own internal interaction logic
- expose slots or structured subcomponents when necessary
- document required and optional children
- support keyboard and screen-reader behavior

## 2.4 Enterprise components

Enterprise components support complex data, workflow, administration, and AI use cases.

Examples:

```text
Data Grid
Filter Builder
Query Builder
Tree View
Command Palette
Bulk Action Bar
Activity Timeline
Audit Log
Workflow Stepper
Approval Panel
Permission Matrix
Data Visualization Container
AI Action Button
AI Response Panel
AI Confidence Indicator
AI Citation List
Human Review Queue
```

Enterprise components should:

- remain domain-neutral unless intentionally product-specific
- separate data logic from presentation
- support dense and comfortable display modes where required
- handle loading, empty, partial, error, and permission states
- support large datasets and performance constraints
- expose extension points rather than one-off variants

## 2.5 Patterns and templates

Patterns define how components work together to solve recurring experience problems.

Examples:

```text
Authentication
Search and Filter
Create and Edit Form
Master-Detail
Dashboard
Settings
Review and Approval
Bulk Operations
Import and Export
Error Recovery
AI-Assisted Drafting
Human-in-the-Loop Review
```

Templates must not be packaged as inflexible monolithic components unless repeated implementation proves that abstraction is justified.

---

# 3. Figma component model

Every production component in Figma should use a consistent structure.

## 3.1 Component set

Use a component set when a component has multiple supported variants or states.

Recommended variant dimensions:

```text
Variant
Size
State
Tone
Emphasis
Density
Orientation
Icon
Loading
Selected
```

Do not encode every Boolean combination as a variant when a component property can represent it more efficiently.

## 3.2 Component properties

Use Figma component properties for:

- text labels
- Boolean visibility
- instance swapping
- supported variant dimensions

Examples:

```text
Label
Show leading icon
Leading icon
Show trailing icon
Trailing icon
Loading
Disabled
```

## 3.3 Layer naming

Use predictable semantic names.

```text
Container
Content
Label
Supporting text
Leading icon
Trailing icon
State layer
Focus ring
Selection indicator
```

Avoid:

```text
Frame 123
Rectangle 4
Group 8
Text copy
```

## 3.4 Auto Layout

All production components should use Auto Layout unless a documented exception exists.

Required considerations:

- hug, fill, and fixed behavior
- minimum and maximum dimensions
- content growth
- text wrapping
- icon alignment
- nested spacing
- responsive resizing
- localization expansion

## 3.5 Variable bindings

Bind component properties to variables for:

- fill
- stroke
- text color
- spacing
- padding
- gap
- radius
- opacity
- size where supported

Production components should use semantic or component tokens rather than primitive values directly.

## 3.6 Component descriptions

Every published Figma component must include:

- purpose
- when to use
- when not to use
- variant guidance
- accessibility notes
- content guidance
- implementation mapping where available

---

# 4. Code architecture

Repository structure — one package per framework, all consuming the same tokens and implementing the same component specifications:

```text
packages/
├── tokens/            # framework-agnostic: CSS variables, Tailwind preset, typed exports
│   ├── src/
│   └── dist/
│
├── ui/                 # React reference implementation (current)
│   ├── src/
│   │   ├── primitives/
│   │   ├── composite/
│   │   ├── layout/
│   │   ├── hooks/
│   │   ├── utilities/
│   │   └── index.ts
│   ├── tests/
│   └── package.json
│
├── patterns/            # React composed enterprise patterns (current)
│
├── web-components/       # Lit — proof of concept (Button only)
├── angular/                # standalone components, Angular 20 LTS — proof of concept (Button only)
├── vue/                     # future — implements the same component specs
│
└── storybook/
    ├── stories/
    ├── docs/
    └── .storybook/
```

`docs/component-specifications.md` is the contract every package in `packages/` implements; it does not itself belong to any one framework package. A component-local structure inside a given framework package follows that framework's own conventions — for the current React package:

```text
button/
├── Button.tsx
├── Button.types.ts
├── Button.styles.ts
├── Button.test.tsx
├── Button.a11y.test.tsx
├── Button.stories.tsx
├── Button.mdx
└── index.ts
```

## 4.1 Component implementation layers

Each component should separate:

```text
Public API
Behavior
Presentation
Tokens
Tests
Documentation
```

Avoid mixing business logic into foundational components.

## 4.2 Public exports

Only supported public APIs should be exported from package entry points. Illustrated below in the current React package's syntax; each framework package follows its own module and export conventions for the same public surface.

```ts
export { Button } from "./primitives/button";
export type { ButtonProps } from "./primitives/button";
```

Do not export internal implementation helpers unless they are intentionally public.

## 4.3 Styling

Every framework package must use token-backed styles through `@lumen/tokens` (CSS custom properties or the generated Tailwind preset) — never a framework-local color, spacing, or typography system. The specific styling mechanism is framework-dependent; the current React package (`@lumen/ui`) uses:

- CSS custom properties
- token utilities
- Tailwind classes mapped to Lumen tokens
- component variants generated from a typed configuration

A future non-React package may use plain CSS custom properties or a scoped stylesheet instead of Tailwind, as long as it resolves to the same token values.

Avoid:

- arbitrary hex values
- arbitrary pixel values
- duplicated style strings
- inline visual values
- undocumented global CSS

---

# 5. Component API standards

## 5.1 Naming

Every component's canonical name is PascalCase, regardless of framework — this is the name used in Figma, `docs/component-specifications.md`, and Storybook's story hierarchy.

```text
Button
IconButton
FormField
DataGrid
AIActionButton
```

Each framework package maps that canonical name to its own idiom:

```text
React               PascalCase component      Button
Angular              PascalCase class,          LumenButtonComponent, selector lumen-button
                       kebab-case selector
Vue                   PascalCase component      Button (LumenButton if globally registered)
Web Components         kebab-case custom element  <lumen-button>
```

Property names follow the same pattern: a canonical camelCase name in the specification (`isLoading`, `leadingIcon`), mapped to each framework's convention (a React prop, an Angular `@Input()`, a Vue prop, or a Web Components attribute/property pair).

```text
isLoading
leadingIcon
ariaLabel
onOpenChange
```

Prefer native terminology where possible:

```text
disabled
required
selected
checked
expanded
```

Avoid unnecessary prefixes such as `isDisabled` when the native prop is `disabled`.

## 5.2 Variants

Use semantic variant names.

Recommended:

```text
primary
secondary
tertiary
ghost
link
danger
ai
```

Avoid visual implementation names:

```text
blue
gray
outlinedBlue
filledDark
```

## 5.3 Sizes

Use a consistent size vocabulary:

```text
sm
md
lg
```

Add `xs` or `xl` only when approved by the design system.

## 5.4 Slots

Use slots for components with replaceable subregions.

Examples:

```text
leading
trailing
header
footer
actions
description
```

Do not expose excessive styling props for every internal layer.

## 5.5 Polymorphism

Support an `asChild` or equivalent pattern only when needed and tested.

Avoid unrestricted polymorphic APIs that weaken type safety or accessibility.

## 5.6 Controlled and uncontrolled state

Interactive composites should clearly document controlled and uncontrolled usage.

Examples:

```ts
open
defaultOpen
onOpenChange
```

Do not mix both models ambiguously.

---

# 6. Component state model

Each interactive component must define applicable states.

```text
Default
Hover
Pressed
Focus
Focus Visible
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

Not every component needs every state. Unsupported combinations must not be exposed in Figma or code.

## State rules

- Disabled controls must not trigger actions.
- Loading controls must prevent duplicate activation where appropriate.
- Focus-visible treatment must use approved focus tokens.
- Error states must include text or semantic messaging, not color alone.
- Hover-only information must also be available through keyboard or touch interaction.
- Selected and pressed must not be visually ambiguous.

---

# 7. Button architecture

Button is a foundational primitive and must remain tightly governed. This
section is kept in sync with the full specification in
`docs/component-specifications.md` §5 — that document is authoritative for
behavior, content, accessibility, and Storybook detail; this section covers
architecture-level contract shape only. Reconciled against the shipped
implementation (`packages/ui/src/primitives/Button.tsx`, Lumen-AI-Design-System node
`475:7210`) on 2026-07-12 — see `docs/roadmap.md` Phase 13 Findings.

## 7.1 Supported variants

```text
Primary
Raised
Secondary
Tertiary
Link
```

Icon only and Pill are independent modifiers, not variants — see
`docs/component-specifications.md` §5 "Modifiers".

## 7.2 Supported sizes

```text
Xs
Sm
Md
Lg
```

## 7.3 Supported properties

```text
variant
size
status
iconOnly
pill
disabled
loading
iconStart
iconEnd
children
type
```

Icon-only buttons require an accessible name.

## 7.4 Anatomy

```text
Button
├── State layer
├── Content
│   ├── Leading icon
│   ├── Label
│   └── Trailing icon
├── Loading indicator
└── Focus ring
```

## 7.5 Suggested API

The properties listed in §7.3 form the framework-neutral contract. Below is the current React reference implementation of that contract; a future Angular, Vue, or Web Components package exposes the same properties through its own idiom. React names the `loading` contract property `isLoading` (see `docs/component-specifications.md` §5 for why that's an inconsistency, not the canonical name).

```tsx
<Button
  variant="primary"
  size="md"
  iconStart={<PlusIcon />}
  isLoading={false}
  disabled={false}
>
  Create project
</Button>
```

## 7.6 Button rules

- Use one primary action per logical region where possible.
- Do not use a disabled state to hide unavailable permissions without explanation.
- Loading must preserve button width.
- Icon-only buttons must provide `aria-label`.
- Link buttons must behave like links when navigation is intended.
- Destructive or irreversible actions require clear intent and, when consequences are significant, confirmation — regardless of which variant presents them.

---

# 8. AI component architecture

Lumen is an AI-first design system. AI components must remain human-centered, transparent, and reversible.

## 8.1 AI primitives and composites

```text
AIActionButton
AISuggestion
AIResponse
AIConfidence
AICitation
AIFeedback
AIStatus
AIEditableOutput
AIReviewPanel
```

## 8.2 Required AI states

```text
Idle
Generating
Streaming
Complete
Needs review
Low confidence
Error
Unavailable
Cancelled
```

## 8.3 AI interaction requirements

AI components should support:

- clear system status
- source or evidence visibility
- confidence where meaningful
- edit and correction
- accept and reject
- regenerate
- undo
- cancellation
- feedback
- human review
- disclosure that content is AI-generated

Avoid decorative AI styling that does not communicate function.

---

# 9. Accessibility architecture

All components must meet WCAG 2.2 AA unless a stricter product requirement applies.

## Required checks

- semantic HTML
- accessible names
- keyboard navigation
- logical focus order
- visible focus
- contrast
- touch target size
- screen-reader announcements
- error association
- high zoom
- reflow
- reduced motion
- localization
- right-to-left support where required

## Headless behavior

For complex controls, use established accessible behavior primitives where appropriate. Visual styling must remain owned by Lumen tokens and component specifications.

## Accessibility ownership

Each component must document:

```text
Role
Accessible name
Keyboard interaction
Focus behavior
ARIA attributes
Announcements
Known constraints
```

---

# 10. Responsive and density architecture

Components should adapt through content and container behavior before introducing breakpoint-specific variants.

## Responsive rules

- avoid fixed widths unless required
- define minimum and maximum widths
- support text wrapping
- support localization expansion
- preserve touch targets
- use container-aware composition for complex components

## Density

Enterprise components may support:

```text
comfortable
compact
```

Density must be implemented through approved tokens, not arbitrary style overrides.

Do not add density variants to components that do not benefit from them.

---

# 11. Storybook architecture

Every production component requires Storybook coverage.

## Required stories

```text
Overview
All variants
All sizes
Interactive states
Loading
Disabled
With icons
Long content
Localization
Dark mode
Accessibility
Edge cases
```

## Story naming

```text
Components/Primitives/Button
Components/Composites/Form Field
Components/Enterprise/Data Grid
Patterns/AI Review
```

## Controls

Storybook controls should expose only supported public props.

Do not expose internal implementation details.

## Documentation

Each component page should include:

- purpose
- anatomy
- variants
- states
- usage
- accessibility
- content guidance
- token references
- Figma link
- implementation examples
- change history

## Visual regression

All stable variants and states should be included in visual regression coverage.

---

# 12. Testing architecture

Every component should include the relevant test layers.

## Unit tests

Validate:

- rendering
- props
- events
- state changes
- controlled and uncontrolled behavior

## Accessibility tests

Validate:

- automated accessibility rules
- accessible names
- keyboard navigation
- focus behavior
- ARIA state changes

## Visual tests

Validate:

- variants
- states
- themes
- density
- responsive layouts
- high-risk regressions

## Integration tests

Use for complex composites and patterns.

Examples:

- dialog focus management
- form validation
- data-grid selection
- menu keyboard behavior
- AI streaming and cancellation

---

# 13. Figma-to-code mapping

Each published Figma component should map to one component-specification entry, which in turn maps to one implementation per shipped framework package.

Recommended mapping record — one row per framework package that ships the component:

| Field | Description |
|---|---|
| Figma component | Published component or component-set name |
| Node ID | Stable Figma node identifier |
| Framework | React, Angular, Vue, Web Components, ... |
| Code component | Export name or custom-element tag in that framework package |
| Source | Repository path |
| Storybook | Story path |
| Status | Mapped, partial, pending, deprecated |
| Last synchronized | Date or release |

Use Figma Code Connect for approved production mappings.

Example — three framework packages now ship Button, so it gets three rows, not one replaced by the others:

```text
Figma: Button
Framework: React
Code: Button
Source: packages/ui/src/primitives/Button.tsx
Storybook: Components/Primitives/Button

Figma: Button
Framework: Web Components
Code: lumen-button (custom element)
Source: packages/web-components/src/button/lumen-button.ts
Storybook: not covered — see packages/web-components/README.md

Figma: Button
Framework: Angular
Code: LumenButtonComponent (selector: lumen-button)
Source: packages/angular/src/button/lumen-button.ts
Storybook: not covered — see packages/angular/README.md
```

Figma and code variant names should match unless a documented platform constraint requires an explicit mapping. All three rows above match each other, the real shipped behavior, and `docs/component-specifications.md` §5 — that spec was reconciled against the real implementation on 2026-07-12, see `docs/roadmap.md` Phase 13 Findings for the history.

As of 2026-07-14, `SplitButton`, `FilterChip`, `ChoiceChip`, and `AIButton`
also ship as three-row (React/Web Components/Angular) mappings, same
pattern as Button:

```text
Figma: Split Button          Node: 555:300
React: SplitButton                    packages/ui/src/composite/SplitButton.tsx
Web Components: lumen-split-button    packages/web-components/src/split-button/lumen-split-button.ts
Angular: LumenSplitButtonComponent    packages/angular/src/split-button/lumen-split-button.ts

Figma: Filter Chip            Node: 581:409
React: FilterChip                     packages/ui/src/primitives/FilterChip.tsx
Web Components: lumen-filter-chip     packages/web-components/src/filter-chip/lumen-filter-chip.ts
Angular: LumenFilterChipComponent     packages/angular/src/filter-chip/lumen-filter-chip.ts

Figma: Choice Chip            Node: 581:485
React: ChoiceChip                     packages/ui/src/primitives/ChoiceChip.tsx
Web Components: lumen-choice-chip     packages/web-components/src/choice-chip/lumen-choice-chip.ts
Angular: LumenChoiceChipComponent     packages/angular/src/choice-chip/lumen-choice-chip.ts

Figma: AI Button              Node: 760:1965
React: AIButton                       packages/ui/src/primitives/AIButton.tsx
Web Components: lumen-ai-button       packages/web-components/src/ai-button/lumen-ai-button.ts
Angular: LumenAIButtonComponent       packages/angular/src/ai-button/lumen-ai-button.ts
```

Storybook coverage for all three Web Components/Angular rows above remains
"not covered" (same open decision noted in each package's README).

As of 2026-07-20, sourced from the "appshell-desktop-closed-light"
reference screen (node `1197:1652`), `KPICard`, `Theme Toggle`, and
`Footer` ship as three-row (React/Web Components/Angular) mappings, same
pattern as Button. `Page Header` remains React-only — page/composite-level,
no Web Components/Angular equivalent expected:

```text
Figma: KPICard                 Node: 1197:1652 (1102:6521-23)
React: KPICard                         packages/ui/src/primitives/KPICard.tsx
Web Components: lumen-kpi-card         packages/web-components/src/kpi-card/lumen-kpi-card.ts
Angular: LumenKPICardComponent         packages/angular/src/kpi-card/lumen-kpi-card.ts

Figma: Theme Toggle             Node: 1197:1652 (Header instance)
React: ThemeToggle                     packages/ui/src/primitives/ThemeToggle.tsx
Web Components: lumen-theme-toggle     packages/web-components/src/theme-toggle/lumen-theme-toggle.ts
Angular: LumenThemeToggleComponent     packages/angular/src/theme-toggle/lumen-theme-toggle.ts

Figma: Footer                   Node: 1197:1652 (1102:6529)
React: Footer                          packages/ui/src/layout/Footer.tsx
Web Components: lumen-footer           packages/web-components/src/footer/lumen-footer.ts
Angular: LumenFooterComponent          packages/angular/src/footer/lumen-footer.ts

Figma: Page Header               Node: 1197:1652 (1102:6519)
React: PageHeader                      packages/ui/src/composite/PageHeader.tsx
```

Storybook coverage for the Web Components/Angular rows above remains "not
covered" (same open decision noted in each package's README).

`AppShell` gained an additive `variant="rail"` (the sourced 64px collapsed
NavigationRail) alongside the unchanged default `"sidebar"`; `Avatar`
gained an additive `tone="neutral"`. Neither is a new component — both
keep their existing `packages/ui/src/{layout/AppShell,primitives/Avatar}.tsx`
mapping. The Header's notification bell and the table's status pills
reuse `Button`/`Badge`/`DataTable` with no new component, per §1.3
"Composition before duplication."

---

# 14. Component maturity model

Each component should carry a maturity status.

```text
Draft
Experimental
Beta
Stable
Deprecated
Removed
```

## Draft

- incomplete specification
- not published for product use

## Experimental

- available for evaluation
- API may change

## Beta

- usable with documented constraints
- requires feedback and additional validation

## Stable

- approved Figma and code implementation
- documented
- tested
- accessible
- versioned

## Deprecated

- still available temporarily
- replacement and migration guidance required

## Removed

- no longer exported
- major version change required when public API is affected

---

# 15. Change and release rules

Use semantic versioning.

## Patch

- defect correction
- accessibility fix
- documentation correction
- visual correction that does not change the public contract

## Minor

- new component
- new non-breaking variant
- new optional prop
- additive token support

## Major

- removed component
- renamed public prop
- changed default behavior
- incompatible visual or interaction contract

Every component change must update:

```text
docs/changelog.md
component source
tests
Storybook
documentation
Figma-to-code synchronization record
```

---

# 16. Deprecation policy

A deprecated component or prop must include:

- deprecation reason
- recommended replacement
- migration example
- target removal version
- Storybook warning
- TypeScript deprecation annotation where appropriate

Example:

```ts
/** @deprecated Use `variant="tertiary"` instead. */
quiet?: boolean;
```

Do not remove a stable public API without an approved major release.

---

# 17. Quality gates

A component is ready for release only when:

- [ ] Figma specification is approved.
- [ ] Figma component properties and variants are correctly structured.
- [ ] Component uses approved tokens.
- [ ] Public API is typed and reviewed.
- [ ] Unsupported variant combinations are prevented.
- [ ] Keyboard interaction is validated.
- [ ] Screen-reader behavior is validated.
- [ ] Focus treatment is visible.
- [ ] Light and dark modes are verified.
- [ ] Responsive behavior is verified.
- [ ] Localization expansion is tested.
- [ ] Unit tests pass.
- [ ] Accessibility tests pass.
- [ ] Visual regression tests pass.
- [ ] Storybook documentation is complete.
- [ ] Figma and code naming are synchronized.
- [ ] Changelog is updated.
- [ ] No unrelated components were modified.

---

# 18. Claude Code protocol

Before updating a component, Claude Code must read:

```text
AGENTS.md
docs/figma-source.md
docs/design-tokens.md
docs/component-architecture.md
docs/changelog.md
```

Then follow this workflow:

1. Identify the exact component changes listed in `changelog.md`.
2. Inspect the corresponding Figma component or approved specification.
3. Inspect the current code, stories, tests, and token dependencies.
4. Produce a concise impact summary.
5. Update only affected files.
6. Preserve existing APIs unless a breaking change is explicitly approved.
7. Run tests, accessibility checks, type checks, and Storybook build.
8. Report changed files and unresolved differences.
9. Do not regenerate or refactor unrelated components.
10. Do not invent missing Figma states, tokens, or behavior.

## Reusable Claude Code prompt

```markdown
Read:

- `docs/figma-source.md`
- `docs/design-tokens.md`
- `docs/component-architecture.md`
- `docs/changelog.md`

Treat the published Figma library as the source of truth.

Apply only the component changes documented in `changelog.md`.
Update only the affected component source, tokens, Storybook stories, tests, documentation, and exports.

Preserve the existing architecture, public API, naming conventions, and backward compatibility unless a breaking change is explicitly approved.

Do not regenerate the design system.
Do not refactor unrelated components.
Do not invent missing Figma specifications.

Run type checks, tests, accessibility checks, and the Storybook build.
Then summarize:
1. files changed
2. behavior changed
3. validation results
4. unresolved Figma-to-code differences
```

---

# 19. Component specification template

Use this structure for individual component documentation.

```markdown
# Component name

## Status
Stable

## Purpose
What the component does.

## When to use
Approved use cases.

## When not to use
Alternatives and anti-patterns.

## Anatomy
Named component regions.

## Variants
Supported semantic variants.

## Sizes
Supported sizes.

## States
Supported interaction states.

## Properties
Figma properties and code props.

## Behavior
Interaction and responsive behavior.

## Accessibility
Keyboard, semantics, focus, and announcements.

## Content guidance
Labels, descriptions, and localization.

## Tokens
Component and semantic token dependencies.

## Figma mapping
Figma component and node reference.

## Code mapping
Package export and source path.

## Storybook
Story path and required examples.

## Testing
Unit, accessibility, visual, and integration coverage.

## Change history
Component-specific changes.
```

---

# 20. Current source coverage

The supplied Figma node documents the Lumen foundation sections:

- Colors
- Typography
- Scale
- Spacing
- Radius

These foundations inform the component architecture described here.

The referenced node does not expose a complete component inventory or component-set property model. Therefore, component names, variants, APIs, and mappings in this document define the required architecture and governance model, but individual production components must be synchronized against their specific Figma component node URLs before implementation.