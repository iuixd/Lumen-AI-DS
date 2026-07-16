import { afterEach, describe, expect, it, vi } from "vitest";
import "./lumen-choice-chip";
import type { LumenChoiceChip } from "./lumen-choice-chip";

async function renderChip(markup: string): Promise<LumenChoiceChip> {
  document.body.innerHTML = markup;
  const el = document.querySelector("lumen-choice-chip") as LumenChoiceChip;
  await el.updateComplete;
  return el;
}

function innerButton(el: LumenChoiceChip): HTMLButtonElement {
  return el.shadowRoot!.querySelector("button")!;
}

describe("lumen-choice-chip", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders its label with no icon by default", async () => {
    const el = await renderChip("<lumen-choice-chip>Small</lumen-choice-chip>");
    expect(innerButton(el).querySelector("svg")).toBeNull();
  });

  it("renders a leading check icon only when selected", async () => {
    const el = await renderChip("<lumen-choice-chip selected>Small</lumen-choice-chip>");
    expect(innerButton(el).querySelector("svg")).not.toBeNull();
  });

  it("exposes selection state via aria-pressed", async () => {
    const el = await renderChip("<lumen-choice-chip selected>Small</lumen-choice-chip>");
    expect(innerButton(el).getAttribute("aria-pressed")).toBe("true");
  });

  it("fires a click event when clicked", async () => {
    const el = await renderChip("<lumen-choice-chip>Small</lumen-choice-chip>");
    const onClick = vi.fn();
    el.addEventListener("click", onClick);
    innerButton(el).click();
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("marks aria-disabled and does not let a click through when disabled", async () => {
    const el = await renderChip("<lumen-choice-chip disabled>Small</lumen-choice-chip>");
    const onClick = vi.fn();
    el.addEventListener("click", onClick);
    expect(innerButton(el).getAttribute("aria-disabled")).toBe("true");
    innerButton(el).click();
    expect(onClick).not.toHaveBeenCalled();
  });

  it("defaults to tone=\"solid\"", async () => {
    const el = await renderChip("<lumen-choice-chip>Small</lumen-choice-chip>");
    expect(el.tone).toBe("solid");
    expect(el.getAttribute("tone")).toBe("solid");
  });

  it("exposes an icon slot for an always-visible leading icon", async () => {
    const el = await renderChip("<lumen-choice-chip>Summarize</lumen-choice-chip>");
    expect(innerButton(el).querySelector('slot[name="icon"]')).not.toBeNull();
  });

  it("tone=\"subtle\" renders the check icon trailing, only when selected", async () => {
    const unselected = await renderChip('<lumen-choice-chip tone="subtle">Summarize</lumen-choice-chip>');
    expect(innerButton(unselected).querySelector("svg")).toBeNull();

    const selected = await renderChip('<lumen-choice-chip tone="subtle" selected>Summarize</lumen-choice-chip>');
    expect(innerButton(selected).querySelector("svg")).not.toBeNull();
  });
});
