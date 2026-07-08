# Contributing

## Before adding a new component

1. Search `packages/ui/src/{primitives,composite,layout}` and
   `packages/patterns/src` — extend an existing component with a variant or
   prop before adding a new one.
2. Confirm it maps to something in the Figma library (`docs/figma-sync.md`).
   If it's net-new in Figma too, get design sign-off before coding it.
3. Open an issue or discussion describing the API you're proposing
   (props, variants) before implementing, for anything non-trivial.

## Component checklist

- [ ] Named to match its Figma component set (see `docs/figma-sync.md`)
- [ ] Styled only with semantic tokens / `@lumen/tokens` Tailwind classes —
      no hardcoded hex, px, or arbitrary shadow values
- [ ] TypeScript props interface exported alongside the component
- [ ] Keyboard-operable; focus-visible states use `--color-border-focus`
- [ ] Passes the accessibility baseline in `docs/accessibility.md`
- [ ] Exported from the package's `src/index.ts`
- [ ] Added to the relevant `docs/` page if it introduces a new pattern
- [ ] Unit test covering its variants and key interaction states
      (colocated as `Component.test.tsx`; see existing tests for the pattern)
- [ ] Changeset added (`pnpm changeset`)

## Local development

```bash
pnpm install
pnpm build        # builds @lumen/tokens, typechecks the rest
pnpm typecheck
pnpm test
pnpm lint
```

## Commit / PR conventions

- One logical change per PR; include the Changeset in the same PR.
- PR description should state: what Figma component/token this maps to (if
  any), and what's a deliberate engineering decision vs. a value pulled
  directly from Figma (see the "Known gaps" pattern used in `docs/figma-sync.md`).
- CI (`.github/workflows/ci.yml`) must pass: build, typecheck, test, lint.

## Reporting a design/code mismatch

If you notice this repo's tokens or components have drifted from the live
Figma file, open an issue tagged `figma-sync` rather than silently patching
values — token changes ripple through every consuming product.
