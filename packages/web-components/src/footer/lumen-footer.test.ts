import { afterEach, describe, expect, it } from "vitest";
import "./lumen-footer";
import type { LumenFooter } from "./lumen-footer";

async function renderFooter(markup: string): Promise<LumenFooter> {
  document.body.innerHTML = markup;
  const el = document.querySelector("lumen-footer") as LumenFooter;
  await el.updateComplete;
  return el;
}

describe("lumen-footer", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("exposes a contentinfo landmark role", async () => {
    const el = await renderFooter("<lumen-footer></lumen-footer>");
    expect(el.getAttribute("role")).toBe("contentinfo");
  });

  it("renders version and status text when provided", async () => {
    const el = await renderFooter(
      '<lumen-footer version="Lumen Platform v4.0" status-label="All systems normal"></lumen-footer>'
    );
    expect(el.shadowRoot!.textContent).toContain("Lumen Platform v4.0");
    expect(el.shadowRoot!.textContent).toContain("All systems normal");
  });

  it("omits version and status when not provided", async () => {
    const el = await renderFooter("<lumen-footer></lumen-footer>");
    expect(el.shadowRoot!.querySelector("p")).toBeNull();
  });

  it("projects link elements through the default slot", async () => {
    const el = await renderFooter('<lumen-footer><a href="/privacy">Privacy</a></lumen-footer>');
    expect(el.querySelector("a")).not.toBeNull();
    expect(el.shadowRoot!.querySelector("slot")).not.toBeNull();
  });
});
