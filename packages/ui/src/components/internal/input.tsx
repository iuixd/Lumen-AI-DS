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
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-input-md transition-colors file:border-0 file:bg-transparent file:text-input-md file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
