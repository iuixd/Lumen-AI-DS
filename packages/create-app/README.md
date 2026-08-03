# @lumen/create-app

Private, unpublished CLI scaffolder (`pnpm create:react` from the repo root)
that generates a React + TypeScript + Vite + Tailwind application under
`apps/<name>`, wired to `@lumen/tokens`, `@lumen/ui`, and (optionally)
`@lumen/patterns` via pnpm `workspace:*` dependencies — for developing a
product application alongside this design system in one repository. See the
root [README.md](../../README.md#create-a-react-application) for the full
walkthrough (what you get, non-interactive/CI usage) — this file covers the
package itself.

## Running it

From the repo root, not from inside this package:

```bash
corepack pnpm install
corepack pnpm --filter @lumen/create-app build
corepack pnpm create:react
```

`create:react` (defined in the root `package.json`) invokes this package's
built CLI through `corepack pnpm` explicitly, so installation always
resolves at the workspace root even when run from a generated app's own
directory.

## Scripts (this package)

```bash
pnpm --filter @lumen/create-app dev          # run the CLI via tsx, no build step
pnpm --filter @lumen/create-app build         # compile src/ -> dist/cli.js
pnpm --filter @lumen/create-app typecheck
pnpm --filter @lumen/create-app test          # vitest
```

## CLI flags (non-interactive usage)

```bash
corepack pnpm create:react -- --name my-app --patterns --no-install
```

- `--name <name>` — project name; skips the name prompt.
- `--patterns` — include `@lumen/patterns` as a dependency; skips that prompt.
- `--no-install` — scaffold only, skip the install step; skips that prompt.

Any flag omitted falls back to its interactive prompt.

## Source layout

- `src/cli.ts` — prompt flow (via `@clack/prompts`) and flag parsing.
- `src/scaffold.ts` — copies `templates/react-vite/` into `apps/<name>` and
  wires the `workspace:*` dependencies.
- `src/validation.ts` — project-name validation.
- `templates/react-vite/` — the generated app's own template, including its
  own `README.md.template` (the README a scaffolded app receives — not a
  README for this package itself).

## Not published

This package is `private: true` and never published to a registry — it
only exists as a workspace-local dev tool for this repository. Generated
apps under `apps/*` are gitignored scaffolds, not part of the design system;
see `docs/roadmap.md` Phase 14.
