import type { CSSProperties, ReactNode } from "react";

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
        "lumen-skeleton-pulse shrink-0 animate-none bg-[var(--color-border-table)]",
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
    <div className="flex min-w-px flex-[1_0_0] flex-col items-start gap-[var(--spacing-8)] overflow-clip rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-[var(--color-background-raised)] px-[var(--spacing-20)] py-[var(--spacing-16)]">
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
    <div className="flex w-full items-center gap-[var(--spacing-16)] overflow-clip border border-[var(--color-border-subtle)] bg-[var(--color-background-raised)] px-[var(--spacing-16)] py-[var(--spacing-12)]">
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
  "flex w-full min-h-[var(--content-state-container-min-height)] flex-col bg-[var(--color-background-app)]";

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
  if (state === "loading") {
    return (
      // role="status" + aria-live="polite" so the wait is announced rather
      // than being a purely visual event; aria-busy marks the region itself
      // as not-yet-settled. The bars are all aria-hidden, so the visually
      // hidden label is the only thing read out — a screen-reader user gets
      // "Loading projects", not twenty anonymous placeholders.
      <div
        role="status"
        aria-live="polite"
        aria-busy="true"
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
    // role="alert" on the error state only: a load failure is an unrequested,
    // interruptive change the user needs to hear about. The empty state is a
    // normal, expected result and gets no live semantics.
    <div
      {...(isError ? { role: "alert" as const } : {})}
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
            ? "bg-[var(--color-status-error-subtle)] text-[var(--color-status-error)]"
            : "bg-[var(--color-background-nav-active)] text-[var(--color-text-secondary)]"
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
        <p className="font-editorial text-content-state-title text-[var(--color-text-body)] [letter-spacing:var(--text-content-state-title-letter-spacing)]">
          {title}
        </p>
      )}
      {description && (
        <div
          className={cn(
            "text-ai-library-body",
            isError ? "text-[var(--color-text-secondary)]" : "text-[var(--color-text-tertiary)]"
          )}
        >
          {description}
        </div>
      )}
      {action}
    </div>
  );
}
