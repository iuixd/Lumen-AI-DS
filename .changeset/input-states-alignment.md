---
"@lumen/ui": patch
"@lumen/tokens": patch
---

Fixed the shared `Input` component's interaction states system-wide: correct border/placeholder colors (were using generic drifted bridge tokens), a proper Figma-matched Focused treatment (thicker pink border, no ring) replacing the generic focus ring, new Hover and Error states that didn't exist before, and removal of `type="search"` inputs' native browser focus glow and clear button. The Header's `SearchBar` now shows identical hover/focus behavior to `AIPanel`'s prompt input, both matching Figma's Input component exactly (including a same-day border-width correction: Hover/Error are now 2px, Focused stays 2.5px). Also corrected the dark-theme Focused border color (`input.primary/search-focused-border`), which was an unevidenced placeholder value rendering as a saturated red/crimson instead of Figma's actual soft pink (`primary.200`).
