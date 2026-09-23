import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "../lib/cn";

/** Brief "drop acknowledged" pulse length, per the upload interaction spec (150ms). */
const DROP_PULSE_MS = 150;

export interface FileDropOverlayProps {
  /** Scales the overlay in from the center while `true`; scales it back out when `false`. */
  visible: boolean;
  /** Briefly brightens the surface — the "drop confirmation" cue. */
  pulsing?: boolean;
}

/**
 * FileDropOverlay — the full-viewport violet "drop your files anywhere"
 * surface shown while files are dragged over the window. Copy/color/no-icon
 * are exact Figma matches (node `1565:3375`) — Figma has no icon in this
 * state at all, so none is added here.
 *
 * Moved 2026-09-23 from `DataExtractionOnboardingPage`'s private `DragMask`
 * into `@lumen/ui`, unchanged, so `FileUploadDropzone` shows the same drag
 * state on its own (direct user report: the composite showed no drag-over
 * feedback while the onboarding pattern did). Both now render this one
 * component, driven by `useWindowFileDrag` below.
 *
 * Motion (unchanged from the original, 2026-08-03): a scale-from-center
 * reveal (`--duration-slow`/`--easing-enter`) with an inner text
 * scale+fade (96%→100%, `--duration-moderate`, 50ms delay).
 *
 * Always portals to `document.body`: callers typically sit inside
 * transformed ancestors (`FileUploadDropzone`'s own mount transition,
 * `DataExtractionOnboardingPage`'s `StepTransition`), and a transformed
 * ancestor turns `position: fixed` into "fixed to that ancestor", which
 * would shrink the overlay to the card. Renders nothing until mounted, so
 * server rendering and hydration are unaffected.
 */
export function FileDropOverlay({ visible, pulsing }: FileDropOverlayProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <div
      aria-hidden={!visible}
      data-testid="drag-mask"
      className="pointer-events-none fixed inset-0 z-50"
    >
      <div
        className={cn(
          "absolute inset-0 flex flex-col items-center justify-center gap-[var(--spacing-16)] bg-[var(--color-deep-purple-700)] px-[var(--spacing-32)] text-center transition-[transform,filter] duration-[var(--duration-slow)] ease-[var(--easing-enter)] motion-reduce:transition-none",
          visible ? "scale-100" : "scale-0",
          pulsing && "brightness-125"
        )}
        style={{ transformOrigin: "center" }}
      >
        <div
          className={cn(
            "flex flex-col items-center gap-[var(--spacing-16)] transition-all delay-[50ms] duration-[var(--duration-moderate)] ease-[var(--easing-enter)] motion-reduce:transition-none motion-reduce:delay-0",
            visible ? "scale-100 opacity-100" : "scale-[0.96] opacity-0"
          )}
        >
          <p className="m-0 font-editorial text-display-sm font-semibold text-[var(--color-neutral-white)]">
            Drop your files like there's no limit!
          </p>
          <p className="m-0 text-body-lg font-medium text-[var(--color-deep-purple-200)]">
            Upload files and folders by dropping them in this window
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}

export interface UseWindowFileDragOptions {
  /** Listeners are attached only while `true`. Turning it off also clears any in-progress drag state. */
  enabled: boolean;
  /** Called with the dropped files when a drop lands anywhere on the window (and isn't stopped by a descendant). */
  onDrop?: (files: File[]) => void;
}

export interface UseWindowFileDragResult {
  /** `true` while files are being dragged anywhere over the window. */
  isDragging: boolean;
  /** `true` for a brief moment after a drop — pass to `FileDropOverlay`'s `pulsing`. */
  isDropping: boolean;
  /**
   * Ends the drag and plays the drop pulse. For drops a descendant handles
   * itself and stops from propagating (e.g. `FileUploadDropzone`'s card),
   * which the window listener would otherwise never see.
   */
  acknowledgeDrop: () => void;
}

/**
 * useWindowFileDrag — tracks file drags over the whole window, the state
 * behind `FileDropOverlay`. Moved 2026-09-23 from
 * `DataExtractionOnboardingPage`'s inline effect, unchanged in behavior:
 * only drags carrying `Files` count (text/link drags are ignored), and an
 * enter/leave counter keeps the state stable while the cursor crosses
 * child elements.
 */
export function useWindowFileDrag({ enabled, onDrop }: UseWindowFileDragOptions): UseWindowFileDragResult {
  const [isDragging, setIsDragging] = useState(false);
  const [isDropping, setIsDropping] = useState(false);
  const counterRef = useRef(0);
  const pulseTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const onDropRef = useRef(onDrop);
  onDropRef.current = onDrop;

  const acknowledgeDrop = useCallback(() => {
    counterRef.current = 0;
    setIsDragging(false);
    setIsDropping(true);
    if (pulseTimerRef.current !== undefined) clearTimeout(pulseTimerRef.current);
    pulseTimerRef.current = setTimeout(() => setIsDropping(false), DROP_PULSE_MS);
  }, []);

  useEffect(() => () => clearTimeout(pulseTimerRef.current), []);

  useEffect(() => {
    if (!enabled) {
      counterRef.current = 0;
      setIsDragging(false);
      return;
    }
    function hasFiles(e: DragEvent) {
      return Array.from(e.dataTransfer?.types ?? []).includes("Files");
    }
    function handleDragEnter(e: DragEvent) {
      if (!hasFiles(e)) return;
      e.preventDefault();
      counterRef.current += 1;
      setIsDragging(true);
    }
    function handleDragOver(e: DragEvent) {
      if (hasFiles(e)) e.preventDefault();
    }
    function handleDragLeave(e: DragEvent) {
      if (!hasFiles(e)) return;
      e.preventDefault();
      counterRef.current = Math.max(counterRef.current - 1, 0);
      if (counterRef.current === 0) setIsDragging(false);
    }
    function handleDrop(e: DragEvent) {
      if (!hasFiles(e)) return;
      e.preventDefault();
      acknowledgeDrop();
      const files = e.dataTransfer?.files;
      if (files && files.length > 0) onDropRef.current?.(Array.from(files));
    }
    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("drop", handleDrop);
    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("drop", handleDrop);
    };
  }, [enabled, acknowledgeDrop]);

  return { isDragging, isDropping, acknowledgeDrop };
}
