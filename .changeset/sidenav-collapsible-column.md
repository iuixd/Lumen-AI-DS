---
"@lumen/tokens": patch
"@lumen/ui": minor
---

Add `SideNav`, a new reusable, independently exported layout component: Lumen's collapsible
desktop navigation column (Figma node `1498:2877`), with a real animated width transition
between its expanded (labeled) and collapsed (icon-only rail) states, hover tooltips on
collapsed items, and WCAG AA-compliant section-label contrast.

`AppShell` now renders a single `SideNav` instance instead of its previous private
`Sidebar`/`NavigationRail` pair — two structurally different components hard-swapped via
the `variant` prop, which is why `onCollapse`/`onExpand` never actually animated anything
before this. `AppShell`'s public API (`variant`, `onCollapse`, `onExpand`, `workspace`,
`logo`) is unchanged and now genuinely functional. `NavItem`/`NavSection`/`WorkspaceInfo`
now live in `SideNav.tsx` but remain re-exported from `AppShell` and the package root, so
existing imports are unaffected.

New `@lumen/tokens` spacing step: `--spacing-13`, from this node's own (asymmetric, but
real and Figma-evidenced) container top padding.

Also fixes: the public `Button` wrapper (`packages/ui/src/components/button/Button.tsx`)
now forwards its ref, needed for `TooltipTrigger asChild` to position correctly — a
pre-existing gap that only surfaced once a consumer (this component's Expand control)
needed it.
