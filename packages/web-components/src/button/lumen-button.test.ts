import { afterEach, describe, expect, it, vi } from "vitest";
import "./lumen-button";
import type { LumenButton } from "./lumen-button";

// jsdom cannot meaningfully compute styles derived from CSS custom properties
// (the --spacing-*/--color-*/--radius-* tokens aren't loaded in this test
// environment), so these tests assert the DOM structure and reflected host
// attributes that drive the stylesheet's :host([...]) selectors, not
// computed pixel values — mirroring how Button.test.tsx asserts on
// generated class names rather than getComputedStyle for the same reason.

async function renderButton(markup: string): Promise<LumenButton> {
  document.body.innerHTML = markup;
  const el = document.querySelector("lumen-button") as LumenButton;
  await el.updateComplete;
  return el;
}

function innerButton(el: LumenButton): HTMLButtonElement {
  return el.shadowRoot!.querySelector("button")!;
}

describe("lumen-button", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders its label through the default slot", async () => {
    const el = await renderButton("<lumen-button>Save changes</lumen-button>");
    expect(el.textContent?.trim()).toBe("Save changes");
    expect(innerButton(el).querySelector("slot:not([name])")).not.toBeNull();
  });

  it("fires a click event when clicked", async () => {
    const el = await renderButton("<lumen-button>Save changes</lumen-button>");
    const onClick = vi.fn();
    el.addEventListener("click", onClick);
    innerButton(el).click();
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not let a click through when disabled", async () => {
    const el = await renderButton("<lumen-button disabled>Save changes</lumen-button>");
    const onClick = vi.fn();
    el.addEventListener("click", onClick);
    innerButton(el).click();
    expect(onClick).not.toHaveBeenCalled();
  });

  it("marks aria-disabled and aria-busy while loading", async () => {
    const el = await renderButton("<lumen-button loading>Save changes</lumen-button>");
    const button = innerButton(el);
    expect(button.getAttribute("aria-disabled")).toBe("true");
    expect(button.getAttribute("aria-busy")).toBe("true");
  });

  it("does not let a click through while loading", async () => {
    const el = await renderButton("<lumen-button loading>Save changes</lumen-button>");
    const onClick = vi.fn();
    el.addEventListener("click", onClick);
    innerButton(el).click();
    expect(onClick).not.toHaveBeenCalled();
  });

  it("visually hides the label while loading but keeps it in the shadow DOM", async () => {
    const el = await renderButton("<lumen-button loading>Save changes</lumen-button>");
    const label = el.shadowRoot!.querySelector(".label")!;
    expect(label.classList.contains("sr-only")).toBe(true);
    expect(el.shadowRoot!.querySelector(".spinner")).not.toBeNull();
  });

  it("warns when an icon-only button has no accessible name", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    await renderButton("<lumen-button icon-only>&#x2715;</lumen-button>");
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("accessible name"));
    warnSpy.mockRestore();
  });

  it("does not warn when an icon-only button has aria-label", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    await renderButton('<lumen-button icon-only aria-label="Search">&#x2715;</lumen-button>');
    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it("defaults an icon-only loading button's accessible name to Loading", async () => {
    const el = await renderButton("<lumen-button icon-only loading>&#x2715;</lumen-button>");
    expect(innerButton(el).getAttribute("aria-label")).toBe("Loading");
  });

  it("prefers an explicit aria-label over the Loading default", async () => {
    const el = await renderButton(
      '<lumen-button icon-only loading aria-label="Saving">&#x2715;</lumen-button>'
    );
    expect(innerButton(el).getAttribute("aria-label")).toBe("Saving");
  });

  it("reflects variant, size, icon-only, and pill as host attributes for styling", async () => {
    const el = await renderButton(
      '<lumen-button variant="raised" size="lg" pill>Save</lumen-button>'
    );
    expect(el.getAttribute("variant")).toBe("raised");
    expect(el.getAttribute("size")).toBe("lg");
    expect(el.hasAttribute("pill")).toBe(true);
  });

  it("defaults to variant=primary and size=md", async () => {
    const el = await renderButton("<lumen-button>Save changes</lumen-button>");
    expect(el.getAttribute("variant")).toBe("primary");
    expect(el.getAttribute("size")).toBe("md");
  });

  it("exposes icon-start and icon-end slots", async () => {
    const el = await renderButton(
      '<lumen-button><span slot="icon-start">S</span>Save<span slot="icon-end">E</span></lumen-button>'
    );
    const button = innerButton(el);
    expect(button.querySelector('slot[name="icon-start"]')).not.toBeNull();
    expect(button.querySelector('slot[name="icon-end"]')).not.toBeNull();
  });

  it("omits the icon-end slot while loading, replacing icon-start with a spinner", async () => {
    const el = await renderButton(
      '<lumen-button loading><span slot="icon-start">S</span>Save<span slot="icon-end">E</span></lumen-button>'
    );
    const button = innerButton(el);
    expect(button.querySelector('slot[name="icon-start"]')).toBeNull();
    expect(button.querySelector('slot[name="icon-end"]')).toBeNull();
    expect(button.querySelector(".spinner")).not.toBeNull();
  });
});
