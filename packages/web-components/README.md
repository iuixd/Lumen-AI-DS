# @lumen/web-components

Web Components implementation of Lumen's component specifications, built with
[Lit](https://lit.dev). Started as the Phase 13 (`docs/roadmap.md`) proof of
concept validating that the framework-agnostic contract in
`docs/component-specifications.md` can be implemented outside React, and has
since grown into a real 9-component package: `<lumen-button>`,
`<lumen-split-button>`, `<lumen-filter-chip>`, `<lumen-choice-chip>`,
`<lumen-ai-button>`, `<lumen-segmented-control>` (+
`<lumen-segmented-control-option>`), `<lumen-kpi-card>`, `<lumen-footer>`,
and `<lumen-theme-toggle>` — see `docs/component-architecture.md` §13 for
the full Figma/React/Web-Components/Angular mapping.

**Known drift, unreconciled**: `@lumen/ui`'s `Button` was later rewritten on
a shadcn-sourced base with a different variant/size contract (see
"History" below) — `<lumen-button>` here still implements the earlier,
reconciled-as-of-2026-07-20 contract documented in the property table below,
not React's current one. Don't assume the two match without checking
`packages/ui/src/components/internal/button.tsx` directly.

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

<lumen-button variant="primary">Save changes</lumen-button>
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

| Property (attribute) | Type                                                                | Default   | Notes                                                   |
| -------------------- | ------------------------------------------------------------------- | --------- | ------------------------------------------------------- |
| `variant`            | `primary \| accent \| secondary \| outline \| ghost \| destructive \| neutral-solid` | `primary` | Final Figma collection; use semantic links for navigation. `neutral-solid` added 2026-08-04 (Figma `Style=Neutral Solid`) — this package has no plain `neutral` (outline-style) variant, a documented asymmetry, see `docs/figma-sync.md`'s Button row. |
| `size`               | `sm \| md \| lg \| xl`                                              | `md`      | 30px, 34px, 38px, and 42px from Figma node `1034:4459`. |
| `disabled`           | boolean                                                             | `false`   |                                                         |

`disabled` sets `aria-disabled` and prevents the click from reaching
listeners, matching `@lumen/ui`'s `Button` — native `disabled` is
intentionally not used, for the same keyboard-reachability reason documented
on the React component.

### `<lumen-split-button>`

Mirrors `SplitButton.tsx` (`packages/ui/src/composite/SplitButton.tsx`).
Renders two real `<button>`s in its shadow root, so a plain `click` event
can't distinguish which one fired once retargeted at the host — it
dispatches `lumen-main-click` and `lumen-dropdown-click` custom events
instead (`event.detail` carries the original `MouseEvent`).

| Property (attribute) | Type                                        | Default          | Notes                                                                                         |
| -------------------- | ------------------------------------------- | ---------------- | --------------------------------------------------------------------------------------------- |
| `variant`            | `primary \| raised \| secondary \| outline` | `primary`        |                                                                                               |
| `size`               | `sm \| md \| lg`                            | `lg`             |                                                                                               |
| `pill`               | boolean                                     | `false`          |                                                                                               |
| `loading`            | boolean                                     | `false`          | Disables only the main segment; the dropdown stays interactive.                               |
| `disabled`           | boolean                                     | `false`          | Disables both segments.                                                                       |
| `dropdown-label`     | string                                      | `"More options"` | Accessible name for the dropdown-toggle segment. Warns in the console if left at the default. |

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

| Property (attribute) | Type    | Default | Notes                                                                                        |
| -------------------- | ------- | ------- | -------------------------------------------------------------------------------------------- |
| `selected`           | boolean | `false` | Reflected as `aria-pressed`.                                                                 |
| `disabled`           | boolean | `false` | Reflected as `aria-disabled` (not the native attribute), same reasoning as `<lumen-button>`. |

`<lumen-filter-chip>` renders a leading icon slot (`<span slot="icon">`,
default: a plus glyph) that's kept even when `selected`, plus a trailing
`<span slot="remove-icon">` (default: an X glyph) shown only when
`selected` — see `FilterChip.tsx`'s doc comment for why the leading icon
persists. `<lumen-choice-chip>` shows no icon by default and a leading
check icon only when `selected`.

### `<lumen-ai-button>`

Mirrors `AIButton.tsx` (`packages/ui/src/primitives/AIButton.tsx`).

| Property (attribute) | Type                                          | Default   | Notes                                                                                                                                 |
| -------------------- | --------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `variant`            | `primary \| secondary \| ghost \| outline \| destructive` | `primary` | Canonical One AI Button treatments from node `760:1965`. |
| `size`               | `sm \| md \| lg \| xl`                        | `md`      | Exact 30/34/38/42px Figma size scale. |
| `icon-only`          | boolean                                       | `false`   | Requires `aria-label` or `aria-labelledby`.                                                                                           |
| `loading`            | boolean                                       | `false`   |                                                                                                                                       |
| `disabled`           | boolean                                       | `false`   |                                                                                                                                       |

A leading icon is always rendered — default slot content (`<span
slot="icon">`) is a sparkle glyph; override it for capability-specific
icons (Figma swaps the glyph per action, e.g. a wand for Rewrite).
The React-only capability lookup and split composition are documented in
`docs/component-specifications.md` §46.

### `<lumen-segmented-control>` / `<lumen-segmented-control-option>`

Mirrors `SegmentedControl.tsx`/`SegmentedControlOption`
(`packages/ui/src/primitives/SegmentedControl.tsx`) — see
`docs/component-specifications.md` §59. A single-choice, tab-like control
(`role="radiogroup"`/`role="radio"`), distinct from a group of joined
`<lumen-button>`s.

| Element | Property (attribute) | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `<lumen-segmented-control>` | `value` | string | `""` | Currently-selected option's value. |
| | `size` | `sm \| md \| lg` | `md` | 28/36/48px. |
| | `disabled` | boolean | `false` | Disables every option. |
| `<lumen-segmented-control-option>` | `value` | string | `""` | Required — matched against the parent's `value`. |
| | `size` | `sm \| md \| lg` | `md` | Should match the parent's `size`. |
| | `selected` | boolean | `false` | Reflects whether this option is the active one. |
| | `disabled` | boolean | `false` | Disables just this option. |

### `<lumen-kpi-card>`

Mirrors `KPICard.tsx` (`packages/ui/src/primitives/KPICard.tsx`).

| Property (attribute) | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | string | `""` | The metric's name. |
| `value` | string | `""` | The metric's current value, preformatted (e.g. `"$42.1k"`). |
| `delta` | string | `undefined` | Optional preformatted change indicator (e.g. `"+12%"`). |
| `delta-tone` | `success \| warning \| error` (property `deltaTone`) | `"success"` | Color of the delta text. |

### `<lumen-footer>`

Mirrors `Footer.tsx` (`packages/ui/src/layout/Footer.tsx`).

| Property (attribute) | Type | Default | Notes |
| --- | --- | --- | --- |
| `version` | string | `undefined` | Optional version/build label. |
| `status-label` | string | `undefined` | Optional status text (e.g. `"All systems operational"`). |
| `status-tone` | `success \| warning \| error` | `"success"` | Color of the status indicator dot/text. |

### `<lumen-theme-toggle>`

Mirrors `ThemeToggle.tsx` (`packages/ui/src/primitives/ThemeToggle.tsx`).

| Property (attribute) | Type | Default | Notes |
| --- | --- | --- | --- |
| `checked` | boolean | `false` | Reflects the current theme (checked = dark). Toggling fires a bubbling `lumen-change` `CustomEvent<{ checked: boolean }>` but does **not** set `data-theme` itself — the host page must listen for that event and apply it (see `packages/tokens/README.md`'s theming section). |
| `aria-label` | string \| null | `null` | Overrides the default accessible name. |
| `disabled` | boolean | `false` | |

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
for the full record. The older API described in that history was subsequently
superseded by final Figma node `1027:3733`; React, Web Components, and Angular
implemented the same final contract as of 2026-07-20.

**This is no longer fully true.** `@lumen/ui`'s `Button` was rewritten again
after that reconciliation, on a shadcn-sourced base (`docs/shadcn-
integration.md`) — new variant names (`default|destructive|outline|
secondary|ghost|link|neutral|neutral-solid`, no `primary`/`accent`), a new size scale
(`default|sm|lg|icon`, not `sm|md|lg|xl`), no `iconStart`/`iconEnd` props,
native `disabled` instead of `aria-disabled`. `<lumen-button>` here still
implements the 2026-07-20 contract described in the property table above —
it has not been migrated to match React's current one. Tracked in
`docs/roadmap.md` Phase 13 as an open deliverable; not yet scheduled.

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
