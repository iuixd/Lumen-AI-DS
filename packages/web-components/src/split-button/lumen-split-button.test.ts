import { afterEach, describe, expect, it, vi } from "vitest";
import "./lumen-split-button";
import type { LumenSplitButton } from "./lumen-split-button";

async function renderSplitButton(markup: string): Promise<LumenSplitButton> {
  document.body.innerHTML = markup;
  const el = document.querySelector("lumen-split-button") as LumenSplitButton;
  await el.updateComplete;
  return el;
}

function mainButton(el: LumenSplitButton): HTMLButtonElement {
  return el.shadowRoot!.querySelector(".main")!;
}

function dropdownButton(el: LumenSplitButton): HTMLButtonElement {
  return el.shadowRoot!.querySelector(".dropdown")!;
}

describe("lumen-split-button", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders two buttons in the shadow root", async () => {
    const el = await renderSplitButton(
      '<lumen-split-button dropdown-label="More save options">Save changes</lumen-split-button>'
    );
    expect(mainButton(el)).not.toBeNull();
    expect(dropdownButton(el)).not.toBeNull();
    expect(dropdownButton(el).getAttribute("aria-label")).toBe("More save options");
  });

  it("dispatches lumen-main-click only from the main button", async () => {
    const el = await renderSplitButton(
      '<lumen-split-button dropdown-label="More save options">Save changes</lumen-split-button>'
    );
    const onMain = vi.fn();
    const onDropdown = vi.fn();
    el.addEventListener("lumen-main-click", onMain);
    el.addEventListener("lumen-dropdown-click", onDropdown);
    mainButton(el).click();
    expect(onMain).toHaveBeenCalledOnce();
    expect(onDropdown).not.toHaveBeenCalled();
  });

  it("dispatches lumen-dropdown-click only from the dropdown button", async () => {
    const el = await renderSplitButton(
      '<lumen-split-button dropdown-label="More save options">Save changes</lumen-split-button>'
    );
    const onMain = vi.fn();
    const onDropdown = vi.fn();
    el.addEventListener("lumen-main-click", onMain);
    el.addEventListener("lumen-dropdown-click", onDropdown);
    dropdownButton(el).click();
    expect(onDropdown).toHaveBeenCalledOnce();
    expect(onMain).not.toHaveBeenCalled();
  });

  it("disables both buttons when disabled", async () => {
    const el = await renderSplitButton(
      '<lumen-split-button disabled dropdown-label="More save options">Save changes</lumen-split-button>'
    );
    expect(mainButton(el).disabled).toBe(true);
    expect(dropdownButton(el).disabled).toBe(true);
  });

  it("while loading, disables only the main button and keeps the dropdown interactive", async () => {
    const el = await renderSplitButton(
      '<lumen-split-button loading dropdown-label="More save options">Save changes</lumen-split-button>'
    );
    expect(mainButton(el).disabled).toBe(true);
    expect(mainButton(el).getAttribute("aria-busy")).toBe("true");
    expect(dropdownButton(el).disabled).toBe(false);
  });

  it("warns in dev when dropdown-label is left at the generic default", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    await renderSplitButton("<lumen-split-button>Save changes</lumen-split-button>");
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("dropdown-label"));
    warnSpy.mockRestore();
  });

  it("defaults to variant=primary and size=lg", async () => {
    const el = await renderSplitButton("<lumen-split-button>Save changes</lumen-split-button>");
    expect(el.getAttribute("variant")).toBe("primary");
    expect(el.getAttribute("size")).toBe("lg");
  });

  it.each(["sm", "md", "lg"] as const)("reflects size=%s as a host attribute", async (size) => {
    const el = await renderSplitButton(`<lumen-split-button size="${size}">Save changes</lumen-split-button>`);
    expect(el.getAttribute("size")).toBe(size);
  });

  it("reflects the outline variant as a host attribute", async () => {
    const el = await renderSplitButton('<lumen-split-button variant="outline">Save changes</lumen-split-button>');
    expect(el.getAttribute("variant")).toBe("outline");
  });

  it("exposes an icon-start slot", async () => {
    const el = await renderSplitButton(
      '<lumen-split-button><span slot="icon-start">I</span>Create</lumen-split-button>'
    );
    expect(mainButton(el).querySelector('slot[name="icon-start"]')).not.toBeNull();
  });
});
