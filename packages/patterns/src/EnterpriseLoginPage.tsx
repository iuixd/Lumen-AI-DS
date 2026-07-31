import { useEffect, useState, type ChangeEvent, type CSSProperties, type FormEvent, type ReactNode } from "react";
import {
  Button,
  Input,
  Checkbox,
  TextLink,
  LumenLogo,
  LmAisymbolIcon,
  EyeIcon,
  EyeOffIcon,
  ChevronLeftIcon,
  FingerprintPatternIcon,
  KeyIcon,
  ScanQrCodeIcon,
  CheckCircleFilledIcon
} from "@lumen/ui";

const heroIllustrationAsset = new URL("./assets/enterprise-login-hero.svg", import.meta.url).href;

export interface EnterpriseLoginWorkspace {
  id: string;
  name: string;
  /** Single-character avatar fallback, e.g. "N". */
  initial: string;
}

export type EnterpriseLoginSsoProvider = "microsoft" | "google" | "okta";

export interface EnterpriseLoginCredentialResult {
  success: boolean;
  /** Shown in the inline form error when `success` is false. */
  error?: string;
}

export interface EnterpriseLoginPageProps {
  /** Rendered in the desktop hero panel and the compact mobile/tablet header. Defaults to `LumenLogo`. */
  logo?: ReactNode;
  heroTitle?: string;
  heroDescription?: string;
  /** e.g. `["SOC 2 Type II", "ISO 27001", "GDPR", "HIPAA"]`. Omit to hide the row. */
  complianceBadges?: string[];
  /** e.g. `"Data residency: EU (Frankfurt) · Tenant lumen-nw-eu-1"`. Omit to hide the row. */
  dataResidencyNote?: string;
  /** Paired with `statusHref` for the hero panel's live-status row. Omit either to hide the row. */
  statusText?: string;
  statusHref?: string;
  /** First name used in "Welcome back, {userName}." */
  userName?: string;
  /** e.g. `"Last signed in 3 days ago · Bengaluru, IN · Chrome on macOS"`. Omit to hide. */
  lastSignIn?: string;
  recentWorkspaces?: EnterpriseLoginWorkspace[];
  ssoProviders?: EnterpriseLoginSsoProvider[];
  region?: string;
  /** Organization the "Signed in" screen hands off to. */
  orgName?: string;
  /** Called on email/password submit. Return `{ success: false, error }` to show the inline error and stay on this screen; anything else advances to MFA. Omitted entirely, the form has nothing to submit to. */
  onSubmitCredentials?: (
    email: string,
    password: string
  ) => Promise<EnterpriseLoginCredentialResult | void> | EnterpriseLoginCredentialResult | void;
  /** Called when the passkey ceremony should start. Return `false` to fall back to the sign-in screen; anything else is treated as success and advances to "Signed in". */
  onStartPasskey?: () => Promise<boolean | void> | boolean | void;
  /** Called once all 6 MFA digits are entered. Return `false` to stay on this screen; anything else advances to "Signed in". */
  onVerifyMfaCode?: (code: string) => Promise<boolean | void> | boolean | void;
  onSsoSignIn?: (provider: EnterpriseLoginSsoProvider) => void;
  /** Called once the internal state machine reaches the "Signed in" screen — whether via passkey or MFA. The natural point for a composing pattern to advance to whatever comes after login. */
  onComplete?: () => void;
  /** Which of the 4 screens to render first. Defaults to `"sign-in"` — an entry point for Storybook/tests to preview the other screens directly, not something a real integration needs to set. */
  initialScreen?: "sign-in" | "passkey" | "mfa" | "done";
}

const ssoProviderLabel: Record<EnterpriseLoginSsoProvider, string> = {
  microsoft: "Microsoft",
  google: "Google",
  okta: "Okta"
};

function detectOrgHint(email: string): string {
  const at = email.indexOf("@");
  if (at < 0 || at === email.length - 1) return "";
  const domain = email.slice(at + 1).toLowerCase();
  if (domain.startsWith("northwind")) {
    return "Northwind Group detected — your organization requires Microsoft SSO. We'll route you there.";
  }
  if (domain.startsWith("acme")) {
    return "Acme Legal detected — SAML sign-in is available for this domain.";
  }
  return `No workspace found for ${domain} yet. You can create one after verifying your email.`;
}

/**
 * Enterprise pattern: multi-step enterprise sign-in flow — SSO/passkey/
 * email+password on a marketing hero split-screen, MFA, and a signed-in
 * confirmation. Distinct from `AuthForm` (a minimal centered card meant to
 * stay minimal — see its own doc comment) rather than an extension of it:
 * this is a different shape (split hero panel, a 4-screen state machine,
 * SSO/passkey/MFA) that would have bloated `AuthForm`'s single-form API,
 * not a variant of the same component. Added at direct user request
 * ("Use the claude_design MCP ... Implement: `Enterprise Login.dc.html`"),
 * which is also this component's authorization to exist as a second,
 * larger auth pattern in this repo, per `AuthForm.mdx`'s own note that an
 * addition here needs to be "generic enough to belong in the design system
 * itself" rather than forked per-product.
 *
 * Source: a Claude Design prototype (`Enterprise Login.dc.html`, project
 * `57d6beaf-33bb-4013-bb17-464a1ab3d649`), not Figma Dev Mode — every
 * `--color-*`/`--text-*`/`--spacing-*` token it referenced already existed
 * in `@lumen/tokens` verified byte-for-byte against this repo's own built
 * `variables.css`. The few gaps (see `packages/tokens/src/semantic/
 * color.json`'s `_authHeroComment`) got new `auth-hero.*` tokens rather
 * than inlined hex, with a WCAG contrast pass applied where the prototype's
 * literal values fell short (`badge-border`, `text-caption`).
 *
 * Deliberately NOT ported from the prototype: its fixed bottom "Prototype
 * states" dock (a Claude Design preview harness for switching device/
 * state/theme, not shippable UI) and its `frameW` device-frame pixel
 * widths — real responsiveness here uses this repo's own `tablet`/
 * `desktop` breakpoints instead. The prototype's brand mark (a plain
 * crimson square + `AiSymbol`) is replaced with the real `LumenLogo`,
 * consistent with its recent rollout across `AppShell`/`SideNav`. All
 * interactive behavior (auth state machine, org detection, MFA code entry)
 * is ported as real React state; the
 * prototype's own `setTimeout`-simulated network calls are not — this
 * component calls the `onSubmitCredentials`/`onStartPasskey`/
 * `onVerifyMfaCode` props instead and does nothing on its own if they're
 * omitted, the same "call the prop, don't fake a backend" contract
 * `AuthForm.onSubmit` already uses.
 *
 * Corrected 2026-07-31 (direct user report: "Sign-in error pattern does not
 * match the Figma design"): re-checked the actual login frame (node
 * `1524:2213`) and it has no error state placed in it at all — the
 * password-error treatment in the prototype (a bordered, icon'd alert box)
 * has zero Figma evidence. The canonical `Input` component (node
 * `1262:1181`) does document a real `State=Error` variant, verified
 * directly on the `Type=Bordered, Size=sm, Icon=No` instance (node
 * `1265:2100`): a plain red border, `input.primary-error-border`
 * (`#DA1E28`), already exactly what this component's `aria-invalid` prop
 * already produced via `Input`'s own error styling — no change needed
 * there. There is no error *message* treatment in Figma at all for this
 * field. A bare red border with no text fails WCAG 3.3.1 (errors can't be
 * conveyed by color alone), so rather than either inventing a new banner
 * or shipping something inaccessible, the message now reuses this design
 * system's own established inline-field-error convention (`FormField`'s
 * `error` prop: plain `role="alert"` text, `text-label-md`,
 * `status.error`, no box or icon) instead of the prototype's boxed alert —
 * a deliberate Figma-plus-accessibility deviation from the prototype, not
 * an invented look, and placed directly under the password field (where
 * `FormField` already places its own field-level errors) instead of
 * floating separately near the submit button.
 *
 * Corrected again 2026-07-31 (same day, direct user report with side-by-
 * side screenshots: "not matched to the Figma design even 10%"), after
 * finally reading the hero panel's actual sibling content node (`1524:4176`,
 * "Frame 32" — previously missed entirely; the earlier sync only ever
 * pulled the hero panel's giant vector illustration group, node `1523:318`,
 * and never looked at what else sits inside the same parent frame). Real,
 * placed Figma content, not inferred: brand text is "Lumen AI", not
 * "Lumen" (both here and the mobile-only compact header duplicate). The
 * illustration itself was the prototype's hand-drawn constellation SVG,
 * with zero resemblance to the real exported asset — replaced with the
 * actual Figma-exported illustration (`packages/patterns/src/assets/
 * enterprise-login-hero.svg`), positioned at its node's real x/y/width
 * offsets relative to its 720px-wide reference frame, expressed as
 * percentages so it scales with this panel's actual (responsive) width
 * instead of a fixed pixel frame. Originally exported as a PNG (raster,
 * for file size — the underlying vector is ~1,500 individual dot paths)
 * from node `1523:318`; corrected again same day (direct user feedback:
 * "dotted-circular... should be a transparent SVG") to the real SVG
 * instead, sourced from node `1537:1821` after node `1523:318` came back
 * "not found" — the Figma file's own illustration layer had been
 * reorganized since the first pull, replacing a deeply-nested "Asset 1 1"
 * group with one flat "Vector" node at very slightly different bounds
 * (this component's offsets were re-measured against the new node, not
 * copied from the stale ones).
 *
 * Three more inventions with zero Figma evidence anywhere in this frame,
 * removed entirely rather than corrected: the hero panel's "All systems
 * operational · status.lumen.ai" status row and its "Data residency: ..."
 * caption (their `statusText`/`statusHref`/`dataResidencyNote` props stay
 * — optional, `undefined` by default, so removing them only from this
 * component's own Storybook demo args makes the *default* render match
 * Figma exactly; a real integration can still opt into them if it has its
 * own reason to); and the form panel's entire header row of region/
 * language-select icon buttons plus a theme toggle — the actual Figma
 * frame (`1524:2213`) starts directly with the "Welcome back" greeting, no
 * header above it at all. Removed outright (not hidden behind a prop)
 * along with the now-dead `theme` state that only existed to drive that
 * toggle; the root no longer sets `data-theme` for the same reason — this
 * pattern doesn't manage its own theme, no more than any other pattern in
 * this repo does.
 *
 * Also found and fixed while investigating (not this screen's issue alone
 * — a real, repo-wide bug): the shared `Checkbox` component's checked/
 * unchecked colors, see `components/internal/checkbox.tsx`'s own
 * corrected docblock. And the three SSO buttons (Microsoft/Google/Okta)
 * were rendering `Button`'s `outline` variant unmodified — its crimson-
 * tinted border/text, correct for `Button` generally — where this
 * screen's real bound colors (verified in the original sync, re-confirmed
 * here) are plain `border.default`/`text.secondary`, the same class of
 * fix already applied to the "Continue with email" button but missed on
 * these three.
 *
 * Not yet re-verified: the hero panel's exact text colors reference this
 * component's own `auth-hero.*` tokens (`neutral.white`, etc.), not the
 * precise `nightshade/*` family Figma's `Frame 32` pull just revealed
 * (e.g. heading text is `nightshade.50` / `#F9F3F7`, a subtle off-white,
 * not pure `#FFFFFF`) — those exact hex values already exist in this
 * repo's primitives under the unrelated `app-shell.dark.*` names (e.g.
 * `nightshade.50` = `app-shell.dark.text-heading` exactly), so fixing this
 * precisely means either aliasing across that naming gap or introducing a
 * real `nightshade` primitive family — a small but real follow-up, flagged
 * rather than silently left as first-guessed.
 *
 * Corrected a third time 2026-07-31 (same day, direct user screenshot:
 * "right-side form content, size, color, spacing, etc. are not matching
 * exactly 100%"). Re-read this repo's own already-captured `1524:2213`
 * dump line by line against the rendered code and found the sign-in
 * form's sizing had been guessed from generic conventions (44px inputs,
 * 48px buttons) rather than this frame's real, consistently smaller
 * scale — every field/button height, every gap, and several colors/type
 * sizes were off:
 * - Container and form gaps were 32px/20px; the real frame uses one
 *   uniform 24px gap for every child, greeting/field-group internal gaps
 *   are 4px (not 8px), and the SSO row-to-"More options" gap is 2px (not
 *   8px) — all corrected.
 * - The greeting ("Welcome back, ...") was `headline-lg` (32/42, this
 *   design's H4 size, already correctly used by `FileUploadDropzone`'s
 *   heading) where the real style here is `Heading/H5` (24/32) —
 *   `headline-md` plus the evidenced `-0.5px` tracking.
 * - Every primary button (passkey, SSO, "Continue with email") was 44-48px
 *   tall; the real height throughout this frame is 40px
 *   (`--spacing-40`), each with `px-[14px]` matching Figma's bound
 *   padding — `Button`'s own `size` presets don't have a matching preset,
 *   so height and padding are set directly per instance.
 * - The email/password `Input`s were forced to `h-11` (44px) via a
 *   `className` override — `Input`'s own real default is already `h-9`
 *   (36px), the exact Figma value; the override was actively wrong and is
 *   removed, not replaced. The password-visibility toggle's hit target
 *   was resized/repositioned to stay centered against the shorter field.
 * - The workspace-chip avatar circles were 28px; the real size is 16px,
 *   with proportionally tiny (6.67px) initials — Figma's own literal
 *   instance, not a general type size worth a token.
 * - Several label/text colors were the wrong tier: form field labels were
 *   `text.title` (real value: `text.secondary`), the "Remember this
 *   device" label was `text.body` (real value: `text.secondary`), the
 *   inactive workspace chip's text was `text.body` (real value:
 *   `text.secondary`), and "RECENT WORKSPACES"/"OR USE EMAIL" carried an
 *   invented `0.08em` letter-spacing where Figma specifies `0`.
 * - The adaptive-authentication box had an invented border, the wrong
 *   background (`background.subtle` / `#EFEFEF` instead of the real
 *   `lumen-gray.100` / `#EDF0F1`), the wrong radius (`radius.lg` / 8px
 *   instead of the real 10px, `--radius-button`, already the exact token
 *   `Button` itself resolves that same Figma-bound value to), and the
 *   wrong padding/gap/icon size.
 *
 * Not fixed here, same reasoning as `radius.xxxl` in the earlier
 * `FileUploadProgressList` correction — real but out of scope for this
 * pattern-level file: `Input`'s own shared internal padding (`px-3 py-1`,
 * Figma's real value is `px-[10px] py-[8px]`) and placeholder/value text
 * size (`text-input-md`, 16/18 — Figma's real value is `Body/Small
 * Regular`, 14/22). Both are `components/internal/input.tsx` concerns
 * affecting every `Input` consumer in the design system, not something to
 * silently patch from one pattern's usage.
 *
 * Corrected a fourth time 2026-07-31 (same day; user increased the Figma
 * frame's canvas height for editing breathing room and reported the SSO/
 * submit buttons still didn't match, plus top/bottom spacing). Re-pulled
 * `get_metadata` + a direct `get_screenshot` on the live `1521:224` frame
 * (now 1440×1026, up from 900 — the file had been reorganized again,
 * confirmed by yet another set of new node IDs throughout):
 * - The entire footer (© copyright + Privacy/Terms/Security/Status links)
 *   was a complete invention with zero Figma evidence anywhere in this
 *   frame — the screenshot shows "New to Lumen? Create an account or talk
 *   to sales" as the literal last element, with genuine empty whitespace
 *   below it (an exactly symmetric 96px top/96px margin around the 834px
 *   form: 1026 − 96 − 834 = 96). Removed the `<footer>` block outright and
 *   changed the content wrapper's padding from asymmetric
 *   `px-[var(--spacing-32)] pb-[var(--spacing-40)]` to symmetric
 *   `px-[var(--spacing-32)] py-[var(--spacing-40)]` — matching Figma's
 *   symmetric-centering intent rather than hardcoding the literal 96px,
 *   which is tied to one specific canvas height the user keeps changing.
 * - The SSO buttons' and "Continue with email"'s bound colors had changed
 *   again since the third correction pass: fresh `get_design_context` on
 *   `1540:3318`/`1540:3319` resolved to `border.default`/`text.secondary`
 *   during the third pass, but now resolve to `--btn/neutral/secondary/
 *   border` (`#dbe1e2`, i.e. `lumen-gray.200`) and `--btn/neutral/
 *   secondary/on-action` (`#262626`, i.e. `text.title`) — both buttons'
 *   classNames updated to match the current bound values exactly.
 * - The same neutral-secondary color pair was also missing on the inactive
 *   ("Acme Legal") recent-workspace chip — fresh `get_design_context` on
 *   `1540:3328` showed its border/text use the identical `lumen-gray.200`/
 *   `text.title` pair (not `border.default`/`text.secondary`, what was
 *   there), at `1.5px` border width like the SSO/submit buttons, and its
 *   avatar is `16.8px` with an `8.83%`-of-size (`4.44px`) radius — not a
 *   full circle — on `lumen-gray.600` (`#838f92`) background with white
 *   text at `10.5px`. The active ("Northwind Group") chip's avatar is a
 *   different size again: `20px` at `8px` radius, `8.33px` text — both
 *   corrected from the previous single shared `16px`/`6.67px` guess (which
 *   was itself already a correction of an earlier `28px` guess) to their
 *   real, independently-sized-per-state Figma values. Active chip bg/
 *   border switched from ad hoc `--color-primary-500`/`-a10` values to the
 *   already-existing `--color-button-secondary-bg`/`-border` semantic pair,
 *   which resolve almost exactly to Figma's bound `rgba(190,0,60,0.08)`/
 *   `rgba(190,0,60,0.24)` (minor, expected alpha-rounding only).
 * - The "More options" ghost button was rendering `Button`'s base
 *   `font-medium` unmodified; Figma's bound text style for this instance is
 *   `font-normal` (Regular, not Medium) — added an explicit `font-normal`
 *   override, the same class of miss as the SSO buttons' unmodified
 *   `outline` variant in the second correction pass.
 * - Re-verified "Continue with passkey" (`1524:2093`) and its icon size
 *   against fresh data — both already correct from the third pass, no
 *   change needed.
 *
 * Corrected a fifth time 2026-07-31 (same day; direct user report against
 * the same live URL: "SSO buttons + Continue with email are changed to
 * neutral button type in Figma... hover color is different", "I have added
 * footer in the Figma design", "'More options' button - hover should have
 * neutral gray color"):
 * - The Figma `Button` component set gained a new `Style=Neutral` variant
 *   since the fourth pass (confirmed via `get_metadata` on the component
 *   set, node `1174:1349`) — this is what the SSO/submit buttons and the
 *   inactive workspace chip are actually instances of now, not a
 *   Style-agnostic "border/text happen to be neutral" case as previously
 *   assumed. Its documented `Hover` state (node `1540:2944`) changes only
 *   the fill, to `--btn/neutral/secondary/hover-bg` (`#efefef`, exactly
 *   `--color-background-subtle`) — border and text stay at their default
 *   values, no border-color shift. The previous pass's
 *   `hover:border-[var(--color-border-strong)]` was invented (no Hover
 *   variant had been checked at all); replaced with
 *   `hover:bg-[var(--color-background-subtle)]` on `SsoProviderButton` and
 *   the "Continue with email" submit button.
 * - Immediate user follow-up ("borders and hover border are not matching
 *   Figma") caught a second, real error in the same fix: `get_variable_defs`
 *   on the actual placed instances (`1540:3318`/`1540:3319`/`1540:3328`,
 *   plus the Neutral Default/Hover masters `1540:2550`/`1540:2944`) shows
 *   every one of them binds `Border Width/sm` = `1`, not `1.5` — the prior
 *   passes' `border-[1.5px]` (both here and on the inactive workspace chip)
 *   had been read off the MCP tool's rendered Tailwind dump rather than its
 *   bound variables, and that dump's literal border-width class doesn't
 *   match the variable it's bound to. Corrected to a plain 1px `border` on
 *   `SsoProviderButton`, the submit button, and the inactive workspace
 *   chip's inline style — same border color, same (unchanged) hover
 *   behavior, only the width was wrong.
 * - The footer this session removed in the fourth correction (after a
 *   `get_screenshot` genuinely showed none inside frame `1521:224`) turned
 *   out to be real: the user added an actual `Footer` component instance
 *   (node `1540:4536`, `type="Login"`) as a section-level sibling of the
 *   login frame, not nested inside it — invisible to a `get_metadata`/
 *   `get_screenshot` scoped to `1521:224` alone, only found by walking up
 *   to the parent section (`1524:4201`) and re-reading its full child list.
 *   Its bound values (`get_design_context` + `get_variable_defs` on
 *   `1540:4536`) map onto existing tokens exactly: `stroke/default`
 *   (`#dfdfdf` → `--color-border-default`), `text/muted` (`#5e5e5e` →
 *   `--color-text-muted`), `bg/surface` (`#ffffff` → this panel's own
 *   default background, no override needed), `text/secondary` (`#626b6e`
 *   → `--color-text-secondary`, already used elsewhere in this file).
 *   Instance geometry (`x`/`y`/`width` in the section's coordinate space)
 *   places it flush against the login card's own right and bottom edges,
 *   spanning the full width of the form-panel column — re-added as a
 *   `<footer>` inside `<main>`, after the centered screen content, full
 *   `--color-border-default` top border only (its Figma spec is a full
 *   4-side `border`, but left/right/bottom would double up against this
 *   card's own outer border/shadow and read as a rendering bug, not a
 *   deliberate line — same reasoning already applied to this card's outer
 *   frame elsewhere). Rendered on every screen (sign-in/passkey/mfa/done),
 *   not just sign-in — no Figma evidence either way for the other three
 *   screens, but a legal/copyright footer disappearing and reappearing
 *   between steps of one continuous auth flow would itself be the kind of
 *   invented, un-evidenced inconsistency this file keeps getting corrected
 *   for; flagged here rather than silently assumed.
 * - "More options"' hover was still the generic `Ghost` style's global
 *   Figma default (`get_design_context` on node `1237:1916` confirms it:
 *   `#f9e6ec` bg / `#be003c` text, crimson-tinted) — correct for `Button`
 *   generally, but the user explicitly asked for a neutral gray hover on
 *   this specific instance instead, overriding the generic Ghost default
 *   the same way "Cancel" overrides it elsewhere in this design system.
 *   Added `hover:bg-[var(--color-background-subtle)]
 *   hover:text-[var(--color-text-title)]` (the same neutral-secondary
 *   hover pair used above) as a local override via `className`, not a
 *   change to `Button`'s shared `ghost` variant.
 *
 * Corrected a sixth time 2026-07-31 (same day; direct user report with
 * screenshots: "App bg is missing and font style not at all matching my
 * Figma Design" / "Welcome font style not matching Figma design" / "left-
 * side font styles are not matching the design at all" / "I want you to
 * design exactly as in Figma Design"). Two root causes, both repo-wide, not
 * specific to this pattern:
 * - `packages/storybook/.storybook/tailwind.css` declared `font-editorial`
 *   as `"Source Serif Pro", Georgia, serif` at the token level but never
 *   actually loaded Source Serif Pro as a webfont anywhere in this repo —
 *   only `Lora` (Storybook's own Docs-page chrome typeface, unrelated) and
 *   Instrument Sans were imported. Every `font-editorial` heading in the
 *   entire app (this file, `FileUploadDropzone`/`FileUploadProgressList`,
 *   `ContentState`, `EmptyState`, `AIButton`'s docs) had been silently
 *   rendering its Georgia/system-serif fallback this whole session, not
 *   the real typeface — this explains far more of the "not matching at
 *   all" reports than any individual size/color miss. Fixed by adding a
 *   real `@import` for Source Serif Pro (400/600/700, covering every
 *   weight `editorial` consumers use) alongside the existing imports.
 * - A mid-fix JSON structural error (a `_comment`-style key nested inside
 *   `semantic/color.json`'s `light.button`/`dark.button` groups instead of
 *   at the file's root, where every other `_xxxComment` key in this file
 *   actually lives) broke `pnpm --filter @lumen/tokens build` entirely for
 *   several turns — during that window every CSS custom property this repo
 *   emits was stale/regenerating, which is the direct cause of the "App bg
 *   is missing" report. Fixed by moving the comment to root level; token
 *   build re-verified clean afterward.
 *
 * With the real webfont finally loading, a fresh line-by-line re-pull of
 * every remaining hero-panel and greeting text node turned up real,
 * previously-undetected drift (undetectable before now since every serif
 * heading was rendering as fallback regardless of what class was applied):
 * - The hero heading (`heroTitle`) was missing `font-editorial` entirely
 *   (rendering in the default sans, not serif at all) and used
 *   `text-display-sm` (this scale's H3, 40/50) instead of the real bound
 *   style, Figma `Heading/H4` (32/42, `headline-lg` in this scale) with
 *   `-1.5px` tracking (was an invented `-0.02em`) — likely the single
 *   biggest contributor to "left-side font styles are not matching the
 *   design at all", both wrong typeface AND wrong size at once.
 * - "Welcome back, {userName}." was already correctly sized/serif'd
 *   (`headline-md` + `font-editorial`, from the third correction pass) but
 *   its color was `text.title` (`neutral.800`, #262626) — fresh
 *   `get_variable_defs` on its exact node (`1523:2025`) binds `text/primary`
 *   (#1e2021), a distinct, slightly darker existing token
 *   (`--color-text-primary`) this pattern had never used. Corrected.
 * - The hero panel's brand row, "Enterprise" eyebrow label, its divider,
 *   and the compliance badges were still using this file's original
 *   `auth-hero.*` tokens as set at creation time — sourced from a Claude
 *   Design prototype, never Figma, per that token group's own
 *   `_authHeroComment`. Fresh `get_design_context`/`get_variable_defs` on
 *   the actual Figma nodes (`1522:299` Brand, `1523:2024` Badge Container)
 *   found real Figma-bound colors from a `nightshade` family this repo had
 *   never wired up, despite exact-matching primitives already existing
 *   under `app-shell.dark.*` (flagged as a known gap in the second
 *   correction pass, now closed): heading/title text is `nightshade.50`
 *   (#f9f3f7, `app-shell.dark.text-heading`) — distinct from the brand
 *   mark's own literal `neutral.white`, which stays pure white; body text
 *   is `nightshade.300` (#b8acb3, `app-shell.dark.text-secondary`) — a
 *   solid muted color, not the translucent `neutral.white-a72` overlay
 *   previously used; the "Enterprise" label and its divider are both
 *   `nightshade.600` (#7a6674, `app-shell.dark.text-muted`); badge text is
 *   `nightshade.200` (#c9c2c7, `app-shell.dark.toggle-off-action`) and
 *   badge border is `nightshade.800` (#3d3039, `app-shell.dark.border`).
 *   `auth-hero.text-title`/`-body`/`-label`/`-divider`/`badge-text`/
 *   `badge-border` in `packages/tokens/src/semantic/color.json` were
 *   updated to alias these existing primitives (zero new hex); `text-
 *   caption`/`status-dot` were left unchanged (no live consumer in this
 *   pattern's default render, both already flagged non-evidenced).
 * - The brand mark ("Lumen AI" wordmark next to the logo) was `text-title-
 *   md` (16/26, weight 500 default, `font-semibold` override to 600) with
 *   an invented `-0.01em` tracking; Figma's bound style is Instrument Sans
 *   SemiBold 16/24 with zero tracking — corrected to explicit `text-[16px]
 *   leading-[24px] font-semibold` with no tracking class, color pinned to
 *   the `--color-neutral-white` primitive directly (a fixed, correct value
 *   both before and after this fix, but no longer coincidentally inherited
 *   from the aside's own default text color now that that default has
 *   changed to `nightshade.50` for headings).
 * - The "Enterprise" eyebrow label and the compliance badges were both
 *   `text-label-sm` (11px, weight 600) with invented uppercase-tracking
 *   (`0.08em`/`0.06em`); Figma's real bound styles are Instrument Sans
 *   Medium at `Body/Small Medium` (14/22) for the label and `Body/XSmall
 *   Medium` (12/20) for badges, weight 500, zero tracking on both, no CSS
 *   `uppercase` transform needed (source strings are already correctly
 *   cased). Corrected to `text-body-sm font-medium` and `text-body-xs
 *   font-medium` respectively; badge padding corrected from an invented
 *   `py-[var(--spacing-5)]` to the real bound `py-6`.
 * - Brand row gap corrected from `--spacing-12` to the real bound `8px`
 *   (`--spacing-8`), read directly off `1522:299`'s own container.
 *
 * Separately, per direct user request ("I want you to use this neutral
 * button", with a screenshot of the Neutral style's Default/Hover/Focused/
 * Disabled anatomy): `packages/ui/src/components/internal/button.tsx`
 * gained a real `variant="neutral"` (see its own docblock for the token
 * mapping) so the SSO buttons and "Continue with email" no longer hand-roll
 * this look via one-off `className` color overrides on top of `outline` —
 * they now use `variant="neutral"` directly, keeping only the height/
 * padding/type-scale overrides `Button`'s `size` presets don't cover.
 *
 * Removed 2026-07-31 (same day; direct user question: "Why password
 * strength indicator in login form?"): the password field's live strength
 * meter (`getPasswordStrength`/`strengthMeta`, ported as-is from the
 * original Claude Design prototype and never re-examined against Figma or
 * against what a strength meter is actually *for*) never belonged on this
 * screen — it's sign-in, not account creation, so the user is entering a
 * password that already exists elsewhere; grading its "strength" at that
 * point is meaningless and was never asked for by design. Every fresh
 * `get_metadata`/`get_design_context` pull of this frame's own "Password
 * Form Container" (`1524:4117`) across every correction pass this session
 * showed only the label, "Forgot password?" link, and the input row — no
 * strength-meter element has ever existed in this screen's real Figma
 * source. Removed `getPasswordStrength`/`strengthMeta`, the `strength`
 * prop threaded from `EnterpriseLoginPage` through `SignInScreenProps`, and
 * the meter's own render block; the obsolete
 * `EnterpriseLoginPage.test.tsx` assertion for it was removed too. Nothing
 * else in this component depended on it. `AuthForm` (this repo's other,
 * simpler auth pattern) has no equivalent and was never affected.
 *
 * Corrected a ninth time 2026-07-31 (same day; direct user question: "Why
 * bg/app background is missing in page background?"): a fresh
 * `get_variable_defs` pull on the login frame itself (`1521:224`) surfaced
 * a bound variable this session had never queried directly on the root
 * frame before — `bg/app` (`#f6f8f8`) — which is exactly this repo's
 * already-existing `--color-background-app` token (added for `ContentState`,
 * aliasing `lumen-gray.50`). The outer page wrapper had been using
 * `--color-background-subtle` (`#EFEFEF`, `neutral.50`) instead — a
 * different, close-but-wrong gray from the start (inherited from the
 * original Claude Design prototype, never checked against this specific
 * bound variable). Corrected the root wrapper's background to
 * `--color-background-app`.
 *
 * Corrected a tenth time 2026-07-31 (same day; direct user report with a
 * screenshot: "Acem Corp is missing in the single selection chip button.
 * Unselected button in single selection chip button should be neutral
 * always including it's hover and border color."): fresh
 * `get_design_context` on the workspace-selector row (`1524:2081`) shows
 * the second workspace's real Figma text is now "Acme Corp" — the Figma
 * file had renamed this since the fourth correction pass, where "Acme
 * Legal" was last confirmed correct. `EnterpriseLoginPage.stories.tsx`'s
 * demo data updated to match (this is only ever demo/story content, not a
 * hardcoded value inside the component itself, which takes workspace names
 * as props). The inactive chip's border color was already the right
 * neutral token (`--color-lumen-gray-200`, confirmed in the fourth/fifth
 * passes), but it had no hover state defined at all — added
 * `hover:bg-[var(--color-background-subtle)]`, the same neutral-hover
 * treatment `SsoProviderButton`/the submit button/`Button`'s own `neutral`
 * variant all already use, scoped to only the unselected chip (the active,
 * selected chip keeps its own distinct secondary/brand hover treatment,
 * not asked to change here).
 *
 * Corrected an eleventh time 2026-07-31 (same day; direct user report:
 * "Right-side form background color is white. But in Figma design the
 * right-side form background uses the... bg/app background token, not
 * white."): a fresh, more targeted `get_variable_defs` pull directly on
 * the form panel's own "Container" node (`1524:2213`) — narrower than the
 * whole-frame pull the ninth correction used — shows `bg/app` is not bound
 * inside `Container` itself, meaning `Container` has no opaque fill of its
 * own; it's the frame's own root background (already wired to `--color-
 * background-app` in the ninth correction) that shows through as this
 * panel's effective background. The two-panel card wrapper (`bg-[var(
 * --color-background-default)]`, white) had been painting over that
 * everywhere the form panel doesn't have its own explicit background,
 * which is everywhere — `<main>` never set one. Gave `<main>` its own
 * explicit `bg-[var(--color-background-app)]`, matching what actually
 * shows in Figma rather than relying on inheriting the wrapper's white.
 * The wrapper's own white fill is now fully covered by its two opaque
 * children (the dark hero `<aside>` and this `<main>`) and never visible;
 * left as-is rather than removed, since removing it risks a future regression
 * if either child's coverage ever changes (e.g. a narrower viewport where
 * the grid gap or a child's own margin could expose it).
 *
 * Added 2026-07-31 (same day; direct user request: "Is it possible to add
 * subtle rotating animation with mild glittering effects? Do you have any
 * expert level recommendation?", approved after confirming "figma doesn't
 * have the animation background" — no Figma source for any of this, a
 * disclosed code-side enhancement): the hero illustration spins smoothly,
 * clockwise, at a constant speed (`lumen-hero-rotate`, a full 0deg->360deg
 * turn every 60s, `linear` timing — not eased, since an eased continuous
 * loop visibly speeds up/slows down at the seam, which reads as a stutter
 * rather than "smooth"). Corrected same day from an initial small
 * -3deg/+3deg oscillating wobble after direct user follow-up ("rotate the
 * dotted SVG smoothly clockwise... I don't see the smooth rotation") — the
 * wobble had been chosen to avoid sweeping gaps past the image's own
 * landscape-proportioned (823.823x573.604) bounding box on this portrait
 * panel, but that risk doesn't actually apply: the panel's own background
 * (`--color-primary-900`) already matches the illustration's transparent
 * negative space, and the static crop already leaves areas of the panel
 * uncovered with no visible seam — a full rotation just sweeps that same
 * already-invisible boundary around instead of introducing a new one.
 * Five small radial-gradient sparkles
 * (`lumen-hero-glimmer`, staggered 3s fade-in/out pulses) are centered
 * exactly on real dot coordinates read directly from
 * `enterprise-login-hero.svg`'s own path data (per user follow-up:
 * "subtle sparkles should be on the dots in the dotted SVG file") — not
 * arbitrary scattered positions. The illustration `<img>` and its sparkles
 * are both children of one wrapper `<div>` (per a further follow-up: "only
 * then the sparkles also rotate along with dotted SVG") whose own
 * `aspect-ratio: 823.823 / 573.604` locks it to the SVG's native viewBox
 * regardless of the panel's actual rendered size — this is what lets each
 * sparkle's top/left percentage land on the same real dot at any viewport
 * width, and lets the whole group (dots + sparkles) rotate together as one
 * rigid unit via the shared `lumen-hero-rotate` class on the wrapper,
 * rather than the sparkles staying fixed while the dots sway under them.
 * New tokens: `motion.duration.hero-rotate`/`hero-glimmer` (both
 * explicitly flagged non-Figma-sourced in `motion.json`, matching the
 * existing `duration.toast` precedent for this exact situation); the
 * keyframes themselves (`lumen-hero-rotate`/`lumen-hero-glimmer`) are
 * emitted globally by `packages/tokens/scripts/build.mjs`, the same
 * mechanism already used for `lumen-skeleton-pulse`/`lumen-toast-progress`,
 * each with its own `prefers-reduced-motion: reduce` fallback per
 * `docs/accessibility.md` §3.6.
 */
export function EnterpriseLoginPage({
  logo,
  heroTitle = "The intelligence layer for the work your enterprise already does.",
  heroDescription = "Contract intelligence, support copilots, and knowledge search — governed, auditable, and running inside your own security perimeter.",
  complianceBadges = ["SOC 2 Type II", "ISO 27001", "GDPR", "HIPAA"],
  dataResidencyNote,
  statusText,
  statusHref,
  userName = "there",
  lastSignIn,
  recentWorkspaces = [],
  ssoProviders = ["microsoft", "google", "okta"],
  region = "EU (Frankfurt)",
  orgName = "your workspace",
  onSubmitCredentials,
  onStartPasskey,
  onVerifyMfaCode,
  onSsoSignIn,
  onComplete,
  initialScreen = "sign-in"
}: EnterpriseLoginPageProps) {
  const [screen, setScreen] = useState<"sign-in" | "passkey" | "mfa" | "done">(initialScreen);
  // Intentionally depends only on `screen`, not `onComplete` — fires once per transition to "done", not on every render.
  useEffect(() => {
    if (screen === "done") onComplete?.();
  }, [screen]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);

  const orgHint = detectOrgHint(email);
  const showOrgHint = email.includes("@") && !email.endsWith("@");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await onSubmitCredentials?.(email, password);
    setLoading(false);
    if (result && result.success === false) {
      setError(result.error ?? "That didn't work. Please try again.");
      return;
    }
    setScreen("mfa");
  }

  async function handleStartPasskey() {
    setScreen("passkey");
    const result = await onStartPasskey?.();
    if (result === false) {
      setScreen("sign-in");
      return;
    }
    setScreen("done");
  }

  async function handleVerifyMfa() {
    setLoading(true);
    const result = await onVerifyMfaCode?.(code.join(""));
    setLoading(false);
    if (result === false) return;
    setScreen("done");
  }

  function handleCodeChange(index: number, e: ChangeEvent<HTMLInputElement>) {
    const digit = e.target.value.replace(/\D/g, "").slice(-1);
    setCode((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    // The 6 code cells render as direct-sibling <input> elements with no
    // wrapper (see InternalInput), so the next cell is a plain DOM walk —
    // avoids needing ref-forwarding support on the public `Input` wrapper,
    // which doesn't have it (see Button.tsx's docblock for the same gap,
    // fixed there because Tooltip positioning needed it; not needed here).
    if (digit && index < code.length - 1) {
      (e.target.nextElementSibling as HTMLInputElement | null)?.focus();
    }
  }

  const brand = logo ?? <LumenLogo className="h-[22px] w-[22px] shrink-0" title="Lumen" />;
  const mfaComplete = code.every((d) => d !== "");

  return (
    <div className="flex min-h-screen flex-col items-center bg-[var(--color-background-app)] py-[var(--spacing-24)]">
      <div className="grid w-full max-w-[1512px] grid-cols-1 overflow-hidden rounded-lg bg-[var(--color-background-default)] text-[var(--color-text-body)] shadow-[var(--shadow-elevation-sm),0_24px_64px_rgba(0,0,0,0.10)] desktop:min-h-[860px] desktop:grid-cols-[1.02fr_1fr]">
        <HeroPanel
          brand={brand}
          heroTitle={heroTitle}
          heroDescription={heroDescription}
          complianceBadges={complianceBadges}
          dataResidencyNote={dataResidencyNote}
          statusText={statusText}
          statusHref={statusHref}
        />

        <main className="flex min-w-0 flex-col bg-[var(--color-background-app)]">
          <header className="flex items-center gap-[var(--spacing-10)] p-[var(--spacing-24)] desktop:hidden">
            {brand}
            <span className="font-brand text-title-md text-[var(--color-text-title)]">Lumen AI</span>
          </header>

          <div className="flex flex-1 items-center justify-center px-[var(--spacing-32)] py-[var(--spacing-40)]">
            <div className="w-full max-w-[408px]">
              {screen === "sign-in" && (
                <SignInScreen
                  userName={userName}
                  lastSignIn={lastSignIn}
                  recentWorkspaces={recentWorkspaces}
                  ssoProviders={ssoProviders}
                  onSsoSignIn={onSsoSignIn}
                  onStartPasskey={handleStartPasskey}
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  remember={remember}
                  setRemember={setRemember}
                  loading={loading}
                  error={error}
                  setError={setError}
                  showOrgHint={showOrgHint}
                  orgHint={orgHint}
                  onSubmit={handleSubmit}
                />
              )}
              {screen === "passkey" && (
                <PasskeyScreen onCancel={() => setScreen("sign-in")} onUseAnotherMethod={() => setScreen("mfa")} />
              )}
              {screen === "mfa" && (
                <MfaScreen
                  code={code}
                  onCodeChange={handleCodeChange}
                  onBack={() => setScreen("sign-in")}
                  onVerify={handleVerifyMfa}
                  loading={loading}
                  mfaComplete={mfaComplete}
                  remember={remember}
                  setRemember={setRemember}
                />
              )}
              {screen === "done" && <DoneScreen orgName={orgName} region={region} />}
            </div>
          </div>

          <footer className="flex items-center justify-between gap-[var(--spacing-16)] border-t border-[var(--color-border-default)] px-[var(--spacing-24)] py-[var(--spacing-16)] text-[11px] font-normal leading-[16px]">
            <span className="text-[var(--color-text-muted)]">© 2026 Lumen AI, Inc.</span>
            <div className="flex items-center gap-[var(--spacing-16)]">
              <TextLink href="#privacy" className="text-[var(--color-text-secondary)]">
                Privacy
              </TextLink>
              <TextLink href="#terms" className="text-[var(--color-text-secondary)]">
                Terms
              </TextLink>
              <TextLink href="#security" className="text-[var(--color-text-secondary)]">
                Security
              </TextLink>
              <TextLink href="#status" className="text-[var(--color-text-secondary)]">
                Status
              </TextLink>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

function HeroPanel({
  brand,
  heroTitle,
  heroDescription,
  complianceBadges,
  dataResidencyNote,
  statusText,
  statusHref
}: {
  brand: ReactNode;
  heroTitle: string;
  heroDescription: string;
  complianceBadges: string[];
  dataResidencyNote?: string;
  statusText?: string;
  statusHref?: string;
}) {
  return (
    <aside className="relative hidden min-w-0 flex-col justify-between overflow-hidden bg-[var(--color-primary-900)] p-[var(--spacing-56)] pb-[var(--spacing-40)] text-[var(--color-auth-hero-text-title)] desktop:flex">
      <svg
        viewBox="0 0 600 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <defs>
          <radialGradient id="lm-auth-hero-glow" cx="70%" cy="22%" r="60%">
            <stop offset="0%" style={{ stopColor: "var(--color-primary-500)", stopOpacity: 0.55 }} />
            <stop offset="100%" style={{ stopColor: "var(--color-primary-900)", stopOpacity: 0 }} />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="600" height="900" fill="url(#lm-auth-hero-glow)" />
      </svg>
      {/* Exact Figma-exported illustration (node 1537:1821, a transparent dot-pattern vector — the Figma file's own layer was reorganized/cleaned up since this was first sourced, replacing the old deeply-nested "Asset 1 1" group with this one flat vector) — positioned at its real x=-53.23/y=73.95/w=823.82 offsets within its 720-wide reference frame, expressed as percentages so it scales with this panel's actual (responsive) width.
          Wrapped (rather than positioning the <img> directly) so the sparkle
          overlay below can share its exact coordinate space: this div's own
          `aspect-ratio` locks it to the SVG's native 823.823x573.604 viewBox
          regardless of the panel's actual rendered size, so each sparkle's
          top/left percentage lands on the same real dot at any viewport
          width, and the whole group (dots + sparkles) rotates together as
          one rigid unit via the shared `lumen-hero-rotate` class. */}
      <div
        aria-hidden="true"
        className="lumen-hero-rotate pointer-events-none absolute left-[-7.4%] top-[8.2%] w-[114.4%]"
        style={{ aspectRatio: "823.823 / 573.604" }}
      >
        <img src={heroIllustrationAsset} alt="" className="block h-full w-full max-w-none" />
        {/* Ambient sparkle overlay — direct user request ("subtle rotating animation with mild glittering effects... sparkles should be on the dots in the dotted SVG"), no Figma source; approved after confirming Figma has no animated version of this background. Five small radial-gradient highlights, each centered exactly on a real dot's own path coordinates (read directly from enterprise-login-hero.svg, converted to percentages of its 823.823x573.604 viewBox: (411.9,312.8)->50.0%/54.5%, (514.2,226.9)->62.4%/39.5%, (204.9,299.7)->24.9%/52.2%, (291.1,442.0)->35.3%/77.1%, (651.6,485.8)->79.1%/84.7%), each on the shared `lumen-hero-glimmer` keyframe (see motion.json/build.mjs) staggered via the existing skeleton stagger fractions (0/0.075/0.15/0.225/0.3 of the 3s loop = 0/225/450/675/900ms) so they twinkle independently rather than in lockstep. */}
        {[
          { top: "54.5%", left: "50.0%", size: 6, delay: 0 },
          { top: "39.5%", left: "62.4%", size: 8, delay: 225 },
          { top: "52.2%", left: "24.9%", size: 5, delay: 450 },
          { top: "77.1%", left: "35.3%", size: 7, delay: 675 },
          { top: "84.7%", left: "79.1%", size: 6, delay: 900 }
        ].map((sparkle, i) => (
          <span
            key={i}
            className="lumen-hero-glimmer pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={
              {
                top: sparkle.top,
                left: sparkle.left,
                width: sparkle.size,
                height: sparkle.size,
                background: "radial-gradient(circle, var(--color-neutral-white) 0%, transparent 70%)",
                "--lumen-glimmer-delay": `${sparkle.delay}ms`
              } as CSSProperties
            }
          />
        ))}
      </div>

      <div className="relative flex items-center gap-[var(--spacing-8)]">
        {brand}
        <span className="font-brand text-[16px] font-semibold leading-[24px] text-[var(--color-neutral-white)]">
          Lumen AI
        </span>
        <span className="border-l border-[var(--color-auth-hero-divider)] pl-[var(--spacing-12)] text-body-sm font-medium text-[var(--color-auth-hero-text-label)]">
          Enterprise
        </span>
      </div>

      <div className="relative flex max-w-[460px] flex-col gap-[var(--spacing-24)]">
        <h2 className="font-editorial text-headline-lg m-0 tracking-[-1.5px] text-balance">{heroTitle}</h2>
        <p className="m-0 max-w-[420px] text-body-md text-[var(--color-auth-hero-text-body)] text-balance">
          {heroDescription}
        </p>
        {statusText && (
          <div className="flex items-center gap-[var(--spacing-8)] text-body-sm text-[var(--color-auth-hero-text-body)]">
            <span
              aria-hidden="true"
              className="size-[7px] rounded-full bg-[var(--color-auth-hero-status-dot)]"
            />
            <span>{statusText}</span>
            {statusHref && (
              <>
                <span aria-hidden="true" className="text-[var(--color-auth-hero-divider)]">
                  ·
                </span>
                <TextLink
                  href={statusHref}
                  className="text-[var(--color-auth-hero-text-body)] underline underline-offset-[3px]"
                >
                  {statusHref.replace(/^https?:\/\//, "")}
                </TextLink>
              </>
            )}
          </div>
        )}
      </div>

      <div className="relative flex flex-col gap-[var(--spacing-16)]">
        {complianceBadges.length > 0 && (
          <div className="flex flex-wrap gap-[var(--spacing-8)]">
            {complianceBadges.map((label) => (
              <span
                key={label}
                className="rounded-[var(--radius-pill)] border border-[var(--color-auth-hero-badge-border)] px-[var(--spacing-12)] py-[var(--spacing-6)] text-body-xs font-medium text-[var(--color-auth-hero-badge-text)]"
              >
                {label}
              </span>
            ))}
          </div>
        )}
        {dataResidencyNote && (
          <p className="m-0 font-mono text-app-caption text-[var(--color-auth-hero-text-caption)]">
            {dataResidencyNote}
          </p>
        )}
      </div>
    </aside>
  );
}

function RecentWorkspaces({ workspaces }: { workspaces: EnterpriseLoginWorkspace[] }) {
  if (workspaces.length === 0) return null;
  return (
    <div className="flex flex-col gap-[var(--spacing-8)]">
      <span className="text-body-xs font-medium text-[var(--color-text-secondary)]">Recent workspaces</span>
      <div className="flex flex-wrap gap-[var(--spacing-8)]">
        {workspaces.map((workspace, i) => (
          <button
            key={workspace.id}
            type="button"
            className={`inline-flex h-[var(--spacing-34)] items-center gap-[var(--spacing-8)] rounded-[var(--radius-pill)] py-0 pl-[var(--spacing-8)] pr-[var(--spacing-14)] text-body-sm font-medium transition-colors ${
              i === 0 ? "" : "hover:bg-[var(--color-background-subtle)]"
            }`}
            style={
              i === 0
                ? {
                    border: "1px solid var(--color-button-secondary-border)",
                    background: "var(--color-button-secondary-bg)",
                    color: "var(--color-button-secondary-on-action)"
                  }
                : {
                    border: "1px solid var(--color-lumen-gray-200)",
                    color: "var(--color-text-title)"
                  }
            }
          >
            {/* Sizes/radii match Figma's literal instances exactly (20px active avatar vs 16.8px inactive, neither fully round) — not general type-scale values worth tokens. */}
            <span
              className="flex items-center justify-center font-bold"
              style={
                i === 0
                  ? {
                      width: "20px",
                      height: "20px",
                      borderRadius: "8px",
                      fontSize: "8.33px",
                      background: "var(--color-primary-500)",
                      color: "var(--color-text-inverse)"
                    }
                  : {
                      width: "16.8px",
                      height: "16.8px",
                      borderRadius: "4.44px",
                      fontSize: "10.5px",
                      background: "var(--color-lumen-gray-600)",
                      color: "var(--color-text-inverse)"
                    }
              }
            >
              {workspace.initial}
            </span>
            {workspace.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function SsoProviderButton({
  provider,
  onClick
}: {
  provider: EnterpriseLoginSsoProvider;
  onClick?: () => void;
}) {
  return (
    <Button
      type="button"
      variant="neutral"
      className="h-[var(--spacing-40)] text-body-sm font-medium"
      aria-label={`Continue with ${ssoProviderLabel[provider]}`}
      onClick={onClick}
    >
      <span aria-hidden="true">
        {provider === "microsoft" && (
          <svg width="17" height="17" viewBox="0 0 16 16">
            <rect x="0" y="0" width="7" height="7" fill="currentColor" opacity={0.85} />
            <rect x="9" y="0" width="7" height="7" fill="currentColor" opacity={0.55} />
            <rect x="0" y="9" width="7" height="7" fill="currentColor" opacity={0.55} />
            <rect x="9" y="9" width="7" height="7" fill="currentColor" opacity={0.3} />
          </svg>
        )}
        {provider === "google" && (
          <svg width="17" height="17" viewBox="0 0 16.8 16.7999" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              fill="currentColor"
              d="M16.6501 6.72329H8.57749C8.57749 7.56282 8.57749 9.24172 8.57234 10.0812H13.2502C13.0709 10.9208 12.4354 12.0963 11.5374 12.6882C11.5374 12.6882 11.5357 12.6931 11.534 12.6923C10.34 13.4806 8.76447 13.6595 7.59458 13.4244C5.76083 13.0601 4.3096 11.7302 3.72037 10.041C3.7238 10.0385 3.72638 10.0152 3.72896 10.0136C3.36015 8.96583 3.36015 7.56282 3.72896 6.72329H3.7281C4.20326 5.18024 5.69821 3.77242 7.53453 3.38708C9.01148 3.07394 10.678 3.41292 11.9036 4.55972C12.0666 4.40021 14.1593 2.35688 14.3163 2.19065C10.129 -1.60149 3.42447 -0.267524 0.91572 4.62944H0.914862C0.914862 4.62944 0.915726 4.62964 0.910581 4.63888C-0.330501 7.04412 -0.279041 9.87829 0.919155 12.1685C0.915725 12.171 0.913153 12.1726 0.910581 12.1751C1.99642 14.2823 3.97254 15.8984 6.3535 16.5137C8.88283 17.177 12.1017 16.7237 14.258 14.7734L14.2606 14.7759C16.0875 13.1304 17.2247 10.3274 16.6501 6.72329Z"
            />
          </svg>
        )}
        {provider === "okta" && (
          <svg width="17" height="17" viewBox="0 0 12.6 12.6" fill="none">
            <path
              fill="currentColor"
              d="M6.3 0C2.8287 0 0 2.808 0 6.3C0 9.792 2.8089 12.6 6.3 12.6C9.7911 12.6 12.6 9.7911 12.6 6.3C12.6 2.8089 9.7713 0 6.3 0ZM6.3 9.45C4.554 9.45 3.15 8.046 3.15 6.3C3.15 4.554 4.554 3.15 6.3 3.15C8.046 3.15 9.45 4.554 9.45 6.3C9.45 8.046 8.046 9.45 6.3 9.45Z"
            />
          </svg>
        )}
      </span>
      {ssoProviderLabel[provider]}
    </Button>
  );
}

interface SignInScreenProps {
  userName: string;
  lastSignIn?: string;
  recentWorkspaces: EnterpriseLoginWorkspace[];
  ssoProviders: EnterpriseLoginSsoProvider[];
  onSsoSignIn?: (provider: EnterpriseLoginSsoProvider) => void;
  onStartPasskey: () => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  remember: boolean;
  setRemember: (value: boolean) => void;
  loading: boolean;
  error: string;
  setError: (value: string) => void;
  showOrgHint: boolean;
  orgHint: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

function SignInScreen({
  userName,
  lastSignIn,
  recentWorkspaces,
  ssoProviders,
  onSsoSignIn,
  onStartPasskey,
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  remember,
  setRemember,
  loading,
  error,
  setError,
  showOrgHint,
  orgHint,
  onSubmit
}: SignInScreenProps) {
  return (
    <div className="flex flex-col gap-[var(--spacing-24)]">
      <div className="flex flex-col gap-[var(--spacing-4)]">
        <h1 className="m-0 font-editorial text-headline-md font-semibold tracking-[-0.5px] text-[var(--color-text-primary)]">
          Welcome back, {userName}.
        </h1>
        {lastSignIn && <p className="m-0 text-body-sm text-[var(--color-text-secondary)]">{lastSignIn}</p>}
      </div>

      <RecentWorkspaces workspaces={recentWorkspaces} />

      <div className="flex flex-col gap-[var(--spacing-8)]">
        <Button
          type="button"
          className="h-[var(--spacing-40)] w-full px-[var(--spacing-14)] text-body-md font-medium"
          onClick={onStartPasskey}
        >
          <KeyIcon className="size-[18px]" aria-hidden="true" />
          Continue with passkey
        </Button>
        <p className="m-0 text-center text-body-xs text-[var(--color-text-secondary)]">
          Face ID, Touch ID or security key · fastest and phishing-resistant
        </p>
      </div>

      {ssoProviders.length > 0 && (
        <div className="flex flex-col gap-[var(--spacing-2)]">
          <div className="grid grid-cols-3 gap-[var(--spacing-8)]">
            {ssoProviders.map((provider) => (
              <SsoProviderButton key={provider} provider={provider} onClick={() => onSsoSignIn?.(provider)} />
            ))}
          </div>
          <Button
            type="button"
            variant="ghost"
            className="h-[var(--spacing-34)] self-center text-body-xs font-normal text-[var(--color-text-secondary)] hover:bg-[var(--color-background-subtle)] hover:text-[var(--color-text-title)]"
          >
            More options — SAML, Azure AD, magic link, QR sign-in
          </Button>
        </div>
      )}

      <div className="flex items-center gap-[var(--spacing-16)]">
        <span className="h-px flex-1 bg-[var(--color-border-default)]" />
        <span className="font-mono text-body-xs uppercase text-[var(--color-text-secondary)]">or use email</span>
        <span className="h-px flex-1 bg-[var(--color-border-default)]" />
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-[var(--spacing-24)]">
        <div className="flex flex-col gap-[var(--spacing-4)]">
          <label htmlFor="lm-enterprise-email" className="text-body-sm font-medium text-[var(--color-text-secondary)]">
            Work email
          </label>
          <Input
            id="lm-enterprise-email"
            type="email"
            size="sm"
            placeholder="you@company.com"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {showOrgHint && orgHint && (
            <span className="flex items-start gap-[var(--spacing-8)] text-body-xs text-[var(--color-text-brand)]">
              <LmAisymbolIcon className="mt-px size-[13px] shrink-0 text-[var(--color-primary-500)]" aria-hidden="true" />
              <span>{orgHint}</span>
            </span>
          )}
        </div>

        <div className="flex flex-col gap-[var(--spacing-4)]">
          <div className="flex items-baseline justify-between gap-[var(--spacing-12)]">
            <label
              htmlFor="lm-enterprise-password"
              className="text-body-sm font-medium text-[var(--color-text-secondary)]"
            >
              Password
            </label>
            <TextLink href="#forgot" className="text-body-xs">
              Forgot password?
            </TextLink>
          </div>
          <div className="relative flex">
            <Input
              id="lm-enterprise-password"
              type={showPassword ? "text" : "password"}
              size="sm"
              placeholder="Enter your password"
              autoComplete="current-password"
              aria-invalid={!!error}
              className="pr-9"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-[6px] top-[6px] inline-flex size-6 items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-background-subtle)] hover:text-[var(--color-text-title)]"
            >
              {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
            </button>
          </div>
          {error && (
            <p role="alert" className="m-0 text-label-md text-[var(--color-status-error)]">
              {error}
            </p>
          )}
        </div>

        <div className="inline-flex items-center gap-[var(--spacing-8)]">
          <Checkbox
            id="lm-enterprise-remember-signin"
            checked={remember}
            onCheckedChange={(checked) => setRemember(checked === true)}
          />
          <label
            htmlFor="lm-enterprise-remember-signin"
            className="cursor-pointer text-body-sm text-[var(--color-text-secondary)]"
          >
            Remember this device for 30 days
          </label>
        </div>

        <Button
          type="submit"
          variant="neutral"
          disabled={loading}
          className="h-[var(--spacing-40)] w-full px-[var(--spacing-14)] text-body-md font-medium"
        >
          {loading && (
            <span
              aria-hidden="true"
              className="size-4 animate-spin rounded-full border-2 border-[var(--color-border-default)] border-t-[var(--color-primary-500)]"
            />
          )}
          {loading ? "Verifying…" : "Continue with email"}
        </Button>
      </form>

      <div className="flex gap-[var(--spacing-8)] rounded-[var(--radius-button)] bg-[var(--color-lumen-gray-100)] px-[var(--spacing-24)] py-[var(--spacing-16)]">
        <LmAisymbolIcon className="mt-0.5 size-[18px] shrink-0 text-[var(--color-primary-500)]" aria-hidden="true" />
        <div className="flex flex-col gap-[var(--spacing-8)]">
          <span className="text-body-xs font-medium text-[var(--color-text-title)]">Adaptive authentication</span>
          <span className="text-body-xs text-[var(--color-text-body)]">
            This device and network are recognized, so we'll only ask for a second factor if something changes.{" "}
            <TextLink href="#adaptive">How this works</TextLink>
          </span>
        </div>
      </div>

      <p className="m-0 text-center text-body-sm text-[var(--color-text-secondary)]">
        New to Lumen? <TextLink href="#create">Create an account</TextLink> or{" "}
        <TextLink href="#sales">talk to sales</TextLink>
      </p>
    </div>
  );
}

function PasskeyScreen({ onCancel, onUseAnotherMethod }: { onCancel: () => void; onUseAnotherMethod: () => void }) {
  return (
    <div className="flex flex-col items-center gap-[var(--spacing-32)] py-[var(--spacing-24)] text-center">
      <div className="relative flex size-[112px] items-center justify-center">
        <span
          aria-hidden="true"
          className="absolute inset-0 animate-ping rounded-full border border-[var(--color-primary-500)]"
        />
        <span className="flex size-[72px] items-center justify-center rounded-full bg-[var(--color-primary-500-a10)] text-[var(--color-primary-500)]">
          <FingerprintPatternIcon className="size-[30px]" aria-hidden="true" />
        </span>
      </div>
      <div className="flex flex-col gap-[var(--spacing-10)]">
        <h1 className="m-0 font-editorial text-headline-md font-semibold text-[var(--color-text-title)]">Waiting for your passkey</h1>
        <p className="m-0 max-w-[340px] text-body-sm text-[var(--color-text-secondary)]">
          Confirm with Face ID, Touch ID or your security key. Nothing leaves this device — the key never reaches our
          servers.
        </p>
      </div>
      <div className="flex w-full flex-col gap-[var(--spacing-12)]">
        <Button type="button" variant="outline" className="h-11 w-full" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onUseAnotherMethod}>
          Use a different method
        </Button>
      </div>
    </div>
  );
}

function MfaScreen({
  code,
  onCodeChange,
  onBack,
  onVerify,
  loading,
  mfaComplete,
  remember,
  setRemember
}: {
  code: string[];
  onCodeChange: (index: number, e: ChangeEvent<HTMLInputElement>) => void;
  onBack: () => void;
  onVerify: () => void;
  loading: boolean;
  mfaComplete: boolean;
  remember: boolean;
  setRemember: (value: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-[var(--spacing-28)]">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="self-start text-[var(--color-text-secondary)]"
        onClick={onBack}
      >
        <ChevronLeftIcon className="size-[15px]" aria-hidden="true" />
        Back
      </Button>
      <div className="flex flex-col gap-[var(--spacing-10)]">
        <h1 className="m-0 font-editorial text-headline-md font-semibold text-[var(--color-text-title)]">Verify it's you</h1>
        <p className="m-0 text-body-sm text-[var(--color-text-secondary)]">
          Enter the 6-digit code from Lumen Authenticator, or the SMS we sent to your registered number.
        </p>
      </div>
      <div role="group" aria-label="Verification code" className="grid grid-cols-6 gap-[var(--spacing-8)]">
        {code.map((digit, i) => (
          <Input
            key={i}
            inputMode="numeric"
            maxLength={1}
            aria-label={`Digit ${i + 1}`}
            value={digit}
            onChange={(e) => onCodeChange(i, e)}
            className="h-14 p-0 text-center text-headline-sm font-semibold"
          />
        ))}
      </div>
      <div className="flex items-center justify-between gap-[var(--spacing-12)] text-body-sm text-[var(--color-text-secondary)]">
        <span>
          Didn't get it? <TextLink href="#resend">Resend code</TextLink>
        </span>
      </div>
      <div className="flex flex-col gap-[var(--spacing-8)] rounded-[var(--radius-lg)] border border-[var(--color-border-default)] p-[var(--spacing-14)] px-[var(--spacing-16)]">
        <span className="text-body-sm font-semibold text-[var(--color-text-title)]">Other methods</span>
        <div className="flex flex-wrap gap-[var(--spacing-8)]">
          <Button type="button" variant="outline" size="sm">
            Security key
          </Button>
          <Button type="button" variant="outline" size="sm">
            Magic link by email
          </Button>
          <Button type="button" variant="outline" size="sm">
            <ScanQrCodeIcon className="size-[14px]" aria-hidden="true" />
            Scan QR with mobile app
          </Button>
        </div>
      </div>
      <div className="inline-flex min-h-11 items-center gap-[var(--spacing-10)]">
        <Checkbox
          id="lm-enterprise-remember-mfa"
          checked={remember}
          onCheckedChange={(checked) => setRemember(checked === true)}
        />
        <label htmlFor="lm-enterprise-remember-mfa" className="cursor-pointer text-body-sm text-[var(--color-text-body)]">
          Trust this device for 30 days
        </label>
      </div>
      <Button type="button" disabled={!mfaComplete || loading} className="h-12 w-full" onClick={onVerify}>
        {loading && (
          <span
            aria-hidden="true"
            className="size-4 animate-spin rounded-full border-2 border-white/35 border-t-white"
          />
        )}
        Verify and continue
      </Button>
    </div>
  );
}

function DoneScreen({ orgName, region }: { orgName: string; region: string }) {
  return (
    <div className="flex flex-col items-center gap-[var(--spacing-20)] py-[var(--spacing-40)] text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-[var(--color-primary-500-a10)] text-[var(--color-primary-500)]">
        <CheckCircleFilledIcon className="size-7" aria-hidden="true" />
      </span>
      <h1 className="m-0 font-editorial text-headline-md font-semibold text-[var(--color-text-title)]">Signed in</h1>
      <p className="m-0 text-body-sm text-[var(--color-text-secondary)]">
        Taking you to {orgName} · {region}
      </p>
      <span
        aria-hidden="true"
        className="size-[18px] animate-spin rounded-full border-2 border-[var(--color-border-default)] border-t-[var(--color-primary-500)]"
      />
    </div>
  );
}
