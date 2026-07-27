import { useEffect, useState, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { Button } from "../components/button/Button";
import { CircleArrowLeftIcon, CircleArrowRightIcon } from "../icons/generated";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../components/resizable/Resizable";

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
  /** Tablet-only header (52px in the canonical AppShell). */
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
  /** Optional custom content above the canonical rail navigation. */
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
    <aside className="hidden w-[var(--spacing-224)] shrink-0 flex-col gap-[var(--spacing-2)] overflow-hidden border-x border-[var(--color-app-shell-border-default)] bg-[var(--color-app-shell-nav-bg)] px-[var(--spacing-12)] pb-[var(--spacing-12)] desktop:flex">
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
            <p className="px-[var(--spacing-12)] pb-[var(--spacing-4)] pt-[var(--spacing-16)] font-interface text-app-admin uppercase [letter-spacing:var(--text-app-admin-letter-spacing)] text-[var(--color-app-shell-text-tertiary)]">
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
          ))}
        </nav>
      ))}
      <div className="min-h-0 flex-1" />
      <div className="h-px w-full bg-[var(--color-app-shell-border-default)]" />
      {/* Not the shared Button component: this is a full-width nav-list row
          sharing navItemBase with the <a> items above it, not a standalone
          action — converting it alone would leave it visually inconsistent
          with its list siblings, which are real navigation links (not
          Button/TextLink candidates either, since they carry icon+badge+
          active-state slots no generic link component represents). */}
      {onCollapse && (
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
    </aside>
  );
}

function NavigationRail({
  nav,
  logo,
  onExpand,
  desktopVisible
}: Pick<AppShellProps, "nav" | "logo" | "onExpand"> & { desktopVisible: boolean }) {
  const items = nav.flatMap((section) => section.items);
  return (
    <aside
      className={cn(
        "hidden w-[var(--spacing-64)] shrink-0 flex-col items-center gap-[var(--spacing-4)] overflow-hidden border-x border-[var(--color-app-shell-border-default)] bg-[var(--color-app-shell-nav-bg)] px-[var(--spacing-8)] pb-[var(--spacing-12)] tablet:flex",
        !desktopVisible && "desktop:hidden"
      )}
    >
      {logo && (
        <>
          <div className="flex justify-center py-[var(--spacing-12)]">{logo}</div>
          <div className="h-px w-full bg-[var(--color-app-shell-border-default)]" />
        </>
      )}
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
              "flex size-[var(--spacing-40)] items-center justify-center rounded-lg text-[var(--color-app-shell-icon-secondary)] transition-colors",
              item.active
                ? "bg-[var(--color-app-shell-nav-active)] text-[var(--color-app-shell-nav-selected-on-action)]"
                : "hover:bg-[var(--color-app-shell-nav-hover)] hover:text-[var(--color-app-shell-nav-on-action)]",
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
        <Button
          variant="ghost"
          size="icon"
          onClick={onExpand}
          aria-label="Expand navigation"
          className="size-[var(--spacing-40)] rounded-lg text-[var(--color-app-shell-text-secondary)] hover:bg-[var(--color-app-shell-nav-hover)]"
        >
          <CircleArrowRightIcon className="size-[var(--spacing-20)]" aria-hidden />
        </Button>
      )}
    </aside>
  );
}

// Mirrors packages/tokens/src/breakpoint.json's "desktop" threshold (1024px)
// and Tailwind's `desktop:` screen variant (packages/tokens/scripts/build.mjs).
// The assistant panel is only ever resizable at this breakpoint — below it,
// `assistant` renders through pure CSS (`hidden ... desktop:block`) exactly as
// before, so mobile/tablet layout is untouched by this hook.
const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";

// AIPanel's own genuine minimum usable width (header icon+title row, prompt
// input + send button, message-bubble padding) — measured live in a browser
// at several widths rather than picked arbitrarily; see docs/changelog.md's
// "assistant panel drag-resizable" entry for the measurement notes. A plain
// pixel string (not a percentage) so it holds regardless of how wide the
// overall row is — react-resizable-panels' Panel interprets a unit-suffixed
// size string literally, unlike the percent-only public contract this
// wrapper's `defaultSize`/`maxSize` use.
const ASSISTANT_MIN_WIDTH = "260px";

function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia(DESKTOP_MEDIA_QUERY).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const handleChange = () => setIsDesktop(mql.matches);
    handleChange();
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  return isDesktop;
}

/**
 * Responsive Lumen application shell sourced from Figma node 1007:3700.
 * Mobile (<768px), Tablet (768-1023px), and Desktop (>=1024px) layouts
 * correspond to the six approved Breakpoint/Theme variants.
 *
 * 2026-07-27 addition: the desktop `assistant` panel is resizable, via the
 * existing shadcn-sourced `ResizablePanelGroup`/`ResizablePanel`/
 * `ResizableHandle` (packages/ui/src/components/resizable) rather than a new
 * bespoke drag implementation — no other component in `@lumen/ui` needed
 * draggable width before this, and this reuses that one instead of adding a
 * second. Gated on `useIsDesktop()` (not just CSS) because
 * `react-resizable-panels` commits each panel's width as a fixed
 * `flexBasis: X%` after its first layout pass with no `flexGrow` fallback —
 * simply hiding the assistant panel via `desktop:hidden` CSS at narrower
 * breakpoints would leave the main column pinned at its resized percentage
 * (e.g. 79%) instead of reclaiming the freed width, producing a dead gap on
 * tablet/mobile. Below desktop, this renders the exact same plain flex
 * markup as before (verified: `window.matchMedia` is stubbed to always
 * report no match in the jsdom test environment, so `AppShell.test.tsx`'s
 * existing assertions against the plain `desktop:block` aside continue to
 * exercise that unchanged path). Default/min/max sizes are percentages of
 * the row width, chosen against the canonical 1440px desktop frame: 21%
 * (~302px) default, matching the previous fixed 304px width; 18–32%
 * (~259–461px) bounds on the assistant so it can't be dragged unusably
 * narrow or so wide it crowds out the main content. No cross-reload
 * persistence: the installed `react-resizable-panels@4.12` replaced
 * shadcn's simple `autoSaveId` string prop with a separate
 * `useDefaultLayout` storage hook — out of scope for this addition, so the
 * panel resets to its default width on reload, same as before this change.
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
  const isDesktop = useIsDesktop();
  const mainContent = (
    <>
      {tabletHeader && (
        <header className="hidden h-[var(--spacing-52)] shrink-0 items-center border-b border-[var(--color-app-shell-border-default)] bg-[var(--color-app-shell-surface)] tablet:flex desktop:hidden">
          {tabletHeader}
        </header>
      )}
      <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      {tabletFooter && (
        <div className="hidden shrink-0 tablet:block desktop:hidden">{tabletFooter}</div>
      )}
    </>
  );

  return (
    <div
      className={cn(
        "flex min-h-screen w-full flex-col overflow-hidden bg-[var(--color-app-shell-background)] font-interface text-[var(--color-app-shell-text-body)]",
        // No local --color-button-*/--color-input-* re-scoping here (button
        // re-scoping removed 2026-07-24; the matching --color-input-* copy
        // below was removed 2026-07-27 for the identical reason, found via a
        // user report that AppShell's search input and AIPanel's prompt
        // input didn't match Figma's colors even after those components'
        // own classNames were corrected to reference the real tokens):
        // Button and Input must always read the same global --color-button-*/
        // --color-input-* tokens everywhere, including inside AppShell, so
        // they can't silently drift from their own reference styling the way
        // `secondary`/`primary`/`search` just did — the app-shell-specific
        // shadow copies of these tokens were never updated when Button's and
        // Input's colors were last synced to Figma, and would have silently
        // neutralized any future per-component fix too. See
        // docs/shadcn-integration.md §7.8.
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
          logo={logo}
          onExpand={onExpand}
          desktopVisible={variant === "rail"}
        />

        {assistant && isDesktop ? (
          <ResizablePanelGroup
            direction="horizontal"
            className="min-w-0 flex-1"
            // react-resizable-panels' Group hardcodes an inline `height:
            // "100%"`. That percentage never resolves here: this row's own
            // height comes from *its* flex-grow allocation (not a literal
            // CSS height), and — confirmed empirically, not just assumed
            // from spec-reading — Chromium doesn't treat a flex-grow-derived
            // size as "definite" for a descendant's plain percentage height,
            // so Group silently collapsed to its content's height instead of
            // the row's. `style` here is spread over the library's own style
            // object before its non-overridable properties, so this
            // overrides just `height` with `auto`, which (per the flexbox
            // spec) is exactly the condition that makes `align-items:
            // stretch` take over — verified this actually stretches Group to
            // the row's full height, not merely inferred.
            style={{ height: "auto" }}
          >
            <ResizablePanel
              defaultSize={79}
              minSize={60}
              className="flex h-full min-w-0 flex-col"
            >
              {mainContent}
            </ResizablePanel>
            <ResizableHandle className="bg-[var(--color-app-shell-border-default)]" />
            <ResizablePanel
              defaultSize={21}
              minSize={ASSISTANT_MIN_WIDTH}
              maxSize={32}
              className="h-full"
            >
              {assistant}
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <>
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">{mainContent}</div>
            {assistant && (
              <aside className="hidden w-[var(--spacing-304)] shrink-0 desktop:block">
                {assistant}
              </aside>
            )}
          </>
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
