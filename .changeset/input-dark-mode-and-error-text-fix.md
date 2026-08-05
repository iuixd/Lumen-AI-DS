---
"@lumen/tokens": patch
"@lumen/ui": patch
---

Corrected `Input`'s dark-mode colors against the first real Figma Dark instances for this collection (`primary-bg`/`search-bg`, `primary-hover-border`, `primary-error-border`, `search-border` were all unverified guesses that turned out wrong). Also implemented a previously-flagged, never-actioned finding: Error state's typed-value text is SemiBold at a new distinct `input.primary-text` token, plus 2px extra horizontal padding at `sm`/`md` sizes. `primary-border`/`primary-focused-border`/`primary-placeholder-text`/`search-icon`/`search-focused-border` were all re-verified exact.
