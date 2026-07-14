import {
  Component,
  ChangeDetectionStrategy,
  Input,
  TemplateRef,
  booleanAttribute
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";

/**
 * `<lumen-filter-chip>` — Angular standalone implementation of `FilterChip`
 * (packages/ui/src/primitives/FilterChip.tsx), sourced from the Figma
 * Buttons page (Lumen-DS-2027, node 581:409). Mirrors the Web Components
 * package's `<lumen-filter-chip>` — see its doc comment for why the leading
 * icon is kept even when selected. Only the `lg` size (36px) is specced.
 * Uses `aria-disabled` rather than the native `disabled` attribute,
 * matching `<lumen-button>`.
 *
 * Icon overrides use `TemplateRef` inputs (`[icon]`/`[removeIcon]`) rather
 * than content projection with fallback content: `<ng-content>` has no
 * fallback-content mechanism (unlike native `<slot>`, which the Web
 * Components version relies on), so a default-icon-unless-overridden
 * pattern needs `*ngTemplateOutlet` instead.
 */
@Component({
  selector: "lumen-filter-chip",
  standalone: true,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[attr.selected]": "selected ? '' : null",
    "[attr.disabled]": "disabled ? '' : null"
  },
  template: `
    <button
      type="button"
      part="button"
      [attr.aria-pressed]="selected ? 'true' : 'false'"
      [attr.aria-disabled]="disabled ? 'true' : null"
      (click)="handleClick($event)"
    >
      @if (icon) {
        <ng-container [ngTemplateOutlet]="icon"></ng-container>
      } @else {
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      }
      <ng-content></ng-content>
      @if (selected) {
        @if (removeIcon) {
          <ng-container [ngTemplateOutlet]="removeIcon"></ng-container>
        } @else {
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        }
      }
    </button>
  `,
  styles: `
    :host {
      display: inline-block;
    }

    button {
      all: unset;
      box-sizing: border-box;
      display: inline-flex;
      height: var(--spacing-36);
      align-items: center;
      justify-content: center;
      gap: var(--spacing-6);
      cursor: pointer;
      white-space: nowrap;
      border-radius: var(--radius-full);
      border: 1.5px solid transparent;
      font-size: var(--text-button-lg-size);
      line-height: var(--text-button-lg-line-height);
      font-weight: var(--text-button-lg-weight);
      transition:
        background-color 0.15s ease,
        border-color 0.15s ease;
    }

    button:focus-visible {
      outline: 2px solid var(--color-border-focus);
      outline-offset: 4px;
    }

    button[aria-disabled="true"] {
      cursor: not-allowed;
      pointer-events: none;
      border-color: var(--color-neutral-200);
      background-color: var(--color-neutral-50);
      color: var(--color-neutral-400);
    }

    :host(:not([selected])) button:not([aria-disabled="true"]) {
      border-color: var(--color-brand-border-strong);
      background-color: transparent;
      padding: 0 var(--spacing-16) 0 var(--spacing-12);
      color: var(--color-brand-default);
    }
    :host(:not([selected])) button:not([aria-disabled="true"]):hover {
      border-color: var(--color-brand-subtle);
      background-color: var(--color-brand-subtle);
    }

    :host([selected]) button:not([aria-disabled="true"]) {
      border-color: var(--color-brand-default);
      background-color: var(--color-brand-default);
      padding: 0 var(--spacing-12);
      color: var(--color-neutral-white);
    }
    :host([selected]) button:not([aria-disabled="true"]):hover {
      border-color: var(--color-brand-hover);
      background-color: var(--color-brand-hover);
    }

    svg {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }
  `
})
export class LumenFilterChipComponent {
  @Input({ transform: booleanAttribute }) selected = false;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input() icon?: TemplateRef<unknown>;
  @Input() removeIcon?: TemplateRef<unknown>;

  handleClick(event: MouseEvent): void {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
