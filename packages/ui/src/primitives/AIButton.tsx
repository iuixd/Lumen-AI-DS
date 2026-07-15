import { forwardRef, type ButtonHTMLAttributes, type MouseEventHandler, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";
import { LmAisymbolIcon } from "../icons/generated";

/**
 * AIButton
 * Sourced from the new "AI Communication Component Library" section of the
 * Figma "Buttons" page (Lumen-DS-2027, node 760:1965), added 2026-07-14 —
 * confirmed via `get_design_context` on the Primary/Secondary/Tertiary/
 * Outline AI instances, the Icon-Only AI instances, Loading AI, and
 * Destructive AI. This is a distinct component from `Button`, not a variant
 * of it, because two of its four types don't reuse Button's existing variant
 * colors: `secondary` here is a filled-tint look (brand-subtle background +
 * brand-border-strong border) that doesn't match Button's borderless-until-
 * hover `secondary`, and `outline` doesn't exist on Button at all yet (see
 * `docs/changelog.md` `[Unreleased]` for that open item). `primary` and
 * `tertiary` do reuse Button's exact primary/tertiary colors.
 *
 * Every instance in Figma — every variant, every size, Loading, even
 * Destructive — carries a mandatory leading icon, the `lm-aisymbol` glyph
 * (confirmed via `get_design_context` on node 760:1965's Secondary Icon
 * Only AI instances, 2026-07-15 — supersedes the generic sparkle glyph
 * this shipped with initially); there is no icon-less AI Button instance.
 * `icon` is still an overridable prop (Figma swaps the glyph per
 * capability — Rewrite uses a wand icon, Translate a languages icon — see
 * the Capability Catalog), but it always renders one.
 *
 * `destructive` is a behavioral flag, not a color: Figma's "Destructive AI"
 * instance is pixel-identical to Secondary AI (same surface/border/text
 * tokens) — the distinction is that destructive AI actions require
 * confirmation before running, same rule Button.tsx already documents for
 * regular destructive actions. No dedicated visual treatment was invented.
 *
 * `isLoading` mirrors Button's own pattern exactly: the leading icon is
 * replaced by a spinner and the label is expected to change ("Generating…")
 * — confirmed via the Loading AI instance, which is otherwise identical to
 * Primary AI.
 *
 * Sizes reuse Button's xs/sm/md/lg padding and text scale. Figma's AI Sizes
 * section specs `xs` at 28px tall, 4px shorter than Button's own 32px `xs` —
 * not matched exactly here, to avoid a second xs height scale for one
 * component; flagged as a known limitation rather than invented as a new
 * token. sm/md/lg (36/40/48px) match Button's scale exactly.
 *
 * Split Button AI (a dropdown-toggle pairing, analogous to `SplitButton`)
 * is documented in Figma but not implemented here — see
 * `docs/changelog.md` `[Unreleased]`.
 */
const aiButtonVariants = cva(
  "inline-flex items-center justify-center gap-[var(--spacing-8)] whitespace-nowrap rounded-md border-[1.5px] border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-[var(--color-border-focus)] aria-disabled:pointer-events-none aria-disabled:opacity-60",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-brand-default)] text-neutral-white hover:bg-[var(--color-brand-hover)] active:bg-[var(--color-brand-pressed)] aria-disabled:bg-neutral-50 aria-disabled:text-neutral-400",
        secondary:
          "border-[var(--color-brand-border-strong)] bg-[var(--color-brand-subtle)] text-[var(--color-brand-default)] hover:border-[var(--color-brand-default)] active:border-[var(--color-brand-default)] active:bg-[var(--color-brand-subtle-pressed)] aria-disabled:border-neutral-200 aria-disabled:bg-neutral-50 aria-disabled:text-neutral-400",
        tertiary:
          "bg-transparent text-[var(--color-brand-default)] hover:bg-[var(--color-brand-subtle)] active:bg-[var(--color-brand-subtle-pressed)] aria-disabled:bg-transparent aria-disabled:text-neutral-400",
        outline:
          "border-[var(--color-brand-border-strong)] bg-transparent text-[var(--color-brand-default)] hover:bg-[var(--color-brand-subtle)] hover:border-[var(--color-brand-subtle)] active:border-[var(--color-brand-default)] active:bg-[var(--color-brand-subtle-pressed)] aria-disabled:border-neutral-200 aria-disabled:bg-transparent aria-disabled:text-neutral-400"
      },
      size: {
        xs: "h-[var(--spacing-32)] min-w-[var(--spacing-64)] px-[var(--spacing-10)] py-[var(--spacing-5)] text-button-xs",
        sm: "h-[var(--spacing-36)] min-w-[var(--spacing-80)] px-[var(--spacing-12)] py-[var(--spacing-6)] text-button-sm",
        md: "h-[var(--spacing-40)] min-w-[var(--spacing-96)] px-[var(--spacing-16)] py-[var(--spacing-8)] text-button-md",
        lg: "h-[var(--spacing-48)] min-w-[var(--spacing-120)] px-[var(--spacing-20)] py-[var(--spacing-10)] text-button-lg"
      },
      iconOnly: {
        true: "min-w-0 p-0"
      }
    },
    compoundVariants: [
      { iconOnly: true, size: "xs", class: "size-[var(--spacing-32)]" },
      { iconOnly: true, size: "sm", class: "size-[var(--spacing-36)]" },
      { iconOnly: true, size: "md", class: "size-[var(--spacing-40)]" },
      { iconOnly: true, size: "lg", class: "size-[var(--spacing-48)]" }
    ],
    defaultVariants: { variant: "primary", size: "md" }
  }
);

export interface AIButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof aiButtonVariants> {
  /** Leading icon override — defaults to the Figma-specced `lm-aisymbol` glyph, present on every instance. */
  icon?: ReactNode;
  isLoading?: boolean;
  /**
   * Renders a square, label-less button sized to just the icon. Per the
   * Buttons page's a11y notes (already followed by Button/SplitButton), an
   * icon-only button must have an accessible name — pass `aria-label`.
   */
  iconOnly?: boolean;
  /**
   * Marks this as a destructive AI action (e.g. "Clean Up Records"). Purely
   * behavioral — Figma specs no distinct color for it — so callers are
   * expected to require confirmation before invoking `onClick`; this prop
   * only documents intent and does not change styling.
   */
  destructive?: boolean;
}

export const AIButton = forwardRef<HTMLButtonElement, AIButtonProps>(
  ({ className, variant, size, icon, isLoading, iconOnly, destructive, disabled, onClick, children, ...props }, ref) => {
    const isDisabled = Boolean(disabled || isLoading);

    if (process.env.NODE_ENV !== "production" && iconOnly && !props["aria-label"] && !props["aria-labelledby"]) {
      // eslint-disable-next-line no-console
      console.warn("AIButton: iconOnly buttons must have an accessible name — pass aria-label.");
    }

    const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
      if (isDisabled) {
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
        data-destructive={destructive || undefined}
        className={cn(aiButtonVariants({ variant, size, iconOnly }), className)}
        aria-disabled={isDisabled || undefined}
        aria-busy={isLoading || undefined}
        aria-label={isLoading && iconOnly && !props["aria-label"] ? "Generating" : props["aria-label"]}
        onClick={handleClick}
      >
        {isLoading ? (
          <span className="size-[1em] shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
        ) : (
          (icon ?? <LmAisymbolIcon className="size-[18px] shrink-0" aria-hidden />)
        )}
        {isLoading ? children && <span className="sr-only">{children}</span> : children}
      </button>
    );
  }
);
AIButton.displayName = "AIButton";
