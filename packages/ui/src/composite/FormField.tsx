import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export function FormField({
  label,
  htmlFor,
  hint,
  error,
  required,
  children
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-label-lg font-medium text-[var(--color-text-title)]">
        {label}
        {required && <span className="text-[var(--color-status-error)]"> *</span>}
      </label>
      {children}
      {hint && !error && <p className="text-label-md text-[var(--color-text-muted)]">{hint}</p>}
      {error && (
        <p role="alert" className={cn("text-label-md text-[var(--color-status-error)]")}>
          {error}
        </p>
      )}
    </div>
  );
}
