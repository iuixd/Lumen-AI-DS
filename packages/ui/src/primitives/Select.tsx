import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "../lib/cn";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, invalid, children, ...props }, ref) => (
    <select
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        "h-10 w-full min-w-[120px] rounded-md border bg-[var(--color-background-default)] px-3 text-body-md text-[var(--color-text-title)]",
        "border-[var(--color-border-default)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]",
        invalid && "border-[var(--color-status-error)]",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";
