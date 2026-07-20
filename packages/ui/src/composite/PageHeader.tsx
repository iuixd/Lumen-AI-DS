import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export interface Breadcrumb {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  breadcrumbs?: Breadcrumb[];
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

/**
 * PageHeader
 * Sourced from the canonical AppShell desktop/tablet variants (node
 * 1007:3700): breadcrumbs, an H1 + trailing action row, and description.
 * The 24/32 title matches the shared headline tier; exact AppShell tokens
 * cover the 12/16 regular breadcrumb and 13/20 description styles. Semantic
 * AppShell roles provide the theme-aware link, primary, body, and secondary
 * colors without component-local values.
 */
export function PageHeader({
  breadcrumbs,
  title,
  description,
  actions,
  className
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-[var(--spacing-10)] px-[var(--spacing-32)] pb-[var(--spacing-20)] pt-[var(--spacing-24)]",
        className
      )}
    >
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-[var(--spacing-6)] font-interface text-app-breadcrumb"
        >
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.label} className="flex items-center gap-[var(--spacing-6)]">
              {i > 0 && (
                <span aria-hidden className="text-[var(--color-app-shell-text-placeholder)]">
                  ›
                </span>
              )}
              {crumb.href && i < breadcrumbs.length - 1 ? (
                <a
                  href={crumb.href}
                  className="text-[var(--color-app-shell-text-link)] hover:underline"
                >
                  {crumb.label}
                </a>
              ) : (
                <span
                  aria-current={i === breadcrumbs.length - 1 ? "page" : undefined}
                  className={
                    i === breadcrumbs.length - 1
                      ? "text-[var(--color-app-shell-text-body)]"
                      : "text-[var(--color-app-shell-text-secondary)]"
                  }
                >
                  {crumb.label}
                </span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex items-center gap-[var(--spacing-16)]">
        <h1 className="font-interface text-headline-md text-[var(--color-app-shell-text-primary)]">
          {title}
        </h1>
        <div className="min-w-px flex-1" />
        {actions && <div className="flex items-center gap-[var(--spacing-8)]">{actions}</div>}
      </div>
      {description && (
        <p className="font-interface text-app-body text-[var(--color-app-shell-text-secondary)]">
          {description}
        </p>
      )}
    </div>
  );
}
