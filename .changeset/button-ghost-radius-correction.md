---
"@lumen/tokens": patch
"@lumen/ui": patch
---

Correct `Button`'s Ghost variant colors, radius, and Outline border width to match Figma
exactly, after a full re-audit of the canonical Button collection (node `1174:1349`).

Ghost's text/hover-background now use `primary.500`/`primary.50` (was a generic gray/dark-neutral
pairing). Radius is now a dedicated `radius.button` token (10px, was an untokened 6px/documented
8px). Outline's border is now 1.5px (was 1px). Visual-only — no prop, class, or token name changed.
