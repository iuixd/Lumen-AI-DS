import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  inject,
  Input,
  OnChanges,
  TemplateRef,
  booleanAttribute
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";

/**
 * `<lumen-ai-button>` — Angular standalone implementation of `AIButton`
 * (packages/ui/src/primitives/AIButton.tsx), sourced from the Figma "AI
 * Communication Component Library" (Lumen-AI-Design-System, node 760:1965). See the
 * React component's doc comment for the full sourcing rationale (why this
 * is a standalone component rather than a `Button` variant, why
 * `destructive` changes no styling, and the known xs-height/status-tint/
 * Split-Button-AI gaps carried over unchanged here) and the Web Components
 * package's `<lumen-ai-button>` for the same contract via `<slot>`.
 *
 * A leading icon is always rendered — the default is the Figma-specced
 * `lm-aisymbol` glyph (confirmed via `get_design_context` on node
 * 760:1965's Secondary Icon Only AI instances, 2026-07-15 — supersedes the
 * generic sparkle glyph this shipped with initially). The override uses a
 * `TemplateRef` input (`[icon]`) rather than content projection with
 * fallback content — see `<lumen-filter-chip>`'s doc comment for why
 * `<ng-content>` alone can't express "default icon unless overridden" the
 * way a native `<slot>` can.
 */
export type LumenAIButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "destructive";
export type LumenAIButtonSize = "sm" | "md" | "lg" | "xl";

@Component({
  selector: "lumen-ai-button",
  standalone: true,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[attr.variant]": "variant",
    "[attr.size]": "size",
    "[attr.icon-only]": "iconOnly ? '' : null",
  },
  template: `
    <button
      type="button"
      part="button"
      [attr.aria-disabled]="isDisabled ? 'true' : null"
      [attr.aria-busy]="loading ? 'true' : null"
      [attr.aria-label]="resolvedAriaLabel"
      [attr.aria-labelledby]="hostAriaLabelledby"
      (click)="handleClick($event)"
    >
      @if (loading) {
        <span class="spinner" aria-hidden="true"></span>
      } @else if (icon) {
        <ng-container [ngTemplateOutlet]="icon"></ng-container>
      } @else {
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            fill="currentColor"
            d="M13.111 7.785c-1.336-1.336-2.251-3.67-2.705-5.794-.454 2.124-1.368 4.459-2.705 5.795s-3.671 2.25-5.795 2.705c2.125.454 4.46 1.368 5.796 2.705s2.25 3.671 2.705 5.795c.454-2.125 1.368-4.459 2.704-5.796 1.337-1.336 3.672-2.25 5.795-2.705-2.124-.454-4.458-1.368-5.795-2.705M18 14c-.214.999-.644 2.099-1.273 2.727C16.098 17.356 15 17.786 14 18c1 .215 2.098.644 2.727 1.273S17.787 21 18.001 22c.213-1 .643-2.098 1.272-2.727s1.728-1.059 2.727-1.274c-.999-.213-2.098-.643-2.727-1.272-.629-.628-1.06-1.728-1.273-2.727"
          />
        </svg>
      }
      <span class="label">
        <ng-content></ng-content>
      </span>
    </button>
  `,
  styles: `
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

    svg {
      width: var(--spacing-14);
      height: var(--spacing-14);
      flex-shrink: 0;
    }
  `
})
export class LumenAIButtonComponent implements OnChanges {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  @Input() variant: LumenAIButtonVariant = "primary";
  @Input() size: LumenAIButtonSize = "md";
  @Input() icon?: TemplateRef<unknown>;
  @Input({ transform: booleanAttribute }) iconOnly = false;
  @Input({ transform: booleanAttribute }) loading = false;
  @Input({ transform: booleanAttribute }) disabled = false;

  get isDisabled(): boolean {
    return this.disabled || this.loading;
  }

  private get hostAriaLabel(): string | null {
    return this.elementRef.nativeElement.getAttribute("aria-label");
  }

  get hostAriaLabelledby(): string | null {
    return this.elementRef.nativeElement.getAttribute("aria-labelledby");
  }

  get resolvedAriaLabel(): string | null {
    const hostLabel = this.hostAriaLabel;
    if (this.loading && this.iconOnly && !hostLabel) {
      return "Generating";
    }
    return hostLabel;
  }

  ngOnChanges(): void {
    if (this.iconOnly && !this.hostAriaLabel && !this.hostAriaLabelledby) {
      // eslint-disable-next-line no-console
      console.warn(
        "lumen-ai-button: iconOnly buttons must have an accessible name — pass aria-label."
      );
    }
  }

  handleClick(event: MouseEvent): void {
    if (this.isDisabled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
