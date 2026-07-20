import { afterEach, describe, expect, it } from "vitest";
import "./lumen-kpi-card";
import type { LumenKPICard } from "./lumen-kpi-card";

async function renderCard(markup: string): Promise<LumenKPICard> {
  document.body.innerHTML = markup;
  const el = document.querySelector("lumen-kpi-card") as LumenKPICard;
  await el.updateComplete;
  return el;
}

describe("lumen-kpi-card", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders the label and value", async () => {
    const el = await renderCard('<lumen-kpi-card label="Open renewals" value="47"></lumen-kpi-card>');
    expect(el.shadowRoot!.querySelector(".label")!.textContent).toBe("Open renewals");
    expect(el.shadowRoot!.querySelector(".value")!.textContent).toBe("47");
  });

  it("renders the delta line when provided", async () => {
    const el = await renderCard(
      '<lumen-kpi-card label="Open renewals" value="47" delta="▲ 12% this quarter"></lumen-kpi-card>'
    );
    expect(el.shadowRoot!.querySelector(".delta")!.textContent).toBe("▲ 12% this quarter");
  });

  it("omits the delta line when not provided", async () => {
    const el = await renderCard('<lumen-kpi-card label="Open renewals" value="47"></lumen-kpi-card>');
    expect(el.shadowRoot!.querySelector(".delta")).toBeNull();
  });

  it("applies the delta-tone class to the delta line", async () => {
    const el = await renderCard(
      '<lumen-kpi-card label="At risk" value="9" delta="▲ 3 flagged" delta-tone="warning"></lumen-kpi-card>'
    );
    expect(el.shadowRoot!.querySelector(".delta")!.classList.contains("warning")).toBe(true);
  });
});
