---
"@lumen/tokens": patch
---

Removed Inter and Roboto Mono from the type scale (direct product decision, not yet reconciled with Figma). `sans`/`brand` now use Instrument Sans as their primary face instead of Inter; `mono`/`documentation-mono` now use Space Mono instead of Roboto Mono. The Storybook Google Fonts import was updated to match (dropped Inter, added weight 700 to the Instrument Sans request to cover the brand-mark tokens).
