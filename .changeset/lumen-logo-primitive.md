---
"@lumen/ui": minor
---

Add `LumenLogo`, a new reusable primitive: the actual Lumen brand mark (Figma node `1174:1354`,
"Header"), replacing a placeholder — a plain crimson square with a literal "L" character — used
in the Storybook header mockup and as `SideNav`'s example custom logo.

The real mark is a detailed multi-gradient SVG, committed as a static asset
(`packages/ui/src/assets/lumen-logo.svg`) and rendered via `<img>`, the same treatment already
used for `ThemeToggle`'s and Checkbox's committed icon assets. `AppShell`'s and `SideNav`'s
Storybook demos now pass it through `workspace.logo`, reusing the same asset in both the header
mockup and the nav column, per direct request.
