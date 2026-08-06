# @lumen/tokens

## 1.0.0

### Major Changes

- 546c643: Replace the legacy standard Button collections with the final Figma collection from node `1027:3733`. React, Web Components, Angular, and Storybook now share six variants (`primary`, `accent`, `secondary`, `outline`, `ghost`, and `destructive`) and exact light/dark Default, Hover, Focused, and Disabled tokens, including the corrected mode-specific Hover surfaces, foregrounds, and borders for all six variants. Remove the former `raised`/`tertiary`/`link` variants and standard Button status, pill, icon-only, and loading APIs; migrate `tertiary` usage to `ghost` and navigation to the semantic `TextLink` component. The standard `sm`, `md`, `lg`, and `xl` Button sizes remain available.
- 4d0b90c: Remove the Link variant from the standard Button collection and remove its component-only color and typography tokens. Use the standalone TextLink component or a semantic anchor for navigation. The separate AIButton Link variant remains available.

### Minor Changes

- 26bb58f: Add the `deep-purple` primitive color ramp (50-950), consumed by Badge/toaster semantic tokens. Originally added alongside `cobalt`, `japonica`, and `forest` under a claim of being sourced from a Figma Variables export; a 2026-08-02 live review of Figma's actual Variables panel found none of the four were confirmed. `japonica`/`forest` had zero consumers and were removed outright (see the `figma-token-refresh-20260802` changeset), and `deep-purple`/`cobalt` were flagged "PENDING REPLACEMENT" pending real values. A subsequent raw `Default.tokens.json` Primitives export resolved both: `deep-purple` is confirmed real (its flag removed, plus two new `900`/`950` steps this export evidenced), while `cobalt` is confirmed absent and was deleted outright at the user's instruction, with its (component-unconsumed) semantic consumers repointed to `blue`.
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
- fdb360a: Correct `ChoiceChip`'s `tone="subtle"` box model (height, gap, padding,
  border, and icon size) to match its Figma source. The new `--spacing-38`
  token backs the fix.
- ce5bbd6: Resynced `AIPanel` to the canonical Figma AIPanel component (node 1079:3141) after a live Figma update, superseding part of the previous sync against a separate documentation frame. Bubble corners now use a new `radius.chat-bubble` (18px) token with a fully-square "sharp" corner; the assistant bubble gained a bot-avatar icon; `AIPanelFollowUp` gained a `variant?: "outline" | "link"` field and now renders full-width/stacked inside the bubble (no more separate labeled section); the send button is now a one-off black/34px/`radius.lg` treatment matching Figma, using the exact `ArrowUpwardFilledIcon`. Also synced Button's shared `link` variant to real evidenced color (`primary.500`) for the first time, fixing it everywhere `Button variant="link"` is used. No breaking changes — all new fields are optional and additive.
- ce5bbd6: Reconciled `AIPanel`'s conversation-bubble anatomy against the "AI Conversation Components" Figma frame (node 1412:3030): corrected the user bubble's sharp-corner position and background, gave the assistant bubble its own background/text-color role and removed its border, and unified bubble padding/typography. Extended `AIPanelMessage` with three new optional, additive fields modeled on that same frame: `timestamp` (a conversation date/time divider), `responseActions` (thumbs up/down, copy, a branch label, an edited flag), and `followUps` (a "Suggested follow-ups" row of pill-shaped secondary buttons). Adds a new `chat.input-bg` primitive, a new `app-shell.chat-response-bg` semantic role, and three new typography tiers (`chat-message`, `chat-caption`, `chat-label`). No breaking changes — existing `AIPanel` consumers pick up the corrected visuals automatically.
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
- ec4663e: Rewrite `Checkbox` (`@lumen/ui`) to match the canonical Figma Checkbox collection (node `1278:2207`): new `size` (`sm`/`md`/`lg`, default `md`) prop and full state coverage (Default/Hover/Focused/Checked/Disabled/Error/Indeterminate), correcting a real regression from Lumen's own retired original Checkbox primitive. New/corrected tokens in `@lumen/tokens`: `input.radio-checkbox-disabled-fill` (new), `-disabled-border` (corrected), `checkbox-selected-border-width` (new). Also fixes a repo-wide Tailwind configuration gap where `aria-invalid:*` classes (used by both `Input` and `Checkbox` for their error states) silently compiled to nothing, since `invalid` was missing from the shared shadcn preset's `theme.aria` list.
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

- 264f888: Add `EnterpriseLoginPage`, a new `@lumen/patterns` pattern: a multi-step enterprise sign-in
  flow — a marketing hero panel (desktop only) beside SSO/passkey/email sign-in, MFA, and a
  "Signed in" confirmation screen, driven by a real internal state machine rather than the
  prototype's simulated network calls.

  Sourced from a Claude Design prototype (`Enterprise Login.dc.html`), not Figma — every token it
  referenced already existed in `@lumen/tokens` except the hero panel's translucent white-on-dark
  overlays, added as a new `auth-hero.*` semantic group (`packages/tokens/src/semantic/color.json`)
  and six new `neutral.white-aXX` alpha primitives, two of which were raised from the prototype's
  literal opacity to clear WCAG contrast against the panel background (`badge-border` for 1.4.11's
  3:1 non-text-UI-boundary threshold, `text-caption` for 1.4.3's 4.5:1 normal-text threshold).

  Distinct from `AuthForm` (a minimal centered card, deliberately kept minimal per its own docs)
  rather than an extension of it — a different shape, not a variant of the same component.

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

- 26bb58f: Add `--spacing-14`/`--spacing-18` tokens, sourced from the Buttons page's new Left/Right icon-position instances (Lumen-AI-Design-System, node 475:7210). These size the icon in `Button`'s existing `iconStart`/`iconEnd` slots — no new `Button` variant was needed, since those props already reproduce the icon-position instances' box model. Storybook gained `WithIcons`/`WithIconsBySize` stories on `Primitives/Button` covering all five variants (Primary, Raised, Secondary, Tertiary, Link).
- 67a0dac: Add Figma-sourced Input-family component tokens and sync React Input, Radio,
  and Checkbox sizes, interaction states, theme aliases, tests, the shared
  `CheckIcon` checked-state glyph with exact bold Figma dimensions/stroke, the
  exact indeterminate asset, and Storybook variant collections. The main Input's
  dark default and search surfaces now use the exact canonical AppShell dark
  background, border, placeholder, and search-icon roles.
- a1d6c36: Rewrite `Input` (`@lumen/ui`) to match the canonical Figma Input collection (node `1262:1181`): new `size` (`sm`/`md`/`lg`, default `md`, replacing the native HTML `size` attribute) and `variant` (`primary`/`search`) props, correct per-size/per-state border widths and colors, and a corrected 10px radius (new `--radius-input` token in `@lumen/tokens`). `AuthForm`, `CrudListPage`, `EnterpriseLoginPage`, `AIPanel`, and `InputGroup` (`@lumen/patterns`/`@lumen/ui`) updated to pass `size="sm"` where needed to preserve their existing verified layouts against the new default.
- d14a3b7: Added `Modal`, a thin composite over `Dialog` matching Figma's canonical "Modal" component, replacing an unrelated retired composite of the same name. Corrected `Dialog`'s default chrome to match Figma exactly: radius 8px→14px, a specific drop shadow (new `shadow.modal.default` token) instead of a generic shadow, a dark purple-tinted overlay (new `modal.overlay` token) instead of plain black, bound title/description typography (new `body-lg-w600` typography tier) instead of generic shadcn defaults, and a footer separator matching Figma's "Actions" frame. `DataExtractionOnboardingPage`'s "Remove file?" confirmation — Figma's own example content for this component — was migrated to the new `Modal` composite. Also fixes a missing explicit font-family (`font-interface`) on `Dialog`'s title/description, and adds a dedicated `modal.title-text` token for a dark-mode color that diverged from the generic token it briefly reused.
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
- 6e0ceb4: Fixed six further `AIPanel` alignment issues reported by the user against Figma nodes 1412:3030 and 1174:1357 (the AppShell-embedded canonical instance, 1119:3351): rescaled the thumbs-up/down/copy filled icons to fill their box instead of rendering at ~60% size; gave the bot avatar its evidenced `text-body` color instead of an inherited default; corrected the response-actions row padding (px-40) and the suggested-follow-ups section padding (pl-32/pt-16); centered the response-action icon buttons vertically; replaced both bubbles' flat 240px max-width with the canonical instance's real technique (uncapped assistant bubble, 24px-gutter-based user bubble); and gave in-bubble outline/link follow-up buttons their correct, distinct text sizes and border width. Also fixed `AppShell.stories.tsx`'s `AIPanel` usage, which was passing generic placeholder buttons instead of the real `followUps` content. Additionally corrects the shared `button.secondary-on-action` token from `primary.600` to `primary.500` (user-approved, third independent Figma confirmation of this value).
- f193318: Fixed 3 further dark-theme drifts in AIPanel: the "Show sources" link now matches `TextLink`'s own dark color instead of an independently-drifted value; the bot avatar icon now uses a new, correctly-scoped `app-shell.bot-icon` token instead of borrowing `text-body`'s (wrong in dark); and `typography.json` scale entries can now carry a `dark` override, emitted by `build.mjs` as a `[data-theme="dark"]` CSS-variable override alongside colors (added for message-bubble text, though a same-day correction found that specific token's dark/light split wasn't real — see `chat-message-single-size-correction.md` — the override mechanism itself stays, generic and available for a real future case).
- f193318: Fixed the AppShell Header's search input and AIPanel's prompt input to actually use their already-correct color tokens (both previously rendered with the shared `Input` component's generic transparent/gray defaults instead), added the missing search icon and "⌘K" shortcut badge to the search input, and removed `AppShell`'s local re-scoping of `--color-input-*` tokens to app-shell shadow-copies (the same anti-pattern already removed for `--color-button-*`, which was silently neutralizing any Input color fix). Also corrected 6 dark-theme color drifts found via a fresh Figma audit: input border/icon colors, the "Assistant" heading icon's background and color, the assistant chat bubble's background (now a translucent overlay, not a solid fill, matching Figma's actual technique), and the app-shell link color.
- 08e3cea: Fix WCAG 2 AA color-contrast violations found in a design-system-wide accessibility audit.

  `Badge`'s `success`/`warning`/`error`/`purple`/`light-blue`/`yellow`/`pink` variants all failed
  4.5:1 contrast at their real rendered sizes (11–14px) — darkened each variant's text (light theme)
  or background (dark theme) to the minimal existing token-ramp step that passes, no new colors
  invented. `AIPanel`'s timestamp caption and "Suggested follow-ups" label (plus two Storybook demo
  captions) switched from `text-tertiary` to `text-secondary` for the same reason — the same
  contrast bug class already fixed on `SideNav`'s section label this session.

  No breaking changes — token values only, no renamed tokens, props, or classes.

- 02e4a70: Corrected 6 of `Badge`'s 10 dark-mode background colors (plus `gray`/`yellow` text colors) against the first real Figma evidence for Badge's dark theme — node `1079:893` published 30 new `Theme=Dark` instances for the first time; every dark value had previously been an unverified ramp-mirror guess. `gray-bg` was aliasing the wrong primitive family entirely; `error`/`purple`/`light-blue`/`yellow`/`pink`-bg each needed a different, family-specific ramp step correction. `default`/`success`/`warning`/`deep-purple` were already exact. See `packages/tokens/src/semantic/color.json`'s `_badgeDarkModeComment` for the full record. All corrected backgrounds moved darker, so WCAG contrast against the paired text only improved.
- a6dde06: Corrected `dark.border.focus` to `deep-purple.300` (`#9E86D0`), matching Figma's live `stroke/focus` binding, which aliases `_base/Accent/Purple` → Deep Purple/300 in dark mode. A raw W3C-format export of Figma's Dark/Light token collections (including explicit variable alias chains) confirmed this binding is real and current — superseding an earlier same-day correction to `primary.200`, which was based on a mistaken claim that no `border/focus`/`stroke/focus` variable existed in the file. `light.border.focus` is unaffected (`primary.500`, already matching Figma's `stroke/focus` light value exactly).
- 02e4a70: Corrected Button's dark-mode colors against the first real Figma evidence for Button's dark theme. `neutral`/`neutral-solid` (added same day by mirroring light, since no dark evidence existed yet) actually invert to a _light_ fill/border/text in dark mode, not a darker one — real data now confirms this. `ghost-on-action` (dark) and the globally-shared `disabled-bg`/`disabled-on-action` (affecting every Button and IconButton variant in every theme) were also wrong and are now Figma-exact. `Primary`/`Secondary`/`Outline`/`Danger` dark values were all re-verified byte-exact, no change. See `packages/tokens/src/semantic/color.json`'s `_neutralButtonComment`/`_buttonComment` for the full field-by-field record.
- d14a3b7: Corrected `Button`'s label font-family — its base classes never paired the typography-scale utility with an explicit `font-interface` class, so labels silently rendered in the browser's system-UI font instead of the bound Instrument Sans webfont (a repo-wide bug found via the same investigation as the `Modal`/`Dialog` Figma sync, not limited to any one variant/size). Also corrects `dark.button.ghost-on-action` to `primary.50` (`#F9E6EC`), a further Figma-side change since its previous `primary.25` fix.
- 80ac790: Correct `Button`'s Ghost variant colors, radius, and Outline border width to match Figma
  exactly, after a full re-audit of the canonical Button collection (node `1174:1349`).

  Ghost's text/hover-background now use `primary.500`/`primary.50` (was a generic gray/dark-neutral
  pairing). Radius is now a dedicated `radius.button` token (10px, was an untokened 6px/documented
  8px). Outline's border is now 1.5px (was 1px). Visual-only — no prop, class, or token name changed.

- 02e4a70: Corrected `Button`'s base label typography (was a 12px "helper labels" preset, never meant for button text — Figma's real bound value is 14px/22/weight-500) and two `AIPanel` dark-mode colors (`text-primary`, `link-on-action`) against fresh Figma dark-instance data. Renamed the shared `body-sm-medium` typography token to `body-sm-w500` (numeric weight suffix) since `Button` became a second consumer alongside `FileUploadProgressList` — a pure rename, no value change, no consumer-facing prop change.
- 8fb9ef2: Corrected `chat-message` (AIPanel bubble text) back to a single fixed size (14px/16px), reverting a same-day light/dark fork that was based on an incorrect light-mode reading. The light value (16/18) had been read from a separate documentation frame instead of the canonical AIPanel instance; re-checked directly against the canonical instance, both light and dark render at 14/16 — there was never a real per-theme difference.
- 02e4a70: Corrected `Checkbox`'s dark-mode colors against the first real Figma Dark instances for this collection. `radio-checkbox-disabled-fill` (dark) was a `neutral.600` placeholder, now `nightshade.950`/#17101A. Added a new `input.radio-checkbox-hover-bg` token (light `lumen-gray.50`, dark `nightshade.800`) for Figma's Hover-state background fill, which the component previously never implemented in either theme (only the border color changed on hover). All other fields were already correct via the same-day Input/Radio dark-mode fixes this component reuses directly.
- 74b24b2: Render Checkbox state icons directly from the exact Figma SVG exports and bind
  their size-specific placement offsets.
- ccdf54d: Replace Checkbox checked and indeterminate glyphs with the exact size-specific
  Figma exports and correct the indeterminate outer-bound tokens.
- 02e4a70: Corrected `ContentState`'s dark-mode colors against the first real Figma Dark instances for all 3 variants. Every color role had been borrowed from a shared generic token (`background.app`, `text.body`, `text.secondary`/`.tertiary`, `border.table`/`.subtle`, `background.raised`/`.nav-active`, `status.error`/`.-subtle`) whose dark value diverged from ContentState's real values — replaced with a new, fully self-contained `content-state.*` token group (11 fields, light+dark). Also fixed two independent light-mode bugs found in the same audit: the skeleton bars' border color never matched Figma's real value, and the Empty-state icon glyph's color was wrong in both themes (it's bound to a distinct Figma variable, not the `text.secondary` role previously assumed).
- 4d0b90c: Correct the standard Button's Secondary and Outline treatments to match the published Figma component. Dark Secondary hover uses a `#A8939F` background, `#17101A` foreground, and the unchanged `#3D3039` border. Dark Outline uses `#E599B1` for its default/focus/hover border, `#F9E6EC` for its hover background, and `#980030` for its hover foreground. Preserve Ghost's existing `#2D1A26` hover surface through its own component primitive.
- 02e4a70: Corrected `IconButton`'s `neutral-outline` dark border — the one field that genuinely diverges from the Button `neutral` token it otherwise reuses. Figma's dedicated icon-only frame binds a different dark value (`#FFFFFF`) than Button's own Neutral Outline style (`#5E5E5E`), a real per-component difference confirmed via direct re-check, not a value to keep inheriting blindly. Added a dedicated `icon-button.neutral-outline-border` token; `Primary`/`Solid` types were re-verified byte-exact and are unaffected.
- 02e4a70: Corrected `Input`'s dark-mode colors against the first real Figma Dark instances for this collection (`primary-bg`/`search-bg`, `primary-hover-border`, `primary-error-border`, `search-border` were all unverified guesses that turned out wrong). Also implemented a previously-flagged, never-actioned finding: Error state's typed-value text is SemiBold at a new distinct `input.primary-text` token, plus 2px extra horizontal padding at `sm`/`md` sizes. `primary-border`/`primary-focused-border`/`primary-placeholder-text`/`search-icon`/`search-focused-border` were all re-verified exact.
- f193318: Fixed the shared `Input` component's interaction states system-wide: correct border/placeholder colors (were using generic drifted bridge tokens), a proper Figma-matched Focused treatment (thicker pink border, no ring) replacing the generic focus ring, new Hover and Error states that didn't exist before, and removal of `type="search"` inputs' native browser focus glow and clear button. The Header's `SearchBar` now shows identical hover/focus behavior to `AIPanel`'s prompt input, both matching Figma's Input component exactly (including a same-day border-width correction: Hover/Error are now 2px, Focused stays 2.5px). Also corrected the dark-theme Focused border color (`input.primary/search-focused-border`), which was an unevidenced placeholder value rendering as a saturated red/crimson instead of Figma's actual soft pink (`primary.200`).
- a6dde06: Corrected Button's `neutral` variant (Figma `Style=Neutral Outline`) border color and disabled state. Figma had 3 of 4 states (Disabled, Focused, Hover) misbound to the Secondary variant's border token; now fixed at the source and re-verified live via `get_variable_defs`. `button.neutral-border` (light) corrected from a near-miss value (`lumen-gray.200`) to the confirmed exact match (`neutral.100`). A new `button.neutral-disabled-border` token (light `neutral.100`, dark `neutral.600`) gives Neutral Outline a visible disabled-state border, overriding the shared base treatment that otherwise forces every variant's disabled border transparent.
- 02e4a70: Corrected Button's `neutral` variant and added a new `neutral-solid` variant, plus two new `IconButton` variants, per a fresh Figma audit (node `1565:3797`, canonical Button set `1174:1349`; node `1565:3815`, a dedicated icon-only reference frame). `neutral`'s hover state was a real bug — it lightened (`neutral.50`) instead of Figma's real solid dark fill (`lumen-gray.800`) with text flipping to white; both fixed. A second, previously undocumented Figma style, `Style=Neutral Solid` (permanent dark fill, hovers to pure black), had no code equivalent anywhere — added as `neutral-solid` to React `Button`, and to Web Components' and Angular's `lumen-button` (neither has a plain `neutral`/outline-style variant at all, a deliberate, documented asymmetry — only the explicitly-requested `neutral-solid` was added there). `IconButton` gained `neutral-outline` and `neutral-solid`, matching Figma's icon-only "Outline"/"Solid" types exactly and reusing the same Button tokens. New tokens' dark values have no Figma dark evidence and mirror light exactly, by direct user decision, since these are inherently dark-styled treatments regardless of app theme.
- ad36e17: `PageHeader`'s breadcrumb links now render through the shared `TextLink` component instead of a raw `<a>` (still colored via the distinct `--color-app-shell-text-link` role). Also fixed a one-step dark-mode color drift: `app-shell.text-link` (dark) now matches `TextLink`'s own `text.link` token exactly (`primary.300`/`#D8668A`, previously `primary.200`). Light mode was already correct. No prop changes.
- 02e4a70: Corrected `Radio`'s dark-mode colors against the first real Figma Dark instances for this collection. `radio-checkbox-selected` (dark) was `neutral.white`, now `nightshade.200`/#C9C2C7. `radio-checkbox-disabled-border` (dark, previously flagged unverified) now shares the same `app-shell.dark.text-muted` primitive `primary-border` already uses. Radio's shared `input.*` base tokens were already correct via the same-day Input dark-mode fix, re-verified exact here too.
- 02e4a70: Corrected `radius.pill` from `100` to `999`, matching the generic Radius primitive scale's authored Figma value exactly (previously sourced independently from the Badge component, which read 100). Direct user decision after confirming zero visual regression: both current consumers (`Badge`, `EnterpriseLoginPage`'s hero badges) are under ~40px tall, and CSS `border-radius` clamps to 50% of an element's shortest side, so 100 and 999 render pixel-identical for a pill shape at that size.
- 1233ff7: Removed Inter and Roboto Mono from the type scale (direct product decision, later confirmed to match a live Figma update). `sans`/`brand` now use Instrument Sans as their primary face instead of Inter; `mono` now uses Space Mono instead of Roboto Mono. The now-redundant `documentation-mono` token (identical to `mono` once both pointed at Space Mono) was removed entirely and its one consumer switched to `font-mono`. The Storybook Google Fonts import was updated to match (dropped Inter, added weight 700 to the Instrument Sans request to cover the brand-mark tokens).
- ec824cc: Rename the product from "Lumen Design System" to "Lumen AI Design System" throughout, matching the canonical Figma source file's own rename (same fileKey and node IDs — only the display name changed). Updates `_comment` citations in token source JSON (and their regenerated `dist/` output); no token values changed.
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

- a6dde06: Corrected 3 generic dark-mode color tokens found during a structured audit of `docs/figma-source.md`'s "exact color values" known-limitation: `dark.status.success` and `dark.status.warning` were unverified ramp-mirror guesses (now `status.green`/`status.amber`, matching the same values already confirmed for Toast's own scoped accents). `dark.badge.default-bg` was claimed correct in an earlier audit but was actually still wrong (now `teal.900`).
- 02e4a70: Corrected `Toast`'s dark-mode colors and a 2px width transcription error, plus removed a distinct accent color from the `error` tone that Figma never bound to it (relies on the warning-triangle icon shape alone). Five new toast-scoped tokens added (`container-bg`, `body-text`, `icon-default`, `warning-accent`, `success-accent`) since the previously-reused generic tokens didn't match Toast's real dark values — some were wrong in both themes. `title-text` dark corrected to the right primitive family. Info accent and the SystemInfo/`celebration` background were re-verified byte-exact, unchanged. See `packages/tokens/src/semantic/color.json`'s `_toastComment` for the full record.
- 02e4a70: Reverted `Toast`'s `error` tone back to its distinct red accent (`status.error`) after direct user review — a colorless error toast (matching a literal Figma finding of "no bound accent") reads as informational, not a failure, so this deliberately overrides that finding for usability. Added a new `toast.neutral-accent` token (`neutral.300`, exact) for a genuine `Type=Neutral` Figma instance that didn't exist during the earlier dark-mode audit, replacing the generic `border.default` placeholder `neutral` had been using. Also fixed real bugs in the Storybook demo content: `warning`/`error` triggers were both firing `info`'s copy, `success`/`neutral` used generic placeholder text instead of Figma's own example content, and `AllTones` only pushed 3 of its own claimed "all five" tones.
- ef339fa: Fix `gradient.json` tokens (e.g. `gradient.upload-header`) missing from `dist/index.ts`'s
  typed JS/TS export block — they were already emitted correctly to CSS (`--gradient-*`
  variables), but `packages/tokens/scripts/build.mjs` never added the corresponding
  `export const gradient = ...` alongside every other token category. Found during a
  documentation-accuracy audit while verifying `packages/tokens/README.md`'s claim of
  "typed JS/TS exports of every token" against the real generated output.
- c978bb3: Corrected `typography.scale.body-sm` (14px/22px, was 16px/24px) to match the live Figma `Body/Small` variable and this repo's own already-documented Body scale. Found during a full token verification/reconciliation pass against the Design Tokens Figma nodes; every other Body tier and all 17 color families already matched exactly. Consuming components (`text-body-sm`) render visibly smaller/tighter text as a result — no API changes.
