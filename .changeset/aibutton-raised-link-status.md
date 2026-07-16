---
"@lumen/tokens": minor
"@lumen/ui": minor
---

Add `raised`/`link` variants and a `status` (success/warning/error) modifier to `AIButton`, and correct `ChoiceChip`'s `tone="subtle"` box model (height/gap/padding/border/icon size) to match its own Figma source instead of borrowing `tone="solid"`'s. New `--spacing-38` token backs the `ChoiceChip` fix. Both found during a full visual QA re-audit of the "Buttons" page against fresh Figma Dev Mode data — additive/corrective only, no existing prop or default changed.
