---
"@lumen/ui": patch
"@lumen/web-components": patch
"@lumen/angular": patch
---

Fix `AIButton`'s default leading icon to match the Figma-approved `lm-aisymbol` glyph instead of a generic sparkle, across React, Web Components, and Angular. `icon` overrides (React prop, Web Components `<span slot="icon">`, Angular `[icon]` `TemplateRef`) are unaffected.
