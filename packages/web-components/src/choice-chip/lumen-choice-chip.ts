import { LitElement, html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

/**
 * `<lumen-choice-chip>` — Web Components implementation of `ChoiceChip`
 * (`packages/ui/src/primitives/ChoiceChip.tsx`), sourced from the Figma
 * Buttons page (Lumen-AI-Design-System, node 581:485). A toggleable pill for a
 * single-value choice: unselected shows plain text, selected fills solid
 * brand and gains a leading check icon. Only the `lg` size (36px) is
 * specced. Uses `aria-disabled` rather than the native `disabled`
 * attribute, matching `<lumen-button>`.
 *
 * `tone` and the `icon` slot were added for the "AI ButtonGroup Component
 * Library" Toggle Group pattern (node 969:5151) — see the React component's
 * doc comment for why this element was reused rather than a new one built.
 * `tone="solid"` (default) is unchanged. `tone="subtle"` reproduces the
 * Toggle Group pill: plain `neutral` chrome unselected, `brand.subtle`/
 * `brand.border-strong`/`brand.default` tinted when selected (the same
 * tokens `<lumen-button variant="secondary">` already binds to), with the
 * check icon moved trailing (after the slotted label) to match Figma's
 * pill layout — `tone="solid"`'s check stays leading, unchanged.
 */
@customElement("lumen-choice-chip")
export class LumenChoiceChip extends LitElement {
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
    ::slotted([slot="icon"]) {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }
  `;

  @property({ type: Boolean, reflect: true })
  selected = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: String, reflect: true })
  tone: "solid" | "subtle" = "solid";

  private _handleClick(event: MouseEvent) {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  render() {
    const check = html`<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12l5 5L20 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>`;
    return html`
      <button
        type="button"
        part="button"
        aria-pressed=${this.selected ? "true" : "false"}
        aria-disabled=${this.disabled ? "true" : nothing}
        @click=${this._handleClick}
      >
        ${this.tone === "solid" && this.selected ? check : nothing}
        <slot name="icon"></slot>
        <slot></slot>
        ${this.tone === "subtle" && this.selected ? check : nothing}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lumen-choice-chip": LumenChoiceChip;
  }
}
