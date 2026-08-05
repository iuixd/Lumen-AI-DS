import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@lumen/ui/lib/cn"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      // Corrected 2026-08-05 against Figma's canonical "Modal Mask" (node
      // 1737:4154): bg/modal-mask is a dark purple-tinted scrim
      // (--color-modal-overlay, deep-purple.900 @ 30%), not the generic
      // black/40 this overlay previously shared with Drawer/Sheet/the
      // retired Modal composite (see this file's prior comment on that
      // "standardization" — now scoped to Dialog only, since only Dialog
      // has real Figma evidence for a different value; Drawer/Sheet were
      // not re-audited and still use black/40). Blur widened 4px->5px to
      // match the same node's exact backdrop-blur value.
      "fixed inset-0 z-50 bg-[var(--color-modal-overlay)] backdrop-blur-[5px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, style, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        // Corrected 2026-08-05 against Figma's canonical "Modal" component
        // (node 1737:4152), direct user request to make Figma the single
        // source of truth for this component's chrome: radius 8px->14px
        // (radius.xxl, an existing token), width capped at Figma's exact
        // 550px (was max-w-lg/512px), the flat shadcn `border` removed
        // (Figma's Modal has none), and `shadow-lg` replaced by the new
        // `--shadow-modal-default` (Figma's own "Elevation/4 — Modal"
        // effect) via inline style below — the same
        // arbitrary-value-var()-misparses-as-a-color-hint Tailwind bug
        // already documented and worked around in Toast.tsx. Vertical
        // rhythm widened 16px->24px (gap-4->gap-6) to match the 24px gap
        // Figma's "Dialog Elements" frame uses between title/description/
        // actions.
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-[550px] translate-x-[-50%] translate-y-[-50%] gap-6 bg-[var(--color-background-raised)] p-6 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-[var(--radius-xxl)]",
        className
      )}
      style={{ boxShadow: "var(--shadow-modal-default)", ...style }}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 flex size-6 items-center justify-center rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    // space-y-1.5 -> space-y-6 (24px), matching Figma's title-to-description
    // gap on the "Dialog Elements" frame — corrected 2026-08-05.
    className={cn(
      "flex flex-col space-y-6 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    // Corrected 2026-08-05 against Figma's "Actions" frame: gained a top
    // border separator (--color-border-separator, an exact existing-token
    // match for Figma's stroke/separator) with 24px padding above the
    // buttons, and the button gap changed from space-x-2 (8px, row-only) to
    // gap-4 (16px, works in both the row and flex-col-reverse mobile
    // layouts) to match Figma's exact 16px gap between "Keep file"/"Remove
    // file".
    className={cn(
      "flex flex-col-reverse gap-4 border-t border-[var(--color-border-separator)] pt-6 sm:flex-row sm:justify-end",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    // Corrected 2026-08-05 against Figma's "Modal" title (node 1737:4152):
    // was shadcn's generic text-lg/font-semibold/leading-none/tracking-tight
    // (18px, weight 600, no color) — Figma's real bound typography is "Body/
    // Large SemiBold" (20px/32/600, Instrument Sans), now the new
    // body-lg-w600 tier. font-interface added explicitly, direct user
    // report ("Modal title not matching the Figma Design") — this repo has
    // no global font-family reset, so without it the title fell through to
    // Tailwind Preflight's generic system-UI stack rather than the actual
    // Instrument Sans webfont (loaded, but never requested), a subtly
    // different typeface from what Figma renders natively. Color uses the
    // new dedicated --color-modal-title-text (light exact match for the
    // generic text.primary; dark diverges — text.primary's own dark value
    // is stale for this role, see semantic/color.json's _modalComment),
    // not the generic token directly.
    className={cn(
      "font-interface text-body-lg-w600 text-[var(--color-modal-title-text)]",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    // Corrected 2026-08-05 against Figma's "Modal" description (node
    // 1737:4152): was shadcn's generic text-sm/text-muted-foreground (14px,
    // generic gray) — Figma's real bound typography is "Body/Medium
    // Regular" (16px/26/400, Instrument Sans, an exact existing body-md
    // match) at --color-text-secondary (#626b6e, an exact existing-token
    // match). font-interface added explicitly for the same reason as
    // DialogTitle above (no ambient font-family default in this repo).
    className={cn(
      "font-interface text-body-md text-[var(--color-text-secondary)]",
      className
    )}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
