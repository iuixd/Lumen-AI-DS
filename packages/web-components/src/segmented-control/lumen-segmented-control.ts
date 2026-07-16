import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { LumenSegmentedControlOption } from "./lumen-segmented-control-option";

/**
 * `<lumen-segmented-control>` — Web Components implementation of
 * `SegmentedControl` (`packages/ui/src/primitives/SegmentedControl.tsx`),
 * sourced from the Figma "Buttons" page's "AI ButtonGroup Component
 * Library" section (Lumen-AI-Design-System, node 958:5058, "Segmented
 * Control Group"). A single-choice, tab-like control — see the React
 * component's doc comment for full sourcing, size, and token notes.
 *
 * Composed of light-DOM `<lumen-segmented-control-option value="...">`
 * children rather than a React-style render-prop/context API: each option
 * reports clicks and arrow-key intent via bubbling `lumen-segment-select`/
 * `lumen-segment-navigate` events; this host owns `value` and pushes
 * `selected`/`disabled`/`size` down onto its children directly (no shared
 * context mechanism exists across independent custom elements) — the
 * parent/child division of responsibility mirrors `<lumen-split-button>`'s
 * own two internal buttons, just across separate elements instead of one
 * shadow root. Fires a bubbling `lumen-value-change` event on selection.
 */
@customElement("lumen-segmented-control")
export class LumenSegmentedControl extends LitElement {
  static styles = css`
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
  `;

  @property({ type: String, reflect: true })
  value = "";

  @property({ type: String, reflect: true })
  size: "sm" | "md" | "lg" = "md";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("lumen-segment-select", this._handleSelect as EventListener);
    this.addEventListener("lumen-segment-navigate", this._handleNavigate as EventListener);
  }

  disconnectedCallback() {
    this.removeEventListener("lumen-segment-select", this._handleSelect as EventListener);
    this.removeEventListener("lumen-segment-navigate", this._handleNavigate as EventListener);
    super.disconnectedCallback();
  }

  private get _options(): LumenSegmentedControlOption[] {
    return Array.from(this.querySelectorAll("lumen-segmented-control-option"));
  }

  private _handleSelect = (event: CustomEvent<{ value: string }>) => {
    this.value = event.detail.value;
    this.dispatchEvent(new CustomEvent("lumen-value-change", { detail: { value: this.value }, bubbles: true, composed: true }));
  };

  private _handleNavigate = (event: CustomEvent<{ direction: 1 | -1 }>) => {
    const options = this._options.filter((o) => !o.disabled);
    if (options.length === 0) return;
    const currentIndex = options.findIndex((o) => o.value === this.value);
    const nextIndex = (currentIndex + event.detail.direction + options.length) % options.length;
    const next = options[nextIndex];
    this.value = next.value;
    this.dispatchEvent(new CustomEvent("lumen-value-change", { detail: { value: this.value }, bubbles: true, composed: true }));
    next.focus();
  };

  private _syncChildren() {
    for (const option of this._options) {
      option.selected = option.value === this.value;
      option.disabled = this.disabled || option.hasAttribute("disabled");
      option.size = this.size;
    }
  }

  updated(changed: Map<string, unknown>) {
    if (changed.has("value") || changed.has("disabled") || changed.has("size")) this._syncChildren();
  }

  render() {
    return html`
      <div class="track" role="radiogroup" part="group" aria-label=${this.getAttribute("aria-label") ?? ""}>
        <slot @slotchange=${() => this._syncChildren()}></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lumen-segmented-control": LumenSegmentedControl;
  }
}
