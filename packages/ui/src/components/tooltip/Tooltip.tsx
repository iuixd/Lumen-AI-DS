import type { ComponentProps } from "react";

import {
  Tooltip as InternalTooltip,
  TooltipContent as InternalTooltipContent,
  TooltipProvider as InternalTooltipProvider,
  TooltipTrigger as InternalTooltipTrigger
} from "../internal/tooltip";

/**
 * Tooltip, sourced from shadcn/ui (Radix Tooltip) and adapted to Lumen's
 * token system — see packages/ui/src/components/internal/tooltip.tsx for
 * the adaptation notes. Promoted to this plain name after Lumen's own
 * hand-built `Tooltip` primitive was retired in favor of this shadcn-sourced
 * implementation (see docs/shadcn-integration.md §7.8) — no longer
 * `Shadcn`-prefixed since there's nothing left to collide with. This
 * public module is the only supported import path; the internal
 * implementation may change without notice.
 */
export type TooltipProps = ComponentProps<typeof InternalTooltip>;
export function Tooltip(props: TooltipProps) {
  return <InternalTooltip {...props} />;
}

export const TooltipTrigger = InternalTooltipTrigger;
export const TooltipContent = InternalTooltipContent;
export const TooltipProvider = InternalTooltipProvider;
