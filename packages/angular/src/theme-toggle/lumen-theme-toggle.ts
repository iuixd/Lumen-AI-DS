import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  inject,
  booleanAttribute
} from "@angular/core";

/**
 * `<lumen-theme-toggle>` — Angular standalone implementation of
 * `ThemeToggle` (packages/ui/src/primitives/ThemeToggle.tsx), sourced from
 * the Figma "appshell-desktop-closed-light" reference screen
 * (Lumen-AI-Design-System, node 1197:1652, Header instance
 * `I1102:6515;1124:1193`). Mirrors the Web Components package's
 * `<lumen-theme-toggle>` — see its doc comment for the same
 * Light-theme-only sourcing caveat and the 54px→56px track-width rounding.
 *
 * `checked`/`checkedChange` follows Angular's own two-way-binding idiom
 * (`[(checked)]`) rather than a bubbling custom event, matching this
 * framework's conventions elsewhere in the package (e.g.
 * `<lumen-split-button>`'s `(mainClick)`/`(dropdownClick)` outputs).
 * `aria-label` is read directly off the host element (same pattern
 * `<lumen-button>` already uses) rather than a separate `@Input()`, so a
 * plain `aria-label="…"` attribute on the host works without a binding.
 */
@Component({
  selector: "lumen-theme-toggle",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[attr.checked]": "checked ? '' : null"
  },
  template: `
    <label part="track">
      <input
        type="checkbox"
        role="switch"
        [checked]="checked"
        [disabled]="disabled"
        [attr.aria-label]="resolvedAriaLabel"
        (change)="handleChange($event)"
      />
      <span class="thumb" aria-hidden="true"></span>
      <svg class="sun" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2" />
        <path
          d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
      <svg class="moon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" stroke-width="2" />
      </svg>
    </label>
  `,
  styles: `
    :host {
      display: inline-block;
    }

    label {
      position: relative;
      display: inline-flex;
      height: var(--spacing-24);
      width: var(--spacing-56);
      flex-shrink: 0;
      cursor: pointer;
      align-items: center;
      justify-content: space-between;
      border-radius: var(--radius-full);
      background-color: var(--color-background-subtle);
      padding: 0 var(--spacing-2);
    }

    label:has(input:focus-visible) {
      outline: 2px solid var(--color-border-focus);
      outline-offset: 4px;
    }

    input {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      opacity: 0;
    }

    .thumb {
      pointer-events: none;
      position: absolute;
      left: var(--spacing-2);
      width: var(--spacing-20);
      height: var(--spacing-20);
      border-radius: var(--radius-full);
      background-color: var(--color-background-default);
      box-shadow: var(--shadow-elevation-sm);
      transition: transform 0.15s ease;
    }

    :host([checked]) .thumb {
      transform: translateX(var(--spacing-32));
    }

    svg {
      position: relative;
      z-index: 1;
      width: var(--spacing-20);
      height: var(--spacing-20);
    }

    .sun {
      color: var(--color-text-title);
    }

    .moon {
      color: var(--color-text-muted);
    }
  `
})
export class LumenThemeToggleComponent {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  @Input({ transform: booleanAttribute }) checked = false;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Output() checkedChange = new EventEmitter<boolean>();

  get resolvedAriaLabel(): string {
    return this.elementRef.nativeElement.getAttribute("aria-label") ?? "Toggle dark theme";
  }

  handleChange(event: Event): void {
    this.checked = (event.target as HTMLInputElement).checked;
    this.checkedChange.emit(this.checked);
  }
}
