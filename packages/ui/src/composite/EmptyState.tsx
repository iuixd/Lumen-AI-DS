import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[var(--color-border-default)] p-12 text-center">
      {icon}
      <p className="text-title-sm text-[var(--color-text-title)]">{title}</p>
      {description && <p className="max-w-sm text-body-md text-[var(--color-text-muted)]">{description}</p>}
      {action}
    </div>
  );
}
