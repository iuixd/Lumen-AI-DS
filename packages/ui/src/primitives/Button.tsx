import { forwardRef, type ButtonHTMLAttributes, type MouseEventHandler } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/**
 * Button
 * Sourced from the Figma "Buttons" page (Lumen-AI-Design-System, node 475:7210, formerly
 * 466:4365): variant taxonomy (Primary/Secondary/Tertiary/Link/Raised/Outline),
 * sizes (xs/sm/md/lg), per-size text (the dedicated `button-*` type scale),
 * per-state colors, the Pill Button shape modifier, and the focus-ring/elevation
 * treatment all trace to real component instances there. "Icon only" is
 * documented as its own Type in Figma (always Primary-styled, always bordered)
 * rather than a variant of its own — modeled here as the `{ variant: "primary",
 * iconOnly: true }` compound, since Figma doesn't spec icon-only Secondary/
 * Tertiary/Link/Raised/Outline looks and `iconOnly` still works as a general
 * square-shape modifier for those. See that page's "02 Accessibility & WCAG
 * 2.1" section for the source of the aria-disabled/aria-busy/aria-label
 * requirements below. The page also has `Left`/`Right` icon-position instances
 * for Primary/Raised/Secondary/Tertiary/Link — these don't get their own
 * `variant`, since the existing `iconStart`/`iconEnd` props already reproduce
 * their exact box model (6px gap, unchanged per-size padding); only the icon's
 * own size is new — it scales with Button `size` (14/16/18/18px for xs/sm/md/lg,
 * the `--spacing-14`/`--spacing-18` tokens) independently of the `button-*`
 * text scale, see `Button.stories.tsx`'s `WithIcons` story for the sizing per
 * size.
 *
 * `status` ("success" | "warning" | "error") is a later addition sourced from
 * the same component-set's State property, which now includes Success/Error/
 * Warning alongside the interaction states above (Figma confirmed via
 * `get_design_context` on the Success/Error/Warning instances for Primary and
 * Secondary at every size). It's modeled as an independent modifier, not a
 * `variant` value, because Figma treats it that way: the tinted
 * surface/text/border replace a variant's own colors while everything else
 * (border presence, shape) still follows the base `variant`. Only Primary and
 * Secondary instances were sourced; the override is applied to every variant
 * on the assumption the same tint is variant-agnostic, consistent with what
 * Primary vs. Secondary already showed (identical surface/text, border only
 * where the variant normally has one). Not re-verified against `outline` —
 * see Known limitations in `docs/component-specifications.md` §5.
 *
 * Corner radius (2026-07-16): every checked instance across every type/size
 * now binds `--radius/segment` (8px), not the `--radius/md` (6px) previously
 * used here — confirmed via `get_design_context` on Primary xs/sm/lg and
 * Secondary md instances. Maps directly onto the existing `radius.lg`
 * primitive (8px), so this is `rounded-lg`, not a new token.
 *
 * `secondary` and the new `outline` variant (both re-verified/added 2026-07-16
 * via `get_design_context` on nodes 538:62/538:302/538:1262/538:842 for
 * Secondary and 806:5997/806:5993/806:5989/806:5980 for Outline, all at
 * Size=md): both share the exact same border (`brand.border-strong`, not the
 * lighter `brand.border` `secondary` previously used at rest — a stale token
 * this pass corrects) and text (`brand.default`) colors at every state — the
 * *only* difference between them is the rest/hover fill: `secondary` is
 * filled (`brand.subtle`) at rest and hover; `outline` is transparent at rest
 * and only fills (`brand.subtle`) on hover, matching a bordered→filled
 * "outline" convention. Active is identical for both: a solid `brand.solid-
 * active` fill with white text and no border (see that token's own doc
 * comment in `packages/tokens/src/semantic/color.json` — this replaces the
 * `brand.subtle-pressed` fill `secondary` previously used on `active:`, which
 * was a stale guess from before this direct re-verification). `outline`'s own
 * hover border binds to the exact same Figma variable as its hover fill
 * (`--button/surface/secondary/surface`) rather than a separate border
 * variable — reproduced here as literally specced (`hover:border-[var(--color-
 * brand-subtle)]`, matching its `hover:bg-*`) even though it reads as a likely
 * Figma authoring artifact (a copy-paste of the fill variable into the border
 * slot, the same class of quirk already documented elsewhere in this file),
 * because the visual result (an invisible border blending into the fill) is
 * unambiguous and reproducible either way.
 */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-[var(--spacing-6)] whitespace-nowrap rounded-lg border-[1.5px] border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-[var(--color-border-focus)] aria-disabled:pointer-events-none aria-disabled:opacity-60",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-brand-default)] text-neutral-white hover:bg-[var(--color-brand-hover)] active:bg-[var(--color-brand-pressed)] active:[box-shadow:var(--shadow-button-pressed-inset)] focus-visible:border-[var(--color-brand-border)] aria-disabled:border-transparent aria-disabled:bg-neutral-50 aria-disabled:text-neutral-400",
        // Elevation uses the arbitrary-CSS-PROPERTY syntax (`[box-shadow:var(...)]`),
        // not the `shadow-[var(...)]` arbitrary-VALUE syntax — Tailwind's `shadow-*`
        // utility guesses whether a bracketed value is a full shadow or just a shadow
        // *color* override, and a bare `var(...)` reads as "could be a color" to that
        // heuristic. That silently turned every `shadow-[var(--shadow-button-*)]` into
        // a --tw-shadow-color assignment with no matching --tw-shadow-colored shape to
        // use it, while Tailwind's own default `.shadow` utility (0 1px 3px/0 1px 2px)
        // rendered instead — a shadow that "looked plausible" but didn't match Figma at
        // all. `[box-shadow:...]` sets the CSS property directly, no ambiguity.
        raised:
          "bg-[var(--color-brand-default)] text-neutral-white [box-shadow:var(--shadow-button-default)] hover:bg-[var(--color-brand-hover)] hover:[box-shadow:var(--shadow-button-hover)] active:bg-[var(--color-brand-pressed)] active:[box-shadow:var(--shadow-button-active)] focus-visible:border-[var(--color-brand-border)] aria-disabled:border-transparent aria-disabled:bg-neutral-50 aria-disabled:text-neutral-400 aria-disabled:[box-shadow:var(--shadow-button-disabled)]",
        secondary:
          "border-[var(--color-brand-border-strong)] bg-[var(--color-brand-subtle)] text-[var(--color-brand-default)] hover:border-[var(--color-brand-default)] hover:bg-[var(--color-brand-subtle)] active:border-transparent active:bg-[var(--color-brand-solid-active)] active:text-neutral-white aria-disabled:border aria-disabled:border-neutral-200 aria-disabled:bg-neutral-50 aria-disabled:text-neutral-400",
        outline:
          "border-[var(--color-brand-border-strong)] bg-transparent text-[var(--color-brand-default)] hover:border-[var(--color-brand-subtle)] hover:bg-[var(--color-brand-subtle)] active:border-transparent active:bg-[var(--color-brand-solid-active)] active:text-neutral-white aria-disabled:border aria-disabled:border-neutral-200 aria-disabled:bg-neutral-50 aria-disabled:text-neutral-400",
        tertiary:
          "bg-transparent text-[var(--color-brand-default)] hover:bg-[var(--color-brand-subtle)] active:bg-[var(--color-brand-subtle-pressed)] aria-disabled:bg-transparent aria-disabled:text-neutral-400",
        link: "min-w-0 border-0 bg-transparent p-[var(--spacing-4)] text-[var(--color-brand-default)] hover:underline active:underline aria-disabled:text-neutral-400",
        // Sourced from the canonical "AppShell" page (Lumen-AI-Design-System, node
        // 1007:3700, Breakpoint=Desktop/Theme=Light instance 1127:4196) via
        // get_variable_defs: exact theme-aware `btn/accent/bg` and
        // `btn/accent/text` roles. Used for the PageHeader "New project" button
        // and AIPanel send button; no unsourced hover/active treatment is added.
        accent:
          "bg-[var(--color-app-shell-button-accent-bg)] text-[var(--color-app-shell-button-accent-text)] focus-visible:border-[var(--color-app-shell-button-accent-bg)]"
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
      /** Figma's "Pill Button" modifier — fully rounded corners, independent of variant/size. */
      pill: {
        true: "rounded-full"
      },
      /**
       * Figma's Success/Error/Warning "State" values — a tinted status override,
       * independent of `variant`. Figma models State as one mutually-exclusive
       * enum (a button is never simultaneously Disabled and Success), so there's
       * no spec for a disabled+status combination; deliberately no `aria-disabled`
       * override here, so the variant's own disabled (greyed-out) styling applies
       * unconflicted when both are set.
       */
      status: {
        success:
          "border-transparent bg-[var(--color-status-success-subtle)] text-[var(--color-status-success-text)] hover:bg-[var(--color-status-success-subtle)] hover:text-[var(--color-status-success-text)] active:bg-[var(--color-status-success-subtle)] active:text-[var(--color-status-success-text)] active:[box-shadow:none] focus-visible:border-transparent",
        warning:
          "border-transparent bg-[var(--color-status-warning-subtle)] text-[var(--color-status-warning-text)] hover:bg-[var(--color-status-warning-subtle)] hover:text-[var(--color-status-warning-text)] active:bg-[var(--color-status-warning-subtle)] active:text-[var(--color-status-warning-text)] active:[box-shadow:none] focus-visible:border-transparent",
        error:
          "border-transparent bg-[var(--color-status-error-subtle)] text-[var(--color-status-error-text)] hover:bg-[var(--color-status-error-subtle)] hover:text-[var(--color-status-error-text)] active:bg-[var(--color-status-error-subtle)] active:text-[var(--color-status-error-text)] active:[box-shadow:none] focus-visible:border-transparent"
      }
    },
    compoundVariants: [
      { iconOnly: true, size: "xs", class: "size-[var(--spacing-32)]" },
      { iconOnly: true, size: "sm", class: "size-[var(--spacing-36)]" },
      { iconOnly: true, size: "md", class: "size-[var(--spacing-40)]" },
      { iconOnly: true, size: "lg", class: "size-[var(--spacing-48)]" },
      // Figma's "Icon only" Type: always has a visible border (unlike text Primary,
      // which is borderless except on focus), losing it only when disabled.
      {
        variant: "primary",
        iconOnly: true,
        class:
          "border-[var(--color-brand-border)] hover:border-[var(--color-brand-default)] active:border-[var(--color-brand-default)] aria-disabled:border-transparent"
      },
      // Only Secondary (the sole bordered variant Figma actually specced a
      // Success/Error/Warning instance for) gets a status-tinted border —
      // Figma's Primary/Success instance has no border at all, matching
      // Primary's own borderless default look.
      ...(["secondary"] as const).flatMap((variant) =>
        (["success", "warning", "error"] as const).map((status) => ({
          variant,
          status,
          class: `border-[var(--color-status-${status}-border)] hover:border-[var(--color-status-${status}-border)] active:border-[var(--color-status-${status}-border)]`
        }))
      )
    ],
    defaultVariants: { variant: "primary", size: "md" }
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  /** Renders a leading icon slot. Ignored when `iconOnly` is set — use `children` for the icon instead. */
  iconStart?: React.ReactNode;
  /** Renders a trailing icon slot. Ignored when `iconOnly` is set. */
  iconEnd?: React.ReactNode;
  isLoading?: boolean;
  /**
   * Renders a square, label-less button sized to just the icon passed as `children`.
   * Per the Figma a11y notes, an icon-only button must have an accessible name —
   * pass `aria-label`. A dev-mode console warning fires if one isn't provided.
   */
  iconOnly?: boolean;
  /** Figma's "Pill Button" modifier — fully rounded corners instead of the default `rounded-lg`. */
  pill?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      status,
      iconStart,
      iconEnd,
      isLoading,
      iconOnly,
      pill,
      disabled,
      onClick,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = Boolean(disabled || isLoading);

    if (
      process.env.NODE_ENV !== "production" &&
      iconOnly &&
      !props["aria-label"] &&
      !props["aria-labelledby"]
    ) {
      // eslint-disable-next-line no-console
      console.warn("Button: iconOnly buttons must have an accessible name — pass aria-label.");
    }

    // Figma's a11y notes call for aria-disabled over the native `disabled` attribute
    // so keyboard users can still reach (and be told why they can't activate) a
    // disabled button, rather than having it silently removed from tab order.
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
        className={cn(buttonVariants({ variant, size, iconOnly, pill, status }), className)}
        aria-disabled={isDisabled || undefined}
        aria-busy={isLoading || undefined}
        aria-label={isLoading && iconOnly && !props["aria-label"] ? "Loading" : props["aria-label"]}
        onClick={handleClick}
      >
        {isLoading ? (
          <span
            className="size-[1em] animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden
          />
        ) : (
          iconStart
        )}
        {/* Loading hides the label visually but keeps it in the accessibility tree
            (sr-only) rather than removing it — otherwise a loading non-icon-only
            button would announce no accessible name at all. */}
        {isLoading ? children && <span className="sr-only">{children}</span> : children}
        {!isLoading && iconEnd}
      </button>
    );
  }
);
Button.displayName = "Button";
