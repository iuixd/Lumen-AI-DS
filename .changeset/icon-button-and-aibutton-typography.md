---
"@lumen/tokens": minor
"@lumen/ui": minor
---

Add `IconButton`, a new compact icon-only primitive, and correct `AIButton`'s label typography,
both from a re-audit of Figma node `1034:4459`.

`IconButton` reuses `Button`'s live variant vocabulary and `--color-button-*` tokens
(`default`/`destructive`/`outline`/`secondary`/`ghost`/`link`) and `AIButton`'s size scale
(`sm`/`md`/`lg`/`xl` = 30/34/38/42px). An accessible name (`aria-label`/`aria-labelledby`) is
required, matching `AIButton`'s existing dev-time warning convention.

`AIButton`'s `standard-button-{sm,md,lg,xl}` typography is corrected to match Figma exactly:
weight 600 (was 500), letter-spacing 0 (was a positive per-size value), and exact line-heights
(was unset). `lg` is now 18px/28px, identical to `xl` — Figma has no independent `Button/Large`
type variable. No breaking changes; both changes are additive/visual-only.
