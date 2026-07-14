import { LitElement, html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

/**
 * `<lumen-filter-chip>` — Web Components implementation of `FilterChip`
 * (`packages/ui/src/primitives/FilterChip.tsx`), sourced from the Figma
 * Buttons page (Lumen-DS-2027, node 581:409). A toggleable pill for
 * adding/removing a filter: unselected shows a leading plus icon (default
 * slot content, overridable), selected fills solid brand and keeps the
 * leading icon while adding a trailing remove icon — see the React
 * component's doc comment for why the leading icon is kept while selected
 * (confirmed via a Figma screenshot, since that reads as unusual).
 *
 * Only the `lg` size (36px) is specced. Uses `aria-disabled` rather than
 * the native `disabled` attribute, matching `<lumen-button>`.
 */
@customElement("lumen-filter-chip")
export class LumenFilterChip extends LitElement {
  static styles = css`
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
  `;

  @property({ type: Boolean, reflect: true })
  selected = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  private _handleClick(event: MouseEvent) {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  render() {
    return html`
      <button
        type="button"
        part="button"
        aria-pressed=${this.selected ? "true" : "false"}
        aria-disabled=${this.disabled ? "true" : nothing}
        @click=${this._handleClick}
      >
        <slot name="icon">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        </slot>
        <slot></slot>
        ${this.selected
          ? html`<slot name="remove-icon">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>
            </slot>`
          : nothing}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lumen-filter-chip": LumenFilterChip;
  }
}
