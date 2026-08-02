---
"@lumen/ui": patch
---

Redesigned `RadioGroup`'s item to structurally match Lumen's own `Radio` primitive, which it had never been wired to at all. It previously used generic shadcn `border-primary`/`text-primary` colors (bridged to Lumen's crimson brand color) at a flat 16px/1px guess with a stroke-icon selected mark; it now reuses `Radio.tsx`'s exact `md`-size ring/dot geometry from `packages/tokens/src/input.json` — same border widths, same `--color-input-radio-checkbox-selected` selected state (border + a plain filled dot, not an icon), same disabled/hover tokens, plus a focus-visible ring it never had before. No props changed, only the rendered appearance.
