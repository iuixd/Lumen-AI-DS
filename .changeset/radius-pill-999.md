---
"@lumen/tokens": patch
---

Corrected `radius.pill` from `100` to `999`, matching the generic Radius primitive scale's authored Figma value exactly (previously sourced independently from the Badge component, which read 100). Direct user decision after confirming zero visual regression: both current consumers (`Badge`, `EnterpriseLoginPage`'s hero badges) are under ~40px tall, and CSS `border-radius` clamps to 50% of an element's shortest side, so 100 and 999 render pixel-identical for a pill shape at that size.
