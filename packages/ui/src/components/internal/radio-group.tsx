"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"

import { cn } from "../../lib/cn"

/**
 * Adapted from shadcn/ui's RadioGroup (new-york style) — internal to
 * @lumen/ui, exported publicly as plain `RadioGroup` (no collision:
 * Lumen's own primitive is named `Radio`, singular).
 *
 * Redesigned 2026-08-03, direct user report against Storybook screenshots
 * ("RadioGroup under Composite radio buttons not using the primitive radio
 * component" / "Radio buttons not matching the primitive component") — a
 * first color-only pass wasn't enough, since the *structure* diverged too:
 * shadcn's original rendered a fixed 1px border plus lucide's `Circle` icon
 * (`fill-primary`) as the selected mark. `Radio.tsx` (this repo's own,
 * already Figma-sourced primitive) renders its selected dot as a plain
 * filled circle `<span>` sized off `--input-radio-dot-size-*`, not an icon,
 * and its ring off `--input-indicator-size-*`/`--input-selection-border-
 * width-*` (18.667px / 1.5px at md) rather than a flat 16px/1px guess. This
 * component now reuses those exact `md`-size tokens so the two components
 * render identically at their default size — same source of truth,
 * `packages/tokens/src/input.json`, not a second hand-tuned copy.
 * Simplification flagged, not silently dropped: `Radio.tsx` also has a
 * `size` prop (sm/md/lg) and a separate, larger `control-size` hit-target
 * wrapper around its visible ring (Figma's two-layer geometry, the same
 * simplification already flagged on `checkbox.tsx`); `RadioGroupItem` has
 * neither here, since Radix's `Item` is itself the interactive `role=radio`
 * element, and no `size` prop was requested — it renders the `md` ring
 * geometry only, sized to Radix's default hit target.
 */
const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return <RadioGroupPrimitive.Root className={cn("grid gap-2", className)} {...props} ref={ref} />
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "group relative inline-flex shrink-0 items-center justify-center rounded-full border-solid bg-[var(--color-input-primary-bg)]",
        "size-[var(--input-indicator-size-md)] [border-width:var(--input-selection-border-width-md)]",
        "border-[color:var(--color-input-primary-border)] hover:border-[color:var(--color-input-primary-hover-border)]",
        "data-[state=checked]:border-[color:var(--color-input-radio-checkbox-selected)]",
        "focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:border-[color:var(--color-input-radio-checkbox-disabled-border)] disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        className={cn(
          "pointer-events-none rounded-full bg-[var(--color-input-radio-checkbox-selected)]",
          "size-[var(--input-radio-dot-size-md)]"
        )}
      />
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 rounded-full border-solid border-[var(--color-input-primary-focused-border)] opacity-0 group-focus-visible:opacity-100",
          "[border-radius:var(--input-focus-radius-md)] [border-width:var(--input-focus-width-md)]"
        )}
      />
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
