# @lumen/patterns

Composed enterprise-SaaS screen patterns built entirely from `@lumen/ui`:
`CrudListPage`, `SettingsPage`, `AuthForm`, `DashboardPage`,
`EnterpriseLoginPage`, `DataExtractionOnboardingPage`.

These are reference implementations meant to be imported and adapted with
your own data — not a component library. Every pattern is "call the prop,
don't fake a backend": data fetching, submission, and navigation are all
caller-supplied callbacks/props, not built-in network calls. See
`docs/enterprise-patterns.md` at the repo root for when to use each one and
the required loading/empty/error states for any list or detail screen.

## Installation

```bash
pnpm add @lumen/patterns @lumen/ui @lumen/tokens react react-dom
```

```tsx
import "@lumen/tokens/css";
import "@lumen/ui/shadcn.css";
import { DashboardPage } from "@lumen/patterns";
```

React-only — `@lumen/web-components`/`@lumen/angular` have no
pattern-package equivalent (both are component libraries, not composed
screens).

## Storybook

`pnpm storybook` from the repo root includes MDX pages and stories for
every pattern in this package.
