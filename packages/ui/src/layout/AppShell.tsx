import type { ReactNode } from "react";
import { cn } from "../lib/cn";
import { CircleArrowLeftIcon } from "../icons/generated";

export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
  icon?: ReactNode;
  /** Sourced from `SideNav/Expanded`'s Inbox item — an unread-count pill. `sidebar` variant only; ignored by `rail`. */
  badge?: string | number;
}

/**
 * A group of nav items, optionally under a header label (Figma's "ADMIN"
 * grouping). Use one section with no `label` for a flat, ungrouped list.
 */
export interface NavSection {
  label?: string;
  items: NavItem[];
}

export interface WorkspaceInfo {
  name: string;
  plan?: string;
  /** Defaults to a brand-colored square with `name`'s first letter, matching Figma's default treatment — the same initials-fallback idiom `Avatar` already uses. */
  logo?: ReactNode;
}

export interface AppShellProps {
  /**
   * Breaking as of 2026-07-20: was `NavItem[]`, now `NavSection[]` — the
   * canonical Figma `SideNav/Expanded` groups items under an "ADMIN"
   * header, which a flat array can't express. Migrate `nav={items}` to
   * `nav={[{ items }]}` to keep prior ungrouped behavior unchanged.
   */
  nav: NavSection[];
  children: ReactNode;
  header?: ReactNode;
  /** `rail` variant only — the top icon-only WorkspaceLogo square. For `sidebar`, use `workspace` instead. */
  logo?: ReactNode;
  /**
   * "sidebar" (default) is sourced from the canonical Figma "AppShell" page
   * (Lumen-AI-Design-System, node 1007:3700, `SideNav/Expanded` component
   * `1079:2427`, re-verified against the Breakpoint=Desktop/Theme=Light
   * composition `1127:4196`) — a 224px expanded sidebar: WorkspaceSwitcher,
   * grouped nav items with unread-count badges and a neutral (not brand)
   * active fill, and a "Collapse" control at the bottom. Rebuilt 2026-07-20
   * from a prior generic flat-list implementation that didn't match any
   * sourced Figma evidence.
   * "rail" is sourced from the same page's `NavigationRail` component
   * (`1079:2686`, re-verified against the "appshell-desktop-closed-light"
   * example instance, node 1197:1652) — a 64px icon-only collapsed rail,
   * with `header` rendered full-width above the rail+content row instead
   * of scoped beside the sidebar. Only the closed/collapsed rail was
   * sourced — no open/close transition instance was available. `item.label`
   * becomes the rail item's accessible name (`aria-label`) and tooltip
   * (`title`) instead of visible text; `item.badge` and section `label`s
   * are not shown in this variant (`NavigationRail` has neither).
   */
  variant?: "sidebar" | "rail";
  /** Rendered full-width below the main content row. Additive and optional
   * in both variants — omitting it changes nothing for existing consumers.
   * Sourced from the same reference screen's `Footer` instance (`1102:6529`);
   * pair with the new `Footer` component. */
  footer?: ReactNode;
  /** `sidebar` variant only — renders the `WorkspaceSwitcher` header above nav. */
  workspace?: WorkspaceInfo;
  /**
   * `sidebar` variant only. When provided, renders Figma's "Collapse"
   * control at the bottom of the nav. `AppShell` doesn't manage
   * collapsed/expanded state itself (no open/close transition was sourced
   * — see `variant` above) — call this to drive your own state, e.g.
   * switching to `variant="rail"`.
   */
  onCollapse?: () => void;
}

const navItemBase =
  "flex items-center gap-[var(--spacing-10)] rounded-lg px-[var(--spacing-12)] py-[var(--spacing-8)] text-label-lg font-medium transition-colors";

function WorkspaceLogo({ name, logo }: WorkspaceInfo) {
  if (logo) return logo;
  return (
    <div className="flex size-[var(--spacing-28)] shrink-0 items-center justify-center rounded-md bg-[var(--color-brand-default)] text-body-sm font-bold text-neutral-white">
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

/** The standard product shell: fixed sidebar + main content area. Matches the
 * navigation pattern used in the Lumen AI Design System showcase site. Every
 * enterprise screen should be built inside this shell rather than a bespoke
 * layout. */
export function AppShell({
  nav,
  children,
  header,
  logo,
  footer,
  variant = "sidebar",
  workspace,
  onCollapse
}: AppShellProps) {
  if (variant === "rail") {
    const flatItems = nav.flatMap((section) => section.items);
    return (
      <div className="flex min-h-screen flex-col bg-[var(--color-background-subtle)]">
        {header && (
          <header className="flex h-[var(--spacing-56)] shrink-0 items-center gap-[var(--spacing-16)] border-b border-[var(--color-border-default)] bg-[var(--color-background-default)] px-[var(--spacing-16)]">
            {header}
          </header>
        )}
        <div className="flex flex-1 items-stretch">
          <aside className="flex w-[var(--spacing-64)] shrink-0 flex-col items-center gap-[var(--spacing-4)] border-r border-[var(--color-border-default)] bg-[var(--color-background-default)] py-[var(--spacing-12)]">
            {logo}
            <nav className="flex flex-col items-center gap-[var(--spacing-4)]">
              {flatItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={item.active ? "page" : undefined}
                  aria-label={item.label}
                  title={item.label}
                  className={cn(
                    "flex size-[var(--spacing-40)] items-center justify-center rounded-lg transition-colors",
                    item.active
                      ? "bg-[var(--color-background-nav-active)] text-[var(--color-brand-default)]"
                      : "text-[var(--color-text-body)] hover:bg-[var(--color-background-nav-active)]"
                  )}
                >
                  {item.icon}
                </a>
              ))}
            </nav>
          </aside>
          <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
        </div>
        {footer}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-background-subtle)]">
      <aside className="flex w-[224px] shrink-0 flex-col gap-[var(--spacing-2)] border-r border-[var(--color-border-default)] bg-[var(--color-background-default)] p-[var(--spacing-12)]">
        {workspace && (
          <>
            <div className="flex items-center gap-[var(--spacing-10)] py-[var(--spacing-12)]">
              <WorkspaceLogo {...workspace} />
              <div className="flex min-w-0 flex-col">
                <p className="truncate text-label-lg text-[var(--color-text-title)]">{workspace.name}</p>
                {workspace.plan && (
                  <p className="truncate text-label-sm text-[var(--color-text-muted)]">{workspace.plan}</p>
                )}
              </div>
            </div>
            <div className="h-px w-full bg-[var(--color-border-default)]" />
          </>
        )}
        {logo}
        {nav.map((section, i) => (
          <nav key={section.label ?? i} className="flex flex-col gap-[var(--spacing-2)]">
            {section.label && (
              <p className="px-[var(--spacing-12)] pb-[var(--spacing-4)] pt-[var(--spacing-16)] text-label-sm uppercase tracking-wide text-[var(--color-text-muted)]">
                {section.label}
              </p>
            )}
            {section.items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={item.active ? "page" : undefined}
                className={cn(
                  navItemBase,
                  item.active
                    ? "bg-[var(--color-border-subtle)] text-[var(--color-text-title)]"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-border-subtle)]"
                )}
              >
                {item.icon}
                <span className="flex-1 truncate text-left">{item.label}</span>
                {item.badge !== undefined && (
                  <span className="rounded-full bg-[var(--color-text-secondary)] px-[var(--spacing-6)] py-px text-label-sm text-neutral-white">
                    {item.badge}
                  </span>
                )}
              </a>
            ))}
          </nav>
        ))}
        <div className="flex-1" />
        {onCollapse && (
          <>
            <div className="h-px w-full bg-[var(--color-border-default)]" />
            <button
              type="button"
              onClick={onCollapse}
              className={cn(navItemBase, "text-[var(--color-text-secondary)] hover:bg-[var(--color-border-subtle)]")}
            >
              <CircleArrowLeftIcon className="size-5 shrink-0" aria-hidden />
              Collapse
            </button>
          </>
        )}
      </aside>
      <div className="flex flex-1 flex-col">
        {header && (
          <header className="border-b border-[var(--color-border-default)] bg-[var(--color-background-default)] px-8 py-4">
            {header}
          </header>
        )}
        <main className="flex-1 p-8">{children}</main>
        {footer}
      </div>
    </div>
  );
}
