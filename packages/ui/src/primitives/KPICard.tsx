import type { HTMLAttributes } from "react";
import { cn } from "../lib/cn";

export interface KPICardProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  label: string;
  value: string;
  /** e.g. "▲ 12% this quarter" — free text so callers can compose their own delta glyph/copy. */
  delta?: string;
  deltaTone?: "success" | "warning" | "error";
}

const deltaToneMap = {
  success: "text-[var(--color-app-shell-status-success)]",
  warning: "text-[var(--color-app-shell-status-warning)]",
  error: "text-[var(--color-app-shell-status-danger)]"
};

/**
 * KPICard
 * Sourced from the canonical AppShell desktop/tablet light and dark variants
 * (Lumen-AI-Design-System node 1007:3700): a metric tile distinct from the
 * generic `Card` primitive —
 * its own radius (`--radius-xl`, 12px, vs. Card's 8px), padding
 * (20px/16px vs. Card's flat 24px), and elevation (`--shadow-elevation-sm`)
 * don't reduce to a `Card` composition without new props on `Card` itself,
 * so this ships as its own primitive per the "extend before duplicate" rule
 * — `Card` was reviewed first and doesn't cover this shape. AppShell-specific
 * typography tokens preserve the exact 12/16 medium label and 32/40 semibold
 * value styles rather than rounding to the general-purpose type scale.
 */
export function KPICard({
  className,
  label,
  value,
  delta,
  deltaTone = "success",
  ...props
}: KPICardProps) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col gap-[var(--spacing-4)] rounded-xl border border-[var(--color-app-shell-border-subtle)] bg-[var(--color-app-shell-surface)] px-[var(--spacing-20)] py-[var(--spacing-16)] font-interface [box-shadow:var(--shadow-elevation-sm)]",
        className
      )}
      {...props}
    >
      <p className="text-app-label text-[var(--color-app-shell-text-secondary)]">{label}</p>
      <p className="text-app-kpi-value text-[var(--color-app-shell-text-body)]">{value}</p>
      {delta && <p className={cn("text-app-caption", deltaToneMap[deltaTone])}>{delta}</p>}
    </div>
  );
}
