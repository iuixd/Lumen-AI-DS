# @lumen/web-components

## 1.0.0

### Major Changes

- 546c643: Replace the legacy standard Button collections with the final Figma collection from node `1027:3733`. React, Web Components, Angular, and Storybook now share six variants (`primary`, `accent`, `secondary`, `outline`, `ghost`, and `destructive`) and exact light/dark Default, Hover, Focused, and Disabled tokens, including the corrected mode-specific Hover surfaces, foregrounds, and borders for all six variants. Remove the former `raised`/`tertiary`/`link` variants and standard Button status, pill, icon-only, and loading APIs; migrate `tertiary` usage to `ghost` and navigation to the semantic `TextLink` component. The standard `sm`, `md`, `lg`, and `xl` Button sizes remain available.
- 81405a7: Replace the pre-release AI Button library with the canonical “One AI button,
  every capability” collection from Figma node `760:1965`.

  React now ships Primary, Secondary, Ghost, Outline, Destructive, icon-only,
  loading, and Primary/Secondary/Outline split-button treatments on the exact
  30/34/38/42px scale, plus the exact 24-action Figma capability catalog.
  Web Components and Angular match the canonical core visual contract. The old
  Raised, Tertiary, Link, status, `xs`, and behavioral-only `destructive` APIs
  are removed. Storybook replaces the legacy MDX library with the canonical
  fullscreen reference composition.

- 4d0b90c: Remove the Link variant from the standard Button collection and remove its component-only color and typography tokens. Use the standalone TextLink component or a semantic anchor for navigation. The separate AIButton Link variant remains available.

### Minor Changes

- dd0a692: Synchronize AppShell with all six canonical Figma breakpoint/theme compositions (desktop, tablet, and mobile in light and dark). Adds AppShell semantic colors, exact typography and dimension tokens, 768px/1024px breakpoints, responsive header/footer/navigation/assistant slots, exact AI/audit icons, and six Storybook parity stories. Also adds `AIPanel` and a theme-aware Button `accent` variant (mirrored to Web Components/Angular). **Breaking:** `AppShell`'s `nav` prop changed from `NavItem[]` to `NavSection[]`; migrate `nav={items}` to `nav={[{ items }]}`.
- ec3a164: Bring `@lumen/web-components` and `@lumen/angular` to parity with `ThemeToggle`, `KPICard`, and `Footer` (sourced from Lumen-AI-Design-System node 1197:1652). Adds `<lumen-theme-toggle>`/`LumenThemeToggleComponent`, `<lumen-kpi-card>`/`LumenKPICardComponent`, and `<lumen-footer>`/`LumenFooterComponent`. All additive, no existing public API changed.
- 8928664: Fix `Button`'s `secondary` variant (it rendered transparent at rest instead of Figma's filled `brand.subtle` background, and used the lighter `brand.border` token instead of `brand.border-strong`) and add the previously-missing `outline` variant, across React, Web Components, and Angular. Both variants share identical border/text colors and an identical solid-fill `active` state via a new `brand.solid-active` token (`@lumen/tokens`); the only difference between them is rest/hover fill. `status` (success/warning/error) is not yet re-verified for `outline`.
- 81405a7: Add the Figma-sourced `sm`, `md`, `lg`, and `xl` size scale to the standard
  Button across all framework packages, with `md` preserving the existing
  default height and correcting its inline padding from 14px to 16px.
- e8908a8: Bring both packages to parity with `@lumen/ui`'s "AI ButtonGroup Component Library" sync: add `<lumen-segmented-control>`/`<lumen-segmented-control-option>` (`LumenSegmentedControlComponent`/`LumenSegmentedControlOptionComponent` in Angular), and add `tone`/`icon` to `<lumen-choice-chip>` (`LumenChoiceChipComponent`). Same design source and known limitations as the corresponding `@lumen/ui` components — see `docs/changelog.md`.
- ce57dbc: Bring both packages to parity with `@lumen/ui`'s 2026-07-14 Figma sync: add `status` to Button, and add `SplitButton`, `FilterChip`, `ChoiceChip`, and `AIButton`. Same design source and known limitations as the corresponding `@lumen/ui` components — see `docs/changelog.md`.

### Patch Changes

- 790a6ae: Correct the complete AppShell light/dark token contract and responsive Storybook compositions, scope shared Input colors to the exact AppShell modes and restore the header's search anatomy, add a theme-aware 50%-opacity left-navigation hover surface while preserving the full selected surface, compose the header search and AI-panel message row from the standard Input and Button primitives, and replace the approximate Theme Toggle with the exact Figma two-cell design across React, Web Components, and Angular.
- 976022c: Correct `Button`/`AIButton`/`SplitButton` corner radius (6px → 8px, `--radius/segment`) and `SegmentedControl`'s per-size padding/type (previously all sizes reused `md`'s values). Visual fixes only — no prop, event, or slot API changed.
- 4d0b90c: Correct the standard Button's Secondary and Outline treatments to match the published Figma component. Dark Secondary hover uses a `#A8939F` background, `#17101A` foreground, and the unchanged `#3D3039` border. Dark Outline uses `#E599B1` for its default/focus/hover border, `#F9E6EC` for its hover background, and `#980030` for its hover foreground. Preserve Ghost's existing `#2D1A26` hover surface through its own component primitive.
- 5d6264d: Publish the new theme-aware brand and disabled-button tokens, and bind the
  Button, AIButton, and SplitButton families to the exact disabled background,
  border, and text roles in light and dark themes.
- Updated dependencies [26bb58f]
- Updated dependencies [d79e9d7]
- Updated dependencies [fdb360a]
- Updated dependencies [dd0a692]
- Updated dependencies [583d33b]
- Updated dependencies [790a6ae]
- Updated dependencies [35728f5]
- Updated dependencies [ad36e17]
- Updated dependencies [8928664]
- Updated dependencies [81405a7]
- Updated dependencies [5b696e5]
- Updated dependencies [74b24b2]
- Updated dependencies [ccdf54d]
- Updated dependencies [4d0b90c]
- Updated dependencies [546c643]
- Updated dependencies [26bb58f]
- Updated dependencies [67a0dac]
- Updated dependencies [81405a7]
- Updated dependencies [ad36e17]
- Updated dependencies [4d0b90c]
- Updated dependencies [ec824cc]
- Updated dependencies [e8908a8]
- Updated dependencies [5b696e5]
- Updated dependencies [5d6264d]
  - @lumen/tokens@1.0.0
