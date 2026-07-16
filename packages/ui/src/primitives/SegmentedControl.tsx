import { createContext, useContext, useId, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "../lib/cn";

/**
 * SegmentedControl
 * Sourced from the Figma "Buttons" page's "AI ButtonGroup Component Library"
 * section (Lumen-AI-Design-System, node 958:5058, "Segmented Control Group" —
 * the "Tone Selector" example, via `get_design_context` on 2026-07-16): a
 * single-choice, tab-like control — distinct from `ButtonGroup`, which joins
 * full `Button`s with shared borders. This is a padded track where the
 * selected segment lifts onto its own elevated pill. Uses
 * `role="radiogroup"`/`role="radio"` (WAI-ARIA APG Radio Group pattern)
 * since it's a single-choice value picker, not a tab-panel switcher like
 * `Tabs`.
 *
 * Container padding, track radius, and segment radius are Figma-confirmed
 * (3px/12px/8px) uniformly across all sizes. Per-size segment padding and
 * type were re-verified 2026-07-16 against the "Size Rows" example (node
 * 958:5090, `sm`/`md`/`lg` "Concise"/"Detailed" instances) — `sm` uses
 * `Spacing/12` padding + `button-sm` type (12px/20px), `md` uses
 * `Spacing/16` + `button-md` (14px/22px, the original "Tone Selector"
 * evidence), `lg` uses `Spacing/20` + `button-lg` (16px/24px) — all three
 * text tiers are exact matches for this repo's existing `button-*` type
 * scale, already read off this same Buttons page for `Button` itself.
 * `size` values are named in Figma's own "Sizes" note as `sm`/`md`/`lg` =
 * 28/36/44px; `lg`'s 44px isn't on the confirmed spacing scale (no
 * `Spacing/44` token) and is rounded up to the existing `Spacing/48` — the
 * same treatment already applied to `SplitButton`'s sm dropdown segment.
 * Container padding is likewise rounded from Figma's exact 3px up to the
 * nearest existing token, `Spacing/4`.
 */
interface SegmentedControlContextValue {
  value: string;
  setValue: (v: string) => void;
  name: string;
  size: "sm" | "md" | "lg";
  disabled?: boolean;
}
const SegmentedControlContext = createContext<SegmentedControlContextValue | null>(null);

function useSegmentedControlContext() {
  const ctx = useContext(SegmentedControlContext);
  if (!ctx) throw new Error("SegmentedControlOption must be used inside <SegmentedControl>");
  return ctx;
}

const heightBySize = {
  sm: "h-[var(--spacing-28)]",
  md: "h-[var(--spacing-36)]",
  lg: "h-[var(--spacing-48)]"
} as const;

const optionStyleBySize = {
  sm: "px-[var(--spacing-12)] text-button-sm",
  md: "px-[var(--spacing-16)] text-button-md",
  lg: "px-[var(--spacing-20)] text-button-lg"
} as const;

export interface SegmentedControlProps {
  /** Accessible name for the radiogroup — required, since the control has no visible label of its own. */
  "aria-label": string;
  size?: "sm" | "md" | "lg";
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}

export function SegmentedControl({
  size = "md",
  defaultValue,
  value,
  onValueChange,
  disabled,
  children,
  className,
  ...props
}: SegmentedControlProps) {
  const [internal, setInternal] = useState(defaultValue ?? "");
  const name = useId();
  const current = value ?? internal;
  const setValue = (v: string) => {
    onValueChange?.(v);
    if (value === undefined) setInternal(v);
  };

  return (
    <SegmentedControlContext.Provider value={{ value: current, setValue, name, size, disabled }}>
      <div
        {...props}
        role="radiogroup"
        className={cn(
          "inline-flex items-center gap-[var(--spacing-2)] rounded-[var(--radius-xl)] bg-[var(--color-segment-surface)] p-[var(--spacing-4)]",
          heightBySize[size],
          className
        )}
      >
        {children}
      </div>
    </SegmentedControlContext.Provider>
  );
}

export function SegmentedControlOption({ value: optionValue, disabled: optionDisabled, children }: { value: string; disabled?: boolean; children: ReactNode }) {
  const { value, setValue, name, size, disabled: groupDisabled } = useSegmentedControlContext();
  const selected = value === optionValue;
  const disabled = groupDisabled || optionDisabled;

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const group = e.currentTarget.closest('[role="radiogroup"]');
    if (!group) return;
    const options = Array.from(group.querySelectorAll<HTMLButtonElement>('[role="radio"]:not(:disabled)'));
    const currentIndex = options.indexOf(e.currentTarget);
    const nextIndex =
      e.key === "ArrowRight" ? (currentIndex + 1) % options.length : (currentIndex - 1 + options.length) % options.length;
    const next = options[nextIndex];
    next?.focus();
    next?.click();
  };

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      tabIndex={selected ? 0 : -1}
      data-name={name}
      onClick={() => !disabled && setValue(optionValue)}
      onKeyDown={handleKeyDown}
      className={cn(
        "inline-flex h-full shrink-0 items-center justify-center gap-[var(--spacing-6)] whitespace-nowrap rounded-[var(--radius-lg)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-[var(--color-border-focus)] disabled:pointer-events-none disabled:opacity-60",
        optionStyleBySize[size],
        selected
          ? "bg-[var(--color-segment-surface-selected)] text-[var(--color-segment-text-selected)] shadow-[0px_2px_2px_rgba(0,0,0,0.04)] border border-[var(--color-segment-border-selected)]"
          : "border border-transparent text-[var(--color-segment-text)] hover:text-[var(--color-segment-text-selected)]"
      )}
    >
      {children}
    </button>
  );
}
