---
"@lumen/ui": patch
---

Removed `AppShell`'s local CSS-variable re-scoping of `--color-button-primary-*`/`--color-button-secondary-*`/`--color-button-accent-*`, which silently shadowed `Button`'s global colors for anything rendered inside `AppShell` with a separate, stale copy that had drifted out of sync with the Figma-token fixes made earlier. `Button` instances inside `AppShell` (Share/Export/New project, etc.) now always read the same global tokens as `Button`'s own reference styling — no more risk of the two silently diverging again. No props changed on either component.
