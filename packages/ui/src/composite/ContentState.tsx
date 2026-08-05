import { useEffect, useId, useRef, type CSSProperties, type ReactNode } from "react";

import { Skeleton } from "../components/skeleton/Skeleton";
import { cn } from "../lib/cn";

/**
 * ContentState — the full-region state a content area shows *instead of* its
 * content: nothing to show yet, still loading, or failed to load.
 *
 * Sourced from Lumen-AI-Design-System node `1174:1355` (component set
 * "ContentState"; variants `1073:4486` Empty, `1073:4484` Loading,
 * `1073:4483` Error), read via `get_design_context`, `get_variable_defs`, and
 * `get_motion_context` on 2026-07-28.
 *
 * Why this is its own composite rather than a third `EmptyState` variant:
 * `EmptyState`'s two existing looks — a dashed-border box (`default`) and a
 * bordered card (`ai`) — are both *inline* treatments that sit inside a
 * surface. Figma's ContentState is a different thing: a full content region
 * on the app canvas (`bg/app`), with its own centered layout, and a Loading
 * variant whose skeleton has no counterpart in `EmptyState` at all. Sharing
 * one component would have meant a `variant` prop where two of three values
 * ignore `icon`/`title`/`description` entirely. `EmptyState` is unchanged and
 * remains correct for the inline case.
 *
 * What it does reuse: `Skeleton` for every loading placeholder bar, and the
 * standard `Button` through the `action` slot — this component never renders
 * a button itself.
 *
 * Accessibility annotations added 2026-08-04, direct user report of new
 * Figma annotations on all 3 variants (none existed before this — a11y
 * behavior had been a code-side decision with no annotation to check
 * against; see `docs/figma-sync.md`'s ContentState row). `loading`'s
 * `role="status"`/`aria-live="polite"`/`aria-busy` were already exact;
 * added `aria-label={loadingLabel}` alongside the existing sr-only span
 * (belt-and-suspenders — the span is still what the live region actually
 * announces on update, since aria-label alone wouldn't be re-announced by
 * every screen reader on a content change). `empty` gained `role="region"`
 * + `aria-labelledby` — labelled by the visible title's own element rather
 * than a hardcoded generic string like Figma's literal `aria-label="[context]
 * empty state"`, so it stays accurate for whatever title a caller actually
 * passes. `error`'s `role="alert"` was already exact (which already implies
 * `aria-live="assertive"` per the ARIA spec). New: auto-focus on the
 * `action` slot's first focusable element when `state="error"` mounts,
 * matching Figma's explicit "receives focus automatically on error
 * appearance" — previously no focus management happened at all. `action` is
 * an opaque, caller-supplied `ReactNode` (typically a `<Button>`), so a
 * `display:contents` ref wrapper (zero layout effect) finds the focusable
 * element by querySelector rather than requiring a ref prop the slot's API
 * doesn't have.
 *
 * Dark mode implemented 2026-08-05, direct user report — Figma published
 * real `Theme=Dark` sibling instances for all 3 variants for the first time.
 * Every color role this component used previously borrowed a shared,
 * multi-consumer generic token (`background.app`, `text.body`, `text.
 * secondary`/`.tertiary`, `border.table`/`.subtle`, `background.raised`/
 * `.nav-active`, `status.error`/`.-subtle`) whose dark value turned out not
 * to match this component's real Figma dark data — sometimes an entirely
 * different color family, not a nearby shade. Repointing those tokens was
 * out of scope (each has other real consumers elsewhere). Replaced with a
 * new, fully self-contained `content-state.*` token group (11 fields,
 * light+dark) covering every role, the same pattern already used for
 * `Toast`. Two bugs independent of dark mode were also found and fixed in
 * the process: the skeleton bars' border color (`border.table` light) never
 * actually matched this node's real value (`lumen-gray.300`, not `.200`) —
 * missed in the original sync; and the Empty-state icon glyph's color was
 * wrong in both themes (it's bound to a distinct Figma variable on the
 * icon's own sub-node, not the `text.secondary` role this component had
 * assumed). Flagged, not silently implemented: the corrected dark icon-glyph
 * color against its own badge background computes to ~1.3:1 contrast — the
 * glyph reads as nearly invisible in dark mode. This is implemented exactly
 * as Figma specifies, per the standing "Figma is source of truth"
 * instruction, but looks like a genuine Figma authoring inconsistency worth
 * flagging back to design rather than a value to trust blindly.
 */
export type ContentStateStatus = "empty" | "loading" | "error";

export interface ContentStateProps {
  /** Which state to render. Defaults to `"empty"`. */
  state?: ContentStateStatus;
  /**
   * Heading. Required for `empty` and `error`; ignored by `loading`, whose
   * accessible name comes from `loadingLabel` instead.
   */
  title?: string;
  /** Supporting copy below the heading. Ignored by `loading`. */
  description?: ReactNode;
  /**
   * Glyph inside the circular badge. Ignored by `loading`. When omitted,
   * `empty` renders Figma's outlined square placeholder and `error` renders
   * its "!" glyph, so the badge is never empty.
   */
  icon?: ReactNode;
  /**
   * Call to action, e.g. `<Button>New project</Button>` for `empty` or
   * `<Button variant="destructive">Try again</Button>` for `error`. Ignored
   * by `loading`. Note Figma binds the Empty variant's CTA fill to a raw
   * `--lumen-dark/default` rather than to any `btn/*` variable — treated as a
   * Figma authoring gap, so use the standard Button here. See
   * `docs/figma-sync.md`.
   */
  action?: ReactNode;
  /**
   * What a screen reader announces while `state="loading"`. Announced through
   * a polite live region, so keep it short and human ("Loading projects").
   * Defaults to `"Loading content"`.
   */
  loadingLabel?: string;
  /**
   * Replaces the default skeleton layout (title, subtitle, three cards, three
   * table rows) when the real content's shape differs. Compose it from
   * `Skeleton` so the pulse stays consistent.
   */
  skeleton?: ReactNode;
  className?: string;
}

/**
 * One placeholder bar. `animate-none` cancels `Skeleton`'s own Tailwind
 * `animate-pulse` (opacity 1 -> 0.5) in favor of `lumen-skeleton-pulse`, whose
 * waveform, 2s loop, and 0.4 dim stop are Figma-exact and whose
 * reduced-motion fallback is defined alongside it — see motion.json.
 * `step` selects this bar's place in the staggered wave.
 */
function SkeletonBar({
  step,
  className,
  style
}: {
  step: 0 | 1 | 2 | 3 | 4;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <Skeleton
      aria-hidden
      className={cn(
        "lumen-skeleton-pulse shrink-0 animate-none bg-[var(--color-content-state-skeleton-bar-bg)]",
        className
      )}
      style={
        {
          "--lumen-skeleton-delay": `var(--duration-stagger-skeleton-step-${step})`,
          ...style
        } as CSSProperties
      }
    />
  );
}

/** Figma's skeleton card, node 1073:4363 (repeated at 4367 and 4371). */
function SkeletonCard() {
  return (
    <div className="flex min-w-px flex-[1_0_0] flex-col items-start gap-[var(--spacing-8)] overflow-clip rounded-[var(--radius-xl)] border border-[var(--color-content-state-skeleton-card-border)] bg-[var(--color-content-state-skeleton-card-bg)] px-[var(--spacing-20)] py-[var(--spacing-16)]">
      <SkeletonBar
        step={2}
        className="h-[var(--content-state-skeleton-card-label-height)] w-[var(--content-state-skeleton-card-label-width)] rounded-[var(--radius-sm)]"
      />
      <SkeletonBar
        step={3}
        className="h-[var(--content-state-skeleton-card-value-height)] w-[var(--content-state-skeleton-card-value-width)] rounded-[var(--radius-md)]"
      />
      <SkeletonBar
        step={4}
        className="h-[var(--content-state-skeleton-card-meta-height)] w-[var(--content-state-skeleton-card-meta-width)] rounded-[var(--radius-sm)]"
      />
    </div>
  );
}

/** Figma's skeleton table row, node 1073:4375 (repeated at 4380 and 4385). */
function SkeletonRow() {
  return (
    <div className="flex w-full items-center gap-[var(--spacing-16)] overflow-clip border border-[var(--color-content-state-skeleton-card-border)] bg-[var(--color-content-state-skeleton-card-bg)] px-[var(--spacing-16)] py-[var(--spacing-12)]">
      <SkeletonBar
        step={1}
        className="h-[var(--content-state-skeleton-row-height)] min-w-px flex-[1_0_0] rounded-[var(--radius-sm)]"
      />
      <SkeletonBar
        step={2}
        className="h-[var(--content-state-skeleton-row-height)] w-[var(--content-state-skeleton-row-cell-1-width)] rounded-[var(--radius-sm)]"
      />
      <SkeletonBar
        step={3}
        className="h-[var(--content-state-skeleton-row-height)] w-[var(--content-state-skeleton-row-cell-2-width)] rounded-[var(--radius-sm)]"
      />
      <SkeletonBar
        step={4}
        className="h-[var(--content-state-skeleton-row-height)] w-[var(--content-state-skeleton-row-cell-3-width)] rounded-[var(--radius-sm)]"
      />
    </div>
  );
}

/**
 * Figma frames this at a fixed 600x400. The width is deliberately fluid in
 * code — this component fills whatever region it replaces, and the set
 * publishes a single frame with no breakpoint evidence to derive a fixed
 * width from. The height is applied as a min-height so content can grow.
 * Recorded as an intentional Figma-to-code difference in docs/figma-sync.md.
 */
const containerBase =
  "flex w-full min-h-[var(--content-state-container-min-height)] flex-col bg-[var(--color-content-state-bg)]";

export function ContentState({
  state = "empty",
  title,
  description,
  icon,
  action,
  loadingLabel = "Loading content",
  skeleton,
  className
}: ContentStateProps) {
  const titleId = useId();
  const actionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state !== "error") return;
    // Figma's Error annotation: "receives focus automatically on error
    // appearance." `action` is an opaque, caller-supplied ReactNode (usually
    // a `<Button>`), so there's no prop to attach a ref to directly — find
    // the first focusable element inside the slot instead.
    const focusable = actionRef.current?.querySelector<HTMLElement>(
      'button, a[href], input, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.focus();
  }, [state]);

  if (state === "loading") {
    return (
      // role="status" + aria-live="polite" so the wait is announced rather
      // than being a purely visual event; aria-busy marks the region itself
      // as not-yet-settled. The bars are all aria-hidden, so the visually
      // hidden label is the only thing read out — a screen-reader user gets
      // "Loading projects", not twenty anonymous placeholders. `aria-label`
      // added 2026-08-04 per Figma's explicit accessibility annotation,
      // alongside (not instead of) the sr-only span, which is still what the
      // live region actually announces on update.
      <div
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-label={loadingLabel}
        className={cn(
          containerBase,
          "items-start gap-[var(--spacing-20)] px-[var(--spacing-32)] py-[var(--spacing-24)]",
          className
        )}
      >
        <span className="sr-only">{loadingLabel}</span>
        {skeleton ?? (
          <>
            <SkeletonBar
              step={0}
              className="h-[var(--content-state-skeleton-title-height)] w-[var(--content-state-skeleton-title-width)] rounded-[var(--radius-md)]"
            />
            <SkeletonBar
              step={1}
              className="h-[var(--content-state-skeleton-subtitle-height)] w-[var(--content-state-skeleton-subtitle-width)] rounded-[var(--radius-sm)]"
            />
            <div className="flex w-full items-start gap-[var(--spacing-16)] overflow-clip">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        )}
      </div>
    );
  }

  const isError = state === "error";

  return (
    // role="alert" on error: a load failure is an unrequested, interruptive
    // change the user needs to hear about. role="region" + aria-labelledby
    // on empty (added 2026-08-04 per Figma's explicit annotation): a normal,
    // expected result, no live semantics, but still a named landmark region
    // — labelled by the visible title itself rather than a generic static
    // string, so it stays accurate whatever title a caller passes.
    <div
      {...(isError
        ? { role: "alert" as const }
        : { role: "region" as const, "aria-labelledby": title ? titleId : undefined })}
      className={cn(
        containerBase,
        "items-center justify-center gap-[var(--spacing-24)] text-center",
        className
      )}
    >
      <div
        aria-hidden
        className={cn(
          "flex size-[var(--content-state-icon-badge-size)] shrink-0 items-center justify-center overflow-clip rounded-[var(--radius-full)]",
          isError
            ? "bg-[var(--color-content-state-error-icon-bg)] text-[var(--color-content-state-error-icon-fg)]"
            : "bg-[var(--color-content-state-icon-badge-bg)] text-[var(--color-content-state-icon-fg)]"
        )}
      >
        {icon ??
          (isError ? (
            <span
              className="font-interface font-semibold leading-none"
              style={{ fontSize: "var(--content-state-error-glyph-size)" }}
            >
              !
            </span>
          ) : (
            <span
              className="size-[var(--content-state-empty-glyph-size)] rounded-[var(--radius-md)] border-solid border-current"
              style={{ borderWidth: "var(--content-state-empty-glyph-border-width)" }}
            />
          ))}
      </div>
      {title && (
        <p
          id={titleId}
          className="font-editorial text-content-state-title text-[var(--color-content-state-title-text)] [letter-spacing:var(--text-content-state-title-letter-spacing)]"
        >
          {title}
        </p>
      )}
      {description && (
        <div
          className={cn(
            "text-ai-library-body",
            isError
              ? "text-[var(--color-content-state-error-description-text)]"
              : "text-[var(--color-content-state-description-text)]"
          )}
        >
          {description}
        </div>
      )}
      {/* display:contents so this wrapper never affects layout (the flex
          gap above applies the same as if `action` were a direct child) —
          it exists only as a ref target for the auto-focus effect above,
          since `action` is an opaque ReactNode with no prop to attach a
          ref to directly. */}
      <div className="contents" ref={actionRef}>
        {action}
      </div>
    </div>
  );
}
