import type { ComponentProps } from "react";

import { Input as InternalInput } from "../internal/input";

/**
 * Input, sourced from shadcn/ui and adapted to Lumen's token system —
 * see packages/ui/src/components/internal/input.tsx for the adaptation
 * notes. Promoted to this plain name after Lumen's original hand-built
 * `Input` primitive was retired in its favor (see
 * docs/shadcn-integration.md §7.8) — no longer `Shadcn`-prefixed since
 * there's nothing left to collide with. This is a plain `<input>`
 * wrapper with a single fixed height: it has no `size` variant (the
 * retired primitive's `size` prop collided with the native HTML `size`
 * attribute anyway), no `variant="search"`/leading-icon slot, and no
 * `invalid`/shortcut-badge props — use `aria-invalid` directly and
 * compose any icon/shortcut decoration around the input yourself. This
 * public module is the only supported import path; the internal
 * implementation may change without notice.
 */
export type InputProps = ComponentProps<typeof InternalInput>;
export function Input(props: InputProps) {
  return <InternalInput {...props} />;
}
