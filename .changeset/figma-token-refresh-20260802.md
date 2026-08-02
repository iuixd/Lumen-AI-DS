---
"@lumen/tokens": minor
"@lumen/ui": patch
---

Sync a large multi-domain Figma token refresh (Lumen-AI-Design-System full Variables export, 2026-08-02):

- Corrected `status.info`/`status.info-subtle` (now alias the real evidenced `blue` ramp, `#2563EB`, uniform light/dark — the old, stale `blue` family at `#0E17FF` was deleted outright), two over-rounded alpha primitives (`primary.500-a8`, `primary.300-a20`), `radius.xl` (12px→10px), `dark.border.focus` (now `accent.purple`, `#B48EE0`), and `motion.duration.slow` (400ms→300ms, plus new `duration.slower`).
- Added new primitive families (`lumen-dark`, `nightshade`, `overlay`, `status`, `accent`), extended `blue` to a full ramp, added `radius.xxl`, confirmed 3 of 4 motion easing curves as exact Figma matches, and added 900/950 tail steps plus a systematic ~90-token alpha-tint collection across most existing color ramps (kept as foundational tokens by explicit user confirmation, even though mostly unconsumed).
- Expanded `semantic/color.json`'s `background`/`text`/`border`/`icon` vocabulary with new roles aliasing existing/new primitives.
- Added `packages/tokens/src/size.json` (component-scale dimensions); `AppShell`/`SideNav` now consume `--size-header-h`/`--size-nav-expanded`/`--size-nav-collapsed`/`--size-ai-panel-w` instead of bare `--spacing-N` references (internal class change, same rendered value, `@lumen/ui` patch).
- Added `packages/tokens/src/opacity.json`, a generic 12-step opacity primitive scale (`opacity.0`–`opacity.100`), distinct from `motion.opacity`'s two skeleton-specific keys.
- Added a responsive-typography mechanism (`tablet`/`mobile` overrides on `typography.json` scale entries, emitted as new `@media` blocks) — applied to `display-lg/md/sm`, `headline-lg/md`, and `standard-button-sm/lg/xl`, the only tiers Figma's Desktop/Tablet/Mobile export actually varies.
- Added `packages/storybook/src/Foundations.mdx`, the first Storybook page documenting the token scales.
- **Correction pass**: a live screenshot of Figma's own Variables panel showed several primitive families claimed as Figma-verified in older repo comments are not actually current Figma collections. `sand`, `lemon-green`, `japonica`, `forest`, and `icon-gray` were removed outright — the first four had zero consumers anywhere; `icon-gray`'s two values were exact duplicates of `nightshade.400`/`nightshade.300`, so its consumers (`icon.nav-default`/`icon.nav-hover`, dark theme) were repointed straight at `nightshade` with no visual change. `cobalt`, `deep-purple`, `purple`, and `pink` are still consumed by real Badge/toaster semantic tokens and don't duplicate any other family, so they're kept for now but marked "PENDING REPLACEMENT" pending real Figma-backed values from the user — do not treat their current hex values as Figma-sourced.

See `docs/changelog.md`'s `[Unreleased]` entry for the full breakdown, including the items deliberately left unresolved (`background.badge`, `radius.pill` vs. the generic scale's `999`, the unmapped Figma "Button Large"/"Button Small" typography tiers, and the still-pending `cobalt`/`deep-purple`/`purple`/`pink` replacement values).
