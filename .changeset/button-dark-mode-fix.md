---
"@lumen/tokens": patch
---

Corrected Button's dark-mode colors against the first real Figma evidence for Button's dark theme. `neutral`/`neutral-solid` (added same day by mirroring light, since no dark evidence existed yet) actually invert to a *light* fill/border/text in dark mode, not a darker one — real data now confirms this. `ghost-on-action` (dark) and the globally-shared `disabled-bg`/`disabled-on-action` (affecting every Button and IconButton variant in every theme) were also wrong and are now Figma-exact. `Primary`/`Secondary`/`Outline`/`Danger` dark values were all re-verified byte-exact, no change. See `packages/tokens/src/semantic/color.json`'s `_neutralButtonComment`/`_buttonComment` for the full field-by-field record.
