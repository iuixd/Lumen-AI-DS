import { forwardRef, useEffect, useRef, type InputHTMLAttributes } from "react";
import { cn } from "../lib/cn";

export type CheckboxSize = "sm" | "md" | "lg";

const checkedAssets: Record<CheckboxSize, string> = {
  sm: new URL("../assets/input-checkbox-check-sm.svg", import.meta.url).href,
  md: new URL("../assets/input-checkbox-check-md.svg", import.meta.url).href,
  lg: new URL("../assets/input-checkbox-check-lg.svg", import.meta.url).href
};

const indeterminateAssets: Record<CheckboxSize, string> = {
  sm: new URL("../assets/input-checkbox-indeterminate-sm.svg", import.meta.url).href,
  md: new URL("../assets/input-checkbox-indeterminate-md.svg", import.meta.url).href,
  lg: new URL("../assets/input-checkbox-indeterminate-lg.svg", import.meta.url).href
};

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "type"
> {
  label?: string;
  invalid?: boolean;
  indeterminate?: boolean;
  /** A string selects Lumen geometry; a number preserves the native HTML size attribute. */
  size?: CheckboxSize | number;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { className, label, id, invalid, indeterminate = false, disabled, size, ...props },
    forwardedRef
  ) => {
    const inputId = id ?? props.name;
    const inputRef = useRef<HTMLInputElement | null>(null);
    const visualSize: CheckboxSize = typeof size === "string" ? size : "md";
    const nativeSize = typeof size === "number" ? size : undefined;

    useEffect(() => {
      if (inputRef.current) inputRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    const setRef = (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    };

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
            ref={setRef}
            type="checkbox"
            id={inputId}
            aria-invalid={invalid || undefined}
            disabled={disabled}
            size={nativeSize}
            className={cn(
              "peer absolute inset-0 z-10 m-0 cursor-pointer appearance-none focus-visible:outline-none disabled:cursor-not-allowed",
              className
            )}
            {...props}
          />
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none border-solid bg-[var(--color-input-primary-bg)] border-[var(--color-input-primary-border)] peer-hover:border-[var(--color-input-primary-hover-border)] peer-focus-visible:border-[var(--color-input-primary-hover-border)] peer-checked:border-[var(--color-input-radio-checkbox-selected)] peer-checked:bg-[var(--color-input-radio-checkbox-selected)]",
              "peer-disabled:border-[var(--color-input-radio-checkbox-disabled-border)]",
              visualSize === "sm" &&
                "size-[var(--input-indicator-size-sm)] [border-radius:var(--input-checkbox-radius-sm)] [border-width:var(--input-selection-border-width-sm)]",
              visualSize === "md" &&
                "size-[var(--input-indicator-size-md)] [border-radius:var(--input-checkbox-radius-md)] [border-width:var(--input-selection-border-width-md)]",
              visualSize === "lg" &&
                "size-[var(--input-indicator-size-lg)] [border-radius:var(--input-checkbox-radius-lg)] [border-width:var(--input-selection-border-width-lg)]",
              indeterminate &&
                "border-[var(--color-input-radio-checkbox-selected)] bg-[var(--color-input-radio-checkbox-selected)]",
              invalid &&
                "border-[var(--color-input-primary-error-border)] peer-hover:border-[var(--color-input-primary-error-border)]"
            )}
          />
          <span
            aria-hidden="true"
            data-checkbox-icon={indeterminate ? "indeterminate" : "checked"}
            className={cn(
              "pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-input-radio-checkbox-selected-text)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:100%_100%]",
              indeterminate ? "opacity-100" : "opacity-0 peer-checked:opacity-100",
              !indeterminate &&
                visualSize === "sm" &&
                "h-[var(--input-check-height-sm)] w-[var(--input-check-width-sm)]",
              !indeterminate &&
                visualSize === "md" &&
                "h-[var(--input-check-height-md)] w-[var(--input-check-width-md)]",
              !indeterminate &&
                visualSize === "lg" &&
                "h-[var(--input-check-height-lg)] w-[var(--input-check-width-lg)]",
              indeterminate &&
                visualSize === "sm" &&
                "h-[var(--input-indeterminate-height-sm)] w-[var(--input-indeterminate-width-sm)]",
              indeterminate &&
                visualSize === "md" &&
                "h-[var(--input-indeterminate-height-md)] w-[var(--input-indeterminate-width-md)]",
              indeterminate &&
                visualSize === "lg" &&
                "h-[var(--input-indeterminate-height-lg)] w-[var(--input-indeterminate-width-lg)]"
            )}
            style={{
              maskImage: `url(${
                indeterminate ? indeterminateAssets[visualSize] : checkedAssets[visualSize]
              })`,
              WebkitMaskImage: `url(${
                indeterminate ? indeterminateAssets[visualSize] : checkedAssets[visualSize]
              })`
            }}
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
Checkbox.displayName = "Checkbox";
