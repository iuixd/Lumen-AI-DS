# Using this Design System with Claude Code in a product repo

This page is for **product teams** building a SaaS application on top of the
Lumen Design System with Claude Code. Copy the block below into your
product repo's own `CLAUDE.md` (create one if it doesn't exist). This is
what makes Claude Code reuse Lumen components/tokens automatically instead
of generating new ones for every screen.

## 1. Add the dependency

```bash
pnpm add @lumen/tokens @lumen/ui @lumen/patterns
```

(See the root README's "Consuming this repo" section for how the dependency
resolves before this is published to a registry — git dependency, pnpm
workspace `link:`, or private registry, depending on what your org has set
up.)

## 2. Wire up Tailwind + tokens once at app root

```js
// tailwind.config.js
const lumenPreset = require("@lumen/tokens/tailwind-preset");
module.exports = {
  presets: [lumenPreset],
  content: ["./src/**/*.{ts,tsx}", "./node_modules/@lumen/ui/src/**/*.{ts,tsx}"]
};
```

```ts
// app entrypoint
import "@lumen/tokens/css";
```

## 3. Paste this block into your product repo's CLAUDE.md

```md
## Design system

This product is built on the Lumen Design System (`@lumen/tokens`,
`@lumen/ui`, `@lumen/patterns`). When generating or editing any UI:

1. Do not create a new button, input, card, modal, table, badge, avatar,
   tab, tooltip, or form field component. Import it from `@lumen/ui`.
2. Do not hardcode colors, font sizes, spacing, radii, or shadows. Use
   `@lumen/ui` components (which already consume tokens) or, for custom
   layout, the semantic CSS variables / Tailwind classes exposed by
   `@lumen/tokens` (e.g. `bg-[var(--color-background-default)]`,
   `text-title-md`, `p-4`).
3. For a full screen (a list of records, a settings page, an auth flow, a
   metrics dashboard), start from the matching pattern in `@lumen/patterns`
   and adapt its props — don't rebuild the page shape from scratch.
4. If a screen needs something that doesn't exist in `@lumen/ui` or
   `@lumen/patterns`, say so explicitly rather than silently inventing a
   one-off component, and suggest it be added upstream to the design system
   repo instead.
5. Never restyle a Lumen component with ad-hoc classes that override its
   token-based colors/spacing — pass a documented variant/prop instead, or
   flag that the variant is missing.
```

## 4. Keep it current

When `@lumen/*` releases a new version (see the design system repo's
`docs/versioning-and-releases.md`), bump the dependency in this repo and
skim the changeset notes for breaking changes before re-running Claude Code
against affected screens.
