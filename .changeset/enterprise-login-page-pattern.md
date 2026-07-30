---
"@lumen/tokens": minor
"@lumen/patterns": minor
---

Add `EnterpriseLoginPage`, a new `@lumen/patterns` pattern: a multi-step enterprise sign-in
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
