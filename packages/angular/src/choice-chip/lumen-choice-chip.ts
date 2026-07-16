import { Component, ChangeDetectionStrategy, Input, TemplateRef, booleanAttribute } from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";

/**
 * `<lumen-choice-chip>` — Angular standalone implementation of `ChoiceChip`
 * (packages/ui/src/primitives/ChoiceChip.tsx), sourced from the Figma
 * Buttons page (Lumen-AI-Design-System, node 581:485). A toggleable pill for a
 * single-value choice: unselected shows plain text, selected fills solid
 * brand and gains a leading check icon. Only the `lg` size (36px) is
 * specced. Uses `aria-disabled` rather than the native `disabled`
 * attribute, matching `<lumen-button>`.
 *
 * `tone` and `icon` were added for the "AI ButtonGroup Component Library"
 * Toggle Group pattern (node 969:5151) — see the React component's doc
 * comment for why this element was reused rather than a new one built.
 * `tone="solid"` (default) is unchanged, check icon stays leading.
 * `tone="subtle"` reproduces the Toggle Group pill (plain `neutral` chrome
 * unselected, `brand.subtle`/`brand.border-strong`/`brand.default` tinted
 * selected — the same tokens `<lumen-button variant="secondary">` already
 * binds to) with the check icon trailing. `icon` uses a `TemplateRef`
 * input, same as `<lumen-filter-chip>`'s `[icon]` — `<ng-content>` has no
 * fallback-content mechanism, but unlike FilterChip's icon (which has a
 * default), ChoiceChip's `icon` has no fallback and is simply omitted when
 * not provided.
 */
@Component({
  selector: "lumen-choice-chip",
  standalone: true,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[attr.selected]": "selected ? '' : null",
    "[attr.disabled]": "disabled ? '' : null",
    "[attr.tone]": "tone"
  },
  template: `
    <button
      type="button"
      part="button"
      [attr.aria-pressed]="selected ? 'true' : 'false'"
      [attr.aria-disabled]="disabled ? 'true' : null"
      (click)="handleClick($event)"
    >
      @if (tone === "solid" && selected) {
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 12l5 5L20 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      }
      @if (icon) {
        <ng-container [ngTemplateOutlet]="icon"></ng-container>
      }
      <ng-content></ng-content>
      @if (tone === "subtle" && selected) {
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 12l5 5L20 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
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

    :host([tone="subtle"]:not([selected])) button:not([aria-disabled="true"]) {
      border-color: var(--color-neutral-100);
      background-color: var(--color-neutral-white);
      color: var(--color-neutral-500);
    }
    :host([tone="subtle"]:not([selected])) button:not([aria-disabled="true"]):hover {
      border-color: var(--color-neutral-200);
      background-color: var(--color-neutral-50);
    }

    :host([tone="subtle"][selected]) button:not([aria-disabled="true"]) {
      border-color: var(--color-brand-border-strong);
      background-color: var(--color-brand-subtle);
      color: var(--color-brand-default);
    }
    :host([tone="subtle"][selected]) button:not([aria-disabled="true"]):hover {
      border-color: var(--color-brand-default);
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
  @Input() tone: "solid" | "subtle" = "solid";
  @Input() icon?: TemplateRef<unknown>;

  handleClick(event: MouseEvent): void {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
