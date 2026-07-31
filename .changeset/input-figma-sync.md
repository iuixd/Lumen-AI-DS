---
"@lumen/tokens": minor
"@lumen/ui": minor
"@lumen/patterns": patch
---

Rewrite `Input` (`@lumen/ui`) to match the canonical Figma Input collection (node `1262:1181`): new `size` (`sm`/`md`/`lg`, default `md`, replacing the native HTML `size` attribute) and `variant` (`primary`/`search`) props, correct per-size/per-state border widths and colors, and a corrected 10px radius (new `--radius-input` token in `@lumen/tokens`). `AuthForm`, `CrudListPage`, `EnterpriseLoginPage`, `AIPanel`, and `InputGroup` (`@lumen/patterns`/`@lumen/ui`) updated to pass `size="sm"` where needed to preserve their existing verified layouts against the new default.
