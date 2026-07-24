---
"@lumen/tokens": minor
"@lumen/ui": patch
---

Synced the (now-canonical, shadcn-sourced) `Button` component's colors to the canonical Figma Button component-set (node `1174:1349`), in both light and dark mode — Figma resolves dark mode via variable modes on the same node rather than a separate variant instance. Adds six new alpha-tinted primitives (`primary.500-a10`/`a16`/`a24`/`a60`, `primary.300-a24`/`a40`) and fixes `button.secondary-*`/`button.outline-hover-*`/`button.ghost-hover-bg` semantic tokens (light and dark), which had drifted from Figma's current values — `Secondary` is now a translucent brand-tinted fill rather than a solid neutral one, in both themes. `Button`'s hover, disabled, and focus-ring states — previously bound to generic shadcn bridge tokens and partially non-functional (`hover:bg-primary` was a no-op) — now bind directly to the correct `--color-button-*` tokens. No prop or variant-name changes. See `docs/shadcn-integration.md` §7.8 and the corresponding `docs/changelog.md` entries for full detail.
