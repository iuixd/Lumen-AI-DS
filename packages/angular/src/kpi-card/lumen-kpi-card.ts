import { Component, ChangeDetectionStrategy, Input } from "@angular/core";

export type LumenKPICardDeltaTone = "success" | "warning" | "error";

/**
 * `<lumen-kpi-card>` — Angular standalone implementation of `KPICard`
 * (packages/ui/src/primitives/KPICard.tsx), sourced from the Figma
 * "appshell-desktop-closed-light" reference screen (Lumen-AI-Design-System,
 * node 1197:1652, instances `1102:6521`-`1102:6523`). See the Web
 * Components package's `<lumen-kpi-card>` and the React component's doc
 * comment for the typography-rounding rationale.
 */
@Component({
  selector: "lumen-kpi-card",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="label">{{ label }}</p>
    <p class="value">{{ value }}</p>
    @if (delta) {
      <p class="delta" [class]="deltaTone">{{ delta }}</p>
    }
  `,
  styles: `
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
  `
})
export class LumenKPICardComponent {
  @Input() label = "";
  @Input() value = "";
  @Input() delta?: string;
  @Input() deltaTone: LumenKPICardDeltaTone = "success";
}
