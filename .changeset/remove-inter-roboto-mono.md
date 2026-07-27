---
"@lumen/tokens": patch
---

Removed Inter and Roboto Mono from the type scale (direct product decision, later confirmed to match a live Figma update). `sans`/`brand` now use Instrument Sans as their primary face instead of Inter; `mono` now uses Space Mono instead of Roboto Mono. The now-redundant `documentation-mono` token (identical to `mono` once both pointed at Space Mono) was removed entirely and its one consumer switched to `font-mono`. The Storybook Google Fonts import was updated to match (dropped Inter, added weight 700 to the Instrument Sans request to cover the brand-mark tokens).
