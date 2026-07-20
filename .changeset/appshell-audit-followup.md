---
"@lumen/tokens": minor
"@lumen/ui": minor
"@lumen/web-components": minor
"@lumen/angular": minor
---

Follow-up audit against the canonical Figma "AppShell" page (node 1007:3700) — the previously-sourced node 1197:1652 turned out to be one example instance inside this larger canvas, not the canonical source. Adds `AIPanel` and a Button `accent` variant (mirrored to Web Components/Angular). **Breaking:** `AppShell`'s `nav` prop changed from `NavItem[]` to `NavSection[]` to match the real `SideNav/Expanded` design (workspace switcher, badges, section grouping, collapse control) — migrate `nav={items}` to `nav={[{ items }]}`. Also corrects `KPICard`'s shadow opacity (0.04→0.08) and `PageHeader`/`Footer`'s link colors (gray→blue) against the canonical instance. New tokens: `text.link-subtle`, `background.badge`, `background.prompt`, `border.table`, `border.input`.
