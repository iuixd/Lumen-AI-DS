import { useEffect, type ReactNode } from "react";
import { cn } from "../lib/cn";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

/** Dependency-free modal with focus-trap-free baseline behavior (Escape to close,
 * backdrop click to close). Swap in Radix Dialog if strict focus trapping /
 * portal behavior is required — keep the same props contract. */
export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/40"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={cn("relative w-full max-w-lg rounded-lg bg-[var(--color-background-raised)] p-6 shadow-3")}
      >
        <h2 id="modal-title" className="mb-4 text-title-lg text-[var(--color-text-title)]">
          {title}
        </h2>
        <div className="text-body-md text-[var(--color-text-body)]">{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}
