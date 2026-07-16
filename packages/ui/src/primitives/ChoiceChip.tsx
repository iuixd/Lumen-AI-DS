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
 *
 * `tone="subtle"`'s box model was corrected 2026-07-16 (re-verified via
 * `get_design_context` on the live Toggle Group pill instances, node
 * `969:5287`/`969:5299`) — it does NOT share `tone="solid"`'s 36px/
 * `button-lg`/6px-gap/12px-padding/1.5px-border box model, which is
 * `ChoiceChip`'s own 581:485 spec, a different Figma component instance.
 * The Toggle Group pill instead hugs `py-8` around an 18px-line-height
 * 14px label to a **38px** height (the new `--spacing-38` token), uses
 * `button-md` type (14px/22px, not `button-lg`'s 16px/24px), an **8px**
 * gap, **16px** horizontal padding, and a plain 1px border (not 1.5px) —
 * and its leading icon is **14px**, not the 16px `size-4` used elsewhere.
 * The trailing check icon (12px, `size-3`) was already correct.
 */
const choiceChipVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-[var(--color-border-focus)] aria-disabled:pointer-events-none aria-disabled:border-neutral-200 aria-disabled:bg-neutral-50 aria-disabled:text-neutral-400",
  {
    variants: {
      tone: {
        solid: "h-[var(--spacing-36)] gap-[var(--spacing-6)] border-[1.5px] px-[var(--spacing-12)] text-button-lg",
        subtle: "h-[var(--spacing-38)] gap-[var(--spacing-8)] border px-[var(--spacing-16)] text-button-md"
      },
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
        {icon && (
          <span
            className={cn("shrink-0 [&>svg]:size-full", tone === "subtle" ? "size-[var(--spacing-14)]" : "size-4")}
          >
            {icon}
          </span>
        )}
        {children}
        {tone === "subtle" && selected && <CheckIcon className="size-3 shrink-0" aria-hidden />}
      </button>
    );
  }
);
ChoiceChip.displayName = "ChoiceChip";
