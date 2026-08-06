---
"@lumen/tokens": patch
---

Corrected `dark.border.focus` to `deep-purple.300` (`#9E86D0`), matching Figma's live `stroke/focus` binding, which aliases `_base/Accent/Purple` → Deep Purple/300 in dark mode. A raw W3C-format export of Figma's Dark/Light token collections (including explicit variable alias chains) confirmed this binding is real and current — superseding an earlier same-day correction to `primary.200`, which was based on a mistaken claim that no `border/focus`/`stroke/focus` variable existed in the file. `light.border.focus` is unaffected (`primary.500`, already matching Figma's `stroke/focus` light value exactly).
