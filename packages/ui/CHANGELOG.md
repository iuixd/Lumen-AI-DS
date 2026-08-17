# @lumen/ui

## 1.0.1

### Patch Changes

- 775a13e: Replace `FileUploadDropzone`'s separately assembled header illustration with the supplied default and animated hover SVG exports. Hovering the upload zone now crossfades the fixed-size header artwork to the self-animated SVG and reverses the transition on pointer exit, without changing the component API or layout. The upload zone now uses a native label/file-input relationship, fixing the missing form label and nested interactive-control accessibility violations while preserving click, keyboard, and drag-and-drop behavior.

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
- 959f2f2: Added the "AI Empty Communication States" treatment (Figma node 1416:3638) as a new `variant="ai"` on the existing `EmptyState` composite, rather than a new component — a branded card (solid border, circular icon badge, serif heading, up to two centered actions) for AI/chat surfaces with no conversation yet. The existing dashed-border `default` variant is unchanged. Added two new typography tokens (`ai-empty-state-title`, `ai-empty-state-body`) and two new generic semantic color roles (`icon.primary-bg`, `icon.primary`).
- 80ac790: Add `CodeBlock` (a real Prism-powered syntax-highlighted code display) and `AIResponseCard`
  (a structured AI-response composite: title, summary, table, code, expandable additional
  sections, and follow-up actions), sourced from Figma node `1484:2905`.

  `AIResponseCard` is the first real implementation of what `docs/component-architecture.md` §8
  had only described aspirationally as `AIResponse`. `CodeBlock` is a new reusable primitive
  built on `prism-react-renderer` (new dependency), usable anywhere in the design system, not
  just inside `AIResponseCard`.

  New tokens: `code.{bg,syntax-keyword,syntax-string}` primitives and generic
  `color.text.{primary,heading}` semantic roles. No breaking changes — both components are
  additive.

- d79e9d7: Add the Figma-sourced dropdown menu to every React AIButton split variant, including keyboard navigation, option-selection callbacks, automatic width, and an eight-row overflow viewport with an interaction-only compact scrollbar.
- ce5bbd6: Resynced `AIPanel` to the canonical Figma AIPanel component (node 1079:3141) after a live Figma update, superseding part of the previous sync against a separate documentation frame. Bubble corners now use a new `radius.chat-bubble` (18px) token with a fully-square "sharp" corner; the assistant bubble gained a bot-avatar icon; `AIPanelFollowUp` gained a `variant?: "outline" | "link"` field and now renders full-width/stacked inside the bubble (no more separate labeled section); the send button is now a one-off black/34px/`radius.lg` treatment matching Figma, using the exact `ArrowUpwardFilledIcon`. Also synced Button's shared `link` variant to real evidenced color (`primary.500`) for the first time, fixing it everywhere `Button variant="link"` is used. No breaking changes — all new fields are optional and additive.
- ce5bbd6: Reconciled `AIPanel`'s conversation-bubble anatomy against the "AI Conversation Components" Figma frame (node 1412:3030): corrected the user bubble's sharp-corner position and background, gave the assistant bubble its own background/text-color role and removed its border, and unified bubble padding/typography. Extended `AIPanelMessage` with three new optional, additive fields modeled on that same frame: `timestamp` (a conversation date/time divider), `responseActions` (thumbs up/down, copy, a branch label, an edited flag), and `followUps` (a "Suggested follow-ups" row of pill-shaped secondary buttons). Adds a new `chat.input-bg` primitive, a new `app-shell.chat-response-bg` semantic role, and three new typography tiers (`chat-message`, `chat-caption`, `chat-label`). No breaking changes — existing `AIPanel` consumers pick up the corrected visuals automatically.
- 8fb9ef2: Made `AppShell`'s desktop `assistant` (AIPanel) panel drag-resizable, using the existing `ResizablePanelGroup`/`ResizablePanel`/`ResizableHandle` components — a plain divider (no grip icon), both columns filling the full viewport height, and the drag-to-narrow floor pinned to `AIPanel`'s real minimum usable width (260px, measured, not guessed). `AIPanel`'s root width changed from a hardcoded 304px to fluid (`w-full`) so it can track its container. Below the desktop breakpoint (1024px), rendering falls back to the previous fixed-width, non-resizable layout — fully backward compatible, no public API change.
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
- ec4663e: Rewrite `Checkbox` (`@lumen/ui`) to match the canonical Figma Checkbox collection (node `1278:2207`): new `size` (`sm`/`md`/`lg`, default `md`) prop and full state coverage (Default/Hover/Focused/Checked/Disabled/Error/Indeterminate), correcting a real regression from Lumen's own retired original Checkbox primitive. New/corrected tokens in `@lumen/tokens`: `input.radio-checkbox-disabled-fill` (new), `-disabled-border` (corrected), `checkbox-selected-border-width` (new). Also fixes a repo-wide Tailwind configuration gap where `aria-invalid:*` classes (used by both `Input` and `Checkbox` for their error states) silently compiled to nothing, since `invalid` was missing from the shared shadcn preset's `theme.aria` list.
- 32a2a76: Rewrite `CodeBlock` (`@lumen/ui`) on Shiki (dual `github-light`/`github-dark-default` themes), replacing the `prism-react-renderer`-based implementation whose single dark-tuned Figma-evidenced color scheme was illegible against a light surface. Adapted from the `@shadcn-space` community registry's `code-block-01`, scoped to just its single-file `CodeBlock` export (`MultiFileCodeBlock`/`LanguageTabsCodeBlock`/`InstallCommand` were not adopted). New optional props: `filename`, `showLineNumbers`, `scrollable`, `maxHeight`, `highlightLines`, `bodyClassName`. Chrome (header bar, borders, copy button) resolves through the existing shadcn bridge onto real Lumen tokens; the copy-success checkmark and highlighted-line colors use `--color-status-success`/`--color-status-warning-subtle`/`--color-status-warning-border` instead of the source's hardcoded Tailwind/OKLCH literals. `prism-react-renderer` is dropped as a dependency in favor of `shiki`.

  Also removes this repo's custom styling of Storybook's own auto-generated "Show code" / MDX source-block panels (font, border-radius, copy-button theming, and the "VS Code Light+"/"Tokyo Night" `.token.*` color palette in `packages/storybook/.storybook/tailwind.css`). That palette only ever covered a handful of Prism token types, leaving everything else (JSX tags, attribute names, punctuation) on Storybook's own theme — incoherent once an attempted background fix made the panel theme-reactive instead of permanently dark. Reverted to Storybook's stock, internally-consistent default code-block theme at direct user request rather than continuing to extend the palette token-by-token.

- c5abe37: Add `ContentState`, a new composite covering the empty, loading, and error states a
  content region shows instead of its content, synchronized from Figma node `1174:1355`.

  Tokens: new `background.app` and `text.tertiary` semantic roles, a `content-state-title`
  typography tier (Source Serif Pro 24/32 Regular), a `content-state.json` component-token
  group for the loading skeleton's geometry, and a new `motion.json` — Lumen's first motion
  tokens, closing a gap `docs/design-tokens.md` §6 and `docs/accessibility.md` §3.6 have
  listed as required since before either file had a source. The token build now also emits
  the `lumen-skeleton-pulse` keyframes and its `prefers-reduced-motion` fallback.

  `EmptyState` is unchanged and remains correct for the inline (in-card, in-table) case;
  `ContentState` is the full-region treatment. Dark-mode values are provisional ramp
  mirrors — this Figma set publishes Light only.

- cbe4ce9: Add the full data-extraction onboarding flow: login → file upload (click-to-browse, drag-and-drop
  onto the card, or drop anywhere on the page) → grouped per-file upload progress → Create Project,
  each step animating into the next.

  New `@lumen/ui` composites: `FileUploadDropzone` (idle-state upload card) and
  `FileUploadProgressList` (accordion-grouped, per-file progress, reusing the existing `Accordion`).
  `Toast` gained a `variant: "solid"` option (Figma-evidenced — a filled, tone-colored card instead
  of the default light card with a left-border accent) and a `celebration` tone, used by this flow's
  "Files uploaded!" confirmation.

  New `@lumen/patterns` pattern: `DataExtractionOnboardingPage`, composing `EnterpriseLoginPage`
  with the two new composites into one functional, click-through journey. `EnterpriseLoginPage`
  itself was reconciled against a newly-found real Figma source for its login screen (previously
  provisional, sourced only from a Claude Design prototype): headline/heading fonts corrected to
  Source Serif Pro throughout, the email-submit button's colors corrected from a crimson outline to
  neutral input-border colors, the passkey button's icon corrected from a fingerprint to a key, and
  the Google/Okta SSO buttons now use their real brand-mark glyphs — plus a new `onComplete`
  callback fired when its internal state machine reaches "Signed in".

  New tokens: `radius.xxxl` (18px, the upload card's corner) and a new `gradient.json` file
  (`gradient.upload-header`, the crimson-to-coral header banner), both Figma-sourced. See
  `docs/changelog.md` for the full node references, the token/asset provenance, and what was
  deliberately simplified (no page-level drag mask inside the reusable dropzone card itself;
  `Accordion`'s pre-existing instant expand/collapse left as-is).

- 3a73114: Redesign `DataExtractionOnboardingPage`'s interaction and motion design to match a reorganized
  Figma section 100% (fileKey `GJBYRm6ySR7XIECFcHMgy2`, node `1565:3096` and its 5 child state
  frames), at direct, highly-detailed user instruction. Visual design (color/type/spacing/copy) is
  unchanged except where it was already wrong against Figma; only interaction/motion and structure
  were redesigned.

  **Breaking `@lumen/ui` changes**: `FileUploadProgressList`'s `groups: FileUploadGroupData[]` prop
  is now `files: FileUploadFile[]` — the grouped/accordion-by-category layout (Documents/Images/
  Other) never matched Figma, which shows one flat, ungrouped list in every state; `FileUploadGroupData`
  is removed entirely. `onRemoveFile` is now `(fileId: string) => void`, not `(groupId, fileId)`.

  **Breaking `@lumen/patterns` change**: `DataExtractionOnboardingPageProps.categorizeFile` is
  removed — there's nothing left to categorize into.

  New in `FileUploadProgressList`: computed per-state heading/subheading (uploading / all-uploaded
  with a live file count / creating-project), a success checkmark, Figma-accurate disabled-row
  dimming while a project is being created (also disabling each row's remove control, a new
  "disable siblings during a primary async action" pattern for this codebase), row mount stagger-in,
  a completion highlight on each file finishing upload, primary-action button press/activation
  feedback and a real icon crossfade (plus/spinner) instead of an instant swap, and — flagged as
  having no Figma source, built from the user's spec only — 8 error/recovery states (unsupported
  type, size limit, duplicate, corrupted, password-protected, network, cancelled, validation) with
  retry, plus a partial-success banner and project-creation-failure recovery with an inline
  `role="alert"` and "Try again".

  `Toast` gained real mount/unmount animation (previously an instant array push/filter) and an
  optional `position` prop (`"bottom-right"` default, `"bottom-center"` — this flow's Figma
  position).

  Bug fix: removing an uploaded file in `DataExtractionOnboardingPage` now asks for confirmation
  first (via `@lumen/ui`'s existing `Modal` + `Button`), and confirming removal of the last
  remaining file returns the flow to the upload step instead of leaving an empty progress card
  stranded with no way forward.

  Bug fix: `FileUploadDropzone`'s full-page "drop anywhere" drag mask now stays visible for the
  whole drag, including while the cursor is directly over the dropzone card — a `stopPropagation()`
  asymmetry between its drag-enter and drag-leave handlers previously broke the page-level
  enter/leave counter the instant the cursor entered the card, hiding the mask right when it should
  have stayed up.

  Two direct user-reported visual tweaks: the progress/uploaded card is now vertically centered on
  the page (was top-aligned, unlike the upload step's own card) and the file-row filename text is
  13px (was 11px, the shared `app-caption` tier's size — bumped locally, not by changing the token).

  The "Remove file?" confirmation now runs on `@lumen/ui`'s Radix-backed `Dialog` instead of the
  lightweight `Modal` (Modal's own docblock flags exactly this swap for when strict focus-trapping
  is needed), at direct user request that background content be unscrollable and non-interactive
  while the dialog is open — Radix's default `modal` behavior provides real scroll-lock and focus
  trapping for free. `Dialog`'s overlay (`DialogOverlay`, `@lumen/ui`'s existing overlay component)
  is now `bg-black/40 backdrop-blur-sm` (was `bg-black/80`, no blur) — also picked up by
  `CommandDialog`, `Dialog`'s only other consumer.

  Bug fix: clicking "Create Project" now reliably shows the "Creating your project" screen. An
  `onProjectCreated` that resolves near-instantly (or is omitted, e.g. while wiring this pattern up
  before a real backend exists) previously let the loading phase settle within the same microtask
  flush as the click, before the browser ever painted it — visibly nothing happened. A 600ms minimum
  duration (via `Promise.all`) now guarantees the loading screen is actually visible, without adding
  delay beyond the real `onProjectCreated` duration when it's slower than that floor. The flow also
  now stays on "Creating your project" after `onProjectCreated` resolves, rather than reverting to
  the pre-click state — this pattern has no next screen to move to (`onProjectCreated` is the
  integration point; the parent app navigates away), so reverting read as the click having silently
  failed.

  Pixel-fidelity fixes to `FileUploadProgressList`, verified via `get_variable_defs` against Figma
  (not inferred from a screenshot): the footer buttons ("Cancel"/"Create Project") now match Figma's
  real 34px height, 14px horizontal padding, and 14px/22px/weight-500 label (`size="sm"` previously
  gave 32px/12px/11px, none Figma-evidenced); file-row filenames are 14px active / 12px while dimmed
  during project creation (both weight 500 — new `body-sm-medium`/`body-xs-medium` `@lumen/tokens`
  typography tiers, replacing an earlier flat 13px guess); file-row status text ("100kb · Uploaded")
  is 12px/20px (the existing `body-xs` tier, was the unrelated 11px `app-caption` tier); and a
  previously-missing 1px separator now sits between the file list and the footer actions, with the
  surrounding gaps corrected to Figma's 32px/16px.

  Added a coordinated hover animation to `FileUploadDropzone`'s header-graphic icon cluster, at
  direct user request (no Figma source for the animation itself): hovering the "Click to upload"
  zone lifts the upload arrow 6px immediately, then 50ms later the two file icons lift 6px and gain
  a subtle rotation (right-side image file clockwise, left-side PDF file anti-clockwise), all
  reversing on mouse-leave. The upload arrow's tray/bracket shape stays fixed — the user separated
  it from the arrow glyph as two distinct Figma layers mid-session (fileKey
  `GJBYRm6ySR7XIECFcHMgy2`, node `1565:3098`'s `Arrow`/`Vector` children), re-synced as two new
  committed SVG assets (replacing the old single combined one) so each half is independently
  transformable. Nudged the tray 1px down afterward to close a hairline rendering gap against the
  header's gradient background.

  The two file icons' hover animation now also pulls them toward each other horizontally and eases
  their rotation back toward level, rather than tilting them further: the image icon (right) pushes
  6px further right and rotates 10deg counterclockwise on hover, the PDF icon (left) pushes 6px
  further left and rotates 10deg clockwise — layered on top of the existing 6px lift, over a slower,
  eased `--duration-moderate` transition so the rotation actually reads, so the two cards converge
  and overlap more on hover. Rest position/rotation are unchanged from the original Figma-sourced
  values (an earlier attempt applied the push to the rest state instead of hover, in the opposite
  horizontal direction, and at a rotation delta too small to notice; all corrected per direct user
  follow-up).

  `Toast`'s `solid` variant (the "Files uploaded!" celebration toast) now matches its Figma source
  (node `1519:6185`) pixel-for-pixel instead of reusing the `card` variant's box model re-colored:
  `px-24 py-12` (was `px-32 py-24`), a single flex row with `gap-32` between the icon+title group
  and the inline close button (was an absolutely-positioned close button with compensating right
  padding), `gap-8` between icon and title (was `gap-16`), a 24px icon (was the shared 28px
  `--toast-icon-size` token — scoped locally, `card` still uses the shared token correctly), and
  14px/26px/weight-600 title text (was 16px/26px/weight-700). Its accent color now resolves through
  the real semantic token Figma names (`--color-background-toaster-systeminfo-bg`) instead of the
  primitive it happened to alias, making it theme-reactive. `card` variant is untouched — it has its
  own, already-correct Figma source.

  Follow-up: `solid`'s width now hugs its content (`w-fit`, capped at the existing `--toast-width`
  as a ceiling) instead of stretching to that same 450px as a fixed size — Figma's own node is
  `w-full` inside a "hug contents" frame, not a fixed pixel width; that fixed width genuinely
  belongs to `card`'s own, differently-sized Figma frame.

  See `docs/changelog.md` for the full node references, every flagged judgment call (checkmark-draw
  simplified to a scale pop-in, no 150ms duration token so `--duration-fast` is reused, etc.), and
  validation results.

- 5b696e5: Add `FilterChip` and `ChoiceChip`, two new Selection primitives sourced from the Buttons page (Lumen-AI-Design-System, nodes 581:409 and 581:485). Both are toggleable pills (`selected`/`disabled` props, `aria-pressed`/`aria-disabled`, `lg` size only). No new tokens required.
- 0282217: Add `IconButton`, a new compact icon-only primitive, and correct `AIButton`'s label typography,
  both from a re-audit of Figma node `1034:4459`.

  `IconButton` reuses `Button`'s live variant vocabulary and `--color-button-*` tokens
  (`default`/`destructive`/`outline`/`secondary`/`ghost`/`link`) and `AIButton`'s size scale
  (`sm`/`md`/`lg`/`xl` = 30/34/38/42px). An accessible name (`aria-label`/`aria-labelledby`) is
  required, matching `AIButton`'s existing dev-time warning convention.

  `AIButton`'s `standard-button-{sm,md,lg,xl}` typography is corrected to match Figma exactly:
  weight 600 (was 500), letter-spacing 0 (was a positive per-size value), and exact line-heights
  (was unset). `lg` is now 18px/28px, identical to `xl` — Figma has no independent `Button/Large`
  type variable. No breaking changes; both changes are additive/visual-only.

- ce5bbd6: Added 5 missing icons to the generated icon set (`lm-ai`, `lm-project-filled`, `lm-grammer`, `lm-loader`, `lm-bot-static`), reconciling the current Figma file's icon reference sheets against what had actually been generated (most existing icons were sourced from an older, unrelated library). Fixed a real bug found in `lm-loader`'s source: its SVG `<mask>` relied on a literal `fill="white"` for luminance, which the icon pipeline's color-flattening regex would have broken by rewriting it to `currentColor` — rewritten as an equivalent `<clipPath>` instead, which isn't sensitive to fill color. `lm-bot-animated` (needs a new `motion/react` dependency and has no real Figma keyframe data yet) and two raster-only brand logos (Tableau, UiPath) were not added — see `docs/roadmap.md` Phase 16.
- 67a0dac: Add Figma-sourced Input-family component tokens and sync React Input, Radio,
  and Checkbox sizes, interaction states, theme aliases, tests, the shared
  `CheckIcon` checked-state glyph with exact bold Figma dimensions/stroke, the
  exact indeterminate asset, and Storybook variant collections. The main Input's
  dark default and search surfaces now use the exact canonical AppShell dark
  background, border, placeholder, and search-icon roles.
- a1d6c36: Rewrite `Input` (`@lumen/ui`) to match the canonical Figma Input collection (node `1262:1181`): new `size` (`sm`/`md`/`lg`, default `md`, replacing the native HTML `size` attribute) and `variant` (`primary`/`search`) props, correct per-size/per-state border widths and colors, and a corrected 10px radius (new `--radius-input` token in `@lumen/tokens`). `AuthForm`, `CrudListPage`, `EnterpriseLoginPage`, `AIPanel`, and `InputGroup` (`@lumen/patterns`/`@lumen/ui`) updated to pass `size="sm"` where needed to preserve their existing verified layouts against the new default.
- f193318: Added `lm-bot-animated`, an animated bot avatar icon (antenna wiggle, eye-blink, and a built-in loading-dot animation via embedded CSS `@keyframes`), to the generated icon set as `LmBotAnimatedIcon`. Added `AIPanelMessage.avatarIcon`, a new optional per-message override for the bot avatar, so a consumer can show a different icon (e.g. this animated one during a "thinking" state) for one specific message without affecting any other — fully backward compatible, existing usage is unaffected. Also fixed the icon-generation pipeline (`icons-import.mjs`) to correctly handle SVGs with embedded `<style>`/animation blocks, which previously had never been exercised and failed to compile.
- 08e3cea: Add `LumenLogo`, a new reusable primitive: the actual Lumen brand mark (Figma node `1174:1354`,
  "Header"), replacing a placeholder — a plain crimson square with a literal "L" character — used
  in the Storybook header mockup and as `SideNav`'s example custom logo.

  The real mark is a detailed multi-gradient SVG, committed as a static asset
  (`packages/ui/src/assets/lumen-logo.svg`) and rendered via `<img>`, the same treatment already
  used for `ThemeToggle`'s and Checkbox's committed icon assets. `AppShell`'s and `SideNav`'s
  Storybook demos now pass it through `workspace.logo`, reusing the same asset in both the header
  mockup and the nav column, per direct request.

- d14a3b7: Added `Modal`, a thin composite over `Dialog` matching Figma's canonical "Modal" component, replacing an unrelated retired composite of the same name. Corrected `Dialog`'s default chrome to match Figma exactly: radius 8px→14px, a specific drop shadow (new `shadow.modal.default` token) instead of a generic shadow, a dark purple-tinted overlay (new `modal.overlay` token) instead of plain black, bound title/description typography (new `body-lg-w600` typography tier) instead of generic shadcn defaults, and a footer separator matching Figma's "Actions" frame. `DataExtractionOnboardingPage`'s "Remove file?" confirmation — Figma's own example content for this component — was migrated to the new `Modal` composite. Also fixes a missing explicit font-family (`font-interface`) on `Dialog`'s title/description, and adds a dedicated `modal.title-text` token for a dark-mode color that diverged from the generic token it briefly reused.
- 02e4a70: Corrected Button's `neutral` variant and added a new `neutral-solid` variant, plus two new `IconButton` variants, per a fresh Figma audit (node `1565:3797`, canonical Button set `1174:1349`; node `1565:3815`, a dedicated icon-only reference frame). `neutral`'s hover state was a real bug — it lightened (`neutral.50`) instead of Figma's real solid dark fill (`lumen-gray.800`) with text flipping to white; both fixed. A second, previously undocumented Figma style, `Style=Neutral Solid` (permanent dark fill, hovers to pure black), had no code equivalent anywhere — added as `neutral-solid` to React `Button`, and to Web Components' and Angular's `lumen-button` (neither has a plain `neutral`/outline-style variant at all, a deliberate, documented asymmetry — only the explicitly-requested `neutral-solid` was added there). `IconButton` gained `neutral-outline` and `neutral-solid`, matching Figma's icon-only "Outline"/"Solid" types exactly and reusing the same Button tokens. New tokens' dark values have no Figma dark evidence and mirror light exactly, by direct user decision, since these are inherently dark-styled treatments regardless of app theme.
- e8908a8: Add `SegmentedControl`/`SegmentedControlOption`, a new single-choice primitive sourced from the Figma "AI ButtonGroup Component Library" section (node 958:5058). Adds new `segment.*` semantic color tokens aliasing existing primitives — no new primitive colors.
- fe74b12: Add a shadcn-sourced `Accordion` component (`Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`), following the same shadcn-as-source-generator integration layer `Command` established. Adds `@radix-ui/react-accordion` as a new runtime dependency. Colors, radius, and typography resolve through the existing `shadcn-lumen-bridge.css` token bridge; the trigger's chevron uses Lumen's own icon set instead of `lucide-react`. Expand/collapse is instant for now — Lumen has no motion/duration tokens yet to back shadcn's default keyframe animation.
- fe74b12: Add shadcn-sourced `Alert`, `Separator`, `Skeleton`, `Progress`, `AspectRatio`, and `Kbd` components — batch 1 of the bulk shadcn adoption effort (see `docs/shadcn-integration.md` §7). All follow the established internal/public split and resolve through the existing token bridge. Adds `@radix-ui/react-separator`, `@radix-ui/react-progress`, and `@radix-ui/react-aspect-ratio` as new runtime dependencies. Fixes a real upstream accessibility bug in shadcn's `Progress` template where `value` was never forwarded to Radix, so `aria-valuenow` was never set.
- fe74b12: Add shadcn-sourced `Popover`, `DropdownMenu`, `Sheet`, `ScrollArea`, `HoverCard`, and `Slider` components — batch 2 of the bulk shadcn adoption effort (see `docs/shadcn-integration.md` §7). All follow the established internal/public split and resolve through the existing token bridge. Adds `@radix-ui/react-popover`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-hover-card`, `@radix-ui/react-scroll-area`, and `@radix-ui/react-slider` as new runtime dependencies. Fixes a real upstream bug in shadcn's `Slider` template where a range slider only rendered a single draggable thumb regardless of how many values it was given.
- fe74b12: Add shadcn-sourced `Textarea`, `Toggle`, `InputOTP`, `ContextMenu`, `Breadcrumb`, `Drawer`, `Carousel`, and `Item` components — batch 3 of the bulk shadcn adoption effort (see `docs/shadcn-integration.md` §7). All follow the established internal/public split and resolve through the existing token bridge. Adds `@radix-ui/react-toggle`, `@radix-ui/react-context-menu`, `@radix-ui/react-slot`, `input-otp`, `embla-carousel-react`, and `vaul` as new runtime dependencies — the latter two are this repo's first non-Radix behavioral dependencies.

  **Breaking (narrow):** the `Breadcrumb` type previously exported from `@lumen/ui` (used only for `PageHeader`'s `breadcrumbs` prop) is renamed to `PageHeaderBreadcrumb`. `Breadcrumb` now refers to the new full component.

- fe74b12: Add shadcn-sourced `Collapsible`, `Label`, `ToggleGroup`, `NavigationMenu`, and `ShadcnForm` (a `Shadcn`-prefixed family: `ShadcnForm`/`ShadcnFormField`/`ShadcnFormItem`/`ShadcnFormLabel`/`ShadcnFormControl`/`ShadcnFormDescription`/`ShadcnFormMessage`/`useShadcnFormField`) — batch 4 of the bulk shadcn adoption effort, covering components that overlap with existing Lumen components (see `docs/shadcn-integration.md` §7). Adds `@radix-ui/react-collapsible`, `@radix-ui/react-toggle-group`, `@radix-ui/react-navigation-menu`, `@radix-ui/react-label`, `react-hook-form`, `@hookform/resolvers`, and `zod` as new runtime dependencies — the latter three are this repo's first form-state-management dependencies. `ShadcnForm`'s entire public family is `Shadcn`-prefixed (not just the one symbol that collides with Lumen's existing `FormField`) to keep the two systems visually distinct; field visuals still come from Lumen's own `Input`/`Button`.
- fe74b12: Add shadcn-sourced `ShadcnButton`, `ShadcnCard`, `ShadcnTabs`, `ShadcnTooltip`, `ShadcnSelect`, `ShadcnAvatar`, `ShadcnInput`, `ShadcnSwitch`, `ShadcnCheckbox`, `ShadcnPagination`, `ShadcnButtonGroup`, `Dialog`, `RadioGroup`, and `Table` — batch 5 of the bulk shadcn adoption effort, covering every name-colliding duplicate (see `docs/shadcn-integration.md` §7). Adds `@radix-ui/react-tabs`, `@radix-ui/react-tooltip`, `@radix-ui/react-select`, `@radix-ui/react-avatar`, `@radix-ui/react-switch`, `@radix-ui/react-checkbox`, and `@radix-ui/react-radio-group` as new runtime dependencies. All follow the established internal/public split and resolve through the existing token bridge; the 11 `Shadcn`-prefixed components exist alongside their same-named Lumen equivalents without replacing them, while `Dialog`/`RadioGroup`/`Table` keep their own plain names since Lumen's equivalents (`Modal`/`Radio`/`DataTable`) are named differently.
- ad36e17: Add shadcn-sourced `Calendar` and `Chart` — batch 6, the final batch of the bulk shadcn adoption effort (see `docs/shadcn-integration.md` §7.7). Adds `react-day-picker`, `date-fns`, and `recharts@2.15.4` as new runtime dependencies — this repo's first date-handling and charting libraries. `Chart` ships with `chartCategoricalColors`, a 6-step categorical palette validated against the `dataviz` skill's colorblind-safety and contrast checks for both light and dark chart surfaces, meant to be assigned to `ChartConfig` entries via the `theme` field in fixed index order. Both components follow the established internal/public split and resolve through the existing token bridge; neither collides with an existing Lumen export, so both keep their own plain shadcn names.
- af63e39: Add shadcn-sourced `Menubar`, `ResizablePanelGroup`/`ResizablePanel`/`ResizableHandle`, and `InputGroup` — batch 7 of the bulk shadcn adoption effort (see `docs/shadcn-integration.md` §7.9). Adds `@radix-ui/react-menubar` and `react-resizable-panels` as new runtime dependencies. Caught and fixed two real upstream bugs in `react-resizable-panels@4.12.2` (renamed `PanelGroup`/`Panel`/`PanelResizeHandle` exports and pixel-vs-percent size semantics, both translated at the wrapper boundary so the public API still matches what shadcn documents) and one real `cn()`-merge-order bug in `InputGroupButton`'s type scale. `Empty` and `Field` were requested but skipped as full functional duplicates of Lumen's existing `EmptyState`/`FormField` composites.
- 76246fc: Add a shadcn-sourced `Command` component (`Command`, `CommandDialog`, `CommandInput`, `CommandList`, `CommandGroup`, `CommandItem`, `CommandEmpty`, `CommandSeparator`, `CommandShortcut`), the first component built through the new shadcn-as-source-generator integration layer documented in `docs/shadcn-integration.md`. Adds `cmdk` and `@radix-ui/react-dialog` as new runtime dependencies. All colors, radius, and elevation resolve through the new `shadcn-lumen-bridge.css` token bridge onto existing Lumen semantic tokens — no shadcn default theme values are included, and dark mode follows Lumen's existing `data-theme` mechanism.
- ad36e17: Dropped the `Shadcn` prefix from six of the seven `ShadcnForm` family symbols: `Form`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage`, and `useFormField` are now plain names. `ShadcnFormField` keeps its prefix, since it's the one symbol that genuinely collides with Lumen's existing hand-built `FormField` composite (still used by `AuthForm.tsx` and not being retired — the two serve different needs). See `docs/shadcn-integration.md` §7.8 for the full rationale.
- 08e3cea: Add `SideNav`, a new reusable, independently exported layout component: Lumen's collapsible
  desktop navigation column (Figma node `1498:2877`), with a real animated width transition
  between its expanded (labeled) and collapsed (icon-only rail) states, hover tooltips on
  collapsed items, and WCAG AA-compliant section-label contrast.

  `AppShell` now renders a single `SideNav` instance instead of its previous private
  `Sidebar`/`NavigationRail` pair — two structurally different components hard-swapped via
  the `variant` prop, which is why `onCollapse`/`onExpand` never actually animated anything
  before this. `AppShell`'s public API (`variant`, `onCollapse`, `onExpand`, `workspace`,
  `logo`) is unchanged and now genuinely functional. `NavItem`/`NavSection`/`WorkspaceInfo`
  now live in `SideNav.tsx` but remain re-exported from `AppShell` and the package root, so
  existing imports are unaffected.

  New `@lumen/tokens` spacing step: `--spacing-13`, from this node's own (asymmetric, but
  real and Figma-evidenced) container top padding.

  Also fixes: the public `Button` wrapper (`packages/ui/src/components/button/Button.tsx`)
  now forwards its ref, needed for `TooltipTrigger asChild` to position correctly — a
  pre-existing gap that only surfaced once a consumer (this component's Expand control)
  needed it.

- 5b696e5: Add `size` ("sm" | "md" | "lg") and an `outline` variant to `SplitButton`, plus an optional leading `iconStart`, sourced from the Buttons page's Split Button component set (Lumen-AI-Design-System, node 555:300), which now specs 3 sizes and a 4th Outline type. Adds a `brand.border-strong` semantic token for Outline's resting border. `size` defaults to `lg`, preserving prior behavior.
- 895f5a8: Redesign `Toast` to align with Figma node `1475:5100` — status icon, close button, colored
  left accent, and an animated 6-second countdown progress bar, replacing the previous flat
  title/description card.

  `tone` gains `info` (new); `warning`/`error` reuse existing exact tokens; `success`/`neutral`
  keep their pre-existing, Figma-unevidenced treatment unchanged. New `icon` prop overrides the
  default status icon on any tone.

  Tokens: new `color.toast.{title-text,info-accent}`, `shadow.toast.default`,
  `motion.duration.toast`, and a new `toast.json` component-geometry group (width, icon size,
  close size, progress-bar height, accent-width). The token build now also emits the
  `lumen-toast-progress` keyframes and its `prefers-reduced-motion` fallback, mirroring
  `ContentState`'s `lumen-skeleton-pulse` pattern.

  Auto-dismiss changed from 5000ms to 6000ms; hovering or focusing a toast pauses both the
  timer and the progress bar, resuming from the remaining time rather than resetting. No
  breaking changes — existing `tone` values and their visual treatment are unchanged.

### Patch Changes

- ce5bbd6: Fixed 3 real Figma alignment issues in `AIPanel`'s optional response-actions anatomy (node 1412:3030), reported directly by the user: the bot avatar now uses `LmBotStaticIcon` (confirmed identical to Figma's own asset) instead of a generic icon; the thumbs up/down/copy icons are new dedicated filled icons (`thumbs-up-filled`, `thumbs-down-filled`, `copy-filled`) matching Figma's actual filled style instead of generic stroke-outline icons; and a new `AIPanelMessage.suggestedFollowUps` field reintroduces the labeled "Suggested follow-ups" section (uniform secondary-variant buttons, correct 40px section spacing) that a previous resync had dropped, distinct from the in-bubble `followUps` anatomy. Also flags (not fixed) a recurring discrepancy in the shared `button.secondary-on-action` token worth a deliberate follow-up decision.
- fdb360a: Correct `ChoiceChip`'s `tone="subtle"` box model (height, gap, padding,
  border, and icon size) to match its Figma source. The new `--spacing-38`
  token backs the fix.
- 6e0ceb4: Fixed six further `AIPanel` alignment issues reported by the user against Figma nodes 1412:3030 and 1174:1357 (the AppShell-embedded canonical instance, 1119:3351): rescaled the thumbs-up/down/copy filled icons to fill their box instead of rendering at ~60% size; gave the bot avatar its evidenced `text-body` color instead of an inherited default; corrected the response-actions row padding (px-40) and the suggested-follow-ups section padding (pl-32/pt-16); centered the response-action icon buttons vertically; replaced both bubbles' flat 240px max-width with the canonical instance's real technique (uncapped assistant bubble, 24px-gutter-based user bubble); and gave in-bubble outline/link follow-up buttons their correct, distinct text sizes and border width. Also fixed `AppShell.stories.tsx`'s `AIPanel` usage, which was passing generic placeholder buttons instead of the real `followUps` content. Additionally corrects the shared `button.secondary-on-action` token from `primary.600` to `primary.500` (user-approved, third independent Figma confirmation of this value).
- f193318: Fixed 3 further dark-theme drifts in AIPanel: the "Show sources" link now matches `TextLink`'s own dark color instead of an independently-drifted value; the bot avatar icon now uses a new, correctly-scoped `app-shell.bot-icon` token instead of borrowing `text-body`'s (wrong in dark); and `typography.json` scale entries can now carry a `dark` override, emitted by `build.mjs` as a `[data-theme="dark"]` CSS-variable override alongside colors (added for message-bubble text, though a same-day correction found that specific token's dark/light split wasn't real — see `chat-message-single-size-correction.md` — the override mechanism itself stays, generic and available for a real future case).
- 6e0ceb4: Fixed `AIPanel`'s icon-only send button, which was hardcoded to a solid black background — Figma's canonical instance (node 1119:3351) shows it as a `secondary`-variant icon button. Switched to `variant="secondary"` with local size/radius/border overrides. Also corrected the in-bubble `outline` follow-up pill's height (34px, was incorrectly shared with the `link` pill's 30px). Both fixes apply automatically wherever `AIPanel` is used, including the `AppShell` Storybook story.
- ad36e17: `AppShell`'s bespoke icon buttons (Notifications bell, mobile hamburger toggle, mobile "New project" FAB, desktop NavigationRail's Expand button) now use the shared `Button` component, and the tablet breadcrumb's "Workspace"/"Projects" links now use `TextLink`, instead of hand-rolled `<button>`/`<a>` markup. Visual appearance is unchanged (same AppShell-specific tokens via `className` overrides) except each now gets a proper `focus-visible` ring, which none of them had before. `AppShell`'s public props are unchanged. The Sidebar's nav-list items and Collapse button, and the mobile back-link/bottom tab bar, were deliberately left as-is — they're structural nav-list/navigation affordances, not generic button/link candidates.
- ad36e17: Removed `AppShell`'s local CSS-variable re-scoping of `--color-button-primary-*`/`--color-button-secondary-*`/`--color-button-accent-*`, which silently shadowed `Button`'s global colors for anything rendered inside `AppShell` with a separate, stale copy that had drifted out of sync with the Figma-token fixes made earlier. `Button` instances inside `AppShell` (Share/Export/New project, etc.) now always read the same global tokens as `Button`'s own reference styling — no more risk of the two silently diverging again. No props changed on either component.
- f193318: Fixed the AppShell Header's search input and AIPanel's prompt input to actually use their already-correct color tokens (both previously rendered with the shared `Input` component's generic transparent/gray defaults instead), added the missing search icon and "⌘K" shortcut badge to the search input, and removed `AppShell`'s local re-scoping of `--color-input-*` tokens to app-shell shadow-copies (the same anti-pattern already removed for `--color-button-*`, which was silently neutralizing any Input color fix). Also corrected 6 dark-theme color drifts found via a fresh Figma audit: input border/icon colors, the "Assistant" heading icon's background and color, the assistant chat bubble's background (now a translucent overlay, not a solid fill, matching Figma's actual technique), and the app-shell link color.
- 790a6ae: Correct the complete AppShell light/dark token contract and responsive Storybook compositions, scope shared Input colors to the exact AppShell modes and restore the header's search anatomy, add a theme-aware 50%-opacity left-navigation hover surface while preserving the full selected surface, compose the header search and AI-panel message row from the standard Input and Button primitives, and replace the approximate Theme Toggle with the exact Figma two-cell design across React, Web Components, and Angular.
- 08e3cea: Fix WCAG 2 AA color-contrast violations found in a design-system-wide accessibility audit.

  `Badge`'s `success`/`warning`/`error`/`purple`/`light-blue`/`yellow`/`pink` variants all failed
  4.5:1 contrast at their real rendered sizes (11–14px) — darkened each variant's text (light theme)
  or background (dark theme) to the minimal existing token-ramp step that passes, no new colors
  invented. `AIPanel`'s timestamp caption and "Suggested follow-ups" label (plus two Storybook demo
  captions) switched from `text-tertiary` to `text-secondary` for the same reason — the same
  contrast bug class already fixed on `SideNav`'s section label this session.

  No breaking changes — token values only, no renamed tokens, props, or classes.

- ad36e17: Synced the (now-canonical, shadcn-sourced) `Button` component's colors to the canonical Figma Button component-set (node `1174:1349`), in both light and dark mode — Figma resolves dark mode via variable modes on the same node rather than a separate variant instance. Adds six new alpha-tinted primitives (`primary.500-a10`/`a16`/`a24`/`a60`, `primary.300-a24`/`a40`) and fixes `button.secondary-*`/`button.outline-hover-*`/`button.ghost-hover-bg` semantic tokens (light and dark), which had drifted from Figma's current values — `Secondary` is now a translucent brand-tinted fill rather than a solid neutral one, in both themes. `Button`'s hover, disabled, and focus-ring states — previously bound to generic shadcn bridge tokens and partially non-functional (`hover:bg-primary` was a no-op) — now bind directly to the correct `--color-button-*` tokens. No prop or variant-name changes. See `docs/shadcn-integration.md` §7.8 and the corresponding `docs/changelog.md` entries for full detail.
- d14a3b7: Corrected `Button`'s label font-family — its base classes never paired the typography-scale utility with an explicit `font-interface` class, so labels silently rendered in the browser's system-UI font instead of the bound Instrument Sans webfont (a repo-wide bug found via the same investigation as the `Modal`/`Dialog` Figma sync, not limited to any one variant/size). Also corrects `dark.button.ghost-on-action` to `primary.50` (`#F9E6EC`), a further Figma-side change since its previous `primary.25` fix.
- 80ac790: Correct `Button`'s Ghost variant colors, radius, and Outline border width to match Figma
  exactly, after a full re-audit of the canonical Button collection (node `1174:1349`).

  Ghost's text/hover-background now use `primary.500`/`primary.50` (was a generic gray/dark-neutral
  pairing). Radius is now a dedicated `radius.button` token (10px, was an untokened 6px/documented
  8px). Outline's border is now 1.5px (was 1px). Visual-only — no prop, class, or token name changed.

- 976022c: Correct `Button`/`AIButton`/`SplitButton` corner radius (6px → 8px, `--radius/segment`) and `SegmentedControl`'s per-size padding/type (previously all sizes reused `md`'s values). Visual fixes only — no prop, event, or slot API changed.
- 02e4a70: Corrected `Button`'s base label typography (was a 12px "helper labels" preset, never meant for button text — Figma's real bound value is 14px/22/weight-500) and two `AIPanel` dark-mode colors (`text-primary`, `link-on-action`) against fresh Figma dark-instance data. Renamed the shared `body-sm-medium` typography token to `body-sm-w500` (numeric weight suffix) since `Button` became a second consumer alongside `FileUploadProgressList` — a pure rename, no value change, no consumer-facing prop change.
- 02e4a70: Corrected `Checkbox`'s dark-mode colors against the first real Figma Dark instances for this collection. `radio-checkbox-disabled-fill` (dark) was a `neutral.600` placeholder, now `nightshade.950`/#17101A. Added a new `input.radio-checkbox-hover-bg` token (light `lumen-gray.50`, dark `nightshade.800`) for Figma's Hover-state background fill, which the component previously never implemented in either theme (only the border color changed on hover). All other fields were already correct via the same-day Input/Radio dark-mode fixes this component reuses directly.
- 74b24b2: Render Checkbox state icons directly from the exact Figma SVG exports and bind
  their size-specific placement offsets.
- ccdf54d: Replace Checkbox checked and indeterminate glyphs with the exact size-specific
  Figma exports and correct the indeterminate outer-bound tokens.
- af63e39: Fixed real drift in `Command` found during a shadcn parity audit: it was the very first component adopted in this integration and never picked up the "no lucide-react imports survive adaptation" / typography-token conventions later batches established. `Search` is now Lumen's own generated `SearchIcon`, and `CommandInput`/`CommandEmpty`/`CommandItem`/`CommandGroup`/`CommandShortcut` now use Lumen's `input-md`/`body-sm`/`label-sm` type scale instead of bare `text-sm`/`text-xs`. No props changed; `cmdk`'s underlying keyboard/filtering/selection behavior was already correct.
- 02e4a70: Corrected `ContentState`'s dark-mode colors against the first real Figma Dark instances for all 3 variants. Every color role had been borrowed from a shared generic token (`background.app`, `text.body`, `text.secondary`/`.tertiary`, `border.table`/`.subtle`, `background.raised`/`.nav-active`, `status.error`/`.-subtle`) whose dark value diverged from ContentState's real values — replaced with a new, fully self-contained `content-state.*` token group (11 fields, light+dark). Also fixed two independent light-mode bugs found in the same audit: the skeleton bars' border color never matched Figma's real value, and the Empty-state icon glyph's color was wrong in both themes (it's bound to a distinct Figma variable, not the `text.secondary` role previously assumed).
- 4d0b90c: Correct the standard Button's Secondary and Outline treatments to match the published Figma component. Dark Secondary hover uses a `#A8939F` background, `#17101A` foreground, and the unchanged `#3D3039` border. Dark Outline uses `#E599B1` for its default/focus/hover border, `#F9E6EC` for its hover background, and `#980030` for its hover foreground. Preserve Ghost's existing `#2D1A26` hover surface through its own component primitive.
- a6dde06: Added a full generic Elevation scale (`elevation.1`-`elevation.5`) sourced from a live Figma "Scale / Elevation (Live)" frame — this repo's first real evidence beyond the existing component-scoped shadows. Fixed a real heading font-family bug: `PageHeader`, `CrudListPage`, and `SettingsPage` were rendering heading-scale text in Instrument Sans instead of the Figma-specified Source Serif Pro (`font-editorial`), unlike 4 other heading consumers that already had it right.
- 3b3200c: Sync a large multi-domain Figma token refresh (Lumen-AI-Design-System full Variables export, 2026-08-02):

  - Corrected `status.info`/`status.info-subtle` (now alias the real evidenced `blue` ramp, `#2563EB`, uniform light/dark — the old, stale `blue` family at `#0E17FF` was deleted outright), an over-rounded alpha primitive (`primary.500-a10`→`primary.500-a8`), `radius.xl` (12px→10px), `dark.border.focus` (now `accent.purple`, `#B48EE0`), and `motion.duration.slow` (400ms→300ms, plus new `duration.slower`).
  - Added new primitive families (`lumen-dark`, `nightshade`, `overlay`, `status`, `accent`), extended `blue` to a full ramp, added `radius.xxl`, confirmed 3 of 4 motion easing curves as exact Figma matches, and added 900/950 tail steps plus a systematic ~90-token alpha-tint collection across most existing color ramps (kept as foundational tokens by explicit user confirmation, even though mostly unconsumed).
  - Expanded `semantic/color.json`'s `background`/`text`/`border`/`icon` vocabulary with new roles aliasing existing/new primitives.
  - Added `packages/tokens/src/size.json` (component-scale dimensions); `AppShell`/`SideNav` now consume `--size-header-h`/`--size-nav-expanded`/`--size-nav-collapsed`/`--size-ai-panel-w` instead of bare `--spacing-N` references (internal class change, same rendered value, `@lumen/ui` patch).
  - Added `packages/tokens/src/opacity.json`, a generic 12-step opacity primitive scale (`opacity.0`–`opacity.100`), distinct from `motion.opacity`'s two skeleton-specific keys.
  - Added a responsive-typography mechanism (`tablet`/`mobile` overrides on `typography.json` scale entries, emitted as new `@media` blocks) — applied to `display-lg/md/sm`, `headline-lg/md`, and `standard-button-sm/lg/xl`, the only tiers Figma's Desktop/Tablet/Mobile export actually varies.
  - Added `packages/storybook/src/Foundations.mdx`, the first Storybook page documenting the token scales.
  - **Correction pass**: a live screenshot of Figma's own Variables panel showed several primitive families claimed as Figma-verified in older repo comments are not actually current Figma collections. `sand`, `lemon-green`, `japonica`, `forest`, and `icon-gray` were removed outright — the first four had zero consumers anywhere; `icon-gray`'s two values were exact duplicates of `nightshade.400`/`nightshade.300`, so its consumers (`icon.nav-default`/`icon.nav-hover`, dark theme) were repointed straight at `nightshade` with no visual change. `cobalt`, `deep-purple`, `purple`, and `pink` were initially flagged "PENDING REPLACEMENT" pending confirmation.
  - **Final reconciliation**: a raw `Default.tokens.json` Primitives export (pasted directly, not a screenshot) resolved the four flagged families. `purple`/`deep-purple`/`pink` are confirmed real — exact value matches, plus new `900`/`950` steps for two of them, now added; their flags are removed. `cobalt` is confirmed genuinely absent and, at the user's explicit instruction, was deleted — its 3 semantic consumers (none actually used by any UI component) were repointed to `blue.50`/`blue.800`, finally resolving a previously-flagged near-miss (`background.badge` vs. the export's own `bg.badge` = `Blue/50`). The same export also showed `primary.10` and `neutral.250`/`neutral.850` aren't real (zero consumers, deleted) and evidenced two real new `nightshade` steps (`100`, `500`, added), while `nightshade.350`/`850` remained flagged pending confirmation.
  - **2026-08-03**: a second Primitives export confirmed `nightshade`'s alpha tints are scoped to `500` (not `600` as previously recorded) — renamed `nightshade.600-a8..a80`→`500-a8..a80`, zero consumers. A third export consistently omitted any `-300-`/`-400-` Alpha entries; unlike prior deletions, `primary.300-a20`/`primary.300-a40`/`blue.300-a60` were actively consumed (dark-mode `Button` secondary bg/border, dark `background.info`) — removed at explicit user instruction and repointed to the closest standardized `500-a*` step (`500-a40`/`500-a60` are exact matches; `500-a24` for the 20%-original background is a documented judgment call between two equidistant options, not further-evidenced). Finally, the user confirmed Figma itself had consolidated away `nightshade.350`/`850` and directed remapping their 3 consumers to match — `background.code`→`nightshade.300`, `background.brand-tint`/`border.toaster`→`nightshade.900`. Both steps deleted; no PENDING REPLACEMENT flags remain anywhere in `primitives/color.json`.

  See `docs/changelog.md`'s `[Unreleased]` entry for the full breakdown, including the items deliberately left unresolved (`radius.pill` vs. the generic scale's `999` and the unmapped Figma "Button Large"/"Button Small" typography tiers).

- 36e6009: Fixed `FileUploadDropzone` to match its Figma source (node `1511:2702`) exactly, per direct user report: the upload icon now uses `--color-icon-secondary` instead of `--color-text-secondary` (a distinct token family Figma binds it to); the header's own top corners are now explicitly rounded at `radius/2xl` (16px, node `1511:2703`) instead of relying solely on the outer card's 18px clip; and the root container no longer stretches to fill an oversized parent height and vertically center its content (`size-full` + `justify-center` → `w-full`, no `justify-*`) — a real layout bug that split extra height into visible gaps above the header and below the dropzone whenever the component was given more room than its content needs (as the Storybook Playground's fixed-height wrapper did; also removed there). Also added a subtle on-load fade/rise animation (reusing `DataExtractionOnboardingPage`'s existing `StepTransition` timing/easing), a code-side addition with no Figma source, same as this component's other disclosed motion enhancements.
- 02e4a70: Corrected `IconButton`'s `neutral-outline` dark border — the one field that genuinely diverges from the Button `neutral` token it otherwise reuses. Figma's dedicated icon-only frame binds a different dark value (`#FFFFFF`) than Button's own Neutral Outline style (`#5E5E5E`), a real per-component difference confirmed via direct re-check, not a value to keep inheriting blindly. Added a dedicated `icon-button.neutral-outline-border` token; `Primary`/`Solid` types were re-verified byte-exact and are unaffected.
- 26bb58f: Add `--spacing-14`/`--spacing-18` tokens, sourced from the Buttons page's new Left/Right icon-position instances (Lumen-AI-Design-System, node 475:7210). These size the icon in `Button`'s existing `iconStart`/`iconEnd` slots — no new `Button` variant was needed, since those props already reproduce the icon-position instances' box model. Storybook gained `WithIcons`/`WithIconsBySize` stories on `Primitives/Button` covering all five variants (Primary, Raised, Secondary, Tertiary, Link).
- 02e4a70: Corrected `Input`'s dark-mode colors against the first real Figma Dark instances for this collection (`primary-bg`/`search-bg`, `primary-hover-border`, `primary-error-border`, `search-border` were all unverified guesses that turned out wrong). Also implemented a previously-flagged, never-actioned finding: Error state's typed-value text is SemiBold at a new distinct `input.primary-text` token, plus 2px extra horizontal padding at `sm`/`md` sizes. `primary-border`/`primary-focused-border`/`primary-placeholder-text`/`search-icon`/`search-focused-border` were all re-verified exact.
- f193318: Fixed the shared `Input` component's interaction states system-wide: correct border/placeholder colors (were using generic drifted bridge tokens), a proper Figma-matched Focused treatment (thicker pink border, no ring) replacing the generic focus ring, new Hover and Error states that didn't exist before, and removal of `type="search"` inputs' native browser focus glow and clear button. The Header's `SearchBar` now shows identical hover/focus behavior to `AIPanel`'s prompt input, both matching Figma's Input component exactly (including a same-day border-width correction: Hover/Error are now 2px, Focused stays 2.5px). Also corrected the dark-theme Focused border color (`input.primary/search-focused-border`), which was an unevidenced placeholder value rendering as a saturated red/crimson instead of Figma's actual soft pink (`primary.200`).
- a6dde06: Corrected Button's `neutral` variant (Figma `Style=Neutral Outline`) border color and disabled state. Figma had 3 of 4 states (Disabled, Focused, Hover) misbound to the Secondary variant's border token; now fixed at the source and re-verified live via `get_variable_defs`. `button.neutral-border` (light) corrected from a near-miss value (`lumen-gray.200`) to the confirmed exact match (`neutral.100`). A new `button.neutral-disabled-border` token (light `neutral.100`, dark `neutral.600`) gives Neutral Outline a visible disabled-state border, overriding the shared base treatment that otherwise forces every variant's disabled border transparent.
- ad36e17: `PageHeader`'s breadcrumb links now render through the shared `TextLink` component instead of a raw `<a>` (still colored via the distinct `--color-app-shell-text-link` role). Also fixed a one-step dark-mode color drift: `app-shell.text-link` (dark) now matches `TextLink`'s own `text.link` token exactly (`primary.300`/`#D8668A`, previously `primary.200`). Light mode was already correct. No prop changes.
- ec5e63c: Redesigned `RadioGroup`'s item to structurally match Lumen's own `Radio` primitive, which it had never been wired to at all. It previously used generic shadcn `border-primary`/`text-primary` colors (bridged to Lumen's crimson brand color) at a flat 16px/1px guess with a stroke-icon selected mark; it now reuses `Radio.tsx`'s exact `md`-size ring/dot geometry from `packages/tokens/src/input.json` — same border widths, same `--color-input-radio-checkbox-selected` selected state (border + a plain filled dot, not an icon), same disabled/hover tokens, plus a focus-visible ring it never had before. No props changed, only the rendered appearance.
- d79e9d7: Fix Split Button segment corner rendering by applying the Figma-confirmed
  8px exposed-corner radius directly to the Main and Dropdown interactive
  sublayers of `AIButton split`. This affects Primary, Secondary, and Outline
  Split Button AI compositions without changing props, tokens, or behavior.
- 959f2f2: Moved `AIPanel` and the new "AI Empty Communication State" story into Storybook's "AI Components" sidebar section (alongside the AI Button library), and switched Storybook's sidebar sort to alphabetical within every section. No component API changes — Storybook organization only.
- 5d6264d: Publish the new theme-aware brand and disabled-button tokens, and bind the
  Button, AIButton, and SplitButton families to the exact disabled background,
  border, and text roles in light and dark themes.
- 03adc8d: Rewrote `ThemeToggle` with a transitioning knob — the white knob now smoothly slides between the two cells with the sun/moon icon crossfading on it, instead of instantly jumping. Same public API and DOM query surface; only the transition behavior changed. Respects `prefers-reduced-motion`.
- 02e4a70: Corrected `Toast`'s dark-mode colors and a 2px width transcription error, plus removed a distinct accent color from the `error` tone that Figma never bound to it (relies on the warning-triangle icon shape alone). Five new toast-scoped tokens added (`container-bg`, `body-text`, `icon-default`, `warning-accent`, `success-accent`) since the previously-reused generic tokens didn't match Toast's real dark values — some were wrong in both themes. `title-text` dark corrected to the right primitive family. Info accent and the SystemInfo/`celebration` background were re-verified byte-exact, unchanged. See `packages/tokens/src/semantic/color.json`'s `_toastComment` for the full record.
- 02e4a70: Reverted `Toast`'s `error` tone back to its distinct red accent (`status.error`) after direct user review — a colorless error toast (matching a literal Figma finding of "no bound accent") reads as informational, not a failure, so this deliberately overrides that finding for usability. Added a new `toast.neutral-accent` token (`neutral.300`, exact) for a genuine `Type=Neutral` Figma instance that didn't exist during the earlier dark-mode audit, replacing the generic `border.default` placeholder `neutral` had been using. Also fixed real bugs in the Storybook demo content: `warning`/`error` triggers were both firing `info`'s copy, `success`/`neutral` used generic placeholder text instead of Figma's own example content, and `AllTones` only pushed 3 of its own claimed "all five" tones.
- Updated dependencies [26bb58f]
- Updated dependencies [ce5bbd6]
- Updated dependencies [959f2f2]
- Updated dependencies [80ac790]
- Updated dependencies [d79e9d7]
- Updated dependencies [fdb360a]
- Updated dependencies [6e0ceb4]
- Updated dependencies [ce5bbd6]
- Updated dependencies [ce5bbd6]
- Updated dependencies [f193318]
- Updated dependencies [dd0a692]
- Updated dependencies [f193318]
- Updated dependencies [583d33b]
- Updated dependencies [790a6ae]
- Updated dependencies [08e3cea]
- Updated dependencies [02e4a70]
- Updated dependencies [35728f5]
- Updated dependencies [a6dde06]
- Updated dependencies [02e4a70]
- Updated dependencies [ad36e17]
- Updated dependencies [d14a3b7]
- Updated dependencies [80ac790]
- Updated dependencies [8928664]
- Updated dependencies [81405a7]
- Updated dependencies [5b696e5]
- Updated dependencies [02e4a70]
- Updated dependencies [8fb9ef2]
- Updated dependencies [02e4a70]
- Updated dependencies [74b24b2]
- Updated dependencies [ec4663e]
- Updated dependencies [ccdf54d]
- Updated dependencies [c5abe37]
- Updated dependencies [02e4a70]
- Updated dependencies [4d0b90c]
- Updated dependencies [cbe4ce9]
- Updated dependencies [3a73114]
- Updated dependencies [264f888]
- Updated dependencies [a6dde06]
- Updated dependencies [3b3200c]
- Updated dependencies [546c643]
- Updated dependencies [0282217]
- Updated dependencies [02e4a70]
- Updated dependencies [26bb58f]
- Updated dependencies [02e4a70]
- Updated dependencies [67a0dac]
- Updated dependencies [a1d6c36]
- Updated dependencies [f193318]
- Updated dependencies [d14a3b7]
- Updated dependencies [a6dde06]
- Updated dependencies [02e4a70]
- Updated dependencies [81405a7]
- Updated dependencies [ad36e17]
- Updated dependencies [02e4a70]
- Updated dependencies [02e4a70]
- Updated dependencies [1233ff7]
- Updated dependencies [4d0b90c]
- Updated dependencies [ec824cc]
- Updated dependencies [e8908a8]
- Updated dependencies [08e3cea]
- Updated dependencies [5b696e5]
- Updated dependencies [a6dde06]
- Updated dependencies [5d6264d]
- Updated dependencies [02e4a70]
- Updated dependencies [895f5a8]
- Updated dependencies [02e4a70]
- Updated dependencies [ef339fa]
- Updated dependencies [c978bb3]
  - @lumen/tokens@1.0.0
