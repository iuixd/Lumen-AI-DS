"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "../../icons/generated/CheckIcon"

import { cn } from "../../lib/cn"

/**
 * Adapted from shadcn/ui's Checkbox (new-york style) — internal to
 * @lumen/ui, source for the public `Checkbox` export (promoted from
 * `ShadcnCheckbox` after Lumen's original `Checkbox` primitive was retired —
 * see docs/shadcn-integration.md §7.8). Changes:
 * - imports resolve via this repo's existing relative-import convention
 * - lucide-react's `Check` replaced with Lumen's own generated `CheckIcon`
 * - bare `shadow` dropped — no shadow precedent on Lumen's own `Checkbox.tsx`
 *
 * Corrected 2026-07-31 (found while investigating a user report that
 * `EnterpriseLoginPage` didn't match Figma): the unchecked border and
 * checked fill were the generic shadcn `border-primary`/`bg-primary`
 * bridge colors (crimson brand), never re-verified against Figma's actual
 * `Checkbox` component (node `1278:2207`). Checked directly on its
 * `State=Default, Size=sm` (node `1278:2228`) and the login screen's own
 * checked instance: unchecked border is `input.primary-border` (`#C8D1D4`,
 * a plain neutral gray, matching every other unchecked form-field border in
 * the system, not crimson), and the checked fill/check-mark are
 * `input.radio-checkbox-selected`/`-selected-text` (`#000000`/`#FFFFFF` in
 * light theme, inverted in dark) — a dedicated pair of tokens that already
 * existed in this repo (`packages/tokens/src/input.json`) but were never
 * wired into this component. Affects every `Checkbox` consumer, not just
 * `EnterpriseLoginPage` — this was a repo-wide bug, not a one-screen one.
 */
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-[var(--color-input-primary-border)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-[var(--color-input-radio-checkbox-selected)] data-[state=checked]:bg-[var(--color-input-radio-checkbox-selected)] data-[state=checked]:text-[var(--color-input-radio-checkbox-selected-text)]",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn("grid place-content-center text-current")}>
      <CheckIcon className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
