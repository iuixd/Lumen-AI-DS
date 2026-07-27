---
"@lumen/tokens": minor
"@lumen/ui": minor
---

Added the "AI Empty Communication States" treatment (Figma node 1416:3638) as a new `variant="ai"` on the existing `EmptyState` composite, rather than a new component — a branded card (solid border, circular icon badge, serif heading, up to two centered actions) for AI/chat surfaces with no conversation yet. The existing dashed-border `default` variant is unchanged. Added two new typography tokens (`ai-empty-state-title`, `ai-empty-state-body`) and two new generic semantic color roles (`icon.primary-bg`, `icon.primary`).
