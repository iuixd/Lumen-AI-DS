---
"@lumen/tokens": patch
"@lumen/ui": patch
---

`PageHeader`'s breadcrumb links now render through the shared `TextLink` component instead of a raw `<a>` (still colored via the distinct `--color-app-shell-text-link` role). Also fixed a one-step dark-mode color drift: `app-shell.text-link` (dark) now matches `TextLink`'s own `text.link` token exactly (`primary.300`/`#D8668A`, previously `primary.200`). Light mode was already correct. No prop changes.
