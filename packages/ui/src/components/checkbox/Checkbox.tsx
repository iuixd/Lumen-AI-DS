import type { ComponentProps } from "react";

import { Checkbox as InternalCheckbox } from "../internal/checkbox";

/**
 * Checkbox, sourced from shadcn/ui (Radix Checkbox) and adapted to Lumen's
 * token system — see packages/ui/src/components/internal/checkbox.tsx for
 * the adaptation notes. Promoted to this plain name after Lumen's own
 * hand-built `Checkbox` primitive was retired in favor of this shadcn-sourced
 * implementation (see docs/shadcn-integration.md §7.8) — no longer
 * `Shadcn`-prefixed since there's nothing left to collide with. This
 * public module is the only supported import path; the internal
 * implementation may change without notice.
 */
export type CheckboxProps = ComponentProps<typeof InternalCheckbox>;
export function Checkbox(props: CheckboxProps) {
  return <InternalCheckbox {...props} />;
}
