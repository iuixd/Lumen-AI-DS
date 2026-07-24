import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/cn"

/**
 * shadcn/ui's own generated Button — adapted here. Source for the public
 * `Button` export (promoted from `ShadcnButton` after Lumen's original
 * hand-built `Button` primitive was retired in its favor — see
 * docs/shadcn-integration.md §7.8) and an internal dependency of
 * Carousel/Form/Pagination/ButtonGroup. Adaptation changes: relative
 * imports, `text-sm`/`text-xs` -> `label-md`/`label-sm`, dropped
 * `shadow`/`shadow-sm` (no Lumen precedent on Lumen's own Button.tsx).
 *
 * Re-synced to Figma 2026-07-24 (Lumen-AI-Design-System node `1174:1349`,
 * the canonical Button component-set, requested directly by the user now
 * that this is the one canonical `Button`): every variant/state pair binds
 * directly to its own `--color-button-*` semantic token (arbitrary-value
 * classes) instead of shadcn's generic bridge tokens (`--primary`,
 * `--secondary`, `--accent`, `--ring`), since those are shared by other
 * components and a generic mapping had drifted from what this component
 * actually needs — `outline`/`ghost`'s hover previously used `--accent`
 * (a "selected nav row" placeholder token, see docs/shadcn-integration.md
 * §5), and `hover:bg-primary`/`hover:bg-destructive`/`hover:bg-secondary`
 * were literal no-ops (same class as the base state, a leftover from the
 * original batch-5 adaptation). The token sync itself found real drift in
 * `Secondary` and `Outline`'s hover colors against the current Figma
 * values — see `packages/tokens/src/semantic/color.json`'s `_comment` for
 * the full before/after. `Accent` and `Link` are declared style
 * properties on the Figma component but have no authored visual states
 * yet, so neither is wired here (by direct user decision, consistent with
 * §7.8's "no accent variant" call) — `link` keeps shadcn's own generic
 * text-underline treatment. Only a `Light` theme is authored in Figma;
 * dark-mode values are untouched, same caveat as the rest of this repo's
 * dark tokens.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-label-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-button-focus-ring)] disabled:pointer-events-none disabled:border-transparent disabled:bg-[var(--color-button-disabled-bg)] disabled:text-[var(--color-button-disabled-on-action)] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-button-primary-bg)] text-[var(--color-button-primary-on-action)] hover:bg-[var(--color-button-primary-hover-bg)]",
        destructive:
          "bg-[var(--color-button-destructive-bg)] text-[var(--color-button-destructive-on-action)] hover:bg-[var(--color-button-destructive-hover-bg)]",
        outline:
          "border border-[var(--color-button-outline-border)] bg-[var(--color-button-outline-bg)] text-[var(--color-button-outline-on-action)] hover:border-[var(--color-button-outline-hover-border)] hover:bg-[var(--color-button-outline-hover-bg)] hover:text-[var(--color-button-outline-hover-on-action)]",
        secondary:
          "border border-[var(--color-button-secondary-border)] bg-[var(--color-button-secondary-bg)] text-[var(--color-button-secondary-on-action)] hover:border-[var(--color-button-secondary-hover-border)] hover:bg-[var(--color-button-secondary-hover-bg)] hover:text-[var(--color-button-secondary-hover-on-action)]",
        ghost:
          "text-[var(--color-button-ghost-on-action)] hover:bg-[var(--color-button-ghost-hover-bg)]",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-label-sm",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
