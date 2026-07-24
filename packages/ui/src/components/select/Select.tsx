import type { ComponentProps } from "react";

import {
  Select as InternalSelect,
  SelectContent as InternalSelectContent,
  SelectGroup as InternalSelectGroup,
  SelectItem as InternalSelectItem,
  SelectLabel as InternalSelectLabel,
  SelectScrollDownButton as InternalSelectScrollDownButton,
  SelectScrollUpButton as InternalSelectScrollUpButton,
  SelectSeparator as InternalSelectSeparator,
  SelectTrigger as InternalSelectTrigger,
  SelectValue as InternalSelectValue
} from "../internal/select";

/**
 * Select, sourced from shadcn/ui (Radix Select) and adapted to Lumen's
 * token system — see packages/ui/src/components/internal/select.tsx for
 * the adaptation notes. Promoted to this plain name after Lumen's own
 * hand-built `Select` primitive was retired in favor of this shadcn-sourced
 * implementation (see docs/shadcn-integration.md §7.8) — no longer
 * `Shadcn`-prefixed since there's nothing left to collide with. This
 * public module is the only supported import path; the internal
 * implementation may change without notice.
 */
export type SelectProps = ComponentProps<typeof InternalSelect>;
export function Select(props: SelectProps) {
  return <InternalSelect {...props} />;
}

export const SelectGroup = InternalSelectGroup;
export const SelectValue = InternalSelectValue;
export const SelectTrigger = InternalSelectTrigger;
export const SelectContent = InternalSelectContent;
export const SelectLabel = InternalSelectLabel;
export const SelectItem = InternalSelectItem;
export const SelectSeparator = InternalSelectSeparator;
export const SelectScrollUpButton = InternalSelectScrollUpButton;
export const SelectScrollDownButton = InternalSelectScrollDownButton;
