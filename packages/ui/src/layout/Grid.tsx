import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export function Grid({
  children,
  columns = 12,
  gap = 4,
  className
}: {
  children: ReactNode;
  columns?: number;
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20;
  className?: string;
}) {
  return (
    <div
      className={cn("grid", className)}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap: `var(--spacing-${gap})` }}
    >
      {children}
    </div>
  );
}
