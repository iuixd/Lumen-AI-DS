import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../lib/cn";
import { SunIcon, MoonIcon } from "../icons/generated";

export interface ThemeToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {}

/**
 * ThemeToggle
 * Sourced from the canonical AppShell desktop/tablet light and dark variants
 * (node 1007:3700). The exact 54px track, 20px thumb, 2px inset, and 30px
 * checked travel are published tokens. The native checkbox and `role="switch"`
 * preserve the established accessible-toggle behavior.
 */
export const ThemeToggle = forwardRef<HTMLInputElement, ThemeToggleProps>(
  ({ className, id, "aria-label": ariaLabel, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <label
        htmlFor={inputId}
        className={cn(
          "relative inline-flex h-[var(--spacing-24)] w-[var(--spacing-54)] shrink-0 cursor-pointer items-center justify-between rounded-full bg-[var(--color-app-shell-background)] px-[var(--spacing-2)]",
          "has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-offset-4 has-[:focus-visible]:ring-[var(--color-border-focus)]",
          className
        )}
      >
        <input
          ref={ref}
          type="checkbox"
          role="switch"
          id={inputId}
          className="peer sr-only"
          aria-label={ariaLabel ?? "Toggle dark theme"}
          {...props}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute left-[var(--spacing-2)] size-[var(--spacing-20)] rounded-full bg-[var(--color-app-shell-surface)] shadow-sm transition-transform peer-checked:translate-x-[var(--spacing-30)]"
        />
        <SunIcon
          aria-hidden
          className="relative z-10 size-[var(--spacing-20)] text-[var(--color-app-shell-text-heading)]"
        />
        <MoonIcon
          aria-hidden
          className="relative z-10 size-[var(--spacing-20)] text-[var(--color-app-shell-text-placeholder)]"
        />
      </label>
    );
  }
);
ThemeToggle.displayName = "ThemeToggle";
