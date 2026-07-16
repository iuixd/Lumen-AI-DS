import { forwardRef, type ButtonHTMLAttributes, type MouseEventHandler, type ReactNode } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../lib/cn";
import { CheckIcon } from "../icons/generated";

/**
 * ChoiceChip
 * Sourced from the Figma "Buttons" page (Lumen-AI-Design-System, node 581:485): a
 * toggleable pill for single-value choices — visually identical to
 * FilterChip's outlined/filled treatment but with no leading icon while
 * unselected and a leading check icon (not a remove affordance) once
 * selected, matching Figma's Default/Selected instances exactly. Only the
 * `lg` size (36px) is specced. Uses `aria-disabled` rather than the native
 * `disabled` attribute, matching the same Buttons page's "02 Accessibility &
 * WCAG 2.1" guidance already followed by Button, SplitButton, and FilterChip.
 *
 * `tone` and `icon` were added for the "AI ButtonGroup Component Library"
 * Toggle Group pattern (node 969:5151, "multi-select" capability pills,
 * via `get_design_context` on 2026-07-16) — reusing this component rather
 * than adding a new one, since it already implements the exact toggle+
 * leading-icon+trailing-check interaction that pattern needs; only the
 * color treatment and an always-visible (not selected-only) leading icon
 * were missing. `tone="solid"` (default) is this component's original,
 * unchanged Figma-581:485 look. `tone="subtle"` reproduces the Toggle
 * Group's pill styling exactly — unselected uses plain `neutral.white`/
 * `neutral.100`/`neutral.500`, selected uses the same `brand.subtle`/
 * `brand.border-strong`/`brand.default` tokens `Button`'s own `secondary`
 * variant already binds to (Figma reuses `--button/surface/secondary/*`
 * variables here, not a new set) — no new tokens were needed for either
 * state.
 */
const choiceChipVariants = cva(
  "inline-flex h-[var(--spacing-36)] items-center justify-center gap-[var(--spacing-6)] whitespace-nowrap rounded-full border-[1.5px] px-[var(--spacing-12)] text-button-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-[var(--color-border-focus)] aria-disabled:pointer-events-none aria-disabled:border-neutral-200 aria-disabled:bg-neutral-50 aria-disabled:text-neutral-400",
  {
    variants: {
      tone: { solid: "", subtle: "" },
      selected: { false: "", true: "" }
    },
    compoundVariants: [
      {
        tone: "solid",
        selected: false,
        class:
          "border-[var(--color-brand-border-strong)] bg-transparent text-[var(--color-brand-default)] hover:border-[var(--color-brand-subtle)] hover:bg-[var(--color-brand-subtle)]"
      },
      {
        tone: "solid",
        selected: true,
        class:
          "border-[var(--color-brand-default)] bg-[var(--color-brand-default)] text-neutral-white hover:border-[var(--color-brand-hover)] hover:bg-[var(--color-brand-hover)]"
      },
      {
        tone: "subtle",
        selected: false,
        class: "border-neutral-100 bg-neutral-white text-neutral-500 hover:border-neutral-200 hover:bg-neutral-50"
      },
      {
        tone: "subtle",
        selected: true,
        class:
          "border-[var(--color-brand-border-strong)] bg-[var(--color-brand-subtle)] text-[var(--color-brand-default)] hover:border-[var(--color-brand-default)]"
      }
    ],
    defaultVariants: { selected: false, tone: "solid" }
  }
);

export interface ChoiceChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "disabled"> {
  /** Whether this choice is currently selected — Figma's Selected state. */
  selected?: boolean;
  disabled?: boolean;
  /**
   * Color treatment: `"solid"` (default) is this component's original
   * Figma-581:485 look (transparent/border-strong unselected, solid brand
   * fill selected). `"subtle"` is the Toggle Group pattern's look (plain
   * neutral unselected, tinted `brand.subtle` selected) — see the
   * component-level doc comment.
   */
  tone?: "solid" | "subtle";
  /** Leading icon, shown regardless of selection state — distinct from the selected-only trailing check. */
  icon?: ReactNode;
}

export const ChoiceChip = forwardRef<HTMLButtonElement, ChoiceChipProps>(
  ({ className, selected = false, disabled, tone = "solid", icon, onClick, children, ...props }, ref) => {
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
        className={cn(choiceChipVariants({ selected, tone }), className)}
        onClick={handleClick}
      >
        {tone === "solid" && selected && <CheckIcon className="size-4 shrink-0" aria-hidden />}
        {icon && <span className="size-4 shrink-0 [&>svg]:size-full">{icon}</span>}
        {children}
        {tone === "subtle" && selected && <CheckIcon className="size-3 shrink-0" aria-hidden />}
      </button>
    );
  }
);
ChoiceChip.displayName = "ChoiceChip";
