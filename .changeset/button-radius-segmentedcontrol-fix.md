---
"@lumen/ui": patch
"@lumen/web-components": patch
"@lumen/angular": patch
---

Correct `Button`/`AIButton`/`SplitButton` corner radius (6px → 8px, `--radius/segment`) and `SegmentedControl`'s per-size padding/type (previously all sizes reused `md`'s values). Visual fixes only — no prop, event, or slot API changed.
