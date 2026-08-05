import type { ComponentProps } from "react";

import {
  Dialog as InternalDialog,
  DialogClose as InternalDialogClose,
  DialogContent as InternalDialogContent,
  DialogDescription as InternalDialogDescription,
  DialogFooter as InternalDialogFooter,
  DialogHeader as InternalDialogHeader,
  DialogOverlay as InternalDialogOverlay,
  DialogPortal as InternalDialogPortal,
  DialogTitle as InternalDialogTitle,
  DialogTrigger as InternalDialogTrigger
} from "../internal/dialog";

/**
 * Dialog, sourced from shadcn/ui (Radix Dialog) — the same internal
 * source Command's palette already uses (see
 * packages/ui/src/components/internal/dialog.tsx). Exported publicly for
 * the first time in batch 5, under its own plain name: no existing Lumen
 * export is named `Dialog` (Lumen's own equivalent was named `Modal`),
 * so there is no collision to prefix — see docs/shadcn-integration.md
 * §7.1. This public module is the only supported import path; the
 * internal implementation may change without notice.
 *
 * Corrected 2026-08-05, direct user request against Figma's canonical
 * "Modal"/"Modal Mask" components (Lumen-AI-Design-System nodes
 * `1737:4152`/`1737:4154`): the "Lumen's own equivalent is named Modal"
 * note above turned out to be backwards. `Modal` (`packages/ui/src/
 * composite/Modal.tsx`) was a lightweight, dependency-free composite with
 * zero consumers and no Figma source; `Dialog` is the Radix-backed
 * component that was already actively rendering exactly this "title +
 * description + separator + right-aligned actions" structure (see
 * `DataExtractionOnboardingPage`'s "Remove file?" confirmation) — which
 * turns out to be Figma's real "Modal" component, byte-for-byte the same
 * example content. Rather than adding a third, overlapping component
 * (`CLAUDE.md`'s "never duplicate an existing component" rule), `Dialog`'s
 * default chrome (`internal/dialog.tsx`) was corrected to match this
 * Figma spec exactly, and the unused `Modal` composite was retired
 * outright. `Dialog` is now the canonical implementation of Figma's
 * "Modal" component.
 */
export type DialogProps = ComponentProps<typeof InternalDialog>;
export function Dialog(props: DialogProps) {
  return <InternalDialog {...props} />;
}

export const DialogTrigger = InternalDialogTrigger;
export const DialogClose = InternalDialogClose;
export const DialogContent = InternalDialogContent;
export const DialogHeader = InternalDialogHeader;
export const DialogFooter = InternalDialogFooter;
export const DialogTitle = InternalDialogTitle;
export const DialogDescription = InternalDialogDescription;
export const DialogPortal = InternalDialogPortal;
export const DialogOverlay = InternalDialogOverlay;
