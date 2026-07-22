import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

/** Final standard Button collection, sourced from Figma node 1027:3733. */
export type LumenButtonVariant =
  "primary" | "accent" | "secondary" | "outline" | "ghost" | "destructive";

@customElement("lumen-button")
export class LumenButton extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }
    button {
      all: unset;
      box-sizing: border-box;
      display: inline-flex;
      height: var(--spacing-34);
      align-items: center;
      justify-content: center;
      gap: var(--spacing-8);
      padding: var(--spacing-7) var(--spacing-14);
      border: 1px solid transparent;
      border-radius: var(--radius-lg);
      color: inherit;
      font-family: var(--font-interface);
      font-size: var(--text-app-button-size);
      font-weight: var(--text-app-button-weight);
      line-height: var(--text-app-button-line-height);
      letter-spacing: var(--text-app-button-letter-spacing);
      white-space: nowrap;
      cursor: pointer;
      transition:
        background-color 0.15s ease,
        border-color 0.15s ease,
        color 0.15s ease;
    }
    button:focus-visible {
      outline: 2px solid var(--color-button-focus-ring);
      outline-offset: 2px;
    }
    slot[name] {
      display: contents;
    }
    ::slotted([slot="icon-start"]),
    ::slotted([slot="icon-end"]) {
      width: var(--spacing-14);
      height: var(--spacing-14);
      flex: none;
    }

    :host([variant="primary"]) button {
      background: var(--color-button-primary-bg);
      color: var(--color-button-primary-on-action);
    }
    :host([variant="primary"]) button:hover:not([aria-disabled="true"]) {
      background: var(--color-button-primary-hover-bg);
      color: var(--color-button-primary-hover-on-action);
    }
    :host([variant="accent"]) button {
      background: var(--color-button-accent-bg);
      color: var(--color-button-accent-on-action);
    }
    :host([variant="accent"]) button:hover:not([aria-disabled="true"]) {
      background: var(--color-button-accent-hover-bg);
      color: var(--color-button-accent-hover-on-action);
    }
    :host([variant="secondary"]) button {
      border-color: var(--color-button-secondary-border);
      background: var(--color-button-secondary-bg);
      color: var(--color-button-secondary-on-action);
    }
    :host([variant="secondary"]) button:hover:not([aria-disabled="true"]) {
      border-color: var(--color-button-secondary-hover-border);
      background: var(--color-button-secondary-hover-bg);
      color: var(--color-button-secondary-hover-on-action);
    }
    :host([variant="outline"]) button {
      border-color: var(--color-button-outline-border);
      background: var(--color-button-outline-bg);
      color: var(--color-button-outline-on-action);
    }
    :host([variant="outline"]) button:hover:not([aria-disabled="true"]) {
      border-color: var(--color-button-outline-hover-border);
      background: var(--color-button-outline-hover-bg);
      color: var(--color-button-outline-hover-on-action);
    }
    :host([variant="outline"]) button:focus-visible {
      border-color: var(--color-button-outline-focus-border);
    }
    :host([variant="ghost"]) button {
      background: var(--color-button-ghost-bg);
      color: var(--color-button-ghost-on-action);
    }
    :host([variant="ghost"]) button:hover:not([aria-disabled="true"]) {
      background: var(--color-button-ghost-hover-bg);
    }
    :host([variant="destructive"]) button {
      background: var(--color-button-destructive-bg);
      color: var(--color-button-destructive-on-action);
    }
    :host([variant="destructive"]) button:hover:not([aria-disabled="true"]) {
      background: var(--color-button-destructive-hover-bg);
    }
    button[aria-disabled="true"] {
      pointer-events: none;
      border-color: transparent;
      background: var(--color-button-disabled-bg);
      color: var(--color-button-disabled-on-action);
    }
  `;

  @property({ reflect: true }) variant: LumenButtonVariant = "primary";
  @property({ type: Boolean, reflect: true }) disabled = false;

  private handleClick(event: MouseEvent): void {
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
        aria-disabled=${this.disabled ? "true" : "false"}
        @click=${this.handleClick}
      >
        <slot name="icon-start"></slot>
        <slot></slot>
        <slot name="icon-end"></slot>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lumen-button": LumenButton;
  }
}
