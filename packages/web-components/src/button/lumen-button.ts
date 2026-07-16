import { LitElement, html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

/**
 * `<lumen-button>` — Web Components implementation of the Button component
 * specification (docs/component-specifications.md §5), matching the variant
 * taxonomy, sizes, and states actually shipped by the React reference
 * implementation (packages/ui/src/primitives/Button.tsx), not the older
 * variant/size/prop names still written in the docs — see this package's
 * README for the reconciliation this surfaced.
 *
 * Property naming follows this framework's own idiom rather than copying
 * React's verbatim: `loading` (not `isLoading`), matching
 * docs/component-architecture.md §5.1's own "avoid unnecessary is- prefixes"
 * guidance, which the React implementation doesn't currently follow either.
 *
 * Icon slots use the native Web Components mechanism for "renderable
 * content" — named `<slot>`s — instead of React's `iconStart`/`iconEnd`
 * node props: `<lumen-button><span slot="icon-start">…</span>Save</lumen-button>`.
 *
 * `status` ("success" | "warning" | "error") mirrors Button.tsx's later
 * addition (2026-07-14, Lumen-AI-Design-System node 475:7210's State property) — a
 * tinted surface/text override independent of `variant`, with a
 * status-colored border only on the `secondary` variant (the only bordered
 * variant Figma specced a status instance for; not re-verified for `outline`).
 *
 * `secondary` was corrected and `outline` added 2026-07-16, mirroring the
 * same Figma re-verification documented in Button.tsx's own doc comment —
 * see that file for the full node-id citations and reasoning (both variants
 * share border/text colors, differing only in rest/hover fill; both share an
 * identical solid-dark-fill-plus-white-text `active` state, `--color-brand-
 * solid-active`; `outline`'s hover border is bound to the same variable as
 * its hover fill in Figma, reproduced here as specced).
 */
export type LumenButtonVariant = "primary" | "raised" | "secondary" | "tertiary" | "link" | "outline";
export type LumenButtonSize = "xs" | "sm" | "md" | "lg";
export type LumenButtonStatus = "success" | "warning" | "error";

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
      align-items: center;
      justify-content: center;
      gap: var(--spacing-6);
      white-space: nowrap;
      cursor: pointer;
      border-radius: var(--radius-lg);
      border: 1.5px solid transparent;
      transition:
        background-color 0.15s ease,
        border-color 0.15s ease,
        box-shadow 0.15s ease;
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
    :host([size="md"]) button {
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
    :host([icon-only][size="md"]) button {
      width: var(--spacing-40);
      height: var(--spacing-40);
    }
    :host([icon-only][size="lg"]) button {
      width: var(--spacing-48);
      height: var(--spacing-48);
    }

    :host([pill]) button {
      border-radius: var(--radius-full);
    }

    :host([variant="primary"]) button {
      background-color: var(--color-brand-default);
      color: var(--color-neutral-white);
    }
    :host([variant="primary"]) button:hover:not([aria-disabled="true"]) {
      background-color: var(--color-brand-hover);
    }
    :host([variant="primary"]) button:active:not([aria-disabled="true"]) {
      background-color: var(--color-brand-pressed);
      box-shadow: var(--shadow-button-pressed-inset);
    }
    :host([variant="primary"]) button:focus-visible {
      border-color: var(--color-brand-border);
    }
    :host([variant="primary"]) button[aria-disabled="true"] {
      border-color: transparent;
      background-color: var(--color-neutral-50);
      color: var(--color-neutral-400);
    }
    :host([variant="primary"][icon-only]) button {
      border-color: var(--color-brand-border);
    }
    :host([variant="primary"][icon-only]) button:hover:not([aria-disabled="true"]),
    :host([variant="primary"][icon-only]) button:active:not([aria-disabled="true"]) {
      border-color: var(--color-brand-default);
    }
    :host([variant="primary"][icon-only]) button[aria-disabled="true"] {
      border-color: transparent;
    }

    :host([variant="raised"]) button {
      background-color: var(--color-brand-default);
      color: var(--color-neutral-white);
      box-shadow: var(--shadow-button-default);
    }
    :host([variant="raised"]) button:hover:not([aria-disabled="true"]) {
      background-color: var(--color-brand-hover);
      box-shadow: var(--shadow-button-hover);
    }
    :host([variant="raised"]) button:active:not([aria-disabled="true"]) {
      background-color: var(--color-brand-pressed);
      box-shadow: var(--shadow-button-active);
    }
    :host([variant="raised"]) button:focus-visible {
      border-color: var(--color-brand-border);
    }
    :host([variant="raised"]) button[aria-disabled="true"] {
      border-color: transparent;
      background-color: var(--color-neutral-50);
      color: var(--color-neutral-400);
      box-shadow: var(--shadow-button-disabled);
    }

    :host([variant="secondary"]) button {
      border-color: var(--color-brand-border-strong);
      background-color: var(--color-brand-subtle);
      color: var(--color-brand-default);
    }
    :host([variant="secondary"]) button:hover:not([aria-disabled="true"]) {
      border-color: var(--color-brand-default);
      background-color: var(--color-brand-subtle);
    }
    :host([variant="secondary"]) button:active:not([aria-disabled="true"]) {
      border-color: transparent;
      background-color: var(--color-brand-solid-active);
      color: var(--color-neutral-white);
    }
    :host([variant="secondary"]) button[aria-disabled="true"] {
      border-width: 1px;
      border-color: var(--color-neutral-200);
      background-color: var(--color-neutral-50);
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
      border-color: transparent;
      background-color: var(--color-brand-solid-active);
      color: var(--color-neutral-white);
    }
    :host([variant="outline"]) button[aria-disabled="true"] {
      border-width: 1px;
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

    :host([variant="link"]) button {
      min-width: 0;
      border-width: 0;
      background-color: transparent;
      padding: var(--spacing-4);
      color: var(--color-brand-default);
    }
    :host([variant="link"]) button:hover:not([aria-disabled="true"]),
    :host([variant="link"]) button:active:not([aria-disabled="true"]) {
      text-decoration: underline;
    }
    :host([variant="link"]) button[aria-disabled="true"] {
      color: var(--color-neutral-400);
    }

    :host([status="success"]) button:not([aria-disabled="true"]) {
      border-color: transparent;
      background-color: var(--color-status-success-subtle);
      color: var(--color-status-success-text);
    }
    :host([status="success"]) button:hover:not([aria-disabled="true"]),
    :host([status="success"]) button:active:not([aria-disabled="true"]) {
      background-color: var(--color-status-success-subtle);
      color: var(--color-status-success-text);
    }
    :host([status="success"]) button:focus-visible {
      border-color: transparent;
    }
    :host([variant="secondary"][status="success"]) button:not([aria-disabled="true"]),
    :host([variant="secondary"][status="success"]) button:hover:not([aria-disabled="true"]),
    :host([variant="secondary"][status="success"]) button:active:not([aria-disabled="true"]) {
      border-color: var(--color-status-success-border);
    }

    :host([status="warning"]) button:not([aria-disabled="true"]) {
      border-color: transparent;
      background-color: var(--color-status-warning-subtle);
      color: var(--color-status-warning-text);
    }
    :host([status="warning"]) button:hover:not([aria-disabled="true"]),
    :host([status="warning"]) button:active:not([aria-disabled="true"]) {
      background-color: var(--color-status-warning-subtle);
      color: var(--color-status-warning-text);
    }
    :host([status="warning"]) button:focus-visible {
      border-color: transparent;
    }
    :host([variant="secondary"][status="warning"]) button:not([aria-disabled="true"]),
    :host([variant="secondary"][status="warning"]) button:hover:not([aria-disabled="true"]),
    :host([variant="secondary"][status="warning"]) button:active:not([aria-disabled="true"]) {
      border-color: var(--color-status-warning-border);
    }

    :host([status="error"]) button:not([aria-disabled="true"]) {
      border-color: transparent;
      background-color: var(--color-status-error-subtle);
      color: var(--color-status-error-text);
    }
    :host([status="error"]) button:hover:not([aria-disabled="true"]),
    :host([status="error"]) button:active:not([aria-disabled="true"]) {
      background-color: var(--color-status-error-subtle);
      color: var(--color-status-error-text);
    }
    :host([status="error"]) button:focus-visible {
      border-color: transparent;
    }
    :host([variant="secondary"][status="error"]) button:not([aria-disabled="true"]),
    :host([variant="secondary"][status="error"]) button:hover:not([aria-disabled="true"]),
    :host([variant="secondary"][status="error"]) button:active:not([aria-disabled="true"]) {
      border-color: var(--color-status-error-border);
    }

    .label {
      display: inline;
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
      border-radius: var(--radius-full);
      border: 2px solid currentColor;
      border-top-color: transparent;
      animation: lumen-button-spin 0.6s linear infinite;
    }

    @keyframes lumen-button-spin {
      to {
        transform: rotate(360deg);
      }
    }
  `;

  @property({ type: String, reflect: true })
  variant: LumenButtonVariant = "primary";

  @property({ type: String, reflect: true })
  size: LumenButtonSize = "md";

  @property({ type: String, reflect: true })
  status?: LumenButtonStatus;

  @property({ type: Boolean, reflect: true, attribute: "icon-only" })
  iconOnly = false;

  @property({ type: Boolean, reflect: true })
  pill = false;

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
      console.warn("lumen-button: icon-only buttons must have an accessible name — pass aria-label.");
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
      this.loading && this.iconOnly && !hostAriaLabel ? "Loading" : hostAriaLabel;

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
        ${this.loading
          ? html`<span class="spinner" aria-hidden="true"></span>`
          : html`<slot name="icon-start"></slot>`}
        <span class="label ${this.loading ? "sr-only" : ""}">
          <slot></slot>
        </span>
        ${this.loading ? nothing : html`<slot name="icon-end"></slot>`}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lumen-button": LumenButton;
  }
}
