---
"@lumen/tokens": patch
"@lumen/ui": patch
---

Corrected `IconButton`'s `neutral-outline` dark border — the one field that genuinely diverges from the Button `neutral` token it otherwise reuses. Figma's dedicated icon-only frame binds a different dark value (`#FFFFFF`) than Button's own Neutral Outline style (`#5E5E5E`), a real per-component difference confirmed via direct re-check, not a value to keep inheriting blindly. Added a dedicated `icon-button.neutral-outline-border` token; `Primary`/`Solid` types were re-verified byte-exact and are unaffected.
