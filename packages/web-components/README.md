# @lumen/web-components

Web Components implementation of Lumen's component specifications, built with
[Lit](https://lit.dev). This is the Phase 13 (`docs/roadmap.md`) proof of
concept validating that the framework-agnostic contract in
`docs/component-specifications.md` can be implemented outside React — it
ships `<lumen-button>`, `<lumen-split-button>`, `<lumen-filter-chip>`,
`<lumen-choice-chip>`, and `<lumen-ai-button>`, matching `@lumen/ui`'s
2026-07-14 Figma sync (see `docs/changelog.md` `[Unreleased]`).

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
side effect (`sideEffects: true` in `package.json`). A per-component subpath
export (e.g. `@lumen/web-components/button`) can be added if bundle size
ever becomes a concern.

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

### `<lumen-button>`

| Property (attribute) | Type | Default | Notes |
|---|---|---|---|
| `variant` | `primary \| raised \| secondary \| tertiary \| outline \| link` | `primary` | `outline` added 2026-07-16, alongside a fix to `secondary` (it previously rendered `bg-transparent` at rest — Figma re-verification confirmed a filled `brand.subtle` background all along). `outline` shares `secondary`'s border/text colors, differing only in rest/hover fill — see `Button.tsx`'s doc comment for the full citation. |
| `size` | `xs \| sm \| md \| lg` | `md` | |
| `status` | `success \| warning \| error` (optional) | none | Added 2026-07-14, mirrors `Button.tsx`. Tinted override independent of `variant`; status-colored border only on `secondary`, not re-verified for `outline`. |
| `icon-only` | boolean | `false` | Requires `aria-label` or `aria-labelledby`; warns in the console otherwise. |
| `pill` | boolean | `false` | |
| `loading` | boolean | `false` | React's equivalent is named `isLoading` — this package drops the `is-` prefix per `docs/component-architecture.md` §5.1's own naming guidance, which the React package doesn't currently follow either. |
| `disabled` | boolean | `false` | |

Both `loading` and `disabled` set `aria-disabled`/prevent the click from
reaching listeners, matching `@lumen/ui`'s `Button` — native `disabled` is
intentionally not used, for the same keyboard-reachability reason documented
on the React component.

### `<lumen-split-button>`

Mirrors `SplitButton.tsx` (`packages/ui/src/composite/SplitButton.tsx`).
Renders two real `<button>`s in its shadow root, so a plain `click` event
can't distinguish which one fired once retargeted at the host — it
dispatches `lumen-main-click` and `lumen-dropdown-click` custom events
instead (`event.detail` carries the original `MouseEvent`).

| Property (attribute) | Type | Default | Notes |
|---|---|---|---|
| `variant` | `primary \| raised \| secondary \| outline` | `primary` | |
| `size` | `sm \| md \| lg` | `lg` | |
| `pill` | boolean | `false` | |
| `loading` | boolean | `false` | Disables only the main segment; the dropdown stays interactive. |
| `disabled` | boolean | `false` | Disables both segments. |
| `dropdown-label` | string | `"More options"` | Accessible name for the dropdown-toggle segment. Warns in the console if left at the default. |

Leading icon uses `<span slot="icon-start">`, matching `<lumen-button>`'s
slot convention.

**Known limitation**: Figma's `sm` dropdown-toggle segment is a non-square
30px width, which isn't on the approved spacing scale
(`docs/design-tokens.md` §4) — shipped as a square 36px segment instead,
same simplification as the React component.

### `<lumen-filter-chip>` / `<lumen-choice-chip>`

Toggleable pills — Selection primitives with no React-equivalent naming
divergence (`selected`/`disabled` map directly). Only the `lg` size (36px)
is specced for either.

| Property (attribute) | Type | Default | Notes |
|---|---|---|---|
| `selected` | boolean | `false` | Reflected as `aria-pressed`. |
| `disabled` | boolean | `false` | Reflected as `aria-disabled` (not the native attribute), same reasoning as `<lumen-button>`. |

`<lumen-filter-chip>` renders a leading icon slot (`<span slot="icon">`,
default: a plus glyph) that's kept even when `selected`, plus a trailing
`<span slot="remove-icon">` (default: an X glyph) shown only when
`selected` — see `FilterChip.tsx`'s doc comment for why the leading icon
persists. `<lumen-choice-chip>` shows no icon by default and a leading
check icon only when `selected`.

### `<lumen-ai-button>`

Mirrors `AIButton.tsx` (`packages/ui/src/primitives/AIButton.tsx`).

| Property (attribute) | Type | Default | Notes |
|---|---|---|---|
| `variant` | `primary \| secondary \| tertiary \| outline` | `primary` | `secondary` and `outline` do not reuse `<lumen-button>`'s own colors for those names — see `AIButton.tsx`'s doc comment. |
| `size` | `xs \| sm \| md \| lg` | `md` | Figma's `xs` AI Button is 28px tall vs. this package's 32px `xs` — not matched exactly, same known limitation as the React component. |
| `icon-only` | boolean | `false` | Requires `aria-label` or `aria-labelledby`. |
| `loading` | boolean | `false` | |
| `disabled` | boolean | `false` | |
| `destructive` | boolean | `false` | Behavioral only — sets `data-destructive` on the inner button for hook-in; Figma specs no distinct color for it. |

A leading icon is always rendered — default slot content (`<span
slot="icon">`) is a sparkle glyph; override it for capability-specific
icons (Figma swaps the glyph per action, e.g. a wand for Rewrite).
`status` (Success/Warning/Error) is not implemented, matching the React
component's own open item.

## History: the spec discrepancy this package surfaced

Building this package originally surfaced that §5 (Button) of
`docs/component-specifications.md` — including the "Property contract"
section added when the docs were decoupled from React — didn't match what
`@lumen/ui`'s `Button.tsx` (the actual shipped, Figma-sourced
implementation) does: wrong variant names (`ghost`/`danger`/`ai` instead of
`raised`), an invented `fullWidth` property, and `leadingIcon`/`trailingIcon`
instead of the real `iconStart`/`iconEnd`. This package was built to match
the real React implementation, not the inaccurate docs.

That discrepancy has since been reconciled — `docs/component-specifications.md`
§5 and `docs/component-architecture.md` §7 now match `Button.tsx`, and by
extension match this package too. See `docs/roadmap.md` Phase 13 Findings
for the full record. Kept here as history, not a live issue.

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
