import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/cn"

/**
 * shadcn/ui's own generated Button — adapted here. Source for the public
 * `Button` export (promoted from `ShadcnButton` after Lumen's original
 * hand-built `Button` primitive was retired in its favor — see
 * docs/shadcn-integration.md §7.8) and an internal dependency of
 * Carousel/Form/Pagination/ButtonGroup. Adaptation changes: relative
 * imports, `text-sm`/`text-xs` -> `label-md`/`label-sm`, dropped
 * `shadow`/`shadow-sm` (no Lumen precedent on Lumen's own Button.tsx).
 *
 * Re-synced to Figma 2026-07-24 (Lumen-AI-Design-System node `1174:1349`,
 * the canonical Button component-set, requested directly by the user now
 * that this is the one canonical `Button`): every variant/state pair binds
 * directly to its own `--color-button-*` semantic token (arbitrary-value
 * classes) instead of shadcn's generic bridge tokens (`--primary`,
 * `--secondary`, `--accent`, `--ring`), since those are shared by other
 * components and a generic mapping had drifted from what this component
 * actually needs — `outline`/`ghost`'s hover previously used `--accent`
 * (a "selected nav row" placeholder token, see docs/shadcn-integration.md
 * §5), and `hover:bg-primary`/`hover:bg-destructive`/`hover:bg-secondary`
 * were literal no-ops (same class as the base state, a leftover from the
 * original batch-5 adaptation). The token sync itself found real drift in
 * `Secondary` and `Outline`'s hover colors against the current Figma
 * values — see `packages/tokens/src/semantic/color.json`'s `_comment` for
 * the full before/after. `Accent` is a declared style property on the
 * Figma component with no authored visual state, so it remains unwired
 * (by direct user decision, consistent with §7.8's "no accent variant"
 * call). Only a `Light` theme is authored in Figma; dark-mode values are
 * untouched, same caveat as the rest of this repo's dark tokens.
 *
 * `link`'s color was synced 2026-07-26 to the first real evidence found
 * for it (the canonical AIPanel component, node 1079:3141, "Show sources"
 * follow-up button) — `--color-button-link-on-action` (primary.500),
 * replacing shadcn's generic `text-primary` bridge-token fallback.
 *
 * `link-on-action`'s dark value corrected 2026-07-27 (user report: "TextLink
 * color is incorrect in dark mode, not reused the TextLink component") —
 * dark had independently drifted to `primary.500` (matching light only by
 * coincidence) instead of matching `TextLink`'s own dark color, `primary.300`
 * (`text.link.dark`). Figma's own dark instance literally binds this text to
 * the unrelated `btn/secondary/on-action` variable (`primary.100`) since it
 * has never authored a dedicated link-button variable — per direct user
 * instruction, that literal binding was not followed; `TextLink`'s actual
 * color was used instead, since a Button styled as a link should always look
 * like this system's one canonical link, not redirect through whichever
 * unrelated variable a given Figma frame happened to reuse.
 *
 * `size="default"`'s height changed 2026-07-29 from shadcn's own `h-9`
 * (36px) to `h-[var(--spacing-34)]` (34px), by direct user instruction, to
 * match the `md` height `AIButton`/`IconButton` use from the same
 * 30/34/38/42px scale (Figma node `1034:4459`). `sm`/`lg`/`icon` sizes are
 * unchanged.
 *
 * 2026-07-29 (same day, re-audit of the full canonical collection, node
 * `1174:1349`, at direct user request): radius changed from shadcn's own
 * `rounded-md` (6px, never token-backed) to the new `--radius-button`
 * (10px) — Figma's own bound `radius/xl` variable on this node resolves to
 * 10px, not the 8px this component previously shipped with (see
 * `radius.json`'s note on the new `button` step). `outline`'s border
 * thickened from the plain `border` (1px) to `border-[1.5px]`, matching
 * Figma's evidenced Outline border width; `secondary` remains 1px, also
 * matching Figma. `ghost`'s text/hover-bg color fix lives in
 * `packages/tokens/src/semantic/color.json` (`_buttonComment`), not here.
 *
 * `neutral` added 2026-07-31, at direct user request ("I want you to use
 * this neutral button", with a screenshot of the component's own
 * Default/Hover/Focused/Disabled anatomy) — the Figma Button component set
 * gained a new `Style=Neutral` variant since the last sync (nodes
 * `1540:2550`/`2944`/`2950`/`2958`), used by `EnterpriseLoginPage`'s SSO/
 * "Continue with email" buttons and its inactive workspace chip, which had
 * previously been hand-rolling this look via one-off `className` overrides
 * on top of `outline` in that pattern file instead of getting a real
 * variant here — the CLAUDE.md rule against duplicating a component's look
 * outside its own definition. Border/bg/text/hover-bg all bind to new
 * dedicated `--color-button-neutral-*` tokens (see `semantic/color.json`'s
 * `_neutralButtonComment`); Focused and Disabled need no variant-specific
 * classes, since Figma's own bound values for both states already match
 * this component's existing shared global treatment exactly (the base
 * `focus-visible:ring` color and the base `disabled:*` classes).
 *
 * Corrected 2026-08-04, direct user request against a fresh Figma pull (node
 * `1565:3797`, the reorganized 'Variants' showcase for canonical set
 * `1174:1349`): `neutral`'s hover state was wrong — it lightened
 * (`neutral.50`) instead of Figma's real solid dark fill (`lumen-gray.800`,
 * `#424849`) with text flipping to white; both fixed, see
 * `packages/tokens/src/semantic/color.json`'s `_neutralButtonComment` for
 * the full token-level record. Also added `neutral-solid`, a second,
 * previously-undocumented Figma style (`Style=Neutral Solid`) distinct from
 * plain `neutral` (which is Figma's `Style=Neutral Outline`) — a permanent
 * dark fill (`neutral.700`) with white text, hovering to pure black
 * (`neutral.black`), not an outline at all. Kept as a separate variant name
 * rather than folding into `neutral` since the two are visually and
 * semantically distinct treatments in Figma, not two states of one style.
 *
 * Corrected 2026-08-04, direct user request against a fresh `get_variable_defs`
 * pull on this same canonical node (`1174:1349`): the base label typography
 * was `text-label-md font-medium` — a "helper labels" preset (12px/18) never
 * meant for button text at all, with its baked-in 600 weight only
 * accidentally landing on the right value (500) because `font-medium`
 * happened to win the cascade. Figma's real bound label style across every
 * variant/state (`Body/Small Medium`) is 14px/22/weight-500 — exactly
 * `body-sm-w500` (renamed same day from `body-sm-medium`, direct user
 * request, to a numeric-weight suffix — a one-token exception to this
 * file's usual word-based weight naming), an existing token from an
 * earlier, unrelated sync (`FileUploadProgressList`). Swapped to
 * `text-body-sm-w500` and dropped the now-redundant `font-medium`
 * override. Affects every size that doesn't
 * already have its own text-size override (`default`/`lg`); `sm`'s existing
 * `text-label-sm` override was not re-verified — no Figma evidence exists
 * for a `sm`-sized instance of this canonical Button to check it against.
 *
 * Corrected 2026-08-05, direct user report ("Button label font style also
 * not matching the Figma Design") — the same latent gap just found and
 * fixed on `Dialog`'s title/description: `body-sm-w500` (like every
 * typography-scale utility in this repo) only carries font-size/line-
 * height/weight, never font-family, and this base class string never paired
 * it with an explicit `font-interface` class. With no repo-wide font-family
 * reset, every Button label was silently falling through to Tailwind
 * Preflight's generic system-UI stack instead of the actual bound
 * `Instrument Sans` webfont (loaded via Storybook's Google Fonts import,
 * but never requested) — a real, if subtle, typeface mismatch against
 * Figma on every single Button in the app, not particular to any one
 * variant/size. Added `font-interface` to the base class string.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-button)] font-interface text-body-sm-w500 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-button-focus-ring)] disabled:pointer-events-none disabled:border-transparent disabled:bg-[var(--color-button-disabled-bg)] disabled:text-[var(--color-button-disabled-on-action)] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-button-primary-bg)] text-[var(--color-button-primary-on-action)] hover:bg-[var(--color-button-primary-hover-bg)]",
        destructive:
          "bg-[var(--color-button-destructive-bg)] text-[var(--color-button-destructive-on-action)] hover:bg-[var(--color-button-destructive-hover-bg)]",
        outline:
          "border-[1.5px] border-[var(--color-button-outline-border)] bg-[var(--color-button-outline-bg)] text-[var(--color-button-outline-on-action)] hover:border-[var(--color-button-outline-hover-border)] hover:bg-[var(--color-button-outline-hover-bg)] hover:text-[var(--color-button-outline-hover-on-action)]",
        secondary:
          "border border-[var(--color-button-secondary-border)] bg-[var(--color-button-secondary-bg)] text-[var(--color-button-secondary-on-action)] hover:border-[var(--color-button-secondary-hover-border)] hover:bg-[var(--color-button-secondary-hover-bg)] hover:text-[var(--color-button-secondary-hover-on-action)]",
        ghost:
          "text-[var(--color-button-ghost-on-action)] hover:bg-[var(--color-button-ghost-hover-bg)]",
        link: "text-[var(--color-button-link-on-action)] underline-offset-4 hover:underline",
        neutral:
          "border border-[var(--color-button-neutral-border)] bg-[var(--color-button-neutral-bg)] text-[var(--color-button-neutral-on-action)] hover:bg-[var(--color-button-neutral-hover-bg)] hover:text-[var(--color-button-neutral-hover-on-action)] disabled:border-[var(--color-button-neutral-disabled-border)]",
        "neutral-solid":
          "bg-[var(--color-button-neutral-solid-bg)] text-[var(--color-button-neutral-solid-on-action)] hover:bg-[var(--color-button-neutral-solid-hover-bg)]"
      },
      size: {
        default: "h-[var(--spacing-34)] px-4 py-2",
        sm: "h-8 px-3 text-label-sm",
        lg: "h-10 px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
