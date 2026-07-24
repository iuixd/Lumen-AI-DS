# @lumen/tokens

## 1.0.0

### Major Changes

- 546c643: Replace the legacy standard Button collections with the final Figma collection from node `1027:3733`. React, Web Components, Angular, and Storybook now share six variants (`primary`, `accent`, `secondary`, `outline`, `ghost`, and `destructive`) and exact light/dark Default, Hover, Focused, and Disabled tokens, including the corrected mode-specific Hover surfaces, foregrounds, and borders for all six variants. Remove the former `raised`/`tertiary`/`link` variants and standard Button status, pill, icon-only, and loading APIs; migrate `tertiary` usage to `ghost` and navigation to the semantic `TextLink` component. The standard `sm`, `md`, `lg`, and `xl` Button sizes remain available.
- 4d0b90c: Remove the Link variant from the standard Button collection and remove its component-only color and typography tokens. Use the standalone TextLink component or a semantic anchor for navigation. The separate AIButton Link variant remains available.

### Minor Changes

- 26bb58f: Add `cobalt`, `japonica`, `deep-purple`, and `forest` primitive color ramps (50-800), sourced from a Figma Variables export (Lumen-AI-Design-System, node `426:4396`) that exposed the full color system beyond the previously-documented 14 families. Purely additive — no existing token, alias, or component is affected.
- d79e9d7: Add the Figma-sourced dropdown menu to every React AIButton split variant, including keyboard navigation, option-selection callbacks, automatic width, and an eight-row overflow viewport with an interaction-only compact scrollbar.
- fdb360a: Correct `ChoiceChip`'s `tone="subtle"` box model (height, gap, padding,
  border, and icon size) to match its Figma source. The new `--spacing-38`
  token backs the fix.
- dd0a692: Synchronize AppShell with all six canonical Figma breakpoint/theme compositions (desktop, tablet, and mobile in light and dark). Adds AppShell semantic colors, exact typography and dimension tokens, 768px/1024px breakpoints, responsive header/footer/navigation/assistant slots, exact AI/audit icons, and six Storybook parity stories. Also adds `AIPanel` and a theme-aware Button `accent` variant (mirrored to Web Components/Angular). **Breaking:** `AppShell`'s `nav` prop changed from `NavItem[]` to `NavSection[]`; migrate `nav={items}` to `nav={[{ items }]}`.
- 583d33b: Add `ThemeToggle`, `KPICard`, `PageHeader`, and `Footer`, and extend `Avatar` (`tone`) and `AppShell` (`variant`/`footer`), reconciling the Figma "appshell-desktop-closed-light" reference screen (node 1197:1652). Adds `border.subtle`, `text.secondary`, `background.nav-active`, and `shadow.elevation.sm` tokens — all alias existing primitives, no new hex values. `DashboardPage` now composes `PageHeader`/`KPICard` and gains optional `breadcrumbs`/`description`/`actions` props. All changes are additive; no existing public API changed behavior. Web Components/Angular parity for the new primitives is deferred to a follow-up PR.
- 790a6ae: Correct the complete AppShell light/dark token contract and responsive Storybook compositions, scope shared Input colors to the exact AppShell modes and restore the header's search anatomy, add a theme-aware 50%-opacity left-navigation hover surface while preserving the full selected surface, compose the header search and AI-panel message row from the standard Input and Button primitives, and replace the approximate Theme Toggle with the exact Figma two-cell design across React, Web Components, and Angular.
- 35728f5: Add the Figma-sourced Badge color, pill-radius, and typography tokens; synchronize
  the React Badge statuses, sm/md/lg sizes, optional status dot, theme mappings,
  tests, and Storybook variant collection. The existing `tone` prop remains as a
  compatibility alias for `status`.
- ad36e17: Synced the (now-canonical, shadcn-sourced) `Button` component's colors to the canonical Figma Button component-set (node `1174:1349`), in both light and dark mode — Figma resolves dark mode via variable modes on the same node rather than a separate variant instance. Adds six new alpha-tinted primitives (`primary.500-a10`/`a16`/`a24`/`a60`, `primary.300-a24`/`a40`) and fixes `button.secondary-*`/`button.outline-hover-*`/`button.ghost-hover-bg` semantic tokens (light and dark), which had drifted from Figma's current values — `Secondary` is now a translucent brand-tinted fill rather than a solid neutral one, in both themes. `Button`'s hover, disabled, and focus-ring states — previously bound to generic shadcn bridge tokens and partially non-functional (`hover:bg-primary` was a no-op) — now bind directly to the correct `--color-button-*` tokens. No prop or variant-name changes. See `docs/shadcn-integration.md` §7.8 and the corresponding `docs/changelog.md` entries for full detail.
- 8928664: Fix `Button`'s `secondary` variant (it rendered transparent at rest instead of Figma's filled `brand.subtle` background, and used the lighter `brand.border` token instead of `brand.border-strong`) and add the previously-missing `outline` variant, across React, Web Components, and Angular. Both variants share identical border/text colors and an identical solid-fill `active` state via a new `brand.solid-active` token (`@lumen/tokens`); the only difference between them is rest/hover fill. `status` (success/warning/error) is not yet re-verified for `outline`.
- 81405a7: Add the Figma-sourced `sm`, `md`, `lg`, and `xl` size scale to the standard
  Button across all framework packages, with `md` preserving the existing
  default height and correcting its inline padding from 14px to 16px.
- 5b696e5: Add `status` ("success" | "warning" | "error") to `Button`, sourced from the Buttons page's component-set (Lumen-AI-Design-System, node 475:7210), whose State property now includes Success/Error/Warning instances. Adds semantic tokens `status.{success,warning,error}-text`/`-border` (surfaces reuse the existing `-subtle` tokens); dark-mode values follow the same ramp-mirroring rule already used for `status.success`/`-subtle`.
- 26bb58f: Add `--spacing-14`/`--spacing-18` tokens, sourced from the Buttons page's new Left/Right icon-position instances (Lumen-AI-Design-System, node 475:7210). These size the icon in `Button`'s existing `iconStart`/`iconEnd` slots — no new `Button` variant was needed, since those props already reproduce the icon-position instances' box model. Storybook gained `WithIcons`/`WithIconsBySize` stories on `Primitives/Button` covering all five variants (Primary, Raised, Secondary, Tertiary, Link).
- 67a0dac: Add Figma-sourced Input-family component tokens and sync React Input, Radio,
  and Checkbox sizes, interaction states, theme aliases, tests, the shared
  `CheckIcon` checked-state glyph with exact bold Figma dimensions/stroke, the
  exact indeterminate asset, and Storybook variant collections. The main Input's
  dark default and search surfaces now use the exact canonical AppShell dark
  background, border, placeholder, and search-icon roles.
- 81405a7: Replace the pre-release AI Button library with the canonical “One AI button,
  every capability” collection from Figma node `760:1965`.

  React now ships Primary, Secondary, Ghost, Outline, Destructive, icon-only,
  loading, and Primary/Secondary/Outline split-button treatments on the exact
  30/34/38/42px scale, plus the exact 24-action Figma capability catalog.
  Web Components and Angular match the canonical core visual contract. The old
  Raised, Tertiary, Link, status, `xs`, and behavioral-only `destructive` APIs
  are removed. Storybook replaces the legacy MDX library with the canonical
  fullscreen reference composition.

- e8908a8: Add `SegmentedControl`/`SegmentedControlOption`, a new single-choice primitive sourced from the Figma "AI ButtonGroup Component Library" section (node 958:5058). Adds new `segment.*` semantic color tokens aliasing existing primitives — no new primitive colors.
- 5b696e5: Add `size` ("sm" | "md" | "lg") and an `outline` variant to `SplitButton`, plus an optional leading `iconStart`, sourced from the Buttons page's Split Button component set (Lumen-AI-Design-System, node 555:300), which now specs 3 sizes and a 4th Outline type. Adds a `brand.border-strong` semantic token for Outline's resting border. `size` defaults to `lg`, preserving prior behavior.
- 5d6264d: Publish the new theme-aware brand and disabled-button tokens, and bind the
  Button, AIButton, and SplitButton families to the exact disabled background,
  border, and text roles in light and dark themes.

### Patch Changes

- 74b24b2: Render Checkbox state icons directly from the exact Figma SVG exports and bind
  their size-specific placement offsets.
- ccdf54d: Replace Checkbox checked and indeterminate glyphs with the exact size-specific
  Figma exports and correct the indeterminate outer-bound tokens.
- 4d0b90c: Correct the standard Button's Secondary and Outline treatments to match the published Figma component. Dark Secondary hover uses a `#A8939F` background, `#17101A` foreground, and the unchanged `#3D3039` border. Dark Outline uses `#E599B1` for its default/focus/hover border, `#F9E6EC` for its hover background, and `#980030` for its hover foreground. Preserve Ghost's existing `#2D1A26` hover surface through its own component primitive.
- ad36e17: `PageHeader`'s breadcrumb links now render through the shared `TextLink` component instead of a raw `<a>` (still colored via the distinct `--color-app-shell-text-link` role). Also fixed a one-step dark-mode color drift: `app-shell.text-link` (dark) now matches `TextLink`'s own `text.link` token exactly (`primary.300`/`#D8668A`, previously `primary.200`). Light mode was already correct. No prop changes.
- ec824cc: Rename the product from "Lumen Design System" to "Lumen AI Design System" throughout, matching the canonical Figma source file's own rename (same fileKey and node IDs — only the display name changed). Updates `_comment` citations in token source JSON (and their regenerated `dist/` output); no token values changed.
