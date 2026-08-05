---
"@lumen/tokens": patch
---

Corrected `Radio`'s dark-mode colors against the first real Figma Dark instances for this collection. `radio-checkbox-selected` (dark) was `neutral.white`, now `nightshade.200`/#C9C2C7. `radio-checkbox-disabled-border` (dark, previously flagged unverified) now shares the same `app-shell.dark.text-muted` primitive `primary-border` already uses. Radio's shared `input.*` base tokens were already correct via the same-day Input dark-mode fix, re-verified exact here too.
