# Lumen Design Tokens Changelog

All notable changes to the **Lumen Design Tokens** are recorded in this file.

This changelog follows the principles of [Keep a Changelog](https://keepachangelog.com/) and uses semantic versioning.

## Source

- **Figma file:** Lumen AI Design System
- **Dev Mode node:** `426:4395`
- **Reference:** https://www.figma.com/design/GJBYRm6ySR7XIECFcHMgy2/Lumen-AI-Design-System?node-id=426-4395&m=dev
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
5. Never regenerate the entire Lumen AI Design System for an incremental update.
6. Report unresolved Figma-to-code differences instead of inventing values.

---

## Changelog conventions

Use the following headings for every release:

```markdown
## [Unreleased]

### Added

- Added `@lumen/web-components`, a new framework package shipping `<lumen-button>` — a Web Components (Lit) implementation of Button, Lumen's first non-React framework package.
  - Source: `docs/roadmap.md` Phase 13 (Multi-framework expansion); no new Figma node — implements the same design already sourced from Lumen-AI-Design-System node 475:7210 for `@lumen/ui`'s `Button.tsx`
  - Previous: no non-React framework package existed; `docs/roadmap.md` Phase 13 listed this as a not-yet-started deliverable
  - Current: `packages/web-components/src/button/lumen-button.ts` implements Button's real, shipped behavior — variants `primary | raised | secondary | tertiary | link`, sizes `xs | sm | md | lg`, `icon-only`/`pill`/`loading`/`disabled` states, `icon-start`/`icon-end` slots, `aria-disabled`/`aria-busy` handling, and the icon-only accessible-name dev warning — matching `Button.tsx` prop-for-prop with framework-idiomatic naming (`loading` not `isLoading`, slots not node props). Styled entirely through `@lumen/tokens`' CSS custom properties (`:host([variant="…"])`/`:host([size="…"])` selectors), no Tailwind. 14 Vitest/jsdom tests cover DOM structure, attribute reflection, and accessibility behavior. Building it surfaced that `docs/component-specifications.md` §5's variant list, `fullWidth` property, and `leadingIcon`/`trailingIcon` naming don't match what `Button.tsx` actually ships — this package matches the real implementation, not the inaccurate doc; see `docs/roadmap.md` Phase 13 Findings and `packages/web-components/README.md` for the full discrepancy and why it wasn't silently fixed here. No Storybook coverage yet (explicitly deferred, see Phase 13). No Changeset — new package starting at its own initial `0.1.0`, nothing to version-bump from.
  - Affects: `packages/web-components/**` (new package), `docs/roadmap.md`, `docs/component-architecture.md`, `README.md`, `CLAUDE.md`
  - Migration: none — new package, no existing public API changed
  - Validation: lint, typecheck, and test passed repo-wide (56 tests: 39 `@lumen/ui` + 3 `@lumen/patterns` + 14 `@lumen/web-components`); tokens build and production Storybook build unaffected

- Added `@lumen/angular`, a new framework package shipping `LumenButtonComponent` (`<lumen-button>`) — an Angular standalone-component implementation of Button, Lumen's second non-React framework package.
  - Source: `docs/roadmap.md` Phase 13 (Multi-framework expansion); no new Figma node — implements the same design already sourced from Lumen-AI-Design-System node 475:7210 for `@lumen/ui`'s `Button.tsx`, matching `@lumen/web-components`'s already-reconciled Button contract
  - Previous: only one non-React framework package existed (`@lumen/web-components`); `docs/roadmap.md` Phase 13 listed Angular as a not-yet-started deliverable
  - Current: `packages/angular/src/button/lumen-button.ts` implements Button's real, shipped behavior — variants `primary | raised | secondary | tertiary | link`, sizes `xs | sm | md | lg`, `iconOnly`/`pill`/`loading`/`disabled` properties, `[iconStart]`/`[iconEnd]` content-projection selectors, `aria-disabled`/`aria-busy` handling, and the icon-only accessible-name dev warning — matching `Button.tsx` and `<lumen-button>` (Web Components) prop-for-prop. Styled through `@lumen/tokens`' CSS custom properties using the same `:host([variant="…"])`/`:host([size="…"])` selectors as the Web Components version (Angular's emulated view encapsulation supports the same `:host()` syntax). Targets Angular 20 LTS, not the latest major (22) — Angular 22's compiler-cli requires TypeScript `>=6.0`, incompatible with this repo's TypeScript `^5.5.4`/resolved `5.9.3`; Angular 20 requires `>=5.8 <6.0`, which the existing resolved version already satisfies. Uses classic `@Input()` decorators rather than signal-based `input()` — Angular's JIT compiler (what `TestBed` uses under plain Vitest/esbuild, without `@angular/build` or `@analogjs/vite-plugin-angular`) can't recognize signal inputs without a compiler AST transform that only runs inside a real Angular/TypeScript compiler pipeline (`angular/angular#54013`); decorator-based inputs need no such transform, keeping this package's tooling as light as `@lumen/ui`/`@lumen/web-components`. Built and tested against `provideZonelessChangeDetection()`, no `zone.js` dependency. 15 Vitest/jsdom/`TestBed` tests cover DOM structure, attribute/content-projection reflection, and accessibility behavior. No Storybook coverage yet (same deferred decision as Web Components, see Phase 13). No Changeset — new package starting at its own initial `0.1.0`, nothing to version-bump from.
  - Affects: `packages/angular/**` (new package), `docs/roadmap.md`, `docs/component-architecture.md`, `README.md`, `CLAUDE.md`
  - Migration: none — new package, no existing public API changed
  - Validation: lint, typecheck, and test passed repo-wide (71 tests: 39 `@lumen/ui` + 3 `@lumen/patterns` + 14 `@lumen/web-components` + 15 `@lumen/angular`); tokens build and production Storybook build unaffected

### Changed

- Corrected the React Checkbox state-icon rendering method and size-specific placement to match the live Figma instances.
  - Affected token group/component: `input.{check,indeterminate}-offset-{x,y}.*` and React `Checkbox`; the six previously committed Figma SVG assets, semantic color roles, and public props remain unchanged
  - Figma source: Lumen-AI-Design-System Checkbox node `1278:2207`, re-verified with `get_design_context`; Checked image frames use Y offsets −0.33/0.33/0.38px for sm/md/lg, while Indeterminate uses X offsets 0/0.25/0.36px
  - Previous: although the deployed bundle contained the exact Figma path data, it rendered the SVGs as centered CSS masks. That differed from Figma's direct `<img>` rendering and omitted the per-size frame offsets, leaving visible placement/rendering drift.
  - Current: Checked and Indeterminate render the committed Figma exports directly as fixed-size `<img>` assets with their exact size-specific offsets. Difference blending preserves the white glyph on the light theme's black selected surface and the inverse provisional dark treatment without rewriting the exported SVG bytes. The existing `VariantCollection` already covers both states at sm/md/lg in light and dark.
  - Affects: `packages/tokens/src/input.json`, generated token output, `packages/ui/src/primitives/Checkbox.{tsx,test.tsx}`, `.changeset/checkbox-direct-figma-icons.md`, and `docs/{changelog,component-specifications,design-tokens,figma-sync}.md`
  - Migration: none — Checkbox props, native semantics, state behavior, and semantic color bindings are unchanged
  - Validation: token generation and drift checks passed; repository-wide typecheck and lint passed; all 324 tests passed (React/UI 159, including 13 Checkbox tests; Web Components 68; Angular 64; create-app 27; patterns 6); the production Storybook build passed (2,125 modules). Its Checkbox bundle renders `img`, contains all checked/indeterminate offset bindings and `mix-blend-difference`, and contains no `maskImage`; generated CSS contains the exact five non-zero Figma offsets. Browser-backed visual comparison was unavailable because no in-app browser session was present. PR checks, deployment, and published Storybook verification remain pending.
  - Changeset: `.changeset/checkbox-direct-figma-icons.md` (`@lumen/tokens` patch, `@lumen/ui` patch)

- Replaced the React Checkbox Checked and Indeterminate glyphs with the exact size-specific Figma exports.
  - Affected token group/component: `input.indeterminate-{width,height}.*` and React `Checkbox`; existing semantic color roles and public props remain unchanged
  - Figma source: Lumen-AI-Design-System Checkbox node `1278:2207`, verified with `get_design_context`, `get_variable_defs`, and all six exported SVG assets
  - Previous: Checked stretched the generic 24px `CheckIcon` into Figma-sized boxes and overrode its stroke width, which changed the published tick proportions. Indeterminate reused one malformed angled asset at approximate line dimensions rather than the three horizontal size-specific vectors.
  - Current: Checked uses the exact 10.5×7.833px, 13.125×9.792px, and 15×11.191px exported vectors. Indeterminate uses the exact 10.500×2.5px, 12.625×3.125px, and 14.287×3.572px exported vector bounds. All six assets retain Figma's path data, rounded caps/joins, and bold size-specific strokes, and render as masks using `input.radio-checkbox.selected-text` in both themes. The existing `VariantCollection` already covers both icon states at all three sizes in light and dark, so no new story variant is required.
  - Affects: `packages/tokens/src/input.json`, generated token output, `packages/ui/src/assets/input-checkbox-{check,indeterminate}-{sm,md,lg}.svg`, removal of the obsolete `input-checkbox-indeterminate.svg`, `packages/ui/src/primitives/Checkbox.{tsx,test.tsx}`, `.changeset/checkbox-figma-state-icons.md`, and `docs/{changelog,component-specifications,design-tokens,figma-sync}.md`
  - Migration: none — Checkbox props, native semantics, state behavior, and semantic color bindings are unchanged
  - Validation: token regeneration and drift checks passed; all six committed SVG signatures (viewBox, path, stroke, cap, and join) exactly match their live Figma exports and all six encoded paths are present in the production Checkbox story bundle; repository-wide typecheck and lint passed; all 324 tests passed (React/UI 159, including 13 Checkbox tests; Web Components 68; Angular 64; create-app 27; patterns 6); the production Storybook build passed (2,125 modules), its static index contains all six Checkbox stories, and generated CSS contains all six corrected Indeterminate dimensions. Browser-backed visual comparison was unavailable because no in-app browser session was present. PR checks, deployment, and published Storybook verification remain pending.
  - Changeset: `.changeset/checkbox-figma-state-icons.md` (`@lumen/tokens` patch, `@lumen/ui` patch)

- Synchronized React Badge and its component tokens with the published Badge variant collection.
  - Affected token group/component: `color.badge`, primitive `badge.default-bg`, `radius.pill`, `typography.badge-{sm,md,lg}`, and React `Badge`
  - Figma source: Lumen-AI-Design-System node `1079:893`, verified with `get_design_context` and `get_variable_defs`; the Figma description says nine statuses but the live component set contains 10 concrete statuses because Gray is also present, so all 10 rendered variants are implemented
  - Previous: Badge exposed one compact size and six generic `tone` variants, used generic semantic/status colors and semibold label typography, and had no leading-dot API or component-scoped Badge tokens
  - Current: canonical `status` variants are `default | gray | success | warning | error | deep-purple | purple | light-blue | yellow | pink`; `size="sm" | "md" | "lg"` binds exact padding, 6/7/8px dots, and 11/16, 12/18, 14/20 medium typography; `showDot` is optional and defaults to the Figma value `true`. Exact light colors alias published Badge variables; dark colors are documented provisional ramp mirrors. The former `tone` prop remains as a compatibility alias, with legacy Brand/Info rendering preserved outside the Figma collection.
  - Affects: `packages/tokens/src/{primitives/color,semantic/color,typography,radius}.json`, generated token output, `packages/ui/src/primitives/Badge.*`, Badge story consumers in `packages/ui/src/{composite,layout}`, `.changeset/badge-design-tokens.md`, and `docs/{changelog,component-specifications,design-tokens,figma-sync}.md`
  - Migration: additive for component consumers; prefer `status` over deprecated `tone`. Existing `tone` calls remain valid. Badge now follows Figma's default leading-dot behavior; pass `showDot={false}` where a dot is not desired.
  - Validation: token generation and drift checks passed, with every expected light Badge value plus the pill radius and all three typography tiers present in generated output; repository-wide typecheck and lint passed; all 320 tests passed (React/UI 155, including 16 Badge tests; Web Components 68; Angular 64; create-app 27; patterns 6); the production Storybook build passed (2,125 modules), and its static index contains the Badge docs, playground, complete light/dark variant collection, and no-dot story. Browser-backed visual comparison was unavailable because no in-app browser session was present; source-level geometry, color-role, typography, theme, and component bindings were rechecked against the Figma extraction. PR checks, deployment, and published Storybook verification remain pending.
  - Changeset: `.changeset/badge-design-tokens.md` (`@lumen/tokens` minor, `@lumen/ui` minor)

- Corrected the React Checkbox checked-state glyph to use the shared design-system `CheckIcon`.
  - Affected token group/component: React `Checkbox`; existing `input.check.*` geometry and `input.radio-checkbox.selected-text` color roles remain unchanged
  - Figma source: Lumen-AI-Design-System Checkbox node `1278:2207`; correction requested from the published `Primitives/Checkbox` variant collection
  - Previous: Checked rendered a standalone Figma-exported SVG through a CSS mask, bypassing the generated icon system; the first `CheckIcon` correction retained the smaller/thinner stock 24px icon proportions, so the published design's bold tick weight was not reproduced
  - Current: Checked renders `CheckIcon` from `packages/ui/src/icons/generated` with exact size-specific Figma vector bounds (10.5×7.833px, 13.125×9.792px, 15×11.191px) and non-scaling rounded strokes (2.5px, 3.125px, 3.571px), while retaining the selected-text color token. Indeterminate continues to use its distinct Figma-exported mask asset
  - Affects: `packages/tokens/src/input.json`, generated token output, `packages/ui/src/primitives/Checkbox.tsx`, `packages/ui/src/primitives/Checkbox.test.tsx`, removal of `packages/ui/src/assets/input-checkbox-check.svg`, `.changeset/input-design-tokens.md`, `docs/{changelog,component-specifications,design-tokens,figma-sync}.md`
  - Migration: none — the Checkbox API and state behavior are unchanged
  - Validation: token regeneration passed; all 139 React/UI tests passed; `@lumen/ui` typecheck and repository lint passed; the production Storybook build passed (2,125 modules), with all three stroke tokens and the non-scaling path rule present in the generated CSS/Checkbox story bundle
  - Changeset: `.changeset/input-design-tokens.md` (`@lumen/ui` minor, shared with the unreleased Input-family synchronization)

- Synchronized React Input, Radio, and Checkbox and their component tokens with the updated AppShell control collections.
  - Affected token group/component: `color.input`, `color.icon.default`, exact `input.*` component geometry, `spacing.60`, `typography.input-{sm,md,lg,shortcut}`, and React `Input`, `Radio`, and `Checkbox`
  - Figma source: Lumen-AI-Design-System AppShell page `1007:3700`; concrete component nodes `1262:1181` (Input), `1278:2153` (Radio), and `1278:2207` (Checkbox), verified with `get_design_context`, `get_metadata`, and `get_variable_defs`
  - Previous: Input had already gained generic sm/md/lg geometry and search anatomy but did not reflect the latest lg semibold typography or size-specific border weights. Radio and Checkbox still used browser-native 16px controls with generic border/brand/focus roles, no size API, no component-scoped Error/Disabled roles, no exact focus geometry, and no Checkbox Indeterminate API.
  - Current: Input binds the updated 16/26 semibold lg typography and 1/1.5/2px size borders. Radio and Checkbox preserve native form semantics inside exact 24/28/32px targets with 16/18.667/21.333px indicators; Default/Hover/Focused/Selected or Checked/Disabled/Error states bind to `input.primary.*` and `input.radio-checkbox.*`. Checkbox adds a native `indeterminate` property, uses the shared `CheckIcon` for Checked, and retains the exact Figma-exported indeterminate glyph asset. Light roles exactly alias published variables; dark aliases remain provisional because Figma publishes no dark control modes. Numeric native HTML `size` remains supported across all three components.
  - Affects: `packages/tokens/src/{input,primitives/color,semantic/color,spacing,typography}.json`, token builder/generated output, `packages/ui/src/icons/generated/CheckIcon.tsx`, `packages/ui/src/assets/input-checkbox-indeterminate.svg`, `packages/ui/src/primitives/{Input,Radio,Checkbox}.*`, `docs/{changelog,component-specifications,design-tokens,figma-sync}.md`
  - Migration: none — existing props and native attributes remain valid; Input's default visual height remains the Figma `md` height of 44px, while Radio/Checkbox gain additive string sizes and states
  - Validation: token generation and drift checks passed; repository-wide typecheck and lint passed; all 303 tests passed (React/UI 138, Web Components 68, Angular 64, create-app 27, patterns 6); the production Storybook build passed (2,125 modules), and its static index contains the Input, Radio, and Checkbox variant collections. Browser-backed visual comparison was unavailable because no in-app browser session was present; source-level geometry, color-role, typography, asset, theme, and component bindings were rechecked against the Figma extraction. PR checks, deployment, and published Storybook verification remain pending.
  - Changeset: `.changeset/input-design-tokens.md` (`@lumen/tokens` minor, `@lumen/ui` minor)

- Replaced every standard Button implementation and Storybook collection with the final light/dark variant collection.
  - Affected token group/component: `color.button` semantic roles and Button in React, Web Components, Angular, Storybook, AppShell, and AIPanel
  - Figma source: Lumen-AI-Design-System node `1027:3733` (`Button` collection frame `1174:1349`), verified with `get_design_context`, `get_metadata`, and per-instance `get_variable_defs`
  - Previous: variants `primary | raised | secondary | tertiary | outline | link | accent`; four sizes, pressed/loading/status treatments, pill and icon-only modifiers, and older brand/AppShell color roles. AIPanel also introduced a provisional 28px `AIPanelAction` wrapper.
  - Current at the time of this replacement: variants `primary | accent | secondary | outline | ghost | link | destructive`; one 34px height with 14px inline padding, 7px block padding, 8px gap/radius, 14px icons, 14/20 medium label typography, and exact theme-aware Default/Hover/Focused/Disabled colors. Link was subsequently removed by user direction; see the later Fixed entry. The standard collection defines no pressed, loading, status, pill, icon-only, or size variants. AIPanel/AppShell actions now use the same standard Button directly.
  - Affects: `packages/tokens/src/{primitives,semantic}/color.json`, generated token output, `packages/ui/src/primitives/Button.*`, Button consumers/stories, `packages/web-components/src/button/*`, `packages/angular/src/button/*`, package API exports/readmes, `README.md`, and the Button/API/token guidance in `docs/{component-architecture,component-specifications,design-tokens,development-guidelines,documentation-style,figma-source,figma-sync,release-process,roadmap}.md`
  - Migration: breaking — replace `raised` with `primary` or `accent`, replace `tertiary` with `ghost`, use `destructive` for dangerous actions, remove `size`/`status`/`pill`/`iconOnly`/`isLoading` (`loading` outside React), and compose separate loading or icon-only controls when required. `AIPanelAction` is removed; use `Button variant="secondary"`.
  - Validation: token build, repository-wide typecheck, lint, all framework/UI tests (React 120, Web Components 68, Angular 64, create-app 27, patterns 6), and production Storybook build (2,125 modules) passed. Browser-backed visual comparison was unavailable because no in-app browser session was present; source-level geometry/token parity was rechecked against the Figma extraction.
  - Changeset: `final-button-collection.md`

- Made the repository Quick Start self-contained for first-time installation.
  - Source: user-reported onboarding failure while following the repository Quick Start; no Figma node is involved
  - Previous: the Quick Start began with `corepack pnpm install --frozen-lockfile` and assumed the repository had already been cloned and selected as the current directory; running the subsequent shorthand `corepack pnpm lint` command from a product project without a `lint` script caused pnpm to attempt an unavailable `lint` executable
  - Current: the Quick Start now begins with `git clone https://github.com/iuixd/Lumen-AI-DS.git` and `cd Lumen-AI-DS`, and repository quality scripts use the explicit `corepack pnpm run <script>` form
  - Affects: `README.md` and the GitHub repository onboarding experience
  - Migration: none; documentation only
  - Validation: confirmed every documented quality script exists in the root `package.json`; reviewed the Markdown structure manually
  - Changeset: none (documentation-only change)

- Reworked the repository README as an audience-oriented onboarding and navigation page.
  - Source: repository documentation and deployed Storybook; no Figma node is involved
  - Previous: contributor-focused package and command reference with no prominent deployed Storybook link, audience paths, maturity status, prerequisites, architecture overview, or support guidance
  - Current: prominent Storybook and documentation links, role-based entry points, corrected Figma/token/publication facts, reliable pnpm commands, integration guidance, architecture, accessibility and quality expectations, release navigation, and support information
  - Affects: `README.md` and the GitHub repository landing experience
  - Migration: none
  - Validation: Markdown formatting check passed and all 45 repository-relative links resolve
  - Changeset: none (documentation-only change)

- Restructured README.md's "Create a React application" section into progressive disclosure, and added Corepack pnpm-version-mismatch troubleshooting guidance to Prerequisites.
  - Source: user-directed feedback that the installation walkthrough felt overwhelming, plus a live-reproduced Corepack/pnpm version-resolution failure (`corepack pnpm --version` resolving a newer cached release than this repository's `11.11.0` pin, tripping pnpm's own corepack-invocation version guard) — see `docs/roadmap.md` Phase 14 Findings
  - Previous: "Create a React application" presented the quick-start commands, the "what you get" bullets, and non-interactive scripting flags as one flat, equally-weighted block, with no step showing how to run the generated app; Prerequisites had no guidance beyond "the result must be `11.11.0`" if the pnpm version check failed
  - Current: "Create a React application" now has a "Quick start" subsection (scaffold, then `cd apps/<name>` + `corepack pnpm dev`), a "What you get" subsection, and non-interactive/scripted usage collapsed into a `<details>` block; Prerequisites has a new "If `corepack pnpm --version` reports the wrong version" subsection with an ordered remediation path (`corepack install`, then `COREPACK_DEFAULT_TO_LATEST=0`) — tested end-to-end against a live reproduction of the version-mismatch error, which resolved successfully afterward
  - Affects: `README.md`, `docs/roadmap.md` (Phase 14 Findings)
  - Migration: none — documentation only, no command or script behavior changed
  - Validation: reviewed diff manually; all referenced commands already existed and were unchanged; the troubleshooting remediation was verified live against a real, reproduced version-mismatch failure
  - Changeset: none (documentation-only change)

- Updated the Storybook manager branding and browser metadata.
  - Source: local Storybook manager; no Figma node is involved
  - Previous: the sidebar used a combined SVG wordmark on the gray app background, and browser tabs used Storybook's dynamic title and default favicon
  - Current: the sidebar uses a separate PNG brand mark with live `Lumen AI Design System` text on a white background; browser tabs use the Lumen title and PNG favicon
  - Affects: `packages/storybook/.storybook/manager.ts`, `packages/storybook/.storybook/manager-head.html`, `packages/storybook/public/Lumen-anim-logo-96.png`, and `packages/storybook/public/lumen-favicon.png`
  - Migration: none
  - Validation: lint, typecheck, 42 tests, token build, and production Storybook build passed; deployed Storybook verification pending
  - Changeset: none (`@lumen/storybook` is private and no published package API changed)

- Decoupled the component architecture and specification documentation from React so the design-system component contract is framework-neutral, as groundwork for supporting Angular, Vue, and Web Components alongside React.
  - Source: repository documentation and user-directed architecture decision; no Figma node is involved
  - Previous: `docs/component-architecture.md` and `docs/component-specifications.md` placed "React implementation" inside the specification authority chain and repeatedly presented React syntax (JSX examples, TypeScript prop interfaces) as the thing to synchronize against, with no documented layer between design tokens and React; `docs/roadmap.md` had no multi-framework phase
  - Current: added a "0. Architecture layers" section to `docs/component-architecture.md` describing the Figma Variables → Design Tokens → Framework-Agnostic Foundations → Component Specifications → Framework Packages layering; relabeled every React-specific example across both documents as the current "reference implementation (React)" rather than the contract itself; added a framework-neutral "Property contract" section to the Button specification as a worked example other components can follow; added `docs/roadmap.md` Phase 13 (Multi-framework expansion) recommending Web Components as the first non-React proof-of-concept package, sequenced after the existing primitive/composite/Storybook phases; added scoping notes to `docs/development-guidelines.md` and `CLAUDE.md` clarifying that `@lumen/ui`/`@lumen/patterns` are Lumen's current framework package, not the source of truth for the component contract; updated `README.md`'s intro, package table, and architecture diagram to the same layering with a link to `docs/component-architecture.md` §0; updated the `React components` step in `docs/figma-sync.md`'s source-of-truth hierarchy and component sync matrix, and the `React Components` step in `docs/design-tokens.md`'s token hierarchy diagram, to read "Framework packages" with the same forward reference
  - Affects: `docs/component-architecture.md`, `docs/component-specifications.md`, `docs/roadmap.md`, `docs/development-guidelines.md`, `CLAUDE.md`, `README.md`, `docs/figma-sync.md`, `docs/design-tokens.md`, `docs/figma-source.md`
  - Migration: none — no code, package, or public API changed; `@lumen/ui` remains Lumen's only shipped framework package
  - Validation: repository-wide search confirms no remaining React-as-authority language in any touched document; existing component contract content (anatomy, variants, states, tokens, accessibility) left unchanged, only reframed
  - Changeset: none (documentation-only change)

- Themed Storybook's built-in Docs code-block copy button, which previously had no hover/focus affordance in either theme.
  - Source: user-reported gap against a reference screenshot (interaction pattern only — its colors were explicitly not to be used); no Figma node is involved
  - Previous: `.docblock-source`'s native copy-to-clipboard button (Storybook's own, not custom-built — click-to-copy and its "Copy" → "Copied" text/color swap on success are unchanged) had only a base-color fix for dark mode (avoiding a stray white box); no hover or focus-visible state in either theme, so the button gave no interactive feedback until clicked
  - Current: added a subtle hover/focus surface using Lumen's own `--color-neutral-50` token in light mode and a translucent version of the existing Tokyo Night dark-mode code color in dark mode — idle state still blends into the card (unchanged), matching GitHub's own rendered-code-block copy button behavior (visible by default, subtle highlight on hover, no color/behavior change to the click-to-copy or "Copied" success state itself, both of which are Storybook's, not this repo's)
  - Affects: `packages/storybook/.storybook/tailwind.css`
  - Migration: none
  - Validation: lint and production Storybook build passed; visually verified with a headless-Chromium (Playwright) session driven against the production build in both themes — confirmed via computed styles (`background-color: rgb(239, 239, 239)` light hover, `rgba(192, 202, 245, 0.12)` dark hover, both exact matches for the CSS added) and screenshots of idle/hover/clicked states; also confirmed (with clipboard permissions granted) that Storybook's native "Copy" → "Copied" success state is unaffected by this change in either theme
  - Changeset: none (`@lumen/storybook` is private and no published package API changed)

### Deprecated

### Removed

### Fixed

- Synced the shadcn-sourced `Button` component's colors to the canonical Figma Button component-set, since `Button` (promoted from `ShadcnButton` earlier the same day, see the Changed entry above) is now the one canonical Button and its color wiring had never been checked against Figma.
  - Affected component: React `Button` (`packages/ui/src/components/internal/button.tsx`, `packages/ui/src/components/button/Button.tsx`); token groups `color.primary` (new alpha steps) and `color.button` (light mode only)
  - Figma source: Lumen-AI-Design-System node `1174:1349` (the canonical Button component-set), inspected via `get_design_context` and `get_variable_defs` at the user's request
  - Previous: `Button`'s `default`/`destructive`/`secondary`/`outline`/`ghost` variants bound to shadcn's generic bridge tokens (`--primary`, `--secondary`, `--accent`, `--ring`) rather than the button-specific `--color-button-*` tokens already in the codebase. This meant: `hover:bg-primary`/`hover:bg-destructive`/`hover:bg-secondary` were literal no-ops (same class as the base state — a leftover from the original batch-5 adaptation); `outline`/`ghost`'s hover used `--accent` (a "selected nav row" placeholder token, see `docs/shadcn-integration.md` §5) instead of their own tokens; the focus ring used the generic `border.focus` (primary.500) instead of the button-specific `button.focus-ring` (primary.200); disabled state was a flat `opacity-50` instead of Lumen's actual gray fill/text pair. Separately, the `button.secondary-*` and `button.outline-hover-*` semantic tokens themselves had drifted from the current Figma values — `Secondary` was coded as a solid neutral white/gray button; Figma's current `Secondary` is a translucent brand-tinted fill.
  - Current: every variant/state pair in `buttonVariants` now binds directly to its own `--color-button-*` token via an arbitrary-value class. Three new primitives were added (`primary.500-a10`/`500-a16`/`500-a24` — primary.500 at 10%/16%/24% alpha, `#be003c1a`/`#be003c29`/`#be003c3d`, exact values from `get_variable_defs`) since no existing token held a translucent value; `button.secondary-bg/border/hover-bg/hover-border/on-action/hover-on-action` and `button.outline-hover-bg/hover-on-action/focus-border` (light mode only) now alias the correct values. `Primary`/`Ghost`/`Destructive`/`Disabled` were re-verified against the same node and already matched exactly — no value changes there, just re-wiring `Button` to use them. `Accent` and `Link` are declared style properties on the Figma component with no authored visual states yet, and were explicitly not wired — by direct user decision, consistent with the "no accent variant" call made earlier the same day when `Button` was promoted (`docs/shadcn-integration.md` §7.8); `link` keeps shadcn's own generic text-underline treatment. Figma's focus ring is a 2px offset ring rendered as a separate element per variant; by direct user choice this was implemented as a color-only fix (swap the ring's color source to `button.focus-ring`) rather than reproducing the exact offset-ring geometry. Only a `Light` theme is authored in Figma; dark-mode `button.*` tokens are untouched.
  - Affects: `packages/tokens/src/primitives/color.json`, `packages/tokens/src/semantic/color.json`, `packages/tokens/dist/*` (regenerated), `packages/ui/src/components/internal/button.tsx`, `packages/ui/src/components/button/{Button.tsx,Button.stories.tsx}`, `packages/ui/src/composite/AIPanel.test.tsx` (one class assertion updated to match the new arbitrary-value class name), `docs/figma-source.md`
  - Migration: none — `ButtonProps`/variant names/sizes are unchanged; only the rendered colors changed (Secondary most visibly, from solid neutral to translucent brand-tinted)
  - Validation: `pnpm --filter @lumen/tokens build` regenerated the CSS with the new/fixed values (spot-checked in `packages/tokens/dist/css/variables.css`); `pnpm --filter @lumen/ui typecheck`/`test` (285/285) and repo-wide `pnpm -r typecheck`, `pnpm --filter @lumen/patterns test` (6/6), `pnpm lint`, and `pnpm --filter @lumen/storybook build-storybook` all passed; the built Storybook CSS bundle was spot-checked to contain the new alpha values.
  - Changeset: `.changeset/button-figma-token-sync.md` (`@lumen/tokens` minor, `@lumen/ui` patch)

- Corrected `Button`'s dark-mode `Secondary`/`Outline`/`Ghost` colors against real Figma dark-mode values, superseding the "dark-mode tokens are untouched" note in the Fixed entry directly above (same day, immediate follow-up once the user flagged the dark-mode render didn't look right).
  - Affected component: React `Button`; token groups `color.primary` (three more new alpha steps) and `color.button` (dark mode only)
  - Figma source: same node, `1174:1349` — but this time genuinely Dark-mode data. The component's `Theme` variant property only has `Light` instances built (confirmed twice via `get_metadata`, 20/20 child symbols all `Theme=Light`), which is why the first pass concluded there was no Figma dark source at all. That conclusion was wrong: this file resolves dark mode through Figma's variable **mode** system (the same identical bound variables on the identical node resolve to different values depending which mode is active), not a separate variant instance — mirroring how this repo's own `[data-theme]` CSS-variable swap works. Re-running `get_variable_defs` on the same node while the user's live Figma selection was set to a dark-mode instance returned genuinely different, authoritative hex values.
  - Previous: dark `button.secondary-*`/`outline-hover-*` were old, pre-existing, never-Figma-verified placeholder values (e.g. `secondary-hover-bg` was a flat muted mauve `#A8939F`; `outline-hover-bg` was `primary.50`/`#F9E6EC`, a near-white pastel — evidently copied from a light-mode-style value without adjusting for a dark surface). An intermediate fix in this same session derived dark values by mirroring the newly-corrected light-mode pattern (reusing the same alpha primitives) as a judgment call, before the authoritative dark-mode Figma data was available — that intermediate derivation is what this entry replaces.
  - Current: dark `button.secondary-bg`/`border` now use two new primitives — `primary.300-a24` (`#d8668a3d`) and `primary.300-a40` (`#d8668a66`) — distinct from light mode's `primary.500`-based tints, since Figma's dark-mode Secondary uses a lighter base hue (`primary.300`) for its translucent fill/border. `secondary-hover-bg`/`outline-hover-bg`/`ghost-hover-bg` all resolve to one new primitive, `primary.500-a60` (`#be003c99`, ~60% alpha — identical across all three variants in Figma's own dark-mode data). `secondary-on-action`/`outline-hover-on-action`/`secondary-hover-on-action` now use `primary.100`/`primary.50` respectively (previously `primary.200`/`primary.100`, close but not exact). `secondary-hover-border` (`primary.500-a16`) and `outline-on-action`/`outline-border`/`outline-hover-border`/`outline-focus-border`/`ghost-on-action` (all `primary.200`) were cross-checked against the same authoritative pull and already matched exactly. `Primary`/`Destructive`/`Disabled`'s dark values were also cross-checked (`primary-hover-bg` #cb3363/primary.400, `disabled-bg` #231c24, `disabled-on-action` #a7a4a7, `destructive-hover-bg` #e14b53/red.400) and already matched — confirms those tokens' original sourcing was correct all along.
  - Affects: `packages/tokens/src/primitives/color.json`, `packages/tokens/src/semantic/color.json`, `packages/tokens/dist/*` (regenerated)
  - Migration: none — same as the Fixed entry above, only rendered dark-mode colors changed
  - Validation: `pnpm --filter @lumen/tokens build` regenerated and spot-checked against the exact Figma-returned hex values; `pnpm --filter @lumen/ui typecheck`/`test` (285/285), repo-wide `pnpm lint`, and `pnpm --filter @lumen/storybook build-storybook` all passed
  - Changeset: folded into `.changeset/button-figma-token-sync.md` (no new changeset file — same unreleased `@lumen/tokens` minor bump)

- Corrected the Primary, Secondary, and Outline Split Button AI sublayer
  corner radii.
  - Affected component: React `AIButton split` and its `AI Components/One AI Button, Every Capability` Storybook library; no token group changed
  - Figma source: Lumen-AI-Design-System node `817:9861`, component instances `1381:854` (Primary), `1381:855` (Secondary), and `1381:856` (Outline)
  - Previous: only the composite container carried the 8px radius; the `Main` and `Dropdown` interactive sublayers had square corners, allowing their painted states to expose a corner-rendering bug
  - Current: `Main` applies 8px top-left/bottom-left radii and `Dropdown` applies 8px top-right/bottom-right radii, matching the updated Figma layers while leaving both inner corners square at the divider
  - Affects: `packages/ui/src/primitives/AIButton.{tsx,test.tsx}`, `docs/{changelog.md,component-specifications.md,figma-sync.md}`, and `.changeset/split-button-ai-segment-radius.md`
  - Migration: none — props, events, slots, dimensions, colors, states, and tokens are unchanged
  - Validation: Figma `get_design_context` confirmed the exact four exposed 8px sublayer corners on all three instances; repository-wide lint and typecheck passed; all 339 tests passed (162 React/UI, 74 Web Components, 70 Angular, 27 create-app, 6 patterns), with the existing Primary/Secondary/Outline split test now asserting both segment radii; production Storybook built successfully with 2,124 modules, and the emitted `AIButton` library bundle contains `rounded-l-lg` and `rounded-r-lg` on the two split actions
  - Changeset: `.changeset/split-button-ai-segment-radius.md` (`@lumen/ui` patch)

- Removed Link from the standard Button collection in every framework package and Storybook.
  - Affected token group/component: `color.button.link-*`, `typography.button-link*`, and standard Button in React, Web Components, Angular, and Storybook
  - Figma source: Lumen-AI-Design-System collection frame `1174:1349`; user-directed scope exclusion on 2026-07-22
  - Previous: the public standard Button variant union included `link`, with component-only light/dark color roles and state-specific typography tokens.
  - Current: the standard Button collection exposes only `primary | accent | secondary | outline | ghost | destructive`. Link-only Button tokens and styles are removed. Navigation continues through the standalone `TextLink` component or semantic anchors; the separate `AIButton` Link variant is unchanged.
  - Affects: `packages/tokens/src/{primitives/color,semantic/color,typography}.json`, generated token output, `packages/ui/src/primitives/Button.{tsx,stories.tsx,test.tsx}`, `packages/web-components/src/button/lumen-button.{ts,test.ts}`, `packages/angular/src/button/lumen-button.{ts,test.ts}`, `docs/{component-specifications.md,figma-sync.md,changelog.md}`, and `.changeset/remove-standard-button-link.md`
  - Migration: breaking — replace `<Button variant="link">` with `TextLink`, an anchor, or another supported Button variant according to interaction semantics
  - Validation: token regeneration passed and removed every `color-button-link-*` and `text-button-link-*` output; all 294 framework tests passed (162 React/UI, 68 Web Components, 64 Angular); repository-wide type checking and lint passed; production Storybook built successfully with 2,125 modules, and the emitted standard Button/CSS artifacts contain no Link variant or Link-only Button tokens. `TextLink` and AIButton Link output remain intact.
  - Changeset: `.changeset/remove-standard-button-link.md` (`@lumen/tokens`, `@lumen/ui`, `@lumen/web-components`, and `@lumen/angular` major)

- Corrected the standard Button's dark-mode Outline colors.
  - Affected token group/component: dark `color.button.outline-{border,hover-bg,hover-on-action,hover-border,focus-border}` and standard Button in React, Web Components, Angular, and Storybook
  - Figma source: Lumen-AI-Design-System node `1174:1349`, including `Style=Outline` and `Style=Link` at Default, Hover, Focused, and Disabled in Light and Dark; verified with `get_design_context` and `get_variable_defs` on 2026-07-22
  - Previous: dark Outline used `#720024` for its default border, `#F2CCD8`/`#BE003C`/`#310010` for its hover background/foreground/border, and `#310010` for its focused border.
  - Current: dark Outline resolves to `#E599B1` for default, hover, and focused borders, `#F9E6EC` for its hover background, and `#980030` for its hover foreground.
  - Affects: `packages/tokens/src/semantic/color.json`, generated token output in `packages/tokens/dist/`, `.changeset/dark-secondary-button-hover.md`, and `docs/changelog.md`; React `Button`, `<lumen-button>`, Angular `LumenButtonComponent`, and the Storybook Button state collection consume the corrected variables without source changes
  - Migration: none; token names, component variants, props, attributes, slots, and DOM behavior are unchanged
  - Validation: token generation passed and emitted the exact dark Outline values (`#E599B1` border, `#F9E6EC` hover background, `#980030` hover foreground); all 300 framework-package tests passed (164 React/UI, 70 Web Components, 66 Angular); repository-wide type checking and lint passed; production Storybook built successfully with 2,125 modules. Browser-backed hover comparison was not available, so validation is based on the Figma design context/variable definitions and generated Storybook output.
  - Changeset: `.changeset/dark-secondary-button-hover.md` (`@lumen/tokens`, `@lumen/ui`, `@lumen/web-components`, and `@lumen/angular` patch; expanded from the Secondary hover correction)

- Corrected the standard Button's dark-mode Secondary hover colors to match the published component tokens.
  - Affected token group/component: dark `color.button.secondary-hover-{bg,on-action,border}` and standard Button in React, Web Components, Angular, and Storybook; no component implementation or public API changed
  - Figma source: Lumen-AI-Design-System node `1174:1349` (`Style=Secondary, Theme=Dark, State=Hover`), verified with `get_design_context` and `get_variable_defs` on 2026-07-22
  - Previous: dark Secondary hover resolved to `#2D1A26` background and `#F5EFF3` foreground, while its `#3D3039` border was already correct. The background primitive was also shared with Ghost hover, so changing it directly would have caused unrelated Ghost drift.
  - Current: dark Secondary hover resolves to Figma's exact `#A8939F` background, `#17101A` foreground, and unchanged `#3D3039` border. Ghost retains its existing `#2D1A26` hover surface through a separate `button.dark.ghost-hover-bg` primitive.
  - Affects: `packages/tokens/src/{primitives/color.json,semantic/color.json}`, generated token output in `packages/tokens/dist/`, `.changeset/dark-secondary-button-hover.md`, and `docs/changelog.md`; React `Button`, `<lumen-button>`, Angular `LumenButtonComponent`, and the Storybook Button state collection consume the corrected generated variables without source changes
  - Migration: none; token names, component variants, props, attributes, slots, and DOM behavior are unchanged
  - Validation: token generation passed and emitted the exact dark Secondary hover values (`#A8939F` background, `#17101A` foreground, `#3D3039` border) plus the preserved `#2D1A26` Ghost hover; all 333 workspace tests passed (164 React/UI, 70 Web Components, 66 Angular, 27 create-app, 6 patterns); repository-wide type checking and lint passed; production Storybook built successfully with 2,125 modules. Browser-backed hover comparison was not available, so validation is based on the Figma design context/variable definitions and generated Storybook output.
  - Changeset: `.changeset/dark-secondary-button-hover.md` (`@lumen/tokens`, `@lumen/ui`, `@lumen/web-components`, and `@lumen/angular` patch)

- Corrected the updated standard Button variants against the current light and dark Figma modes.
  - Affected token group/component: `color.button`, Button in React, Web Components, Angular, and Storybook theme rendering
  - Figma source: Lumen-AI-Design-System node `1027:3733` (collection frame `1174:1349`); all 56 variant/state/theme instances were re-read with `get_variable_defs`, with focused `get_design_context` checks for Accent and Link
  - Previous: Accent still used the earlier near-black light treatment and teal dark treatment; every variant inherited the 34px/14px/7px geometry, making Link taller and wider than the updated Figma component; the Storybook description still documented one shared geometry
  - Current: Accent consumes the published crimson roles exactly (`primary.500` default, `primary.700` light hover, `primary.400` dark hover, and the exact component-only `#FFF5F8` on-action); dark disabled on-action is `#A7A4A7`, and dark Outline default on-action is `primary.200`. Link uses its published 8px inline and 2px block padding while the other six variants retain the 34px geometry. React, Web Components, Angular, and Storybook use the same generated light/dark variables. Storybook's existing theme toolbar continues to switch `data-theme` and therefore the new token modes. The standalone Theme Toggle was not changed because node `1027:3733` contains no Theme Toggle instance; it remains sourced from AppShell nodes `1079:1723` and `1330:2282`.
  - Affects: `packages/tokens/src/semantic/color.json`, generated token output in `packages/tokens/dist/`, `packages/ui/src/primitives/Button.{tsx,stories.tsx,test.tsx}`, `packages/web-components/src/button/lumen-button.{ts,test.ts}`, `packages/angular/src/button/lumen-button.{ts,test.ts}`, `docs/{component-specifications.md,figma-sync.md,changelog.md}`, `.changeset/final-button-collection.md`
  - Migration: none; public variants, props, attributes, slots, and theme-toggle behavior are unchanged
  - Validation: token generation passed; all package type checks and repository lint passed; framework suites passed (162 React, 70 Web Components, 66 Angular); production Storybook built successfully with 2,125 modules and emitted the updated Button and Theme Toggle stories. Source and generated-token values were checked against all 56 current Figma instance definitions. Browser-backed screenshot comparison was not run, so no browser visual signoff is claimed.
  - Changeset: `.changeset/final-button-collection.md` (updated the existing pending Button release entry)

- Corrected AppShell light/dark parity and Theme Toggle fidelity across React, Web Components, Angular, and Storybook.
  - Affected group: AppShell color roles, responsive AppShell compositions, `ThemeToggle`, `NavigationRail`, `PageHeader`, and `AIPanel`.
  - Figma source: canonical AppShell page `1007:3700`; AppShell component set `1174:1357` with desktop light/dark `1127:4196`/`1127:4197`, tablet light/dark `1175:2521`/`1175:2522`, and mobile light/dark `1175:2588`/`1175:2589`; Theme Toggle light `1079:1723` and dark `1330:2282`.
  - Previous: Theme Toggle used an approximate 56px sliding-thumb treatment; AppShell dark roles included inferred values, including a `#17101A` application canvas; navigation, icons, avatars, and composed Buttons reused generic semantic roles instead of their published AppShell variables; light AppShell links used an obsolete blue alias; the light accent action used heading gray; tablet used a 72px header; the rail added a default workspace mark; and Storybook compositions diverged in search, responsive header structure, badges, panel treatment, spacing, and viewport dimensions.
  - Current: Theme Toggle is the exact 54 x 24 fixed two-cell control with four directly rendered Figma exports for Light Sun, Light Moon, Dark Sun, and Dark Moon, plus the published mode-specific track roles. Checked state swaps the exported asset pair without moving either 20px cell; native switch semantics remain intact in React, Web Components, and Angular. All six AppShell variants use the complete published light/dark contract for application/surface backgrounds, text, tertiary/link text, icons, breakpoint-aware avatars, navigation background/foreground/selection, borders, Badge modes, status roles, primary/secondary/accent Buttons, assistant treatment, `brand/dark`, and Theme Toggle. AppShell scopes composed Button defaults to its own Figma-authored mode roles without changing Button outside the shell. Key dark values include `#0E0B0E` for the application canvas, `#231C24` for surfaces, `#3D3039` for default borders, `#151116` for subtle borders, and `#4F4950` for selected navigation. Figma `brand/dark` (`#980030`) maps to `app-shell.brand-dark` and colors account-row indicators instead of the unrelated danger/error role. Responsive stories mirror the six canonical compositions, including the 52px tablet header, 390 x 844 mobile viewport, Figma search field, mobile controls, badge modes, and assistant treatment.
  - Affects: `packages/tokens/src/{primitives/color.json,semantic/color.json}`, generated token output in `packages/tokens/dist/`, `packages/ui/src/{assets/theme-toggle-*.svg,primitives/ThemeToggle.tsx,primitives/ThemeToggle.stories.tsx,primitives/ThemeToggle.test.tsx,layout/AppShell.tsx,layout/AppShell.stories.tsx,layout/AppShell.test.tsx,composite/AIPanel.tsx,composite/PageHeader.tsx}`, `packages/web-components/src/{assets/theme-toggle-*.svg,theme-toggle/}`, `packages/angular/src/{assets/theme-toggle-*.svg,theme-toggle/}`, `docs/{component-specifications.md,design-tokens.md,figma-sync.md,changelog.md}`.
  - Migration: none. Existing props, attributes, events, slots, and component names remain compatible; this is a visual and responsive-behavior correction.
  - Validation: token generation passed; repo-wide lint passed; TypeScript checks passed for React, Web Components, Angular, and Storybook; full package tests passed (161 React, 69 Web Components, 65 Angular); production Storybook built successfully with the AppShell and Theme Toggle stories. All six current Figma variable sets were re-extracted and generated CSS was checked against their exact light/dark values. Figma design context, variable definitions, exact SVG exports, and static built-story verification passed. Browser screenshot comparison could not run because this session had no registered in-app browser backend, so no browser-backed visual signoff is claimed.
  - Changeset: `.changeset/appshell-theme-toggle-parity.md` (`@lumen/tokens` minor; `@lumen/ui`, `@lumen/web-components`, and `@lumen/angular` patch).

- Corrected AppShell control composition so its search and assistant composer reuse the published primitives.
  - Affected component: React `AppShell` Storybook composition and `AIPanel`; no token or public-prop changes.
  - Figma source: canonical AppShell page `1007:3700`, with AI Panel component `1079:3141` and desktop light/dark compositions `1127:4196`/`1127:4197`. A fresh `get_design_context` request on 2026-07-22 was blocked by the connector's “nothing selected” response, so this correction is limited to component reuse and preserves the already-synchronized geometry and glyph intent.
  - Previous: the desktop header search used a native, hand-styled `<input>` in `AppShell.stories.tsx`; `AIPanel` independently recreated its message input and icon-only send action with native, hand-styled `<input>`/`<button>` elements.
  - Current: the header search composes the standard `Input size="sm"`; the AI Panel composer uses the same standard `Input` and an accessible icon-only `Button variant="accent"` with the existing `ArrowUpIcon`. The existing props, form submission, Enter behavior, trimming, clear-after-send behavior, and `aria-label="Send message"` are unchanged.
  - Affects: `packages/ui/src/layout/AppShell.stories.tsx`, `packages/ui/src/composite/AIPanel.{tsx,test.tsx}`, `docs/{changelog.md,component-specifications.md,figma-sync.md}`, and `.changeset/appshell-theme-toggle-parity.md`.
  - Migration: none — the change removes duplicate internal markup without altering any public API.
  - Validation: all 163 React/UI tests passed (including the new AIPanel composition regression); `@lumen/ui` typecheck, repo-wide lint, targeted formatting, and `git diff --check` passed; production Storybook built successfully with 2,125 modules and emitted the updated `Input`, `Button`, `AIPanel`, and `AppShell` bundles. Browser-backed visual verification could not run because no in-app browser backend was registered in this session.
  - Changeset: `.changeset/appshell-theme-toggle-parity.md` (existing `@lumen/ui` patch entry expanded for this follow-up correction).

- Added a 50%-opacity hover surface to AppShell left navigation in both themes without reducing selected-state opacity.
  - Affected token group/component: `app-shell.nav-hover`, React `AppShell` sidebar and navigation rail.
  - Source: user-directed correction against the rendered AppShell light/dark navigation; canonical color bases remain AppShell node `1007:3700` and its desktop light/dark variants `1127:4196`/`1127:4197`.
  - Previous: inactive sidebar links, rail links, and collapse/expand controls reused the full-opacity `app-shell.nav-active` selection surface on hover. Rail items also applied the hover utility to active items.
  - Current: new light and dark `app-shell.nav-hover` tokens preserve each mode's active RGB color at exactly 50% alpha (`rgba(..., 0.5)`). Only inactive items and navigation controls consume the hover role; active/selected items retain the full-opacity `app-shell.nav-active` surface, including while hovered.
  - Affects: `packages/tokens/src/{primitives/color.json,semantic/color.json}`, generated token output, `packages/ui/src/layout/AppShell.{tsx,test.tsx}`, `docs/{changelog.md,design-tokens.md,figma-sync.md}`, and `.changeset/appshell-theme-toggle-parity.md`.
  - Migration: none — no public API or existing token was changed; one additive semantic token was introduced.
  - Validation: token generation and repeat-build drift checks passed with exact light `rgba(237, 240, 241, 0.5)` and dark `rgba(79, 73, 80, 0.5)` output; all 163 React/UI tests passed; `@lumen/ui` typecheck, repo-wide lint, formatting, and `git diff --check` passed; production Storybook built successfully with 2,125 modules and emitted the updated AppShell bundle. Browser-backed hover inspection remains unavailable because no in-app browser backend is registered in this session.
  - Changeset: `.changeset/appshell-theme-toggle-parity.md` (existing `@lumen/tokens` minor and `@lumen/ui` patch entry expanded).

- Corrected the AppShell dark header-search and AI Panel query-input styling after their migration to the shared `Input` component.
  - Affected component: React `AppShell` composition and its shared `Input` descendants; no token values or public APIs changed.
  - Figma source: desktop dark AppShell `1127:4197` from canonical page `1007:3700`, freshly verified with `get_design_context` on 2026-07-22. Header input instance `I1119:3337;1079:1884`; AI Panel input instance `I1166:4827;1337:2450`.
  - Previous: both fields inherited generic Input dark roles (`#262626` background, `#A4B3B7` border, `#7F7F7F` placeholder). The header also rendered the default `sm` anatomy, omitting Figma's search icon and `⌘K` shortcut and using the wrong padding, border weight, and typography.
  - Current: AppShell scopes shared primary/search Input roles to its exact mode tokens. Dark fields render `#0E0B0E` background, `#3D3039` border, and `#A8939F` placeholder/icon. The header uses `variant="search"`, `md` 16/18 typography, 14px padding, 1.5px border, search icon, and shortcut while remaining 400×36px; the AI Panel retains the exact `sm` 14/16, 10px, 1px, 36px configuration. Both remain the standard `Input` component.
  - Affects: `packages/ui/src/layout/AppShell.{tsx,stories.tsx,test.tsx}`, `docs/{changelog.md,component-specifications.md,design-tokens.md,figma-sync.md}`, and `.changeset/appshell-theme-toggle-parity.md`.
  - Migration: none — internal composition and scoped CSS-variable correction only.
  - Validation: all 163 React/UI tests passed; `@lumen/ui` typecheck, repo-wide lint, formatting, and `git diff --check` passed; production Storybook built successfully with 2,125 modules. Static inspection of the emitted AppShell bundle confirms `variant="search"`, `size="md"`, the 36px height override, and all AppShell-scoped primary/search background, border, placeholder, icon, hover, and focus bindings. The Figma extraction itself supplied the source screenshot and exact values; separate browser-backed inspection remains unavailable because no in-app browser backend is registered.
  - Changeset: `.changeset/appshell-theme-toggle-parity.md` (existing `@lumen/ui` patch entry expanded).

- Promoted the verified AppShell dark input values to the shared main `Input` component's dark base roles.
  - Affected token group/component: dark `input.primary-{bg,border,placeholder-text}` and `input.search-{bg,border,icon}` semantic roles, React `Input`, and its Storybook `VariantCollection`.
  - Figma source: canonical desktop dark AppShell node `1127:4197`, freshly verified with `get_design_context` on 2026-07-22; header Input instance `I1119:3337;1079:1884` and AI Panel Input instance `I1166:4827;1337:2450`.
  - Previous: the shared Input outside AppShell still resolved dark default/search roles to `#262626` or `#424849` backgrounds, `#A4B3B7` borders, `#7F7F7F` placeholder, and a white search icon. AppShell corrected those values only through scoped overrides.
  - Current: the shared Input's dark default and search variants now resolve background to `#0E0B0E`, border to `#3D3039`, and placeholder/search icon to `#A8939F`, so standalone Input consumers and Storybook match the same verified Figma design. Dark hover, focus, and error states remain unchanged and provisional because the standalone Figma Input collection publishes no dark state matrix.
  - Affects: `packages/tokens/src/semantic/color.json`, generated token output, `packages/ui/src/primitives/Input.test.tsx`, `docs/{changelog.md,component-specifications.md,design-tokens.md,figma-sync.md}`, and `.changeset/input-design-tokens.md`.
  - Migration: visual-only dark-theme correction; no prop, DOM, or token-name changes.
  - Validation: token generation and repeat-build drift checks passed with exact dark output (`#0E0B0E`, `#3D3039`, `#A8939F`); all 164 React/UI tests passed, including seven Input tests; `@lumen/ui` typecheck, repository lint, targeted formatting, and `git diff --check` passed; production Storybook built successfully with 2,125 modules and emitted the updated Input story bundle. The Figma extraction supplied the source screenshot and exact values; separate browser-backed inspection remains unavailable because no in-app browser backend is registered.
  - Changeset: `.changeset/input-design-tokens.md` (existing `@lumen/tokens` and `@lumen/ui` minor entry expanded).

- Fixed the Lumen logo URL in the published Storybook manager.
  - Source: production Storybook at `/Lumen-DS/`; no Figma node is involved
  - Previous: the logo and brand link used domain-root URLs, causing GitHub Pages to request `/lumen-ds-logo.svg` outside the repository deployment path
  - Current: the logo and brand link use relative URLs that resolve correctly for local Storybook and the `/Lumen-DS/` production base path
  - Affects: `packages/storybook/.storybook/manager.ts`, `packages/storybook/.storybook/main.ts`, and the Storybook navigation brand
  - Migration: none
  - Validation: lint, typecheck, and production Storybook build passed; generated manager bundle uses `./lumen-ds-logo.svg`; deployed URL verification pending
  - Changeset: none (`@lumen/storybook` is private and no published package API changed)

- Fixed the Button specification to match the real, shipped implementation — `docs/component-specifications.md` §5, `docs/component-architecture.md` §7, and `docs/development-guidelines.md` §8.1 all described a Button API that never existed in code.
  - Source: `packages/ui/src/primitives/Button.tsx`, `Button.stories.tsx`, `Button.test.tsx` (Lumen-AI-Design-System node `475:7210`, formerly `466:4365`), cross-checked against `docs/roadmap.md` Phase 13 Findings, which recorded the discrepancy when `@lumen/web-components`'s `<lumen-button>` surfaced it
  - Previous: docs described variants `primary | secondary | tertiary | ghost | link | danger | ai` (none of `ghost`/`danger`/`ai` exist; `raised` was missing entirely), sizes `sm | md | lg` (missing `xs`), a `fullWidth` property that doesn't exist, icon props named `leadingIcon`/`trailingIcon` instead of the real `iconStart`/`iconEnd`, undocumented `iconOnly`/`pill` modifiers, and optional `Selected`/`Success`/`Error` states that aren't implemented or in the cited Figma source
  - Current: all three documents now list variants `primary | raised | secondary | tertiary | link`, sizes `xs | sm | md | lg`, the real `iconStart`/`iconEnd`/`iconOnly`/`pill`/`isLoading` property names, and drop the invented `fullWidth` and unimplemented optional states; `docs/component-specifications.md` §5 gained an explicit "Modifiers" subsection for Icon Only/Pill (previously miscategorized as if they were variants) and a note on the `loading`/`isLoading` naming inconsistency between the spec's canonical name and React's actual prop name
  - Affects: `docs/component-specifications.md`, `docs/component-architecture.md`, `docs/development-guidelines.md`, `docs/roadmap.md` (Phase 13 Findings/Deliverables/Exit criteria updated to reflect the fix), `packages/web-components/README.md` (discrepancy section reframed as resolved history)
  - Migration: none — documentation-only; no component source changed, since the docs were wrong, not the code
  - Validation: repository-wide search for the old variant names, `fullWidth`, and `leadingIcon`/`trailingIcon` confirms no remaining references outside this changelog's own history
  - Changeset: none (documentation-only change)

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

- Added shadcn-sourced `Calendar` and `Chart` components to `@lumen/ui` — batch 6, the final batch of the bulk shadcn adoption effort. Both were flagged as bigger decisions before adoption (new dependency ecosystems, not just another Radix primitive) and approved directly by the user; `Chart` specifically approved with instruction to apply the `dataviz` skill's palette/style rules rather than shadcn's default per-series CSS-variable scheme.
  - Affected token group/component: new React `Calendar`/`CalendarDayButton`; `Chart`, `ChartTooltip`, `ChartTooltipContent`, `ChartLegend`, `ChartLegendContent`, `ChartStyle`, and the new `chartCategoricalColors` palette constant
  - Source: continuation of the bulk shadcn adoption directed 2026-07-23; see `docs/shadcn-integration.md` §7.7. Re-verified both names (and `Chart`'s sub-parts) against the actual current `@lumen/ui` export surface — no collisions, both keep plain shadcn names. Registry metadata was wrong again (`recharts@3.8.0` listed vs. `2.15.4` actually required by the CLI's generated code, same failure mode as batch 3's `drawer`/`vaul`). The corepack pnpm version-drift problem (recurring since early batches) was resolved by invoking a directly-pinned `pnpm` binary instead of routing through corepack.
  - Previous: neither existed anywhere in `@lumen/ui`.
  - Current: each follows the established internal/public split. Adds `react-day-picker`, `date-fns` (this repo's first date-handling libraries), and `recharts@2.15.4` (this repo's first charting library) as new runtime dependencies. `Calendar`'s lucide chevrons replaced with Lumen's own generated icons; its `text-sm`/`text-[0.8rem]`/`text-xs` replaced with `label-md`/`label-sm`; bare `shadow-xs` dropped; `ring-ring/50` replaced with solid `ring-ring`. `Chart`'s `text-xs` replaced with `label-sm`; `border-border/50`/`stroke-border/50` replaced with solid equivalents; tooltip's `shadow-xl` replaced with `--shadow-menu-default`; and its dark-mode selector was rewritten from Tailwind's `.dark`-class convention to this repo's actual `[data-theme="dark"]` attribute selector — without this the series colors would never have swapped in dark mode. A validated 6-step categorical palette (computed via the `dataviz` skill's `validate_palette.js`, not eyeballed, checked separately against the light and dark chart surface) is exposed as `chartCategoricalColors`; its 6th step returned a contrast WARN against the dark surface, so `Chart.stories.tsx`'s multi-series example gives that series a permanent direct label rather than relying on the legend swatch alone. `button.tsx` and `card.tsx` were silently reverted by the CLI yet again (fifth and second reverts respectively) and re-fixed. Neither component is named in `docs/component-architecture.md` §2.2/§2.3's explicit lists; both filed under `Composite/X` on rule 11's fallback definition (no `Enterprise` Storybook category exists in this repo's actual taxonomy).
  - Affects: `packages/ui/src/components/internal/{calendar,chart,button,card}.tsx` (new/re-fixed), `packages/ui/src/components/{calendar,chart}/*` (new), `packages/ui/src/index.ts`, `packages/ui/package.json`, `docs/shadcn-integration.md`
  - Migration: none — new components, no existing public export changed
  - Validation: `pnpm --filter @lumen/ui typecheck` and `pnpm --filter @lumen/ui test` (322/322, all passing after two fixes — `Chart`'s `Meta` typing needed the same `component:`-binding drop as `ShadcnForm`'s precedent, since `Chart`'s props require a concrete `config`/`children` no placeholder `args` can satisfy; a disabled-date assertion in `Calendar.test.tsx` needed to match on the day button's `data-day` attribute instead of an anchored accessible-name regex, since react-day-picker's day labels are full ordinal date strings, not bare day numbers), repo-wide `pnpm typecheck`/`pnpm test`/`pnpm lint`, and `pnpm --filter @lumen/storybook build-storybook` all passed.
  - Changeset: `.changeset/shadcn-bulk-batch-6.md`

- Added shadcn-sourced `ShadcnButton`, `ShadcnCard`, `ShadcnTabs`, `ShadcnTooltip`, `ShadcnSelect`, `ShadcnAvatar`, `ShadcnInput`, `ShadcnSwitch`, `ShadcnCheckbox`, `ShadcnPagination`, `ShadcnButtonGroup`, `Dialog`, `RadioGroup`, and `Table` components to `@lumen/ui` — batch 5 of the bulk shadcn adoption effort, covering every name-colliding duplicate (the last planned bulk batch before `Calendar`/`Chart`).
  - Affected token group/component: new React `ShadcnButton`, `ShadcnCard` and sub-parts (`Header`/`Title`/`Description`/`Content`/`Footer`), `ShadcnTabs`/`ShadcnTabsList`/`ShadcnTabsTrigger`/`ShadcnTabsContent`, `ShadcnTooltip` and sub-parts (`Trigger`/`Content`/`Provider`), `ShadcnSelect` and its full sub-part set (`Group`/`Value`/`Trigger`/`Content`/`Label`/`Item`/`Separator`/`ScrollUpButton`/`ScrollDownButton`), `ShadcnAvatar`/`ShadcnAvatarImage`/`ShadcnAvatarFallback`, `ShadcnInput`, `ShadcnSwitch`, `ShadcnCheckbox`, `ShadcnPagination` and sub-parts (`Content`/`Item`/`Link`/`Previous`/`Next`/`Ellipsis`), `ShadcnButtonGroup`/`ShadcnButtonGroupText`/`ShadcnButtonGroupSeparator`, `Dialog` and its full sub-part set (`Trigger`/`Close`/`Content`/`Header`/`Footer`/`Title`/`Description`/`Portal`/`Overlay`), `RadioGroup`/`RadioGroupItem`, `Table` and its full sub-part set (`Header`/`Body`/`Footer`/`Row`/`Head`/`Cell`/`Caption`)
  - Source: continuation of the bulk shadcn adoption directed 2026-07-23; see `docs/shadcn-integration.md` §7. Re-verified every planned collision against the actual current `@lumen/ui` export surface (not memory) before starting — caught that `ButtonGroup` was missed from the earlier "no collision" list (Lumen already has its own `ButtonGroup`), corrected to `ShadcnButtonGroup`. Final split: 11 `Shadcn`-prefixed (exact-name collisions) + 3 plain-named — `Dialog` (Lumen's own is `Modal`), `RadioGroup` (Lumen's own is `Radio`), `Table` (Lumen's own higher-level composite is `DataTable`). Categorized per `docs/component-architecture.md` §2.2/§2.3's explicit lists where named (`Button`, `Card`, `Tabs`, `Tooltip`, `Select`, `Avatar`, `Input`, `Switch`, `Checkbox`, `Pagination`, `Dialog` are all explicitly listed) and by the general definition otherwise (`ButtonGroup`/`RadioGroup`/`Table` follow their Lumen namesake's or sibling's placement).
  - Previous: none of these 14 existed anywhere in `@lumen/ui` (`Dialog`'s internal source already existed as Command's dependency, but was never exported publicly until now).
  - Current: each follows the established internal/public split. Adds `@radix-ui/react-tabs`, `@radix-ui/react-tooltip`, `@radix-ui/react-select`, `@radix-ui/react-avatar`, `@radix-ui/react-switch`, `@radix-ui/react-checkbox`, and `@radix-ui/react-radio-group` as new runtime dependencies (`Dialog` reuses `@radix-ui/react-dialog`, already present). `ShadcnSelect`'s `Check`/`ChevronDown`/`ChevronUp`, `ShadcnCheckbox`'s `Check`, `RadioGroup`'s `Circle`, and `ShadcnPagination`'s `ChevronLeft`/`ChevronRight`/`MoreHorizontal` lucide icons all replaced with Lumen's own generated icons. Two new bare-shadow-utility rules established: no-Lumen-precedent bare `shadow`/`shadow-sm`/`shadow-xs` (Button, Switch, Checkbox, RadioGroup, ButtonGroup) are dropped entirely rather than replaced; bare `shadow` on resting surfaces (`ShadcnCard`, `ShadcnTabs`'s active state) resolves to the previously-unused `--shadow-elevation-sm` token, distinct from `--shadow-menu-default` (floating overlays only). `ShadcnTooltip`'s default brand-colored (`bg-primary`) styling was replaced with Lumen's own existing dark-neutral-inverse tooltip look, matching `Tooltip.tsx` exactly via real semantic tokens instead of raw neutral literals. `toggle.tsx`, `button.tsx`, and `separator.tsx` were silently reverted by the CLI yet again (as registryDependencies of newly-requested components) and re-fixed — now a fully established pattern across every batch since batch 3.
  - Affects: `packages/ui/src/components/internal/{card,tabs,tooltip,select,avatar,input,switch,checkbox,radio-group,table,pagination,button-group,button,separator}.tsx` (new/re-fixed), `packages/ui/src/components/{shadcn-button,shadcn-card,shadcn-tabs,shadcn-tooltip,shadcn-select,shadcn-avatar,shadcn-input,shadcn-switch,shadcn-checkbox,shadcn-pagination,shadcn-button-group,dialog,radio-group,table}/*` (new), `packages/ui/src/index.ts`, `packages/ui/package.json`, `docs/shadcn-integration.md`
  - Migration: none — new components, no existing public export changed
  - Validation: `pnpm --filter @lumen/ui typecheck` and `pnpm --filter @lumen/ui test` (315/315, all passing on the first run except one repo-wide `pnpm lint` failure — `jsx-a11y/anchor-has-content` on `PaginationLink`'s spread-only `children`, same root cause and fix as batch 1's `AlertTitle`), repo-wide `pnpm typecheck`/`pnpm test`/`pnpm lint`, and `pnpm --filter @lumen/storybook build-storybook` all passed.
  - Changeset: `.changeset/shadcn-bulk-batch-5.md`

- Added shadcn-sourced `Collapsible`, `Label`, `ToggleGroup`, `NavigationMenu`, and `ShadcnForm` (a `Shadcn`-prefixed family) components to `@lumen/ui` — batch 4 of the bulk shadcn adoption effort, covering the "ambiguous/overlapping" component set. `Combobox` and `NativeSelect` were requested but dropped (same `new-york`-style registry "not found" failure as batch 3's `Marker`/`Direction`/`Attachment`). `Sidebar` and `Message`/`MessageScroller`/`Bubble` were requested but skipped by direct user decision, not adopted even in `Shadcn`-prefixed form — see `docs/shadcn-integration.md` §7.5 for the full reasoning.
  - Affected token group/component: new React `Collapsible`/`CollapsibleTrigger`/`CollapsibleContent`, `Label`, `ToggleGroup`/`ToggleGroupItem`, `NavigationMenu` and its full sub-part set (`List`/`Item`/`Content`/`Trigger`/`Link`/`Indicator`/`Viewport`), `ShadcnForm`/`ShadcnFormField`/`ShadcnFormItem`/`ShadcnFormLabel`/`ShadcnFormControl`/`ShadcnFormDescription`/`ShadcnFormMessage`/`useShadcnFormField`
  - Source: continuation of the bulk shadcn adoption directed 2026-07-23; see `docs/shadcn-integration.md` §7. `Collapsible`/`Label` filed under `Primitives/X` (atomic); `ToggleGroup`/`NavigationMenu`/`ShadcnForm` filed under `Composite/X` (each combines multiple sub-parts into one interaction unit). Three components in this batch were adopted specifically *because* of their overlap with an existing Lumen component, by direct user decision, rather than despite it — `Collapsible` (vs. `Accordion`), `ToggleGroup` (vs. `SegmentedControl`), and especially `Form` (vs. `FormField`) — each documented with the specific distinction in its own internal-source header comment. Two other overlapping candidates (`Sidebar` vs. `AppShell`, `Message`/`MessageScroller`/`Bubble` vs. `AIPanel`) were judged full functional duplicates of an actively-maintained, Figma-sourced Lumen system rather than partial overlaps, and skipped entirely rather than adopted under a `Shadcn`-prefixed name.
  - Previous: none of these five existed anywhere in `@lumen/ui`.
  - Current: each follows the established internal/public split. Adds `@radix-ui/react-collapsible`, `@radix-ui/react-toggle-group`, `@radix-ui/react-navigation-menu`, `@radix-ui/react-label`, `react-hook-form`, `@hookform/resolvers`, and `zod` as new runtime dependencies — the latter three are this repo's first form-state-management dependencies (distinct in kind from every prior addition, all either Radix primitives or single-purpose behavioral libraries). `NavigationMenu`'s `ChevronDown` lucide icon replaced with Lumen's own `ChevronDownIcon`; its `data-[state=open]:bg-accent/50` opacity modifier and all `shadow`/`shadow-md`/animation classes adapted the same way as every prior batch (solid bridged color, `--shadow-menu-default`, deferred motion). `Form`'s entire public family is `Shadcn`-prefixed (`ShadcnForm`, `ShadcnFormField`, ...) rather than only the one symbol (`FormField`) that collides by name with Lumen's existing composite, so the two systems read as clearly distinct; field visuals still come from Lumen's own `Input`/`Button`, not a competing visual layer — `react-hook-form`/`zod` supply state/validation only. `toggle.tsx` and `button.tsx` were silently reverted by the CLI a second time (as registryDependencies of `toggle-group` and `form`) and re-fixed — confirmed standing risk of `--overwrite`, not a one-off.
  - Affects: `packages/ui/src/components/internal/{collapsible,label,toggle-group,navigation-menu,form,toggle,button}.tsx` (new/re-fixed), `packages/ui/src/components/{collapsible,label,toggle-group,navigation-menu,shadcn-form}/*` (new), `packages/ui/src/index.ts`, `packages/ui/package.json`, `docs/shadcn-integration.md`
  - Migration: none — new components, no existing public export changed
  - Validation: `pnpm --filter @lumen/ui typecheck` and `pnpm --filter @lumen/ui test` (273/273, including fixes for two Storybook-typing issues — `ShadcnForm`'s deeply generic `FormProvider` type can't be satisfied by a placeholder `args` object, so its story file drops the `component:` binding entirely; `ToggleGroup`'s discriminated-union `type` prop needed the same placeholder-args treatment as `Accordion`/`InputOTP`), repo-wide `pnpm typecheck`/`pnpm test`/`pnpm lint`, and `pnpm --filter @lumen/storybook build-storybook` all passed.
  - Changeset: `.changeset/shadcn-bulk-batch-4.md`

- Added shadcn-sourced `Textarea`, `Toggle`, `InputOTP`, `ContextMenu`, `Breadcrumb`, `Drawer`, `Carousel`, and `Item` components to `@lumen/ui` — batch 3 of the bulk shadcn adoption effort. `Marker`, `Direction`, and `Attachment` were requested but dropped: none resolve at the `new-york`-style registry endpoint the CLI uses (a hard "not found" failure, not a judgment call) — see `docs/shadcn-integration.md` §7.4.
  - Affected token group/component: new React `Textarea`, `Toggle`, `InputOTP` and sub-parts (`Group`/`Slot`/`Separator`), `ContextMenu` and its full sub-part set (matching `DropdownMenu`'s shape), `Breadcrumb` and sub-parts (`List`/`Item`/`Link`/`Page`/`Separator`/`Ellipsis`), `Drawer` and sub-parts (`Trigger`/`Close`/`Content`/`Header`/`Footer`/`Title`/`Description`/`Portal`/`Overlay`), `Carousel` and sub-parts (`Content`/`Item`/`Previous`/`Next`), `Item` and its full sub-part set (`Group`/`Separator`/`Media`/`Content`/`Title`/`Description`/`Actions`/`Header`/`Footer`)
  - Source: continuation of the bulk shadcn adoption directed 2026-07-23; see `docs/shadcn-integration.md` §7. `Textarea`/`Toggle`/`InputOTP` filed under `Primitives/X` (atomic, single-concept); `ContextMenu`/`Breadcrumb`/`Drawer`/`Carousel`/`Item` filed under `Composite/X` (`Breadcrumb`/`Drawer` explicitly named composite in `docs/component-architecture.md` §2.3; `ContextMenu` matches `DropdownMenu`'s already-composite precedent; `Carousel`/`Item` combine multiple sub-parts into one interaction unit) — checked against both §2.2/§2.3 lists in full this time, per rule 11.
  - Previous: none of these eight existed anywhere in `@lumen/ui`.
  - Current: each follows the established internal/public split. Adds `@radix-ui/react-toggle`, `@radix-ui/react-context-menu`, `@radix-ui/react-slot`, `input-otp`, `embla-carousel-react` (Carousel), and `vaul` (Drawer) as new runtime dependencies — `vaul` and `embla-carousel-react` are this repo's first non-Radix behavioral dependencies. `@base-ui/react` was also installed (the shadcn registry's static metadata listed it for both `drawer` and `direction`) but turned out unnecessary: the actual `new-york`-style `drawer` generated against `vaul` instead, and `direction` turned out unavailable for this style entirely — nothing in the repo imports `@base-ui/react`; see `docs/shadcn-integration.md` §7.4 for the full account. `ContextMenu`'s `Check`/`ChevronRight`/`Circle` and `Breadcrumb`'s `ChevronRight`/`MoreHorizontal` lucide icons replaced with Lumen's own icons (`CheckIcon`/`ChevronRightIcon`/`DotIcon`, `EllipsisIcon`); `InputOTP`'s `Minus` replaced with `MinusIcon`; `Carousel`'s `ArrowLeft`/`ArrowRight` replaced with `ArrowLeftIcon`/`ArrowRightIcon`. Every `/NN` opacity modifier in the generated source (`Item`'s `bg-accent/50`, `ring-ring/50`, `bg-muted/50`; the internal `Button`'s `/90`/`/80` hover states) replaced with solid bridged colors, same reasoning as prior batches. Dropped `InputOTP`'s `animate-caret-blink` keyframe (no Lumen motion token backing it — same deferred-motion decision as elsewhere); the fake caret renders as a static bar. `Carousel`'s Previous/Next controls use shadcn's own internal `Button` (not Lumen's public one) since Lumen's `Button` has no icon-only circular variant for this pattern — matches `Command`'s existing internal-`Dialog` precedent; not exported publicly.
  - A genuine naming collision, not anticipated by the ten components §7.1 named: `PageHeader.tsx` already exported an interface named `Breadcrumb` (a small `{label, href}` shape for its own props). Resolved by renaming that type to `PageHeaderBreadcrumb` (its one real consumer, `packages/patterns/src/DashboardPage.tsx`, updated to match) rather than prefixing the new component, since a small internal data-shape type isn't the same kind of collision as two full public components sharing a purpose.
  - Testing this batch surfaced three jsdom environment gaps no prior component needed: `window.matchMedia` (`embla-carousel-react` and `vaul` both read it), `document.elementFromPoint` (`input-otp`), and `IntersectionObserver` (`embla-carousel-react`). All three added as no-op stubs to `packages/ui/vitest.setup.ts`, same pattern as the existing `ResizeObserver` stub.
  - Affects: `packages/ui/src/components/internal/{textarea,toggle,input-otp,context-menu,breadcrumb,drawer,carousel,item,button,separator}.tsx` (new/re-fixed), `packages/ui/src/components/{textarea,toggle,input-otp,context-menu,breadcrumb,drawer,carousel,item}/*` (new), `packages/ui/src/index.ts`, `packages/ui/src/composite/PageHeader.tsx`, `packages/patterns/src/DashboardPage.tsx`, `packages/ui/package.json`, `packages/ui/vitest.setup.ts`, `docs/shadcn-integration.md`
  - Migration: breaking in one narrow spot — `@lumen/ui`'s exported `Breadcrumb` *type* (used only for `PageHeader`'s `breadcrumbs` prop) is renamed to `PageHeaderBreadcrumb`; the new `Breadcrumb` export is now the full component. No other existing public export changed.
  - Validation: `pnpm --filter @lumen/ui typecheck` and `pnpm --filter @lumen/ui test` (257/257, including fixes for the three jsdom gaps above and a Carousel test's incorrect accessible-name assumption), repo-wide `pnpm typecheck`/`pnpm test`/`pnpm lint`, and `pnpm --filter @lumen/storybook build-storybook` all passed.
  - Changeset: `.changeset/shadcn-bulk-batch-3.md`

- Added shadcn-sourced `Popover`, `DropdownMenu`, `Sheet`, `ScrollArea`, `HoverCard`, and `Slider` components to `@lumen/ui` — batch 2 of the bulk shadcn adoption effort.
  - Affected token group/component: new React `Popover`/`PopoverTrigger`/`PopoverContent`/`PopoverAnchor`, `DropdownMenu` and its full sub-part set (`Trigger`/`Content`/`Item`/`CheckboxItem`/`RadioItem`/`Label`/`Separator`/`Shortcut`/`Group`/`Portal`/`Sub`/`SubContent`/`SubTrigger`/`RadioGroup`), `Sheet` and its sub-parts (`Trigger`/`Close`/`Content`/`Header`/`Footer`/`Title`/`Description`/`Portal`/`Overlay`), `ScrollArea`/`ScrollBar`, `HoverCard`/`HoverCardTrigger`/`HoverCardContent`, `Slider`
  - Source: continuation of the bulk shadcn adoption directed 2026-07-23 ("add all shadcn UI primitive components"); see `docs/shadcn-integration.md` §7. Category assignment (`Primitives/X` for `ScrollArea`/`Slider`, `Composite/X` for the rest) was checked against `docs/component-architecture.md` §2.2/§2.3's explicit example lists *before* writing each `title:` field this time, per rule 11 (added after batch 1's two miscategorization mistakes).
  - Previous: none of these six existed anywhere in `@lumen/ui`.
  - Current: each follows the established internal/public split. Adds `@radix-ui/react-popover`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-hover-card`, `@radix-ui/react-scroll-area`, and `@radix-ui/react-slider` as new runtime dependencies (Sheet reuses the `@radix-ui/react-dialog` dependency `Command` already added). `DropdownMenu`'s `Check`/`ChevronRight`/`Circle` lucide icons replaced with Lumen's own `CheckIcon`/`ChevronRightIcon`/`DotIcon`; `Sheet`'s `X` replaced with `XIcon`, matching Command's `Dialog` precedent exactly (same `bg-black/40` overlay, same `--shadow-menu-default` elevation, same dropped animation classes). All `shadow-md`/`shadow-lg` instances replaced with the bridged `--shadow-menu-default`; `Slider`'s `bg-primary/20`/`border-primary/50` opacity modifiers replaced with solid bridged colors, same as batch 1. Adaptation caught a second real upstream bug (after `Progress`'s in batch 1): the generated `Slider` hardcodes a single `Thumb` element, so a range slider (`defaultValue={[25, 75]}`) silently only got one draggable handle despite Radix's primitive supporting one thumb per value — fixed by rendering one `Thumb` per value. Both upstream bugs were only caught because their tests asserted on real behavior (ARIA attributes, thumb count) rather than just rendering without crashing.
  - Affects: `packages/ui/src/components/internal/{popover,dropdown-menu,sheet,scroll-area,hover-card,slider}.tsx` (new), `packages/ui/src/components/{popover,dropdown-menu,sheet,scroll-area,hover-card,slider}/*` (new), `packages/ui/src/index.ts`, `packages/ui/package.json`, `docs/shadcn-integration.md`
  - Migration: none — new components, no existing public export changed
  - Validation: `pnpm --filter @lumen/ui typecheck` and `pnpm --filter @lumen/ui test` (230/230, including two caught-and-fixed failures — the Slider thumb-count bug above and a test query mistake on Sheet's close button), repo-wide `pnpm typecheck`/`pnpm test`/`pnpm lint`, and `pnpm --filter @lumen/storybook build-storybook` all passed.
  - Changeset: `.changeset/shadcn-bulk-batch-2.md`

- Added shadcn-sourced `Alert`, `Separator`, `Skeleton`, `Progress`, `AspectRatio`, and `Kbd` components to `@lumen/ui` — batch 1 of the bulk shadcn adoption effort covering the full shadcn `registry:ui` component set.
  - Affected token group/component: new React `Alert`/`AlertTitle`/`AlertDescription`, `Separator`, `Skeleton`, `Progress`, `AspectRatio`, `Kbd`/`KbdGroup`
  - Source: direct user-directed initiative ("add all shadcn UI primitive components"), not Figma-sourced. Scope, batching, and the naming-collision convention for later batches are recorded in `docs/shadcn-integration.md` §7 ("Bulk adoption (2026-07-23 override)"); this is batch 1 of that effort, chosen as the genuine-gap components with no naming collisions and no new non-Radix dependencies.
  - Previous: none of these six existed anywhere in `@lumen/ui`.
  - Current: each follows the established internal/public split (`packages/ui/src/components/internal/{alert,separator,skeleton,progress,aspect-ratio,kbd}.tsx` → `packages/ui/src/components/{alert,separator,skeleton,progress,aspect-ratio,kbd}/*`). All resolve colors/radius/typography through the existing `shadcn-lumen-bridge.css`. Adds `@radix-ui/react-separator`, `@radix-ui/react-progress`, and `@radix-ui/react-aspect-ratio` as new runtime dependencies (Alert/Skeleton/Kbd need no Radix primitive). Every `bg-primary/NN` and `border-destructive/NN` opacity-modifier class in the generated source was replaced with a solid bridged color (`bg-muted`, `border-destructive`) — this repo's bridged colors are raw hex, not the `<alpha-value>`-templated HSL channels Tailwind's opacity modifiers are designed around, so `/NN` on them isn't reliable; see `docs/shadcn-integration.md` §5. Adaptation also caught a real accessibility bug in shadcn's own generated `Progress` template: it destructures `value` out of props to compute the indicator's inline-style position but never forwards it back to `ProgressPrimitive.Root`, so Radix never received a value and never set `aria-valuenow` — fixed by forwarding `value` to `Root` explicitly. Corrected same day, in two passes: all six were initially filed under the Storybook `Composite/X` title (copied from `Command`'s), which visually read as a second, uncategorized "primitives" cluster sitting inside Composite — `docs/component-architecture.md` §2.2 explicitly names `Divider`/`Spinner`/`Progress`/`Skeleton` as primitives, so `Separator`/`Skeleton`/`Progress`/`AspectRatio`/`Kbd` (the latter two matching the same atomic, single-concept definition) were re-filed under `Primitives/X`. That first pass over-corrected by moving `Alert` to `Primitives/X` too, without checking §2.3's own composite list — which explicitly names `Alert` there — so it was moved back to `Composite/X`. See `docs/shadcn-integration.md` rule 11, expanded to require checking both lists in full for every future batch instead of defaulting to whatever the previous component used or pattern-matching on "looks atomic."
  - Affects: `packages/ui/src/components/internal/{alert,separator,skeleton,progress,aspect-ratio,kbd}.tsx` (new), `packages/ui/src/components/{alert,separator,skeleton,progress,aspect-ratio,kbd}/*` (new), `packages/ui/src/index.ts`, `packages/ui/package.json`, `docs/shadcn-integration.md`
  - Migration: none — new components, no existing public export changed
  - Validation: `pnpm --filter @lumen/ui typecheck` and `pnpm --filter @lumen/ui test` (203/203, including one caught-and-fixed failure from the Progress `aria-valuenow` bug above), repo-wide `pnpm typecheck`/`pnpm test`/`pnpm lint`, and `pnpm --filter @lumen/storybook build-storybook` all passed.
  - Changeset: `.changeset/shadcn-bulk-batch-1.md`

- Added a shadcn-sourced `Accordion` component to `@lumen/ui`, following the same integration layer `Command` established.
  - Affected token group/component: new React `Accordion`/`AccordionItem`/`AccordionTrigger`/`AccordionContent`
  - Source: direct user-directed initiative, not Figma-sourced — same basis as the `Command` entry below. Recorded in `docs/roadmap.md` Phase 15 and `docs/shadcn-integration.md`'s "Adopted components" table.
  - Previous: no expand/collapse disclosure component existed anywhere in `@lumen/ui`.
  - Current: generated via `pnpm dlx shadcn@latest add accordion` into `packages/ui/src/components/internal/accordion.tsx`, re-exported publicly from `packages/ui/src/components/accordion/Accordion.tsx`. Colors/radius/typography resolve through the existing `shadcn-lumen-bridge.css`; the trigger's chevron uses Lumen's own generated `ChevronDownIcon` instead of `lucide-react`. Adds `@radix-ui/react-accordion` as a new `@lumen/ui` runtime dependency. The shadcn CLI's own generation step edited `tailwind.config.cjs` to add `darkMode: ["class"]` and hardcoded `accordion-down`/`accordion-up` keyframes at a fixed `0.2s` — both were reverted as part of adaptation (no Tailwind `dark:` usage exists anywhere in this repo, and the duration had no Lumen motion-token backing); expand/collapse is instant for now, the same deferred-motion decision already made for `Command`'s dialog. See `docs/shadcn-integration.md` §6 for the full note.
  - Affects: `packages/ui/src/components/internal/accordion.tsx` (new), `packages/ui/src/components/accordion/*` (new), `packages/ui/src/index.ts`, `packages/ui/package.json`, `packages/ui/tailwind.config.cjs`, `docs/shadcn-integration.md`
  - Migration: none — new component, no existing public export changed
  - Validation: `pnpm install`, repo-wide `pnpm typecheck` (all 7 packages) and `pnpm test` (all packages passed — `@lumen/ui` 187/187 including 8 new Accordion tests), repo-wide `pnpm lint`, and `pnpm --filter @lumen/storybook build-storybook` all passed. Confirmed the built CSS contains no leftover `accordion-down`/`accordion-up` animation classes (the tailwind.config.cjs revert held) and no shadcn default theme values.
  - Changeset: `.changeset/shadcn-accordion-integration.md`

- Added a shadcn-sourced `Command` component to `@lumen/ui`, the first component built via the new shadcn-as-source-generator integration layer.
  - Affected token group/component: new React `Command`/`CommandInput`/`CommandList`/`CommandItem`/`CommandGroup`/`CommandEmpty`/`CommandSeparator`, plus a new `packages/ui/src/styles/shadcn-lumen-bridge.css` token bridge
  - Source: direct user-directed initiative, not Figma-sourced — no Figma node exists for a command palette in the current Lumen-AI-Design-System file. Recorded here per this changelog's own scope-gate requirement, and in `docs/roadmap.md` Phase 15 (added retroactively, same pattern as Phase 14/`@lumen/create-app`) and `docs/shadcn-integration.md` (new governance doc for this integration model).
  - Previous: no command-palette/combobox component existed anywhere in `@lumen/ui`; shadcn/ui was not used anywhere in the repository.
  - Current: `packages/ui/components.json` configures the shadcn CLI (style `new-york`, Tailwind v3, `cssVariables: true`) to generate source into `packages/ui/src/components/internal`, which a public wrapper in `packages/ui/src/components/command` re-exports through `@lumen/ui` — consuming apps only ever import `Command` etc. from `@lumen/ui`, never the internal path. `shadcn-lumen-bridge.css` maps shadcn's compatibility variables (`--background`, `--primary`, `--accent`, `--ring`, `--radius`, etc.) one-directionally onto existing Lumen semantic tokens (e.g. `--ring` → `var(--color-border-focus)`, `--radius` → `var(--radius-lg)`, overlay elevation → the previously-unused `--shadow-menu-default`) — no shadcn default theme values were committed, and dark mode continues to resolve entirely through Lumen's existing `[data-theme="dark"]` CSS-variable swap (no Tailwind `dark:` variants introduced). Adds `cmdk` and `@radix-ui/react-dialog` as new `@lumen/ui` runtime dependencies — the first Radix usage in the repository, scoped to this component; `Modal.tsx` already carried a comment anticipating this exact swap. Reuses the existing `cn()` utility and Lumen's own `Icon` registry (`search`/`check`) rather than adding `lucide-react` or a second class-merge helper.
  - Affects: `packages/ui/components.json` (new), `packages/ui/src/styles/shadcn-lumen-bridge.css` (new), `packages/ui/src/components/internal/command.tsx` (new), `packages/ui/src/components/command/*` (new), `packages/ui/src/index.ts`, `packages/ui/package.json`, `packages/ui/tailwind.config.cjs`, `docs/shadcn-integration.md` (new), `docs/roadmap.md`
  - Migration: none — new component, no existing public export changed
  - Validation: `pnpm install` (added `cmdk`/`@radix-ui/react-dialog`), `pnpm --filter @lumen/tokens build`, repo-wide `pnpm typecheck` (all 7 packages), repo-wide `pnpm test` (all packages passed — `@lumen/ui` 179/179 including 9 new Command tests and the new bridge-governance test), and `pnpm --filter @lumen/storybook build-storybook` all passed. Spot-checked the built Storybook CSS directly: `--background`/`--ring`/etc. resolve to real `@lumen/tokens` variables, `.rounded-lg{border-radius:var(--radius)}` and the `data-[selected=true]:bg-accent` variant both compiled correctly, and none of shadcn's known default theme values (e.g. `222.2 84% 4.9%`) appear anywhere in the output.
  - Changeset: `.changeset/shadcn-command-integration.md`

- Added the published dropdown option design to every React Split Button AI.
  - Affected token group/component: `typography.ai-menu-item`, `shadow.menu-default`, and React `AIButton split`
  - Figma source: Lumen-AI-Design-System node `1046:1875`
  - Previous: Primary, Secondary, and Outline Split Button AI exposed separate main and chevron actions, but the chevron only reported `onDropdownClick`; no built-in menu rendered in the component or Storybook.
  - Current: every React split variant opens the same 12px-radius surface with the four published rows—AI Summarize, AI Rewrite, AI Fix Grammar, and AI Translate—using the exact spacing, typography, border, icon geometry, and two-layer shadow. By subsequent user direction, the menu width is content-driven rather than fixed at Figma's original 200px frame; up to eight options are visible and longer menus scroll vertically, with a compact scrollbar that appears only on hover or keyboard focus. `dropdownOptions` can provide an ordered catalog subset and `onDropdownOptionSelect` receives the selected capability. The menu supports Arrow Up/Down, Home/End, Escape, Tab dismissal, and outside-click dismissal.
  - Affects: `packages/tokens/src/{shadow,typography}.json`, generated token output, `packages/ui/src/primitives/AIButton.{tsx,test.tsx,stories.tsx}`, `.changeset/ai-split-dropdown-menu.md`, and `docs/{changelog,component-specifications,design-tokens,figma-sync}.md`
  - Migration: none—existing split props and callbacks remain valid; the chevron now additionally opens the built-in menu
  - Validation: Figma design context and screenshot confirmed the source menu anatomy and values. The automatic-width/eight-row scrolling refinement is user-directed. Token generation, repository lint, and React/UI typecheck passed; all 21 focused AIButton tests passed, including the ten-option overflow case; production Storybook rebuilt successfully with 2,124 modules. Its emitted CSS contains thin, transparent-at-rest scrollbar rules plus hover/focus-within thumb rules, and its AIButton bundle contains the eight-row max-height calculation and ten-option demonstration.
  - Changeset: `.changeset/ai-split-dropdown-menu.md` (`@lumen/tokens` minor, `@lumen/ui` minor)

- Replaced the existing AI Button component library and Storybook surface
  with the canonical “One AI button, every capability” collection.
  - Affected token group/component: `typography.ai-library-*`, editorial and
    documentation-mono font families, `AIButton`, `<lumen-ai-button>`,
    `LumenAIButtonComponent`, and the AI capability catalog
  - Figma source: Lumen-AI-Design-System node `760:1965`, audited on
    2026-07-23 with design context, metadata, variables, and the full-node
    screenshot
  - Previous: the pre-release component exposed Raised, Primary, Secondary,
    Tertiary, Outline, Link, status tints, a 32/36/40/48px `xs/sm/md/lg`
    scale, and behavioral-only destructive intent. Loading hid its visible
    label; split AI buttons were deferred; the Storybook MDX library
    documented those obsolete behaviors.
  - Current: one component exposes Primary, Secondary, Ghost, Outline,
    Destructive, exact 30/34/38/42px `sm/md/lg/xl` sizes, four-size icon-only
    treatments, visible-label Loading, and Primary/Secondary/Outline split
    buttons. The data-driven catalog contains the exact 24 Figma labels,
    descriptions, and capability icons across Content & Drafting, Data
    Analysis & Insights, Workflow & Automation, and Search & Knowledge.
    Storybook now lives at
    `AI Components/One AI Button, Every Capability`; the old
    `AIButtonComponentLibrary.mdx` was deleted.
  - Affects: `packages/ui/src/primitives/{AIButton,AIButton.stories,
    AIButton.test,ai-capabilities,ai-capabilities.test}.*`,
    `packages/{web-components,angular}/src/ai-button/*`,
    `packages/tokens/src/typography.json` and generated token outputs,
    framework READMEs, `docs/{component-specifications,figma-sync}.md`
  - Migration: breaking — replace `raised` with `primary`, `tertiary` with
    `ghost`, remove `link` and `status`, rename `xs/sm/md/lg` sizing to the
    canonical `sm/md/lg/xl` scale, and use `variant="destructive"` instead of
    the old `destructive` boolean
  - Validation: token build, repo-wide lint, and all package typechecks
    passed; all 339 workspace tests passed (162 React/UI, 74 Web Components,
    70 Angular, 27 create-app, 6 patterns); production Storybook built successfully
    and registered the new `Library` story. A 1608px full-page Chromium
    screenshot confirmed the hero, 12-card variant grid, exact four-size
    icon-only rows, visible Loading label, three split treatments, and all
    24 catalog actions against the Figma reference. The in-app browser
    backend was unavailable, so console capture could not be completed.
  - Changeset: `.changeset/one-ai-button-every-capability.md`
    (`@lumen/tokens` minor; `@lumen/ui`, `@lumen/web-components`, and
    `@lumen/angular` major)

- Added the published standard Button size scale across React, Web Components,
  Angular, and Storybook.
  - Affected token group/component: `spacing.42`,
    `typography.standard-button-{sm,md,lg,xl}`, and standard `Button`
  - Figma source: Lumen-AI-Design-System node `1034:4459` ("Sizes"), verified
    with `get_design_context`, `get_metadata`, and per-instance
    `get_variable_defs`; variant/state colors remain sourced from node
    `1027:3733`
  - Previous: the final Button reconciliation exposed one fixed 34px
    geometry and no `size` API, so the published 30/34/38/42px scale was
    missing from all three framework packages and Storybook.
  - Current: `size="sm" | "md" | "lg" | "xl"` binds exact 30/34/38/42px
    heights, 14/16/16/16px inline padding, 6/8/8/8px gaps, 12/14/16/18px
    icons, and Instrument Sans Medium 12/14/16/18px labels with 1% letter
    spacing. `md` remains the default and preserves the previous 34px height;
    its inline padding is corrected from 14px to the newly published 16px.
    The separate 34px icon-only reference is not a size and remains outside
    this change.
  - Affects: `packages/tokens/src/{spacing,typography}.json`, token generator
    and generated output, `packages/ui/src/primitives/{Button,AIButton}.*`,
    `packages/web-components/src/button/lumen-button.{ts,test.ts}`,
    `packages/angular/src/button/lumen-button.{ts,test.ts}`, the Button
    package READMEs, and
    `docs/{component-architecture,component-specifications,design-tokens,development-guidelines,figma-sync,roadmap}.md`
  - Migration: none — `size` is additive and defaults to `md`; existing
    Buttons retain their 34px height but become 4px wider overall because
    `md` uses Figma's corrected 16px inline padding
  - Validation: token generation and repeat-build output passed, including
    `--spacing-42` and all four `--text-standard-button-*` tiers; repository
    typecheck and lint passed; all 345 workspace tests passed (168 React/UI,
    including 16 Button tests; 74 Web Components, including 15 Button tests;
    70 Angular, including 15 Button tests; 27 create-app; 6 patterns);
    production Storybook built with 2,125 modules and registered
    `primitives-button--sizes`; a Playwright screenshot of the built story
    confirmed the four rendered heights, labels, icons, and spacing against
    the Figma reference. `git diff --check` passed.
  - Changeset: `.changeset/button-sizes.md` (`@lumen/tokens` minor,
    `@lumen/ui` minor, `@lumen/web-components` minor, `@lumen/angular` minor)

- Added `AIPanel`, a new composite (right-side assistant chat panel), and a Button `accent` variant, correcting a Figma-source error from the same-day sync below: the AppShell reconciliation two entries down was audited against node `1197:1652` ("appshell-desktop-closed-light"), which turned out to be one example instance living inside a larger canonical "AppShell" canvas (node `1007:3700`), not the canonical source itself. Re-auditing against that canvas surfaced a real design that example instance didn't show at all.
  - Source: user-reported mismatch between Storybook's `AppShell` and Figma, pointing at `https://www.figma.com/design/GJBYRm6ySR7XIECFcHMgy2/Lumen-AI-Design-System?node-id=1007-3700`. Extracted via `get_metadata`/`get_design_context`/`get_variable_defs` on 2026-07-20: `SideNav/Expanded` (`1079:2427`), `NavigationRail` (`1079:2686`), `AIPanel` (`1079:3141`), and the `Breakpoint=Desktop/Theme=Light` composition (`1127:4196`, instance `1119:3351` for AIPanel).
  - Previous: `AIPanel` didn't exist in any framework package. `Button` had no near-black "accent" treatment.
  - Current:
    - `AIPanel` (`packages/ui/src/composite/AIPanel.tsx`) — header (icon + "Assistant" title + optional "+Thread"), a scrollable `role="log"` conversation (right-aligned dark user-prompt bubbles, left-aligned bordered assistant-response bubbles with optional action buttons), and a text input + send button (`onSend` callback, clears on submit, ignores empty/whitespace input). Header icon uses the existing `LmAisymbolIcon` — Figma's `lm-ai-outline` has no corresponding entry in this repo's icon set.
    - `Button` gained `variant: "accent"` — `btn/accent/bg` (#2B2F2F, rounds to `neutral.800`) / `btn/accent/text` (white). Confirmed with the user this is a real, intentional non-brand treatment for dashboard contexts (e.g. `PageHeader`'s primary action, `AIPanel`'s send button), not stale Figma authoring — only the Default state was sourced, hover/active/focus are an undocumented placeholder. Mirrored the same day to `@lumen/web-components`'s `<lumen-button>` and `@lumen/angular`'s `LumenButtonComponent`, keeping Button's existing three-framework parity intact.
  - New tokens (`packages/tokens/src/semantic/color.json`, light + dark): `text.link-subtle` (new `sky.500` primitive, #2563EB — only one step evidenced, no ramp; a genuine naming collision with the existing `text.link`, which means brand crimson and is consumed by `TextLink` — kept as a distinct token rather than overwritten), `background.badge` (cobalt.50), `background.prompt` (lumen-gray.800), `border.table` (lumen-gray.200), `border.input` (lumen-gray.300). All alias existing primitives except `sky.500`. `status/danger` (#DA1E28) was also found in this source but needed no new token — exact value match for the existing `status.error`.
  - Affects: `packages/ui/src/composite/AIPanel.{tsx,stories.tsx,test.tsx}` (new), `packages/ui/src/primitives/Button.tsx`, `Button.stories.tsx`, `Button.test.tsx`, `packages/web-components/src/button/lumen-button.{ts,test.ts}`, `packages/angular/src/button/lumen-button.{ts,test.ts}`, `packages/ui/src/index.ts`, `packages/tokens/src/primitives/color.json`, `packages/tokens/src/semantic/color.json`
  - Migration: none — all additive
  - Validation: `pnpm --filter @lumen/tokens build` passed with all new tokens confirmed in generated CSS (light + dark); `tsc --noEmit` passed for `@lumen/ui`, `@lumen/web-components`, `@lumen/angular`; `pnpm lint` passed repo-wide; 138 `@lumen/ui` tests passed (7 new for AIPanel, 1 new for Button accent), 78 `@lumen/web-components` tests passed (1 new), 75 `@lumen/angular` tests passed (1 new); live browser verification (Playwright/Chromium, Light + Dark) performed against the running dev Storybook — zero console errors across all checked stories, screenshots confirmed visual fidelity against the canonical Figma instance.
  - Changeset: `.changeset/appshell-audit-followup.md` (`@lumen/tokens` minor, `@lumen/ui` minor, `@lumen/web-components` minor, `@lumen/angular` minor)

- Added `ThemeToggle`, `KPICard`, `PageHeader`, and `Footer`, and extended `Avatar` (`tone` prop) and `AppShell` (`variant`/`footer` props), reconciling a previously-unsynced Figma reference screen. `DataTable`/`Badge`/`Button` already covered the screen's table and icon-button pieces with no new code needed.
  - Source: the "appshell-desktop-closed-light" reference screen (Lumen-AI-Design-System, node `1197:1652`) — not previously referenced in any doc or changelog entry. Extracted via `get_metadata`/`get_design_context`/`get_variable_defs` on 2026-07-20: `Header` (`1102:6515`), `NavigationRail` (`1102:6517`), `PageHeader` (`1102:6519`), `KPICard` ×3 (`1102:6521`-`1102:6523`), `TableHeader`/`TableRow` (`1102:6525`-`1102:6528`), `Footer` (`1102:6529`).
  - Previous: none of these components existed. `AppShell` was a single fixed 214px labeled sidebar with a content-scoped header slot; `DashboardPage` built its KPI tiles as inline `Card` markup; `Avatar` had one brand-pink treatment.
  - Current:
    - `ThemeToggle` (`packages/ui/src/primitives/ThemeToggle.tsx`) — new primitive, a Sun/Moon pill switch (native checkbox + `role="switch"`, same accessible-toggle approach as `Switch`). Only the Light-theme instance was sourced; no Dark-theme or mid-interaction instance was available, so the sliding-thumb interaction is the conventional pattern, not Figma-confirmed. Track width rounds 54px→`--spacing-56` so the thumb's translate distance lands on a real spacing token (`--spacing-32`) instead of an unbacked 30px.
    - `KPICard` (`packages/ui/src/primitives/KPICard.tsx`) — new primitive (reviewed `Card` first; its fixed 8px radius/24px padding/no-elevation don't cover this shape without new props, so this ships standalone per the "extend before duplicate" rule). Typography rounds to the nearest existing scale tier: label uses `label-md` (12/18, weight 600 vs. Figma's 12/16, weight 500), value uses `headline-lg` (32/42 vs. Figma's 32/40).
    - `PageHeader` (`packages/ui/src/composite/PageHeader.tsx`) — new composite: breadcrumbs, H1 + trailing action-button row, description line. Title uses `headline-md` (24/32, exact match); breadcrumbs round to `label-md` (12/18, weight 600 vs. Figma's 12/16, weight 400); description rounds to `body-xs` (12/20 vs. Figma's 13/20).
    - `Footer` (`packages/ui/src/layout/Footer.tsx`) — new layout primitive: version text, live-status dot + label, trailing link row (rendered as real `<a>` elements per `docs/accessibility.md`).
    - `Avatar` gained `tone?: "brand" | "neutral"` (default `"brand"`, unchanged) — `"neutral"` is the Header's solid muted-gray-circle/white-initials treatment (`AvatarInitials` instance `I1102:6515;1079:1889`). Additive, non-breaking.
    - `AppShell` gained `variant?: "sidebar" | "rail"` (default `"sidebar"`, pixel-identical to the prior implementation — fully backward compatible) and `footer?: ReactNode` (additive, renders full-width below the content row in both variants). `variant="rail"` is the sourced 64px icon-only collapsed NavigationRail with the header rendered full-width above the rail+content row instead of scoped beside the sidebar; nav item `label` becomes the rail item's `aria-label`/`title` instead of visible text. Only the closed/collapsed rail was sourced — no expanded-rail or open/close transition instance was available, so neither is implemented. This was planned as a breaking rewrite before implementation started; building it additively instead (new default-off variant) fully covers the sourced delta with materially lower risk to existing consumers, so the plan was revised — flagging this deviation explicitly rather than silently changing scope.
    - `DashboardPage` (`@lumen/patterns`) now composes `PageHeader` and `KPICard` instead of hand-rolled equivalents, and gained optional `breadcrumbs`/`description`/`actions` props (additive). `title`/`metrics`/`children` are unchanged. `PageHeader`'s own horizontal padding is zeroed since `Container` already supplies it.
    - Reused with no new code, documented rather than rebuilt (per `AGENTS.md`'s "say so explicitly" guidance): the Header's notification bell is `<Button variant="tertiary" iconOnly>` + `BellIcon`; the table's `StatusBadge` pills are `Badge` with `tone="success"`/`"warning"` — `Badge`'s existing darker `-700` text tiers for those tones were kept rather than matched to Figma's lighter `-500` instance text color, since the darker tiers are an existing, accepted accessibility-contrast choice and `docs/accessibility.md` says not to remove accessible behavior to match a purely visual Figma state; the table itself is `DataTable` with custom column `render` functions, no new table component needed.
  - New tokens (`packages/tokens/src/semantic/color.json`, light + dark, all zero-new-hex-value aliases onto existing primitives): `border.subtle` (lumen-gray.100), `text.secondary` (lumen-gray.700), `background.nav-active` (lumen-gray.100) — each a distinct Figma-bound variable (`stroke/subtle`, `text/secondary`, `bg/nav-active`) alongside, not a substitute for, existing `border.default`/`text.muted`/`background.subtle`. Dark values have no Figma source and use the same 8-minus-light-index lumen-gray mirroring already established for `segment.*`. Also `shadow.elevation.sm` (`packages/tokens/src/shadow.json`) — the first entry in the generic Elevation scale `docs/design-tokens.md` §6 calls for; only this one tier is sourced, `none`/`md`/`lg`/`xl` remain unimplemented.
  - Affects: `packages/ui/src/primitives/{ThemeToggle,KPICard}.{tsx,stories.tsx,test.tsx}` (new), `packages/ui/src/composite/PageHeader.{tsx,stories.tsx,test.tsx}` (new), `packages/ui/src/layout/Footer.{tsx,stories.tsx,test.tsx}` (new), `packages/ui/src/layout/AppShell.{tsx,stories.tsx}` (new `AppShell.test.tsx` — none existed before), `packages/ui/src/primitives/Avatar.{tsx,stories.tsx}`, `packages/ui/src/index.ts`, `packages/tokens/src/semantic/color.json`, `packages/tokens/src/shadow.json`, `packages/patterns/src/DashboardPage.{tsx,stories.tsx}` (new `DashboardPage.test.tsx` — none existed before)
  - Migration: none required for existing consumers — every `AppShell`/`Avatar`/`DashboardPage` change is additive with an unchanged default. No Changeset needed for the breaking-vs-additive question since nothing broke.
  - Deferred at the time this entry was first written; Web Components/Angular parity for `ThemeToggle`, `KPICard`, and `Footer` was completed the same day — see the follow-up entry below. `Avatar`'s `tone` prop remains React-only: `Avatar` itself has no Web Components/Angular implementation yet in either package (a pre-existing gap, not created by this change), so there's nothing to extend. `AppShell`'s `rail` variant, `PageHeader`, and `DashboardPage` remain React-only layout/pattern-level components with no Web Components/Angular equivalent expected (consistent with `@lumen/patterns` being React-only per `CLAUDE.md`). Dark-theme and expanded/open-rail instances of the source screen were not available and are not implemented. `KPICard`'s background-color exact match (`bg/status-success` #E5F9EC vs. existing `status.success-subtle` = green.50 #E6F7E6) was observed as a near-but-not-exact difference and left unchanged pending direct re-verification — not acted on without more evidence.
  - Validation: `pnpm --filter @lumen/tokens build` passed with all four new tokens confirmed in generated CSS (light + dark); `tsc --noEmit` passed for `@lumen/ui` and `@lumen/patterns`; 126 `@lumen/ui` tests passed (up from 113 — 30 new: 4 ThemeToggle, 3 KPICard, 4 Footer, 5 PageHeader, 5 AppShell [new], plus Avatar/AppShell story updates covered by existing suites) and 6 `@lumen/patterns` tests passed (up from 3 — 3 new `DashboardPage.test.tsx`, none existed before); `pnpm lint` passed repo-wide; `pnpm --filter @lumen/storybook build-storybook` passed with all new stories (`Primitives/ThemeToggle`, `Primitives/KPICard`, `Composite/PageHeader`, `Layout/Footer`, `Layout/AppShell` `Rail` story, `Patterns/DashboardPage` `RenewalPipeline` story) confirmed present in the built output. Live browser verification (Playwright/Chromium against the running dev Storybook, both Light and Dark themes, all six new/changed stories) performed 2026-07-20 — screenshots confirmed visual fidelity against the Figma reference; found and fixed one real bug this way: `AppShell.stories.tsx`'s `nav`/`railNav` fixtures used `href: "#"` for every item, producing a React duplicate-key console warning on the `Rail` story (and, on inspection, the pre-existing `Playground` story) — corrected to unique per-item hrefs (`#home`, `#search`, etc.), re-verified clean (zero console errors/warnings) in both stories after the fix.
  - Changeset: `.changeset/appshell-dashboard-sync.md` (`@lumen/tokens` minor, `@lumen/ui` minor, `@lumen/patterns` minor)

- Brought `@lumen/web-components` and `@lumen/angular` to parity with the `ThemeToggle`/`KPICard`/`Footer` sync above.
  - Source: no new Figma nodes — implements the same design already sourced from Lumen-AI-Design-System node `1197:1652` for `@lumen/ui`'s corresponding components (see the entry above for each component's own node reference).
  - Previous: neither framework package had `ThemeToggle`, `KPICard`, or `Footer` equivalents.
  - Current: `@lumen/web-components` ships `<lumen-theme-toggle>`, `<lumen-kpi-card>`, and `<lumen-footer>`; `@lumen/angular` ships the matching `LumenThemeToggleComponent`, `LumenKPICardComponent`, and `LumenFooterComponent`. Both use the same `--color-*`/`--spacing-*`/`--text-*`/`--shadow-*` CSS custom properties as `@lumen/ui` — no token duplication. `ThemeToggle`'s checked-state change needed per-framework event handling, matching the established `<lumen-split-button>` precedent: `@lumen/web-components` dispatches a bubbling, composed `lumen-change` `CustomEvent<{ checked: boolean }>` (the native `<input>`'s own `change` event doesn't cross the shadow boundary); `@lumen/angular` exposes a `checkedChange` `EventEmitter` for `[(checked)]` two-way binding, matching that framework's own idiom (same reasoning as `<lumen-split-button>`'s `(mainClick)`/`(dropdownClick)` outputs). `Footer`'s link-row content projection is `<slot>` (Web Components, with `::slotted(a)` styling) vs. `<ng-content>` (Angular) — Angular's projected links are unstyled by default since there's no non-deprecated `::slotted` equivalent under emulated encapsulation, documented as a known parity gap rather than reached for `::ng-deep`.
  - Not ported: `Avatar`'s `tone` prop — `Avatar` has no Web Components/Angular implementation in either package yet (pre-existing gap, unrelated to this change).
  - Affects: `packages/web-components/src/{theme-toggle,kpi-card,footer}/*` (new), `packages/web-components/src/index.ts`, `packages/angular/src/{theme-toggle,kpi-card,footer}/*` (new), `packages/angular/src/index.ts`
  - Migration: none — all three are additive new components
  - Validation: `tsc --noEmit` passed for both packages; `pnpm lint` passed repo-wide; 77 `@lumen/web-components` tests passed (up from 64 — 4 ThemeToggle + 4 KPICard + 4 Footer, existing 64 unaffected); 74 `@lumen/angular` tests passed (up from 63 — 3 ThemeToggle + 4 KPICard + 4 Footer, existing 63 unaffected)
  - Changeset: `.changeset/appshell-dashboard-sync-wc-angular-parity.md` (`@lumen/web-components` minor, `@lumen/angular` minor)

- Added `@lumen/create-app`, a CLI scaffolder (`pnpm create:react`) that generates a React + TypeScript + Vite + Tailwind application under `apps/<name>`, wired to `@lumen/tokens`/`@lumen/ui`/(optionally) `@lumen/patterns` via `workspace:*` dependencies — a new **pnpm workspace integration model** for developing a product application and the design system side by side in this monorepo, alongside the existing Git-dependency consumption model for separate product repositories.
  - Source: user-directed feature request, not sourced from Figma. Not previously recorded on `docs/roadmap.md` — see the new Phase 14 entry added by this same change for retroactive tracking.
  - Previous: no scaffolding tool existed; every product application had to consume Lumen packages as pinned Git dependencies (see "Use Lumen in a product application" in `README.md`), even during local Lumen development. No `apps/` directory existed in the workspace.
  - Current: `packages/create-app` is a new private CLI package (`@clack/prompts` for interactive prompts, `node:util`'s `parseArgs` for non-interactive `--name`/`--patterns`/`--no-patterns`/`--install`/`--no-install` flags). Its templates live in `packages/create-app/templates/react-vite` and are copied and rendered into `apps/<name>` by `scaffoldApp()`, producing a `package.json` (React `^18.3.1`, matching `packages/ui`'s and `packages/patterns`'s own devDependency pin), a `tailwind.config.cjs` whose content globs scan the generated app plus `packages/ui/src` and, if selected, `packages/patterns/src`, and a rendered `README.md`. Invoked via new root scripts `pnpm create:react` (runs the built CLI, `node ./dist/cli.js`) and `pnpm create:react:dev` (`tsx src/cli.ts`, no build step). `pnpm-workspace.yaml` gained an `apps/*` glob member; `.gitignore` excludes generated `apps/*` (keeping `apps/.gitkeep` so the glob resolves on a fresh clone) and the scaffolder's own `packages/create-app/dist/`; `.eslintrc.cjs` ignores `apps` so generated scaffolds never leak into the repo's own lint run. Root `typecheck`/`test` were rescoped from a blanket recursive run to `--filter "./packages/**"` for the same reason. A new CI workflow, `.github/workflows/react-starter.yml`, proves the flow end-to-end on every PR touching the scaffolder or its dependency packages: frozen-lockfile install, build the CLI, generate a workspace app non-interactively, a second `--no-frozen-lockfile` install (required because `CI=true` otherwise forces frozen-lockfile mode even for a bare `pnpm install`, which would fail since the generated app is never part of the committed lockfile), typecheck and build the generated app, then confirm expected output files exist. `README.md` gained a "Create a React application" section documenting the flow.
  - Affects: `packages/create-app/**` (new package), `.github/workflows/react-starter.yml` (new), `.eslintrc.cjs`, `.gitignore`, `apps/.gitkeep` (new), `package.json`, `pnpm-workspace.yaml`, `README.md`, `CLAUDE.md`, `docs/roadmap.md`
  - Migration: none — new package and new `apps/` workspace root; no existing public API changed; the existing Git-dependency consumption model remains the recommended path for separate product repositories and is unaffected
  - Validation: `pnpm --filter @lumen/create-app typecheck` and `test` passed (27 tests); built the CLI and ran `pnpm create:react -- --name <app> --patterns --no-install` end-to-end, then `pnpm install --no-frozen-lockfile`, `pnpm --filter <app> typecheck`, and `pnpm --filter <app> build` — all passed, matching `react-starter.yml`'s own steps
  - Changeset: none — new private, unpublished dev-tool package; nothing to version-bump

- Added `SegmentedControl`/`SegmentedControlOption`, a new single-choice primitive, across all three framework packages, sourced from a previously-unimplemented Figma section discovered during a full "Buttons" page (node `466:4365`) re-audit against Dev Mode.
  - Source: the "AI ButtonGroup Component Library" section (Lumen-AI-Design-System, node `958:3955`) — not on `docs/roadmap.md` or referenced by any prior changelog entry. "Segmented Control Group" (node `958:5058`, the "Tone Selector" example: Formal/Neutral/Friendly/Concise) confirmed via `get_design_context` on 2026-07-16.
  - Previous: no segmented-control-style component existed in any framework package; the closest existing component, `ButtonGroup`, is a bordered row of full `Button`s (shared borders, no padding track), a visually and structurally different pattern from this padded-track/elevated-selected-segment control.
  - Current: `SegmentedControl` (React: compound component with context, `role="radiogroup"`; Web Components: `<lumen-segmented-control>` + `<lumen-segmented-control-option>` coordinating via bubbling `lumen-segment-select`/`lumen-segment-navigate` events; Angular: `LumenSegmentedControlComponent` + `LumenSegmentedControlOptionComponent` coordinating via `@ContentChildren` + constructor-injected parent, `forwardRef` on both sides for the resulting circular reference) — single-choice, `role="radiogroup"`/`role="radio"` (WAI-ARIA APG Radio Group pattern, not `Tabs`' tab-panel pattern), with `ArrowLeft`/`ArrowRight` roving selection. `size: "sm" | "md" | "lg"` per Figma's own "Sizes" note (28/36/44px), except `lg`: 44px isn't on the confirmed spacing scale (no `Spacing/44` token) and is rounded up to the existing `Spacing/48` — the same treatment already applied to `SplitButton`'s sm dropdown segment; container padding is likewise rounded from Figma's exact 3px up to the nearest existing token, `Spacing/4`. Only the `md` "Tone Selector" instance was independently verified — `sm`/`lg` segment padding/gap/radii reuse the same `md`-derived values rather than inventing unverified per-size figures; a second "Model Picker" example and Angular's own `OnPush`-sibling-refresh requirement (see the component's doc comment) were also observed but don't change the shipped contract.
  - New tokens: `segment.{surface,surface-selected,border-selected,text,text-selected}` (light + dark) in `packages/tokens/src/semantic/color.json` — all alias existing primitives (`lumen-gray.{100,300,700}`, `neutral.white`, `primary.800`) with zero new hex values; dark values have no Figma source and use the same 8-minus-light-index ramp-mirroring rule already documented for `status.*`.
  - Affects: `packages/tokens/src/semantic/color.json`; `packages/ui/src/primitives/SegmentedControl.{tsx,stories.tsx,test.tsx}` (new), `packages/ui/src/index.ts`; `packages/web-components/src/segmented-control/*` (new), `packages/web-components/src/index.ts`; `packages/angular/src/segmented-control/*` (new), `packages/angular/src/index.ts`
  - Migration: none — new component/tokens, no existing public API changed
  - Validation: `eslint .` passed repo-wide; `tsc --noEmit` passed for `@lumen/tokens`, `@lumen/ui`, `@lumen/web-components`, `@lumen/angular`; `pnpm --filter @lumen/tokens build` passed with `--color-segment-*` confirmed in the generated CSS (light + dark); 228 tests passed across the workspace (99 `@lumen/ui`, up from 90 — 6 new `SegmentedControl` tests; 64 `@lumen/web-components`, up from 56; 62 `@lumen/angular`, up from 54; 3 `@lumen/patterns` unaffected); production Storybook build passed with the new `Primitives/SegmentedControl` story confirmed in the built output. Local dev-server/browser visual verification was not performed this pass (no browser automation available in this session) — recommended before release.
  - Changeset: `.changeset/segmented-control.md` (`@lumen/tokens` minor, `@lumen/ui` minor), `.changeset/segmented-control-wc-angular-parity.md` (`@lumen/web-components` minor, `@lumen/angular` minor)

- Added `tone`/`icon` to `ChoiceChip` (all three framework packages) and a `SplitButton` "AI" Storybook composition, resolving the rest of the same "AI ButtonGroup Component Library" section.
  - Source: "Toggle Group" (node `969:5151`, multi-select capability pills: Summarize/Find Insights/Translate/Forecast/Auto-Reply/Cite Sources) and "Split button groups" — AI variant (node `969:5841`, "AI Draft") — both via `get_design_context` on 2026-07-16.
  - Previous: `ChoiceChip` only had its original solid-fill selected / transparent-border-strong unselected look with no leading-icon slot; `SplitButton`'s "AI" pairing was an explicitly-deferred, unbuilt gap recorded in the 2026-07-15 `AIButton` changelog entry ("Split Button AI... explicitly deferred").
  - Current: `ChoiceChip` gained `tone?: "solid" | "subtle"` (default `"solid"`, unchanged) and `icon?: ReactNode` (Web Components: named `icon` slot; Angular: `TemplateRef` input, same idiom as `FilterChip`'s `[icon]`). `tone="subtle"` reproduces the Toggle Group pill exactly: unselected uses plain `neutral.white`/`neutral.100`/`neutral.500`, selected uses `brand.subtle`/`brand.border-strong`/`brand.default` — the same tokens `Button`'s own `secondary` variant already binds to (Figma reuses `--button/surface/secondary/*` variables here, not a new set) — zero new tokens needed. The trailing check icon (vs. `tone="solid"`'s unchanged leading check) matches Figma's pill layout. Reused this component rather than building a new one, per the "extend before adding" rule — only the color treatment and an always-visible leading icon were missing. `SplitButton`'s "AI Draft" example needed no new component/variant at all: Figma's instance reuses `variant="primary"`'s tokens exactly (`--button/surface`/`--button/onsurface`/`--button/separator` unchanged from Primary), so the new Storybook story is a plain composition — existing `iconStart` slot for the AI mark, and the dropdown menu built from the existing `ai-capabilities` catalog (Summarize/Rewrite/Fix Grammar/Translate, matching Figma's own dropdown items 3-of-4 exactly on icon choice; `SplitButton` still renders no menu of its own by design, the story wires a minimal inline one).
  - Affects: `packages/ui/src/primitives/{ChoiceChip.tsx,ChoiceChip.test.tsx,ChoiceChip.stories.tsx}`, `packages/ui/src/composite/SplitButton.stories.tsx`; `packages/web-components/src/choice-chip/{lumen-choice-chip.ts,lumen-choice-chip.test.ts}`; `packages/angular/src/choice-chip/{lumen-choice-chip.ts,lumen-choice-chip.test.ts}`
  - Migration: none — `tone` defaults to the prior, unchanged look; `icon` is additive and optional
  - Validation: covered by the same repo-wide validation run recorded in the `SegmentedControl` entry above (`ChoiceChip` test counts included there: 8 `@lumen/ui`, up from 5; 8 `@lumen/web-components`, up from 5; 8 `@lumen/angular`, up from 5)
  - Changeset: `.changeset/ai-buttongroup-toggle-split.md` (`@lumen/ui` minor), `.changeset/segmented-control-wc-angular-parity.md` (shared with the `SegmentedControl` Web Components/Angular parity changeset above)

- Added a `capability` prop to `AIButton` and a new "AI Components/AI Button Component Library" Storybook documentation page.
  - Source: user-directed architecture recommendation (treat AI Button as a first-class documentation surface, à la Carbon/Spectrum), scoped down from a larger initial proposal after a planning pass — see that pass's conclusions below. Capability categories and action descriptions are sourced verbatim from the Figma "AI Communication Component Library" Capability Catalog section (Lumen-AI-Design-System, node `860:9109`); per-capability icon choices are explicitly _not_ Figma-sourced (that frame uses the default `lm-aisymbol` glyph on every instance, no per-action icon override is specified there) — flagged as an editorial addition, same honesty standard already applied to `destructive`'s "no distinct color, behavioral only" note.
  - Previous: `AIButton` had no `capability` prop; its existing `CapabilityCatalog` Storybook story (`Primitives/AIButton`) hardcoded its category → action-label data as an inline array inside the story's own `render()`, not as a shared, reusable data source; there was no dedicated AI Button documentation page beyond per-control autodocs.
  - Current: new `packages/ui/src/primitives/ai-capabilities.ts` exports `aiCapabilities` (24 entries, 4 Figma categories × 6 actions), `AICapability`, `AICapabilityId`, and `getAICapability`. `AIButton`'s new `capability?: AICapabilityId | (string & {})` prop resolves a default label/icon from that catalog — explicit `icon`/`children` still take precedence when passed — and stamps `data-capability`/`data-ai-analytics-event` on the rendered button (mirroring the existing `destructive` → `data-destructive` hook-in idiom already in this file) so a consuming app can wire its own action and tracking; Lumen has no analytics SDK and doesn't attempt to add one here. An icon-only button with a resolved `capability` and no explicit `aria-label` now defaults its accessible name to the capability's label. An unrecognized `capability` id logs a dev-mode warning and falls back to default rendering rather than throwing. The existing `CapabilityCatalog` story was refactored to render from `aiCapabilities` instead of its old hardcoded array, and a new `ByCapability` story demonstrates the prop directly. The `AIButton` Storybook category was renamed `Primitives/AIButton` → `AI Components/AI Button` (a new `AI Components` top-level sidebar category, added to `preview.tsx`'s `storySort.order` after `Primitives`). The new `AIButtonComponentLibrary.mdx` page (`AI Components/AI Button Component Library`) reproduces the Figma library's layout — Hero, Component Variants, Sizes, States, Capability Catalog, Best Practices, Accessibility, Design Tokens, Do & Don't, Code Examples — built entirely from `<Canvas of={...}>` embeds of the real `AIButton.stories.tsx` exports (no screenshots), following the same `@storybook/blocks` `Meta`/`Canvas` pattern every other MDX page in this repo already uses, and the standalone-`<Meta title="...">` precedent from `packages/storybook/src/Introduction.mdx` (rather than `<Meta of={...}>`, so it gets its own sidebar entry independent of `AIButton.stories.tsx`'s own Docs tab). `packages/storybook/.storybook/main.ts`'s `stories` glob gained `"../../ui/src/**/*.mdx"` (previously only `.stories.@(ts|tsx)` was globbed for `packages/ui`) to pick it up.
  - Scoped out during planning, tracked as explicit follow-ups rather than built here: (1) `capability` parity for `@lumen/web-components`/`@lumen/angular` — deferred to match this repo's established React-first-then-parity-PR pattern; the Code Examples section shows their current real APIs with an explicit "not yet implemented" note rather than fabricating one. (2) Split Button AI — a real, unbuilt dropdown-toggle composite component (confirmed nowhere in any of the three frameworks); the docs page notes it as not-yet-implemented rather than building it. (3) Renaming the shipped `lumen-` custom-element prefix to `lm-` — explicitly declined; `<lumen-ai-button>`/`<lumen-button>` are unchanged, already-shipped, breaking-change-risk tag names.
  - Affects: `packages/ui/src/primitives/ai-capabilities.ts` (new), `ai-capabilities.test.ts` (new), `AIButtonComponentLibrary.mdx` (new), `AIButton.tsx`, `AIButton.stories.tsx`, `AIButton.test.tsx`, `packages/ui/src/index.ts`, `packages/storybook/.storybook/main.ts`, `packages/storybook/.storybook/preview.tsx`, `docs/component-specifications.md` §46
  - Migration: none — `capability` is additive and optional; existing `icon`/`children`-based usage is unaffected; the Storybook category rename only affects dev bookmarks/URLs, not any published package API
  - Validation: `eslint .` passed repo-wide; `tsc --noEmit` passed for `@lumen/ui`; 86 `@lumen/ui` tests passed (up from 76 — 8 new `AIButton` capability tests + 4 new `ai-capabilities.test.ts` data-integrity tests, existing 74 unaffected); `pnpm --filter @lumen/storybook build-storybook` passed with the new `AI Components` category and documentation page confirmed present in the built output
  - Changeset: `.changeset/ai-button-capability.md` (`@lumen/ui` minor)

- Brought `@lumen/web-components` and `@lumen/angular` to parity with the 2026-07-14 `@lumen/ui` Figma sync below (Button `status`, `SplitButton` expansion, `FilterChip`, `ChoiceChip`, `AIButton`).
  - Source: no new Figma nodes — implements the same design already sourced from Lumen-AI-Design-System for `@lumen/ui`'s corresponding components (see each entry below for its own node).
  - Previous: both framework packages shipped Button only, and that Button lacked `status`; neither package had `SplitButton`, `FilterChip`, `ChoiceChip`, or `AIButton` equivalents.
  - Current: `@lumen/web-components` ships `<lumen-button status="...">`, `<lumen-split-button>`, `<lumen-filter-chip>`, `<lumen-choice-chip>`, and `<lumen-ai-button>`; `@lumen/angular` ships the matching `LumenButtonComponent` (`status` input), `LumenSplitButtonComponent`, `LumenFilterChipComponent`, `LumenChoiceChipComponent`, and `LumenAIButtonComponent`. Both use the same `--color-*`/`--spacing-*` CSS custom properties as `@lumen/ui` — no token duplication. `SplitButton`'s two-real-buttons structure required per-framework event handling: `@lumen/web-components` dispatches `lumen-main-click`/`lumen-dropdown-click` `CustomEvent`s (a plain `click` retargeted at the host can't distinguish which inner button fired); `@lumen/angular` exposes `(mainClick)`/`(dropdownClick)` `EventEmitter` outputs instead, matching that framework's own idiom. `FilterChip`'s and `AIButton`'s default-icon-unless-overridden behavior — trivial with a native `<slot>`'s fallback-content mechanism in Web Components — has no `<ng-content>` equivalent in Angular, so the Angular versions use `TemplateRef` inputs (`[icon]`/`[removeIcon]`) instead of content projection for those specific slots.
  - Known limitations carried over unchanged from the React components: SplitButton's `sm` dropdown segment is a square 36px vs. Figma's non-square 30px (not an approved spacing-scale value); AIButton's `status` tint and `xs` exact height (28px in Figma vs. 32px shipped) are not implemented; Split Button AI is not implemented in any framework package.
  - Affects: `packages/web-components/src/{split-button,filter-chip,choice-chip,ai-button}/*` (new), `packages/web-components/src/button/lumen-button.ts`, `packages/web-components/src/index.ts`, `packages/web-components/README.md`, `packages/angular/src/{split-button,filter-chip,choice-chip,ai-button}/*` (new), `packages/angular/src/button/lumen-button.ts`, `packages/angular/src/index.ts`, `packages/angular/README.md`
  - Migration: none — `status` is an additive optional property/input on both packages' Button; the four new components are additive
  - Validation: `tsc --noEmit` passed for both packages; 55 `@lumen/web-components` tests passed (18 Button + 12 SplitButton + 7 FilterChip + 5 ChoiceChip + 13 AIButton); 53 `@lumen/angular` tests passed (19 Button + 11 SplitButton + 7 FilterChip + 5 ChoiceChip + 11 AIButton)
  - Changeset: `.changeset/web-components-angular-parity.md` (`@lumen/web-components` minor, `@lumen/angular` minor)

- Added the `status` (Success/Warning/Error) property to `Button`.
  - Figma source: Buttons page, node `475:7210` — the component-set's State
    property now includes Success/Error/Warning instances for Primary and
    Secondary at every size (confirmed via `get_design_context`); a prior
    reconciliation on 2026-07-12 had recorded these as not existing in the
    cited Figma source, which was accurate at the time and is now stale.
  - Previous: Button supported only Default/Hover/Pressed/Focus/Disabled/
    Loading; `docs/component-specifications.md` §5 explicitly said no other
    states were implemented.
  - Current: `status?: "success" | "warning" | "error"` renders a tinted
    surface/text override (variant-agnostic) with a status-colored border
    only on the Secondary variant (the only bordered variant Figma actually
    specced a status instance for). Added semantic tokens `status.{success,
warning,error}-text` and `-border` (surfaces reuse the existing
    `-subtle` tokens); their dark-mode values use the same index-mirroring
    rule already documented for `status.success`/`-subtle`.
  - Affects: `packages/tokens/src/semantic/color.json`, `packages/ui/src/primitives/Button.tsx`, `Button.test.tsx`, `Button.stories.tsx`, `docs/component-specifications.md` §5, `docs/component-architecture.md` §7.3
  - Migration: none — additive optional prop
  - Validation: `pnpm --filter @lumen/tokens build` passed; `tsc --noEmit` passed for `@lumen/ui`; 8 new Button tests passed alongside the existing 18
  - Changeset: `.changeset/button-status-states.md` (`@lumen/tokens` minor, `@lumen/ui` minor)

- Expanded `SplitButton` with `size` (sm/md/lg) and a new `outline` variant, plus an optional leading icon.
  - Figma source: Buttons page, node `555:300` — the Split Button component
    set now specs 3 sizes and a 4th type (Outline) in addition to the
    originally-sourced `lg`-only Primary/Raised/Secondary.
  - Previous: `SplitButton` had no `size` prop (`lg` only, hardcoded) and
    only `primary | raised | secondary` variants.
  - Current: `size?: "sm" | "md" | "lg"` (default `lg`, preserving prior
    behavior), a fourth `outline` variant (reuses Secondary's text/divider
    tokens with the border always visible, via the new `brand.border-strong`
    semantic token), and an optional `iconStart` slot rendered before the
    label.
  - Known limitation: Figma's `sm` dropdown-toggle segment is a non-square
    30px width, which isn't on the approved spacing scale
    (`docs/design-tokens.md` §4) — shipped as a square 36px segment instead
    of inventing a new token for one edge case.
  - Affects: `packages/tokens/src/semantic/color.json` (new `brand.border-strong`), `packages/ui/src/composite/SplitButton.tsx`, `SplitButton.test.tsx`, `SplitButton.stories.tsx`, `docs/component-specifications.md` §43 (new)
  - Migration: none — `size` defaults to the prior single size; `outline` and `iconStart` are additive
  - Validation: `pnpm --filter @lumen/tokens build` passed; `tsc --noEmit` passed; 15 SplitButton tests passed (6 new)
  - Changeset: `.changeset/split-button-expansion.md` (`@lumen/tokens` minor, `@lumen/ui` minor)

- Added `FilterChip` and `ChoiceChip`, two new Selection primitives.
  - Figma source: Buttons page, nodes `581:409` (Filter Chip) and `581:485`
    (Choice Chip) — neither existed in `@lumen/ui`, `@lumen/patterns`, or
    `docs/roadmap.md` before this sync.
  - Current: both are toggleable pills (`selected`/`disabled` props,
    `aria-pressed`/`aria-disabled`, `lg` size only — no other size is
    specced). `FilterChip` shows a leading plus icon that's retained even
    when selected (confirmed via `get_screenshot`, since that reads as
    unusual) plus a trailing remove icon once selected. `ChoiceChip` shows
    no icon by default and a leading check icon once selected. Both reuse
    existing semantic tokens (`brand.border-strong`, `brand.subtle`,
    `brand.hover`) with no new tokens required.
  - Affects: `packages/ui/src/primitives/{FilterChip,ChoiceChip}.tsx` (new), their `.test.tsx`/`.stories.tsx`, `packages/ui/src/index.ts`, `docs/component-specifications.md` §§44–45 (new)
  - Migration: none — new components
  - Validation: `tsc --noEmit` passed; 12 new tests passed (7 FilterChip + 5 ChoiceChip)
  - Changeset: `.changeset/filter-choice-chips.md` (`@lumen/ui` minor)

- Added `AIButton`, a new primitive implementing the Figma "AI Communication Component Library".
  - Figma source: Buttons page, node `760:1965` — an entirely new section
    not on `docs/roadmap.md` or referenced by any prior changelog entry.
    Specs Primary/Secondary/Tertiary/Outline AI, Icon-Only AI (3 variants ×
    3 sizes), Loading AI, Destructive AI, Split Button AI, and a Capability
    Catalog pattern (4 categories × example action labels).
  - Current: `AIButton` (`variant: primary | secondary | tertiary | outline`,
    `size: xs | sm | md | lg`, `icon`, `isLoading`, `iconOnly`, `destructive`)
    — a standalone component, not a `Button` variant, because Secondary AI's
    filled-tint look and Outline AI don't reuse Button's own Secondary/
    (nonexistent) Outline colors. Every instance carries a mandatory leading
    sparkle icon (overridable via `icon`). `destructive` is documented as
    behavioral only — Figma's Destructive AI instance is pixel-identical to
    Secondary AI, so no distinct color was invented; callers must add their
    own confirmation step. The Capability Catalog is shown as a Storybook
    story, not shipped as a `packages/patterns` composition (see Known
    limitations in `docs/component-specifications.md` §46).
  - Reconciles `docs/component-specifications.md` §30 ("AI Action Button"),
    which predated any AI-specific Figma component: its old variant list
    (`Primary AI | Secondary AI | Ghost AI | Icon AI`) and AI-process state
    list (`Idle | Generating | Streaming | ...`) didn't match what Figma
    actually ships. §30 now points to §46 as the reconciled spec and keeps
    its purpose/examples/requirements prose as still-relevant intent.
  - Known limitations: the `status` (Success/Warning/Error) tint verified on
    Button was not re-verified against AI-Button-specific Figma instances,
    so it's not implemented here; Figma's `xs` AI Button is 28px tall vs.
    Button's 32px `xs` and wasn't matched exactly; Split Button AI (a
    dropdown-toggle pairing) is not implemented.
  - Affects: `packages/ui/src/primitives/AIButton.tsx` (new), `AIButton.test.tsx`, `AIButton.stories.tsx`, `packages/ui/src/index.ts`, `docs/component-specifications.md` §§30, 46
  - Migration: none — new component
  - Validation: `tsc --noEmit` passed; 12 new tests passed
  - Changeset: `.changeset/ai-button.md` (`@lumen/ui` minor)

**Unresolved Figma-to-code differences found during this sync, not implemented — reported per `docs/figma-sync.md` §11 rather than silently applied or ignored:**

- The core `Button` component-set (node `475:7210`) now has a 6th type,
  "Outline", visible in the Buttons page's own States matrix — distinct
  from `secondary` (uses the new `brand.border-strong` border at rest
  instead of `brand.border`, matching the treatment already implemented
  for `SplitButton`'s new `outline` variant). Not added to `Button.tsx` in
  this pass; the `brand.border-strong` token it would need already exists.
- The same States matrix suggests `Secondary`'s Active/Pressed fill may
  have changed to a solid `primary.800` background with white text (the
  value bound to `--button/surface/secondary/active`, reused identically
  by the new Outline type's Active instance) rather than the light
  `primary.100` subtle-pressed fill `Button.tsx` currently applies on
  `active:`. Only observed indirectly via the Outline type reusing a
  `secondary`-scoped token — not independently confirmed against a direct
  `Type=Secondary, State=Active` instance, so not changed pending that
  verification.

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

- Added the latest six theme-aware roles from the `Lumen/Theme` Variables collection: `text/brand`, `icon/brand`, `stroke/brand`, and `btn/disabled/{bg,border,text}`.
  - Figma source: Design Tokens page `426:4395`, `Lumen/Theme` collection `VariableCollectionId:1130:662`; variables `1214:545`–`1214:547`, `1219:607`, and `1222:607`–`1222:608`, inspected through the local Variables API on 2026-07-20
  - Previous: the three brand roles were not exported to code; Button, AIButton, and SplitButton used `neutral.50`/`neutral.200`/`neutral.400` fallbacks plus a blanket 60% opacity for disabled rendering, so neither theme matched the newly published values
  - Current: `--color-text-brand`, `--color-icon-brand`, and `--color-border-brand` resolve to the exact Light/Dark aliases; `--color-button-disabled-background`, `--color-button-disabled-border`, and `--color-button-disabled-text` resolve to `#EDF0F1`/`#DBE1E2`/`#A4B3B7` in Light and `#20272D`/`#2C343B`/`#A4B3B7` in Dark. React, Web Components, and Angular Button families bind directly to the disabled roles without opacity distortion; SplitButton also binds its existing disabled-divider token. The brand roles have no bound Figma component instances yet, so they are published but deliberately not forced onto unrelated components.
  - Affects: `packages/tokens/src/{primitives/color,semantic/color}.json`, generated `packages/tokens/dist/*`; React `Button`, `AIButton`, and `SplitButton`; equivalent Web Components and Angular implementations; `Button.stories.tsx` and its light/dark disabled-state matrix; `docs/design-tokens.md`
  - Migration: none — additive token exports and a visual correction to disabled states; component props and public types are unchanged
  - Validation: token build passed with all six Light/Dark mappings confirmed in generated CSS; lint and full workspace typecheck passed; 425 tests passed (`27` create-app, `139` UI, `78` Web Components, `75` Angular, `6` patterns); production Storybook built successfully (`2,125` modules), registered `primitives-button--disabled-themes`, and all 28 unique color-token references across the changed component family resolve. Screenshot/console verification could not run because the in-app browser reported no registered browser backend; published GitHub Pages verification remains part of deployment closeout.
  - Changeset: `.changeset/sync-brand-disabled-theme-tokens.md` (`@lumen/tokens` minor; `@lumen/ui`, `@lumen/web-components`, and `@lumen/angular` patch)

- Added `raised`/`link` variants and a `status` (success/warning/error) modifier to `AIButton`, closing a gap found during a full visual QA re-audit of the "Buttons" page (node `466:4365`) against fresh Figma Dev Mode data.
  - Source: the "AI Button Component Library" States table (node `852:7996`), which specs 6 variant columns (Primary Raised, Primary, Secondary, Tertiary, Outline, Link) × 9 state rows (Default/Hover/Active/Focus/Disabled/Loading/Success/Error/Warning) — `AIButton` only covered 4 of those columns and none of the status rows. Confirmed via `get_design_context` on: `852:8035` (Primary Raised Default), `860:8464` (Link Default), `860:8278`/`860:8242` (Primary/Primary Raised Success), `860:8280`/`860:8282` (Primary Error/Warning), `860:8344`/`860:8346` (Secondary Success/Error).
  - Previous: `AIButton`'s `variant` union was `"primary" | "secondary" | "tertiary" | "outline"` only, with no elevated-Primary or text-link option and no `status` prop at all — every AI action needing a success/error/warning tint had no supported way to express it.
  - Current: `raised` reuses `Button`'s exact elevation classes (same `--button/shadow/ambient`/`--button/shadow` tokens) — Figma's "Primary Raised" AI instance is pixel-identical to `Button`'s own. `link` remains an AIButton-specific variant with a mandatory leading icon, compact layout, and persistent underline; the standard Button no longer exposes a Link variant. `status` is NOT a copy of `Button`'s status treatment either: `secondary`/`tertiary`/`outline`/`link` get the same subtle tint `Button` uses (with the same Secondary-only tinted-border exception `Button.tsx` already documents), but `primary`/`raised` get a **solid** fill with white text instead — Success uses the darker `success.text` tier (green.700, `#006400`) as its own solid fill rather than the usual light `success.subtle`, while Error/Warning use their base tier (red.500/orange.500) directly, an asymmetry reproduced as literally specced rather than smoothed over (plausibly a contrast-driven Figma choice, since green.500 against white wouldn't clear the same ratio red.500/orange.500 do). `raised` keeps its elevation shadow under a status override, matching the Figma instance.
  - Affects: `packages/ui/src/primitives/{AIButton.tsx,AIButton.stories.tsx,AIButton.test.tsx}`
  - Migration: none — both are new, additive `variant`/`status` values; existing `primary`/`secondary`/`tertiary`/`outline` usage is unchanged
  - Validation: `eslint .` passed repo-wide; `tsc --noEmit` passed for `@lumen/ui`; 236 tests passed across the workspace (105 `@lumen/ui`, up from 100 — 5 new `AIButton` variant/status tests; `@lumen/web-components`/`@lumen/angular`/`@lumen/patterns` unaffected, `AIButton` is `@lumen/ui`-only); production Storybook build passed with `raised`/`link`/`status`-tinted classes confirmed present in the built `AIButton` chunk. Live browser/visual verification was not performed (no browser automation available in this session).
  - Changeset: `.changeset/aibutton-raised-link-status.md` (`@lumen/ui` minor)

### Changed

- **Breaking:** Un-duplicated all 11 `Shadcn`-prefixed components that collided with an existing Lumen export — `Button`, `Card`, `Tabs`, `Tooltip`, `Select`, `Avatar`, `Input`, `Switch`, `Checkbox`, `Pagination`, `ButtonGroup`. Lumen's original hand-built component was deleted in each case and the shadcn-sourced version promoted to the plain name, reversing the additive `Shadcn`-prefix convention from `docs/shadcn-integration.md` §7.1 for these 11 specifically (by direct user instruction — not a change to the default policy for any future collision).
  - Source: direct user request 2026-07-24 ("I want Shadcn button... I'm ok to remove the Button which is a duplicate," confirmed for all 11 after a scope audit); see `docs/shadcn-integration.md` §7.8 for the full record, including the two rounds of scope discovery (a first pass found `Pagination`'s API shape was fundamentally different — composable parts vs. a single component, anchor-based Previous/Next with no native `disabled` — and a second pass found the real consumer footprint was ~30 files, not the 5 first assumed, plus two real API gaps: `Button`'s retired `variant="accent"` and `iconStart`/`iconEnd` props).
  - Previous: `Button`, `Card`, `Tabs`, `Tooltip`, `Select`, `Avatar`, `Input`, `Switch`, `Checkbox`, `Pagination`, `ButtonGroup` were Lumen's own hand-built implementations (several Figma-sourced, e.g. `Button` from nodes `1027:3733`/`1034:4459`, `Avatar`'s `neutral` tone from node `1197:1652`, `Pagination` from the "Next Prev Buttons" component set); `ShadcnButton`, `ShadcnCard`, etc. existed alongside them as the shadcn-sourced alternative.
  - Current: each promoted component now lives at `packages/ui/src/components/<name>/<Name>.tsx` (moved from `components/shadcn-<name>/Shadcn<Name>.tsx`); the original `packages/ui/src/primitives/{Button,Avatar,Input,Switch,Checkbox,ButtonGroup,Tabs,Tooltip,Select}.tsx` and `packages/ui/src/composite/{Card,Pagination}.tsx` (plus their stories/tests) are deleted. API capability was lost, not backfilled, per direct user instruction to keep this a strict/mechanical swap rather than extending shadcn's components: `Button` has no `accent`/`ai` variant or `iconStart`/`iconEnd` slots (icons now pass as plain children); `Input` has no `size`/`variant="search"`/leading-icon/shortcut-badge; `Avatar` has no `name`/`tone`/`size` (compose `AvatarFallback` manually); `Switch` has no `label` (compose a separate `Label`); `Card`'s root carries no padding (wrap loose children in the new `CardContent`); `Tabs`' sub-parts are renamed (`TabList`→`TabsList`, `Tab`→`TabsTrigger`, `TabPanel`→`TabsContent`); `Pagination` is now composable parts, not a single component (see `CrudListPage.tsx` for the `aria-disabled`-anchor Previous/Next pattern).
  - Affects: `packages/ui/src/components/{button,card,tabs,tooltip,select,avatar,input,switch,checkbox,pagination,button-group}/*` (new), `packages/ui/src/primitives/{Button,Avatar,Input,Switch,Checkbox,ButtonGroup,Tabs,Tooltip,Select}.{tsx,stories.tsx,test.tsx}` and `packages/ui/src/composite/{Card,Pagination}.{tsx,stories.tsx}` (deleted), `packages/ui/src/index.ts`, `packages/ui/src/composite/AIPanel.{tsx,test.tsx}`, `packages/ui/src/layout/AppShell.stories.tsx`, ~20 other `*.stories.tsx` files across `packages/ui/src/{components,composite}` whose demo Buttons needed only an import-path fix, `packages/patterns/src/{AuthForm,CrudListPage,SettingsPage,DashboardPage.stories,SettingsPage.stories}.tsx`, `packages/create-app/templates/react-vite/src/App.tsx`
  - Migration: any product code importing `Button`/`Card`/`Tabs`/`Tooltip`/`Select`/`Avatar`/`Input`/`Switch`/`Checkbox`/`Pagination`/`ButtonGroup` from `@lumen/ui` now gets the shadcn-sourced implementation with shadcn's variant vocabulary and no Lumen-specific convenience props — audit call sites for `variant="primary"/"accent"/"ai"`, `iconStart`/`iconEnd`, `Input`'s `size`/`variant`, `Avatar`'s `name`/`tone`/`size`, `Switch`'s `label`, any loose (non-`CardHeader`) `Card` child, and any `Tabs` sub-component usage, per the per-component notes above.
  - Validation: `pnpm --filter @lumen/ui typecheck`/`test` (285/285) and repo-wide `pnpm -r typecheck`, `pnpm --filter @lumen/patterns test` (6/6), and `pnpm lint` all passed after fixing two regressions the swap itself introduced: `Icon.stories.tsx`'s search input lost contextual `onChange` event-type inference and needed an explicit annotation, and `SettingsPage.stories.tsx`'s `Switch`/`label` usage (found only by `pnpm -r typecheck`, since it's barrel-imported from a different package than the ones directly audited).
  - Changeset: `.changeset/shadcn-unduplicate-11.md`

- Dropped the `Shadcn` prefix from six of the seven `ShadcnForm` family symbols, keeping only `ShadcnFormField` prefixed.
  - Source: direct user request, same day as the above ("Still I see some 'Shadcn' prefix in component name... Can you please fix it?"), scoped after confirming only one symbol in the family actually collides by name with an existing Lumen export
  - Previous: `Form`/`FormItem`/`FormLabel`/`FormControl`/`FormDescription`/`FormMessage`/`useFormField` were all exported as `ShadcnForm`/`ShadcnFormItem`/`ShadcnFormLabel`/`ShadcnFormControl`/`ShadcnFormDescription`/`ShadcnFormMessage`/`useShadcnFormField` — the entire family prefixed for consistency (batch 4), even though only `FormField` (now `ShadcnFormField`) actually shares a name with an existing Lumen export (the hand-built `FormField` composite, still used by `AuthForm.tsx`)
  - Current: `Form`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage`, and `useFormField` are now plain names; `ShadcnFormField` is unchanged, since Lumen's own `FormField` was not retired (unlike the 11 components above, the two serve genuinely different needs — one is a full `react-hook-form` integration, the other a simple label/hint/error wrapper — so both stay, under distinct names)
  - Affects: `packages/ui/src/components/form/Form.{tsx,stories.tsx,test.tsx}` (moved from `components/shadcn-form/ShadcnForm.*`), `packages/ui/src/components/internal/form.tsx`, `packages/ui/src/index.ts`, `packages/ui/src/components/chart/Chart.stories.tsx` (one stale comment reference fixed)
  - Migration: any code importing `ShadcnForm`/`ShadcnFormItem`/`ShadcnFormLabel`/`ShadcnFormControl`/`ShadcnFormDescription`/`ShadcnFormMessage`/`useShadcnFormField` from `@lumen/ui` must drop the prefix; `ShadcnFormField` is unchanged
  - Validation: `pnpm --filter @lumen/ui typecheck`/`test` (285/285), `pnpm lint`, and `pnpm --filter @lumen/storybook build-storybook` all passed; confirmed the built Storybook bundle emits `Form.stories-*.js`, not `ShadcnForm.stories-*.js`
  - Changeset: `.changeset/shadcn-form-partial-promotion.md`

- Completed the approved AppShell parity pass across every Figma breakpoint and theme composition.
  - Source: canonical AppShell node `1007:3700`; desktop light/dark `1127:4196`/`1127:4197`, tablet light/dark `1175:2521`/`1175:2522`, and mobile light/dark `1175:2588`/`1175:2589`, inspected in Dev Mode on 2026-07-20.
  - Previous: the token layer had no AppShell-specific semantic group, no published responsive breakpoints, no Instrument Sans interface stack, and several missing exact dimensions/type styles; the Storybook story represented only a desktop-light approximation. `AppShell` had no tablet/mobile structure or assistant slot, `ThemeToggle` rounded 54px to 56px, dark values were inferred, and the AI/audit glyphs were substitutes.
  - Current: `@lumen/tokens` now publishes exact light/dark AppShell semantic roles, Instrument Sans/brand family aliases, AppShell typography compositions, exact sourced dimensions, radius, and the approved mobile `<768px`, tablet `768–1023px`, desktop `≥1024px` breakpoints. `AppShell` exposes breakpoint-specific header/footer/navigation slots plus the desktop assistant region while retaining the existing sidebar/rail variant contract. The co-located Storybook file now contains all six approved compositions with exact content hierarchy and theme behavior. `ThemeToggle`, `PageHeader`, `KPICard`, `Footer`, `AIPanel`, and Button's `accent` treatment bind to the synchronized semantic tokens. Exact Figma exports for `lm-ai-outline` and `lm-audit-log` were added through the standard icon generation pipeline. Existing `Avatar`, `Badge`, `Button`, `Icon`, `PageHeader`, `KPICard`, `Footer`, and `AIPanel` components cover the nested design; no duplicate AppShell-only equivalents were created.
  - Affects: `packages/tokens/src/{primitives/color,semantic/color,spacing,radius,typography,breakpoint}.json`, `packages/tokens/scripts/build.mjs`, generated `packages/tokens/dist/*`; `packages/ui/src/layout/AppShell.{tsx,stories.tsx,test.tsx}`, `packages/ui/src/{composite/{AIPanel,PageHeader},primitives/{Button,KPICard,ThemeToggle},layout/Footer}.tsx`, Button test, generated icon sources/barrels, and `packages/storybook/.storybook/tailwind.css` (loads the token-selected Instrument Sans/Inter preview families).
  - Migration: existing `AppShell` consumers continue to work; the new responsive slots are additive. Consumers relying on the earlier same-release `NavItem[]` shape must still apply the documented `nav={[{ items }]}` migration. The default shell now follows the approved responsive layout and semantic theme values, so intentionally customized visual overrides should be reviewed.
  - Validation: the repository-wide build, lint, typecheck, and test commands pass (325 tests: 27 create-app, 139 UI, 78 Web Components, 75 Angular, and 6 patterns), followed by a successful production Storybook build (2,125 modules transformed). Static validation confirms 497 generated CSS custom-property definitions, 97 complete token references across the changed components with zero missing definitions, the generated 768px/1024px breakpoints, responsive `min-w-0`/overflow containment, all six AppShell story registrations, and light/dark semantic output. Screenshot comparison could not run because the required in-app browser reported no registered browser backend in this session; this limitation is recorded explicitly and must be cleared before claiming screenshot-based visual sign-off.
  - Changeset: `.changeset/appshell-audit-followup.md` (`@lumen/tokens` minor, `@lumen/ui` minor; retains the same-scope Web Components/Angular bumps for the already-recorded accent parity work).

- **Breaking:** Rebuilt `AppShell`'s `sidebar` variant to match the canonical Figma `SideNav/Expanded` component — the prior implementation predated this repo's Figma-sync discipline and matched no sourced evidence (see the AIPanel/accent entry above for the audit that found this).
  - Source: canonical "AppShell" page (Lumen-AI-Design-System, node `1007:3700`), `SideNav/Expanded` component `1079:2427`, re-verified against the `Breakpoint=Desktop/Theme=Light` composition `1127:4196`.
  - Previous: `nav: NavItem[]` — a flat, unlabeled list; no workspace header, badges, section grouping, or collapse control; active items used a brand-pink fill.
  - Current: `nav: NavSection[]` — groups of `NavItem`, each optionally under a header label (Figma's "ADMIN" grouping). `NavItem` gained `badge?: string | number` (an unread-count pill). New `workspace?: WorkspaceInfo` prop renders the `WorkspaceSwitcher` header (name, optional plan, a logo defaulting to a brand-colored initial-letter square). New `onCollapse?: () => void` prop renders Figma's "Collapse" control at the bottom when provided — `AppShell` doesn't manage collapsed state itself (no open/close transition was sourced). Active items now use a neutral `border.subtle` fill (`text.title` label color), not brand pink. The `rail` variant is unaffected in structure but now flattens `NavSection[]` internally (`nav.flatMap(s => s.items)`) to stay on the same shared `nav` prop shape; its own canonical `NavigationRail` component (`1079:2686`) was re-verified and matches the shipped implementation exactly — no changes needed there.
  - Migration: `nav={items}` (a flat array) → `nav={[{ items }]}` (one ungrouped section) preserves prior visual behavior for the list itself; the workspace header, badges, and Collapse control remain absent unless the new props are passed.
  - Affects: `packages/ui/src/layout/AppShell.{tsx,stories.tsx,test.tsx}`
  - Validation: covered by the same validation run recorded in the entry above (`AppShell.test.tsx` grew from 5 to 9 tests); live browser verification confirmed the rebuilt sidebar renders correctly in Light and Dark with zero console errors, screenshots visually matching the canonical Figma instance closely (workspace switcher, badge, active fill, ADMIN grouping, and Collapse control all present and positioned correctly).
  - Changeset: `.changeset/appshell-audit-followup.md` (same changeset as the entry above, `@lumen/ui` minor — see note in that file about the breaking `nav` shape change)
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

- Renamed the product from "Lumen Design System" to "Lumen AI Design System", matching the Figma source file's own rename.
  - Source: the canonical Figma file (fileKey `GJBYRm6ySR7XIECFcHMgy2`) was renamed from "Lumen DS 2027" to "Lumen AI Design System" — confirmed via `get_metadata`, which still lists the same single top-level page (`426:4395`, "Design Tokens") under the new file name, so no node IDs changed, only the file's display name and URL slug (`Lumen-DS-2027` → `Lumen-AI-Design-System`)
  - Previous: "Lumen Design System" / "Lumen DS 2027" / `Lumen-DS-2027` appeared across governance docs, README, `CLAUDE.md`/`AGENTS.md`, `package.json`, the Storybook manager brand title and browser tab title, token source `_comment` fields, and Figma-source doc comments throughout `packages/ui`, `packages/web-components`, and `packages/angular`
  - Current: all three replaced with "Lumen AI Design System" / `Lumen-AI-Design-System` everywhere they appeared (root `package.json` `name` also updated to `lumen-ai-design-system` for consistency, since nothing else referenced the old string); every governance doc's "Source" block `Last reviewed` date bumped to 2026-07-15 to reflect this verification pass; `@lumen/tokens`' generated `dist/` output regenerated from the updated source JSON rather than hand-edited. Also updated `README.md`'s GitHub links (CI/Storybook-deployment badges, git-dependency install snippet, Issues link) from `github.com/iuixd/Lumen-DS` to `github.com/iuixd/Lumen-AI-DS`, matching the "This repository moved" notice GitHub returned on push during the prior sync — the `origin` git remote itself was left untouched since GitHub's redirect already resolves it.
  - Affects: `CLAUDE.md`, `AGENTS.md`, `README.md`, `package.json`, all `docs/*.md`, `packages/storybook/.storybook/{manager.ts,manager-head.html}`, `packages/tokens/{README.md,src/*.json}`, Figma-source doc comments in `packages/ui/src/{primitives,composite}/*.{ts,tsx}`, `packages/web-components/src/**/*.ts`, `packages/angular/src/**/*.ts`, and prior `.changeset/*.md` entries still pending release
  - Migration: none — no package API, token value, or component behavior changed; purely a display-name and citation update
  - Validation: `eslint .` passed repo-wide; `tsc --noEmit` passed for `@lumen/ui`, `@lumen/web-components`, and `@lumen/angular`; full test suite passed (184 tests); `pnpm --filter @lumen/tokens build` passed and `dist/index.ts` confirmed regenerated with the new name; production Storybook build passed with the updated brand title
  - Changeset: `.changeset/rename-lumen-ai-design-system.md` (`@lumen/tokens` patch — only `dist/` output text changed, no token values)

### Deprecated

- None.

### Removed

- Removed `link` from the standard Button variant collection and public API
  across React, Web Components, Angular, and Storybook.
  - Affected token group/component: standard `Button` and the
    `button.link-*` component color roles; the standalone semantic
    `TextLink` component and `text.link*` roles are unchanged
  - Figma source: Lumen-AI-Design-System node `1027:3733`, re-verified with
    `get_design_context` on 2026-07-23. The current `Style` property contains
    only `Primary | Accent | Secondary | Outline | Ghost | Danger`, producing
    48 variant/state/theme combinations; `Link` is absent.
  - Previous: all three framework Button APIs exposed `link`, Storybook
    rendered a seventh Link column, and component-scoped Link background/text
    tokens remained generated from an older extraction of the same node.
  - Current: the standard Button contract exposes only
    `primary | accent | secondary | outline | ghost | destructive`;
    Storybook renders the exact
    six-column Figma collection in light and dark. The unused
    `button.link-*` semantic roles and their two component-only hover
    primitives are removed. Navigation continues to use `TextLink` or a
    semantic anchor.
  - Affects: `packages/tokens/src/{primitives/color,semantic/color}.json` and
    generated output; `packages/ui/src/primitives/Button.{tsx,stories.tsx,test.tsx}`;
    `packages/web-components/src/button/lumen-button.{ts,test.ts}`;
    `packages/angular/src/button/lumen-button.{ts,test.ts}`; package READMEs;
    and
    `docs/{component-architecture,component-specifications,development-guidelines,figma-sync,roadmap}.md`
  - Migration: breaking — replace standard `<Button variant="link">` usage
    with `TextLink`/an anchor for navigation, or `ghost` for a low-emphasis
    action; remove direct use of `--color-button-link-*`
  - Validation: token generation passed and generated output contains no
    `button-link`/`--color-button-link-*` roles; repository typecheck and
    lint passed; all 339 workspace tests passed (166 React/UI, including 14
    Button tests; 72 Web Components, including 13 Button tests; 68 Angular,
    including 13 Button tests; 27 create-app; 6 patterns); production
    Storybook built with 2,125 modules. A Playwright screenshot of
    `FinalVariantCollection` confirmed the six compact variant columns in
    all four states and both themes, with the removed Link slot left empty
    before Destructive to match the Figma collection layout.
  - Changeset: `.changeset/final-button-collection.md` (`@lumen/tokens`
    major, `@lumen/ui` major, `@lumen/web-components` major,
    `@lumen/angular` major)

### Fixed

- Promoted `PageHeader`'s breadcrumb links to the shared `TextLink` component and fixed a one-step dark-mode color drift between `app-shell.text-link` and the standalone `TextLink`'s own `text.link` token, at direct user follow-up to the `AppShell` button-token investigation below ("Yes please" to fixing the breadcrumb/TextLink mismatch flagged during that report).
  - Affected component: React `PageHeader`; token group `color.app-shell` (dark mode only)
  - Source: user-reported visual mismatch between `PageHeader`'s breadcrumb ("Workspace"/"Projects") and the standalone `TextLink` component, surfaced while investigating the `AppShell` Button color bug above. Unlike that bug, this wasn't one CSS variable secretly redirected to another — `app-shell.text-link` and `text.link` are two independently-defined tokens that simply drifted one ramp step apart in dark mode, with no documented rationale for an intentional difference.
  - Previous: `PageHeader`'s breadcrumb used a raw `<a>` (not the shared `TextLink` component) colored via `--color-app-shell-text-link`, which resolved to `primary.200` (`#E599B1`) in dark mode — one step lighter than `TextLink`'s own dark color, `primary.300` (`#D8668A`, via `text.link`). Light mode already matched exactly (`primary.500` both).
  - Current: the breadcrumb link now renders through the shared `TextLink` component (still colored via `--color-app-shell-text-link`, since that remains a deliberate, distinct AppShell-scoped semantic role, not a token to delete) — same pattern already used for `AppShell`'s own Tablet breadcrumb. `app-shell.dark.text-link` now aliases `primary.300`, matching `text.dark.link` exactly. `app-shell.light.text-link` was already correct and left unchanged.
  - Affects: `packages/ui/src/composite/PageHeader.tsx`, `packages/tokens/src/semantic/color.json`, `packages/tokens/dist/*` (regenerated)
  - Migration: none — `PageHeaderProps` unchanged; purely a rendering/color fix
  - Validation: `pnpm --filter @lumen/tokens build` regenerated and spot-checked (`--color-app-shell-text-link` dark now `#D8668A`); `pnpm --filter @lumen/ui typecheck`/`test` (285/285, including `PageHeader.test.tsx` unmodified), repo-wide `pnpm -r typecheck`, `pnpm --filter @lumen/patterns test` (6/6), `pnpm lint`, and `pnpm --filter @lumen/storybook build-storybook` all passed
  - Changeset: `.changeset/pageheader-textlink-and-dark-link-sync.md` (`@lumen/tokens` patch, `@lumen/ui` patch)

- Removed `AppShell`'s local `--color-button-primary-*`/`--color-button-secondary-*`/`--color-button-accent-*` CSS-variable re-scoping, which silently shadowed `Button`'s global colors for everything rendered inside `AppShell` and had drifted out of sync with today's Figma-token fixes.
  - Affected component: React `AppShell` — no props or visible API changed; `Button` instances inside `AppShell` (Share/Export/New project, and the icon buttons converted in the entry below) now read the same global `--color-button-*` tokens as `Button`'s own Storybook page, everywhere.
  - Source: direct user report with side-by-side screenshots — Button's own "Variants" story showed the correct, Figma-synced Secondary colors (translucent brand-tinted pink, in both light and dark), but the identical `<Button variant="secondary">` rendered inside `AppShell` showed plain neutral colors instead, in both themes. Traced through component structure, CSS variable values, and compiled Tailwind output (all confirmed correct in isolation) before finding the actual cause: `AppShell.tsx`'s root `className` locally redefined `--color-button-primary-bg`, `--color-button-primary-on-action`, `--color-button-secondary-bg`, `--color-button-secondary-border`, `--color-button-secondary-on-action`, `--color-button-accent-bg`, and `--color-button-accent-on-action` to point at a separate, AppShell-only shadow token set (`--color-app-shell-button-*`) for any descendant — meaning `Button` never actually read the tokens fixed earlier today when rendered inside `AppShell`.
  - Previous: the shadow tokens (`app-shell.light/dark.button-secondary-bg/border/on-action`) still held their original, pre-fix values (light: `#FFFFFF`/`#E7E2DC`/`#2B2F2F`; dark: `#00000000`/`#3D3039`/`#F5EFF3`) — the same broken values the earlier Button/Figma-sync entries in this changelog replaced in the *global* `button.secondary-*` tokens, except this AppShell-local duplicate was never touched since its existence wasn't known until this investigation. `Primary`'s shadow value happened to already equal the global one (`#BE003C`/white in both places), which is why "New project" rendered correctly the whole time and only `Secondary` visibly broke. `Accent`'s override was already fully dead code, since `Button` dropped its `accent` variant earlier today.
  - Current: the three `[--color-button-*:var(--color-app-shell-button-*)]` override classes are deleted outright (chosen over updating the shadow tokens to match, since keeping two token paths for one visual role is exactly what let this drift happen unnoticed). The `--color-input-*` re-scoping directly below it in the same file is untouched — that's a separate, still-working mechanism unrelated to this bug.
  - Affects: `packages/ui/src/layout/AppShell.tsx`, `packages/ui/src/layout/AppShell.test.tsx` (updated the assertion that checked for the now-removed classes, added a negative assertion guarding against regression)
  - Migration: none — purely a rendering fix; no `AppShell` or `Button` prop changed
  - Validation: `pnpm --filter @lumen/ui typecheck`/`test` (285/285, including `AppShell.test.tsx`'s 11 tests), repo-wide `pnpm -r typecheck`, `pnpm lint`, and `pnpm --filter @lumen/storybook build-storybook` all passed; confirmed directly in the freshly built CSS bundle that the override selector no longer exists
  - Changeset: `.changeset/appshell-button-token-override-removed.md` (`@lumen/ui` patch)

- Aligned `AppShell`'s bespoke buttons and links to use the shared design-system components, at direct user request ("Update Appshell buttons to align to the design system please... and links").
  - Affected component: React `AppShell`/`AppShell.stories.tsx` — the Notifications bell, mobile hamburger-menu toggle, mobile "New project" FAB, and the desktop `NavigationRail`'s Expand button now use `Button`; the tablet breadcrumb's "Workspace"/"Projects" links now use `TextLink`. No token changes.
  - Previous: these were all raw `<button>`/`<a>` elements with hand-rolled Tailwind classes, duplicating styling the shared `Button`/`TextLink` components already provide — and, concretely, none of them had any `focus-visible` styling at all, an accessibility gap the shared components close for free.
  - Current: each converted element keeps its exact AppShell-specific token-driven appearance (size, color, radius) via a `className` override on top of `Button`'s `ghost`/default variant or `TextLink`'s own styling, so the visual result is unchanged except for the added focus-visible ring and (for the icon buttons) a `ghost`-variant hover background where none existed before. Two categories were deliberately left as-is, not converted: the `Sidebar`/`NavigationRail`'s own nav-list `<a>` items and the `Sidebar`'s "Collapse" button (they share one `navItemBase` full-width list-row treatment with icon+label+badge+active-state slots that neither `Button` nor `TextLink` represents — converting the button alone would make it inconsistent with its list siblings), and the mobile "Back to Projects" link and bottom tab-bar items (structural navigation affordances, not inline text links) — see the inline comment added in `AppShell.tsx` for the same reasoning.
  - Affects: `packages/ui/src/layout/AppShell.tsx`, `packages/ui/src/layout/AppShell.stories.tsx`
  - Migration: none — `AppShell`'s public props are unchanged; this is an internal markup change only
  - Validation: `pnpm --filter @lumen/ui typecheck`/`test` (285/285, including `AppShell.test.tsx`'s existing 11 tests unmodified), repo-wide `pnpm -r typecheck`, `pnpm lint`, and `pnpm --filter @lumen/storybook build-storybook` all passed
  - Changeset: `.changeset/appshell-button-link-alignment.md` (`@lumen/ui` patch)

- Corrected every standard Button Hover color against the 12 current
  light/dark Hover instances.
  - Affected token group/component: `color.button` Hover surface,
    foreground, and border roles; Button in React, Web Components, Angular,
    and Storybook
  - Figma source: Lumen-AI-Design-System node `1027:3733` (collection frame
    `1174:1349`), verified with `get_design_context`, `get_metadata`, and
    individual `get_variable_defs` reads for all six Hover variants in both
    themes
  - Previous: Primary, Accent, Destructive, and the light hover surfaces were
    correct, but dark Secondary/Ghost used the obsolete `#2D1A26` surface;
    dark Outline used the wrong surface, foreground, and border ramp steps;
    Ghost retained its default foreground on hover; and light Secondary
    retained the wrong hover foreground alias.
  - Current: Primary (`#720024` light / `#CB3363` dark), Accent (same
    surfaces), and Destructive (`#AE1820` / `#E14B53`) remain unchanged.
    Secondary now resolves to `#DBE1E2` / `#A8939F`, Outline to `#F2CCD8` /
    `#F9E6EC`, and Ghost to `#DBE1E2` / `#A8939F`; their exact
    mode-specific foregrounds and Secondary/Outline borders are bound as
    published. Ghost retains its default foreground while all three framework
    implementations and the static Storybook Hover row consume the corrected
    surface role.
  - Affects:
    `packages/tokens/src/{primitives/color,semantic/color}.json` and generated
    token output; `packages/ui/src/primitives/Button.{tsx,stories.tsx,test.tsx}`;
    `packages/web-components/src/button/lumen-button.{ts,test.ts}`;
    `packages/angular/src/button/lumen-button.{ts,test.ts}`;
    `.changeset/final-button-collection.md`; and
    `docs/{changelog,component-specifications,design-tokens,figma-sync}.md`
  - Migration: none â€” public variants and props are unchanged; this is a
    visual token correction
  - Validation: token generation passed and generated CSS resolves all 12
    Hover combinations to the exact Figma values; repository-wide typecheck
    and lint passed; all 342 workspace tests passed (167 React/UI, including
    15 Button tests; 73 Web Components, including 14 Button tests; 69
    Angular, including 14 Button tests; 27 create-app; 6 patterns);
    production Storybook built successfully with 2,125 modules and contains
    the updated static Hover row. Browser-backed hover screenshots were not
    available because this session exposed no local browser surface, so no
    browser visual signoff is claimed.
  - Changeset: `.changeset/final-button-collection.md` (existing pending
    Button release entry expanded)

- Corrected `KPICard`'s shadow opacity and `PageHeader`/`Footer`'s link colors against the canonical Figma source, found during the same-day AppShell audit (see the AIPanel/accent entry above).
  - Source: canonical "AppShell" page (Lumen-AI-Design-System, node `1007:3700`), `Breakpoint=Desktop/Theme=Light` composition `1127:4196`, `KPICard` instances `1119:3343`-`45`, `PageHeader` instance `1119:3341`, `Footer` instance `1119:3352` — re-verifying the same components previously sourced from the non-canonical `1197:1652` example instance.
  - Previous: `shadow.elevation.sm` was `0px 1px 2px rgba(0,0,0,0.04)`; `PageHeader`'s non-current breadcrumb links and `Footer`'s trailing links both used gray (`text.secondary`/`text.muted`).
  - Current: `shadow.elevation.sm` corrected to `0px 1px 2px rgba(0,0,0,0.08)` — the canonical instance disagrees with the example instance it was first sourced from; the canonical value wins per this repo's Figma authority order. Breadcrumb and footer links now use the new `text.link-subtle` token (blue, #2563EB) — see the new-tokens note in the entry above. The current (non-link) breadcrumb crumb is unaffected (`text.body`).
  - Affects: `packages/tokens/src/shadow.json`, `packages/ui/src/composite/PageHeader.tsx`, `packages/ui/src/layout/Footer.tsx`
  - Migration: none — visual-only corrections, no prop changes
  - Validation: covered by the same validation run recorded in the entry above; live browser verification confirmed the corrected link colors and shadow render correctly in both themes.
  - Changeset: `.changeset/appshell-audit-followup.md` (same changeset as the entry above)

- Corrected `PlusIcon`'s proportions — the "+" itself was roughly half the size and weight it should be, reported by the user against a fresh Figma screenshot after the bordered-square fix below shipped.
  - Source: since `get_design_context` returns Figma's live "plus" instance (node `834:7026`, in the `FilterChip` "State=Default, Size=lg" instance `581:262`) as a flattened image rather than vector data, measured it pixel-for-pixel instead: downloaded its 16×16 PNG export and read raw pixel color (`System.Drawing.Bitmap.GetPixel`, thresholding near-white as background) to map the exact "+" shape. Result: a bold cross with 12px arms and 2px stroke width, centered — arms spanning 75% of the icon, stroke 12.5% of the icon.
  - Previous: `plus.svg`'s two stroke paths spanned only ~30% of the 24-unit viewBox at 1.5-unit stroke width (Figma's proportions, scaled to the same 24-unit viewBox, are 18-unit arms at 3-unit stroke — over twice as long and twice as thick).
  - Current: `plus.svg` updated to `M12 3V21` / `M3 12H21` at `stroke-width="3"`, matching the measured pixel geometry exactly (scaled 16→24 by the same 1.5× factor the viewBox difference implies); regenerated via `icons:import`. Same scope as the border fix below — affects every `PlusIcon` consumer identically, since the defect was in the shared icon source, not any one component.
  - Affects: `packages/ui/src/icons/svg/plus.svg`, `packages/ui/src/icons/generated/PlusIcon.tsx` (regenerated, not hand-edited), `packages/ui/src/primitives/FilterChip.tsx` (doc comment only)
  - Migration: none — rendering-geometry fix only, no prop or icon-name changed
  - Validation: `eslint .` passed repo-wide; `tsc --noEmit` passed for `@lumen/ui`; 100 `@lumen/ui` tests passed (unchanged); confirmed only `plus.svg`/`PlusIcon.tsx` changed in the regenerated icon set; production Storybook build passed with the corrected path (`M12 3v18m-9-9h18`) confirmed present in the built `PlusIcon` chunk
  - Changeset: none (same rationale as the border-fix entry below — a rendering-geometry bugfix to shared icon output, not a `@lumen/ui` prop/behavior change; rides along with the already-pending `@lumen/ui` patch changeset)

- Fixed `FilterChip`'s default plus icon rendering with a stray bordered-square outline around the "+" glyph, reported by the user against a Figma screenshot and a Storybook screenshot.
  - Source: `packages/ui/src/icons/svg/plus.svg` — a legacy Iconly-library export whose `<g id="Iconly/Sharp/Light/Plus">` group carried three paths, not two: the two stroke segments that actually form the "+", plus an unrelated third path (`id="Stroke 18"`, a closed rectangle from `(2.75,2.75)` to `(21.25,21.25)`) that isn't part of the plus glyph at all. `packages/ui/src/icons/generated/PlusIcon.tsx` (auto-generated, "do not edit by hand") faithfully reproduced all three, since `icons-import.mjs` extracts the whole geometry group verbatim.
  - Previous: every `PlusIcon` consumer (`FilterChip`'s default leading icon, `SplitButton.stories.tsx`'s `WithIcon`/`AI` stories) rendered a bordered square around the "+", not present in Figma's own bare-plus glyph.
  - Current: removed the stray rectangle path from `plus.svg` and regenerated via `pnpm --filter @lumen/ui icons:import` — `PlusIcon` now renders only the two stroke segments. Fixed at the shared icon-source level (not a `FilterChip`-specific patch) since the defect was in the icon asset itself, affecting every consumer identically. `<lumen-filter-chip>`'s Web Components/Angular default icon slots were unaffected — they hand-author their own generic plus-cross path (`M12 5v14M5 12h14`), never derived from this Iconly export, so no fix was needed there. Noted but deliberately not fixed in this pass: `packages/ui/src/icons/svg/info-square.svg` carries the exact same stray-rectangle artifact — out of scope here since it wasn't reported and no component currently renders it visibly bordered in a way that reads as wrong.
  - Affects: `packages/ui/src/icons/svg/plus.svg`, `packages/ui/src/icons/generated/PlusIcon.tsx` (regenerated, not hand-edited), `packages/ui/src/primitives/FilterChip.tsx` (doc comment only)
  - Migration: none — purely a rendering-defect fix; no prop or icon-name changed
  - Validation: `tsc --noEmit` passed for `@lumen/ui`; 100 `@lumen/ui` tests passed (unchanged); confirmed only `plus.svg`/`PlusIcon.tsx` changed in the regenerated icon set (`git status` on `packages/ui/src/icons/`)
  - Changeset: none (`PlusIcon`'s public shape/API is unchanged; this is a bugfix to its rendered geometry, not a `@lumen/ui` behavior or prop change, and there is one already-pending `@lumen/ui` patch changeset in this `[Unreleased]` this rides along with)

- Updated all live repository references from the old `github.com/iuixd/Lumen-DS` location to `github.com/iuixd/Lumen-AI-DS`, reported by the user after seeing the "This repository moved" redirect on push.
  - Source: user report, cross-checked with a repo-wide search for `Lumen-DS` (case-insensitive, excluding `Lumen-AI-DS`).
  - Previous: `packages/storybook/src/Introduction.mdx`'s README link, `.github/CODEOWNERS`'s header comment, `packages/tokens/package.json`'s description, and `packages/ui/src/layout/AppShell.tsx`'s doc comment all still referenced the old `Lumen-DS` name or URL — missed by the 2026-07-15 rename pass, which covered `README.md`, `CLAUDE.md`/`AGENTS.md`, and the Storybook manager but not these four. The git `origin` remote itself still pointed at `github.com/iuixd/Lumen-DS.git`.
  - Current: all four files updated to `Lumen-AI-DS`/`Lumen AI Design System`; `git remote set-url origin https://github.com/iuixd/Lumen-AI-DS.git` applied and verified with `git fetch`. Left untouched, and confirmed accurate rather than stale: `docs/changelog.md`'s own historical entries recording the rename and the earlier dead-link fix (changelogs record what was true at the time, not current state); `packages/ui/scripts/icons-bulk-split.mjs`/`icons-import.mjs`'s comments naming "Lumen-DS-2027" (a real past Figma file name these one-time migration scripts actually processed, not a stale current reference); `packages/storybook/.storybook/main.ts`'s `lumen-ds-logo.svg` selector (the literal, still-current filename of a real asset on disk at `packages/storybook/public/lumen-ds-logo.svg` — not a repository reference, and renaming the physical asset was out of scope for this report).
  - Affects: `.github/CODEOWNERS`, `packages/storybook/src/Introduction.mdx`, `packages/tokens/package.json`, `packages/ui/src/layout/AppShell.tsx`, git `origin` remote (local repository configuration, not a tracked file)
  - Migration: none — documentation/metadata text and remote URL only; no package API or published content changed
  - Validation: repo-wide case-insensitive search for `Lumen-DS` confirms no remaining live references outside the historical changelog entries and the two factual exceptions noted above; `git fetch origin` confirmed the new remote resolves correctly
  - Changeset: none (documentation/config-only change, no package affected)

- Corrected `Button`/`AIButton`/`SplitButton` corner radius and `SegmentedControl`'s per-size padding/type, reported by the user against a Figma screenshot of the "AI ButtonGroup Component Library" section; also brought the two new Storybook compositions (Toggle Group, Split Button AI) up to Figma's own presentation and interaction fidelity.
  - Source: fresh `get_design_context` calls on 2026-07-16 against live (not cached) instances: Button Primary xs/sm/lg Default (`480:9063`/`479:8703`/`476:7509`), Button Secondary md Default (`538:62`), SplitButton Primary lg Default (`555:202`) and the Split Button AI examples (`969:5761`), and AIButton's own "AI Draft" instance (`769:9290`); `SegmentedControl`'s "Size Rows" example (`958:5090`, `sm`/`md`/`lg` "Concise"/"Detailed" instances); the Toggle Group workspace-summary caption (`969:5317`, "status-text").
  - Previous: `Button`/`AIButton`/`SplitButton` used `rounded-md` (`--radius-md`, 6px). `SegmentedControl` reused its `md` size's padding (`Spacing/16`) and type (`button-md`) for `sm`/`lg` as well, flagged as an unverified simplification. The Toggle Group story had no workspace-summary caption. The Split Button AI story showed only one (Primary) example with a click-to-toggle-only menu.
  - Current: every checked instance across every Button/SplitButton/AIButton type and size now binds `--radius/segment` (8px) instead of `--radius/md` — all three now use `rounded-lg`, which already maps to the existing `radius.lg` primitive (8px); no new token. `SegmentedControl` now uses real per-size values: `sm` = `Spacing/12` padding + `button-sm` type (12px/20px), `md` unchanged (`Spacing/16` + `button-md`, 14px/22px), `lg` = `Spacing/20` + `button-lg` (16px/24px) — all three already-existing type-scale tiers, propagated through context (React), a reflected `size` attribute pushed onto children (Web Components), and a parent-read getter plus an `OnPush`-safe `ngOnChanges` refresh (Angular). The `ChoiceChip` `ToggleGroup` story gained the workspace-summary caption ("N of 6 capabilities enabled for this workspace"), using the existing `lumen-gray.800` primitive directly since it's illustrative story text, not a component prop. The `SplitButton` `AI` story now shows all three Figma examples (Primary "AI Draft", Secondary "AI Summarize", Outline "Generating...") side by side, and its dropdown menu (`AiCapabilityMenu`, a story-local helper, not new package API) now implements the full WAI-ARIA APG Menu Button pattern — ArrowDown/ArrowUp/Home/End/Enter/Escape, roving focus shared between keyboard and hover, and click-outside-to-close — replacing the earlier click-to-toggle-only demo. The Outline example is deliberately _not_ wired to `isLoading`: that prop replaces content with a spinner, but Figma's own rendering shows the AI icon plus the visible label "Generating..." with no spinner, so `isLoading` would have been a pixel mismatch — "Generating..." is passed as ordinary label content instead.
  - Affects: `packages/ui/src/primitives/{Button.tsx,AIButton.tsx,SegmentedControl.tsx,SegmentedControl.test.tsx,SegmentedControl.stories.tsx,ChoiceChip.stories.tsx}`, `packages/ui/src/composite/{SplitButton.tsx,SplitButton.stories.tsx}`; `packages/web-components/src/{button,ai-button,split-button}/lumen-*.ts`, `packages/web-components/src/segmented-control/{lumen-segmented-control.ts,lumen-segmented-control-option.ts,lumen-segmented-control.test.ts}`; `packages/angular/src/{button,ai-button,split-button}/lumen-*.ts`, `packages/angular/src/segmented-control/{lumen-segmented-control.ts,lumen-segmented-control-option.ts,lumen-segmented-control.test.ts}`
  - Migration: none — all visual/example corrections; no prop, event, or slot API changed
  - Validation: `eslint .` passed repo-wide; `tsc --noEmit` passed for `@lumen/ui`, `@lumen/web-components`, `@lumen/angular`, `@lumen/patterns`, `@lumen/storybook`; `pnpm --filter @lumen/tokens build` passed; 231 tests passed across the workspace (100 `@lumen/ui`, up from 99 — 1 new `SegmentedControl` per-size test; 65 `@lumen/web-components`, up from 64; 63 `@lumen/angular`, up from 62; 3 `@lumen/patterns` unaffected); production Storybook build passed with the expanded `AI` and `ToggleGroup` stories confirmed in the built output. Live browser/visual verification was again not performed (no browser automation available in this session).
  - Changeset: `.changeset/button-radius-segmentedcontrol-fix.md` (`@lumen/ui` patch, `@lumen/web-components` patch, `@lumen/angular` patch)

- Corrected `Button`'s `secondary` variant and added the previously-missing `outline` variant, across all three framework packages, reported by the user against a Storybook screenshot.
  - Source: Buttons page, node `475:7210` — `get_design_context` on 2026-07-16 against `Type=Secondary`/`Type=Outline` at every documented State (Default/Hover/Active/Disabled), Size=md: node `538:62` (Secondary Default), `538:302` (Hover), `538:1262` (Active), `538:842` (Disabled), and `806:5997`/`806:5993`/`806:5989`/`806:5980` (the same four states for Outline). This directly confirms and closes an item already flagged as an unresolved Figma-to-code difference earlier in this same `[Unreleased]` section ("The core `Button` component-set... now has a 6th type, 'Outline'... Secondary's Active/Pressed fill may have changed to a solid `primary.800` background with white text").
  - Previous: `secondary` rendered `bg-transparent` at rest, only filling (`brand.subtle`) on hover, and used the lighter `brand.border` token for its rest-state border; its `active` state used `brand.subtle-pressed` (a light fill, same text color as rest). `outline` did not exist as a `Button` variant at all (only `AIButton` and `SplitButton` had one).
  - Current: `secondary` and `outline` share identical border (`brand.border-strong`) and text (`brand.default`) colors at every state — Figma's _only_ difference between them is fill: `secondary` is filled (`brand.subtle`) at rest and hover; `outline` is transparent at rest and only fills (`brand.subtle`) on hover. Both now share an identical `active` state: a solid dark fill with white text and no border, via a new `brand.solid-active` semantic token (`primary.800`, `#4C0018` — confirmed identical on both variants' Active instances, resolving the changelog's own earlier speculation about this exactly). `outline`'s hover border is bound to the same Figma variable as its hover fill (`--button/surface/secondary/surface`) — reproduced literally (`hover:border-[var(--color-brand-subtle)]`, matching its own `hover:bg-*`) even though it reads as a likely Figma authoring artifact, since the visual result (an invisible border blending into the fill) is unambiguous either way. `status` (success/warning/error) was not re-verified against `outline` in this pass — Figma's own State matrix only confirmed Success/Error/Warning instances for Primary and Secondary — so `outline` doesn't get the status-colored-border compound variant `secondary` has; flagged as a known limitation, not silently extended.
  - Affects: `packages/tokens/src/semantic/color.json` (new `brand.solid-active`), `packages/ui/src/primitives/Button.tsx`, `Button.stories.tsx`, `Button.test.tsx`, `packages/web-components/src/button/lumen-button.ts`, `lumen-button.test.ts`, `packages/web-components/README.md`, `packages/angular/src/button/lumen-button.ts`, `lumen-button.test.ts`, `packages/angular/README.md`, `docs/component-specifications.md` §5
  - Migration: none — `secondary`'s corrected appearance is a visual fix, not an API change; `outline` is a new, additive variant value in all three packages
  - Validation: `eslint .` passed repo-wide; `tsc --noEmit` passed for `@lumen/ui`, `@lumen/web-components`, `@lumen/angular`; `pnpm --filter @lumen/tokens build` passed with `--color-brand-solid-active` confirmed in the generated CSS (`#4C0018` light / `#720024` dark); 203 tests passed across the workspace (90 `@lumen/ui`, up from 86 — 4 new Button regression/Outline tests; 56 `@lumen/web-components`, up from 55; 54 `@lumen/angular`, up from 53; 3 `@lumen/patterns` unaffected); production Storybook build passed
  - Changeset: `.changeset/button-secondary-outline-fix.md` (`@lumen/tokens` minor, `@lumen/ui` minor, `@lumen/web-components` minor, `@lumen/angular` minor)

- Replaced `AIButton`'s default leading icon with the Figma-approved `lm-aisymbol` glyph, across all three framework packages.
  - Source: Buttons page, node `760:1965` ("AI Communication Component Library") — `get_design_context` on 2026-07-15 showed the Secondary Icon Only AI sub-section's icon instances (nodes `843:7818`–`843:7824`, all four sizes) explicitly swapped to a component named `lm-aisymbol`, not the generic sparkle glyph the 2026-07-14 `AIButton` sync had approximated.
  - Previous: `packages/ui/src/primitives/AIButton.tsx` defaulted to the generated `SparklesIcon` (a Lucide-style 4-point sparkle); `@lumen/web-components`'s `<lumen-ai-button>` and `@lumen/angular`'s `LumenAIButtonComponent` each hardcoded an inline stroke-drawn diamond/sparkle path as their default icon slot — three different, Figma-inaccurate glyphs across the three packages.
  - Current: all three default to the same `lm-aisymbol` glyph (a two-sparkle mark, fill-based `currentColor` path). React imports the existing generated `LmAisymbolIcon` (already present in `packages/ui/src/icons/generated`, previously unused by `AIButton`); Web Components and Angular inline the equivalent `<path fill="currentColor" d="…">`, matching React's SVG exactly since neither package has an icon-import pipeline. Capability-specific icon overrides (e.g. the wand icon for "Rewrite", languages icon for "Translate" in the Capability Catalog story) are unchanged — only the _default_ AI-symbol glyph was in scope.
  - Affects: `packages/ui/src/primitives/AIButton.tsx`, `AIButton.stories.tsx`, `AIButton.test.tsx`; `packages/web-components/src/ai-button/lumen-ai-button.ts`, `lumen-ai-button.test.ts`; `packages/angular/src/ai-button/lumen-ai-button.ts`, `lumen-ai-button.test.ts`; `docs/component-specifications.md` §46
  - Migration: none — `icon` remains an optional override prop/input/slot in all three packages; only the unoverridden default glyph's appearance changes
  - Validation: `eslint .` passed repo-wide; `tsc --noEmit` passed for all three packages; 184 tests passed (76 `@lumen/ui` incl. the renamed AIButton default-icon test, 55 `@lumen/web-components` incl. AIButton, 53 `@lumen/angular` incl. AIButton); `pnpm --filter @lumen/tokens build` passed; production Storybook build passed (`AIButton.stories` and `Icon.stories` chunks built clean, capability-icon chunks like `WandSparklesIcon` unaffected)
  - Changeset: `.changeset/ai-button-lm-aisymbol-icon.md` (`@lumen/ui` patch, `@lumen/web-components` patch, `@lumen/angular` patch)

- Fixed three dead `README.md` links to the deployed Storybook, reported as a production 404.
  - Source: user report — `https://srikumar.design/Lumen-DS/` returned HTTP 404; confirmed via direct fetch, and confirmed `https://srikumar.design/Lumen-AI-DS/` loads the live Storybook
  - Previous: the GitHub repository backing this project was renamed from `Lumen-DS` to `Lumen-AI-DS` (surfaced earlier as a "This repository moved" notice on `git push`), which moved the GitHub Pages project-site path; `README.md`'s three Storybook links (top nav, table, and footer) still pointed at the old `/Lumen-DS/` path, which GitHub Pages no longer serves — GitHub does not redirect Pages paths on a repo rename, only the git remote itself
  - Current: all three links updated to `http://srikumar.design/Lumen-AI-DS/`; the earlier `github.com/iuixd/Lumen-DS` → `github.com/iuixd/Lumen-AI-DS` link fix (CI badges, git-dependency snippet, Issues link) in this same rename already covered the GitHub-hosted links, this covers the separately-domained deployed-Storybook links that were missed in that pass
  - Affects: `README.md` only
  - Migration: none
  - Validation: fetched both URLs directly — old path returns 404, new path returns the live Storybook (`@storybook/core - Storybook` title)
  - Changeset: none (documentation-only change, no package affected)

- Corrected `ChoiceChip`'s `tone="subtle"` box model, found during a full visual QA re-audit of the "Buttons" page (node `466:4365`) against fresh Figma Dev Mode data.
  - Source: `get_design_context` on the live "Toggle Group" pill instances (node `969:5287` "pill-summarize", `969:5299` "pill-translate") that `tone="subtle"` is sourced from.
  - Previous: `tone="subtle"` shared its entire box model (36px height, `button-lg` type, 6px gap, 12px horizontal padding, 1.5px border, 16px leading-icon slot) with `tone="solid"`, which is correct for `tone="solid"`'s own Figma source (node `581:485`) but not for the Toggle Group pill — a different Figma component instance the two tones happened to have been conflated under one shared set of box-model classes.
  - Current: `tone="subtle"` now independently binds the Toggle Group pill's real values: a hugged **38px** height (`py-8` around an 18px-line-height label; added `--spacing-38`, since no existing token matched), `button-md` type (14px/22px, not `button-lg`'s 16px/24px), an **8px** gap, **16px** horizontal padding, a plain 1px border (not 1.5px), and a **14px** leading-icon slot (not the 16px `size-4` used elsewhere) — colors were already exact matches and are unchanged. `tone="solid"` is untouched.
  - Affects: `packages/tokens/src/spacing.json` (new `38` key), `packages/ui/src/primitives/ChoiceChip.tsx`
  - Migration: none — visual/box-model correction only, no prop or default changed
  - Validation: `eslint .` passed repo-wide; `tsc --noEmit` passed for `@lumen/ui`; `pnpm --filter @lumen/tokens build` passed with `--spacing-38` confirmed in the generated CSS; 236 tests passed across the workspace (`ChoiceChip.test.tsx`'s existing 8 tests unaffected, behavior-only assertions); production Storybook build passed with the corrected `ToggleGroup` story confirmed in the built output. Live browser/visual verification was not performed (no browser automation available in this session).
  - Changeset: `.changeset/aibutton-raised-link-status.md` (shared with the `AIButton` entry above — both are part of the same visual QA audit pass; `@lumen/tokens` minor, `@lumen/ui` minor)

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

| Token         | Value |
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

#### Radius tokens

Added the following documented radius tokens:

| Token         |         Value |
| ------------- | ------------: |
| `Radius/None` |           0px |
| `Radius/Xs`   |           2px |
| `Radius/Sm`   |           4px |
| `Radius/Md`   |           6px |
| `Radius/Lg`   |           8px |
| `Radius/Xl`   |          12px |
| `Radius/2xl`  |          16px |
| `Radius/3xl`  |          24px |
| `Radius/Full` | Pill / 9999px |

#### Typography tokens

Added the documented heading scale:

| Token                   | Font size | Line height |
| ----------------------- | --------: | ----------: |
| `Typography/Heading/H1` |      60px |        72px |
| `Typography/Heading/H2` |      50px |        60px |
| `Typography/Heading/H3` |      40px |        50px |
| `Typography/Heading/H4` |      32px |        42px |
| `Typography/Heading/H5` |      24px |        32px |
| `Typography/Heading/H6` |      20px |        28px |

Added the documented body scale:

| Token                | Font size | Line height |
| -------------------- | --------: | ----------: |
| `Typography/Body/Lg` |      20px |        32px |
| `Typography/Body/Md` |      16px |        26px |
| `Typography/Body/Sm` |      14px |        22px |
| `Typography/Body/Xs` |      12px |        20px |

Added the documented label scale:

| Token                 | Font size | Line height |
| --------------------- | --------: | ----------: |
| `Typography/Label/Lg` |      14px |        20px |
| `Typography/Label/Md` |      12px |        18px |
| `Typography/Label/Sm` |      11px |        16px |

Added the documented utility scale:

| Token                         | Font size | Line height |
| ----------------------------- | --------: | ----------: |
| `Typography/Utility/Overline` |      11px |        16px |
| `Typography/Utility/Caption`  |      11px |        18px |

Added the documented code scale:

| Token                | Font size | Line height |
| -------------------- | --------: | ----------: |
| `Typography/Code/Md` |      14px |        22px |
| `Typography/Code/Sm` |      12px |        20px |

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
