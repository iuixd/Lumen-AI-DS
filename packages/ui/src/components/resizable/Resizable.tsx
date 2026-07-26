import type { ComponentProps } from "react";

import {
  ResizableHandle as InternalResizableHandle,
  ResizablePanel as InternalResizablePanel,
  ResizablePanelGroup as InternalResizablePanelGroup
} from "../internal/resizable";

/**
 * ResizablePanelGroup/ResizablePanel/ResizableHandle, sourced from
 * shadcn/ui (react-resizable-panels) and adapted to Lumen's token system —
 * see packages/ui/src/components/internal/resizable.tsx for the
 * adaptation notes. This public module is the only supported import path;
 * the internal implementation may change without notice.
 */
export type ResizablePanelGroupProps = ComponentProps<typeof InternalResizablePanelGroup>;
export function ResizablePanelGroup(props: ResizablePanelGroupProps) {
  return <InternalResizablePanelGroup {...props} />;
}

export const ResizablePanel = InternalResizablePanel;
export const ResizableHandle = InternalResizableHandle;
