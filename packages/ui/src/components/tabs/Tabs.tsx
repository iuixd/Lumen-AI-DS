import type { ComponentProps } from "react";

import {
  Tabs as InternalTabs,
  TabsContent as InternalTabsContent,
  TabsList as InternalTabsList,
  TabsTrigger as InternalTabsTrigger
} from "../internal/tabs";

/**
 * Tabs, sourced from shadcn/ui (Radix Tabs) and adapted to Lumen's token
 * system — see packages/ui/src/components/internal/tabs.tsx for the
 * adaptation notes. Promoted to this plain name after Lumen's original
 * hand-built `Tabs` primitive was retired in its favor (see
 * docs/shadcn-integration.md §7.8) — no longer `Shadcn`-prefixed since
 * there's nothing left to collide with. The `Tabs` root API is unchanged
 * (`value`/`defaultValue`/`onValueChange`), but the sub-components are
 * renamed: `TabList`→`TabsList`, `Tab`→`TabsTrigger`, `TabPanel`→
 * `TabsContent`. This public module is the only supported import path;
 * the internal implementation may change without notice.
 */
export type TabsProps = ComponentProps<typeof InternalTabs>;
export function Tabs(props: TabsProps) {
  return <InternalTabs {...props} />;
}

export const TabsList = InternalTabsList;
export const TabsTrigger = InternalTabsTrigger;
export const TabsContent = InternalTabsContent;
