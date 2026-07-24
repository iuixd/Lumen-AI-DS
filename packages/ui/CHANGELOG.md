# @lumen/ui

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
- ad36e17: **Breaking:** `Button`, `Card`, `Tabs`, `Tooltip`, `Select`, `Avatar`, `Input`, `Switch`, `Checkbox`, `Pagination`, and `ButtonGroup` are now the shadcn-sourced implementations (promoted from `ShadcnButton`, `ShadcnCard`, etc.) — Lumen's original hand-built components of the same names have been removed. See `docs/shadcn-integration.md` §7.8 for the full rationale and per-component migration notes. Key API changes: `Button` has no `accent`/`ai` variant or `iconStart`/`iconEnd` props (pass icons as children); `Input` has no `size`/`variant="search"`/leading-icon/shortcut-badge; `Avatar` has no `name`/`tone`/`size` (compose `AvatarFallback` directly); `Switch` has no `label` (compose a separate `Label`); `Card`'s root has no padding (wrap content in the new `CardContent`); `Tabs`' sub-parts are renamed (`TabList`→`TabsList`, `Tab`→`TabsTrigger`, `TabPanel`→`TabsContent`); `Pagination` is now a set of composable parts (`PaginationContent`/`PaginationItem`/`PaginationPrevious`/`PaginationNext`) instead of a single `page`/`pageCount`/`onPageChange` component.

### Minor Changes

- e8908a8: Add `tone` and `icon` props to `ChoiceChip`, reproducing the Figma "AI ButtonGroup Component Library" Toggle Group pattern (node 969:5151) by reusing the existing component rather than adding a new one. Add a `SplitButton` "AI" Storybook composition resolving the previously-deferred "Split Button AI" gap — no new component or variant, reuses existing `variant="primary"` tokens and the `ai-capabilities` catalog.
- d79e9d7: Add the Figma-sourced dropdown menu to every React AIButton split variant, including keyboard navigation, option-selection callbacks, automatic width, and an eight-row overflow viewport with an interaction-only compact scrollbar.
- dd0a692: Synchronize AppShell with all six canonical Figma breakpoint/theme compositions (desktop, tablet, and mobile in light and dark). Adds AppShell semantic colors, exact typography and dimension tokens, 768px/1024px breakpoints, responsive header/footer/navigation/assistant slots, exact AI/audit icons, and six Storybook parity stories. Also adds `AIPanel` and a theme-aware Button `accent` variant (mirrored to Web Components/Angular). **Breaking:** `AppShell`'s `nav` prop changed from `NavItem[]` to `NavSection[]`; migrate `nav={items}` to `nav={[{ items }]}`.
- 583d33b: Add `ThemeToggle`, `KPICard`, `PageHeader`, and `Footer`, and extend `Avatar` (`tone`) and `AppShell` (`variant`/`footer`), reconciling the Figma "appshell-desktop-closed-light" reference screen (node 1197:1652). Adds `border.subtle`, `text.secondary`, `background.nav-active`, and `shadow.elevation.sm` tokens — all alias existing primitives, no new hex values. `DashboardPage` now composes `PageHeader`/`KPICard` and gains optional `breadcrumbs`/`description`/`actions` props. All changes are additive; no existing public API changed behavior. Web Components/Angular parity for the new primitives is deferred to a follow-up PR.
- 35728f5: Add the Figma-sourced Badge color, pill-radius, and typography tokens; synchronize
  the React Badge statuses, sm/md/lg sizes, optional status dot, theme mappings,
  tests, and Storybook variant collection. The existing `tone` prop remains as a
  compatibility alias for `status`.
- 8928664: Fix `Button`'s `secondary` variant (it rendered transparent at rest instead of Figma's filled `brand.subtle` background, and used the lighter `brand.border` token instead of `brand.border-strong`) and add the previously-missing `outline` variant, across React, Web Components, and Angular. Both variants share identical border/text colors and an identical solid-fill `active` state via a new `brand.solid-active` token (`@lumen/tokens`); the only difference between them is rest/hover fill. `status` (success/warning/error) is not yet re-verified for `outline`.
- 81405a7: Add the Figma-sourced `sm`, `md`, `lg`, and `xl` size scale to the standard
  Button across all framework packages, with `md` preserving the existing
  default height and correcting its inline padding from 14px to 16px.
- 5b696e5: Add `status` ("success" | "warning" | "error") to `Button`, sourced from the Buttons page's component-set (Lumen-AI-Design-System, node 475:7210), whose State property now includes Success/Error/Warning instances. Adds semantic tokens `status.{success,warning,error}-text`/`-border` (surfaces reuse the existing `-subtle` tokens); dark-mode values follow the same ramp-mirroring rule already used for `status.success`/`-subtle`.
- 5b696e5: Add `FilterChip` and `ChoiceChip`, two new Selection primitives sourced from the Buttons page (Lumen-AI-Design-System, nodes 581:409 and 581:485). Both are toggleable pills (`selected`/`disabled` props, `aria-pressed`/`aria-disabled`, `lg` size only). No new tokens required.
- 67a0dac: Add Figma-sourced Input-family component tokens and sync React Input, Radio,
  and Checkbox sizes, interaction states, theme aliases, tests, the shared
  `CheckIcon` checked-state glyph with exact bold Figma dimensions/stroke, the
  exact indeterminate asset, and Storybook variant collections. The main Input's
  dark default and search surfaces now use the exact canonical AppShell dark
  background, border, placeholder, and search-icon roles.
- e8908a8: Add `SegmentedControl`/`SegmentedControlOption`, a new single-choice primitive sourced from the Figma "AI ButtonGroup Component Library" section (node 958:5058). Adds new `segment.*` semantic color tokens aliasing existing primitives — no new primitive colors.
- fe74b12: Add a shadcn-sourced `Accordion` component (`Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`), following the same shadcn-as-source-generator integration layer `Command` established. Adds `@radix-ui/react-accordion` as a new runtime dependency. Colors, radius, and typography resolve through the existing `shadcn-lumen-bridge.css` token bridge; the trigger's chevron uses Lumen's own icon set instead of `lucide-react`. Expand/collapse is instant for now — Lumen has no motion/duration tokens yet to back shadcn's default keyframe animation.
- fe74b12: Add shadcn-sourced `Alert`, `Separator`, `Skeleton`, `Progress`, `AspectRatio`, and `Kbd` components — batch 1 of the bulk shadcn adoption effort (see `docs/shadcn-integration.md` §7). All follow the established internal/public split and resolve through the existing token bridge. Adds `@radix-ui/react-separator`, `@radix-ui/react-progress`, and `@radix-ui/react-aspect-ratio` as new runtime dependencies. Fixes a real upstream accessibility bug in shadcn's `Progress` template where `value` was never forwarded to Radix, so `aria-valuenow` was never set.
- fe74b12: Add shadcn-sourced `Popover`, `DropdownMenu`, `Sheet`, `ScrollArea`, `HoverCard`, and `Slider` components — batch 2 of the bulk shadcn adoption effort (see `docs/shadcn-integration.md` §7). All follow the established internal/public split and resolve through the existing token bridge. Adds `@radix-ui/react-popover`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-hover-card`, `@radix-ui/react-scroll-area`, and `@radix-ui/react-slider` as new runtime dependencies. Fixes a real upstream bug in shadcn's `Slider` template where a range slider only rendered a single draggable thumb regardless of how many values it was given.
- fe74b12: Add shadcn-sourced `Textarea`, `Toggle`, `InputOTP`, `ContextMenu`, `Breadcrumb`, `Drawer`, `Carousel`, and `Item` components — batch 3 of the bulk shadcn adoption effort (see `docs/shadcn-integration.md` §7). All follow the established internal/public split and resolve through the existing token bridge. Adds `@radix-ui/react-toggle`, `@radix-ui/react-context-menu`, `@radix-ui/react-slot`, `input-otp`, `embla-carousel-react`, and `vaul` as new runtime dependencies — the latter two are this repo's first non-Radix behavioral dependencies.

  **Breaking (narrow):** the `Breadcrumb` type previously exported from `@lumen/ui` (used only for `PageHeader`'s `breadcrumbs` prop) is renamed to `PageHeaderBreadcrumb`. `Breadcrumb` now refers to the new full component.

- fe74b12: Add shadcn-sourced `Collapsible`, `Label`, `ToggleGroup`, `NavigationMenu`, and `ShadcnForm` (a `Shadcn`-prefixed family: `ShadcnForm`/`ShadcnFormField`/`ShadcnFormItem`/`ShadcnFormLabel`/`ShadcnFormControl`/`ShadcnFormDescription`/`ShadcnFormMessage`/`useShadcnFormField`) — batch 4 of the bulk shadcn adoption effort, covering components that overlap with existing Lumen components (see `docs/shadcn-integration.md` §7). Adds `@radix-ui/react-collapsible`, `@radix-ui/react-toggle-group`, `@radix-ui/react-navigation-menu`, `@radix-ui/react-label`, `react-hook-form`, `@hookform/resolvers`, and `zod` as new runtime dependencies — the latter three are this repo's first form-state-management dependencies. `ShadcnForm`'s entire public family is `Shadcn`-prefixed (not just the one symbol that collides with Lumen's existing `FormField`) to keep the two systems visually distinct; field visuals still come from Lumen's own `Input`/`Button`.
- fe74b12: Add shadcn-sourced `ShadcnButton`, `ShadcnCard`, `ShadcnTabs`, `ShadcnTooltip`, `ShadcnSelect`, `ShadcnAvatar`, `ShadcnInput`, `ShadcnSwitch`, `ShadcnCheckbox`, `ShadcnPagination`, `ShadcnButtonGroup`, `Dialog`, `RadioGroup`, and `Table` — batch 5 of the bulk shadcn adoption effort, covering every name-colliding duplicate (see `docs/shadcn-integration.md` §7). Adds `@radix-ui/react-tabs`, `@radix-ui/react-tooltip`, `@radix-ui/react-select`, `@radix-ui/react-avatar`, `@radix-ui/react-switch`, `@radix-ui/react-checkbox`, and `@radix-ui/react-radio-group` as new runtime dependencies. All follow the established internal/public split and resolve through the existing token bridge; the 11 `Shadcn`-prefixed components exist alongside their same-named Lumen equivalents without replacing them, while `Dialog`/`RadioGroup`/`Table` keep their own plain names since Lumen's equivalents (`Modal`/`Radio`/`DataTable`) are named differently.
- ad36e17: Add shadcn-sourced `Calendar` and `Chart` — batch 6, the final batch of the bulk shadcn adoption effort (see `docs/shadcn-integration.md` §7.7). Adds `react-day-picker`, `date-fns`, and `recharts@2.15.4` as new runtime dependencies — this repo's first date-handling and charting libraries. `Chart` ships with `chartCategoricalColors`, a 6-step categorical palette validated against the `dataviz` skill's colorblind-safety and contrast checks for both light and dark chart surfaces, meant to be assigned to `ChartConfig` entries via the `theme` field in fixed index order. Both components follow the established internal/public split and resolve through the existing token bridge; neither collides with an existing Lumen export, so both keep their own plain shadcn names.
- 76246fc: Add a shadcn-sourced `Command` component (`Command`, `CommandDialog`, `CommandInput`, `CommandList`, `CommandGroup`, `CommandItem`, `CommandEmpty`, `CommandSeparator`, `CommandShortcut`), the first component built through the new shadcn-as-source-generator integration layer documented in `docs/shadcn-integration.md`. Adds `cmdk` and `@radix-ui/react-dialog` as new runtime dependencies. All colors, radius, and elevation resolve through the new `shadcn-lumen-bridge.css` token bridge onto existing Lumen semantic tokens — no shadcn default theme values are included, and dark mode follows Lumen's existing `data-theme` mechanism.
- ad36e17: Dropped the `Shadcn` prefix from six of the seven `ShadcnForm` family symbols: `Form`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage`, and `useFormField` are now plain names. `ShadcnFormField` keeps its prefix, since it's the one symbol that genuinely collides with Lumen's existing hand-built `FormField` composite (still used by `AuthForm.tsx` and not being retired — the two serve different needs). See `docs/shadcn-integration.md` §7.8 for the full rationale.
- 5b696e5: Add `size` ("sm" | "md" | "lg") and an `outline` variant to `SplitButton`, plus an optional leading `iconStart`, sourced from the Buttons page's Split Button component set (Lumen-AI-Design-System, node 555:300), which now specs 3 sizes and a 4th Outline type. Adds a `brand.border-strong` semantic token for Outline's resting border. `size` defaults to `lg`, preserving prior behavior.

### Patch Changes

- fdb360a: Correct `ChoiceChip`'s `tone="subtle"` box model (height, gap, padding,
  border, and icon size) to match its Figma source. The new `--spacing-38`
  token backs the fix.
- ad36e17: `AppShell`'s bespoke icon buttons (Notifications bell, mobile hamburger toggle, mobile "New project" FAB, desktop NavigationRail's Expand button) now use the shared `Button` component, and the tablet breadcrumb's "Workspace"/"Projects" links now use `TextLink`, instead of hand-rolled `<button>`/`<a>` markup. Visual appearance is unchanged (same AppShell-specific tokens via `className` overrides) except each now gets a proper `focus-visible` ring, which none of them had before. `AppShell`'s public props are unchanged. The Sidebar's nav-list items and Collapse button, and the mobile back-link/bottom tab bar, were deliberately left as-is — they're structural nav-list/navigation affordances, not generic button/link candidates.
- ad36e17: Removed `AppShell`'s local CSS-variable re-scoping of `--color-button-primary-*`/`--color-button-secondary-*`/`--color-button-accent-*`, which silently shadowed `Button`'s global colors for anything rendered inside `AppShell` with a separate, stale copy that had drifted out of sync with the Figma-token fixes made earlier. `Button` instances inside `AppShell` (Share/Export/New project, etc.) now always read the same global tokens as `Button`'s own reference styling — no more risk of the two silently diverging again. No props changed on either component.
- 790a6ae: Correct the complete AppShell light/dark token contract and responsive Storybook compositions, scope shared Input colors to the exact AppShell modes and restore the header's search anatomy, add a theme-aware 50%-opacity left-navigation hover surface while preserving the full selected surface, compose the header search and AI-panel message row from the standard Input and Button primitives, and replace the approximate Theme Toggle with the exact Figma two-cell design across React, Web Components, and Angular.
- ad36e17: Synced the (now-canonical, shadcn-sourced) `Button` component's colors to the canonical Figma Button component-set (node `1174:1349`), in both light and dark mode — Figma resolves dark mode via variable modes on the same node rather than a separate variant instance. Adds six new alpha-tinted primitives (`primary.500-a10`/`a16`/`a24`/`a60`, `primary.300-a24`/`a40`) and fixes `button.secondary-*`/`button.outline-hover-*`/`button.ghost-hover-bg` semantic tokens (light and dark), which had drifted from Figma's current values — `Secondary` is now a translucent brand-tinted fill rather than a solid neutral one, in both themes. `Button`'s hover, disabled, and focus-ring states — previously bound to generic shadcn bridge tokens and partially non-functional (`hover:bg-primary` was a no-op) — now bind directly to the correct `--color-button-*` tokens. No prop or variant-name changes. See `docs/shadcn-integration.md` §7.8 and the corresponding `docs/changelog.md` entries for full detail.
- 976022c: Correct `Button`/`AIButton`/`SplitButton` corner radius (6px → 8px, `--radius/segment`) and `SegmentedControl`'s per-size padding/type (previously all sizes reused `md`'s values). Visual fixes only — no prop, event, or slot API changed.
- 74b24b2: Render Checkbox state icons directly from the exact Figma SVG exports and bind
  their size-specific placement offsets.
- ccdf54d: Replace Checkbox checked and indeterminate glyphs with the exact size-specific
  Figma exports and correct the indeterminate outer-bound tokens.
- 4d0b90c: Correct the standard Button's Secondary and Outline treatments to match the published Figma component. Dark Secondary hover uses a `#A8939F` background, `#17101A` foreground, and the unchanged `#3D3039` border. Dark Outline uses `#E599B1` for its default/focus/hover border, `#F9E6EC` for its hover background, and `#980030` for its hover foreground. Preserve Ghost's existing `#2D1A26` hover surface through its own component primitive.
- 26bb58f: Add `--spacing-14`/`--spacing-18` tokens, sourced from the Buttons page's new Left/Right icon-position instances (Lumen-AI-Design-System, node 475:7210). These size the icon in `Button`'s existing `iconStart`/`iconEnd` slots — no new `Button` variant was needed, since those props already reproduce the icon-position instances' box model. Storybook gained `WithIcons`/`WithIconsBySize` stories on `Primitives/Button` covering all five variants (Primary, Raised, Secondary, Tertiary, Link).
- ad36e17: `PageHeader`'s breadcrumb links now render through the shared `TextLink` component instead of a raw `<a>` (still colored via the distinct `--color-app-shell-text-link` role). Also fixed a one-step dark-mode color drift: `app-shell.text-link` (dark) now matches `TextLink`'s own `text.link` token exactly (`primary.300`/`#D8668A`, previously `primary.200`). Light mode was already correct. No prop changes.
- d79e9d7: Fix Split Button segment corner rendering by applying the Figma-confirmed
  8px exposed-corner radius directly to the Main and Dropdown interactive
  sublayers of `AIButton split`. This affects Primary, Secondary, and Outline
  Split Button AI compositions without changing props, tokens, or behavior.
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
