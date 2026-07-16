import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
  icon?: ReactNode;
}

export interface AppShellProps {
  nav: NavItem[];
  children: ReactNode;
  header?: ReactNode;
  logo?: ReactNode;
}

/** The standard product shell: fixed sidebar + main content area. Matches the
 * navigation pattern used in the Lumen AI Design System showcase site. Every
 * enterprise screen should be built inside this shell rather than a bespoke
 * layout. */
export function AppShell({ nav, children, header, logo }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-[var(--color-background-subtle)]">
      <aside className="flex w-[214px] shrink-0 flex-col gap-6 border-r border-[var(--color-border-default)] bg-[var(--color-background-default)] p-5">
        {logo}
        <nav className="flex flex-col gap-1">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-label-lg font-medium transition-colors",
                item.active
                  ? "bg-[var(--color-brand-subtle)] text-[var(--color-brand-default)]"
                  : "text-[var(--color-text-body)] hover:bg-neutral-50"
              )}
            >
              {item.icon}
              {item.label}
            </a>
          ))}
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        {header && (
          <header className="border-b border-[var(--color-border-default)] bg-[var(--color-background-default)] px-8 py-4">
            {header}
          </header>
        )}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
