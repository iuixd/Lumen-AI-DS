---
"@lumen/tokens": patch
---

Corrected 3 generic dark-mode color tokens found during a structured audit of `docs/figma-source.md`'s "exact color values" known-limitation: `dark.status.success` and `dark.status.warning` were unverified ramp-mirror guesses (now `status.green`/`status.amber`, matching the same values already confirmed for Toast's own scoped accents). `dark.badge.default-bg` was claimed correct in an earlier audit but was actually still wrong (now `teal.900`).
