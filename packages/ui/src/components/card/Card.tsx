import type { ComponentProps } from "react";

import {
  Card as InternalCard,
  CardContent as InternalCardContent,
  CardDescription as InternalCardDescription,
  CardFooter as InternalCardFooter,
  CardHeader as InternalCardHeader,
  CardTitle as InternalCardTitle
} from "../internal/card";

/**
 * Card, sourced from shadcn/ui and adapted to Lumen's token system — see
 * packages/ui/src/components/internal/card.tsx for the adaptation notes.
 * Promoted to this plain name after Lumen's original hand-built `Card`
 * primitive was retired in its favor (see docs/shadcn-integration.md
 * §7.8) — no longer `Shadcn`-prefixed since there's nothing left to
 * collide with. Note the root `Card` carries no padding of its own
 * (unlike the retired primitive, which padded its root directly) —
 * padding lives on `CardHeader`/`CardContent`/`CardFooter`, so any loose
 * children need wrapping in `CardContent`. This public module is the
 * only supported import path; the internal implementation may change
 * without notice.
 */
export type CardProps = ComponentProps<typeof InternalCard>;
export function Card(props: CardProps) {
  return <InternalCard {...props} />;
}

export const CardHeader = InternalCardHeader;
export const CardTitle = InternalCardTitle;
export const CardDescription = InternalCardDescription;
export const CardContent = InternalCardContent;
export const CardFooter = InternalCardFooter;
