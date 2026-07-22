# Lumen Development Guidelines

> Engineering standards for the **Lumen AI Design System**, including token implementation, React component development, Storybook maintenance, testing, accessibility, versioning, and incremental synchronization with Figma.
>
> This document covers the current React reference implementation package specifically (`@lumen/ui`, `@lumen/patterns`). It is not the design system's component contract — that is `docs/component-specifications.md`, which is framework-neutral. A future non-React framework package gets its own development-guidelines equivalent; see `docs/component-architecture.md` §0 for the layer diagram.

## Source

- **Figma file:** Lumen AI Design System
- **File key:** `GJBYRm6ySR7XIECFcHMgy2`
- **Design Tokens node:** `426:4395`
- **Dev Mode URL:** https://www.figma.com/design/GJBYRm6ySR7XIECFcHMgy2/Lumen-AI-Design-System?node-id=426-4395&m=dev
- **Local Storybook:** http://localhost:6006/?path=/docs/introduction--docs
- **Last reviewed:** 2026-07-15

## Related documents

```text
AGENTS.md
docs/figma-source.md
docs/design-tokens.md
docs/component-architecture.md
docs/component-specifications.md
docs/accessibility.md
docs/storybook-guidelines.md
docs/development-guidelines.md
docs/changelog.md
```

---

# 1. Purpose

This document defines how Lumen must be developed and maintained in code.

It ensures that:

- Figma and implementation remain synchronized
- tokens are reused instead of hardcoded values
- components remain composable, accessible, and typed
- Storybook reflects production behavior
- changes remain incremental
- Claude Code avoids unnecessary rewrites
- releases remain stable and reviewable

---

# 2. Source-of-truth model

Use this hierarchy:

```text
Published Figma Variables and Components
    ↓
Approved Figma Dev Mode specification
    ↓
Exported design-token files
    ↓
Lumen component source
    ↓
Storybook
    ↓
Consuming applications
```

When sources conflict:

1. Published and approved Figma specifications define visual intent.
2. Exported token files define exact machine-readable values.
3. Component specifications define behavior and accessibility.
4. `changelog.md` defines the authorized scope of change.
5. Existing implementation must not be overwritten when Figma data is incomplete.
6. Claude Code must report ambiguity instead of inventing values or behavior.

---

# 3. Required development workflow

For every change:

```text
Update Figma
    ↓
Approve or publish the change
    ↓
Export changed tokens or identify the component node
    ↓
Update changelog.md
    ↓
Implement only the affected delta
    ↓
Update Storybook and tests
    ↓
Validate locally
    ↓
Commit and publish
```

## Required sequence

1. Read the current `changelog.md`.
2. Identify affected Figma nodes, tokens, and components.
3. Inspect the current code before editing.
4. Update only affected files.
5. Preserve existing APIs unless a breaking change is approved.
6. Run validation.
7. Review the local Storybook.
8. Document unresolved differences.
9. Commit only after the implementation matches approved Figma changes.

---

# 4. Repository architecture

Recommended structure:

```text
lumen-design-system/
├── AGENTS.md
├── README.md
├── docs/
│   ├── figma-source.md
│   ├── design-tokens.md
│   ├── component-architecture.md
│   ├── component-specifications.md
│   ├── accessibility.md
│   ├── storybook-guidelines.md
│   ├── development-guidelines.md
│   └── changelog.md
│
├── packages/
│   ├── tokens/
│   │   ├── src/
│   │   │   ├── primitives.json
│   │   │   ├── semantic.json
│   │   │   ├── components/
│   │   │   └── themes/
│   │   ├── dist/
│   │   └── package.json
│   │
│   ├── icons/
│   │   ├── src/
│   │   └── package.json
│   │
│   └── components/
│       ├── src/
│       │   ├── primitives/
│       │   ├── composites/
│       │   ├── enterprise/
│       │   ├── ai/
│       │   ├── hooks/
│       │   ├── utilities/
│       │   └── index.ts
│       ├── tests/
│       └── package.json
│
├── apps/
│   └── storybook/
│       ├── .storybook/
│       ├── stories/
│       └── package.json
│
└── scripts/
    ├── build-tokens.*
    ├── validate-tokens.*
    └── check-figma-sync.*
```

Use the actual repository structure where it already exists. Do not reorganize the project without explicit approval.

---

# 5. Technology standards

Lumen should use the repository’s established stack.

Expected stack:

```text
TypeScript
React
Storybook
CSS custom properties
Tailwind CSS where already configured
pnpm workspaces
```

## Rules

- Do not introduce a new framework or styling system without approval.
- Do not replace existing tooling for convenience.
- Use the repository’s configured package manager.
- Use the installed versions and project conventions.
- Read framework-specific project documentation before changing architecture.
- Prefer existing utilities and components over new dependencies.

---

# 6. Design-token implementation

## 6.1 Token layers

Lumen uses:

```text
Primitive tokens
    ↓
Semantic tokens
    ↓
Component tokens
```

Examples:

```text
Color/Blue/600
Color/Background/Brand
Button/Primary/Background/Default
```

## 6.2 Generated outputs

Recommended generated outputs:

```text
tokens.json
tokens.css
tokens.ts
tokens.d.ts
tailwind-theme.ts
```

## 6.3 Rules

- Do not hardcode values where a token exists.
- Do not manually edit generated token outputs.
- Keep source and generated token files separate.
- Preserve aliases when the token pipeline supports references.
- Preserve mode names and descriptions.
- Validate Light and Dark themes.
- Do not flatten semantic meaning into raw values without a documented reason.
- New tokens require changelog documentation.
- Renamed or removed tokens require migration guidance.

## 6.4 Correct usage

```css
.button {
  background: var(--lumen-button-primary-background-default);
  color: var(--lumen-button-primary-text-default);
  border-radius: var(--lumen-button-radius);
}
```

## 6.5 Incorrect usage

```css
.button {
  background: #0c77da;
  color: #ffffff;
  border-radius: 8px;
}
```

---

# 7. CSS custom-property standards

Use the prefix:

```text
--lumen-
```

Examples:

```css
--lumen-color-background-default
--lumen-color-text-primary
--lumen-spacing-16
--lumen-radius-lg
--lumen-button-primary-background-hover
```

## Rules

- Use kebab-case.
- Preserve semantic hierarchy.
- Avoid abbreviations that reduce clarity.
- Do not expose internal implementation tokens unless intentionally public.
- Use theme selectors consistently.

Example:

```css
:root,
[data-theme="light"] {
  /* Light semantic tokens */
}

[data-theme="dark"] {
  /* Dark semantic tokens */
}
```

---

# 8. React component standards

## 8.1 TypeScript

All public components must be fully typed.

```tsx
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "accent" | "secondary" | "outline" | "ghost" | "destructive";
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
}
```

(Matches the real `Button.tsx` — see `docs/component-specifications.md` §5
for the full property contract.)

Avoid:

- `any`
- untyped public props
- duplicated prop definitions
- broad index signatures
- undocumented escape hatches

## 8.2 Native HTML attributes

Extend native element attributes where practical.

Examples:

```ts
React.ButtonHTMLAttributes<HTMLButtonElement>;
React.InputHTMLAttributes<HTMLInputElement>;
```

Do not block native attributes unnecessarily.

## 8.3 Ref forwarding

Forward refs for components that consumers may need to focus, measure, or integrate.

```tsx
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  return <button ref={ref} {...props} />;
});
```

## 8.4 Display names

Set display names for wrapped or forwarded components.

```ts
Button.displayName = "Button";
```

## 8.5 Composition

Prefer composition over large Boolean prop APIs.

Preferred:

```tsx
<Card>
  <CardHeader />
  <CardContent />
  <CardFooter />
</Card>
```

Avoid components with excessive unrelated configuration.

## 8.6 Controlled and uncontrolled behavior

Interactive composites must clearly support one or both patterns.

```text
open
defaultOpen
onOpenChange
```

Document the behavior.

---

# 9. Component API standards

## Naming

Use:

```text
PascalCase for components
camelCase for props
lowercase semantic variant values
```

Examples:

```tsx
<Button variant="primary">Create project</Button>
```

## Variant names

Use semantic names:

```text
primary
accent
secondary
outline
ghost
link
destructive
```

Avoid:

```text
blue
gray
outlinedBlue
darkFilled
```

## Sizes

Use:

```text
sm
md
lg
```

Add `xs` or `xl` only after review.

## Boolean props

Use positive and clear names:

```text
disabled
loading
selected
required
```

Avoid ambiguous double negatives.

## Public API

- Keep APIs minimal.
- Do not expose internal layers as style props.
- Avoid arbitrary `color`, `spacing`, or `radius` props.
- Use slots only where composition requires them.
- Preserve backward compatibility.

---

# 10. Styling standards

Use the project’s approved styling approach.

Permitted patterns may include:

- CSS custom properties
- CSS Modules
- Tailwind utilities mapped to Lumen tokens
- typed variant utilities already present in the repository

## Rules

- Never introduce arbitrary color values.
- Avoid arbitrary spacing and radius utilities.
- Avoid inline visual styles.
- Do not duplicate large class strings.
- Do not use `!important` except for a documented compatibility reason.
- Keep states and variants explicit.
- Keep responsive logic predictable.
- Support Light and Dark modes.
- Preserve the customized Storybook UI.

## Tailwind

When Tailwind is used:

```ts
// preferred
className = "bg-surface-brand text-on-brand rounded-control-md";

// avoid
className = "bg-[#0c77da] text-white rounded-[8px]";
```

Tailwind theme values must resolve to Lumen tokens.

---

# 11. Accessibility implementation

Lumen targets WCAG 2.2 AA.

Read:

```text
docs/accessibility.md
```

## Required standards

- Use semantic HTML.
- Preserve native keyboard behavior.
- Implement visible focus.
- Provide accessible names.
- Associate errors and supporting text.
- Respect reduced-motion preferences.
- Support browser zoom and reflow.
- Avoid color-only communication.
- Use ARIA only where native semantics are insufficient.

## Accessibility is release-blocking

Critical and high-severity accessibility defects block release.

---

# 12. Icon implementation

Use the approved icon package consistently.

## Rules

- Use one icon system per product surface unless explicitly approved.
- Keep icon stroke and sizing consistent.
- Decorative icons must be hidden from assistive technology.
- Icon-only controls require accessible labels.
- Do not embed arbitrary SVG copies throughout components.
- Export icons through a central package.
- Preserve tree-shaking.

Example:

```tsx
import { Search } from "@lumen/icons";
```

---

# 13. Storybook development

Local Storybook:

```text
http://localhost:6006/?path=/docs/introduction--docs
```

Read:

```text
docs/storybook-guidelines.md
```

## Story requirements

Every stable component should include:

```text
Overview
Variants
Sizes
States
Dark mode
Long content
Keyboard focus
Accessibility
Edge cases
```

## Story rules

- Stories must use public component APIs.
- Do not import private internals.
- Controls must expose only supported props.
- Use realistic enterprise examples.
- Keep stories deterministic.
- Avoid network dependencies.
- Mock asynchronous behavior.
- Include visual-regression coverage for stable states.
- Preserve the customized Lumen Storybook shell and branding.

## Customized Storybook UI

Do not:

- revert the custom theme
- replace Lumen navigation
- remove brand styling
- overwrite manager configuration
- introduce inconsistent backgrounds
- discard custom Docs layouts

Storybook upgrades must retain Lumen’s UX and brand alignment.

---

# 14. Testing standards

## Unit tests

Validate:

- rendering
- props
- events
- state transitions
- controlled behavior
- disabled behavior
- loading behavior

## Accessibility tests

Validate:

- semantics
- accessible names
- ARIA states
- keyboard interaction
- focus management
- automated accessibility rules

## Visual regression

Validate:

- variants
- sizes
- states
- themes
- density
- responsive layouts
- customized Storybook presentation where relevant

## Integration tests

Use for:

- dialogs
- menus
- forms
- comboboxes
- data grids
- upload workflows
- AI streaming and cancellation

## Test rules

- Test public behavior, not implementation details.
- Keep tests deterministic.
- Avoid brittle selectors.
- Prefer role and accessible-name queries.
- Update snapshots only after reviewing the visual change.
- Do not delete failing tests merely to unblock a build.

---

# 15. Performance standards

Components should be efficient by default.

## Requirements

- Avoid unnecessary re-renders.
- Keep bundle impact reasonable.
- Preserve tree-shaking.
- Avoid importing full icon libraries when individual exports are available.
- Use virtualization only for genuinely large datasets.
- Lazy-load expensive optional features.
- Keep Storybook stories responsive.
- Avoid heavy dependencies for simple behavior.

Measure before optimizing complex behavior.

---

# 16. Responsive and localization standards

## Responsive

- Avoid fixed widths unless required.
- Support text wrapping.
- Define minimum and maximum dimensions.
- Preserve target sizes.
- Test narrow containers.
- Ensure overlays fit the viewport.

## Localization

- Support longer labels.
- Avoid fixed text containers.
- Do not concatenate translated fragments.
- Keep dates, numbers, and currencies locale-aware.
- Support RTL where product requirements apply.
- Keep icon directionality explicit.

---

# 17. AI component development

Lumen is an AI-first design system.

AI components must support:

```text
Idle
Generating
Streaming
Complete
Needs Review
Low Confidence
Error
Cancelled
Unavailable
```

## Requirements

- Identify AI-assisted behavior.
- Preserve human control.
- Support cancel, edit, accept, reject, regenerate, and undo where appropriate.
- Show evidence or citations when available.
- Do not imply certainty without justification.
- Keep generated output accessible.
- Preserve user-authored content.
- Support status announcements without excessive live-region output.

---

# 18. Error handling

Components should fail predictably and visibly.

## Requirements

- Avoid silent failures.
- Preserve user input.
- Provide actionable messages.
- Support retry where applicable.
- Log developer-facing errors without exposing sensitive data.
- Use Error Boundaries for isolated rendering failures where appropriate.
- Document known limitations.

---

# 19. Dependency management

## Rules

- Prefer existing dependencies.
- Avoid overlapping libraries.
- Review bundle size and maintenance status.
- Pin versions according to repository policy.
- Keep peer dependencies accurate.
- Do not upgrade unrelated packages during a component update.
- Separate dependency upgrades from visual changes when practical.

Use the configured package manager:

```text
pnpm
```

Do not mix `npm`, `yarn`, and `pnpm` lockfiles.

---

# 20. Package exports

Expose only supported public APIs.

Example:

```ts
export { Button } from "./primitives/button";
export type { ButtonProps } from "./primitives/button";
```

## Rules

- Do not export internal helpers.
- Maintain stable entry points.
- Preserve tree-shaking.
- Keep type exports available.
- Add new exports explicitly.
- Treat removed exports as breaking changes.

---

# 21. Versioning

Use semantic versioning.

## Patch

- bug fix
- accessibility correction
- documentation fix
- non-breaking token-value correction

## Minor

- new component
- new non-breaking variant
- new optional prop
- additive token
- new Storybook documentation

## Major

- removed component
- renamed public prop
- removed token
- incompatible default behavior
- changed semantic contract

Update:

```text
package version
changelog.md
migration guidance
release notes
```

---

# 22. Deprecation

A deprecated API must include:

- reason
- replacement
- migration example
- target removal version
- TypeScript deprecation annotation
- Storybook warning
- changelog entry

Example:

```ts
/** @deprecated Use `variant="tertiary"` instead. */
quiet?: boolean;
```

Do not remove a stable API without an approved major release.

---

# 23. Git and pull-request standards

## Branches

Use focused branches.

Example:

```text
feat/button-ai-variant
fix/button-focus-ring
tokens/update-brand-colors
docs/storybook-guidelines
```

## Commits

Keep commits scoped and descriptive.

Examples:

```text
feat(button): add AI variant
fix(tokens): correct dark focus alias
docs(storybook): document button loading state
```

## Pull requests

Each PR should include:

- Figma node or Dev Mode link
- changelog entry
- affected components
- screenshots or Storybook links
- accessibility impact
- test results
- migration notes
- known limitations

Avoid combining unrelated refactors and design updates in one PR.

---

# 24. Review checklist

Before merge:

- [ ] Change is listed in `changelog.md`.
- [ ] Correct Figma node was used.
- [ ] Only affected files changed.
- [ ] No hardcoded token-backed values were introduced.
- [ ] Public APIs remain stable.
- [ ] TypeScript passes.
- [ ] Unit tests pass.
- [ ] Accessibility tests pass.
- [ ] Storybook builds.
- [ ] Light and Dark modes were reviewed.
- [ ] Customized Storybook UI remains intact.
- [ ] Visual regression was reviewed.
- [ ] Documentation is updated.
- [ ] Migration notes exist for breaking or deprecated changes.
- [ ] No unrelated dependencies were updated.

---

# 25. Validation commands

Use the scripts already defined in the repository.

Typical commands may include:

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm storybook
pnpm build-storybook
```

Do not assume these exact scripts exist. Inspect `package.json` before running commands.

For the local Storybook:

```text
http://localhost:6006/?path=/docs/introduction--docs
```

---

# 26. Claude Code protocol

Before making changes, Claude Code must read:

```text
AGENTS.md
docs/figma-source.md
docs/design-tokens.md
docs/component-architecture.md
docs/component-specifications.md
docs/accessibility.md
docs/storybook-guidelines.md
docs/development-guidelines.md
docs/changelog.md
```

Then:

1. Read the latest `[Unreleased]` section.
2. Identify the exact affected Figma nodes.
3. Inspect existing source, stories, tests, tokens, and exports.
4. Produce a concise impact summary.
5. Update only affected files.
6. Preserve architecture and public APIs.
7. Run available validation.
8. Review the local Storybook.
9. Report unresolved Figma-to-code differences.
10. Never regenerate the entire design system.

## Reusable prompt

```markdown
Read:

- `docs/figma-source.md`
- `docs/design-tokens.md`
- `docs/component-architecture.md`
- `docs/component-specifications.md`
- `docs/accessibility.md`
- `docs/storybook-guidelines.md`
- `docs/development-guidelines.md`
- `docs/changelog.md`

Apply only the changes listed under `[Unreleased]`.

Treat the approved Figma node and exported token files as the source of truth.
Update only affected tokens, components, stories, tests, documentation, and exports.

Preserve:

- existing architecture
- public APIs
- accessibility behavior
- Lumen Storybook branding and customization
- unrelated files

Do not:

- regenerate the design system
- refactor unrelated components
- introduce hardcoded design values
- invent missing Figma values or behavior
- replace existing dependencies without approval

Inspect `package.json`, run the available lint, type-check, test, build, and Storybook commands, then report:

1. files changed
2. tokens changed
3. components affected
4. API changes
5. validation results
6. unresolved Figma-to-code differences
```

---

# 27. Current Figma verification status

Verified from the supplied Figma foundation node:

- Colors section
- Typography section
- Scale section
- Spacing section
- Radius section
- visible typography sizes and line heights
- spacing scale
- radius scale

The Figma design-context request returned a selection-related error, so the following still require direct component or variable verification:

- exact color values and aliases
- variable collections and modes
- font families and weights
- component inventory
- component properties
- component-specific dimensions
- focus-token values
- Light and Dark semantic mappings
- Code Connect mappings

Do not infer these values during development.
