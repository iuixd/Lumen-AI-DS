import { type ReactNode } from "react";
import { cn } from "../lib/cn";
import { useIsDesktop } from "../lib/useIsDesktop";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../components/resizable/Resizable";
import { SideNav, type NavSection, type WorkspaceInfo } from "./SideNav";

export type { NavItem, NavSection, WorkspaceInfo } from "./SideNav";

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
  /**
   * Desktop navigation width. "sidebar" (default) shows the full labeled
   * `SideNav`; "rail" shows the icon-only collapsed form. Tablet always
   * shows the collapsed rail regardless of this value; mobile uses bottom
   * navigation. Toggle via `onCollapse`/`onExpand` for a real, animated
   * user-driven collapse rather than a fixed initial mode.
   */
  variant?: "sidebar" | "rail";
  workspace?: WorkspaceInfo;
  onCollapse?: () => void;
  onExpand?: () => void;
  className?: string;
}

// AIPanel's own genuine minimum usable width (header icon+title row, prompt
// input + send button, message-bubble padding) — measured live in a browser
// at several widths rather than picked arbitrarily; see docs/changelog.md's
// "assistant panel drag-resizable" entry for the measurement notes. A plain
// pixel string (not a percentage) so it holds regardless of how wide the
// overall row is — react-resizable-panels' Panel interprets a unit-suffixed
// size string literally, unlike the percent-only public contract this
// wrapper's `defaultSize`/`maxSize` use.
const ASSISTANT_MIN_WIDTH = "260px";

/**
 * Responsive Lumen application shell sourced from Figma node 1007:3700.
 * Mobile (<768px), Tablet (768-1023px), and Desktop (>=1024px) layouts
 * correspond to the six approved Breakpoint/Theme variants.
 *
 * 2026-07-29: the desktop nav column is `SideNav` (Figma node 1498:2877), one
 * persistent component with a real animated width transition — replacing the
 * previous `Sidebar`/`NavigationRail` pair, two structurally different
 * components hard-swapped via `variant`, which is why `onCollapse`/
 * `onExpand` never actually animated anything before this. `SideNav` renders
 * once and internally gates its expanded/collapsed content on the real
 * desktop breakpoint (via the same `useIsDesktop()` this file already used
 * for the assistant panel below) so tablet always gets the icon-only rail
 * regardless of `variant`, matching this shell's original invariant.
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
        <SideNav
          nav={nav}
          expanded={variant === "sidebar"}
          workspace={workspace}
          logo={logo}
          onCollapse={onCollapse}
          onExpand={onExpand}
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
