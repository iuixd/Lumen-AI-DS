import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/**
 * IconButton — a compact, square, icon-only control.
 *
 * Sourced from Lumen-AI-Design-System node `1034:4459` (the "Sizes"
 * reference frame), specifically its "Icon Only - light" instance (node
 * `1035:4738`) — the first real Figma evidence for this primitive, read
 * via `get_design_context`/`get_variable_defs` on 2026-07-29.
 *
 * Reuses `Button`'s live `--color-button-*` token family (the same
 * shadcn-adapted variant set `Button` and `AIButton` already share) rather
 * than the older Primary/Secondary/Ghost/Danger/AI vocabulary in
 * `docs/component-specifications.md` §6 — direct user decision, since that
 * older vocabulary has no live component behind it anymore (see
 * `docs/shadcn-integration.md` §7.8).
 *
 * Only `variant="secondary"` at `size="md"` (34px) matches a literal Figma
 * instance exactly: ~8%/24%-alpha crimson bg/border, a 1.5px border, and
 * 8px radius. The other variants reuse the same already-Figma-synced
 * `--color-button-*` roles `Button`/`AIButton` use, applied to this new
 * icon-only geometry — consistent by construction, not independently
 * sourced per variant. `sm`/`lg`/`xl` sizes and their icon-glyph sizes are
 * inferred by consistency with this same Figma frame's Primary Button icon
 * sizes (12/16/18px), not independently sourced icon-only instances — see
 * `packages/tokens/src/icon-button.json`.
 */
export type IconButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";
export type IconButtonSize = "sm" | "md" | "lg" | "xl";

const iconButtonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-[var(--radius-lg)] border border-transparent font-interface transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-button-focus-ring)] disabled:pointer-events-none disabled:border-transparent disabled:bg-[var(--color-button-disabled-bg)] disabled:text-[var(--color-button-disabled-on-action)] [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-button-primary-bg)] text-[var(--color-button-primary-on-action)] hover:bg-[var(--color-button-primary-hover-bg)]",
        destructive:
          "bg-[var(--color-button-destructive-bg)] text-[var(--color-button-destructive-on-action)] hover:bg-[var(--color-button-destructive-hover-bg)]",
        outline:
          "border-[var(--color-button-outline-border)] bg-[var(--color-button-outline-bg)] text-[var(--color-button-outline-on-action)] hover:border-[var(--color-button-outline-hover-border)] hover:bg-[var(--color-button-outline-hover-bg)] hover:text-[var(--color-button-outline-hover-on-action)]",
        secondary:
          "border-[width:var(--icon-button-border-width)] border-[var(--color-button-secondary-border)] bg-[var(--color-button-secondary-bg)] text-[var(--color-button-secondary-on-action)] hover:border-[var(--color-button-secondary-hover-border)] hover:bg-[var(--color-button-secondary-hover-bg)] hover:text-[var(--color-button-secondary-hover-on-action)]",
        ghost: "text-[var(--color-button-ghost-on-action)] hover:bg-[var(--color-button-ghost-hover-bg)]",
        link: "text-[var(--color-button-link-on-action)] hover:underline"
      },
      size: {
        sm: "size-[var(--spacing-30)] [&_svg]:size-[var(--icon-button-icon-size-sm)]",
        md: "size-[var(--spacing-34)] [&_svg]:size-[var(--icon-button-icon-size-md)]",
        lg: "size-[var(--spacing-38)] [&_svg]:size-[var(--icon-button-icon-size-lg)]",
        xl: "size-[var(--spacing-42)] [&_svg]:size-[var(--icon-button-icon-size-xl)]"
      }
    },
    defaultVariants: { variant: "secondary", size: "md" }
  }
);

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">,
    VariantProps<typeof iconButtonVariants> {
  /** The glyph to render. Required — IconButton has no text label. */
  icon: ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, icon, ...props }, ref) => {
    if (process.env.NODE_ENV !== "production") {
      if (!props["aria-label"] && !props["aria-labelledby"]) {
        // eslint-disable-next-line no-console
        console.warn("IconButton: an accessible name is required — pass aria-label.");
      }
    }
    return (
      <button
        ref={ref}
        type="button"
        className={cn(iconButtonVariants({ variant, size, className }))}
        {...props}
      >
        <span aria-hidden>{icon}</span>
      </button>
    );
  }
);
IconButton.displayName = "IconButton";

export { iconButtonVariants };
