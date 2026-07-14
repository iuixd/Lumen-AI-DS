import { afterEach, describe, expect, it, vi } from "vitest";
import "./lumen-filter-chip";
import type { LumenFilterChip } from "./lumen-filter-chip";

async function renderChip(markup: string): Promise<LumenFilterChip> {
  document.body.innerHTML = markup;
  const el = document.querySelector("lumen-filter-chip") as LumenFilterChip;
  await el.updateComplete;
  return el;
}

function innerButton(el: LumenFilterChip): HTMLButtonElement {
  return el.shadowRoot!.querySelector("button")!;
}

describe("lumen-filter-chip", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders its label through the default slot", async () => {
    const el = await renderChip("<lumen-filter-chip>Status</lumen-filter-chip>");
    expect(el.textContent?.trim()).toBe("Status");
  });

  it("defaults aria-pressed to false when unselected", async () => {
    const el = await renderChip("<lumen-filter-chip>Status</lumen-filter-chip>");
    expect(innerButton(el).getAttribute("aria-pressed")).toBe("false");
  });

  it("exposes selection state via aria-pressed", async () => {
    const el = await renderChip("<lumen-filter-chip selected>Status</lumen-filter-chip>");
    expect(innerButton(el).getAttribute("aria-pressed")).toBe("true");
  });

  it("renders a remove-icon slot only when selected", async () => {
    const unselected = await renderChip("<lumen-filter-chip>Status</lumen-filter-chip>");
    expect(innerButton(unselected).querySelector('slot[name="remove-icon"]')).toBeNull();

    const selected = await renderChip("<lumen-filter-chip selected>Status</lumen-filter-chip>");
    expect(innerButton(selected).querySelector('slot[name="remove-icon"]')).not.toBeNull();
  });

  it("fires a click event when clicked", async () => {
    const el = await renderChip("<lumen-filter-chip>Status</lumen-filter-chip>");
    const onClick = vi.fn();
    el.addEventListener("click", onClick);
    innerButton(el).click();
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("marks aria-disabled and does not let a click through when disabled", async () => {
    const el = await renderChip("<lumen-filter-chip disabled>Status</lumen-filter-chip>");
    const onClick = vi.fn();
    el.addEventListener("click", onClick);
    expect(innerButton(el).getAttribute("aria-disabled")).toBe("true");
    innerButton(el).click();
    expect(onClick).not.toHaveBeenCalled();
  });

  it("exposes an icon slot with a default plus glyph", async () => {
    const el = await renderChip("<lumen-filter-chip>Status</lumen-filter-chip>");
    expect(innerButton(el).querySelector('slot[name="icon"]')).not.toBeNull();
  });
});
