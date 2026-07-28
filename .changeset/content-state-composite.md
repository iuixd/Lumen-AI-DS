---
"@lumen/tokens": minor
"@lumen/ui": minor
---

Add `ContentState`, a new composite covering the empty, loading, and error states a
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
