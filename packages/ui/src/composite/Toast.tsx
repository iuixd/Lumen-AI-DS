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
import { CircleCheckIcon } from "../icons/generated/CircleCheckIcon";

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
 *
 * Mount/unmount animation added 2026-08-03 for `DataExtractionOnboardingPage`'s
 * interaction redesign — previously an instant array push/filter, no
 * transition either way. Entrance slides up 16px + fades in
 * (`--duration-moderate`/`--easing-enter`, close to the spec's 220ms ask —
 * no exact 220ms token exists). Exit only fades (no slide direction was
 * specified for dismissal, so none was invented) and defers the actual
 * `toasts` array removal by `--duration-moderate` via a `removingIds` set,
 * since React can't animate an unmount otherwise. Auto-dismiss stays at the
 * existing system-wide 6s (`motion.duration.toast`) rather than forking a
 * per-flow 4s override — flagged, not silently decided, during planning.
 *
 * Corrected 2026-08-03 for pixel-perfect fidelity against a direct re-pull
 * of node `1519:6185` (`get_design_context` + `get_variable_defs`, per
 * direct user request: "match the uploaded confirmation toast notification
 * to the Figma design with 100% pixel-perfect accuracy"). The `solid`
 * variant had been built as a re-colored copy of the `card` variant's box
 * model (32px/24px padding, absolutely-positioned close button, 16px
 * icon-title gap, the shared 28px `--toast-icon-size`, `text-input-lg`
 * `font-bold` = 16/26/700) — none of that matches this node, which is
 * structurally simpler: one flex row (`px-24 py-12`, `gap-32` between the
 * icon+title group and the close button, `gap-8` between icon and title),
 * a 24px icon (not the shared 28px token — scoped locally rather than
 * changing `--toast-icon-size`, which the `card` variant still correctly
 * uses), and 14px/26px/weight-600 title text (no existing typography tier
 * matches that exact combination, so it's a scoped literal rather than a
 * new one-off token for a single consumer). `celebration`'s accent color
 * now resolves through the real semantic token Figma names
 * (`--color-background-toaster-systeminfo-bg`) instead of the primitive
 * it happened to alias (`--color-deep-purple-700`) — same value in light
 * mode, but now theme-reactive. One literal Figma quirk deliberately not
 * reproduced: the source node's outer frame carries a stray `pl-[2px]`
 * (residue from a shared master component whose `card`-equivalent variant
 * uses that inset for a left accent stripe) with no visible effect in the
 * reference screenshot — copying it would only shift content 2px for no
 * evidenced reason. `card` variant is unchanged; it has its own,
 * previously-correct Figma source and this fidelity pass didn't touch it.
 *
 * Corrected same-day, direct user report with a screenshot ("Confirmation
 * toaster width is not matching the Figma Design"): the fixed-width fix
 * above still left `solid` on the shared `--toast-width` (450px), stretched
 * far past its actual content — missed because the earlier re-pull of
 * `1519:6185` was read for spacing/typography/color, not layout sizing.
 * Its own markup is `w-full`/`size-full` inside a "hug contents"
 * auto-layout frame in Figma, not a fixed pixel width at all — the fixed
 * 450px genuinely belongs to `card`'s own, differently-sized Figma frame
 * (`1475:5100`). `solid` now hugs its content (`w-fit`), capped at the
 * same `--toast-width` as a ceiling so a pathologically long
 * caller-supplied title still wraps/truncates instead of stretching
 * edge-to-edge, rather than reusing it as a fixed size.
 *
 * Corrected 2026-08-04, direct user dark-mode/dimension audit of node
 * `1475:5100` (its own Theme axis resolves via Figma's variable mode
 * system, not separate Dark instances). `success`/`neutral` from the
 * 2026-07-29 note above are no longer fully generic: `success` now has real
 * Figma evidence (`toast.success-accent`, distinct from the generic
 * `status.success` in dark mode) — only `neutral` remains unevidenced.
 * `warning`'s dark accent also diverged from the generic `status.warning`
 * (a distinct muted amber, `status.amber`) — both promoted to their own
 * `toast.{warning,success}-accent` tokens rather than continuing to reuse
 * the shared `status.*` roles, which no longer matched in dark mode. Three
 * more toast-scoped tokens added for the same reason (values differing
 * from their generic equivalents, mostly in dark): `container-bg` (was the
 * generic `background.raised`), `body-text` (was `text.secondary`), and
 * `icon-default` for the dismiss button (was `text.secondary`, wrong in
 * both themes for that role). `title-text`'s existing dark value was
 * corrected from `lumen-gray.50` to `nightshade.50` — a family mismatch,
 * not a shade error. `--toast-width` corrected 450px->448px (a 2px
 * transcription drift, not a Figma change). `error`'s accent color was
 * removed entirely (now matches `neutral`'s plain border color) — this
 * tone has no bound accent-bar or icon-stroke variable in Figma at all,
 * relying on the warning-triangle icon shape alone for differentiation;
 * the icon itself is unchanged, only its distinct red tint is gone. Every
 * other value (Info accent both themes, SystemInfo/`celebration` bg both
 * themes, title-text light) was re-verified byte-exact, no change. See
 * `packages/tokens/src/semantic/color.json`'s `_toastComment` for the full
 * token-level record.
 *
 * Corrected same day, direct user report: Figma added a genuine `Type=Neutral`
 * instance to this node (`1716:3818`, 448x150, Light) that didn't exist at
 * the time of the audit above. Its accent (`Neutral/300`, #9F9F9F) is a real
 * primitive already in this codebase — added as `toast.neutral-accent`,
 * replacing the placeholder `--color-border-default` `neutral` had been
 * using. Every other bound value on this instance (title/body text,
 * container bg, border) re-confirmed the same-day dark-mode audit's values
 * exactly, no further changes there. `error` was also repointed from the
 * unrelated card-border color to this same new `neutral-accent` token, to
 * actually match "look like `neutral`" as intended rather than a
 * coincidental equal value that no longer held once `neutral` got its own
 * evidence. No dark-mode instance exists for `Neutral` yet — `dark.toast.
 * neutral-accent` reuses the light value unchanged, flagged provisional,
 * same as `info-accent`'s existing precedent for a single-mode primitive.
 */
export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  tone?: "neutral" | "info" | "success" | "warning" | "error" | "celebration";
  /** Overrides the tone's default status icon. Pass `null` to render no icon. */
  icon?: ReactNode;
  /**
   * `"card"` (default) is the original light card with a tone-colored left
   * border and accent. `"solid"` fills the whole card with the tone's
   * accent color and switches to white text/icon/close/progress — sourced
   * from the "Upload Component" section's `Toast` instance (node
   * `1519:6185`, `type="SystemInfo"`, `bg/toaster-systeminfo-bg` =
   * deep-purple.700), the first real evidence for anything but the plain
   * card treatment.
   */
  variant?: "card" | "solid";
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
 * tone. `info`, `warning`, `success`, and (as of 2026-08-04) `neutral` are
 * all real, Figma-evidenced toast-scoped tokens
 * (`toast.{info,warning,success,neutral}-accent`) — `info`/`warning`/
 * `success` each diverge from their same-named generic `status.*` role in
 * dark mode, so none of them reuse the shared status tokens directly; see
 * the `_toastComment` in semantic/color.json for the full record.
 *
 * `error` has no bound accent in Figma at all (see below) — briefly matched
 * to `neutral`'s accent color same-day, then reverted same-day after direct
 * user review of the rendered result: color is the strongest available
 * signal that something failed, and a colorless error toast reads as
 * informational, not a failure, at a glance. Kept on the pre-existing
 * generic `status.error` token (unchanged from before this whole audit) —
 * a deliberate usability call overriding the literal Figma finding, not an
 * oversight.
 */
const accentVar: Record<Tone, string> = {
  neutral: "var(--color-toast-neutral-accent)",
  info: "var(--color-toast-info-accent)",
  success: "var(--color-toast-success-accent)",
  warning: "var(--color-toast-warning-accent)",
  // No accent bar or bound icon-stroke variable exists on this tone in
  // Figma at all (re-verified 2026-08-04, direct user dimension/color audit
  // of node 1475:5115, then labeled "Type=Critical" — renamed to "Type=Error"
  // by the user in Figma the same day, matching this tone's existing code
  // name) — it relies on the warning-triangle icon *shape* alone for
  // differentiation there. Kept on the pre-existing generic `status.error`
  // regardless — see the docblock above this const for the reasoning (direct
  // user call, after seeing the colorless version rendered, that failure
  // states need color as a signal even where Figma's own binding doesn't).
  error: "var(--color-status-error)",
  // The exact semantic token Figma cites (`bg/toaster-systeminfo-bg`, node
  // `1519:6185`) rather than the primitive it happened to alias
  // (`deep-purple.700`) — theme-reactive (dark theme resolves to a
  // different, lighter value), where the raw primitive wasn't.
  celebration: "var(--color-background-toaster-systeminfo-bg)"
};

const defaultIcon: Partial<Record<Tone, ReactNode>> = {
  info: <InfoOutlinedIcon className="size-full" />,
  warning: <WarningAmberOutlinedIcon className="size-full" />,
  error: <WarningAmberOutlinedIcon className="size-full" />,
  celebration: <CircleCheckIcon className="size-full" />
};

const DISMISS_LABEL = "Dismiss notification";

function ToastCard({
  toast,
  onDismiss,
  isRemoving
}: {
  toast: ToastItem;
  onDismiss: (id: string) => void;
  isRemoving?: boolean;
}) {
  const tone = toast.tone ?? "neutral";
  const variant = toast.variant ?? "card";
  const durationMs: number = motion.duration.toast.value;
  const accent = accentVar[tone];
  const icon = toast.icon !== undefined ? toast.icon : defaultIcon[tone];
  const isSolid = variant === "solid";

  const remainingRef = useRef(durationMs);
  const startedAtRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const [paused, setPaused] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []);

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
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-lg)] border transition-[opacity,transform] duration-[var(--duration-moderate)] motion-reduce:transition-none",
        // `solid` hugs its content (Figma's own node is `w-full`/`size-full`
        // inside a "hug contents" auto-layout frame, not a fixed pixel
        // width — the fixed-width `card` variant's own frame genuinely is
        // that size). Capped at the same `--toast-width` so a pathologically
        // long caller-supplied title still wraps/truncates instead of
        // stretching edge-to-edge.
        isSolid ? "w-fit max-w-[var(--toast-width)]" : "w-[var(--toast-width)]",
        isSolid
          ? "border-transparent text-[var(--color-neutral-white)]"
          : "border-[var(--color-border-default)] bg-[var(--color-toast-container-bg)]",
        isRemoving
          ? "ease-[var(--easing-exit)] opacity-0"
          : entered
            ? "ease-[var(--easing-enter)] translate-y-0 opacity-100"
            : "ease-[var(--easing-enter)] translate-y-[var(--spacing-16)] opacity-0"
      )}
      style={{
        background: isSolid ? accent : undefined,
        borderLeftColor: isSolid ? undefined : accent,
        borderLeftWidth: isSolid ? undefined : "var(--toast-accent-width)",
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
      {isSolid ? (
        // Matches Lumen-AI-Design-System node `1519:6185` ("Toast",
        // type="SystemInfo") exactly: a single flex row (icon, title,
        // close button, `gap-32`) at `px-24 py-12` — structurally
        // different from the card variant below (no absolutely-positioned
        // close button, no icon-aligned description indent), since this
        // node has no description in its Figma source. A description is
        // still rendered below the row if a caller passes one, since
        // dropping caller-supplied content silently would be worse than
        // an un-Figma-sourced fallback — flagged as exactly that.
        <div className="flex w-full flex-col gap-[var(--spacing-8)] px-[var(--spacing-24)] py-[var(--spacing-12)]">
          <div className="flex w-full items-center gap-[var(--spacing-32)]">
            <div className="flex min-w-0 flex-1 items-center gap-[var(--spacing-8)]">
              {icon && (
                <span aria-hidden className="size-6 shrink-0 text-[var(--color-neutral-white)]">
                  {icon}
                </span>
              )}
              <p className="min-w-0 flex-1 truncate text-[14px] font-semibold leading-[26px] text-[var(--color-neutral-white)]">
                {toast.title}
              </p>
            </div>
            <button
              type="button"
              aria-label={DISMISS_LABEL}
              onClick={() => onDismiss(toast.id)}
              className="flex size-[var(--toast-close-size)] shrink-0 items-center justify-center text-[var(--color-neutral-white-a72)] hover:text-[var(--color-neutral-white)]"
            >
              <CloseFilledIcon className="size-full" />
            </button>
          </div>
          {toast.description && (
            <p
              className="text-body-sm text-[var(--color-neutral-white-a72)]"
              style={icon ? { paddingLeft: "calc(24px + var(--spacing-8))" } : undefined}
            >
              {toast.description}
            </p>
          )}
        </div>
      ) : (
        <>
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
                className="text-body-sm text-[var(--color-toast-body-text)]"
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
            className="absolute right-[var(--spacing-8)] top-[var(--spacing-8)] flex size-[var(--toast-close-size)] items-center justify-center text-[var(--color-toast-icon-default)] hover:text-[var(--color-toast-title-text)]"
          >
            <CloseFilledIcon className="size-full" />
          </button>
        </>
      )}

      <div
        aria-hidden
        className="lumen-toast-progress motion-reduce:animate-none absolute inset-x-0 bottom-0 h-[var(--toast-progress-height)]"
        style={{
          backgroundColor: isSolid ? "var(--color-neutral-white-a32)" : accent,
          animationPlayState: paused ? "paused" : "running"
        }}
      />
    </div>
  );
}

export interface ToastProviderProps {
  children: ReactNode;
  /**
   * `"bottom-right"` (default) is this component's original, Figma-
   * unevidenced position. `"bottom-center"` was added 2026-08-03 for
   * `DataExtractionOnboardingPage`'s toast, which Figma (node `1565:3298`)
   * places bottom-center — scoped to a prop rather than changing the
   * shared default, since no other consumer of `ToastProvider` exists yet
   * to have an opinion either way, but changing everyone's toast position
   * as a side effect of one flow's Figma sync would be out of proportion.
   */
  position?: "bottom-right" | "bottom-center";
}

const positionClass: Record<NonNullable<ToastProviderProps["position"]>, string> = {
  "bottom-right": "bottom-4 right-4",
  "bottom-center": "bottom-[40px] left-1/2 -translate-x-1/2"
};

export function ToastProvider({ children, position = "bottom-right" }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  // Exit animation needs the card to stay mounted for one more frame cycle
  // after `dismiss` — React can't transition an unmount, so removal from
  // `toasts` (below) is deferred by `--duration-moderate` while `removingIds`
  // drives the exit classes on the still-mounted `ToastCard`.
  const [removingIds, setRemovingIds] = useState<ReadonlySet<string>>(new Set());
  const dismiss = useCallback((id: string) => {
    setRemovingIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, motion.duration.moderate.value);
  }, []);
  const push = useCallback((toast: Omit<ToastItem, "id">) => {
    const id = crypto.randomUUID();
    setToasts((t) => [...t, { ...toast, id }]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, push, dismiss }}>
      {children}
      <div className={cn("fixed z-50 flex flex-col gap-2", positionClass[position])}>
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} onDismiss={dismiss} isRemoving={removingIds.has(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
