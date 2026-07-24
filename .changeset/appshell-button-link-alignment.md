---
"@lumen/ui": patch
---

`AppShell`'s bespoke icon buttons (Notifications bell, mobile hamburger toggle, mobile "New project" FAB, desktop NavigationRail's Expand button) now use the shared `Button` component, and the tablet breadcrumb's "Workspace"/"Projects" links now use `TextLink`, instead of hand-rolled `<button>`/`<a>` markup. Visual appearance is unchanged (same AppShell-specific tokens via `className` overrides) except each now gets a proper `focus-visible` ring, which none of them had before. `AppShell`'s public props are unchanged. The Sidebar's nav-list items and Collapse button, and the mobile back-link/bottom tab bar, were deliberately left as-is — they're structural nav-list/navigation affordances, not generic button/link candidates.
