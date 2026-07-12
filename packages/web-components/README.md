# @lumen/web-components

Web Components implementation of Lumen's component specifications, built with
[Lit](https://lit.dev). This is the Phase 13 (`docs/roadmap.md`) proof of
concept validating that the framework-agnostic contract in
`docs/component-specifications.md` can be implemented outside React — it
currently ships **Button only**.

## Why Web Components first

Custom elements are natively consumable from Angular and Vue (and plain
HTML/JS), so this package doubles as groundwork for those future framework
packages rather than a one-off. See `docs/component-architecture.md` §0 for
the full layer diagram.

## Usage

```html
<script type="module">
  import "@lumen/web-components";
</script>
<link rel="stylesheet" href="@lumen/tokens/css" />

<lumen-button variant="primary" size="md">Save changes</lumen-button>
```

Importing the package root registers every custom element it exports as a
side effect (`sideEffects: true` in `package.json`) — there is currently
only one, `<lumen-button>`. A per-component subpath export (e.g.
`@lumen/web-components/button`) can be added once there's more than one
component to make that worth doing.

Icon slots use named `<slot>`s instead of React's `iconStart`/`iconEnd` node
props:

```html
<lumen-button>
  <span slot="icon-start">…</span>
  Save changes
  <span slot="icon-end">…</span>
</lumen-button>
```

`<lumen-button>` requires `@lumen/tokens/css` to be loaded on the page —
its styles reference the same `--color-*`/`--spacing-*`/`--radius-*` custom
properties as `@lumen/ui`, not a duplicated value set. CSS custom properties
inherit through the shadow DOM boundary, so no extra wiring is needed.

## Property contract

| Property (attribute) | Type | Default | Notes |
|---|---|---|---|
| `variant` | `primary \| raised \| secondary \| tertiary \| link` | `primary` | |
| `size` | `xs \| sm \| md \| lg` | `md` | |
| `icon-only` | boolean | `false` | Requires `aria-label` or `aria-labelledby`; warns in the console otherwise. |
| `pill` | boolean | `false` | |
| `loading` | boolean | `false` | React's equivalent is named `isLoading` — this package drops the `is-` prefix per `docs/component-architecture.md` §5.1's own naming guidance, which the React package doesn't currently follow either. |
| `disabled` | boolean | `false` | |

Both `loading` and `disabled` set `aria-disabled`/prevent the click from
reaching listeners, matching `@lumen/ui`'s `Button` — native `disabled` is
intentionally not used, for the same keyboard-reachability reason documented
on the React component.

## Known discrepancy with `docs/component-specifications.md`

Building this surfaced that §5 (Button) of `docs/component-specifications.md`
— including the "Property contract" section added when the docs were
decoupled from React — does not match what `@lumen/ui`'s `Button.tsx` (the
actual shipped, Figma-sourced implementation) does:

- Docs list variants `primary | secondary | tertiary | ghost | link | danger | ai`.
  The real component ships `primary | raised | secondary | tertiary | link`
  (no `ghost`, `danger`, or `ai`; has `raised` instead).
- Docs list a `fullWidth` property. The real component has no such prop.
- Docs name icon props `leadingIcon`/`trailingIcon`. The real component names
  them `iconStart`/`iconEnd`, and also has undocumented `iconOnly` and `pill`
  modifiers.

This package matches the **real React implementation**, not the docs, since
a Web Components Button that matched neither would defeat the point of a
cross-framework consistency check. The docs need a separate reconciliation
pass against `Button.tsx`, `Button.stories.tsx`, and `Button.test.tsx` — not
done here, since that's a documentation-accuracy fix independent of adding
Angular/Vue/Web Components support and deserves its own scoped change.

## Testing

`pnpm --filter @lumen/web-components test` runs Vitest against jsdom. Tests
assert DOM structure, reflected host attributes, and accessibility behavior
(the actual testable contract) rather than computed CSS values — jsdom
doesn't meaningfully resolve styles derived from CSS custom properties, and
those custom properties aren't loaded in the test environment regardless.

## Storybook

Not yet covered. `docs/roadmap.md` Phase 13 leaves the multi-framework
Storybook strategy (separate instance per framework package vs. one
canonical live-example framework) as an open decision; adding coverage for
one proof-of-concept component would prejudge that decision.
