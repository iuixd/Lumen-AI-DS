import { afterEach, describe, expect, it, vi } from "vitest";
import "./lumen-ai-button";
import type { LumenAIButton } from "./lumen-ai-button";

async function renderButton(markup: string): Promise<LumenAIButton> {
  document.body.innerHTML = markup;
  const el = document.querySelector("lumen-ai-button") as LumenAIButton;
  await el.updateComplete;
  return el;
}

function innerButton(el: LumenAIButton): HTMLButtonElement {
  return el.shadowRoot!.querySelector("button")!;
}

describe("lumen-ai-button", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders its label through the default slot with a default lm-aisymbol icon slot", async () => {
    const el = await renderButton("<lumen-ai-button>Summarize</lumen-ai-button>");
    expect(el.textContent?.trim()).toBe("Summarize");
    expect(innerButton(el).querySelector('slot[name="icon"]')).not.toBeNull();
  });

  it("fires a click event when clicked", async () => {
    const el = await renderButton("<lumen-ai-button>Summarize</lumen-ai-button>");
    const onClick = vi.fn();
    el.addEventListener("click", onClick);
    innerButton(el).click();
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not let a click through when disabled", async () => {
    const el = await renderButton("<lumen-ai-button disabled>Summarize</lumen-ai-button>");
    const onClick = vi.fn();
    el.addEventListener("click", onClick);
    innerButton(el).click();
    expect(onClick).not.toHaveBeenCalled();
  });

  it("marks aria-disabled and aria-busy while loading, replacing the icon slot with a spinner", async () => {
    const el = await renderButton("<lumen-ai-button loading>Generating</lumen-ai-button>");
    const button = innerButton(el);
    expect(button.getAttribute("aria-disabled")).toBe("true");
    expect(button.getAttribute("aria-busy")).toBe("true");
    expect(button.querySelector(".spinner")).not.toBeNull();
    expect(button.querySelector('slot[name="icon"]')).toBeNull();
  });

  it("does not let a click through while loading", async () => {
    const el = await renderButton("<lumen-ai-button loading>Generating</lumen-ai-button>");
    const onClick = vi.fn();
    el.addEventListener("click", onClick);
    innerButton(el).click();
    expect(onClick).not.toHaveBeenCalled();
  });

  it("warns when an icon-only button has no accessible name", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    await renderButton("<lumen-ai-button icon-only></lumen-ai-button>");
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("accessible name"));
    warnSpy.mockRestore();
  });

  it.each(["primary", "secondary", "tertiary", "outline"] as const)(
    "reflects variant=%s as a host attribute",
    async (variant) => {
      const el = await renderButton(`<lumen-ai-button variant="${variant}">Summarize</lumen-ai-button>`);
      expect(el.getAttribute("variant")).toBe(variant);
    }
  );

  it("defaults to variant=primary and size=md", async () => {
    const el = await renderButton("<lumen-ai-button>Summarize</lumen-ai-button>");
    expect(el.getAttribute("variant")).toBe("primary");
    expect(el.getAttribute("size")).toBe("md");
  });

  it("marks destructive intent via a data attribute without changing behavior otherwise", async () => {
    const el = await renderButton('<lumen-ai-button variant="secondary" destructive>Clean up records</lumen-ai-button>');
    expect(innerButton(el).getAttribute("data-destructive")).toBe("true");
  });

  it("accepts a custom leading icon via the icon slot", async () => {
    const el = await renderButton(
      '<lumen-ai-button><span slot="icon" id="custom-icon"></span>Rewrite</lumen-ai-button>'
    );
    expect(el.querySelector("#custom-icon")).not.toBeNull();
  });
});
