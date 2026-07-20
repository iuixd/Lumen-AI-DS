import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

/**
 * `<lumen-theme-toggle>` — Web Components implementation of `ThemeToggle`
 * (`packages/ui/src/primitives/ThemeToggle.tsx`), sourced from the Figma
 * "appshell-desktop-closed-light" reference screen (Lumen-AI-Design-System,
 * node 1197:1652, Header instance `I1102:6515;1124:1193`). A Sun/Moon pill
 * switch built on a native `role="switch"` checkbox for the same
 * accessible-toggle semantics `<lumen-button>`'s native `<button>` relies
 * on. Only the Light-theme instance was sourced — see the React
 * component's doc comment for the same caveat and the 54px→56px track
 * width rounding (keeps the thumb's translate distance on a real spacing
 * token).
 *
 * Fires a bubbling, composed `lumen-change` `CustomEvent<{ checked: boolean }>`
 * on toggle — the native `<input>`'s own `change` event doesn't cross the
 * shadow boundary, matching the same reasoning already documented on
 * `<lumen-split-button>`'s `lumen-main-click`/`lumen-dropdown-click` events.
 */
@customElement("lumen-theme-toggle")
export class LumenThemeToggle extends LitElement {
  static styles = css`
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

    input:checked ~ .thumb {
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
  `;

  @property({ type: Boolean, reflect: true })
  checked = false;

  @property({ attribute: "aria-label" })
  ariaLabelOverride: string | null = null;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  private _handleChange(event: Event) {
    this.checked = (event.target as HTMLInputElement).checked;
    this.dispatchEvent(
      new CustomEvent("lumen-change", { detail: { checked: this.checked }, bubbles: true, composed: true })
    );
  }

  render() {
    return html`
      <label part="track">
        <input
          type="checkbox"
          role="switch"
          .checked=${this.checked}
          ?disabled=${this.disabled}
          aria-label=${this.ariaLabelOverride ?? "Toggle dark theme"}
          @change=${this._handleChange}
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
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lumen-theme-toggle": LumenThemeToggle;
  }
}
