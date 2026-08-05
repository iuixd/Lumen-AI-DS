---
"@lumen/tokens": patch
"@lumen/ui": patch
---

Corrected `Button`'s label font-family — its base classes never paired the typography-scale utility with an explicit `font-interface` class, so labels silently rendered in the browser's system-UI font instead of the bound Instrument Sans webfont (a repo-wide bug found via the same investigation as the `Modal`/`Dialog` Figma sync, not limited to any one variant/size). Also corrects `dark.button.ghost-on-action` to `primary.50` (`#F9E6EC`), a further Figma-side change since its previous `primary.25` fix.
