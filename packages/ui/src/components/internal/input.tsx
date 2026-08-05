import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/cn"

/**
 * Adapted from shadcn/ui's Input (new-york style) — internal to
 * @lumen/ui, source for the public `Input` export (promoted from
 * `ShadcnInput` after Lumen's original `Input` primitive was retired in
 * its favor — see docs/shadcn-integration.md §7.8). Changes:
 * - imports resolve via this repo's existing relative-import convention
 * - `shadow-sm` dropped — no shadow precedent on the original Input
 *
 * State colors re-synced 2026-07-27 (user report: the Header search input
 * and AIPanel's prompt input didn't match Figma's Input component states —
 * node 1262:1181), then rewritten wholesale 2026-07-31 (direct user
 * request: "rewrite to develop the Input components under PRIMITIVES to
 * match the Figma design... multiple variants and sizes with updated
 * colors based on states, and 10px border-radius"). Every Type=Bordered
 * symbol in the canonical collection (node 1262:1181 — 3 sizes x 4 states
 * x 2 icon-modes, 24 symbols total) was re-verified directly via
 * `get_design_context`/`get_variable_defs`, not inferred or interpolated
 * between sizes, since the previous sync (and this file's own prior
 * history) had already shown Figma's own authored values here are NOT a
 * clean formula — border widths genuinely vary per size AND per state in
 * ways that don't reduce to "small/medium/large scale up uniformly":
 *
 * | size | default | hover | focused | error (primary) | error (search) |
 * |------|---------|-------|---------|------------------|-----------------|
 * | sm   | 1px     | 2px   | 2.5px   | 2px              | 2px             |
 * | md   | 1.5px   | 1.5px | 2.5px   | 2px              | 2px             |
 * | lg   | 2px     | 2px   | 2.5px   | 2px              | 2px             |
 *
 * Error corrected 2026-07-31 (same day, direct user report: "Input error
 * state border should be 2px as in Figma Design"): a fresh re-pull of all
 * three `State=Error` symbols (Figma had reorganized again since the
 * initial sync) shows Error is now uniformly `border-2` at every size —
 * previously sm/md were 1px (md's had actually *shrunk* from its own 1.5px
 * default). Also newly visible in that same fresh pull, flagged then as
 * NOT yet acted on: Error's padding-x is 2px larger than each size's own
 * default (12/16/18 vs. 10/14/18 — `lg`'s error value equals its own
 * default, so it needs no override, not a "+2 uniformly" pattern), and its
 * text switches from Regular weight/placeholder-text color to SemiBold at
 * a new `input/primary/text` color. Both implemented 2026-08-04 (direct
 * user request, alongside a dark-mode audit that reconfirmed the same
 * finding with real dark values too — light's approximate `#111` note
 * turned out exact, `#111111`/`neutral.950`; dark is `nightshade.50`,
 * `#F9F3F7`) — no longer deferred.
 *
 * `size` (`sm`/`md`/`lg`, default `md`) replaces the retired primitive's
 * single fixed height — deliberately reintroducing a prop name the
 * previous version of this file avoided specifically because it collides
 * with the native HTML `size` attribute (number of visible characters);
 * that attribute is no longer reachable through this component now that
 * `size` means something else, a direct, disclosed trade-off now that
 * Figma requires the 3-size system. Heights/padding per size (`--spacing-
 * 36`/`44`/`60` and `10`/`14`/`18`px) and the placeholder/value type scale
 * per size are all read directly off the same 24-symbol sweep; the type
 * scale intentionally does NOT reuse this repo's existing `text-input-md`/
 * `-sm`/`-lg` typography tokens for `md`/`sm` (`lg` already matched and is
 * reused) — those two tokens' real Figma line-heights (26px/22px, not the
 * previously-documented 18px/16px) are flagged but deliberately left
 * unchanged in `typography.json` because they're shared by five *other*
 * components (`command`/`input-group`/`input-otp`/`select`/`textarea`)
 * whose own fixed heights were never independently re-verified against
 * this same correction; changing the shared token risked a silent
 * regression there. This component uses its own literal, Figma-correct
 * `text-[16px] leading-[26px]` (md) / `text-[14px] leading-[22px]` (sm)
 * instead, both real bound values, not invented.
 *
 * `variant` (`primary`/`search`, default `primary`) is new: Figma's
 * `Icon=Yes` symbols aren't just "Icon=No plus an icon slot" — they use a
 * visibly different background (`input.search-bg`, a light gray, vs
 * `input.primary-bg`, white) and their own dedicated hover/focused border
 * tokens (`input.search-hover-border`/`-focused-border`), both already
 * defined in this repo's token set but never wired into this component.
 * Error color is shared (`input.primary-error-border`) — Figma has no
 * separate `search-error-border` token. The actual leading-icon/keyboard-
 * shortcut-badge *composition* Figma's `Icon=Yes` symbols show is
 * deliberately NOT built into this primitive — `InputGroup` (`components/
 * internal/input-group.tsx`) already exists exactly for composing `Input`
 * with leading/trailing addons (icons, buttons, `Kbd`), and duplicating
 * that here would violate this repo's own "never add a component that
 * duplicates an existing one" rule (CLAUDE.md #2). `variant="search"`
 * gives `InputGroup` (or any direct consumer building a search field) the
 * correct background/border colors to compose around; the 14px icon glyph
 * and the `⌘K`-style shortcut badge are addon concerns, not `Input`'s.
 *
 * Radius corrected from `rounded-md` (Tailwind's default 6px, never
 * token-backed here) to the new `--radius-input` (10px) — every symbol in
 * the sweep binds the same `radius/xl` Figma variable, resolving to 10px,
 * matching this repo's existing `button`/`app-search` component-scoped
 * 10px steps (see `radius.json`).
 *
 * `appearance-none` plus a `::-webkit-search-cancel-button` reset remain
 * from the 2026-07-27 sync, unchanged: `type="search"` inputs render a
 * native focus glow/cancel button outside `outline`/`ring` that isn't
 * suppressed by either, confirmed live in Chromium that this fully
 * removes both while preserving the accessible "searchbox" role.
 * `disabled` styling (`opacity-50`) has no Figma evidence either way (no
 * `State=Disabled` symbol exists anywhere in this collection) — left as
 * this repo's existing generic convention rather than invented.
 */
const inputVariants = cva(
  "flex w-full appearance-none rounded-[var(--radius-input)] border-solid transition-colors placeholder:text-[var(--color-input-primary-placeholder-text)] aria-invalid:font-semibold aria-invalid:text-[var(--color-input-primary-text)] focus-visible:border-[2.5px] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 file:border-0 file:bg-transparent file:font-medium file:text-foreground [&::-webkit-search-cancel-button]:appearance-none",
  {
    variants: {
      size: {
        sm: "h-[var(--spacing-36)] px-[var(--spacing-10)] py-[var(--spacing-8)] text-[14px] font-normal leading-[22px] border",
        md: "h-[var(--spacing-44)] px-[var(--spacing-14)] py-[var(--spacing-8)] text-[16px] font-normal leading-[26px] border-[1.5px]",
        lg: "h-[var(--spacing-60)] px-[var(--spacing-18)] py-[var(--spacing-8)] text-input-lg border-2"
      },
      variant: {
        primary:
          "bg-[var(--color-input-primary-bg)] border-[var(--color-input-primary-border)] hover:border-[var(--color-input-primary-hover-border)] focus-visible:border-[var(--color-input-primary-focused-border)] aria-invalid:border-[var(--color-input-primary-error-border)]",
        search:
          "bg-[var(--color-input-search-bg)] border-[var(--color-input-search-border)] hover:border-[var(--color-input-search-hover-border)] focus-visible:border-[var(--color-input-search-focused-border)] aria-invalid:border-[var(--color-input-primary-error-border)]"
      }
    },
    compoundVariants: [
      { size: "sm", variant: "primary", class: "hover:border-2 aria-invalid:border-2" },
      { size: "sm", variant: "search", class: "hover:border-2 aria-invalid:border-2" },
      { size: "md", variant: "search", class: "hover:border-2 aria-invalid:border-2" },
      { size: "md", variant: "primary", class: "aria-invalid:border-2" },
      // Error state's extra horizontal padding — 12/16/18 vs each size's own
      // 10/14/18 default. lg needs no override: its Error padding (18) is
      // identical to its own default, confirmed via get_variable_defs, not
      // an oversight of a "+2 uniformly" pattern that doesn't actually hold.
      { size: "sm", class: "aria-invalid:px-[var(--spacing-12)]" },
      { size: "md", class: "aria-invalid:px-[var(--spacing-16)]" }
    ],
    defaultVariants: { size: "md", variant: "primary" }
  }
)

export interface InputProps
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, size, variant, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ size, variant }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }
