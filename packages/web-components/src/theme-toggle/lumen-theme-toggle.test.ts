import { afterEach, describe, expect, it, vi } from "vitest";
import "./lumen-theme-toggle";
import type { LumenThemeToggle } from "./lumen-theme-toggle";

async function renderToggle(markup: string): Promise<LumenThemeToggle> {
  document.body.innerHTML = markup;
  const el = document.querySelector("lumen-theme-toggle") as LumenThemeToggle;
  await el.updateComplete;
  return el;
}

function innerInput(el: LumenThemeToggle): HTMLInputElement {
  return el.shadowRoot!.querySelector("input")!;
}

describe("lumen-theme-toggle", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders as a switch with a default accessible name", async () => {
    const el = await renderToggle("<lumen-theme-toggle></lumen-theme-toggle>");
    const input = innerInput(el);
    expect(input.getAttribute("role")).toBe("switch");
    expect(input.getAttribute("aria-label")).toBe("Toggle dark theme");
  });

  it("accepts an aria-label override", async () => {
    const el = await renderToggle('<lumen-theme-toggle aria-label="Switch to dark mode"></lumen-theme-toggle>');
    expect(innerInput(el).getAttribute("aria-label")).toBe("Switch to dark mode");
  });

  it("reflects the checked property to an attribute", async () => {
    const el = await renderToggle("<lumen-theme-toggle checked></lumen-theme-toggle>");
    expect(innerInput(el).checked).toBe(true);
  });

  it("fires a lumen-change event with the new checked state on toggle", async () => {
    const el = await renderToggle("<lumen-theme-toggle></lumen-theme-toggle>");
    const onChange = vi.fn();
    el.addEventListener("lumen-change", onChange);
    const input = innerInput(el);
    input.checked = true;
    input.dispatchEvent(new Event("change"));
    expect(onChange).toHaveBeenCalledOnce();
    expect((onChange.mock.calls[0][0] as CustomEvent).detail).toEqual({ checked: true });
  });
});
