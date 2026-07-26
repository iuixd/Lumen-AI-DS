import type { ComponentProps } from "react";

import {
  InputGroup as InternalInputGroup,
  InputGroupAddon as InternalInputGroupAddon,
  InputGroupButton as InternalInputGroupButton,
  InputGroupInput as InternalInputGroupInput,
  InputGroupText as InternalInputGroupText,
  InputGroupTextarea as InternalInputGroupTextarea
} from "../internal/input-group";

/**
 * InputGroup, sourced from shadcn/ui and adapted to Lumen's token system —
 * see packages/ui/src/components/internal/input-group.tsx for the
 * adaptation notes. Wraps `Input`/`Textarea` with leading/trailing
 * addons (icons, buttons, text, `Kbd`). This public module is the only
 * supported import path; the internal implementation may change without
 * notice.
 */
export type InputGroupProps = ComponentProps<typeof InternalInputGroup>;
export function InputGroup(props: InputGroupProps) {
  return <InternalInputGroup {...props} />;
}

export const InputGroupAddon = InternalInputGroupAddon;
export const InputGroupButton = InternalInputGroupButton;
export const InputGroupInput = InternalInputGroupInput;
export const InputGroupTextarea = InternalInputGroupTextarea;
export const InputGroupText = InternalInputGroupText;
