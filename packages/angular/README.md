# @lumen/angular

Angular (standalone components) implementation of Lumen's component
specifications. This is Lumen's second non-React framework package — see
`docs/roadmap.md` Phase 13 — following `@lumen/web-components`, and ships
the same 9 components that package does: `LumenButtonComponent`,
`LumenSplitButtonComponent`, `LumenFilterChipComponent`,
`LumenChoiceChipComponent`, `LumenAIButtonComponent`,
`LumenSegmentedControlComponent` (+ `LumenSegmentedControlOptionComponent`),
`LumenKPICardComponent`, `LumenFooterComponent`, and
`LumenThemeToggleComponent` — see `docs/component-architecture.md` §13 for
the full Figma/React/Web-Components/Angular mapping.

**Known drift, unreconciled**: `@lumen/ui`'s `Button` was later rewritten on
a shadcn-sourced base with a different variant/size contract — see "Why
`LumenButtonComponent` doesn't match React's `Button` right now" below.

## Angular version

Targets **Angular 20 (the current LTS)**, not the latest Angular major (22
at time of writing). Angular 22's `@angular/compiler-cli` requires
TypeScript `>=6.0 <6.1`, which conflicts with the TypeScript version
(`^5.5.4`, currently resolved to `5.9.3`) used across the rest of this
monorepo. Angular 20 requires `typescript >=5.8 <6.0`, which the repo's
existing resolved TypeScript version already satisfies — no isolated
second TypeScript install needed. Revisit this pin once the rest of the
monorepo moves to TypeScript 6.

## Usage

```ts
import { LumenButtonComponent } from "@lumen/angular";

@Component({
  standalone: true,
  imports: [LumenButtonComponent],
  template: ` <lumen-button variant="primary">Save changes</lumen-button> `
})
export class MyComponent {}
```

```css
@import "@lumen/tokens/css";
```

Icon content uses Angular's native content-projection selectors, not React's
`iconStart`/`iconEnd` node props or Web Components' named `<slot>`s:

```html
<lumen-button>
  <span iconStart>…</span>
  Save changes
  <span iconEnd>…</span>
</lumen-button>
```

## Property contract

### `LumenButtonComponent` (`<lumen-button>`)

Final Figma node `1027:3733` contract, as of 2026-07-20: `variant` is
`primary | accent | secondary | outline | ghost | destructive` (default
`primary`) and `size` is `sm | md | lg | xl` (30px, 34px, 38px, and 42px;
default `md`). `disabled` is boolean (default `false`). Leading and
trailing icons use the `[iconStart]` and `[iconEnd]` projection selectors.
The standard Button has no status, pill, icon-only, or loading inputs.

**Why this doesn't match React's `Button` right now**: `@lumen/ui`'s
`Button` was rewritten after 2026-07-20 on a shadcn-sourced base
(`docs/shadcn-integration.md`) — new variant names
(`default|destructive|outline|secondary|ghost|link|neutral`, no
`primary`/`accent`), a new size scale (`default|sm|lg|icon`, not
`sm|md|lg|xl`), no `iconStart`/`iconEnd` inputs (icons pass as projected
content directly), and native `disabled` instead of `aria-disabled`.
`LumenButtonComponent` here still implements the contract described above,
not React's current one. Tracked in `docs/roadmap.md` Phase 13 as an open
deliverable, not yet migrated.

### `LumenSplitButtonComponent` (`<lumen-split-button>`)

Mirrors `SplitButton.tsx`. `variant` (`primary | raised | secondary |
outline`, default `primary`), `size` (`sm | md | lg`, default `lg`), `pill`,
`loading`, `disabled`, `dropdownLabel` (default `"More options"`, warns in
the console if left at that default). Renders two real `<button>`s, so it
exposes `(mainClick)`/`(dropdownClick)` outputs instead of a single
ambiguous `(click)`. Leading icon uses content projection (`<span
iconStart>`).

**Known limitation**: Figma's `sm` dropdown-toggle segment is a non-square
30px width, which isn't on the approved spacing scale
(`docs/design-tokens.md` §4) — shipped as a square 36px segment instead,
same simplification as the React and Web Components versions.

### `LumenFilterChipComponent` / `LumenChoiceChipComponent`

Toggleable pills. `selected`/`disabled` map directly to `aria-pressed`/
`aria-disabled` (not the native `disabled` attribute). Only the `lg` size
(36px) is specced for either.

`LumenFilterChipComponent` accepts `TemplateRef` inputs (`[icon]`/
`[removeIcon]`) to override its default plus/remove glyphs — not content
projection with fallback content, since Angular's `<ng-content>` has no
fallback mechanism the way a native `<slot>` does (see the component's doc
comment). `LumenChoiceChipComponent` has no icon override — it shows no
icon by default and a fixed check icon only when `selected`, matching
`ChoiceChip.tsx` exactly.

### `LumenAIButtonComponent` (`<lumen-ai-button>`)

Mirrors the canonical One AI Button visual contract. `variant` (`primary |
secondary | ghost | outline | destructive`, default `primary`) and `size`
(`sm | md | lg | xl`, default `md`, exact 30/34/38/42px scale), plus
`iconOnly`, `loading`, and `disabled`. A leading icon is always rendered; override via
the `[icon]` `TemplateRef` input (same pattern as `LumenFilterChipComponent`).
The React-only capability lookup and split composition are documented in
`docs/component-specifications.md` §46.

### `LumenSegmentedControlComponent` / `LumenSegmentedControlOptionComponent`

Mirrors `SegmentedControl.tsx`/`SegmentedControlOption` — see
`docs/component-specifications.md` §59. A single-choice, tab-like control
(`role="radiogroup"`/`role="radio"`), distinct from a group of joined
`LumenButtonComponent`s.

`LumenSegmentedControlComponent`: `value` (string, default `""`), `size`
(`sm | md | lg`, default `md`), `disabled` (boolean, default `false`),
`ariaLabel` (bound from an `aria-label` attribute — required, since the
control has no visible label of its own), and a `(valueChange)` output.

`LumenSegmentedControlOptionComponent`: `value` (string, required) and
`disabled` (boolean, default `false`). Its `size` and `selected` state are
read live from the injected parent rather than pushed down as separate
`@Input()`s — the parent's own change-detection fan-out already covers
both, avoiding a second, redundant input path (see the component's own doc
comment).

### `LumenKPICardComponent`

Mirrors `KPICard.tsx`. `label` (string), `value` (string), `delta`
(optional string, e.g. `"+12%"`), `deltaTone` (`success | warning | error`,
default `success`).

### `LumenFooterComponent`

Mirrors `Footer.tsx`. `version` (optional string), `statusLabel` (optional
string), `statusTone` (`success | warning | error`, default `success`).

### `LumenThemeToggleComponent`

Mirrors `ThemeToggle.tsx`. `checked` (boolean, default `false` — reflects
the current theme, checked = dark) and `disabled` (boolean, default
`false`), plus a `(checkedChange)` output. Toggling does **not** set
`data-theme` itself — the host application must subscribe to
`(checkedChange)` and apply it (see `packages/tokens/README.md`'s theming
section). `aria-label` is read directly off the host element (same pattern
`LumenButtonComponent` uses) rather than a separate `@Input()`, so a plain
`aria-label="…"` attribute on the host works without a binding.

## Why classic `@Input()` decorators, not signal `input()`

This package uses `@Input()`/`OnChanges`, not Angular's newer signal-based
`input()`/`output()` functions — a testing-driven constraint, not a style
preference. Angular's JIT compiler (what `TestBed` uses for components that
aren't pre-compiled via `ngtsc`/AOT) needs a dedicated compiler AST
transform (`getInitializerApiJitTransform`) to recognize signal-based
`input()`/`output()` fields as component inputs. That transform only runs
inside a real TypeScript-compiler pipeline (`tsc`, `ts-jest`, `ngtsc`) — not
esbuild, which is what Vitest uses to transform TypeScript. Under plain
Vitest, a signal-input component fails at runtime with `NG0303: Can't set
value of the '...' input`, and any host template binding to it fails with
`Can't bind to '...' since it isn't a known property` — because Angular's
JIT compiler never learns the field is an input at all (see
[angular/angular#54013](https://github.com/angular/angular/issues/54013)).

Classic `@Input()` decorators don't have this problem — JIT reflects on the
decorator directly, no special transform required. The alternative fix
(`@analogjs/vite-plugin-angular`, which runs Angular's real compiler inside
Vite) requires `@angular/build`/`@angular-devkit/build-angular` as a peer
dependency — full Angular CLI build tooling — which would make this
package's tooling meaningfully heavier than `@lumen/ui` and
`@lumen/web-components`. Decorator-based inputs avoid that tradeoff
entirely for a one-component proof of concept. Revisit if/when this package
grows enough to justify the heavier toolchain, or if `getInitializerApiJitTransform`
becomes available as a standalone package.

## Change detection

Built and tested against `provideZonelessChangeDetection()` — no `zone.js`
dependency. `@Input()`-based components work identically under zoneless and
zone-based apps; consuming applications choose either.

## Testing

`pnpm --filter @lumen/angular test` runs Vitest + `TestBed` (JIT, zoneless)
against jsdom. Like the Web Components package, tests assert DOM structure,
reflected host attributes, and accessibility behavior rather than computed
CSS values — jsdom can't meaningfully resolve styles derived from CSS
custom properties, and those tokens aren't loaded in the test environment.

One real gotcha worth documenting: mutating a test host component's plain
property _after_ an initial `fixture.detectChanges()` and then calling
`detectChanges()` again threw `NG0100: ExpressionChangedAfterItHasBeenCheckedError`
under zoneless `TestBed`, even though the mutate-then-redetect pattern is
completely standard in zone-based Angular tests. The reliable fix used here:
set all desired input state on the host **before** the first (and only)
`detectChanges()` call per test, rather than mutating and re-detecting.

## Storybook

Not yet covered — same open decision as `@lumen/web-components`; see
`docs/roadmap.md` Phase 13.
