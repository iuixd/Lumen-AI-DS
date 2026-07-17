# CLAUDE.md — Lumen AI Design System

This file governs how Claude Code (or any AI coding agent) should work
**inside this repository**. If you are building a product on top of this
design system, see `docs/claude-code-integration.md` for the snippet to add
to *your product repo's* CLAUDE.md instead.

## Living documentation policy

`docs/` is the authoritative knowledge base for Lumen — every file in it is
living and may evolve as the system grows. Use the latest version of the
relevant docs before making a recommendation, architectural decision, code
change, Storybook update, or release decision; don't rely on prior
conversation assumptions once the documentation has changed.
`docs/project-governance.md` owns the full policy (authority order when
sources conflict, which docs to read per task type, when to recommend-and-
confirm vs. implement directly) — read it rather than re-deriving it here.

## What this repo is

The single source of truth for Lumen's design tokens, UI components, layout
primitives, and enterprise patterns. Tokens are derived from the
`Lumen-AI-Design-System` Figma file (page "Design Tokens"); see `docs/figma-sync.md`
for exactly which nodes and what's still provisional. Published as six
packages:

- `@lumen/tokens` — color, typography, spacing, radius. No shadow/elevation
  tier (not defined in the current Figma source). Generated from JSON in
  `packages/tokens/src/*.json` via `packages/tokens/scripts/build.mjs`.
- `@lumen/ui` — React + TypeScript + Tailwind primitives, composite
  components, and layout primitives, all built on `@lumen/tokens`. This is
  Lumen's React framework package — see `docs/component-architecture.md`
  §0: the design tokens, framework-agnostic foundations, and component
  specifications above it are the actual source of truth for the component
  contract, not this package. `@lumen/web-components` and `@lumen/angular`
  implement the same contract for their frameworks; adding them does not
  make `@lumen/ui` any less canonical for React consumers. Vue is the only
  planned framework package not yet built.
- `@lumen/patterns` — composed enterprise-SaaS screen patterns (CRUD list,
  settings, auth, dashboard) built entirely from `@lumen/ui`.
- `@lumen/web-components` — framework-agnostic custom elements built with
  Lit, implementing the same component specifications as `@lumen/ui`.
  Proof-of-concept package, currently Button only — see
  `packages/web-components/README.md`.
- `@lumen/angular` — Angular standalone components targeting Angular 20 LTS
  (not the latest major — see the package README for the TypeScript-version
  reason), implementing the same component specifications. Proof-of-concept
  package, currently Button only — see `packages/angular/README.md`,
  including a documented Vitest/JIT testing constraint that shaped an
  implementation choice (classic `@Input()` decorators, not signal
  `input()`) worth reading before adding more components to this package.

`packages/storybook` is the live showcase of `@lumen/tokens`, `@lumen/ui`,
and `@lumen/patterns` — one page per component with controls and
auto-generated usage code, plus MDX pages for the patterns.
`@lumen/web-components` and `@lumen/angular` are not yet covered (see
`docs/roadmap.md` Phase 13).
Run it with `pnpm storybook`. See "Component checklist" below.

A seventh package, `@lumen/create-app` (`packages/create-app`), is private
and never published — it's a CLI scaffolder (`pnpm create:react`) that
generates a React + TypeScript + Vite + Tailwind app under `apps/<name>`,
wired to `@lumen/tokens`/`@lumen/ui`/`@lumen/patterns` via pnpm `workspace:*`
dependencies for developing a product application alongside this design
system in one repository. See `docs/roadmap.md` Phase 14 and the
"Create a React application" section of `README.md`. Generated apps under
`apps/*` are gitignored scaffolds, not part of the design system itself —
don't treat them as a place to add or change `@lumen/*` package source.

## Documentation system

`docs/` implements a governance system that keeps Figma, tokens, components,
Storybook, and releases in sync — read the relevant file(s) before touching
anything they cover, and update them as part of the change, not as
follow-up work. `docs/project-governance.md` §14 is the canonical Claude Code
operating protocol (authority order when docs conflict, task-based reading
lists, recommend-and-confirm vs. implement-directly); `docs/documentation-
style.md` §31 and `docs/figma-sync.md` §23 point at that same protocol
rather than repeating it. This table is the fast index so you don't have to
open every file to find the right one:

| File | Answers |
|---|---|
| `docs/project-governance.md` | **Start here for how to operate**, not just what's true: the authority order when docs conflict, which files to read for a given task type (§4), and when to recommend-and-confirm vs. implement directly (§5). |
| `docs/changelog.md` | Its `[Unreleased]` section is the scope gate — implement only what's listed there; report anything else as out of scope instead of doing it silently. |
| `docs/figma-source.md` | Which Figma file/node is canonical, and the source-of-truth hierarchy (Figma → tokens → code → Storybook). |
| `docs/figma-sync.md` | Step-by-step procedure for turning an approved Figma delta into a code change. |
| `docs/design-tokens.md` | Token architecture, naming, and layering (primitive → semantic → component). |
| `docs/component-architecture.md` | Component hierarchy, API standards, and state model. |
| `docs/component-specifications.md` | Required specification structure per component. |
| `docs/accessibility.md` | Accessibility requirements per component. |
| `docs/storybook-guidelines.md` | What Storybook must document and how. |
| `docs/development-guidelines.md` | How Lumen must be developed and maintained in code. |
| `docs/quality-checklist.md` | Release gate — run before merging, publishing Storybook, or marking a component Stable. |
| `docs/design-review.md` | How to run a design review. |
| `docs/release-process.md` | How a change moves from Figma to a released package and published Storybook. |
| `docs/github-workflow.md` | How a change moves through GitHub — branches, PRs, required gates. |
| `docs/roadmap.md` | Where the system is headed; check before proposing new scope. |
| `docs/documentation-style.md` | Writing, structure, and terminology rules — follow it whenever you edit any doc in this table. |
| `docs/versioning-and-releases.md` | Concrete Changesets commands and this repo's actual (no-publish, git-dependency) release mechanics — the implementation detail underneath `release-process.md`'s process. |

Minimum required behavior when synchronizing a Figma change:

1. Read `docs/changelog.md`'s `[Unreleased]` section — that's the authorized
   scope, not a suggestion.
2. Audit first: inspect the named Figma nodes and existing token/component
   source, identify downstream consumers, and report the impact **before**
   changing anything.
3. After the scope is confirmed, implement only the approved delta —
   affected tokens, components, stories, tests, and docs. Don't regenerate
   or restyle anything outside that delta.
4. Update the sync record/changelog and report remaining drift.

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
3. **Match the Figma component taxonomy when one exists.** The current
   tokens-source Figma file has no linked component library, so
   `@lumen/ui`/`@lumen/patterns` are a generic rebuild, not matched 1:1
   against Figma component nodes — see `docs/figma-sync.md`. If a
   component-bearing Figma file is added back, reconcile naming/variants
   against it and keep new components named consistently so Code Connect
   mapping stays possible.
4. **Every new/changed component ships with:** a TypeScript-typed props
   interface, semantic-token-only styling, keyboard + screen-reader support
   (see `docs/accessibility.md`), a colocated Storybook story
   (`Component.stories.tsx`, `tags: ["autodocs"]`), and a Changeset
   (`pnpm changeset`).
5. **Don't publish silently.** Version bumps happen through the Changesets
   flow, not by hand-editing `package.json` versions. `docs/release-process.md`
   is the authoritative release process (gates, roles, channels); `docs/
   versioning-and-releases.md` has this repo's actual commands and mechanics.

## Working with Figma

Start with `docs/figma-source.md` (canonical file/node and authority order),
then `docs/figma-sync.md` (the sync procedure itself). Known gaps between
the current Figma file and this repo (dark-theme semantic colors, no
shadow/elevation scale, icon set sourced from an unrelated older library, no
linked component library) are tracked in `docs/figma-sync.md` — read it
before closing any of them.

## Repo map

```
packages/tokens/         design tokens (source of truth: src/*.json)
packages/ui/             React components (primitives, composite, layout) + colocated *.stories.tsx
packages/patterns/       composed enterprise screen patterns + colocated *.stories.tsx / *.mdx
packages/web-components/ Lit custom elements — proof of concept, Button only
packages/angular/        Angular standalone components — proof of concept, Button only
packages/storybook/      the showcase app — Storybook config only, no component source, React only
docs/               governance system: figma sync, tokens, components,
                    accessibility, Storybook, release process, doc style —
                    see "Documentation system" above for the full index
.changeset/         pending version bumps
```
