import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../lib/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, disabled, ...props }, ref) => (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      disabled={disabled}
      className={cn(
        "h-10 w-full min-w-[120px] rounded-md border bg-[var(--color-background-default)] px-3 text-body-md text-[var(--color-text-title)] placeholder:text-[var(--color-text-muted)]",
        "border-[var(--color-border-default)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]",
        invalid && "border-[var(--color-status-error)] focus-visible:ring-[var(--color-status-error)]",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
