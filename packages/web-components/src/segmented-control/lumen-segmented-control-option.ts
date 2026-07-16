import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

/**
 * `<lumen-segmented-control-option>` — one segment inside
 * `<lumen-segmented-control>`. See that element's doc comment for sourcing;
 * this element only renders a single segment button and reports clicks/
 * arrow-key navigation up to its parent via bubbling `lumen-segment-select`
 * events — the parent (not this element) owns which segment is selected,
 * same division of responsibility as `<lumen-split-button>`'s two buttons
 * reporting to their host.
 */
@customElement("lumen-segmented-control-option")
export class LumenSegmentedControlOption extends LitElement {
  static styles = css`
    :host {
      display: contents;
    }

    button {
      all: unset;
      box-sizing: border-box;
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-6);
      cursor: pointer;
      white-space: nowrap;
      padding: 0 var(--spacing-16);
      border-radius: var(--radius-lg);
      border: 1px solid transparent;
      font-size: var(--text-button-md-size);
      line-height: var(--text-button-md-line-height);
      font-weight: 600;
      color: var(--color-segment-text);
      transition:
        background-color 0.15s ease,
        color 0.15s ease;
    }

    button:hover {
      color: var(--color-segment-text-selected);
    }

    button:focus-visible {
      outline: 2px solid var(--color-border-focus);
      outline-offset: 4px;
    }

    button[aria-disabled="true"] {
      cursor: not-allowed;
      pointer-events: none;
      opacity: 0.6;
    }

    :host([selected]) button {
      background-color: var(--color-segment-surface-selected);
      border-color: var(--color-segment-border-selected);
      color: var(--color-segment-text-selected);
      box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.04);
    }
  `;

  @property({ type: String })
  value = "";

  @property({ type: Boolean, reflect: true })
  selected = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  private _handleClick() {
    if (this.disabled) return;
    this.dispatchEvent(new CustomEvent("lumen-segment-select", { detail: { value: this.value }, bubbles: true, composed: true }));
  }

  private _handleKeydown(event: KeyboardEvent) {
    if (this.disabled) return;
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    this.dispatchEvent(
      new CustomEvent("lumen-segment-navigate", { detail: { direction: event.key === "ArrowRight" ? 1 : -1 }, bubbles: true, composed: true })
    );
  }

  render() {
    return html`
      <button
        type="button"
        part="option"
        role="radio"
        aria-checked=${this.selected ? "true" : "false"}
        aria-disabled=${this.disabled ? "true" : "false"}
        tabindex=${this.selected ? "0" : "-1"}
        @click=${this._handleClick}
        @keydown=${this._handleKeydown}
      >
        <slot></slot>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lumen-segmented-control-option": LumenSegmentedControlOption;
  }
}
