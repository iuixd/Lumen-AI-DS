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

Until this is published to a private registry, add it as a pnpm workspace
path or git dependency:

```jsonc
// product-app/package.json
{
  "dependencies": {
    "@lumen/tokens": "github:iuixd/lumenai#main&path:packages/tokens",
    "@lumen/ui": "github:iuixd/lumenai#main&path:packages/ui",
    "@lumen/patterns": "github:iuixd/lumenai#main&path:packages/patterns"
  }
}
```

Once you're ready for real version pinning, switch this to a private npm
registry (GitHub Packages / Verdaccio / npm Enterprise) and publish via the
`release` workflow — see `docs/versioning-and-releases.md`.

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
[Changesets](https://github.com/changesets/changesets) and released through
`.github/workflows/release.yml`. Product repos pin a version and bump
deliberately — see `docs/versioning-and-releases.md` for how updates
propagate without silently breaking every downstream app.
