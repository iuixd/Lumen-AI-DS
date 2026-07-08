## What changed and why

<!-- One or two sentences. Link an issue if there is one. -->

## Figma mapping

<!-- Which Figma component/token set does this map to (see docs/figma-sync.md)?
     If it's net-new in Figma too, confirm design sign-off happened first
     (CONTRIBUTING.md "Before adding a new component"). -->

Maps to:
Deliberate engineering decision vs. value pulled directly from Figma (if any):

## Component checklist

<!-- Required for any new/changed component in packages/ui or packages/patterns.
     Full detail: CONTRIBUTING.md "Component checklist". Delete this section
     for pure token/doc/infra changes. -->

- [ ] Named to match its Figma component set (`docs/figma-sync.md`)
- [ ] Styled only with semantic tokens / `@lumen/tokens` Tailwind classes — no hardcoded hex, px, or arbitrary shadow values
- [ ] TypeScript props interface exported alongside the component
- [ ] Keyboard-operable; focus-visible states use `--color-border-focus`
- [ ] Passes the accessibility baseline in `docs/accessibility.md`
- [ ] Exported from the package's `src/index.ts`
- [ ] Added to the relevant `docs/` page if it introduces a new pattern
- [ ] Changeset added (`pnpm changeset`)

## Verification

<!-- What did you run/check? -->

- [ ] `pnpm build`
- [ ] `pnpm typecheck`
- [ ] `pnpm test`
- [ ] `pnpm lint`
