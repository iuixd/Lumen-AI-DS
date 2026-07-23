import { LitElement, html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

/**
 * `<lumen-ai-button>` — Web Components implementation of `AIButton`
 * (`packages/ui/src/primitives/AIButton.tsx`), sourced from the Figma
 * "AI Communication Component Library" (Lumen-AI-Design-System, node 760:1965).
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
export type LumenAIButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "destructive";
export type LumenAIButtonSize = "sm" | "md" | "lg" | "xl";

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
      border-radius: var(--radius-lg);
      border: 1px solid transparent;
      transition:
        background-color 0.15s ease,
        border-color 0.15s ease;
    }

    button:focus-visible {
      outline: 2px solid var(--color-button-focus-ring);
      outline-offset: 2px;
    }

    button[aria-disabled="true"] {
      pointer-events: none;
    }

    :host([size="sm"]) button {
      height: var(--spacing-30);
      padding: 0 var(--spacing-14);
      font-size: var(--text-standard-button-sm-size);
      line-height: var(--text-standard-button-sm-line-height);
      font-weight: var(--text-standard-button-sm-weight);
    }
    :host([size="md"]) button,
    :host(:not([size])) button {
      height: var(--spacing-34);
      padding: 0 var(--spacing-14);
      font-size: var(--text-standard-button-md-size);
      line-height: var(--text-standard-button-md-line-height);
      font-weight: var(--text-standard-button-md-weight);
    }
    :host([size="lg"]) button {
      height: var(--spacing-38);
      padding: 0 var(--spacing-16);
      font-size: var(--text-standard-button-lg-size);
      line-height: var(--text-standard-button-lg-line-height);
      font-weight: var(--text-standard-button-lg-weight);
    }
    :host([size="xl"]) button {
      height: var(--spacing-42);
      padding: 0 var(--spacing-16);
      font-size: var(--text-standard-button-xl-size);
      line-height: var(--text-standard-button-xl-line-height);
      font-weight: var(--text-standard-button-xl-weight);
    }

    :host([icon-only]) button {
      min-width: 0;
      padding: 0;
    }
    :host([icon-only][size="sm"]) button {
      width: var(--spacing-30);
      height: var(--spacing-30);
    }
    :host([icon-only][size="md"]) button,
    :host([icon-only]:not([size])) button {
      width: var(--spacing-34);
      height: var(--spacing-34);
    }
    :host([icon-only][size="lg"]) button {
      width: var(--spacing-38);
      height: var(--spacing-38);
    }
    :host([icon-only][size="xl"]) button {
      width: var(--spacing-42);
      height: var(--spacing-42);
    }

    :host([variant="primary"]) button,
    :host(:not([variant])) button {
      background-color: var(--color-button-primary-bg);
      color: var(--color-button-primary-on-action);
    }
    :host([variant="primary"]) button:hover:not([aria-disabled="true"]),
    :host(:not([variant])) button:hover:not([aria-disabled="true"]) {
      background-color: var(--color-button-primary-hover-bg);
      color: var(--color-button-primary-hover-on-action);
    }
    :host([variant="primary"]) button:active:not([aria-disabled="true"]),
    :host(:not([variant])) button:active:not([aria-disabled="true"]) {
      background-color: var(--color-button-primary-hover-bg);
    }
    :host([variant="primary"]) button[aria-disabled="true"],
    :host(:not([variant])) button[aria-disabled="true"] {
      background-color: var(--color-button-disabled-bg);
      color: var(--color-button-disabled-on-action);
    }

    :host([variant="secondary"]) button {
      border-color: var(--color-button-secondary-border);
      background-color: var(--color-button-secondary-bg);
      color: var(--color-button-secondary-on-action);
    }
    :host([variant="secondary"]) button:hover:not([aria-disabled="true"]),
    :host([variant="secondary"]) button:active:not([aria-disabled="true"]) {
      border-color: var(--color-button-secondary-hover-border);
    }
    :host([variant="secondary"]) button:active:not([aria-disabled="true"]) {
      background-color: var(--color-button-secondary-hover-bg);
      color: var(--color-button-secondary-hover-on-action);
    }
    :host([variant="secondary"]) button[aria-disabled="true"] {
      border-color: transparent;
      background-color: var(--color-button-disabled-bg);
      color: var(--color-button-disabled-on-action);
    }

    :host([variant="ghost"]) button {
      background-color: var(--color-button-ghost-bg);
      color: var(--color-app-shell-text-primary);
    }
    :host([variant="ghost"]) button:hover:not([aria-disabled="true"]) {
      background-color: var(--color-button-ghost-hover-bg);
    }
    :host([variant="ghost"][size="md"]) button {
      height: var(--spacing-36);
      padding-inline: var(--spacing-16);
    }

    :host([variant="outline"]) button {
      border-color: var(--color-button-outline-border);
      background-color: var(--color-button-outline-bg);
      color: var(--color-button-outline-on-action);
    }
    :host([variant="outline"]) button:hover:not([aria-disabled="true"]) {
      border-color: var(--color-button-outline-hover-border);
      background-color: var(--color-button-outline-hover-bg);
      color: var(--color-button-outline-hover-on-action);
    }
    :host([variant="outline"]) button:active:not([aria-disabled="true"]) {
      border-color: var(--color-button-outline-hover-border);
      background-color: var(--color-button-outline-hover-bg);
    }
    :host([variant="outline"]) button[aria-disabled="true"] {
      border-color: transparent;
      background-color: var(--color-button-disabled-bg);
      color: var(--color-button-disabled-on-action);
    }

    :host([variant="destructive"]) button {
      background-color: var(--color-button-destructive-bg);
      color: var(--color-button-destructive-on-action);
    }
    :host([variant="destructive"]) button:hover:not([aria-disabled="true"]) {
      background-color: var(--color-button-destructive-hover-bg);
    }

    .spinner {
      width: var(--spacing-12);
      height: var(--spacing-12);
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
      width: var(--spacing-14);
      height: var(--spacing-14);
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

  updated(changed: Map<string, unknown>) {
    super.updated(changed);
    if (
      this.iconOnly &&
      !this.getAttribute("aria-label") &&
      !this.getAttribute("aria-labelledby")
    ) {
      // eslint-disable-next-line no-console
      console.warn(
        "lumen-ai-button: iconOnly buttons must have an accessible name — pass aria-label."
      );
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
        aria-disabled=${isDisabled ? "true" : nothing}
        aria-busy=${this.loading ? "true" : nothing}
        aria-label=${resolvedAriaLabel ?? nothing}
        aria-labelledby=${hostAriaLabelledby ?? nothing}
        @click=${this._handleClick}
      >
        ${
          this.loading
            ? html`<span class="spinner" aria-hidden="true"></span>`
            : html`<slot name="icon">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M13.111 7.785c-1.336-1.336-2.251-3.67-2.705-5.794-.454 2.124-1.368 4.459-2.705 5.795s-3.671 2.25-5.795 2.705c2.125.454 4.46 1.368 5.796 2.705s2.25 3.671 2.705 5.795c.454-2.125 1.368-4.459 2.704-5.796 1.337-1.336 3.672-2.25 5.795-2.705-2.124-.454-4.458-1.368-5.795-2.705M18 14c-.214.999-.644 2.099-1.273 2.727C16.098 17.356 15 17.786 14 18c1 .215 2.098.644 2.727 1.273S17.787 21 18.001 22c.213-1 .643-2.098 1.272-2.727s1.728-1.059 2.727-1.274c-.999-.213-2.098-.643-2.727-1.272-.629-.628-1.06-1.728-1.273-2.727"
                  />
                </svg>
              </slot>`
        }
        <span class="label">
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
