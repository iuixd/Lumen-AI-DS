import {
  Component,
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  booleanAttribute
} from "@angular/core";

/**
 * `<lumen-split-button>` — Angular standalone implementation of
 * `SplitButton` (packages/ui/src/composite/SplitButton.tsx), matching its
 * 2026-07-14 expansion: `size` (sm/md/lg, default lg) and the `outline`
 * variant, plus an optional leading icon. Mirrors the Web Components
 * package's `<lumen-split-button>` (packages/web-components/src/split-
 * button/lumen-split-button.ts) — same two-real-`<button>`s structure, same
 * `sm` dropdown-segment known limitation (30px in Figma, shipped as a
 * square 36px).
 *
 * Renders two real `<button>`s, so it exposes two separate `(mainClick)`/
 * `(dropdownClick)` outputs rather than a single ambiguous `(click)`,
 * matching this framework's idiom (`EventEmitter`) rather than the Web
 * Components package's DOM `CustomEvent`s.
 *
 * Icon content uses Angular's native content-projection selector
 * (`<span iconStart>`), matching `<lumen-button>`'s convention.
 */
export type LumenSplitButtonVariant = "primary" | "raised" | "secondary" | "outline";
export type LumenSplitButtonSize = "sm" | "md" | "lg";

@Component({
  selector: "lumen-split-button",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[attr.variant]": "variant",
    "[attr.size]": "size",
    "[attr.pill]": "pill ? '' : null",
    "[attr.disabled]": "disabled ? '' : null"
  },
  template: `
    <div class="container" part="container" [attr.aria-disabled]="disabled ? 'true' : null">
      <button
        type="button"
        class="main"
        part="main"
        [disabled]="disabled || loading"
        [attr.aria-busy]="loading ? 'true' : null"
        (click)="handleMainClick($event)"
      >
        @if (loading) {
          <span class="spinner" aria-hidden="true"></span>
        } @else {
          <ng-content select="[iconStart]"></ng-content>
        }
        <span class="label" [class.sr-only]="loading">
          <ng-content></ng-content>
        </span>
      </button>
      <span class="divider" aria-hidden="true"></span>
      <button
        type="button"
        class="dropdown"
        part="dropdown"
        [disabled]="disabled"
        [attr.aria-label]="dropdownLabel"
        aria-haspopup="menu"
        (click)="handleDropdownClick($event)"
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>
  `,
  styles: `
    :host {
      display: inline-block;
    }

    .container {
      box-sizing: border-box;
      display: inline-flex;
      min-width: var(--spacing-120);
      align-items: stretch;
      overflow: hidden;
      border-radius: var(--radius-lg);
      transition:
        background-color 0.15s ease,
        border-color 0.15s ease;
    }

    .container:has(button:focus-visible) {
      outline: 2px solid var(--color-border-focus);
      outline-offset: 4px;
    }

    :host([disabled]) .container {
      pointer-events: none;
      opacity: 0.6;
    }

    :host([pill]) .container {
      border-radius: var(--radius-full);
    }

    :host([size="sm"]) .container {
      height: var(--spacing-36);
    }
    :host([size="md"]) .container {
      height: var(--spacing-40);
    }
    :host([size="lg"]) .container,
    :host(:not([size])) .container {
      height: var(--spacing-48);
    }

    .main {
      all: unset;
      box-sizing: border-box;
      display: inline-flex;
      flex: 1 0 0;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-8);
      cursor: pointer;
      white-space: nowrap;
    }
    .main:disabled {
      cursor: not-allowed;
    }

    :host([size="sm"]) .main {
      padding: 0 var(--spacing-8) 0 var(--spacing-12);
      font-size: var(--text-button-sm-size);
      line-height: var(--text-button-sm-line-height);
      font-weight: var(--text-button-sm-weight);
    }
    :host([size="md"]) .main {
      padding: 0 var(--spacing-10) 0 var(--spacing-16);
      font-size: var(--text-button-md-size);
      line-height: var(--text-button-md-line-height);
      font-weight: var(--text-button-md-weight);
    }
    :host([size="lg"]) .main,
    :host(:not([size])) .main {
      padding: 0 var(--spacing-12) 0 var(--spacing-20);
      font-size: var(--text-button-lg-size);
      line-height: var(--text-button-lg-line-height);
      font-weight: var(--text-button-lg-weight);
    }

    .divider {
      width: 1px;
      height: 100%;
      flex-shrink: 0;
    }

    .dropdown {
      all: unset;
      box-sizing: border-box;
      display: inline-flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .dropdown:disabled {
      cursor: not-allowed;
    }
    :host([size="sm"]) .dropdown {
      width: var(--spacing-36);
    }
    :host([size="md"]) .dropdown {
      width: var(--spacing-40);
    }
    :host([size="lg"]) .dropdown,
    :host(:not([size])) .dropdown {
      width: var(--spacing-48);
    }

    :host([variant="primary"]) .container,
    :host(:not([variant])) .container {
      background-color: var(--color-brand-default);
      color: var(--color-neutral-white);
    }
    :host([variant="primary"]) .container:hover,
    :host(:not([variant])) .container:hover {
      background-color: var(--color-brand-hover);
    }
    :host([variant="primary"]) .container:active,
    :host(:not([variant])) .container:active {
      background-color: var(--color-brand-pressed);
    }
    :host([variant="primary"]) .divider,
    :host(:not([variant])) .divider {
      background-color: var(--divider-button-primary);
    }
    :host([disabled][variant="primary"]) .container,
    :host([disabled]:not([variant])) .container {
      background-color: var(--color-neutral-50);
      color: var(--color-neutral-400);
    }

    :host([variant="raised"]) .container {
      background-color: var(--color-brand-default);
      color: var(--color-neutral-white);
      box-shadow: var(--shadow-button-default);
    }
    :host([variant="raised"]) .container:hover {
      background-color: var(--color-brand-hover);
      box-shadow: var(--shadow-button-hover);
    }
    :host([variant="raised"]) .container:active {
      background-color: var(--color-brand-pressed);
      box-shadow: var(--shadow-button-active);
    }
    :host([variant="raised"]) .divider {
      background-color: var(--divider-button-primary);
    }
    :host([disabled][variant="raised"]) .container {
      background-color: var(--color-neutral-50);
      color: var(--color-neutral-400);
      box-shadow: var(--shadow-button-disabled);
    }

    :host([variant="secondary"]) .container {
      border: 1.5px solid var(--color-brand-border);
      background-color: var(--color-neutral-white);
      color: var(--color-brand-default);
    }
    :host([variant="secondary"]) .container:hover {
      border-color: var(--color-brand-default);
      background-color: var(--color-brand-subtle);
    }
    :host([variant="secondary"]) .container:active {
      border-color: var(--color-brand-default);
      background-color: var(--color-brand-subtle-pressed);
    }
    :host([variant="secondary"]) .divider {
      background-color: var(--divider-button-secondary);
    }
    :host([disabled][variant="secondary"]) .container {
      border-color: var(--color-neutral-200);
      background-color: var(--color-neutral-50);
      color: var(--color-neutral-400);
    }

    :host([variant="outline"]) .container {
      border: 1.5px solid var(--color-brand-border-strong);
      background-color: var(--color-neutral-white);
      color: var(--color-brand-default);
    }
    :host([variant="outline"]) .container:hover {
      border-color: var(--color-brand-default);
      background-color: var(--color-brand-subtle);
    }
    :host([variant="outline"]) .container:active {
      border-color: var(--color-brand-default);
      background-color: var(--color-brand-subtle-pressed);
    }
    :host([variant="outline"]) .divider {
      background-color: var(--divider-button-secondary);
    }
    :host([disabled][variant="outline"]) .container {
      border-color: var(--color-neutral-200);
      background-color: var(--color-neutral-50);
      color: var(--color-neutral-400);
    }

    .spinner {
      width: 1em;
      height: 1em;
      border-radius: var(--radius-full);
      border: 2px solid currentColor;
      border-top-color: transparent;
      animation: lumen-split-button-spin 0.6s linear infinite;
    }
    .label.sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    @keyframes lumen-split-button-spin {
      to {
        transform: rotate(360deg);
      }
    }

    svg {
      width: 18px;
      height: 18px;
    }
  `
})
export class LumenSplitButtonComponent implements OnChanges {
  @Input() variant: LumenSplitButtonVariant = "primary";
  @Input() size: LumenSplitButtonSize = "lg";
  @Input({ transform: booleanAttribute }) pill = false;
  @Input({ transform: booleanAttribute }) loading = false;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input() dropdownLabel = "More options";

  @Output() mainClick = new EventEmitter<MouseEvent>();
  @Output() dropdownClick = new EventEmitter<MouseEvent>();

  ngOnChanges(): void {
    if (this.dropdownLabel === "More options") {
      // eslint-disable-next-line no-console
      console.warn(
        'lumen-split-button: pass a specific dropdownLabel — "More options" is a placeholder, not a real accessible name.'
      );
    }
  }

  handleMainClick(event: MouseEvent): void {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.mainClick.emit(event);
  }

  handleDropdownClick(event: MouseEvent): void {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.dropdownClick.emit(event);
  }
}
