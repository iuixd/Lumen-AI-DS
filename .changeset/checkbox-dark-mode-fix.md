---
"@lumen/tokens": patch
"@lumen/ui": patch
---

Corrected `Checkbox`'s dark-mode colors against the first real Figma Dark instances for this collection. `radio-checkbox-disabled-fill` (dark) was a `neutral.600` placeholder, now `nightshade.950`/#17101A. Added a new `input.radio-checkbox-hover-bg` token (light `lumen-gray.50`, dark `nightshade.800`) for Figma's Hover-state background fill, which the component previously never implemented in either theme (only the border color changed on hover). All other fields were already correct via the same-day Input/Radio dark-mode fixes this component reuses directly.
