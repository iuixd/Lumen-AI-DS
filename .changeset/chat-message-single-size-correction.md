---
"@lumen/tokens": patch
---

Corrected `chat-message` (AIPanel bubble text) back to a single fixed size (14px/16px), reverting a same-day light/dark fork that was based on an incorrect light-mode reading. The light value (16/18) had been read from a separate documentation frame instead of the canonical AIPanel instance; re-checked directly against the canonical instance, both light and dark render at 14/16 — there was never a real per-theme difference.
