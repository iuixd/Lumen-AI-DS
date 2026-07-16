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

- Reworked the repository README as an audience-oriented onboarding and navigation page.
  - Source: repository documentation and deployed Storybook; no Figma node is involved
  - Previous: contributor-focused package and command reference with no prominent deployed Storybook link, audience paths, maturity status, prerequisites, architecture overview, or support guidance
  - Current: prominent Storybook and documentation links, role-based entry points, corrected Figma/token/publication facts, reliable pnpm commands, integration guidance, architecture, accessibility and quality expectations, release navigation, and support information
  - Affects: `README.md` and the GitHub repository landing experience
  - Migration: none
  - Validation: Markdown formatting check passed and all 45 repository-relative links resolve
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
  - Source: user-directed architecture recommendation (treat AI Button as a first-class documentation surface, à la Carbon/Spectrum), scoped down from a larger initial proposal after a planning pass — see that pass's conclusions below. Capability categories and action descriptions are sourced verbatim from the Figma "AI Communication Component Library" Capability Catalog section (Lumen-AI-Design-System, node `860:9109`); per-capability icon choices are explicitly *not* Figma-sourced (that frame uses the default `lm-aisymbol` glyph on every instance, no per-action icon override is specified there) — flagged as an editorial addition, same honesty standard already applied to `destructive`'s "no distinct color, behavioral only" note.
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

### Changed

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

- None.

### Fixed

- Corrected `Button`/`AIButton`/`SplitButton` corner radius and `SegmentedControl`'s per-size padding/type, reported by the user against a Figma screenshot of the "AI ButtonGroup Component Library" section; also brought the two new Storybook compositions (Toggle Group, Split Button AI) up to Figma's own presentation and interaction fidelity.
  - Source: fresh `get_design_context` calls on 2026-07-16 against live (not cached) instances: Button Primary xs/sm/lg Default (`480:9063`/`479:8703`/`476:7509`), Button Secondary md Default (`538:62`), SplitButton Primary lg Default (`555:202`) and the Split Button AI examples (`969:5761`), and AIButton's own "AI Draft" instance (`769:9290`); `SegmentedControl`'s "Size Rows" example (`958:5090`, `sm`/`md`/`lg` "Concise"/"Detailed" instances); the Toggle Group workspace-summary caption (`969:5317`, "status-text").
  - Previous: `Button`/`AIButton`/`SplitButton` used `rounded-md` (`--radius-md`, 6px). `SegmentedControl` reused its `md` size's padding (`Spacing/16`) and type (`button-md`) for `sm`/`lg` as well, flagged as an unverified simplification. The Toggle Group story had no workspace-summary caption. The Split Button AI story showed only one (Primary) example with a click-to-toggle-only menu.
  - Current: every checked instance across every Button/SplitButton/AIButton type and size now binds `--radius/segment` (8px) instead of `--radius/md` — all three now use `rounded-lg`, which already maps to the existing `radius.lg` primitive (8px); no new token. `SegmentedControl` now uses real per-size values: `sm` = `Spacing/12` padding + `button-sm` type (12px/20px), `md` unchanged (`Spacing/16` + `button-md`, 14px/22px), `lg` = `Spacing/20` + `button-lg` (16px/24px) — all three already-existing type-scale tiers, propagated through context (React), a reflected `size` attribute pushed onto children (Web Components), and a parent-read getter plus an `OnPush`-safe `ngOnChanges` refresh (Angular). The `ChoiceChip` `ToggleGroup` story gained the workspace-summary caption ("N of 6 capabilities enabled for this workspace"), using the existing `lumen-gray.800` primitive directly since it's illustrative story text, not a component prop. The `SplitButton` `AI` story now shows all three Figma examples (Primary "AI Draft", Secondary "AI Summarize", Outline "Generating...") side by side, and its dropdown menu (`AiCapabilityMenu`, a story-local helper, not new package API) now implements the full WAI-ARIA APG Menu Button pattern — ArrowDown/ArrowUp/Home/End/Enter/Escape, roving focus shared between keyboard and hover, and click-outside-to-close — replacing the earlier click-to-toggle-only demo. The Outline example is deliberately *not* wired to `isLoading`: that prop replaces content with a spinner, but Figma's own rendering shows the AI icon plus the visible label "Generating..." with no spinner, so `isLoading` would have been a pixel mismatch — "Generating..." is passed as ordinary label content instead.
  - Affects: `packages/ui/src/primitives/{Button.tsx,AIButton.tsx,SegmentedControl.tsx,SegmentedControl.test.tsx,SegmentedControl.stories.tsx,ChoiceChip.stories.tsx}`, `packages/ui/src/composite/{SplitButton.tsx,SplitButton.stories.tsx}`; `packages/web-components/src/{button,ai-button,split-button}/lumen-*.ts`, `packages/web-components/src/segmented-control/{lumen-segmented-control.ts,lumen-segmented-control-option.ts,lumen-segmented-control.test.ts}`; `packages/angular/src/{button,ai-button,split-button}/lumen-*.ts`, `packages/angular/src/segmented-control/{lumen-segmented-control.ts,lumen-segmented-control-option.ts,lumen-segmented-control.test.ts}`
  - Migration: none — all visual/example corrections; no prop, event, or slot API changed
  - Validation: `eslint .` passed repo-wide; `tsc --noEmit` passed for `@lumen/ui`, `@lumen/web-components`, `@lumen/angular`, `@lumen/patterns`, `@lumen/storybook`; `pnpm --filter @lumen/tokens build` passed; 231 tests passed across the workspace (100 `@lumen/ui`, up from 99 — 1 new `SegmentedControl` per-size test; 65 `@lumen/web-components`, up from 64; 63 `@lumen/angular`, up from 62; 3 `@lumen/patterns` unaffected); production Storybook build passed with the expanded `AI` and `ToggleGroup` stories confirmed in the built output. Live browser/visual verification was again not performed (no browser automation available in this session).
  - Changeset: `.changeset/button-radius-segmentedcontrol-fix.md` (`@lumen/ui` patch, `@lumen/web-components` patch, `@lumen/angular` patch)

- Corrected `Button`'s `secondary` variant and added the previously-missing `outline` variant, across all three framework packages, reported by the user against a Storybook screenshot.
  - Source: Buttons page, node `475:7210` — `get_design_context` on 2026-07-16 against `Type=Secondary`/`Type=Outline` at every documented State (Default/Hover/Active/Disabled), Size=md: node `538:62` (Secondary Default), `538:302` (Hover), `538:1262` (Active), `538:842` (Disabled), and `806:5997`/`806:5993`/`806:5989`/`806:5980` (the same four states for Outline). This directly confirms and closes an item already flagged as an unresolved Figma-to-code difference earlier in this same `[Unreleased]` section ("The core `Button` component-set... now has a 6th type, 'Outline'... Secondary's Active/Pressed fill may have changed to a solid `primary.800` background with white text").
  - Previous: `secondary` rendered `bg-transparent` at rest, only filling (`brand.subtle`) on hover, and used the lighter `brand.border` token for its rest-state border; its `active` state used `brand.subtle-pressed` (a light fill, same text color as rest). `outline` did not exist as a `Button` variant at all (only `AIButton` and `SplitButton` had one).
  - Current: `secondary` and `outline` share identical border (`brand.border-strong`) and text (`brand.default`) colors at every state — Figma's *only* difference between them is fill: `secondary` is filled (`brand.subtle`) at rest and hover; `outline` is transparent at rest and only fills (`brand.subtle`) on hover. Both now share an identical `active` state: a solid dark fill with white text and no border, via a new `brand.solid-active` semantic token (`primary.800`, `#4C0018` — confirmed identical on both variants' Active instances, resolving the changelog's own earlier speculation about this exactly). `outline`'s hover border is bound to the same Figma variable as its hover fill (`--button/surface/secondary/surface`) — reproduced literally (`hover:border-[var(--color-brand-subtle)]`, matching its own `hover:bg-*`) even though it reads as a likely Figma authoring artifact, since the visual result (an invisible border blending into the fill) is unambiguous either way. `status` (success/warning/error) was not re-verified against `outline` in this pass — Figma's own State matrix only confirmed Success/Error/Warning instances for Primary and Secondary — so `outline` doesn't get the status-colored-border compound variant `secondary` has; flagged as a known limitation, not silently extended.
  - Affects: `packages/tokens/src/semantic/color.json` (new `brand.solid-active`), `packages/ui/src/primitives/Button.tsx`, `Button.stories.tsx`, `Button.test.tsx`, `packages/web-components/src/button/lumen-button.ts`, `lumen-button.test.ts`, `packages/web-components/README.md`, `packages/angular/src/button/lumen-button.ts`, `lumen-button.test.ts`, `packages/angular/README.md`, `docs/component-specifications.md` §5
  - Migration: none — `secondary`'s corrected appearance is a visual fix, not an API change; `outline` is a new, additive variant value in all three packages
  - Validation: `eslint .` passed repo-wide; `tsc --noEmit` passed for `@lumen/ui`, `@lumen/web-components`, `@lumen/angular`; `pnpm --filter @lumen/tokens build` passed with `--color-brand-solid-active` confirmed in the generated CSS (`#4C0018` light / `#720024` dark); 203 tests passed across the workspace (90 `@lumen/ui`, up from 86 — 4 new Button regression/Outline tests; 56 `@lumen/web-components`, up from 55; 54 `@lumen/angular`, up from 53; 3 `@lumen/patterns` unaffected); production Storybook build passed
  - Changeset: `.changeset/button-secondary-outline-fix.md` (`@lumen/tokens` minor, `@lumen/ui` minor, `@lumen/web-components` minor, `@lumen/angular` minor)

- Replaced `AIButton`'s default leading icon with the Figma-approved `lm-aisymbol` glyph, across all three framework packages.
  - Source: Buttons page, node `760:1965` ("AI Communication Component Library") — `get_design_context` on 2026-07-15 showed the Secondary Icon Only AI sub-section's icon instances (nodes `843:7818`–`843:7824`, all four sizes) explicitly swapped to a component named `lm-aisymbol`, not the generic sparkle glyph the 2026-07-14 `AIButton` sync had approximated.
  - Previous: `packages/ui/src/primitives/AIButton.tsx` defaulted to the generated `SparklesIcon` (a Lucide-style 4-point sparkle); `@lumen/web-components`'s `<lumen-ai-button>` and `@lumen/angular`'s `LumenAIButtonComponent` each hardcoded an inline stroke-drawn diamond/sparkle path as their default icon slot — three different, Figma-inaccurate glyphs across the three packages.
  - Current: all three default to the same `lm-aisymbol` glyph (a two-sparkle mark, fill-based `currentColor` path). React imports the existing generated `LmAisymbolIcon` (already present in `packages/ui/src/icons/generated`, previously unused by `AIButton`); Web Components and Angular inline the equivalent `<path fill="currentColor" d="…">`, matching React's SVG exactly since neither package has an icon-import pipeline. Capability-specific icon overrides (e.g. the wand icon for "Rewrite", languages icon for "Translate" in the Capability Catalog story) are unchanged — only the *default* AI-symbol glyph was in scope.
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

| Token | Value |
|---|---:|
| `Spacing/0` | 0 |
| `Spacing/2` | 2px |
| `Spacing/4` | 4px |
| `Spacing/6` | 6px |
| `Spacing/8` | 8px |
| `Spacing/10` | 10px |
| `Spacing/12` | 12px |
| `Spacing/16` | 16px |
| `Spacing/20` | 20px |
| `Spacing/24` | 24px |
| `Spacing/28` | 28px |
| `Spacing/32` | 32px |
| `Spacing/40` | 40px |
| `Spacing/48` | 48px |
| `Spacing/56` | 56px |
| `Spacing/64` | 64px |
| `Spacing/80` | 80px |
| `Spacing/96` | 96px |
| `Spacing/128` | 128px |

#### Radius tokens

Added the following documented radius tokens:

| Token | Value |
|---|---:|
| `Radius/None` | 0px |
| `Radius/Xs` | 2px |
| `Radius/Sm` | 4px |
| `Radius/Md` | 6px |
| `Radius/Lg` | 8px |
| `Radius/Xl` | 12px |
| `Radius/2xl` | 16px |
| `Radius/3xl` | 24px |
| `Radius/Full` | Pill / 9999px |

#### Typography tokens

Added the documented heading scale:

| Token | Font size | Line height |
|---|---:|---:|
| `Typography/Heading/H1` | 60px | 72px |
| `Typography/Heading/H2` | 50px | 60px |
| `Typography/Heading/H3` | 40px | 50px |
| `Typography/Heading/H4` | 32px | 42px |
| `Typography/Heading/H5` | 24px | 32px |
| `Typography/Heading/H6` | 20px | 28px |

Added the documented body scale:

| Token | Font size | Line height |
|---|---:|---:|
| `Typography/Body/Lg` | 20px | 32px |
| `Typography/Body/Md` | 16px | 26px |
| `Typography/Body/Sm` | 14px | 22px |
| `Typography/Body/Xs` | 12px | 20px |

Added the documented label scale:

| Token | Font size | Line height |
|---|---:|---:|
| `Typography/Label/Lg` | 14px | 20px |
| `Typography/Label/Md` | 12px | 18px |
| `Typography/Label/Sm` | 11px | 16px |

Added the documented utility scale:

| Token | Font size | Line height |
|---|---:|---:|
| `Typography/Utility/Overline` | 11px | 16px |
| `Typography/Utility/Caption` | 11px | 18px |

Added the documented code scale:

| Token | Font size | Line height |
|---|---:|---:|
| `Typography/Code/Md` | 14px | 22px |
| `Typography/Code/Sm` | 12px | 20px |

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
