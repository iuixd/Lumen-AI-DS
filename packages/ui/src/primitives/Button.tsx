import {
  forwardRef,
  type ButtonHTMLAttributes,
  type MouseEventHandler,
  type ReactNode
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/** Standard Button, sourced from Figma nodes 1027:3733 (variants/states) and 1034:4459 (sizes). */
export const buttonVariants = cva(
  "inline-flex h-[var(--button-height)] items-center justify-center gap-[var(--button-gap)] whitespace-nowrap rounded-lg border border-transparent px-[var(--button-padding-x)] font-interface tracking-[var(--button-letter-spacing)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-button-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background-default)] aria-disabled:pointer-events-none aria-disabled:border-transparent aria-disabled:bg-[var(--color-button-disabled-bg)] aria-disabled:text-[var(--color-button-disabled-on-action)]",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-button-primary-bg)] text-[var(--color-button-primary-on-action)] hover:bg-[var(--color-button-primary-hover-bg)] hover:text-[var(--color-button-primary-hover-on-action)]",
        accent:
          "bg-[var(--color-button-accent-bg)] text-[var(--color-button-accent-on-action)] hover:bg-[var(--color-button-accent-hover-bg)] hover:text-[var(--color-button-accent-hover-on-action)]",
        secondary:
          "border-[var(--color-button-secondary-border)] bg-[var(--color-button-secondary-bg)] text-[var(--color-button-secondary-on-action)] hover:border-[var(--color-button-secondary-hover-border)] hover:bg-[var(--color-button-secondary-hover-bg)] hover:text-[var(--color-button-secondary-hover-on-action)]",
        outline:
          "border-[var(--color-button-outline-border)] bg-[var(--color-button-outline-bg)] text-[var(--color-button-outline-on-action)] hover:border-[var(--color-button-outline-hover-border)] hover:bg-[var(--color-button-outline-hover-bg)] hover:text-[var(--color-button-outline-hover-on-action)] focus-visible:border-[var(--color-button-outline-focus-border)]",
        ghost:
          "bg-[var(--color-button-ghost-bg)] text-[var(--color-button-ghost-on-action)] hover:bg-[var(--color-button-ghost-hover-bg)]",
        destructive:
          "bg-[var(--color-button-destructive-bg)] text-[var(--color-button-destructive-on-action)] hover:bg-[var(--color-button-destructive-hover-bg)]"
      },
      size: {
        sm: "[--button-gap:var(--spacing-6)] [--button-height:var(--spacing-30)] [--button-icon-size:var(--spacing-12)] [--button-letter-spacing:var(--text-standard-button-sm-letter-spacing)] [--button-padding-x:var(--spacing-14)] text-standard-button-sm",
        md: "[--button-gap:var(--spacing-8)] [--button-height:var(--spacing-34)] [--button-icon-size:var(--spacing-14)] [--button-letter-spacing:var(--text-standard-button-md-letter-spacing)] [--button-padding-x:var(--spacing-16)] text-standard-button-md",
        lg: "[--button-gap:var(--spacing-8)] [--button-height:var(--spacing-38)] [--button-icon-size:var(--spacing-16)] [--button-letter-spacing:var(--text-standard-button-lg-letter-spacing)] [--button-padding-x:var(--spacing-16)] text-standard-button-lg",
        xl: "[--button-gap:var(--spacing-8)] [--button-height:var(--spacing-42)] [--button-icon-size:var(--spacing-18)] [--button-letter-spacing:var(--text-standard-button-xl-letter-spacing)] [--button-padding-x:var(--spacing-16)] text-standard-button-xl"
      }
    },
    defaultVariants: { variant: "primary", size: "md" }
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, iconStart, iconEnd, disabled, onClick, children, ...props },
    ref
  ) => {
    const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
      if (disabled) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
    };

    return (
      <button
        ref={ref}
        type="button"
        {...props}
        className={cn(buttonVariants({ variant, size }), className)}
        aria-disabled={disabled || undefined}
        onClick={handleClick}
      >
        {iconStart && (
          <span className="flex size-[var(--button-icon-size)] shrink-0 items-center justify-center [&>svg]:size-full">
            {iconStart}
          </span>
        )}
        {children}
        {iconEnd && (
          <span className="flex size-[var(--button-icon-size)] shrink-0 items-center justify-center [&>svg]:size-full">
            {iconEnd}
          </span>
        )}
      </button>
    );
  }
);
Button.displayName = "Button";
