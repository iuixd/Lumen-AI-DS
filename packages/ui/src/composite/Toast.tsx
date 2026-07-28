import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode
} from "react";
import { motion } from "@lumen/tokens";
import { cn } from "../lib/cn";
import { InfoOutlinedIcon } from "../icons/generated/InfoOutlinedIcon";
import { WarningAmberOutlinedIcon } from "../icons/generated/WarningAmberOutlinedIcon";
import { CloseFilledIcon } from "../icons/generated/CloseFilledIcon";

/**
 * Toast — brief, non-blocking feedback following an action.
 *
 * Sourced from Lumen-AI-Design-System node `1475:5100` (frame "Toast";
 * instances `1475:5099` Default/Info, `1475:5101` Variant2/Warning,
 * `1475:5115` Variant3/Error), read via `get_design_context` and
 * `get_variable_defs` on 2026-07-29. `success`/`neutral` tones have no
 * instance in this Figma node — they keep their pre-existing generic
 * treatment (existing `status.success`/`border.default` colors, no default
 * icon) rather than an invented one; see docs/figma-sync.md.
 *
 * The 6-second auto-dismiss and the animated progress bar are direct user
 * instruction, not Figma-sourced: `get_motion_context` on this node returns
 * no keyframe data, confirming it's a static mockup (three snapshot
 * instances at different progress-bar widths illustrating the concept), not
 * an animated prototype.
 */
export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  tone?: "neutral" | "info" | "success" | "warning" | "error";
  /** Overrides the tone's default status icon. Pass `null` to render no icon. */
  icon?: ReactNode;
}

interface ToastContextValue {
  toasts: ToastItem[];
  push: (toast: Omit<ToastItem, "id">) => void;
  dismiss: (id: string) => void;
}
const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

type Tone = NonNullable<ToastItem["tone"]>;

/**
 * Accent color driving the icon, left border, and progress bar for each
 * tone. `info` is the exact Figma-evidenced `toast.info-accent` (sky.500,
 * #2563EB) — distinct from the generic `status.info` token, which currently
 * aliases blue.500 (#0E17FF) and does not match this Figma source; see the
 * `_toastComment` in semantic/color.json for the full drift note.
 * `warning`/`error` reuse the existing, already-exact `status.warning`/
 * `status.error`. `success`/`neutral` reuse their pre-existing generic
 * colors — not evidenced by this Figma node.
 */
const accentVar: Record<Tone, string> = {
  neutral: "var(--color-border-default)",
  info: "var(--color-toast-info-accent)",
  success: "var(--color-status-success)",
  warning: "var(--color-status-warning)",
  error: "var(--color-status-error)"
};

const defaultIcon: Partial<Record<Tone, ReactNode>> = {
  info: <InfoOutlinedIcon className="size-full" />,
  warning: <WarningAmberOutlinedIcon className="size-full" />,
  error: <WarningAmberOutlinedIcon className="size-full" />
};

const DISMISS_LABEL = "Dismiss notification";

function ToastCard({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: string) => void }) {
  const tone = toast.tone ?? "neutral";
  const durationMs: number = motion.duration.toast.value;
  const accent = accentVar[tone];
  const icon = toast.icon !== undefined ? toast.icon : defaultIcon[tone];

  const remainingRef = useRef(durationMs);
  const startedAtRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const [paused, setPaused] = useState(false);

  const clearTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const start = useCallback(
    (ms: number) => {
      startedAtRef.current = Date.now();
      remainingRef.current = ms;
      clearTimer();
      timerRef.current = setTimeout(() => onDismiss(toast.id), ms);
    },
    [clearTimer, onDismiss, toast.id]
  );

  useEffect(() => {
    start(durationMs);
    return clearTimer;
    // Runs once per mounted toast — re-running on every render would reset
    // the countdown.
  }, []);

  const pause = useCallback(() => {
    setPaused((wasPaused) => {
      if (wasPaused) return wasPaused;
      const elapsed = Date.now() - startedAtRef.current;
      remainingRef.current = Math.max(remainingRef.current - elapsed, 0);
      clearTimer();
      return true;
    });
  }, [clearTimer]);

  const resume = useCallback(() => {
    setPaused((wasPaused) => {
      if (!wasPaused) return wasPaused;
      start(remainingRef.current);
      return false;
    });
  }, [start]);

  return (
    <div
      role="status"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
      className="relative w-[var(--toast-width)] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-background-raised)]"
      style={{
        borderLeftColor: accent,
        borderLeftWidth: "var(--toast-accent-width)",
        // Tailwind's `shadow-[var(--shadow-toast-default)]` arbitrary-value
        // utility misparses a bare var() as a shadow *color* hint
        // (--tw-shadow-color) rather than the full shadow value, so
        // --tw-shadow itself never gets set and nothing renders. The same
        // broken pattern is already used elsewhere in this codebase
        // (Card, Popover, DropdownMenu, Command, etc. all reference
        // --shadow-elevation-sm/--shadow-menu-default the same way) — a
        // pre-existing, repo-wide issue out of this sync's scope. Setting
        // boxShadow directly here sidesteps it for Toast.
        boxShadow: "var(--shadow-toast-default)"
      }}
    >
      <div className="flex flex-col gap-[var(--spacing-8)] px-[var(--spacing-32)] py-[var(--spacing-24)] pr-[var(--spacing-40)]">
        <div className="flex items-center gap-[var(--spacing-16)]">
          {icon && (
            <span aria-hidden className="size-[var(--toast-icon-size)] shrink-0" style={{ color: accent }}>
              {icon}
            </span>
          )}
          <p className="min-w-0 flex-1 text-input-lg text-[var(--color-toast-title-text)]">
            {toast.title}
          </p>
        </div>
        {toast.description && (
          <p
            className="text-body-sm text-[var(--color-text-secondary)]"
            style={
              icon ? { paddingLeft: "calc(var(--toast-icon-size) + var(--spacing-16))" } : undefined
            }
          >
            {toast.description}
          </p>
        )}
      </div>

      <button
        type="button"
        aria-label={DISMISS_LABEL}
        onClick={() => onDismiss(toast.id)}
        className="absolute right-[var(--spacing-8)] top-[var(--spacing-8)] flex size-[var(--toast-close-size)] items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-toast-title-text)]"
      >
        <CloseFilledIcon className="size-full" />
      </button>

      <div
        aria-hidden
        className="lumen-toast-progress motion-reduce:animate-none absolute inset-x-0 bottom-0 h-[var(--toast-progress-height)]"
        style={{
          backgroundColor: accent,
          animationPlayState: paused ? "paused" : "running"
        }}
      />
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const dismiss = useCallback((id: string) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const push = useCallback((toast: Omit<ToastItem, "id">) => {
    const id = crypto.randomUUID();
    setToasts((t) => [...t, { ...toast, id }]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, push, dismiss }}>
      {children}
      <div className={cn("fixed bottom-4 right-4 z-50 flex flex-col gap-2")}>
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
