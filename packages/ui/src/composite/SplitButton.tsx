import { forwardRef, type ButtonHTMLAttributes, type MouseEventHandler, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";
import { ChevronDownIcon } from "../icons/generated";

/**
 * SplitButton
 * Sourced from the Figma "Buttons" page (Lumen-AI-Design-System, node 555:300): a primary
 * action button joined to a dropdown-toggle button by a thin divider, sharing one
 * rounded/pill silhouette.
 *
 * `size` and the `outline` variant were added 2026-07-14 — the Figma component
 * set grew past the original `lg`-only, Primary/Raised/Secondary scope (verified
 * via `get_design_context` on the sm/md size instances and the Outline type
 * instances). `outline` reuses the same border/divider/text tokens as
 * `secondary` (Figma's Outline default-state border, onsurface, and separator
 * variables all point at the existing secondary-scoped tokens) but shows the
 * border at rest instead of only on hover — modeled here as its own variant
 * rather than a `secondary` modifier since Figma treats it as a distinct Type.
 * The dropdown segment's `sm` width is squared off to `--spacing-36` rather
 * than Figma's exact 30px, which isn't on the approved spacing scale
 * (`docs/design-tokens.md` §4) — a new `Spacing/30` token wasn't invented for
 * one non-square edge case; see `docs/changelog.md` `[Unreleased]`.
 *
 * Corner radius (2026-07-16): moved to `rounded-lg` (8px) — see `Button.tsx`'s
 * matching note; confirmed via `get_design_context` on the Primary lg
 * Default instance (node 555:202) and the Split Button AI examples (node
 * 969:5761), both binding `--radius/segment`, not the `--radius/md` (6px)
 * previously used here.
 *
 * Renders two real <button> elements so each half stays independently focusable
 * and clickable — they're genuinely two different actions (run the default
 * action vs open a menu of alternatives). All color/shape styling lives on the
 * wrapping element rather than on the buttons themselves: Figma's own instances
 * only ever show ONE Hover/Active/Focus state for the whole composite (never a
 * separate state per half), and CSS :hover/:active naturally apply to an
 * ancestor while a descendant is hovered/pressed, so a single shared visual
 * state is both what's spec'd and what plain CSS produces for free.
 */
const containerVariants = cva(
  // `has-[:focus-visible]:` rather than `focus-within:` deliberately — the
  // rest of this system only rings on keyboard focus (`focus-visible:`), and
  // `focus-within:` would also fire on a plain mouse click, since clicking a
  // <button> gives it real DOM focus. `:has(:focus-visible)` matches only
  // when a descendant's focus came from the keyboard, same as everywhere else.
  "inline-flex min-w-[var(--spacing-120)] items-stretch overflow-hidden rounded-lg transition-colors has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-offset-4 has-[:focus-visible]:ring-[var(--color-border-focus)] aria-disabled:pointer-events-none aria-disabled:opacity-60",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-brand-default)] text-neutral-white hover:bg-[var(--color-brand-hover)] active:bg-[var(--color-brand-pressed)] aria-disabled:bg-neutral-50 aria-disabled:text-neutral-400",
        raised:
          "bg-[var(--color-brand-default)] text-neutral-white [box-shadow:var(--shadow-button-default)] hover:bg-[var(--color-brand-hover)] hover:[box-shadow:var(--shadow-button-hover)] active:bg-[var(--color-brand-pressed)] active:[box-shadow:var(--shadow-button-active)] aria-disabled:bg-neutral-50 aria-disabled:text-neutral-400 aria-disabled:[box-shadow:var(--shadow-button-disabled)]",
        secondary:
          "border-[1.5px] border-[var(--color-brand-border)] bg-neutral-white text-[var(--color-brand-default)] hover:border-[var(--color-brand-default)] hover:bg-[var(--color-brand-subtle)] active:border-[var(--color-brand-default)] active:bg-[var(--color-brand-subtle-pressed)] aria-disabled:border aria-disabled:border-neutral-200 aria-disabled:bg-neutral-50 aria-disabled:text-neutral-400",
        outline:
          "border-[1.5px] border-[var(--color-brand-border-strong)] bg-neutral-white text-[var(--color-brand-default)] hover:border-[var(--color-brand-default)] hover:bg-[var(--color-brand-subtle)] active:border-[var(--color-brand-default)] active:bg-[var(--color-brand-subtle-pressed)] aria-disabled:border aria-disabled:border-neutral-200 aria-disabled:bg-neutral-50 aria-disabled:text-neutral-400"
      },
      size: {
        sm: "h-[var(--spacing-36)] text-button-sm",
        md: "h-[var(--spacing-40)] text-button-md",
        lg: "h-[var(--spacing-48)] text-button-lg"
      },
      pill: {
        true: "rounded-full"
      }
    },
    defaultVariants: { variant: "primary", size: "lg" }
  }
);

// Tailwind's opacity modifier (`bg-x/30`) can't blend a custom color that's
// itself a CSS-variable reference — it silently emits no rule at all rather
// than erroring (same trap as the shadow arbitrary-value bug), so these use
// dedicated pre-blended rgba tokens from divider.json instead. Figma specs a
// distinct gray divider for the Disabled state too, but that's covered here
// by the container's blanket `aria-disabled:opacity-60` dim (same
// simplification Button.tsx uses — not every sub-element gets its own
// disabled-specific color, most just get dimmed).
const dividerVariants = cva("h-full w-px shrink-0", {
  variants: {
    variant: {
      primary: "[background-color:var(--divider-button-primary)]",
      raised: "[background-color:var(--divider-button-primary)]",
      secondary: "[background-color:var(--divider-button-secondary)]",
      outline: "[background-color:var(--divider-button-secondary)]"
    }
  },
  defaultVariants: { variant: "primary" }
});

const mainVariants = cva("inline-flex flex-1 items-center justify-center gap-[var(--spacing-8)] whitespace-nowrap outline-none disabled:cursor-not-allowed", {
  variants: {
    size: {
      sm: "pl-[var(--spacing-12)] pr-[var(--spacing-8)]",
      md: "pl-[var(--spacing-16)] pr-[var(--spacing-10)]",
      lg: "pl-[var(--spacing-20)] pr-[var(--spacing-12)]"
    }
  },
  defaultVariants: { size: "lg" }
});

const dropdownVariants = cva("inline-flex shrink-0 items-center justify-center outline-none disabled:cursor-not-allowed", {
  variants: {
    size: {
      sm: "size-[var(--spacing-36)]",
      md: "size-[var(--spacing-40)]",
      lg: "size-[var(--spacing-48)]"
    }
  },
  defaultVariants: { size: "lg" }
});

const dropdownIconSizeBySize = {
  sm: "size-4",
  md: "size-4",
  lg: "size-[18px]"
} as const;

export interface SplitButtonProps extends VariantProps<typeof containerVariants> {
  className?: string;
  /** Label for the main action button. */
  children: ReactNode;
  /** Optional leading icon for the main action button — Figma's Icon=Yes instances. */
  iconStart?: ReactNode;
  onMainClick?: MouseEventHandler<HTMLButtonElement>;
  /** Click handler for the dropdown-toggle button — typically opens a menu. */
  onDropdownClick?: MouseEventHandler<HTMLButtonElement>;
  /**
   * Accessible name for the dropdown-toggle button, which has no visible label
   * of its own. A dev-mode console warning fires if it's left at the default.
   */
  dropdownLabel?: string;
  disabled?: boolean;
  isLoading?: boolean;
  mainButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "disabled" | "onClick" | "children">;
  dropdownButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "disabled" | "onClick" | "aria-label">;
}

export const SplitButton = forwardRef<HTMLDivElement, SplitButtonProps>(
  (
    {
      className,
      variant,
      size = "lg",
      pill,
      children,
      iconStart,
      onMainClick,
      onDropdownClick,
      dropdownLabel = "More options",
      disabled,
      isLoading,
      mainButtonProps,
      dropdownButtonProps,
      ...props
    },
    ref
  ) => {
    if (process.env.NODE_ENV !== "production" && dropdownLabel === "More options") {
      // eslint-disable-next-line no-console
      console.warn('SplitButton: pass a specific `dropdownLabel` — "More options" is a placeholder, not a real accessible name.');
    }

    const isMainDisabled = Boolean(disabled || isLoading);

    return (
      <div
        ref={ref}
        {...props}
        className={cn(containerVariants({ variant, size, pill }), className)}
        aria-disabled={disabled || undefined}
      >
        <button
          type="button"
          {...mainButtonProps}
          disabled={isMainDisabled}
          aria-busy={isLoading || undefined}
          onClick={onMainClick}
          className={mainVariants({ size })}
        >
          {isLoading ? (
            <>
              <span className="size-[1em] animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
              <span className="sr-only">{children}</span>
            </>
          ) : (
            <>
              {iconStart}
              {children}
            </>
          )}
        </button>
        <span className={dividerVariants({ variant })} aria-hidden />
        <button
          type="button"
          {...dropdownButtonProps}
          disabled={disabled}
          aria-label={dropdownLabel}
          aria-haspopup="menu"
          onClick={onDropdownClick}
          className={dropdownVariants({ size })}
        >
          <ChevronDownIcon className={dropdownIconSizeBySize[size ?? "lg"]} aria-hidden />
        </button>
      </div>
    );
  }
);
SplitButton.displayName = "SplitButton";
