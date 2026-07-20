import { LitElement, html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

/**
 * `<lumen-footer>` — Web Components implementation of `Footer`
 * (`packages/ui/src/layout/Footer.tsx`), sourced from the Figma
 * "appshell-desktop-closed-light" reference screen (Lumen-AI-Design-System,
 * node 1197:1652, Footer instance `1102:6529`). Links are projected via the
 * default slot as real `<a>` elements (not a stringified array attribute)
 * per `docs/accessibility.md`'s "navigation uses a link, not a button" —
 * the same reasoning the React version documents. Sets `role="contentinfo"`
 * on the host since a custom element has no implicit `<footer>` landmark
 * role of its own.
 */
@customElement("lumen-footer")
export class LumenFooter extends LitElement {
  static styles = css`
    :host {
      display: flex;
      width: 100%;
      flex-shrink: 0;
      align-items: center;
      gap: var(--spacing-16);
      border-top: 1px solid var(--color-border-default);
      background-color: var(--color-background-default);
      padding: var(--spacing-10) var(--spacing-24);
    }

    p {
      margin: 0;
      font-size: var(--text-label-sm-size);
      line-height: var(--text-label-sm-line-height);
      font-weight: var(--text-label-sm-weight);
      color: var(--color-text-muted);
      white-space: nowrap;
    }

    .status {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-6);
    }

    .dot {
      width: var(--spacing-6);
      height: var(--spacing-6);
      flex-shrink: 0;
      border-radius: var(--radius-full);
    }

    .dot.success {
      background-color: var(--color-status-success);
    }

    .dot.warning {
      background-color: var(--color-status-warning);
    }

    .dot.error {
      background-color: var(--color-status-error);
    }

    .spacer {
      min-width: 1px;
      flex: 1 1 0%;
    }

    ::slotted(a) {
      font-size: var(--text-label-sm-size);
      line-height: var(--text-label-sm-line-height);
      font-weight: var(--text-label-sm-weight);
      color: var(--color-text-muted);
      text-decoration: none;
    }

    ::slotted(a:hover) {
      color: var(--color-text-body);
    }
  `;

  @property({ type: String })
  version?: string;

  @property({ attribute: "status-label" })
  statusLabel?: string;

  @property({ attribute: "status-tone" })
  statusTone: "success" | "warning" | "error" = "success";

  connectedCallback() {
    super.connectedCallback();
    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "contentinfo");
    }
  }

  render() {
    return html`
      ${this.version ? html`<p>${this.version}</p>` : nothing}
      ${this.statusLabel
        ? html`<span class="status">
            <span class="dot ${this.statusTone}" aria-hidden="true"></span>
            <p>${this.statusLabel}</p>
          </span>`
        : nothing}
      <span class="spacer"></span>
      <slot></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lumen-footer": LumenFooter;
  }
}
