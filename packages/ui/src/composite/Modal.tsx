import type { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../components/internal/dialog";

/**
 * Modal — Figma's canonical "Modal" component (Lumen-AI-Design-System
 * nodes `1737:4152`/`1737:4154` "Modal"/"Modal Mask"), added 2026-08-05 at
 * direct user request. A thin composite over the Radix-backed `Dialog`
 * primitives, not a parallel reimplementation: this exact title +
 * description + separator + right-aligned-actions structure is what
 * `Dialog`'s own chrome was just corrected to match (see
 * `packages/ui/src/components/internal/dialog.tsx`'s own docblock for the
 * full token-by-token record), so `Modal` only supplies the common-case
 * props wiring, the same "compose, don't duplicate" pattern already used
 * by `ContentState` (over `Skeleton`/`Button`) and `Toast`.
 *
 * Replaces an earlier, unrelated `Modal` composite retired the same day —
 * that version was a lightweight, dependency-free (no focus-trap/scroll-
 * lock) implementation with zero consumers and no Figma source; this one
 * supersedes it entirely under the same export name.
 *
 * `DataExtractionOnboardingPage`'s "Remove file?" confirmation — Figma's
 * own example content for the Modal component, byte-for-byte — was
 * migrated to this composite the same day, both as this component's first
 * real consumer and to collapse what had been two independent `Dialog`-
 * primitive call sites down to one.
 */
export interface ModalProps {
  /** Whether the modal is open. Controlled — this component owns no internal open state. */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  /** Supporting copy below the title. Omit for a title-only modal. */
  description?: ReactNode;
  /**
   * Right-aligned action buttons below the separator, e.g.
   * `<><Button variant="ghost">Cancel</Button><Button variant="destructive">Confirm</Button></>`.
   * Omit for a modal with no footer (no separator renders either, matching
   * `DialogFooter`'s own layout — an empty footer would otherwise leave a
   * dangling border).
   */
  actions?: ReactNode;
  className?: string;
}

export function Modal({ open, onOpenChange, title, description, actions, className }: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {actions && <DialogFooter>{actions}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
