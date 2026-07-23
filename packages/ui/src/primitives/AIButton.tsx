import {
  forwardRef,
  type ButtonHTMLAttributes,
  type MouseEventHandler,
  type ReactNode
} from "react";
import { cva } from "class-variance-authority";
import { ChevronDownIcon, LmAisymbolIcon } from "../icons/generated";
import { cn } from "../lib/cn";
import { getAICapability, type AICapabilityId } from "./ai-capabilities";

/** Canonical One AI Button collection, sourced from Figma node `760:1965`. */
export type AIButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "destructive";
export type AIButtonSize = "sm" | "md" | "lg" | "xl";
export type AIButtonSplitVariant = Extract<AIButtonVariant, "primary" | "secondary" | "outline">;

const aiButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg border border-transparent font-interface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-button-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background-default)] aria-disabled:pointer-events-none aria-disabled:border-transparent aria-disabled:bg-[var(--color-button-disabled-bg)] aria-disabled:text-[var(--color-button-disabled-on-action)]",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-button-primary-bg)] text-[var(--color-button-primary-on-action)] hover:bg-[var(--color-button-primary-hover-bg)] hover:text-[var(--color-button-primary-hover-on-action)]",
        secondary:
          "border-[var(--color-button-secondary-border)] bg-[var(--color-button-secondary-bg)] text-[var(--color-button-secondary-on-action)] hover:border-[var(--color-button-secondary-hover-border)] hover:bg-[var(--color-button-secondary-hover-bg)] hover:text-[var(--color-button-secondary-hover-on-action)]",
        ghost:
          "bg-[var(--color-button-ghost-bg)] text-[var(--color-app-shell-text-primary)] hover:bg-[var(--color-button-ghost-hover-bg)]",
        outline:
          "border-[var(--color-button-outline-border)] bg-[var(--color-button-outline-bg)] text-[var(--color-button-outline-on-action)] hover:border-[var(--color-button-outline-hover-border)] hover:bg-[var(--color-button-outline-hover-bg)] hover:text-[var(--color-button-outline-hover-on-action)] focus-visible:border-[var(--color-button-outline-focus-border)]",
        destructive:
          "bg-[var(--color-button-destructive-bg)] text-[var(--color-button-destructive-on-action)] hover:bg-[var(--color-button-destructive-hover-bg)]"
      },
      size: {
        sm: "h-[var(--spacing-30)] gap-[var(--spacing-6)] px-[var(--spacing-14)] text-standard-button-sm",
        md: "h-[var(--spacing-34)] gap-[var(--spacing-8)] px-[var(--spacing-14)] text-standard-button-md",
        lg: "h-[var(--spacing-38)] gap-[var(--spacing-8)] px-[var(--spacing-16)] text-standard-button-lg",
        xl: "h-[var(--spacing-42)] gap-[var(--spacing-8)] px-[var(--spacing-16)] text-standard-button-xl"
      },
      iconOnly: {
        true: "aspect-square min-w-0 p-0"
      }
    },
    compoundVariants: [
      { variant: "ghost", size: "md", class: "h-[var(--spacing-36)] px-[var(--spacing-16)]" }
    ],
    defaultVariants: { variant: "primary", size: "md" }
  }
);

const splitVariantClasses: Record<AIButtonSplitVariant, string> = {
  primary:
    "border-transparent bg-[var(--color-button-primary-bg)] text-[var(--color-button-primary-on-action)] hover:bg-[var(--color-button-primary-hover-bg)] hover:text-[var(--color-button-primary-hover-on-action)]",
  secondary:
    "border-[var(--color-button-secondary-border)] bg-[var(--color-button-secondary-bg)] text-[var(--color-button-secondary-on-action)] hover:border-[var(--color-button-secondary-hover-border)] hover:bg-[var(--color-button-secondary-hover-bg)] hover:text-[var(--color-button-secondary-hover-on-action)]",
  outline:
    "border-[var(--color-button-outline-border)] bg-[var(--color-button-outline-bg)] text-[var(--color-button-outline-on-action)] hover:border-[var(--color-button-outline-hover-border)] hover:bg-[var(--color-button-outline-hover-bg)] hover:text-[var(--color-button-outline-hover-on-action)]"
};

const splitDividerClasses: Record<AIButtonSplitVariant, string> = {
  primary: "border-[color-mix(in_srgb,currentColor_32%,transparent)]",
  secondary: "border-[var(--color-button-secondary-border)]",
  outline: "border-[var(--color-button-outline-border)]"
};

export interface AIButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size"> {
  variant?: AIButtonVariant;
  size?: AIButtonSize;
  /** Leading capability icon. The AI symbol is used when no override is supplied. */
  icon?: ReactNode;
  /** Square button treatment. An accessible name is required. */
  iconOnly?: boolean;
  /** Replaces the icon with the Figma spinner while retaining the visible label. */
  isLoading?: boolean;
  /** Supplies the Figma label, description metadata, icon, and analytics convention. */
  capability?: AICapabilityId | (string & NonNullable<unknown>);
  /** Renders the canonical two-action split button. Available for primary, secondary, and outline. */
  split?: boolean;
  onDropdownClick?: MouseEventHandler<HTMLButtonElement>;
  dropdownLabel?: string;
}

export const AIButton = forwardRef<HTMLButtonElement, AIButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      icon,
      iconOnly,
      isLoading,
      capability,
      split,
      onDropdownClick,
      dropdownLabel = "More AI actions",
      disabled,
      onClick,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = Boolean(disabled || isLoading);
    const resolvedCapability = capability ? getAICapability(capability) : undefined;
    const label = children ?? resolvedCapability?.label;
    const CapabilityIcon = resolvedCapability?.icon;
    const resolvedIcon =
      icon ??
      (CapabilityIcon ? <CapabilityIcon aria-hidden /> : <LmAisymbolIcon aria-hidden />);
    const resolvedAriaLabel =
      props["aria-label"] ??
      (iconOnly ? (isLoading ? "Generating" : resolvedCapability?.label) : undefined);

    if (process.env.NODE_ENV !== "production") {
      if (iconOnly && !resolvedAriaLabel && !props["aria-labelledby"]) {
        // eslint-disable-next-line no-console
        console.warn("AIButton: iconOnly buttons must have an accessible name — pass aria-label.");
      }
      if (capability && !resolvedCapability) {
        // eslint-disable-next-line no-console
        console.warn(`AIButton: unrecognized capability "${capability}".`);
      }
      if (split && !["primary", "secondary", "outline"].includes(variant)) {
        // eslint-disable-next-line no-console
        console.warn("AIButton: split buttons support primary, secondary, and outline variants.");
      }
    }

    const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
      if (isDisabled) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
    };

    const sharedData = {
      "data-capability": capability || undefined,
      "data-ai-analytics-event": resolvedCapability?.analyticsEvent
    };

    if (split) {
      const splitVariant: AIButtonSplitVariant =
        variant === "secondary" || variant === "outline" ? variant : "primary";

      return (
        <span
          role="group"
          className={cn(
            "inline-flex h-[var(--spacing-34)] min-w-[var(--spacing-120)] overflow-hidden rounded-lg font-interface text-standard-button-md",
            className
          )}
        >
          <button
            ref={ref}
            type="button"
            {...props}
            {...sharedData}
            className={cn(
              "inline-flex min-w-0 flex-1 items-center justify-center gap-[var(--spacing-8)] border py-[var(--spacing-7)] pl-[var(--spacing-14)] pr-[var(--spacing-10)] transition-colors focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-button-focus-ring)] aria-disabled:pointer-events-none aria-disabled:bg-[var(--color-button-disabled-bg)] aria-disabled:text-[var(--color-button-disabled-on-action)]",
              splitVariantClasses[splitVariant]
            )}
            aria-disabled={disabled || undefined}
            aria-busy={isLoading || undefined}
            onClick={handleClick}
          >
            <span className="flex size-[var(--spacing-18)] shrink-0 items-center justify-center [&>svg]:size-full">
              {isLoading ? (
                <span
                  className="size-[var(--spacing-12)] animate-spin rounded-full border-2 border-current border-t-transparent"
                  aria-hidden
                />
              ) : (
                resolvedIcon
              )}
            </span>
            {label}
          </button>
          <button
            type="button"
            className={cn(
              "inline-flex w-[var(--spacing-34)] shrink-0 items-center justify-center border border-l transition-colors focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-button-focus-ring)] aria-disabled:pointer-events-none aria-disabled:bg-[var(--color-button-disabled-bg)] aria-disabled:text-[var(--color-button-disabled-on-action)]",
              splitVariantClasses[splitVariant],
              splitDividerClasses[splitVariant]
            )}
            aria-label={dropdownLabel}
            aria-haspopup="menu"
            aria-disabled={isDisabled || undefined}
            onClick={isDisabled ? undefined : onDropdownClick}
          >
            <ChevronDownIcon className="w-[var(--spacing-10)]" aria-hidden />
          </button>
        </span>
      );
    }

    return (
      <button
        ref={ref}
        type="button"
        {...props}
        {...sharedData}
        className={cn(
          aiButtonVariants({ variant, size, iconOnly }),
          isLoading && "px-[var(--spacing-16)]",
          className
        )}
        aria-disabled={disabled || undefined}
        aria-busy={isLoading || undefined}
        aria-label={resolvedAriaLabel}
        onClick={handleClick}
      >
        <span
          className={cn(
            "flex size-[var(--spacing-14)] shrink-0 items-center justify-center [&>svg]:size-full",
            !iconOnly && variant === "outline" && "size-[var(--spacing-16)]"
          )}
        >
          {isLoading ? (
            <span
              className="size-[var(--spacing-12)] animate-spin rounded-full border-2 border-current border-t-transparent"
              aria-hidden
            />
          ) : (
            resolvedIcon
          )}
        </span>
        {!iconOnly && label}
      </button>
    );
  }
);
AIButton.displayName = "AIButton";
