# Usage Guidelines

## Installing the design system in a product repo

```bash
pnpm add @lumen/tokens @lumen/ui @lumen/patterns
```

(Until this repo is published to a private npm registry or GitHub Packages,
consumers add it as a git dependency or pnpm workspace path — see the root
README "Consuming this repo" section.)

## Wiring up Tailwind

```js
// tailwind.config.js in the consuming app
const lumenPreset = require("@lumen/tokens/dist/tailwind-preset.cjs");

module.exports = {
  presets: [lumenPreset],
  content: [
    "./src/**/*.{ts,tsx}",
    "./node_modules/@lumen/ui/src/**/*.{ts,tsx}"
  ]
};
```

Import the CSS variables once at the app root:

```ts
import "@lumen/tokens/css";
```

## The one rule

**If a component, token, or pattern already exists in this design system,
use it. Do not create a parallel implementation in the product repo.**
This applies to Claude Code, human engineers, and any other tool generating
UI for a Lumen product. See `/CLAUDE.md` for the machine-readable version of
this rule.

## Choosing what to reach for

- Need a button, input, badge, avatar, tab, tooltip? → `@lumen/ui` primitive.
- Need a card, modal, table, pagination, form field, toast, empty state? →
  `@lumen/ui` composite.
- Need page structure (max-width container, flex/grid rhythm, the app
  sidebar shell)? → `@lumen/ui` layout primitive.
- Need a whole screen shape (CRUD list, settings, auth, dashboard)? →
  `@lumen/patterns`, adapted with your data.
- None of the above fit? Propose a new component (see CONTRIBUTING.md)
  instead of writing one-off markup in the product repo.

## Theming

All color usage in components goes through semantic CSS variables
(`--color-background-default`, `--color-text-title`, `--color-brand-default`,
etc.), never raw hex or primitive scale values directly in component code.
Dark mode is enabled by setting `data-theme="dark"` on `<html>` or any
ancestor element — no component code changes required.

## Versioning

This repo is released with [Changesets](https://github.com/changesets/changesets).
See `docs/versioning-and-releases.md`.
