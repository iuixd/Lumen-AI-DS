import * as React from "react"
import { GripVerticalIcon } from "../../icons/generated/GripVerticalIcon"
import { Group, Panel, Separator } from "react-resizable-panels"

import { cn } from "../../lib/cn"

/**
 * Adapted from shadcn/ui's Resizable (new-york style) — internal to
 * @lumen/ui. Changes from the generated source: relative imports, dropped
 * the Next.js `"use client"` directive (no other file in this repo uses
 * it, this is a Vite/Vitest setup), lucide-react's `GripVertical` replaced
 * with Lumen's own generated `GripVerticalIcon`, `bg-border` for the
 * handle/grip already resolves through the bridge.
 *
 * Two real upstream bugs caught and fixed here (per the "don't trust
 * generated source to be bug-free" rule — see docs/shadcn-integration.md
 * §5), both stemming from the same root cause: the installed
 * `react-resizable-panels@4.12.2` (what the CLI's own install step
 * requested) has a much newer, incompatible API than what shadcn's
 * generated template assumes:
 *
 * 1. **No `PanelGroup`/`Panel`/`PanelResizeHandle` exports at all** — this
 *    version renamed them to `Group`/`Panel`/`Separator` (confirmed via
 *    the package's own bundled `.d.ts`; `Panel` alone kept its name). The
 *    generated source fails to typecheck, not just to style correctly.
 *    Fixed by importing the real names and re-exporting under shadcn's
 *    documented public names (`ResizablePanelGroup`/`ResizablePanel`/
 *    `ResizableHandle`), so the public API this repo exposes still matches
 *    what shadcn documents.
 * 2. **`Group`'s orientation prop is named `orientation`, not `direction`**,
 *    and **`Panel`'s `defaultSize`/`minSize`/`maxSize` interpret a bare
 *    number as pixels, not percent** (a string without units is percent) —
 *    both silent behavior changes from the classic API shadcn's docs and
 *    this component's own prop contract assume. Fixed by keeping the
 *    public prop names/semantics shadcn documents (`direction`, plain
 *    percentage numbers for size props) and translating them at this
 *    wrapper boundary, rather than changing the public API to leak the
 *    installed library's current internal naming.
 *
 * A third, narrower bug (the vertical/horizontal visual swap on
 * `ResizableHandle` depending on a `data-panel-group-direction` attribute
 * this version never sets) is documented directly on `ResizableHandle`
 * below.
 */

type ResizableDirection = "horizontal" | "vertical"

function toPercent(value: number | string | undefined): string | undefined {
  return typeof value === "number" ? `${value}` : value
}

const ResizablePanelGroup = ({
  className,
  direction = "horizontal",
  ...props
}: Omit<React.ComponentProps<typeof Group>, "orientation"> & {
  direction?: ResizableDirection
}) => <Group orientation={direction} className={cn("flex h-full w-full", className)} {...props} />

const ResizablePanel = ({
  defaultSize,
  minSize,
  maxSize,
  ...props
}: React.ComponentProps<typeof Panel>) => (
  <Panel
    defaultSize={toPercent(defaultSize)}
    minSize={toPercent(minSize)}
    maxSize={toPercent(maxSize)}
    {...props}
  />
)

/**
 * The generated source styles vertical-orientation layout via a
 * `data-[panel-group-direction=vertical]:*` Tailwind selector, but the
 * installed `react-resizable-panels@4.12.2` never sets that attribute
 * anywhere in the DOM (verified against its own bundled source — it only
 * emits `data-group`/`data-panel`/`data-separator`/`data-disabled`, plus
 * `flexDirection` as an inline style on the group). The group's own
 * layout is unaffected (the inline style already sets the correct flex
 * direction), but this handle's own vertical/horizontal visual swap (thin
 * bar width/height, grip rotation) silently never triggered — a real, not
 * cosmetic, bug. Fixed by keying off the handle's own `aria-orientation`
 * attribute instead (which the library does set correctly and
 * unconditionally: `horizontal` when the group direction is `vertical`,
 * and vice versa), via Tailwind's `aria-[orientation=...]` arbitrary
 * variant.
 */
const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof Separator> & {
  withHandle?: boolean
}) => (
  <Separator
    className={cn(
      "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-1 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:-translate-y-1/2 aria-[orientation=horizontal]:after:translate-x-0 [&[aria-orientation=horizontal]>div]:rotate-90",
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <GripVerticalIcon className="h-2.5 w-2.5" />
      </div>
    )}
  </Separator>
)

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
