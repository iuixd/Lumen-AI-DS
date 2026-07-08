# CLAUDE.md — Lumen Design System

This file governs how Claude Code (or any AI coding agent) should work
**inside this repository**. If you are building a product on top of this
design system, see `docs/claude-code-integration.md` for the snippet to add
to *your product repo's* CLAUDE.md instead.

## What this repo is

The single source of truth for Lumen's design tokens, UI components, layout
primitives, and enterprise patterns. It is derived from the `Lumen-DS` Figma
file / "Lumen AI - DS - base" library and published as three packages:

- `@lumen/tokens` — color, typography, spacing, radius, shadow. Generated
  from JSON in `packages/tokens/src/*.json` via `packages/tokens/scripts/build.mjs`.
- `@lumen/ui` — React + TypeScript + Tailwind primitives, composite
  components, and layout primitives, all built on `@lumen/tokens`.
- `@lumen/patterns` — composed enterprise-SaaS screen patterns (CRUD list,
  settings, auth, dashboard) built entirely from `@lumen/ui`.

## Hard rules when working in this repo

1. **Never hardcode a color, font size, spacing value, or shadow.** Every
   value must come from `@lumen/tokens` (a CSS variable, or the generated
   Tailwind theme key). If a value you need doesn't exist as a token, add it
   to the appropriate `packages/tokens/src/*.json` file and regenerate
   (`pnpm --filter @lumen/tokens build`) — don't inline it.
2. **Never add a component that duplicates an existing one.** Before adding
   anything to `packages/ui/src`, search `packages/ui/src/{primitives,composite,layout}`
   and `packages/patterns/src`. Extend an existing component with a new
   variant/prop before creating a new one.
3. **Match the Figma component taxonomy.** The button family (Primary,
   Secondary, Neutral, Error, Clear) and the other component sets in
   `docs/figma-sync.md` are named to mirror the Figma library 1:1. Keep new
   components named consistently so Code Connect mapping stays possible.
4. **Every new/changed component ships with:** a TypeScript-typed props
   interface, semantic-token-only styling, keyboard + screen-reader support
   (see `docs/accessibility.md`), and a Changeset (`pnpm changeset`).
5. **Don't publish silently.** Version bumps happen through the Changesets
   flow in `docs/versioning-and-releases.md`, not by hand-editing `package.json` versions.

## Working with Figma

Known gaps between the current Figma file and this repo (dark-theme
semantic colors, radius/shadow scale, icon set, exact component variant
props) are tracked in `docs/figma-sync.md`. If you're asked to close one of
these gaps, read that file first — it lists exactly what's provisional vs.
sourced.

## Repo map

```
packages/tokens/   design tokens (source of truth: src/*.json)
packages/ui/       components (primitives, composite, layout)
packages/patterns/ composed enterprise screen patterns
docs/              usage, accessibility, versioning, figma-sync guidelines
.changeset/        pending version bumps
```
