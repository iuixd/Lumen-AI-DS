# Versioning & Releases

This repo uses [Changesets](https://github.com/changesets/changesets) so that
`@lumen/tokens`, `@lumen/ui`, and `@lumen/patterns` can each be versioned
independently but released together when they change together (a token
change often forces a UI package bump too).

## Making a change

```bash
pnpm changeset          # describe what changed and pick a semver bump
git add .changeset
git commit -m "feat(ui): add DatePicker"
```

- **patch** — bug fix, visual fix that doesn't change the API.
- **minor** — new component, new variant, new pattern, backward-compatible.
- **major** — removed/renamed prop, removed component, token renamed or
  removed, any change that requires consuming apps to touch their code.

## Releasing

CI (`.github/workflows/release.yml`) runs `changeset version` and
`changeset publish` on merges to `main` once changesets have accumulated,
opening a "Version Packages" PR that maintainers review and merge to cut the
actual release. This keeps every version bump reviewable instead of
publishing silently on every merge.

## Propagating updates to consuming products

1. A release lands on `main` and is published (private registry or git tag —
   see root README "Consuming this repo").
2. Each product repo bumps its `@lumen/*` dependency versions — either
   manually, via Renovate/Dependabot, or via a scheduled Claude Code task
   that opens a PR bumping the design system and running the product's test
   suite against it.
3. Breaking (major) changes must ship with a migration note in the
   changeset body; product teams should not discover a breaking change only
   from a failed build.

## Deprecating a component or token

Mark it `@deprecated` in a JSDoc comment with a pointer to its replacement at
least one minor version before removal, so `tsc`/editor tooling surfaces the
warning across every consuming repo.
