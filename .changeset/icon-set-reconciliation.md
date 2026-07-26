---
"@lumen/ui": minor
---

Added 5 missing icons to the generated icon set (`lm-ai`, `lm-project-filled`, `lm-grammer`, `lm-loader`, `lm-bot-static`), reconciling the current Figma file's icon reference sheets against what had actually been generated (most existing icons were sourced from an older, unrelated library). Fixed a real bug found in `lm-loader`'s source: its SVG `<mask>` relied on a literal `fill="white"` for luminance, which the icon pipeline's color-flattening regex would have broken by rewriting it to `currentColor` — rewritten as an equivalent `<clipPath>` instead, which isn't sensitive to fill color. `lm-bot-animated` (needs a new `motion/react` dependency and has no real Figma keyframe data yet) and two raster-only brand logos (Tableau, UiPath) were not added — see `docs/roadmap.md` Phase 16.
