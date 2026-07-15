# @lumen/angular

Angular (standalone components) implementation of Lumen's component
specifications. This is Lumen's second non-React framework package — see
`docs/roadmap.md` Phase 13 — following `@lumen/web-components`. It ships
`LumenButtonComponent`, `LumenSplitButtonComponent`,
`LumenFilterChipComponent`, `LumenChoiceChipComponent`, and
`LumenAIButtonComponent`, matching `@lumen/ui`'s 2026-07-14 Figma sync (see
`docs/changelog.md` `[Unreleased]`).

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
  template: `
    <lumen-button variant="primary" size="md">Save changes</lumen-button>
  `
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

Same properties as `@lumen/web-components`' `<lumen-button>`, plus `status`
(`success | warning | error`, optional), added 2026-07-14 to mirror
`Button.tsx`'s later addition — a tinted override independent of `variant`,
status-colored border only on `secondary`, not re-verified for `outline`.
`variant` gained `outline` 2026-07-16, alongside a fix to `secondary` (it
previously rendered transparent at rest) — see `Button.tsx`'s doc comment
for the full Figma citation; both packages fixed identically.

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

Mirrors `AIButton.tsx`. `variant` (`primary | secondary | tertiary |
outline`, default `primary`; `secondary`/`outline` do not reuse
`LumenButtonComponent`'s own colors for those names), `size` (`xs | sm | md
| lg`, default `md`; Figma's `xs` AI Button is 28px tall vs. this package's
32px `xs`, not matched exactly), `iconOnly`, `loading`, `disabled`,
`destructive` (behavioral only — sets `data-destructive` on the inner
button, no color change). A leading icon is always rendered; override via
the `[icon]` `TemplateRef` input (same pattern as `LumenFilterChipComponent`).
`status` (Success/Warning/Error) is not implemented, matching the React and
Web Components components' own open item.

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
property *after* an initial `fixture.detectChanges()` and then calling
`detectChanges()` again threw `NG0100: ExpressionChangedAfterItHasBeenCheckedError`
under zoneless `TestBed`, even though the mutate-then-redetect pattern is
completely standard in zone-based Angular tests. The reliable fix used here:
set all desired input state on the host **before** the first (and only)
`detectChanges()` call per test, rather than mutating and re-detecting.

## Storybook

Not yet covered — same open decision as `@lumen/web-components`; see
`docs/roadmap.md` Phase 13.
