import type { ComponentProps } from "react";

import {
  ButtonGroup as InternalButtonGroup,
  ButtonGroupSeparator as InternalButtonGroupSeparator,
  ButtonGroupText as InternalButtonGroupText,
  buttonGroupVariants
} from "../internal/button-group";

/**
 * ButtonGroup, sourced from shadcn/ui and adapted to Lumen's token
 * system — see packages/ui/src/components/internal/button-group.tsx for
 * the adaptation notes. Promoted to this plain name after Lumen's own
 * hand-built `ButtonGroup` primitive was retired in favor of this
 * shadcn-sourced implementation (see docs/shadcn-integration.md §7.8) — no
 * longer `Shadcn`-prefixed since there's nothing left to collide with.
 * This public module is the only supported import path; the internal
 * implementation may change without notice.
 */
export type ButtonGroupProps = ComponentProps<typeof InternalButtonGroup>;
export function ButtonGroup(props: ButtonGroupProps) {
  return <InternalButtonGroup {...props} />;
}

export const ButtonGroupText = InternalButtonGroupText;
export const ButtonGroupSeparator = InternalButtonGroupSeparator;
export { buttonGroupVariants };
