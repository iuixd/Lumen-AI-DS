import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ContentChildren,
  QueryList,
  forwardRef,
  booleanAttribute,
  type OnChanges,
  type SimpleChanges
} from "@angular/core";
import { LumenSegmentedControlOptionComponent } from "./lumen-segmented-control-option";

/**
 * `<lumen-segmented-control>` — Angular standalone implementation of
 * `SegmentedControl` (packages/ui/src/primitives/SegmentedControl.tsx),
 * sourced from the Figma "Buttons" page's "AI ButtonGroup Component
 * Library" section (Lumen-AI-Design-System, node 958:5058, "Segmented
 * Control Group"). A single-choice, tab-like control — see the React
 * component's doc comment for full sourcing, size, and token notes.
 *
 * Composed of projected `<lumen-segmented-control-option value="...">`
 * children (`@ContentChildren`), matching the parent/child division of
 * responsibility already used by `<lumen-split-button>`'s two internal
 * buttons — except split across two components here, coordinated through
 * constructor-injected parent access (`@Optional()` on the option side)
 * rather than a shared React context, since Angular components don't share
 * one. `forwardRef` on both sides resolves the resulting circular reference
 * between the two files.
 */
@Component({
  selector: "lumen-segmented-control",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[attr.size]": "size",
    "[attr.disabled]": "disabled ? '' : null"
  },
  template: `
    <div class="track" role="radiogroup" part="group" [attr.aria-label]="ariaLabel">
      <ng-content></ng-content>
    </div>
  `,
  styles: `
    :host {
      display: inline-flex;
    }

    .track {
      display: flex;
      align-items: stretch;
      gap: var(--spacing-2);
      border-radius: var(--radius-xl);
      background-color: var(--color-segment-surface);
      padding: var(--spacing-4);
    }

    :host([size="sm"]) .track {
      height: var(--spacing-28);
    }
    :host([size="md"]) .track,
    :host(:not([size])) .track {
      height: var(--spacing-36);
    }
    :host([size="lg"]) .track {
      height: var(--spacing-48);
    }
  `
})
export class LumenSegmentedControlComponent implements OnChanges {
  @Input() value = "";
  @Input() size: "sm" | "md" | "lg" = "md";
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input("aria-label") ariaLabel = "";
  @Output() valueChange = new EventEmitter<string>();

  @ContentChildren(forwardRef(() => LumenSegmentedControlOptionComponent), { descendants: true })
  options!: QueryList<LumenSegmentedControlOptionComponent>;

  ngOnChanges(changes: SimpleChanges): void {
    // OnPush: a `size`/`disabled` binding change on this host doesn't itself
    // refresh child options (same sibling-refresh gap `select()` works
    // around below) — only fires once options are queried (after content
    // init), so the initial binding is covered by each option's own first
    // render instead.
    if ((changes["size"] || changes["disabled"]) && this.options) {
      this.options.forEach((option) => option.refresh());
    }
  }

  isSelected(value: string): boolean {
    return this.value === value;
  }

  select(value: string): void {
    if (this.disabled) return;
    this.value = value;
    this.valueChange.emit(value);
    // OnPush: an event inside one option only marks that option's own path
    // dirty, not sibling options — explicitly refresh every option so a
    // previously-selected sibling actually re-renders as unselected.
    this.options.forEach((option) => option.refresh());
  }

  navigate(fromValue: string, direction: 1 | -1): void {
    const enabled = this.options.filter((o) => !o.disabled);
    if (enabled.length === 0) return;
    const currentIndex = enabled.findIndex((o) => o.value === fromValue);
    const next = enabled[(currentIndex + direction + enabled.length) % enabled.length];
    this.select(next.value);
    next.focus();
  }
}
