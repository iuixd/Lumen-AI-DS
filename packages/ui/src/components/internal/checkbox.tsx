"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/cn"

const checkAssetBySize = {
  sm: new URL("../../assets/input-checkbox-check-sm.svg", import.meta.url).href,
  md: new URL("../../assets/input-checkbox-check-md.svg", import.meta.url).href,
  lg: new URL("../../assets/input-checkbox-check-lg.svg", import.meta.url).href
}
const indeterminateAssetBySize = {
  sm: new URL("../../assets/input-checkbox-indeterminate-sm.svg", import.meta.url).href,
  md: new URL("../../assets/input-checkbox-indeterminate-md.svg", import.meta.url).href,
  lg: new URL("../../assets/input-checkbox-indeterminate-lg.svg", import.meta.url).href
}

// Every icon's actual pixel geometry — the raw SVGs declare width/height as
// "100%", which has no intrinsic size as a bare <img>, so each glyph must be
// explicitly sized per this repo's own already Figma-sourced check-*/
// indeterminate-* tokens (see input.json) rather than left to the browser's
// replaced-element default (yields an oversized, wrongly-positioned glyph).
const checkGeometryBySize = {
  sm: { width: "var(--input-check-width-sm)", height: "var(--input-check-height-sm)", x: "var(--input-check-offset-x-sm)", y: "var(--input-check-offset-y-sm)" },
  md: { width: "var(--input-check-width-md)", height: "var(--input-check-height-md)", x: "var(--input-check-offset-x-md)", y: "var(--input-check-offset-y-md)" },
  lg: { width: "var(--input-check-width-lg)", height: "var(--input-check-height-lg)", x: "var(--input-check-offset-x-lg)", y: "var(--input-check-offset-y-lg)" }
}
const indeterminateGeometryBySize = {
  sm: { width: "var(--input-indeterminate-width-sm)", height: "var(--input-indeterminate-height-sm)", x: "var(--input-indeterminate-offset-x-sm)", y: "var(--input-indeterminate-offset-y-sm)" },
  md: { width: "var(--input-indeterminate-width-md)", height: "var(--input-indeterminate-height-md)", x: "var(--input-indeterminate-offset-x-md)", y: "var(--input-indeterminate-offset-y-md)" },
  lg: { width: "var(--input-indeterminate-width-lg)", height: "var(--input-indeterminate-height-lg)", x: "var(--input-indeterminate-offset-x-lg)", y: "var(--input-indeterminate-offset-y-lg)" }
}

/**
 * Adapted from shadcn/ui's Checkbox (new-york style) — internal to
 * @lumen/ui, source for the public `Checkbox` export (promoted from
 * `ShadcnCheckbox` after Lumen's original `Checkbox` primitive was retired —
 * see docs/shadcn-integration.md §7.8). Changes:
 * - imports resolve via this repo's existing relative-import convention
 * - bare `shadow` dropped — no shadow precedent on Lumen's own `Checkbox.tsx`
 *
 * Rewritten 2026-07-31, at direct user request, against the full canonical
 * Figma Checkbox collection (node `1278:2207` — 3 sizes x 7 states: Default/
 * Hover/Focused/Checked/Disabled/Error/Indeterminate, 19 symbols; `sm` has
 * no `Disabled` symbol at all in Figma). The prior version (itself corrected
 * the same day, see the border/checked-color fix this replaces) was a single
 * fixed 16px box with no `size` prop and no Hover/Error/Indeterminate
 * styling at all — a real regression from Lumen's own retired original
 * `Checkbox` primitive, which had already been properly Figma-synced
 * (per-size geometry, exact check/indeterminate SVG exports) before that
 * primitive was replaced by this shadcn-sourced one without carrying any of
 * it over. Every value below is either that pre-existing, still-accurate
 * token data (`packages/tokens/src/input.json`'s `control-size`/
 * `indicator-size`/`focus-width`/`focus-radius`/`check-*`/`indeterminate-*`,
 * and the six already-committed `input-checkbox-{check,indeterminate}-
 * {sm,md,lg}.svg` assets) or freshly re-verified today:
 * - `size` (`sm`/`md`/`lg`, default `md`): this component's own root
 *   represents Figma's smaller "indicator" box only (16/18.667/21.333px),
 *   not its full "control" hit-target frame (24/28/32px, the checkbox
 *   centered inside with extra click-area padding) — a deliberate
 *   simplification, since neither this component nor the one it replaces
 *   ever modeled that two-layer structure, and doing so now would be a
 *   separate, larger change than a straight Figma-parity pass. Flagged,
 *   not silently dropped.
 * - Default border `input.primary-border` (#c8d1d4); Hover
 *   `input.primary-hover-border` (#626b6e); Error (`aria-invalid`)
 *   `input.primary-error-border` (#da1e28) — all pre-existing tokens,
 *   simply never wired into this component before.
 * - Focused adds a ring (not a border-width change on the box itself):
 *   `focus-width`/`focus-radius` tokens (already correct, 2.5/2.5/2.857px
 *   and 6.12/6.48/7.406px) at color `input.primary-focused-border`
 *   (#f2ccd8), offset from the box by the exact gap Figma's own control-size
 *   frame implies (`(control-size - indicator-size) / 2 - 0.5px` per size:
 *   3.5/4.17/4.83px) — computed directly from Figma's own geometry, not
 *   invented, but expressed as literal per-size values rather than three
 *   more new tokens for one derived offset.
 * - Checked/Indeterminate: bg + border `input.radio-checkbox-selected`
 *   (black/white per theme), border width now the new, Checkbox-specific
 *   `checkbox-selected-border-width` (1.143/1.329/1.518px — re-verified
 *   today to genuinely differ from the pre-existing `selection-border-
 *   width` token at md/lg, see input.json). The check/dash glyphs render
 *   as the committed Figma SVG exports via `mix-blend-mode: difference`
 *   against the selected fill, not `currentColor` — this is the exact
 *   technique the retired original `Checkbox` already used and was
 *   directly corrected to (see this repo's changelog on "React Checkbox
 *   state-icon rendering method"): the raw assets are a fixed white stroke,
 *   and differencing them against the theme-appropriate fill (black in
 *   light, white in dark) yields the correct white-on-black / black-on-white
 *   glyph in both themes from the one asset, without a second colored copy.
 * - Disabled: `radio-checkbox-disabled-fill`/`-disabled-border` (new/
 *   corrected today — `-disabled-border` had been aliasing an unrelated
 *   Input-collection primitive, #D9DEE0, close but not Figma's actual
 *   #dfdfdf; `-disabled-fill`, #bfbfbf, didn't exist as a token at all
 *   before, since the prior version only ever used generic `opacity-50`).
 *   No Figma `Disabled` symbol exists for `sm` at all — `sm`'s disabled
 *   state falls back to the same opacity treatment other sizes' disabled
 *   fill/border override, rather than inventing a specific look with no
 *   source.
 *
 * Corrected same day, direct user report with a screenshot ("Border and
 * Tick icon is not matching Figma design", "Border and border-radius
 * should match the Figma Design", "including hover style and effect as in
 * Figma Design") — two real bugs in the first pass, both now fixed:
 * - The check/indeterminate `<img>` glyphs had no explicit width/height at
 *   all — the raw SVG assets declare `width="100%" height="100%"`, which
 *   has no intrinsic size as a bare `<img>`, so browsers fell back to a
 *   replaced-element default size instead of the small Figma glyph,
 *   rendering as an oversized, mispositioned block. Fixed by explicitly
 *   sizing/positioning each glyph from `checkGeometryBySize`/
 *   `indeterminateGeometryBySize` (the same check- and indeterminate-prefixed
 *   tokens already cited above), with both glyphs placed in the same grid cell
 *   (`col-start-1 row-start-1`) so only the state-matched one shows.
 * - Every arbitrary `border-[var(--foo)]`/`outline-[var(--foo)]` class used
 *   a bare `var()` reference with no type hint — Tailwind's arbitrary-value
 *   engine can't always infer whether such a class means -width or -color
 *   from the reference alone, so some of these were at real risk of
 *   compiling to the wrong CSS property (a border-width override silently
 *   becoming a border-color rule, or vice versa) — plausibly why hover/
 *   checked/indeterminate border-width changes and the radius weren't
 *   reliably showing up. Fixed by adding explicit `border-[length:var(...)]`
 *   / `border-[color:var(...)]` / `outline-[length:var(...)]` /
 *   `outline-[color:var(...)]` hints everywhere, then re-verified directly
 *   in the compiled Storybook CSS (not just the className strings) that
 *   `border-width`/`border-color`/`border-radius`/`outline-width`/
 *   `outline-color` all resolve to the intended CSS properties.
 *
 * Dark mode corrected 2026-08-05, direct user report — Figma published real
 * `Theme=Dark` instances for this collection for the first time (21 symbols,
 * matching Light 1:1). Reuses the same `input.radio-checkbox-*`/`input.
 * primary-*` tokens already fixed by the Input/Radio dark-mode passes, so
 * most fields (`selected`/`selected-text`/`disabled-border`, every
 * `primary-*` border) were already correct — re-verified byte-exact, not
 * re-guessed. Two real findings: `radio-checkbox-disabled-fill` (dark) was
 * `neutral.600`, a 2026-07-31 ramp-mirror placeholder — Figma's real value
 * is `nightshade.950`, a different family, not a nearby step. Hover also
 * binds a background fill (`input/radio-checkbox/hover-bg`, light
 * `lumen-gray.50`, dark `nightshade.800`) that this component never
 * implemented at all — only the border color changed on hover before. Added
 * as the new `hover:bg-[var(--color-input-radio-checkbox-hover-bg)]` class
 * above, with `disabled:hover:` / `data-[state=checked]:hover:` /
 * `data-[state=indeterminate]:hover:` overrides so the hover fill doesn't
 * leak into those states' own fixed backgrounds.
 */
const checkboxVariants = cva(
  "peer relative shrink-0 border-solid bg-[var(--color-input-radio-checkbox-bg,var(--color-input-primary-bg))] outline outline-[length:0px] outline-[color:var(--color-input-primary-focused-border)] transition-colors hover:bg-[var(--color-input-radio-checkbox-hover-bg)] disabled:cursor-not-allowed disabled:hover:bg-[var(--color-input-radio-checkbox-disabled-fill)] data-[state=checked]:border-[color:var(--color-input-radio-checkbox-selected)] data-[state=checked]:bg-[var(--color-input-radio-checkbox-selected)] data-[state=checked]:text-[var(--color-input-radio-checkbox-selected-text)] data-[state=checked]:hover:bg-[var(--color-input-radio-checkbox-selected)] data-[state=indeterminate]:border-[color:var(--color-input-radio-checkbox-selected)] data-[state=indeterminate]:bg-[var(--color-input-radio-checkbox-selected)] data-[state=indeterminate]:text-[var(--color-input-radio-checkbox-selected-text)] data-[state=indeterminate]:hover:bg-[var(--color-input-radio-checkbox-selected)] aria-invalid:border-[color:var(--color-input-primary-error-border)] disabled:border-[color:var(--color-input-radio-checkbox-disabled-border)] disabled:bg-[var(--color-input-radio-checkbox-disabled-fill)] disabled:data-[state=checked]:border-[color:var(--color-input-radio-checkbox-disabled-border)] disabled:data-[state=checked]:bg-[var(--color-input-radio-checkbox-disabled-fill)]",
  {
    variants: {
      size: {
        sm: "size-[var(--input-indicator-size-sm)] rounded-[var(--input-checkbox-radius-sm)] border-[length:var(--input-field-border-width-sm)] border-[color:var(--color-input-primary-border)] hover:border-[color:var(--color-input-primary-hover-border)] data-[state=checked]:border-[length:var(--input-checkbox-selected-border-width-sm)] data-[state=indeterminate]:border-[length:var(--input-checkbox-selected-border-width-sm)] focus-visible:outline-[length:var(--input-focus-width-sm)] focus-visible:outline-offset-[3.5px]",
        md: "size-[var(--input-indicator-size-md)] rounded-[var(--input-checkbox-radius-md)] border-[length:var(--input-field-border-width-md)] border-[color:var(--color-input-primary-border)] hover:border-[color:var(--color-input-primary-hover-border)] data-[state=checked]:border-[length:var(--input-checkbox-selected-border-width-md)] data-[state=indeterminate]:border-[length:var(--input-checkbox-selected-border-width-md)] focus-visible:outline-[length:var(--input-focus-width-md)] focus-visible:outline-offset-[4.17px]",
        lg: "size-[var(--input-indicator-size-lg)] rounded-[var(--input-checkbox-radius-lg)] border-[length:var(--input-field-border-width-lg)] border-[color:var(--color-input-primary-border)] hover:border-[color:var(--color-input-primary-hover-border)] data-[state=checked]:border-[length:var(--input-checkbox-selected-border-width-lg)] data-[state=indeterminate]:border-[length:var(--input-checkbox-selected-border-width-lg)] focus-visible:outline-[length:var(--input-focus-width-lg)] focus-visible:outline-offset-[4.83px]"
      }
    },
    defaultVariants: { size: "md" }
  }
)

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    VariantProps<typeof checkboxVariants> {}

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ className, size = "md", ...props }, ref) => {
    const resolvedSize = size ?? "md"
    return (
      <CheckboxPrimitive.Root
        ref={ref}
        className={cn("group", checkboxVariants({ size }), className)}
        {...props}
      >
        <CheckboxPrimitive.Indicator asChild>
          <span className="absolute inset-0 grid place-content-center overflow-hidden rounded-[inherit]">
            <img
              src={checkAssetBySize[resolvedSize]}
              alt=""
              aria-hidden="true"
              className="col-start-1 row-start-1 hidden max-w-none group-data-[state=checked]:block"
              style={{
                width: checkGeometryBySize[resolvedSize].width,
                height: checkGeometryBySize[resolvedSize].height,
                transform: `translate(${checkGeometryBySize[resolvedSize].x}, ${checkGeometryBySize[resolvedSize].y})`,
                mixBlendMode: "difference"
              }}
            />
            <img
              src={indeterminateAssetBySize[resolvedSize]}
              alt=""
              aria-hidden="true"
              className="col-start-1 row-start-1 hidden max-w-none group-data-[state=indeterminate]:block"
              style={{
                width: indeterminateGeometryBySize[resolvedSize].width,
                height: indeterminateGeometryBySize[resolvedSize].height,
                transform: `translate(${indeterminateGeometryBySize[resolvedSize].x}, ${indeterminateGeometryBySize[resolvedSize].y})`,
                mixBlendMode: "difference"
              }}
            />
          </span>
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    )
  }
)
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox, checkboxVariants, checkAssetBySize, indeterminateAssetBySize }
