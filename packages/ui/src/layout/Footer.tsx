import type { HTMLAttributes } from "react";
import { cn } from "../lib/cn";

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterProps extends HTMLAttributes<HTMLElement> {
  /** e.g. "Lumen Platform v4.0" — free text, not a semantic-versioned prop. */
  version?: string;
  statusLabel?: string;
  statusTone?: "success" | "warning" | "error";
  links?: FooterLink[];
}

const statusToneMap = {
  success: "bg-[var(--color-app-shell-status-success)]",
  warning: "bg-[var(--color-app-shell-status-warning)]",
  error: "bg-[var(--color-app-shell-status-danger)]"
};

/**
 * Footer
 * Sourced from the Figma "appshell-desktop-closed-light" reference screen
 * (Lumen-AI-Design-System, node 1197:1652, `Footer` instance `1102:6529`):
 * the app-shell bottom bar — platform version, a live-status indicator, and
 * a trailing link row (Privacy/Terms/Security in the source instance,
 * generalized here as a `links` prop since those are page-specific, not a
 * fixed Lumen contract). Renders links as real `<a>` elements per
 * `docs/accessibility.md` ("navigation uses a link, not a button"). Link
 * Re-verified 2026-07-20 against all canonical AppShell breakpoint/theme
 * variants (node 1007:3700); links, muted copy, borders, and surfaces now use
 * the exact light/dark AppShell semantic roles.
 */
export function Footer({
  className,
  version,
  statusLabel,
  statusTone = "success",
  links,
  children,
  ...props
}: FooterProps) {
  return (
    <footer
      className={cn(
        "flex w-full shrink-0 items-center gap-[var(--spacing-16)] border-t border-[var(--color-app-shell-border-default)] bg-[var(--color-app-shell-surface)] px-[var(--spacing-24)] py-[var(--spacing-10)] font-interface",
        className
      )}
      {...props}
    >
      {version && (
        <p className="text-app-caption text-[var(--color-app-shell-text-muted)]">{version}</p>
      )}
      {statusLabel && (
        <div className="flex items-center gap-[var(--spacing-6)]">
          <span
            aria-hidden
            className={cn(
              "size-[var(--spacing-6)] shrink-0 rounded-full",
              statusToneMap[statusTone]
            )}
          />
          <p className="text-app-caption text-[var(--color-app-shell-text-muted)]">{statusLabel}</p>
        </div>
      )}
      <div className="min-w-px flex-1" />
      {children}
      {links?.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="text-app-caption text-[var(--color-app-shell-text-link)] hover:underline"
        >
          {link.label}
        </a>
      ))}
    </footer>
  );
}
