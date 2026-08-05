---
"@lumen/tokens": patch
"@lumen/ui": minor
"@lumen/web-components": minor
"@lumen/angular": minor
---

Corrected Button's `neutral` variant and added a new `neutral-solid` variant, plus two new `IconButton` variants, per a fresh Figma audit (node `1565:3797`, canonical Button set `1174:1349`; node `1565:3815`, a dedicated icon-only reference frame). `neutral`'s hover state was a real bug — it lightened (`neutral.50`) instead of Figma's real solid dark fill (`lumen-gray.800`) with text flipping to white; both fixed. A second, previously undocumented Figma style, `Style=Neutral Solid` (permanent dark fill, hovers to pure black), had no code equivalent anywhere — added as `neutral-solid` to React `Button`, and to Web Components' and Angular's `lumen-button` (neither has a plain `neutral`/outline-style variant at all, a deliberate, documented asymmetry — only the explicitly-requested `neutral-solid` was added there). `IconButton` gained `neutral-outline` and `neutral-solid`, matching Figma's icon-only "Outline"/"Solid" types exactly and reusing the same Button tokens. New tokens' dark values have no Figma dark evidence and mirror light exactly, by direct user decision, since these are inherently dark-styled treatments regardless of app theme.
