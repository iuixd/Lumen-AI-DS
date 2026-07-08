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

There is no npm publish step — `@lumen/*` packages are consumed as a git
dependency (see root README "Consuming this repo"), not published to a
registry. CI (`.github/workflows/release.yml`) runs `changeset version` on
merges to `main` once changesets have accumulated, opening a "Version
Packages" PR that bumps `package.json` versions and changelogs. A maintainer
reviews and merges that PR, then tags the resulting commit (e.g.
`git tag ui-v0.2.0 && git push origin ui-v0.2.0`) so product repos have a
stable ref to pin.

If enough product teams end up consuming this that git-dependency installs
become a bottleneck (slow installs, no lockfile integrity hashes, awkward
private-repo auth for CI), revisit publishing to a private registry (GitHub
Packages is the natural choice given the repo already lives on GitHub) — that
just means adding a publish step back into `release.yml` and an
`NPM_TOKEN`/`GITHUB_TOKEN`-scoped secret; the changesets flow itself doesn't
change.

## Propagating updates to consuming products

1. A release lands on `main`, the Version Packages PR is merged, and the
   commit is tagged (see above).
2. Each product repo bumps its `@lumen/*` git dependency to the new tag —
   either manually, via a Renovate/Dependabot git-ref rule, or via a
   scheduled Claude Code task that opens a PR bumping the ref and running the
   product's test suite against it.
3. Breaking (major) changes must ship with a migration note in the
   changeset body; product teams should not discover a breaking change only
   from a failed build.

## Deprecating a component or token

Mark it `@deprecated` in a JSDoc comment with a pointer to its replacement at
least one minor version before removal, so `tsc`/editor tooling surfaces the
warning across every consuming repo.
