import type { ComponentProps } from "react";

import {
  Avatar as InternalAvatar,
  AvatarFallback as InternalAvatarFallback,
  AvatarImage as InternalAvatarImage
} from "../internal/avatar";

/**
 * Avatar, sourced from shadcn/ui (Radix Avatar) and adapted to Lumen's
 * token system — see packages/ui/src/components/internal/avatar.tsx for
 * the adaptation notes. Promoted to this plain name after Lumen's own
 * hand-built `Avatar` primitive was retired in favor of this shadcn-sourced
 * implementation (see docs/shadcn-integration.md §7.8) — no longer
 * `Shadcn`-prefixed since there's nothing left to collide with. This
 * public module is the only supported import path; the internal
 * implementation may change without notice.
 */
export type AvatarProps = ComponentProps<typeof InternalAvatar>;
export function Avatar(props: AvatarProps) {
  return <InternalAvatar {...props} />;
}

export const AvatarImage = InternalAvatarImage;
export const AvatarFallback = InternalAvatarFallback;
