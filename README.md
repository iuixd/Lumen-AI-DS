# Lumen AI Design System

Lumen is the shared design language and implementation system for Lumen products. It provides design tokens, framework-agnostic component specifications, layout primitives, and reusable enterprise application patterns. React is Lumen's current framework package — see [Architecture](#architecture) below — with Angular, Vue, and Web Components planned as peers, not replacements.

[![CI](https://github.com/iuixd/Lumen-AI-DS/actions/workflows/ci.yml/badge.svg)](https://github.com/iuixd/Lumen-AI-DS/actions/workflows/ci.yml)
[![Storybook deployment](https://github.com/iuixd/Lumen-AI-DS/actions/workflows/deploy-storybook.yml/badge.svg)](https://github.com/iuixd/Lumen-AI-DS/actions/workflows/deploy-storybook.yml)

[View Storybook](http://srikumar.design/Lumen-AI-DS/) · [Usage guide](docs/usage-guidelines.md) · [Figma synchronization](docs/figma-sync.md) · [Contributing](CONTRIBUTING.md) · [Changelog](docs/changelog.md)

> **Status:** Early development (`0.1.x`). APIs and the Git-based consumption model may change before packages reach Stable status.

## Start here

| Audience | Recommended starting point |
|---|---|
| Product and delivery | [Storybook](http://srikumar.design/Lumen-AI-DS/) and the [roadmap](docs/roadmap.md) |
| Designers | [Figma source](docs/figma-source.md), [design tokens](docs/design-tokens.md), and [design review](docs/design-review.md) |
| Engineers | [Usage guide](docs/usage-guidelines.md), Storybook Docs, and the integration example below |
| Architects | [Component architecture](docs/component-architecture.md), [project governance](docs/project-governance.md), and [versioning](docs/versioning-and-releases.md) |
| Accessibility specialists | [Accessibility requirements](docs/accessibility.md) and Storybook accessibility checks |
| Contributors | [Contributing guide](CONTRIBUTING.md) and [development guidelines](docs/development-guidelines.md) |
| AI-assisted teams | [Claude Code integration](docs/claude-code-integration.md) |

## Explore the system

The deployed Storybook is the fastest way to inspect what Lumen provides and decide whether an existing component or pattern meets a product need.

[Open Lumen Storybook →](http://srikumar.design/Lumen-AI-DS/)

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
| `@lumen/ui` | React, TypeScript, and Tailwind primitives, composite components, and layout primitives. Lumen's React framework package — see [Architecture](#architecture). | TypeScript source consumed from this repository |
| `@lumen/patterns` | Composed enterprise screens built from `@lumen/ui`, including CRUD, settings, authentication, and dashboard patterns. | TypeScript source consumed from this repository |
| `@lumen/web-components` | Framework-agnostic custom elements built with Lit. Proof of concept — Button only. | TypeScript source consumed from this repository |
| `@lumen/angular` | Angular standalone components, targeting Angular 20 LTS. Proof of concept — Button only. | TypeScript source consumed from this repository |
| `@lumen/storybook` | Interactive component and pattern documentation with controls, usage code, themes, and accessibility tooling. React components only — `@lumen/web-components` and `@lumen/angular` aren't covered yet. | Private; deployed as static documentation |

Lumen does not currently define an elevation or shadow token tier because it is not present in the approved Figma foundation source. See [Figma synchronization](docs/figma-sync.md) for verified sources and provisional areas.

## Architecture

Lumen is a framework-agnostic design-system core with separate framework packages, so it does not treat any one framework's components as the source of truth:

```text
Approved Figma source
        ↓
  @lumen/tokens                  (framework-agnostic: CSS variables,
        ↓                          Tailwind preset, typed exports)
Framework-agnostic foundations
  and component specifications   (docs/component-specifications.md —
        ↓                          the component contract itself)
Framework packages
   ├── React           → @lumen/ui, @lumen/patterns      (reference implementation)
   ├── Web Components  → @lumen/web-components            (proof of concept, Button only)
   ├── Angular         → @lumen/angular                    (proof of concept, Button only, Angular 20 LTS)
   └── Vue             → not yet built
        ↓
Product applications

Tokens + framework packages → Storybook (React only; Web Components and Angular not yet covered)
```

`@lumen/ui` and `@lumen/patterns` are Lumen's reference implementation, not the definition of a Lumen component — `docs/component-specifications.md` is. `@lumen/web-components` and `@lumen/angular` are early proofs of concept covering one component each; building the first of them surfaced that the written Button specification didn't actually match what `@lumen/ui` shipped, which has since been reconciled (see [docs/roadmap.md](docs/roadmap.md) Phase 13 Findings). See [docs/component-architecture.md](docs/component-architecture.md) §0 for the full layer diagram and rationale.

The canonical design foundation is **Lumen AI Design System**, page **Design Tokens**. Source identifiers and the authority hierarchy are maintained in [docs/figma-source.md](docs/figma-source.md).

## Prerequisites

- Node.js 22
- pnpm 11.11.0, selected through Corepack
- React 18 or later when consuming `@lumen/ui` or `@lumen/patterns`

Confirm the repository package-manager version:

```bash
corepack pnpm --version
```

The result must be `11.11.0`. Avoid using a globally installed incompatible pnpm version.

If `corepack pnpm <script>` fails with a pnpm version mismatch error (for example
`This project is configured to use 11.11.0 of pnpm. Your current pnpm is v<other>`),
a global pnpm install is shadowing Corepack's shim on `PATH`. Root scripts that
internally shell out to `pnpm --filter <pkg> ...` (including `create:react`) resolve
that inner `pnpm` from `PATH`, not back through Corepack, so the mismatch surfaces
there too. Running the same command as plain `pnpm <script>` (without the `corepack`
prefix) lets pnpm auto-switch to the pinned version instead of erroring.

## Quick start

Install dependencies:

```bash
corepack pnpm install --frozen-lockfile
```

Run the repository quality checks:

```bash
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm --filter @lumen/tokens build
corepack pnpm --filter @lumen/storybook build-storybook
```

`typecheck` and `test` are scoped to `./packages/**` (not a blanket recursive run) so that
generated apps under `apps/*` — see [Create a React application](#create-a-react-application)
below — never get silently picked up by the repository's own root commands.

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
    "@lumen/tokens": "github:iuixd/Lumen-AI-DS#<tag-or-commit>&path:packages/tokens",
    "@lumen/ui": "github:iuixd/Lumen-AI-DS#<tag-or-commit>&path:packages/ui",
    "@lumen/patterns": "github:iuixd/Lumen-AI-DS#<tag-or-commit>&path:packages/patterns"
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

## Create a React application

For developing a product application and the design system together in this monorepo, use the
**pnpm workspace integration model** instead: a generated app lives under `apps/<name>` as a real
member of this repository's pnpm workspace, consuming `@lumen/tokens`, `@lumen/ui`, and (optionally)
`@lumen/patterns` as `workspace:*` dependencies — no Git-dependency pinning, no publish step.

```bash
corepack pnpm install
corepack pnpm --filter @lumen/create-app build
corepack pnpm create:react
```

The command prompts for a project name (default `lumen-ai-saas`), whether to include
`@lumen/patterns`, and whether to install dependencies immediately. Non-interactive flags are also
supported, e.g. for scripting:

```bash
corepack pnpm create:react -- --name my-app --patterns --no-install
```

- The app is created under `apps/<name>` — never committed by default; generate a throwaway app
  locally whenever you need one.
- It uses local `workspace:*` dependencies, linked via pnpm symlinks, not copied.
- Changes to any package under `packages/` (tokens, ui, patterns) are available in the generated
  app immediately — no build or reinstall step.
- Installation is always managed from the repository root, even when prompted from inside the
  generated app's directory.
- This setup is intended for developing the product and the design system together, side by side,
  in one repository — for consuming Lumen from a separate product repository, see
  [Use Lumen in a product application](#use-lumen-in-a-product-application) above instead.

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

- Report implementation defects through [GitHub Issues](https://github.com/iuixd/Lumen-AI-DS/issues).
- Report design-to-code drift with the `figma-sync` label and include the exact Figma node.
- Use a pull request for reviewed code changes and follow the repository contribution checklist.
- Do not disclose credentials, private product information, or security-sensitive findings in public issues.

## License

Licensed under the [Apache License, Version 2.0](LICENSE). You may use, modify, and redistribute this repository's contents under the terms of that license, including its NOTICE and attribution requirements.
