import type { ComponentProps } from "react";

import { Button as InternalButton, buttonVariants } from "../internal/button";

/**
 * Button, sourced from shadcn/ui and adapted to Lumen's token system —
 * see packages/ui/src/components/internal/button.tsx for the adaptation
 * notes. Promoted to this plain name after Lumen's original hand-built
 * `Button` primitive was retired in its favor (see
 * docs/shadcn-integration.md §7.8) — no longer `Shadcn`-prefixed since
 * there's nothing left to collide with. Note the variant vocabulary
 * changed: `default`/`destructive`/`outline`/`secondary`/`ghost`/`link`
 * (shadcn's set) replaces the retired primitive's
 * `primary`/`accent`/`secondary`/`outline`/`ghost`/`destructive`/`ai` —
 * there is no `accent` or `ai` equivalent, and there are no dedicated
 * `iconStart`/`iconEnd` props; pass an icon as a plain child instead
 * (the base classes already size and space `<svg>` children correctly).
 * Every variant/state's colors are synced to the canonical Figma Button
 * component-set (node `1174:1349`) as of 2026-07-24 — see
 * packages/ui/src/components/internal/button.tsx for the token-by-token
 * mapping. This public module is the only supported import path; the
 * internal implementation may change without notice.
 */
export type ButtonProps = ComponentProps<typeof InternalButton>;
export function Button(props: ButtonProps) {
  return <InternalButton {...props} />;
}

export { buttonVariants };
