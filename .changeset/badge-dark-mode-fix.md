---
"@lumen/tokens": patch
---

Corrected 6 of `Badge`'s 10 dark-mode background colors (plus `gray`/`yellow` text colors) against the first real Figma evidence for Badge's dark theme — node `1079:893` published 30 new `Theme=Dark` instances for the first time; every dark value had previously been an unverified ramp-mirror guess. `gray-bg` was aliasing the wrong primitive family entirely; `error`/`purple`/`light-blue`/`yellow`/`pink`-bg each needed a different, family-specific ramp step correction. `default`/`success`/`warning`/`deep-purple` were already exact. See `packages/tokens/src/semantic/color.json`'s `_badgeDarkModeComment` for the full record. All corrected backgrounds moved darker, so WCAG contrast against the paired text only improved.
