import { LitElement, html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

/**
 * `<lumen-ai-button>` — Web Components implementation of `AIButton`
 * (`packages/ui/src/primitives/AIButton.tsx`), sourced from the Figma
 * "AI Communication Component Library" (Lumen-DS-2027, node 760:1965).
 * See the React component's doc comment for the full sourcing rationale
 * (why this is a standalone component rather than a `Button` variant, why
 * `destructive` changes no styling, and the known xs-height/status-tint/
 * Split-Button-AI gaps carried over unchanged here).
 *
 * A leading icon is always rendered — the default slot content is the
 * Figma-specced `lm-aisymbol` glyph (confirmed via `get_design_context` on
 * node 760:1965's Secondary Icon Only AI instances, 2026-07-15 —
 * supersedes the generic sparkle glyph this shipped with initially),
 * overridable via `<span slot="icon">`.
 */
export type LumenAIButtonVariant = "primary" | "secondary" | "tertiary" | "outline";
export type LumenAIButtonSize = "xs" | "sm" | "md" | "lg";

@customElement("lumen-ai-button")
export class LumenAIButton extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }

    button {
      all: unset;
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-8);
      white-space: nowrap;
      cursor: pointer;
      border-radius: var(--radius-md);
      border: 1.5px solid transparent;
      transition:
        background-color 0.15s ease,
        border-color 0.15s ease;
    }

    button:focus-visible {
      outline: 2px solid var(--color-border-focus);
      outline-offset: 4px;
    }

    button[aria-disabled="true"] {
      pointer-events: none;
      opacity: 0.6;
    }

    :host([size="xs"]) button {
      height: var(--spacing-32);
      min-width: var(--spacing-64);
      padding: var(--spacing-5) var(--spacing-10);
      font-size: var(--text-button-xs-size);
      line-height: var(--text-button-xs-line-height);
      font-weight: var(--text-button-xs-weight);
    }
    :host([size="sm"]) button {
      height: var(--spacing-36);
      min-width: var(--spacing-80);
      padding: var(--spacing-6) var(--spacing-12);
      font-size: var(--text-button-sm-size);
      line-height: var(--text-button-sm-line-height);
      font-weight: var(--text-button-sm-weight);
    }
    :host([size="md"]) button,
    :host(:not([size])) button {
      height: var(--spacing-40);
      min-width: var(--spacing-96);
      padding: var(--spacing-8) var(--spacing-16);
      font-size: var(--text-button-md-size);
      line-height: var(--text-button-md-line-height);
      font-weight: var(--text-button-md-weight);
    }
    :host([size="lg"]) button {
      height: var(--spacing-48);
      min-width: var(--spacing-120);
      padding: var(--spacing-10) var(--spacing-20);
      font-size: var(--text-button-lg-size);
      line-height: var(--text-button-lg-line-height);
      font-weight: var(--text-button-lg-weight);
    }

    :host([icon-only]) button {
      min-width: 0;
      padding: 0;
    }
    :host([icon-only][size="xs"]) button {
      width: var(--spacing-32);
      height: var(--spacing-32);
    }
    :host([icon-only][size="sm"]) button {
      width: var(--spacing-36);
      height: var(--spacing-36);
    }
    :host([icon-only][size="md"]) button,
    :host([icon-only]:not([size])) button {
      width: var(--spacing-40);
      height: var(--spacing-40);
    }
    :host([icon-only][size="lg"]) button {
      width: var(--spacing-48);
      height: var(--spacing-48);
    }

    :host([variant="primary"]) button,
    :host(:not([variant])) button {
      background-color: var(--color-brand-default);
      color: var(--color-neutral-white);
    }
    :host([variant="primary"]) button:hover:not([aria-disabled="true"]),
    :host(:not([variant])) button:hover:not([aria-disabled="true"]) {
      background-color: var(--color-brand-hover);
    }
    :host([variant="primary"]) button:active:not([aria-disabled="true"]),
    :host(:not([variant])) button:active:not([aria-disabled="true"]) {
      background-color: var(--color-brand-pressed);
    }
    :host([variant="primary"]) button[aria-disabled="true"],
    :host(:not([variant])) button[aria-disabled="true"] {
      background-color: var(--color-neutral-50);
      color: var(--color-neutral-400);
    }

    :host([variant="secondary"]) button {
      border-color: var(--color-brand-border-strong);
      background-color: var(--color-brand-subtle);
      color: var(--color-brand-default);
    }
    :host([variant="secondary"]) button:hover:not([aria-disabled="true"]),
    :host([variant="secondary"]) button:active:not([aria-disabled="true"]) {
      border-color: var(--color-brand-default);
    }
    :host([variant="secondary"]) button:active:not([aria-disabled="true"]) {
      background-color: var(--color-brand-subtle-pressed);
    }
    :host([variant="secondary"]) button[aria-disabled="true"] {
      border-color: var(--color-neutral-200);
      background-color: var(--color-neutral-50);
      color: var(--color-neutral-400);
    }

    :host([variant="tertiary"]) button {
      background-color: transparent;
      color: var(--color-brand-default);
    }
    :host([variant="tertiary"]) button:hover:not([aria-disabled="true"]) {
      background-color: var(--color-brand-subtle);
    }
    :host([variant="tertiary"]) button:active:not([aria-disabled="true"]) {
      background-color: var(--color-brand-subtle-pressed);
    }
    :host([variant="tertiary"]) button[aria-disabled="true"] {
      background-color: transparent;
      color: var(--color-neutral-400);
    }

    :host([variant="outline"]) button {
      border-color: var(--color-brand-border-strong);
      background-color: transparent;
      color: var(--color-brand-default);
    }
    :host([variant="outline"]) button:hover:not([aria-disabled="true"]) {
      border-color: var(--color-brand-subtle);
      background-color: var(--color-brand-subtle);
    }
    :host([variant="outline"]) button:active:not([aria-disabled="true"]) {
      border-color: var(--color-brand-default);
      background-color: var(--color-brand-subtle-pressed);
    }
    :host([variant="outline"]) button[aria-disabled="true"] {
      border-color: var(--color-neutral-200);
      background-color: transparent;
      color: var(--color-neutral-400);
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

    .spinner {
      width: 1em;
      height: 1em;
      flex-shrink: 0;
      border-radius: var(--radius-full);
      border: 2px solid currentColor;
      border-top-color: transparent;
      animation: lumen-ai-button-spin 0.6s linear infinite;
    }

    @keyframes lumen-ai-button-spin {
      to {
        transform: rotate(360deg);
      }
    }

    ::slotted([slot="icon"]),
    svg {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }
  `;

  @property({ type: String, reflect: true })
  variant: LumenAIButtonVariant = "primary";

  @property({ type: String, reflect: true })
  size: LumenAIButtonSize = "md";

  @property({ type: Boolean, reflect: true, attribute: "icon-only" })
  iconOnly = false;

  @property({ type: Boolean, reflect: true })
  loading = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** Behavioral only — Figma specs no distinct color for it. Sets a `data-destructive` attribute for hook-in. */
  @property({ type: Boolean, reflect: true })
  destructive = false;

  updated(changed: Map<string, unknown>) {
    super.updated(changed);
    if (
      this.iconOnly &&
      !this.getAttribute("aria-label") &&
      !this.getAttribute("aria-labelledby")
    ) {
      // eslint-disable-next-line no-console
      console.warn("lumen-ai-button: iconOnly buttons must have an accessible name — pass aria-label.");
    }
  }

  private _handleClick(event: MouseEvent) {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  render() {
    const isDisabled = this.disabled || this.loading;
    const hostAriaLabel = this.getAttribute("aria-label");
    const hostAriaLabelledby = this.getAttribute("aria-labelledby");
    const resolvedAriaLabel =
      this.loading && this.iconOnly && !hostAriaLabel ? "Generating" : hostAriaLabel;

    return html`
      <button
        type="button"
        part="button"
        data-destructive=${this.destructive ? "true" : nothing}
        aria-disabled=${isDisabled ? "true" : nothing}
        aria-busy=${this.loading ? "true" : nothing}
        aria-label=${resolvedAriaLabel ?? nothing}
        aria-labelledby=${hostAriaLabelledby ?? nothing}
        @click=${this._handleClick}
      >
        ${this.loading
          ? html`<span class="spinner" aria-hidden="true"></span>`
          : html`<slot name="icon">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M13.111 7.785c-1.336-1.336-2.251-3.67-2.705-5.794-.454 2.124-1.368 4.459-2.705 5.795s-3.671 2.25-5.795 2.705c2.125.454 4.46 1.368 5.796 2.705s2.25 3.671 2.705 5.795c.454-2.125 1.368-4.459 2.704-5.796 1.337-1.336 3.672-2.25 5.795-2.705-2.124-.454-4.458-1.368-5.795-2.705M18 14c-.214.999-.644 2.099-1.273 2.727C16.098 17.356 15 17.786 14 18c1 .215 2.098.644 2.727 1.273S17.787 21 18.001 22c.213-1 .643-2.098 1.272-2.727s1.728-1.059 2.727-1.274c-.999-.213-2.098-.643-2.727-1.272-.629-.628-1.06-1.728-1.273-2.727"
                />
              </svg>
            </slot>`}
        <span class="label ${this.loading ? "sr-only" : ""}">
          <slot></slot>
        </span>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lumen-ai-button": LumenAIButton;
  }
}
