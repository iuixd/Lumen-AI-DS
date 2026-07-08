# Lumen Design System

The single source of truth for design tokens, UI components, layout
primitives, and enterprise SaaS patterns used across every Lumen product.
Sourced from the `Lumen-DS` Figma file ("Lumen AI - DS - base" library) and
published as versioned packages that product teams — and Claude Code —
consume instead of re-deriving UI per app.

## Packages

| Package | Contents |
|---|---|
| `@lumen/tokens` | Color, typography, spacing, radius, and elevation tokens. Generated CSS variables + Tailwind preset + typed TS exports. |
| `@lumen/ui` | React + TypeScript + Tailwind components: primitives (Button, Input, Badge, Avatar, Tabs, Tooltip, ...), composites (Card, Modal, DataTable, Pagination, FormField, Toast, EmptyState), layout primitives (Container, Stack, Grid, AppShell). |
| `@lumen/patterns` | Composed enterprise screens built from `@lumen/ui`: `CrudListPage`, `SettingsPage`, `AuthForm`, `DashboardPage`. |

## Quick start (working in this repo)

```bash
pnpm install
pnpm build        # builds tokens, typechecks packages
pnpm typecheck
pnpm lint
```

## Consuming this repo from a product app

This repo is consumed as a git dependency — there is no npm publish step.
Add it as a pnpm workspace path or git dependency, pinned to a tag or commit
SHA once one exists (see `docs/versioning-and-releases.md`):

```jsonc
// product-app/package.json
{
  "dependencies": {
    "@lumen/tokens": "github:iuixd/Lumen-DS#main&path:packages/tokens",
    "@lumen/ui": "github:iuixd/Lumen-DS#main&path:packages/ui",
    "@lumen/patterns": "github:iuixd/Lumen-DS#main&path:packages/patterns"
  }
}
```

`@lumen/ui` and `@lumen/patterns` ship as TypeScript source (no build step) —
your bundler needs to transpile them like workspace code (e.g. Next.js
`transpilePackages: ["@lumen/ui", "@lumen/patterns"]`, or Vite's default
behavior for non-`node_modules`-published deps). `@lumen/tokens` ships a
built `dist/` (CSS variables + Tailwind preset + typed exports) so it works
as-is. If/when there are enough consuming teams to justify the overhead, this
can move to a private registry — see `docs/versioning-and-releases.md`.

```tsx
import { Button, Card, DataTable } from "@lumen/ui";
import { CrudListPage } from "@lumen/patterns";
import "@lumen/tokens/css";
```

## Using this with Claude Code

See `CLAUDE.md` (governance for contributing *to* this repo) and
`docs/claude-code-integration.md` (the snippet to paste into a *product*
repo's CLAUDE.md so Claude Code reuses this system automatically instead of
generating new components).

## Documentation

- [`docs/usage-guidelines.md`](docs/usage-guidelines.md) — how to install and wire up the system, theming, the reuse-first rule
- [`docs/accessibility.md`](docs/accessibility.md) — WCAG 2.1 AA baseline every component meets
- [`docs/enterprise-patterns.md`](docs/enterprise-patterns.md) — the composed screen patterns and required loading/empty/error states
- [`docs/versioning-and-releases.md`](docs/versioning-and-releases.md) — Changesets flow, propagating updates to product repos
- [`docs/figma-sync.md`](docs/figma-sync.md) — what's directly sourced from Figma vs. engineering-extrapolated, and the ongoing sync workflow
- [`docs/claude-code-integration.md`](docs/claude-code-integration.md) — wiring a product repo's Claude Code setup to this design system
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — component checklist and PR conventions

## Governance

Changes to tokens or components are versioned via
[Changesets](https://github.com/changesets/changesets): `.github/workflows/release.yml`
opens a "Version Packages" PR that bumps `package.json` versions and
generates changelogs on merge to `main`. Product repos pin a git tag or
commit SHA and bump deliberately — see `docs/versioning-and-releases.md` for
how updates propagate without silently breaking every downstream app.
