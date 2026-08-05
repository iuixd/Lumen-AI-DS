---
"@lumen/tokens": patch
"@lumen/ui": patch
---

Corrected `Button`'s base label typography (was a 12px "helper labels" preset, never meant for button text — Figma's real bound value is 14px/22/weight-500) and two `AIPanel` dark-mode colors (`text-primary`, `link-on-action`) against fresh Figma dark-instance data. Renamed the shared `body-sm-medium` typography token to `body-sm-w500` (numeric weight suffix) since `Button` became a second consumer alongside `FileUploadProgressList` — a pure rename, no value change, no consumer-facing prop change.
