import type { ReactNode } from "react";
import { cn } from "../lib/cn";
import { CircleArrowLeftIcon, CircleArrowRightIcon } from "../icons/generated";

export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
  icon?: ReactNode;
  badge?: string | number;
}

export interface NavSection {
  label?: string;
  items: NavItem[];
}

export interface WorkspaceInfo {
  name: string;
  plan?: string;
  logo?: ReactNode;
}

export interface AppShellProps {
  nav: NavSection[];
  children: ReactNode;
  /** Desktop header (52px in the canonical AppShell). */
  header?: ReactNode;
  /** Tablet-only header (72px in the canonical AppShell). */
  tabletHeader?: ReactNode;
  /** Mobile-only application header, rendered below `mobileStatusBar`. */
  mobileHeader?: ReactNode;
  /** Optional mobile system/status-bar fixture used by native-shell previews. */
  mobileStatusBar?: ReactNode;
  /** Desktop footer. */
  footer?: ReactNode;
  /** Tablet-only footer. */
  tabletFooter?: ReactNode;
  /** Mobile-only bottom navigation. */
  mobileNavigation?: ReactNode;
  /** Desktop-only right-side assistant panel. */
  assistant?: ReactNode;
  /** Desktop rail logo override. */
  logo?: ReactNode;
  /** Desktop navigation mode. Tablet always uses the canonical rail; mobile uses bottom navigation. */
  variant?: "sidebar" | "rail";
  workspace?: WorkspaceInfo;
  onCollapse?: () => void;
  onExpand?: () => void;
  className?: string;
}

const navItemBase =
  "flex w-full items-center gap-[var(--spacing-10)] rounded-lg px-[var(--spacing-12)] py-[var(--spacing-8)] font-interface text-app-nav transition-colors";

function WorkspaceMark({
  workspace,
  size = "compact"
}: {
  workspace?: WorkspaceInfo;
  size?: "compact" | "rail";
}) {
  if (workspace?.logo) return workspace.logo;
  const initial = workspace?.name.charAt(0).toUpperCase() ?? "L";
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center bg-[var(--color-app-shell-brand-primary)] font-brand text-[var(--color-app-shell-text-on-brand)]",
        size === "rail"
          ? "size-[var(--spacing-36)] rounded-lg text-app-logo-rail"
          : "size-[var(--spacing-28)] rounded-md text-app-logo-compact"
      )}
    >
      {initial}
    </div>
  );
}

function Sidebar({
  nav,
  workspace,
  onCollapse
}: Pick<AppShellProps, "nav" | "workspace" | "onCollapse">) {
  return (
    <aside className="hidden w-[var(--spacing-224)] shrink-0 flex-col gap-[var(--spacing-2)] overflow-hidden border-x border-[var(--color-app-shell-border-default)] bg-[var(--color-app-shell-surface)] px-[var(--spacing-12)] pb-[var(--spacing-12)] desktop:flex">
      {workspace && (
        <>
          <div className="flex w-full items-center gap-[var(--spacing-10)] py-[var(--spacing-12)]">
            <WorkspaceMark workspace={workspace} />
            <div className="min-w-0 font-interface">
              <p className="truncate text-app-workspace text-[var(--color-app-shell-text-heading)]">
                {workspace.name}
              </p>
              {workspace.plan && (
                <p className="truncate text-app-meta text-[var(--color-app-shell-text-placeholder)]">
                  {workspace.plan}
                </p>
              )}
            </div>
          </div>
          <div className="h-px w-full bg-[var(--color-app-shell-border-default)]" />
        </>
      )}
      {nav.map((section, index) => (
        <nav
          key={section.label ?? index}
          aria-label={section.label ?? (index === 0 ? "Primary" : undefined)}
          className="flex flex-col gap-[var(--spacing-2)]"
        >
          {section.label && (
            <p className="px-[var(--spacing-12)] pb-[var(--spacing-4)] pt-[var(--spacing-16)] font-interface text-app-admin uppercase [letter-spacing:var(--text-app-admin-letter-spacing)] text-[var(--color-app-shell-text-placeholder)]">
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
                  ? "bg-[var(--color-app-shell-nav-active)] text-[var(--color-app-shell-text-heading)]"
                  : "text-[var(--color-app-shell-text-secondary)] hover:bg-[var(--color-app-shell-nav-active)] hover:text-[var(--color-app-shell-text-heading)]"
              )}
            >
              <span
                className="flex size-[var(--spacing-20)] shrink-0 items-center justify-center"
                aria-hidden
              >
                {item.icon}
              </span>
              <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>
              {item.badge !== undefined && (
                <span className="rounded-full bg-[var(--color-app-shell-text-secondary)] px-[var(--spacing-6)] py-px font-brand text-app-caption-medium text-[var(--color-app-shell-text-on-brand)]">
                  {item.badge}
                </span>
              )}
            </a>
          ))}
        </nav>
      ))}
      <div className="min-h-0 flex-1" />
      <div className="h-px w-full bg-[var(--color-app-shell-border-default)]" />
      {onCollapse && (
        <button
          type="button"
          onClick={onCollapse}
          className={cn(
            navItemBase,
            "text-[var(--color-app-shell-text-secondary)] hover:bg-[var(--color-app-shell-nav-active)]"
          )}
        >
          <CircleArrowLeftIcon className="size-[var(--spacing-20)] shrink-0" aria-hidden />
          Collapse
        </button>
      )}
    </aside>
  );
}

function NavigationRail({
  nav,
  workspace,
  logo,
  onExpand,
  desktopVisible
}: Pick<AppShellProps, "nav" | "workspace" | "logo" | "onExpand"> & { desktopVisible: boolean }) {
  const items = nav.flatMap((section) => section.items);
  return (
    <aside
      className={cn(
        "hidden w-[var(--spacing-64)] shrink-0 flex-col items-center gap-[var(--spacing-4)] overflow-hidden border-x border-[var(--color-app-shell-border-default)] bg-[var(--color-app-shell-surface)] px-[var(--spacing-8)] pb-[var(--spacing-12)] tablet:flex",
        !desktopVisible && "desktop:hidden"
      )}
    >
      <div className="flex justify-center py-[var(--spacing-12)]">
        {logo ?? <WorkspaceMark workspace={workspace} size="rail" />}
      </div>
      <div className="h-px w-full bg-[var(--color-app-shell-border-default)]" />
      <nav
        aria-label="Primary"
        className="flex w-full flex-col items-center gap-[var(--spacing-4)]"
      >
        {items.map((item, index) => (
          <a
            key={item.href}
            href={item.href}
            aria-label={item.label}
            title={item.label}
            aria-current={item.active ? "page" : undefined}
            className={cn(
              "flex size-[var(--spacing-40)] items-center justify-center rounded-lg text-[var(--color-app-shell-text-placeholder)] transition-colors hover:bg-[var(--color-app-shell-nav-active)] hover:text-[var(--color-app-shell-text-secondary)]",
              item.active &&
                "bg-[var(--color-app-shell-nav-active)] text-[var(--color-app-shell-text-heading)]",
              index > 0 &&
                nav.some((section) => section.items[0] === item && section.label) &&
                "mt-[var(--spacing-8)]"
            )}
          >
            <span className="flex size-[var(--spacing-20)] items-center justify-center" aria-hidden>
              {item.icon}
            </span>
          </a>
        ))}
      </nav>
      <div className="min-h-0 flex-1" />
      <div className="h-px w-full bg-[var(--color-app-shell-border-default)]" />
      {onExpand && (
        <button
          type="button"
          onClick={onExpand}
          aria-label="Expand navigation"
          className="flex size-[var(--spacing-40)] items-center justify-center rounded-lg text-[var(--color-app-shell-text-secondary)] hover:bg-[var(--color-app-shell-nav-active)]"
        >
          <CircleArrowRightIcon className="size-[var(--spacing-20)]" aria-hidden />
        </button>
      )}
    </aside>
  );
}

/**
 * Responsive Lumen application shell sourced from Figma node 1007:3700.
 * Mobile (<768px), Tablet (768-1023px), and Desktop (>=1024px) layouts
 * correspond to the six approved Breakpoint/Theme variants.
 */
export function AppShell({
  nav,
  children,
  header,
  tabletHeader,
  mobileHeader,
  mobileStatusBar,
  footer,
  tabletFooter,
  mobileNavigation,
  assistant,
  logo,
  variant = "sidebar",
  workspace,
  onCollapse,
  onExpand,
  className
}: AppShellProps) {
  return (
    <div
      className={cn(
        "flex min-h-screen w-full flex-col overflow-hidden bg-[var(--color-app-shell-background)] font-interface text-[var(--color-app-shell-text-body)]",
        className
      )}
    >
      {mobileStatusBar && <div className="shrink-0 tablet:hidden">{mobileStatusBar}</div>}
      {mobileHeader && <header className="shrink-0 tablet:hidden">{mobileHeader}</header>}
      {header && (
        <header className="hidden h-[var(--spacing-52)] shrink-0 items-center border-b border-[var(--color-app-shell-border-default)] bg-[var(--color-app-shell-surface)] desktop:flex">
          {header}
        </header>
      )}

      <div className="flex min-h-0 flex-1 items-stretch">
        {variant === "sidebar" && (
          <Sidebar nav={nav} workspace={workspace} onCollapse={onCollapse} />
        )}
        <NavigationRail
          nav={nav}
          workspace={workspace}
          logo={logo}
          onExpand={onExpand}
          desktopVisible={variant === "rail"}
        />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {tabletHeader && (
            <header className="hidden h-[var(--spacing-72)] shrink-0 items-center border-b border-[var(--color-app-shell-border-default)] bg-[var(--color-app-shell-surface)] tablet:flex desktop:hidden">
              {tabletHeader}
            </header>
          )}
          <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
          {tabletFooter && (
            <div className="hidden shrink-0 tablet:block desktop:hidden">{tabletFooter}</div>
          )}
        </div>

        {assistant && (
          <aside className="hidden w-[var(--spacing-304)] shrink-0 desktop:block">
            {assistant}
          </aside>
        )}
      </div>

      {footer && <div className="hidden shrink-0 desktop:block">{footer}</div>}
      {mobileNavigation && (
        <nav aria-label="Mobile" className="shrink-0 tablet:hidden">
          {mobileNavigation}
        </nav>
      )}
    </div>
  );
}
