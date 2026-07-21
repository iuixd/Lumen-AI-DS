import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../lib/cn";

export type RadioSize = "sm" | "md" | "lg";

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  label?: string;
  invalid?: boolean;
  /** A string selects Lumen geometry; a number preserves the native HTML size attribute. */
  size?: RadioSize | number;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, id, invalid, disabled, size, ...props }, ref) => {
    const inputId = id ?? `${props.name}-${props.value}`;
    const visualSize: RadioSize = typeof size === "string" ? size : "md";
    const nativeSize = typeof size === "number" ? size : undefined;

    return (
      <label
        htmlFor={inputId}
        className="inline-flex min-w-128 items-center gap-[var(--spacing-8)] text-body-md text-[var(--color-text-title)]"
      >
        <span
          className={cn(
            "relative inline-flex shrink-0 items-center justify-center",
            visualSize === "sm" && "size-[var(--input-control-size-sm)]",
            visualSize === "md" && "size-[var(--input-control-size-md)]",
            visualSize === "lg" && "size-[var(--input-control-size-lg)]",
            disabled && "opacity-50"
          )}
        >
          <input
            ref={ref}
            type="radio"
            id={inputId}
            disabled={disabled}
            size={nativeSize}
            className={cn(
              "peer absolute inset-0 z-10 m-0 cursor-pointer appearance-none rounded-full focus-visible:outline-none disabled:cursor-not-allowed",
              className
            )}
            {...props}
          />
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none rounded-full border-solid bg-[var(--color-input-primary-bg)] border-[var(--color-input-primary-border)] peer-hover:border-[var(--color-input-primary-hover-border)] peer-focus-visible:border-[var(--color-input-primary-hover-border)] peer-checked:border-[var(--color-input-radio-checkbox-selected)]",
              "peer-disabled:border-[var(--color-input-radio-checkbox-disabled-border)]",
              visualSize === "sm" &&
                "size-[var(--input-indicator-size-sm)] [border-width:var(--input-selection-border-width-sm)]",
              visualSize === "md" &&
                "size-[var(--input-indicator-size-md)] [border-width:var(--input-selection-border-width-md)]",
              visualSize === "lg" &&
                "size-[var(--input-indicator-size-lg)] [border-width:var(--input-selection-border-width-lg)]",
              invalid &&
                "border-[var(--color-input-primary-error-border)] peer-hover:border-[var(--color-input-primary-error-border)]"
            )}
          />
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-[var(--color-input-radio-checkbox-selected)] transition-transform peer-checked:scale-100",
              visualSize === "sm" && "size-[var(--input-radio-dot-size-sm)]",
              visualSize === "md" && "size-[var(--input-radio-dot-size-md)]",
              visualSize === "lg" && "size-[var(--input-radio-dot-size-lg)]"
            )}
          />
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-0 border-solid border-[var(--color-input-primary-focused-border)] opacity-0 peer-focus-visible:opacity-100",
              visualSize === "sm" &&
                "[border-radius:var(--input-focus-radius-sm)] [border-width:var(--input-focus-width-sm)]",
              visualSize === "md" &&
                "[border-radius:var(--input-focus-radius-md)] [border-width:var(--input-focus-width-md)]",
              visualSize === "lg" &&
                "[border-radius:var(--input-focus-radius-lg)] [border-width:var(--input-focus-width-lg)]"
            )}
          />
        </span>
        {label}
      </label>
    );
  }
);
Radio.displayName = "Radio";
