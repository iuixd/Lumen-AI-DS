# Lumen Design System

Lumen is the shared design language and implementation system for Lumen products. It provides design tokens, accessible React components, layout primitives, and reusable enterprise application patterns.

[![CI](https://github.com/iuixd/Lumen-DS/actions/workflows/ci.yml/badge.svg)](https://github.com/iuixd/Lumen-DS/actions/workflows/ci.yml)
[![Storybook deployment](https://github.com/iuixd/Lumen-DS/actions/workflows/deploy-storybook.yml/badge.svg)](https://github.com/iuixd/Lumen-DS/actions/workflows/deploy-storybook.yml)

[View Storybook](http://srikumar.design/Lumen-DS/) · [Usage guide](docs/usage-guidelines.md) · [Figma synchronization](docs/figma-sync.md) · [Contributing](CONTRIBUTING.md) · [Changelog](docs/changelog.md)

> **Status:** Early development (`0.1.x`). APIs and the Git-based consumption model may change before packages reach Stable status.

## Start here

| Audience | Recommended starting point |
|---|---|
| Product and delivery | [Storybook](http://srikumar.design/Lumen-DS/) and the [roadmap](docs/roadmap.md) |
| Designers | [Figma source](docs/figma-source.md), [design tokens](docs/design-tokens.md), and [design review](docs/design-review.md) |
| Engineers | [Usage guide](docs/usage-guidelines.md), Storybook Docs, and the integration example below |
| Architects | [Component architecture](docs/component-architecture.md), [project governance](docs/project-governance.md), and [versioning](docs/versioning-and-releases.md) |
| Accessibility specialists | [Accessibility requirements](docs/accessibility.md) and Storybook accessibility checks |
| Contributors | [Contributing guide](CONTRIBUTING.md) and [development guidelines](docs/development-guidelines.md) |
| AI-assisted teams | [Claude Code integration](docs/claude-code-integration.md) |

## Explore the system

The deployed Storybook is the fastest way to inspect what Lumen provides and decide whether an existing component or pattern meets a product need.

[Open Lumen Storybook →](http://srikumar.design/Lumen-DS/)

Use Storybook to:

- review component appearance and behavior
- explore supported props, variants, sizes, and states
- switch between Light and Dark themes
- inspect usage examples and generated JSX
- review accessibility guidance
- browse composed enterprise application patterns

## What is included

| Package | Contents | Current delivery model |
|---|---|---|
| `@lumen/tokens` | Color, typography, spacing, and radius tokens. Generated CSS variables, a Tailwind preset, and typed TypeScript exports. | Built output consumed from this repository |
| `@lumen/ui` | React, TypeScript, and Tailwind primitives, composite components, and layout primitives. | TypeScript source consumed from this repository |
| `@lumen/patterns` | Composed enterprise screens built from `@lumen/ui`, including CRUD, settings, authentication, and dashboard patterns. | TypeScript source consumed from this repository |
| `@lumen/storybook` | Interactive component and pattern documentation with controls, usage code, themes, and accessibility tooling. | Private; deployed as static documentation |

Lumen does not currently define an elevation or shadow token tier because it is not present in the approved Figma foundation source. See [Figma synchronization](docs/figma-sync.md) for verified sources and provisional areas.

## Architecture

```text
Approved Figma source
        ↓
  @lumen/tokens
        ↓
     @lumen/ui
        ↓
  @lumen/patterns
        ↓
Product applications

Tokens + UI + patterns → Storybook
```

The canonical design foundation is **Lumen DS 2027**, page **Design Tokens**. Source identifiers and the authority hierarchy are maintained in [docs/figma-source.md](docs/figma-source.md).

## Prerequisites

- Node.js 22
- pnpm 9.7.0, selected through Corepack
- React 18 or later when consuming `@lumen/ui` or `@lumen/patterns`

Confirm the repository package-manager version:

```bash
corepack pnpm --version
```

The result must be `9.7.0`. Avoid using a globally installed incompatible pnpm version.

## Quick start

Install dependencies:

```bash
corepack pnpm install --frozen-lockfile
```

Run the repository quality checks:

```bash
corepack pnpm lint
corepack pnpm --recursive --if-present run typecheck
corepack pnpm --recursive --if-present run test
corepack pnpm --filter @lumen/tokens build
corepack pnpm --filter @lumen/storybook build-storybook
```

Start Storybook locally:

```bash
corepack pnpm --filter @lumen/storybook storybook
```

Open `http://localhost:6006/?path=/docs/introduction--docs`.

## Use Lumen in a product application

Packages are currently consumed as Git dependencies rather than published to a package registry. Pin product applications to an approved tag or commit SHA instead of tracking `main` in production. See [versioning and releases](docs/versioning-and-releases.md) for the current release mechanics.

```jsonc
// product-app/package.json
{
  "dependencies": {
    "@lumen/tokens": "github:iuixd/Lumen-DS#<tag-or-commit>&path:packages/tokens",
    "@lumen/ui": "github:iuixd/Lumen-DS#<tag-or-commit>&path:packages/ui",
    "@lumen/patterns": "github:iuixd/Lumen-DS#<tag-or-commit>&path:packages/patterns"
  }
}
```

`@lumen/ui` and `@lumen/patterns` currently ship as TypeScript source. Configure the product bundler to transpile them as workspace code. For example, a Next.js application should include:

```js
const nextConfig = {
  transpilePackages: ["@lumen/ui", "@lumen/patterns"]
};
```

Import public components, patterns, and token CSS:

```tsx
import { Button, Card, DataTable } from "@lumen/ui";
import { CrudListPage } from "@lumen/patterns";
import "@lumen/tokens/css";
```

Review the [usage guide](docs/usage-guidelines.md) before integrating themes or extending components.

## Design and Figma workflow

Figma is the canonical design source for approved foundations and components. Code changes sourced from Figma must follow the scope recorded under `[Unreleased]` in [docs/changelog.md](docs/changelog.md).

Before changing tokens or components:

1. Confirm the exact source in [docs/figma-source.md](docs/figma-source.md).
2. Review known drift and provisional areas in [docs/figma-sync.md](docs/figma-sync.md).
3. Reuse or extend an existing component before proposing a new one.
4. Validate the result in Storybook and against the accessibility baseline.

## Accessibility and quality

Lumen targets the WCAG 2.1 AA baseline documented in [docs/accessibility.md](docs/accessibility.md). Components must be keyboard-operable, screen-reader compatible, token-driven, and represented in Storybook.

Pull requests are expected to pass:

- lint and TypeScript validation
- unit and interaction tests
- token and package builds
- production Storybook build
- affected accessibility checks
- Figma and visual review when the change is design-sourced

See the [quality checklist](docs/quality-checklist.md) for the complete release gate.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before changing tokens, components, patterns, or Storybook. Every component change must include its typed API, semantic-token styling, accessibility behavior, tests, Storybook documentation, and a Changeset when a published package is affected.

Use one logical change per pull request. Do not silently patch Figma drift or introduce a duplicate component.

## Releases and migration

Changesets record package release impact. The release workflow creates or updates a **Version Packages** pull request; merging that pull request updates versions and package changelogs. Product applications then adopt an approved tag or commit deliberately.

- [Versioning and releases](docs/versioning-and-releases.md)
- [Release process](docs/release-process.md)
- [Project changelog and Figma synchronization scope](docs/changelog.md)
- [Roadmap](docs/roadmap.md)

## Documentation

The `docs/` directory is the authoritative knowledge base. Key references include:

- [Project governance](docs/project-governance.md)
- [Design tokens](docs/design-tokens.md)
- [Component architecture](docs/component-architecture.md)
- [Component specifications](docs/component-specifications.md)
- [Enterprise patterns](docs/enterprise-patterns.md)
- [Storybook guidelines](docs/storybook-guidelines.md)
- [GitHub workflow](docs/github-workflow.md)
- [Claude Code integration](docs/claude-code-integration.md)

## Support and ownership

- Report implementation defects through [GitHub Issues](https://github.com/iuixd/Lumen-DS/issues).
- Report design-to-code drift with the `figma-sync` label and include the exact Figma node.
- Use a pull request for reviewed code changes and follow the repository contribution checklist.
- Do not disclose credentials, private product information, or security-sensitive findings in public issues.

## License

This repository is proprietary and confidential. External copying, distribution, or use requires prior written permission from Lumen. See [LICENSE](LICENSE) for the governing terms.
