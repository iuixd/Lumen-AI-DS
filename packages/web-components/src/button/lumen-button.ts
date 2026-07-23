import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

/** Standard Button, sourced from Figma nodes 1027:3733 (variants/states) and 1034:4459 (sizes). */
export type LumenButtonVariant =
  "primary" | "accent" | "secondary" | "outline" | "ghost" | "destructive";
export type LumenButtonSize = "sm" | "md" | "lg" | "xl";

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
      height: var(--button-height);
      align-items: center;
      justify-content: center;
      gap: var(--button-gap);
      padding-inline: var(--button-padding-x);
      border: 1px solid transparent;
      border-radius: var(--radius-lg);
      color: inherit;
      font-family: var(--font-interface);
      font-size: var(--button-font-size);
      font-weight: var(--button-font-weight);
      line-height: var(--button-line-height);
      letter-spacing: var(--button-letter-spacing);
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
      width: var(--button-icon-size);
      height: var(--button-icon-size);
      flex: none;
    }

    :host([size="sm"]) {
      --button-height: var(--spacing-30);
      --button-padding-x: var(--spacing-14);
      --button-gap: var(--spacing-6);
      --button-icon-size: var(--spacing-12);
      --button-font-size: var(--text-standard-button-sm-size);
      --button-font-weight: var(--text-standard-button-sm-weight);
      --button-line-height: var(--text-standard-button-sm-line-height);
      --button-letter-spacing: var(--text-standard-button-sm-letter-spacing);
    }
    :host([size="md"]) {
      --button-height: var(--spacing-34);
      --button-padding-x: var(--spacing-16);
      --button-gap: var(--spacing-8);
      --button-icon-size: var(--spacing-14);
      --button-font-size: var(--text-standard-button-md-size);
      --button-font-weight: var(--text-standard-button-md-weight);
      --button-line-height: var(--text-standard-button-md-line-height);
      --button-letter-spacing: var(--text-standard-button-md-letter-spacing);
    }
    :host([size="lg"]) {
      --button-height: var(--spacing-38);
      --button-padding-x: var(--spacing-16);
      --button-gap: var(--spacing-8);
      --button-icon-size: var(--spacing-16);
      --button-font-size: var(--text-standard-button-lg-size);
      --button-font-weight: var(--text-standard-button-lg-weight);
      --button-line-height: var(--text-standard-button-lg-line-height);
      --button-letter-spacing: var(--text-standard-button-lg-letter-spacing);
    }
    :host([size="xl"]) {
      --button-height: var(--spacing-42);
      --button-padding-x: var(--spacing-16);
      --button-gap: var(--spacing-8);
      --button-icon-size: var(--spacing-18);
      --button-font-size: var(--text-standard-button-xl-size);
      --button-font-weight: var(--text-standard-button-xl-weight);
      --button-line-height: var(--text-standard-button-xl-line-height);
      --button-letter-spacing: var(--text-standard-button-xl-letter-spacing);
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
  @property({ reflect: true }) size: LumenButtonSize = "md";
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
