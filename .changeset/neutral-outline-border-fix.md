---
"@lumen/tokens": patch
"@lumen/ui": patch
---

Corrected Button's `neutral` variant (Figma `Style=Neutral Outline`) border color and disabled state. Figma had 3 of 4 states (Disabled, Focused, Hover) misbound to the Secondary variant's border token; now fixed at the source and re-verified live via `get_variable_defs`. `button.neutral-border` (light) corrected from a near-miss value (`lumen-gray.200`) to the confirmed exact match (`neutral.100`). A new `button.neutral-disabled-border` token (light `neutral.100`, dark `neutral.600`) gives Neutral Outline a visible disabled-state border, overriding the shared base treatment that otherwise forces every variant's disabled border transparent.
