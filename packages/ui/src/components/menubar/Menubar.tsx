import type { ComponentProps } from "react";

import {
  Menubar as InternalMenubar,
  MenubarCheckboxItem as InternalMenubarCheckboxItem,
  MenubarContent as InternalMenubarContent,
  MenubarGroup as InternalMenubarGroup,
  MenubarItem as InternalMenubarItem,
  MenubarLabel as InternalMenubarLabel,
  MenubarMenu as InternalMenubarMenu,
  MenubarPortal as InternalMenubarPortal,
  MenubarRadioGroup as InternalMenubarRadioGroup,
  MenubarRadioItem as InternalMenubarRadioItem,
  MenubarSeparator as InternalMenubarSeparator,
  MenubarShortcut as InternalMenubarShortcut,
  MenubarSub as InternalMenubarSub,
  MenubarSubContent as InternalMenubarSubContent,
  MenubarSubTrigger as InternalMenubarSubTrigger,
  MenubarTrigger as InternalMenubarTrigger
} from "../internal/menubar";

/**
 * Menubar, sourced from shadcn/ui (Radix Menubar) and adapted to Lumen's
 * token system — see packages/ui/src/components/internal/menubar.tsx for
 * the adaptation notes. This public module is the only supported import
 * path; the internal implementation may change without notice.
 */
export type MenubarProps = ComponentProps<typeof InternalMenubar>;
export function Menubar(props: MenubarProps) {
  return <InternalMenubar {...props} />;
}

export const MenubarMenu = InternalMenubarMenu;
export const MenubarTrigger = InternalMenubarTrigger;
export const MenubarContent = InternalMenubarContent;
export const MenubarItem = InternalMenubarItem;
export const MenubarSeparator = InternalMenubarSeparator;
export const MenubarLabel = InternalMenubarLabel;
export const MenubarCheckboxItem = InternalMenubarCheckboxItem;
export const MenubarRadioGroup = InternalMenubarRadioGroup;
export const MenubarRadioItem = InternalMenubarRadioItem;
export const MenubarPortal = InternalMenubarPortal;
export const MenubarSub = InternalMenubarSub;
export const MenubarSubContent = InternalMenubarSubContent;
export const MenubarSubTrigger = InternalMenubarSubTrigger;
export const MenubarGroup = InternalMenubarGroup;
export const MenubarShortcut = InternalMenubarShortcut;
