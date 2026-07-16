import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  Optional,
  Inject,
  ElementRef,
  ViewChild,
  forwardRef
} from "@angular/core";
import { LumenSegmentedControlComponent } from "./lumen-segmented-control";

/**
 * `<lumen-segmented-control-option>` — one segment inside
 * `<lumen-segmented-control>`. See that component's doc comment for
 * sourcing and the parent/child coordination approach. Reads its own
 * `selected` state from the injected parent rather than owning it, and
 * reports clicks/arrow-key intent by calling methods on the parent
 * directly (constructor DI instead of a bubbling event, since Angular
 * components don't have a DOM-custom-event equivalent by default).
 *
 * Exposes `refresh()` so the parent can explicitly `markForCheck()` every
 * option after a selection change: with `OnPush`, an event inside one
 * option only marks that option's own view path dirty, not its siblings —
 * without this, clicking "Formal" would render correctly but a
 * previously-selected sibling like "Neutral" would keep showing
 * `aria-checked="true"` until some unrelated re-render touched it.
 *
 * `size` is read live from the injected parent (same getter pattern as
 * `selected`/`isDisabled`) rather than pushed down as an `@Input` — the
 * parent's `refresh()` fan-out (used for selection changes) also covers
 * `size` changes for the same `OnPush`-sibling reason. Per-size padding/type
 * re-verified 2026-07-16 against Figma's "Size Rows" example: `sm` =
 * `Spacing/12` padding + `button-sm` type, `md` = `Spacing/16` +
 * `button-md`, `lg` = `Spacing/20` + `button-lg`.
 */
@Component({
  selector: "lumen-segmented-control-option",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[attr.selected]": "selected ? '' : null",
    "[attr.size]": "size"
  },
  template: `
    <button
      #btn
      type="button"
      part="option"
      role="radio"
      [attr.aria-checked]="selected ? 'true' : 'false'"
      [attr.aria-disabled]="isDisabled ? 'true' : 'false'"
      [attr.tabindex]="selected ? 0 : -1"
      (click)="handleClick()"
      (keydown)="handleKeydown($event)"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: `
    :host {
      display: contents;
    }

    button {
      all: unset;
      box-sizing: border-box;
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-6);
      cursor: pointer;
      white-space: nowrap;
      padding: 0 var(--spacing-16);
      border-radius: var(--radius-lg);
      border: 1px solid transparent;
      font-size: var(--text-button-md-size);
      line-height: var(--text-button-md-line-height);
      font-weight: 600;
      color: var(--color-segment-text);
      transition:
        background-color 0.15s ease,
        color 0.15s ease;
    }

    :host([size="sm"]) button {
      padding: 0 var(--spacing-12);
      font-size: var(--text-button-sm-size);
      line-height: var(--text-button-sm-line-height);
    }
    :host([size="lg"]) button {
      padding: 0 var(--spacing-20);
      font-size: var(--text-button-lg-size);
      line-height: var(--text-button-lg-line-height);
    }

    button:hover {
      color: var(--color-segment-text-selected);
    }

    button:focus-visible {
      outline: 2px solid var(--color-border-focus);
      outline-offset: 4px;
    }

    button[aria-disabled="true"] {
      cursor: not-allowed;
      pointer-events: none;
      opacity: 0.6;
    }

    :host([selected]) button {
      background-color: var(--color-segment-surface-selected);
      border-color: var(--color-segment-border-selected);
      color: var(--color-segment-text-selected);
      box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.04);
    }
  `
})
export class LumenSegmentedControlOptionComponent {
  @Input() value = "";
  @Input() disabled = false;

  @ViewChild("btn") private buttonRef!: ElementRef<HTMLButtonElement>;

  constructor(
    @Optional() @Inject(forwardRef(() => LumenSegmentedControlComponent)) private parent: LumenSegmentedControlComponent | null,
    @Inject(ChangeDetectorRef) private cdr: ChangeDetectorRef
  ) {}

  refresh(): void {
    this.cdr.markForCheck();
  }

  get selected(): boolean {
    return this.parent?.isSelected(this.value) ?? false;
  }

  get size(): "sm" | "md" | "lg" {
    return this.parent?.size ?? "md";
  }

  get isDisabled(): boolean {
    return this.disabled || (this.parent?.disabled ?? false);
  }

  handleClick(): void {
    if (this.isDisabled) return;
    this.parent?.select(this.value);
  }

  handleKeydown(event: KeyboardEvent): void {
    if (this.isDisabled) return;
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    this.parent?.navigate(this.value, event.key === "ArrowRight" ? 1 : -1);
  }

  focus(): void {
    this.buttonRef?.nativeElement.focus();
  }
}
