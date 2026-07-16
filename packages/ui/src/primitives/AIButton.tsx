import { forwardRef, type ButtonHTMLAttributes, type MouseEventHandler, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";
import { LmAisymbolIcon } from "../icons/generated";
import { getAICapability, type AICapabilityId } from "./ai-capabilities";

/**
 * AIButton
 * Sourced from the new "AI Communication Component Library" section of the
 * Figma "Buttons" page (Lumen-AI-Design-System, node 760:1965), added 2026-07-14 —
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
 * Corner radius (2026-07-16): moved to `rounded-lg` (8px) — see `Button.tsx`'s
 * matching note; confirmed via `get_design_context` on a "Split Button
 * Groups" AI instance (node 769:9290) binding `--radius/segment`.
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
 *
 * `raised`, `link`, and `status` (2026-07-16, via `get_design_context` on
 * the "AI Button Component Library" States table, node `852:7996`, which
 * specs 6 variant columns × 9 state rows — this component previously only
 * covered 4 of those columns and none of the status rows):
 * - `raised` reuses `Button`'s exact `raised` classes (same
 *   `--button/shadow/ambient`/`--button/shadow` tokens, confirmed on node
 *   `852:8035`) — Figma's "Primary Raised" AI instance is pixel-identical
 *   to `Button`'s.
 * - `link` is NOT `Button`'s `link` (hover-only underline) — Figma's AI
 *   Link instance (node `860:8464`) is **always** underlined, still
 *   carries the mandatory leading icon, and uses the same
 *   `gap-8`/`p-4`/`min-w-0` compact layout `Button`'s `link` already
 *   established.
 * - `status` (success/error/warning) is NOT a copy of `Button`'s status
 *   treatment, which tints every variant the same subtle way. Figma's AI
 *   Button instead treats `primary`/`raised` differently from the rest:
 *   `secondary`/`tertiary`/`outline`/`link` get the familiar subtle tint
 *   (confirmed on node `860:8344` Secondary+Success: `success.subtle`
 *   bg/`success.border` border/`success.text` text — the same tokens and
 *   the same Secondary-only tinted-border exception `Button.tsx` already
 *   documents), but `primary`/`raised` get a **solid** fill with white
 *   text instead (confirmed on nodes `860:8278`/`860:8242`: solid
 *   `success.text` (green.700, `#006400`) background, not the usual
 *   light `success.subtle`). Error/Warning are solid `status.error`/
 *   `status.warning` (red.500/orange.500) rather than their own "-text"
 *   tier — an asymmetry versus Success that's reproduced as literally
 *   specced (likely a contrast-driven choice: green.500 against white
 *   wouldn't clear the same ratio red.500/orange.500 do). `raised` keeps
 *   its elevation shadow under a status override (confirmed on node
 *   `860:8242`, which still carries the drop-shadow); plain `primary`
 *   has no shadow to keep either way.
 *
 * `capability` is a convenience prop, not a Figma-sourced property: it looks
 * up `./ai-capabilities`' catalog and supplies a default label/icon so
 * callers don't have to hand-assemble both for every AI action (e.g.
 * `<AIButton capability="summarize" />` instead of manually passing
 * `icon`/`children`). Explicit `icon`/`children` always win when both are
 * given — `capability` only fills in what's missing. It also stamps
 * `data-capability`/`data-ai-analytics-event` on the rendered `<button>` so
 * a consuming app can wire its own action/tracking; see `ai-capabilities.ts`
 * for why `analyticsEvent` is a naming convention only, not a real
 * analytics integration.
 */
const aiButtonVariants = cva(
  "inline-flex items-center justify-center gap-[var(--spacing-8)] whitespace-nowrap rounded-lg border-[1.5px] border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-[var(--color-border-focus)] aria-disabled:pointer-events-none aria-disabled:opacity-60",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-brand-default)] text-neutral-white hover:bg-[var(--color-brand-hover)] active:bg-[var(--color-brand-pressed)] aria-disabled:bg-neutral-50 aria-disabled:text-neutral-400",
        raised:
          "bg-[var(--color-brand-default)] text-neutral-white [box-shadow:var(--shadow-button-default)] hover:bg-[var(--color-brand-hover)] hover:[box-shadow:var(--shadow-button-hover)] active:bg-[var(--color-brand-pressed)] active:[box-shadow:var(--shadow-button-active)] aria-disabled:bg-neutral-50 aria-disabled:text-neutral-400 aria-disabled:[box-shadow:var(--shadow-button-disabled)]",
        secondary:
          "border-[var(--color-brand-border-strong)] bg-[var(--color-brand-subtle)] text-[var(--color-brand-default)] hover:border-[var(--color-brand-default)] active:border-[var(--color-brand-default)] active:bg-[var(--color-brand-subtle-pressed)] aria-disabled:border-neutral-200 aria-disabled:bg-neutral-50 aria-disabled:text-neutral-400",
        tertiary:
          "bg-transparent text-[var(--color-brand-default)] hover:bg-[var(--color-brand-subtle)] active:bg-[var(--color-brand-subtle-pressed)] aria-disabled:bg-transparent aria-disabled:text-neutral-400",
        outline:
          "border-[var(--color-brand-border-strong)] bg-transparent text-[var(--color-brand-default)] hover:bg-[var(--color-brand-subtle)] hover:border-[var(--color-brand-subtle)] active:border-[var(--color-brand-default)] active:bg-[var(--color-brand-subtle-pressed)] aria-disabled:border-neutral-200 aria-disabled:bg-transparent aria-disabled:text-neutral-400",
        link: "min-w-0 border-0 bg-transparent p-[var(--spacing-4)] text-[var(--color-brand-default)] underline aria-disabled:text-neutral-400"
      },
      size: {
        xs: "h-[var(--spacing-32)] min-w-[var(--spacing-64)] px-[var(--spacing-10)] py-[var(--spacing-5)] text-button-xs",
        sm: "h-[var(--spacing-36)] min-w-[var(--spacing-80)] px-[var(--spacing-12)] py-[var(--spacing-6)] text-button-sm",
        md: "h-[var(--spacing-40)] min-w-[var(--spacing-96)] px-[var(--spacing-16)] py-[var(--spacing-8)] text-button-md",
        lg: "h-[var(--spacing-48)] min-w-[var(--spacing-120)] px-[var(--spacing-20)] py-[var(--spacing-10)] text-button-lg"
      },
      iconOnly: {
        true: "min-w-0 p-0"
      },
      /**
       * Figma's Success/Error/Warning "State" values, same modeling as
       * `Button.tsx`'s own `status` — independent of `variant`, base
       * classes here are the subtle tint shared by secondary/tertiary/
       * outline/link; `primary`/`raised` get a solid override via
       * `compoundVariants` below. See the file doc comment for the exact
       * Figma evidence.
       */
      status: {
        success:
          "border-transparent bg-[var(--color-status-success-subtle)] text-[var(--color-status-success-text)] hover:bg-[var(--color-status-success-subtle)] hover:text-[var(--color-status-success-text)] active:bg-[var(--color-status-success-subtle)] active:text-[var(--color-status-success-text)]",
        warning:
          "border-transparent bg-[var(--color-status-warning-subtle)] text-[var(--color-status-warning-text)] hover:bg-[var(--color-status-warning-subtle)] hover:text-[var(--color-status-warning-text)] active:bg-[var(--color-status-warning-subtle)] active:text-[var(--color-status-warning-text)]",
        error:
          "border-transparent bg-[var(--color-status-error-subtle)] text-[var(--color-status-error-text)] hover:bg-[var(--color-status-error-subtle)] hover:text-[var(--color-status-error-text)] active:bg-[var(--color-status-error-subtle)] active:text-[var(--color-status-error-text)]"
      }
    },
    compoundVariants: [
      { iconOnly: true, size: "xs", class: "size-[var(--spacing-32)]" },
      { iconOnly: true, size: "sm", class: "size-[var(--spacing-36)]" },
      { iconOnly: true, size: "md", class: "size-[var(--spacing-40)]" },
      { iconOnly: true, size: "lg", class: "size-[var(--spacing-48)]" },
      // Only Secondary (the sole bordered non-solid variant Figma specced a
      // Success/Error/Warning instance for) gets a status-tinted border —
      // same exception `Button.tsx` documents for its own `secondary`.
      ...(["secondary"] as const).flatMap((variant) =>
        (["success", "warning", "error"] as const).map((status) => ({
          variant,
          status,
          class: `border-[var(--color-status-${status}-border)] hover:border-[var(--color-status-${status}-border)] active:border-[var(--color-status-${status}-border)]`
        }))
      ),
      // Primary/Raised: Figma overrides the subtle tint with a solid fill +
      // white text instead (see file doc comment). Success uses the darker
      // "-text" tier as its own fill (green.700, since green.500 doesn't
      // clear the same white-text contrast red.500/orange.500 do);
      // Error/Warning use their base tier directly.
      ...(["primary", "raised"] as const).flatMap((variant) => [
        {
          variant,
          status: "success" as const,
          class:
            "border-transparent bg-[var(--color-status-success-text)] text-neutral-white hover:bg-[var(--color-status-success-text)] hover:text-neutral-white active:bg-[var(--color-status-success-text)] active:text-neutral-white"
        },
        {
          variant,
          status: "warning" as const,
          class:
            "border-transparent bg-[var(--color-status-warning)] text-neutral-white hover:bg-[var(--color-status-warning)] hover:text-neutral-white active:bg-[var(--color-status-warning)] active:text-neutral-white"
        },
        {
          variant,
          status: "error" as const,
          class:
            "border-transparent bg-[var(--color-status-error)] text-neutral-white hover:bg-[var(--color-status-error)] hover:text-neutral-white active:bg-[var(--color-status-error)] active:text-neutral-white"
        }
      ])
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
  /**
   * Looks up `./ai-capabilities` and supplies a default `icon`/label for a
   * known AI action (e.g. `capability="summarize"`). Not a Figma property —
   * see the file doc comment above. Explicit `icon`/`children` still take
   * precedence when passed; an unrecognized id falls back to default
   * rendering with a dev-mode warning, same pattern as the `iconOnly`
   * accessible-name check below.
   */
  capability?: AICapabilityId | (string & NonNullable<unknown>);
}

export const AIButton = forwardRef<HTMLButtonElement, AIButtonProps>(
  (
    {
      className,
      variant,
      size,
      status,
      icon,
      isLoading,
      iconOnly,
      destructive,
      capability,
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
    const resolvedAriaLabel =
      isLoading && iconOnly && !props["aria-label"]
        ? "Generating"
        : (props["aria-label"] ?? (iconOnly ? resolvedCapability?.label : undefined));

    if (process.env.NODE_ENV !== "production") {
      if (iconOnly && !resolvedAriaLabel && !props["aria-labelledby"]) {
        // eslint-disable-next-line no-console
        console.warn("AIButton: iconOnly buttons must have an accessible name — pass aria-label.");
      }
      if (capability && !resolvedCapability) {
        // eslint-disable-next-line no-console
        console.warn(`AIButton: unrecognized capability "${capability}" — falling back to default rendering.`);
      }
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
        data-capability={capability || undefined}
        data-ai-analytics-event={resolvedCapability?.analyticsEvent}
        className={cn(aiButtonVariants({ variant, size, iconOnly, status }), className)}
        aria-disabled={isDisabled || undefined}
        aria-busy={isLoading || undefined}
        aria-label={resolvedAriaLabel}
        onClick={handleClick}
      >
        {isLoading ? (
          <span className="size-[1em] shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
        ) : (
          (icon ??
            (CapabilityIcon ? <CapabilityIcon className="size-[18px] shrink-0" aria-hidden /> : undefined) ?? (
              <LmAisymbolIcon className="size-[18px] shrink-0" aria-hidden />
            ))
        )}
        {isLoading ? label && <span className="sr-only">{label}</span> : label}
      </button>
    );
  }
);
AIButton.displayName = "AIButton";
