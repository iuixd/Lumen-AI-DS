import type { ComponentProps } from "react";

import { Switch as InternalSwitch } from "../internal/switch";

/**
 * Switch, sourced from shadcn/ui (Radix Switch) and adapted to Lumen's
 * token system — see packages/ui/src/components/internal/switch.tsx for
 * the adaptation notes. Promoted to this plain name after Lumen's own
 * hand-built `Switch` primitive was retired in favor of this shadcn-sourced
 * implementation (see docs/shadcn-integration.md §7.8) — no longer
 * `Shadcn`-prefixed since there's nothing left to collide with. This
 * public module is the only supported import path; the internal
 * implementation may change without notice.
 */
export type SwitchProps = ComponentProps<typeof InternalSwitch>;
export function Switch(props: SwitchProps) {
  return <InternalSwitch {...props} />;
}
