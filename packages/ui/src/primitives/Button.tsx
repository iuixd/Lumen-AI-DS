import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/**
 * Button
 * Maps 1:1 to the Figma component set family: Primary Button, Secondary Button,
 * Neutral Button, Error Button, Clear Button (see design_systems/Lumen AI - DS - base).
 * Do not create a new button component for a one-off screen — extend variants here instead.
 */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-label-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-border-focus)] disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-brand-default)] text-neutral-white hover:bg-[var(--color-brand-hover)] active:bg-[var(--color-brand-pressed)]",
        secondary:
          "border border-[var(--color-brand-default)] text-[var(--color-brand-default)] bg-transparent hover:bg-[var(--color-brand-subtle)]",
        neutral:
          "bg-neutral-black-50 text-[var(--color-text-title)] hover:bg-neutral-black-100",
        error:
          "bg-[var(--color-status-error)] text-neutral-white hover:bg-red-700 active:bg-red-900",
        clear:
          "bg-transparent text-[var(--color-text-body)] hover:bg-neutral-black-50"
      },
      size: {
        sm: "h-8 px-3 text-label-md",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-title-sm"
      }
    },
    defaultVariants: { variant: "primary", size: "md" }
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Renders a leading icon slot. */
  iconStart?: React.ReactNode;
  /** Renders a trailing icon slot. */
  iconEnd?: React.ReactNode;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, iconStart, iconEnd, isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        {...props}
      >
        {isLoading ? <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden /> : iconStart}
        {children}
        {!isLoading && iconEnd}
      </button>
    );
  }
);
Button.displayName = "Button";
