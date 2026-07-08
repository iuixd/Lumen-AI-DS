import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../lib/cn";

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, id, ...props }, ref) => {
    const inputId = id ?? `${props.name}-${props.value}`;
    return (
      <label htmlFor={inputId} className="inline-flex min-w-[120px] items-center gap-2 text-body-md text-[var(--color-text-title)]">
        <input
          ref={ref}
          type="radio"
          id={inputId}
          className={cn(
            "size-4 border-[var(--color-border-default)] text-[var(--color-brand-default)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]",
            className
          )}
          {...props}
        />
        {label}
      </label>
    );
  }
);
Radio.displayName = "Radio";
