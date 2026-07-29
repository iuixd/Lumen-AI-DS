import { type ReactNode } from "react";
import { cn } from "../lib/cn";
import { useIsDesktop } from "../lib/useIsDesktop";
import { Button } from "../components/button/Button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/tooltip/Tooltip";
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

export interface SideNavProps {
  nav: NavSection[];
  /** Whether the nav should show full labels (true) or the icon-only rail (false). */
  expanded: boolean;
  /** Renders the labeled "Collapse" footer control; omit to hide it. */
  onCollapse?: () => void;
  /** Renders the icon-only "Expand" footer control; omit to hide it. */
  onExpand?: () => void;
  workspace?: WorkspaceInfo;
  /** Header content shown above the nav list in place of `workspace`. */
  logo?: ReactNode;
  className?: string;
}

const navItemBase =
  "flex w-full items-center gap-[var(--spacing-10)] rounded-lg px-[var(--spacing-12)] py-[var(--spacing-8)] font-interface text-app-nav transition-colors";

// Same box model as navItemBase's expanded row (px-12 py-8 gap-10, h-40 fixed
// instead of auto) — exact per a dedicated single-state get_design_context
// pull on node 1498:2878, not the earlier assumption that Figma's code-gen
// padding was an artifact. The label's absence (not a `justify-center`
// override) is what visually centers the icon here.
const railItemBase =
  "flex h-[var(--spacing-40)] w-full items-center gap-[var(--spacing-10)] rounded-lg px-[var(--spacing-12)] py-[var(--spacing-8)] transition-colors";

function WorkspaceMark({ workspace, expanded }: { workspace?: WorkspaceInfo; expanded: boolean }) {
  if (workspace?.logo) return <>{workspace.logo}</>;
  const initial = workspace?.name.charAt(0).toUpperCase() ?? "L";
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center bg-[var(--color-app-shell-brand-primary)] font-brand text-[var(--color-app-shell-text-on-brand)]",
        expanded
          ? "size-[var(--spacing-28)] rounded-md text-app-logo-compact"
          : "size-[var(--spacing-36)] rounded-lg text-app-logo-rail"
      )}
    >
      {initial}
    </div>
  );
}

/**
 * Lumen's collapsible desktop navigation column, sourced from Figma node
 * 1498:2877 ("SideNav", `State=Expanded` 1079:2427 / `State=collapsed`
 * 1498:2878). One persistent component — not a swap between two
 * structurally different trees — so the width below is a real CSS
 * transition, not a hard cut. AppShell previously implemented this as two
 * separate components (`Sidebar`, `NavigationRail`) toggled by a `variant`
 * prop with no shared DOM, which is why its Collapse/Expand callbacks never
 * actually animated anything (they were wired as no-ops in Storybook).
 *
 * Every color/radius/typography value Figma specifies for this node matched
 * an existing `@lumen/tokens` value exactly. Spacing matched too, except the
 * container's own top padding — Figma's `pt-13px` (asymmetric against its
 * own `pb-12px`) isn't a step already on the 8pt/2px-substep scale, so it's
 * the new `--spacing-13` token, added after a dedicated single-state
 * `get_design_context` pull on the collapsed node confirmed it's real,
 * consistent spacing rather than a code-gen artifact. `get_motion_context`
 * returned no keyframe data (a static two-state mockup, not an animated
 * prototype), so the transition duration/easing below are a code-side
 * decision, reusing the existing provisional `duration.moderate`/
 * `easing.standard` motion tokens rather than inventing new ones.
 *
 * Collapsed NavItems use the same box model as expanded ones (px-12 py-8
 * gap-10, h-40 fixed instead of auto) — confirmed exact via that same
 * dedicated pull; the label's absence, not a `justify-center` override, is
 * what visually centers the icon.
 *
 * Content (labels, the workspace name/plan text, which footer control
 * renders) is gated on `expanded && useIsDesktop()`, not `expanded` alone —
 * this component is also the persistent tablet rail (tablet always shows
 * the icon-only layout regardless of `expanded`, per the original AppShell
 * docstring), and `expanded` alone can't express "collapsed-by-viewport"
 * vs "collapsed-by-user-choice" separately. Width uses the same combined
 * value for the same reason: at tablet, showing the desktop-expanded 224px
 * width with icon-only content would either overflow or leave dead space.
 */
export function SideNav({
  nav,
  expanded,
  onCollapse,
  onExpand,
  workspace,
  logo,
  className
}: SideNavProps) {
  const isDesktop = useIsDesktop();
  const visuallyExpanded = expanded && isDesktop;

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "hidden shrink-0 flex-col gap-[var(--spacing-2)] overflow-hidden border-x border-[var(--color-app-shell-border-default)] bg-[var(--color-app-shell-nav-bg)] px-[var(--spacing-12)] pb-[var(--spacing-12)] pt-[var(--spacing-13)] tablet:flex",
          "transition-[width] duration-[var(--duration-moderate)] ease-[var(--easing-standard)]",
          visuallyExpanded ? "w-[var(--spacing-224)]" : "w-[var(--spacing-64)]",
          className
        )}
      >
        {(workspace || logo) && (
          <>
            <div
              className={cn(
                "flex w-full items-center py-[var(--spacing-12)]",
                visuallyExpanded ? "gap-[var(--spacing-10)]" : "justify-center"
              )}
            >
              {logo && !workspace ? (
                logo
              ) : (
                <WorkspaceMark workspace={workspace} expanded={visuallyExpanded} />
              )}
              {visuallyExpanded && workspace && (
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
              )}
            </div>
            <div className="h-px w-full bg-[var(--color-app-shell-border-default)]" />
          </>
        )}

        {nav.map((section, index) => (
          <nav
            key={section.label ?? index}
            aria-label={section.label ?? (index === 0 ? "Primary" : undefined)}
            className="flex w-full flex-col items-center gap-[var(--spacing-2)]"
          >
            {visuallyExpanded && section.label && (
              // text-secondary, not Figma's literal text/tertiary binding:
              // text-tertiary (lumen-gray.600, #838F92 on white) contrasts at
              // 3.32:1, below WCAG AA's 4.5:1 minimum for 10px text — an axe
              // "Serious" violation. text-secondary (lumen-gray.700,
              // #626B6E, already used elsewhere in this component) contrasts
              // at ~5.46:1 and passes. Scoped to this label rather than
              // changing the shared text-tertiary token, which AIPanel/
              // PageHeader/other consumers also use at sizes/contexts not
              // audited here.
              <p className="w-full px-[var(--spacing-12)] pb-[var(--spacing-4)] pt-[var(--spacing-16)] font-interface text-app-admin uppercase [letter-spacing:var(--text-app-admin-letter-spacing)] text-[var(--color-app-shell-text-secondary)]">
                {section.label}
              </p>
            )}
            {!visuallyExpanded && index > 0 && <div className="h-[var(--spacing-8)] w-full" />}
            {section.items.map((item) =>
              visuallyExpanded ? (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={item.active ? "page" : undefined}
                  className={cn(
                    navItemBase,
                    item.active
                      ? "bg-[var(--color-app-shell-nav-active)] text-[var(--color-app-shell-nav-selected-on-action)]"
                      : "text-[var(--color-app-shell-nav-on-action)] hover:bg-[var(--color-app-shell-nav-hover)] hover:text-[var(--color-app-shell-nav-selected-on-action)]"
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
                    <span className="rounded-full bg-[var(--color-badge-default-bg)] px-[var(--spacing-8)] py-[var(--spacing-2)] font-interface text-badge-sm text-[var(--color-badge-default-text)]">
                      {item.badge}
                    </span>
                  )}
                </a>
              ) : (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <a
                      href={item.href}
                      aria-label={item.label}
                      aria-current={item.active ? "page" : undefined}
                      className={cn(
                        railItemBase,
                        item.active
                          ? "bg-[var(--color-app-shell-nav-active)] text-[var(--color-app-shell-nav-selected-on-action)]"
                          : "text-[var(--color-app-shell-icon-secondary)] hover:bg-[var(--color-app-shell-nav-hover)] hover:text-[var(--color-app-shell-nav-on-action)]"
                      )}
                    >
                      <span
                        className="flex size-[var(--spacing-20)] items-center justify-center"
                        aria-hidden
                      >
                        {item.icon}
                      </span>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              )
            )}
          </nav>
        ))}

        <div className="min-h-0 flex-1" />
        <div className="h-px w-full bg-[var(--color-app-shell-border-default)]" />

        {/* Not the shared Button component: this is a full-width nav-list
            row sharing navItemBase with the <a> items above it, not a
            standalone action — converting it alone would leave it visually
            inconsistent with its list siblings, which are real navigation
            links (not Button/TextLink candidates either, since they carry
            icon+badge+active-state slots no generic link component
            represents). */}
        {visuallyExpanded && onCollapse && (
          <button
            type="button"
            onClick={onCollapse}
            className={cn(
              navItemBase,
              "text-[var(--color-app-shell-text-secondary)] hover:bg-[var(--color-app-shell-nav-hover)]"
            )}
          >
            <CircleArrowLeftIcon className="size-[var(--spacing-20)] shrink-0" aria-hidden />
            Collapse
          </button>
        )}
        {!visuallyExpanded && onExpand && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onExpand}
                aria-label="Expand navigation"
                className="size-[var(--spacing-40)] rounded-lg text-[var(--color-app-shell-text-secondary)] hover:bg-[var(--color-app-shell-nav-hover)]"
              >
                <CircleArrowRightIcon className="size-[var(--spacing-20)]" aria-hidden />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Expand navigation</TooltipContent>
          </Tooltip>
        )}
      </aside>
    </TooltipProvider>
  );
}
