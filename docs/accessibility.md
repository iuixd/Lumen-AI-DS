# Accessibility Guidelines

Every component in `@lumen/ui` is built to meet WCAG 2.1 AA by default so
individual product teams don't have to re-derive accessible markup per
screen.

## Baseline requirements for every component

- **Keyboard**: every interactive element is reachable and operable via
  keyboard alone (Tab/Shift+Tab, Enter/Space, Arrow keys where a native
  pattern implies them — e.g. radio groups).
- **Focus visibility**: focus rings use `--color-border-focus` and must never
  be suppressed with `outline: none` without a replacement indicator.
- **Color contrast**: text/background pairs must hit 4.5:1 (body text) or
  3:1 (large text, 18px+/bold 14px+). The `text-title` / `text-body` /
  `text-muted` semantic tokens are pre-checked against `background-default`
  and `background-subtle` in both themes — don't override with arbitrary
  colors.
- **Semantics over styling**: use native `<button>`, `<a>`, `<input>`,
  `<select>` elements (as every primitive here does) instead of styled
  `<div>`s with click handlers.
- **Labels**: every form control has a associated `<label htmlFor>` (see
  `FormField`, `Checkbox`, `Radio`, `Switch`) — never a placeholder-only
  input.
- **Status communication**: don't rely on color alone. Badges, form errors,
  and toasts pair color with an icon or text, not color alone.
- **Motion**: respect `prefers-reduced-motion`; the `Button` loading spinner
  and any future transition/animation must degrade to an instant state
  change when reduced motion is requested.

## Component-specific notes

- `Modal` sets `role="dialog"` and `aria-modal="true"` and closes on Escape.
  If your use case requires strict focus trapping (returning focus to the
  trigger element, trapping Tab inside the dialog), swap in Radix Dialog —
  keep the same `ModalProps` contract so call sites don't change.
- `Tabs` uses `role="tablist"`/`role="tab"`/`role="tabpanel"` with
  `aria-selected`; extend it with roving `tabindex` and arrow-key navigation
  before shipping a data-heavy settings surface with many tabs.
- `DataTable` renders a real `<table>` — don't replace it with a div grid,
  which loses row/column semantics for screen readers.

## Testing expectation

New components require, at minimum:
1. A keyboard-only pass (can you complete the interaction without a mouse?).
2. An automated check (axe-core / `eslint-plugin-jsx-a11y`) in CI — see
   `.github/workflows/ci.yml`.
3. A contrast check for any new color pairing against both light and dark
   theme backgrounds.
