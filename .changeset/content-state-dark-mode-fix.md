---
"@lumen/tokens": patch
"@lumen/ui": patch
---

Corrected `ContentState`'s dark-mode colors against the first real Figma Dark instances for all 3 variants. Every color role had been borrowed from a shared generic token (`background.app`, `text.body`, `text.secondary`/`.tertiary`, `border.table`/`.subtle`, `background.raised`/`.nav-active`, `status.error`/`.-subtle`) whose dark value diverged from ContentState's real values — replaced with a new, fully self-contained `content-state.*` token group (11 fields, light+dark). Also fixed two independent light-mode bugs found in the same audit: the skeleton bars' border color never matched Figma's real value, and the Empty-state icon glyph's color was wrong in both themes (it's bound to a distinct Figma variable, not the `text.secondary` role previously assumed).
