import * as React from "react"

import { cn } from "../../lib/cn"

/**
 * Adapted from shadcn/ui's Input (new-york style) — internal to
 * @lumen/ui, source for the public `Input` export (promoted from
 * `ShadcnInput` after Lumen's original `Input` primitive was retired in
 * its favor — see docs/shadcn-integration.md §7.8). Changes:
 * - imports resolve via this repo's existing relative-import convention
 * - `text-base ... md:text-sm`/`file:text-sm` replaced with Lumen's
 *   `input-md` type scale, matching the original `Input.tsx`'s convention
 * - `shadow-sm` dropped — no shadow precedent on the original Input
 *
 * State colors re-synced 2026-07-27 (user report: the Header search input
 * and AIPanel's prompt input didn't match Figma's Input component states —
 * node 1262:1181, all 4 states re-verified via `get_design_context` on the
 * Bordered/Icon=Yes/Size=md symbols), replacing generic shadcn bridge tokens
 * that had each drifted from the real `input.primary-*` tokens (which were
 * already correct — this was a wiring gap, same pattern as the earlier
 * search/prompt background fix): `border-input` (`--color-border-default`,
 * #DFDFDF) → `--color-input-primary-border` (#C8D1D4); `placeholder:text-
 * muted-foreground` (`--color-text-muted`, #5E5E5E) → `--color-input-
 * primary-placeholder-text` (#7F7F7F); the generic `focus-visible:ring-1
 * ring-ring` (`--color-border-focus`, #BE003C — this repo's general focus
 * ring, correct for buttons/toggles but never Figma-evidenced for Input)
 * replaced with Input's own actual Focused treatment: no ring at all, just
 * the border thickening from 1.5px to 2.5px and recoloring to `--color-
 * input-primary-focused-border` (#F2CCD8) — confirmed via `border-box`
 * sizing that this doesn't shift surrounding layout. Added the evidenced
 * Hover (`--color-input-primary-hover-border`) and `aria-invalid` Error
 * (`--color-input-primary-error-border`) states, neither of which existed
 * in any form before. `appearance-none` plus a `::-webkit-search-cancel-
 * button` reset were added because `type="search"` inputs (e.g. the Header
 * SearchBar) were rendering the browser's own native focus glow and cancel
 * button, which sit outside `outline`/`ring` and weren't being suppressed —
 * confirmed live in Chromium that this fully removes both while preserving
 * `type="search"`'s accessible "searchbox" role (no `type="text"` swap
 * needed). All of the above lives on this shared component so every current
 * and future `Input` consumer gets the same corrected states automatically,
 * not just the two contexts that were reported — `bg-transparent` is left
 * as the default background so existing consumers relying on it to blend
 * into their own container are unaffected; only AIPanel/SearchBar override
 * it to Figma's actual white/light-gray fills for those specific contexts.
 *
 * 2026-07-27 follow-up (same day, user: "made minor change in design...
 * apply the latest"): re-fetching node 1262:1181 found Hover and Error had
 * both moved from a 1.5px border (same width as Default) to 2px — Focused
 * stays 2.5px. Both now include an explicit `border-2` alongside their color
 * override.
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full appearance-none rounded-md border border-[var(--color-input-primary-border)] bg-transparent px-3 py-1 text-input-md transition-colors file:border-0 file:bg-transparent file:text-input-md file:font-medium file:text-foreground placeholder:text-[var(--color-input-primary-placeholder-text)] hover:border-2 hover:border-[var(--color-input-primary-hover-border)] focus-visible:border-[2.5px] focus-visible:border-[var(--color-input-primary-focused-border)] focus-visible:outline-none aria-invalid:border-2 aria-invalid:border-[var(--color-input-primary-error-border)] disabled:cursor-not-allowed disabled:opacity-50 [&::-webkit-search-cancel-button]:appearance-none",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
