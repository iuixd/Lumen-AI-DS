import { Component, ChangeDetectionStrategy, Input } from "@angular/core";

/**
 * `<lumen-footer>` — Angular standalone implementation of `Footer`
 * (packages/ui/src/layout/Footer.tsx), sourced from the Figma
 * "appshell-desktop-closed-light" reference screen (Lumen-AI-Design-System,
 * node 1197:1652, Footer instance `1102:6529`). Links are projected via
 * `<ng-content>` as real `<a>` elements, same reasoning as the React and
 * Web Components versions. `role="contentinfo"` is set as a static host
 * binding since a custom element has no implicit `<footer>` landmark role.
 *
 * Known parity gap: the Web Components version styles projected links via
 * `::slotted(a)`; Angular's content projection has no equivalent that
 * survives emulated view encapsulation without `::ng-deep` (deprecated),
 * so projected links here are unstyled by default — the consumer applies
 * its own link styling. Documented rather than worked around with a
 * deprecated API.
 */
@Component({
  selector: "lumen-footer",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: "contentinfo"
  },
  template: `
    @if (version) {
      <p>{{ version }}</p>
    }
    @if (statusLabel) {
      <span class="status">
        <span class="dot" [class]="statusTone" aria-hidden="true"></span>
        <p>{{ statusLabel }}</p>
      </span>
    }
    <span class="spacer"></span>
    <ng-content></ng-content>
  `,
  styles: `
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
  `
})
export class LumenFooterComponent {
  @Input() version?: string;
  @Input() statusLabel?: string;
  @Input() statusTone: "success" | "warning" | "error" = "success";
}
