import { LitElement, html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

export type LumenKPICardDeltaTone = "success" | "warning" | "error";

/**
 * `<lumen-kpi-card>` — Web Components implementation of `KPICard`
 * (`packages/ui/src/primitives/KPICard.tsx`), sourced from the Figma
 * "appshell-desktop-closed-light" reference screen (Lumen-AI-Design-System,
 * node 1197:1652, instances `1102:6521`-`1102:6523`). See the React
 * component's doc comment for the typography-rounding rationale
 * (`label-md`/`headline-lg` instead of Figma's exact 12/16/500 and 32/40).
 */
@customElement("lumen-kpi-card")
export class LumenKPICard extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex: 1 1 0%;
      flex-direction: column;
      gap: var(--spacing-4);
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-border-subtle);
      background-color: var(--color-background-default);
      padding: var(--spacing-16) var(--spacing-20);
      box-shadow: var(--shadow-elevation-sm);
    }

    p {
      margin: 0;
    }

    .label {
      font-size: var(--text-label-md-size);
      line-height: var(--text-label-md-line-height);
      font-weight: var(--text-label-md-weight);
      color: var(--color-text-secondary);
    }

    .value {
      font-size: var(--text-headline-lg-size);
      line-height: var(--text-headline-lg-line-height);
      font-weight: var(--text-headline-lg-weight);
      color: var(--color-text-body);
    }

    .delta {
      font-size: var(--text-label-sm-size);
      line-height: var(--text-label-sm-line-height);
      font-weight: var(--text-label-sm-weight);
    }

    .delta.success {
      color: var(--color-status-success);
    }

    .delta.warning {
      color: var(--color-status-warning);
    }

    .delta.error {
      color: var(--color-status-error);
    }
  `;

  @property({ type: String })
  label = "";

  @property({ type: String })
  value = "";

  @property({ type: String })
  delta?: string;

  @property({ attribute: "delta-tone" })
  deltaTone: LumenKPICardDeltaTone = "success";

  render() {
    return html`
      <p class="label">${this.label}</p>
      <p class="value">${this.value}</p>
      ${this.delta ? html`<p class="delta ${this.deltaTone}">${this.delta}</p>` : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lumen-kpi-card": LumenKPICard;
  }
}
