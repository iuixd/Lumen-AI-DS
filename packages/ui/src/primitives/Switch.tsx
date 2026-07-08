import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../lib/cn";

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

/** Styled checkbox presented as a toggle switch — keeps native semantics/keyboard behavior. */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <label htmlFor={inputId} className="inline-flex min-w-[120px] items-center gap-2 text-body-md text-[var(--color-text-title)]">
        <input ref={ref} type="checkbox" role="switch" id={inputId} className="peer sr-only" {...props} />
        <span
          className={cn(
            "relative inline-block h-6 w-10 shrink-0 rounded-full bg-neutral-black-100 transition-colors",
            "peer-checked:bg-[var(--color-brand-default)] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-border-focus)]",
            "after:absolute after:left-0.5 after:top-0.5 after:size-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-4",
            className
          )}
        />
        {label}
      </label>
    );
  }
);
Switch.displayName = "Switch";
