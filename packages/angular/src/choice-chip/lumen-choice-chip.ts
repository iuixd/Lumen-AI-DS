import { Component, ChangeDetectionStrategy, Input, booleanAttribute } from "@angular/core";

/**
 * `<lumen-choice-chip>` — Angular standalone implementation of `ChoiceChip`
 * (packages/ui/src/primitives/ChoiceChip.tsx), sourced from the Figma
 * Buttons page (Lumen-DS-2027, node 581:485). A toggleable pill for a
 * single-value choice: unselected shows plain text, selected fills solid
 * brand and gains a leading check icon. Only the `lg` size (36px) is
 * specced. Uses `aria-disabled` rather than the native `disabled`
 * attribute, matching `<lumen-button>`.
 */
@Component({
  selector: "lumen-choice-chip",
  standalone: true,
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
      @if (selected) {
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 12l5 5L20 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      }
      <ng-content></ng-content>
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
      padding: 0 var(--spacing-12);
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
      color: var(--color-brand-default);
    }
    :host(:not([selected])) button:not([aria-disabled="true"]):hover {
      border-color: var(--color-brand-subtle);
      background-color: var(--color-brand-subtle);
    }

    :host([selected]) button:not([aria-disabled="true"]) {
      border-color: var(--color-brand-default);
      background-color: var(--color-brand-default);
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
export class LumenChoiceChipComponent {
  @Input({ transform: booleanAttribute }) selected = false;
  @Input({ transform: booleanAttribute }) disabled = false;

  handleClick(event: MouseEvent): void {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
