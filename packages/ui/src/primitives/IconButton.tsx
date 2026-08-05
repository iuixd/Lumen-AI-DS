import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/**
 * IconButton — a compact, square, icon-only control.
 *
 * Sourced from Lumen-AI-Design-System node `1034:4459` (the "Sizes"
 * reference frame), specifically its "Icon Only - light" instance (node
 * `1035:4738`) — the first real Figma evidence for this primitive, read
 * via `get_design_context`/`get_variable_defs` on 2026-07-29.
 *
 * Reuses `Button`'s live `--color-button-*` token family (the same
 * shadcn-adapted variant set `Button` and `AIButton` already share) rather
 * than the older Primary/Secondary/Ghost/Danger/AI vocabulary in
 * `docs/component-specifications.md` §6 — direct user decision, since that
 * older vocabulary has no live component behind it anymore (see
 * `docs/shadcn-integration.md` §7.8).
 *
 * Only `variant="secondary"` at `size="md"` (34px) matches a literal Figma
 * instance exactly: ~8%/24%-alpha crimson bg/border, a 1.5px border, and
 * 8px radius. The other variants reuse the same already-Figma-synced
 * `--color-button-*` roles `Button`/`AIButton` use, applied to this new
 * icon-only geometry — consistent by construction, not independently
 * sourced per variant. `sm`/`lg`/`xl` sizes and their icon-glyph sizes are
 * inferred by consistency with this same Figma frame's Primary Button icon
 * sizes (12/16/18px), not independently sourced icon-only instances — see
 * `packages/tokens/src/icon-button.json`.
 *
 * `neutral-outline`/`neutral-solid` added 2026-08-04, direct user request,
 * sourced from a dedicated icon-only reference frame (node `1565:3815`,
 * "ico only - 34px", 3 types: Primary/Outline/Solid). That frame's "Primary"
 * type binds to `--btn/secondary/*` — the same instance already documented
 * above as the one literal `secondary` match, reconfirmed, not new. Its
 * "Outline" type binds to `--btn/neutral/secondary/border` (`#dbe1e2`, gray)
 * — a different color family from this component's existing `outline`
 * variant (crimson, from Button's `Outline` style) — so it's added as its
 * own `neutral-outline` variant rather than changing `outline`, reusing
 * Button's `neutral` tokens (`--color-button-neutral-*`) exactly. Its
 * "Solid" type (`#393939` dark fill, white text) has no prior IconButton
 * equivalent — added as `neutral-solid`, reusing Button's new
 * `--color-button-neutral-solid-*` tokens (see
 * `packages/tokens/src/semantic/color.json`'s `_neutralButtonComment`).
 * Only `size="md"` (34px) has a literal instance in this frame, same
 * disclosed-inference caveat as every other variant above.
 *
 * Confirmed permanent, same day: a direct search of the whole Figma file
 * for any component or component-set named "IconButton" (any casing)
 * found none exists — there is no dedicated multi-size icon-only component
 * to source `sm`/`lg`/`xl` from. Every icon-glyph size below `md`, for
 * every variant, is permanent inference-by-consistency with Button's own
 * icon-size ladder, not a temporary gap pending a future sync.
 *
 * Corrected same day, direct user re-confirmation against the full icon-only
 * token table: `neutral-outline`'s border color is the one field that
 * genuinely differs from Button's own `neutral` (outline) variant it
 * otherwise reuses — Figma's dedicated icon-only frame binds a different
 * dark value (`neutral.white`, #FFFFFF) than Button's own Neutral Outline
 * style (`neutral.500`, #5E5E5E); light matches exactly (`lumen-gray.200`
 * both places). Given real, confirmed evidence that this one field diverges
 * per-component, it's no longer safe to blindly inherit Button's shared
 * `--color-button-neutral-border` here — added a dedicated
 * `--color-icon-button-neutral-outline-border` token instead (light value
 * unchanged, dark value now icon-button-specific). Every other field
 * (`Primary`'s bg/border via `secondary`, `Solid`'s bg via `neutral-solid`)
 * was re-verified byte-exact against Button's already-corrected 2026-08-04
 * dark values — genuinely safe to keep inheriting there.
 */
export type IconButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link"
  | "neutral-outline"
  | "neutral-solid";
export type IconButtonSize = "sm" | "md" | "lg" | "xl";

const iconButtonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-[var(--radius-lg)] border border-transparent font-interface transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-button-focus-ring)] disabled:pointer-events-none disabled:border-transparent disabled:bg-[var(--color-button-disabled-bg)] disabled:text-[var(--color-button-disabled-on-action)] [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-button-primary-bg)] text-[var(--color-button-primary-on-action)] hover:bg-[var(--color-button-primary-hover-bg)]",
        destructive:
          "bg-[var(--color-button-destructive-bg)] text-[var(--color-button-destructive-on-action)] hover:bg-[var(--color-button-destructive-hover-bg)]",
        outline:
          "border-[var(--color-button-outline-border)] bg-[var(--color-button-outline-bg)] text-[var(--color-button-outline-on-action)] hover:border-[var(--color-button-outline-hover-border)] hover:bg-[var(--color-button-outline-hover-bg)] hover:text-[var(--color-button-outline-hover-on-action)]",
        secondary:
          "border-[width:var(--icon-button-border-width)] border-[var(--color-button-secondary-border)] bg-[var(--color-button-secondary-bg)] text-[var(--color-button-secondary-on-action)] hover:border-[var(--color-button-secondary-hover-border)] hover:bg-[var(--color-button-secondary-hover-bg)] hover:text-[var(--color-button-secondary-hover-on-action)]",
        ghost: "text-[var(--color-button-ghost-on-action)] hover:bg-[var(--color-button-ghost-hover-bg)]",
        link: "text-[var(--color-button-link-on-action)] hover:underline",
        "neutral-outline":
          "border-[width:var(--icon-button-border-width)] border-[var(--color-icon-button-neutral-outline-border)] bg-[var(--color-button-neutral-bg)] text-[var(--color-button-neutral-on-action)] hover:bg-[var(--color-button-neutral-hover-bg)] hover:text-[var(--color-button-neutral-hover-on-action)]",
        "neutral-solid":
          "bg-[var(--color-button-neutral-solid-bg)] text-[var(--color-button-neutral-solid-on-action)] hover:bg-[var(--color-button-neutral-solid-hover-bg)]"
      },
      size: {
        sm: "size-[var(--spacing-30)] [&_svg]:size-[var(--icon-button-icon-size-sm)]",
        md: "size-[var(--spacing-34)] [&_svg]:size-[var(--icon-button-icon-size-md)]",
        lg: "size-[var(--spacing-38)] [&_svg]:size-[var(--icon-button-icon-size-lg)]",
        xl: "size-[var(--spacing-42)] [&_svg]:size-[var(--icon-button-icon-size-xl)]"
      }
    },
    defaultVariants: { variant: "secondary", size: "md" }
  }
);

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">,
    VariantProps<typeof iconButtonVariants> {
  /** The glyph to render. Required — IconButton has no text label. */
  icon: ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, icon, ...props }, ref) => {
    if (process.env.NODE_ENV !== "production") {
      if (!props["aria-label"] && !props["aria-labelledby"]) {
        // eslint-disable-next-line no-console
        console.warn("IconButton: an accessible name is required — pass aria-label.");
      }
    }
    return (
      <button
        ref={ref}
        type="button"
        className={cn(iconButtonVariants({ variant, size, className }))}
        {...props}
      >
        <span aria-hidden>{icon}</span>
      </button>
    );
  }
);
IconButton.displayName = "IconButton";

export { iconButtonVariants };
