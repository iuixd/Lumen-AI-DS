---
"@lumen/tokens": minor
"@lumen/ui": minor
---

Rewrite `Checkbox` (`@lumen/ui`) to match the canonical Figma Checkbox collection (node `1278:2207`): new `size` (`sm`/`md`/`lg`, default `md`) prop and full state coverage (Default/Hover/Focused/Checked/Disabled/Error/Indeterminate), correcting a real regression from Lumen's own retired original Checkbox primitive. New/corrected tokens in `@lumen/tokens`: `input.radio-checkbox-disabled-fill` (new), `-disabled-border` (corrected), `checkbox-selected-border-width` (new). Also fixes a repo-wide Tailwind configuration gap where `aria-invalid:*` classes (used by both `Input` and `Checkbox` for their error states) silently compiled to nothing, since `invalid` was missing from the shared shadcn preset's `theme.aria` list.
