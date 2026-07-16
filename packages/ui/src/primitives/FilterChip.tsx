import { forwardRef, type ButtonHTMLAttributes, type MouseEventHandler } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../lib/cn";
import { PlusIcon, XIcon } from "../icons/generated";

/**
 * FilterChip
 * Sourced from the Figma "Buttons" page (Lumen-AI-Design-System, node 581:409): a
 * toggleable pill that represents an addable/removable filter. Unselected,
 * it's outlined with a leading plus icon (an "add this filter" affordance);
 * selected, it fills solid brand and gains a trailing remove (X) icon —
 * confirmed the leading plus icon is KEPT in the selected state via
 * `get_screenshot` on the Selected instance (581:286), since that reads as
 * unusual and wasn't safe to assume from the Figma property names
 * (`chipAddIcon`/`chipDeleteIcon`) alone. Only the `lg` size (36px) is
 * specced — no `size` prop until Figma specs others. Uses `aria-disabled`
 * rather than the native `disabled` attribute, matching the same Buttons
 * page's "02 Accessibility & WCAG 2.1" guidance already followed by Button
 * and SplitButton, so a disabled chip stays keyboard-reachable.
 *
 * The default `PlusIcon` rendered a bordered square around the "+" glyph
 * until 2026-07-16 — not a component bug, but a stray extra path
 * (`packages/ui/src/icons/svg/plus.svg`'s "Stroke 18") left over from its
 * original Iconly-library export, unrelated to Figma's own bare-plus
 * glyph. Fixed at the icon-source level (affects every `PlusIcon`
 * consumer, not just this component) and regenerated via
 * `icons:import`.
 */
const filterChipVariants = cva(
  "inline-flex h-[var(--spacing-36)] items-center justify-center gap-[var(--spacing-6)] whitespace-nowrap rounded-full border-[1.5px] text-button-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-[var(--color-border-focus)] aria-disabled:pointer-events-none aria-disabled:border-neutral-200 aria-disabled:bg-neutral-50 aria-disabled:text-neutral-400",
  {
    variants: {
      selected: {
        false:
          "border-[var(--color-brand-border-strong)] bg-transparent pl-[var(--spacing-12)] pr-[var(--spacing-16)] text-[var(--color-brand-default)] hover:border-[var(--color-brand-subtle)] hover:bg-[var(--color-brand-subtle)]",
        true: "border-[var(--color-brand-default)] bg-[var(--color-brand-default)] px-[var(--spacing-12)] text-neutral-white hover:border-[var(--color-brand-hover)] hover:bg-[var(--color-brand-hover)]"
      }
    },
    defaultVariants: { selected: false }
  }
);

export interface FilterChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "disabled"> {
  /** Whether the filter is currently applied — Figma's Selected state. */
  selected?: boolean;
  disabled?: boolean;
  /** Leading icon override — defaults to the Figma-specced plus glyph. */
  icon?: React.ReactNode;
  /** Trailing remove-icon override, shown only when `selected` — defaults to the Figma-specced X glyph. */
  removeIcon?: React.ReactNode;
}

export const FilterChip = forwardRef<HTMLButtonElement, FilterChipProps>(
  ({ className, selected = false, disabled, icon, removeIcon, onClick, children, ...props }, ref) => {
    const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
      if (disabled) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        type="button"
        {...props}
        aria-pressed={selected}
        aria-disabled={disabled || undefined}
        className={cn(filterChipVariants({ selected }), className)}
        onClick={handleClick}
      >
        {icon ?? <PlusIcon className="size-4 shrink-0" aria-hidden />}
        {children}
        {selected && (removeIcon ?? <XIcon className="size-4 shrink-0" aria-hidden />)}
      </button>
    );
  }
);
FilterChip.displayName = "FilterChip";
