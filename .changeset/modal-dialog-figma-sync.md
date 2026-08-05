---
"@lumen/tokens": minor
"@lumen/ui": minor
---

Added `Modal`, a thin composite over `Dialog` matching Figma's canonical "Modal" component, replacing an unrelated retired composite of the same name. Corrected `Dialog`'s default chrome to match Figma exactly: radius 8px→14px, a specific drop shadow (new `shadow.modal.default` token) instead of a generic shadow, a dark purple-tinted overlay (new `modal.overlay` token) instead of plain black, bound title/description typography (new `body-lg-w600` typography tier) instead of generic shadcn defaults, and a footer separator matching Figma's "Actions" frame. `DataExtractionOnboardingPage`'s "Remove file?" confirmation — Figma's own example content for this component — was migrated to the new `Modal` composite. Also fixes a missing explicit font-family (`font-interface`) on `Dialog`'s title/description, and adds a dedicated `modal.title-text` token for a dark-mode color that diverged from the generic token it briefly reused.
