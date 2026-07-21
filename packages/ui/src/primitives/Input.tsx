import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { SearchIcon } from "../icons/generated/SearchIcon";

export type InputVisualSize = "sm" | "md" | "lg";
export type InputVariant = "default" | "search";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  invalid?: boolean;
  /** A string selects Lumen geometry; a number preserves the native HTML size attribute. */
  size?: InputVisualSize | number;
  variant?: InputVariant;
  leadingIcon?: ReactNode;
  showShortcut?: boolean;
  shortcut?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      invalid,
      disabled,
      size,
      variant = "default",
      leadingIcon,
      showShortcut = true,
      shortcut = "⌘K",
      ...props
    },
    ref
  ) => {
    const visualSize: InputVisualSize = typeof size === "string" ? size : "md";
    const nativeSize = typeof size === "number" ? size : undefined;
    const isSearch = variant === "search";
    const icon = leadingIcon ?? (isSearch ? <SearchIcon /> : undefined);

    return (
      <span className="relative block w-full min-w-128">
        {icon && (
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute top-1/2 z-10 flex size-[var(--spacing-14)] -translate-y-1/2 items-center justify-center text-[var(--color-input-search-icon)] [&>svg]:size-full",
              visualSize === "sm" && "left-[var(--spacing-10)]",
              visualSize === "md" && "left-[var(--spacing-14)]",
              visualSize === "lg" && "left-[var(--spacing-18)]"
            )}
          >
            {icon}
          </span>
        )}
        <input
          ref={ref}
          aria-invalid={invalid || undefined}
          disabled={disabled}
          size={nativeSize}
          className={cn(
            "box-border w-full rounded-lg border bg-[var(--color-input-primary-bg)] py-[var(--spacing-7)] text-[var(--color-text-title)] placeholder:text-[var(--color-input-primary-placeholder-text)]",
            "border-[var(--color-input-primary-border)] hover:border-[1.5px] hover:border-[var(--color-input-primary-hover-border)] focus-visible:border-[2.5px] focus-visible:border-[var(--color-input-primary-focused-border)] focus-visible:outline-none",
            visualSize === "sm" && "h-[var(--spacing-36)] px-[var(--spacing-10)] text-input-sm",
            visualSize === "md" && "h-[var(--spacing-44)] px-[var(--spacing-14)] text-input-md",
            visualSize === "lg" && "h-[var(--spacing-60)] px-[var(--spacing-18)] text-input-md",
            isSearch &&
              "bg-[var(--color-input-search-bg)] border-[var(--color-input-search-border)] hover:border-[var(--color-input-search-hover-border)] focus-visible:border-[var(--color-input-search-focused-border)]",
            icon && visualSize === "sm" && "pl-[var(--spacing-32)]",
            icon && visualSize === "md" && "pl-[var(--spacing-36)]",
            icon && visualSize === "lg" && "pl-[var(--spacing-40)]",
            isSearch && showShortcut && visualSize === "sm" && "pr-[var(--spacing-44)]",
            isSearch && showShortcut && visualSize === "md" && "pr-[var(--spacing-48)]",
            isSearch && showShortcut && visualSize === "lg" && "pr-[var(--spacing-52)]",
            invalid &&
              "border-[var(--color-input-primary-error-border)] hover:border-[var(--color-input-primary-error-border)] focus-visible:border-[var(--color-input-primary-error-border)]",
            disabled && "cursor-not-allowed opacity-50",
            className
          )}
          {...props}
        />
        {isSearch && showShortcut && (
          <kbd
            className={cn(
              "pointer-events-none absolute top-1/2 -translate-y-1/2 rounded-sm border border-[var(--color-border-default)] bg-[var(--color-background-default)] px-[var(--spacing-4)] py-px text-input-shortcut text-[var(--color-input-primary-placeholder-text)]",
              visualSize === "sm" && "right-[var(--spacing-10)]",
              visualSize === "md" && "right-[var(--spacing-14)]",
              visualSize === "lg" && "right-[var(--spacing-18)]"
            )}
          >
            {shortcut}
          </kbd>
        )}
      </span>
    );
  }
);
Input.displayName = "Input";
