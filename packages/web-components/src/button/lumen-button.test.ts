import { afterEach, describe, expect, it, vi } from "vitest";
import { LumenButton } from "./lumen-button";

if (!customElements.get("lumen-button")) {
  customElements.define("lumen-button", LumenButton);
}

async function renderButton(markup: string): Promise<LumenButton> {
  document.body.innerHTML = markup;
  const element = document.querySelector("lumen-button") as LumenButton;
  await element.updateComplete;
  return element;
}

const innerButton = (element: LumenButton) => element.shadowRoot!.querySelector("button")!;

describe("lumen-button", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders its label and defaults to primary md", async () => {
    const element = await renderButton("<lumen-button>Save changes</lumen-button>");
    expect(element.textContent?.trim()).toBe("Save changes");
    expect(element.getAttribute("variant")).toBe("primary");
    expect(element.getAttribute("size")).toBe("md");
  });

  it.each(["primary", "accent", "secondary", "outline", "ghost", "destructive"])(
    "reflects variant=%s for styling",
    async (variant) => {
      const element = await renderButton(`<lumen-button variant="${variant}">Save</lumen-button>`);
      expect(element.getAttribute("variant")).toBe(variant);
    }
  );

  it.each(["sm", "md", "lg", "xl"])("reflects size=%s for styling", async (size) => {
    const element = await renderButton(`<lumen-button size="${size}">Save</lumen-button>`);
    expect(element.getAttribute("size")).toBe(size);
    expect(LumenButton.styles.cssText).toContain(`:host([size="${size}"])`);
  });

  it("binds the Figma Ghost hover surface role", () => {
    expect(LumenButton.styles.cssText).toContain("var(--color-button-ghost-hover-bg)");
  });

  it("exposes leading and trailing icon slots", async () => {
    const element = await renderButton("<lumen-button>Save</lumen-button>");
    expect(innerButton(element).querySelector('slot[name="icon-start"]')).not.toBeNull();
    expect(innerButton(element).querySelector('slot[name="icon-end"]')).not.toBeNull();
  });

  it("blocks clicks and exposes aria-disabled when disabled", async () => {
    const element = await renderButton("<lumen-button disabled>Save</lumen-button>");
    const onClick = vi.fn();
    element.addEventListener("click", onClick);
    innerButton(element).click();
    expect(innerButton(element).getAttribute("aria-disabled")).toBe("true");
    expect(onClick).not.toHaveBeenCalled();
  });
});
