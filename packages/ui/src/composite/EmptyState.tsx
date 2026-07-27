import type { ReactNode } from "react";

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  /**
   * `"default"` (unchanged) is the generic dashed-border pattern used for
   * empty tables/lists. `"ai"` is the branded card treatment from the
   * "AI Empty Communication States" Figma frame (node 1416:3638) — a solid
   * border, a circular icon badge, a serif heading, and up to two centered
   * actions. Added 2026-07-27 at direct user request ("Please add this AI
   * Empty Communication States"); reuses this same component (icon/title/
   * description/action already matched its shape 1:1) rather than a new
   * one, per the no-duplicate-component rule — see the component's own
   * Storybook docs for the full sourcing/token notes.
   */
  variant?: "default" | "ai";
}

export function EmptyState({ icon, title, description, action, variant = "default" }: EmptyStateProps) {
  if (variant === "ai") {
    return (
      <div className="flex flex-col items-center gap-[var(--spacing-40)] rounded-[var(--radius-2xl)] border border-[var(--color-border-table)] bg-[var(--color-background-raised)] p-[var(--spacing-40)] text-center">
        {icon && (
          <div className="flex size-[var(--spacing-60)] shrink-0 items-center justify-center rounded-[var(--radius-2xl)] bg-[var(--color-icon-primary-bg)] text-[var(--color-icon-primary)]">
            {icon}
          </div>
        )}
        <div className="flex flex-col items-center gap-[var(--spacing-8)]">
          <p className="font-editorial text-ai-empty-state-title text-[var(--color-text-title)] [letter-spacing:var(--text-ai-empty-state-title-letter-spacing)]">
            {title}
          </p>
          {description && (
            <p className="max-w-sm text-ai-empty-state-body text-[var(--color-text-body)]">{description}</p>
          )}
        </div>
        {action && (
          <div className="flex flex-wrap items-center justify-center gap-[var(--spacing-16)]">{action}</div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[var(--color-border-default)] p-12 text-center">
      {icon}
      <p className="text-title-sm text-[var(--color-text-title)]">{title}</p>
      {description && <p className="max-w-sm text-body-md text-[var(--color-text-muted)]">{description}</p>}
      {action}
    </div>
  );
}
