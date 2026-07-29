---
"@lumen/tokens": patch
"@lumen/ui": patch
---

Fix WCAG 2 AA color-contrast violations found in a design-system-wide accessibility audit.

`Badge`'s `success`/`warning`/`error`/`purple`/`light-blue`/`yellow`/`pink` variants all failed
4.5:1 contrast at their real rendered sizes (11–14px) — darkened each variant's text (light theme)
or background (dark theme) to the minimal existing token-ramp step that passes, no new colors
invented. `AIPanel`'s timestamp caption and "Suggested follow-ups" label (plus two Storybook demo
captions) switched from `text-tertiary` to `text-secondary` for the same reason — the same
contrast bug class already fixed on `SideNav`'s section label this session.

No breaking changes — token values only, no renamed tokens, props, or classes.
