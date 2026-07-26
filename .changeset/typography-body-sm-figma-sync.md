---
"@lumen/tokens": patch
---

Corrected `typography.scale.body-sm` (14px/22px, was 16px/24px) to match the live Figma `Body/Small` variable and this repo's own already-documented Body scale. Found during a full token verification/reconciliation pass against the Design Tokens Figma nodes; every other Body tier and all 17 color families already matched exactly. Consuming components (`text-body-sm`) render visibly smaller/tighter text as a result — no API changes.
