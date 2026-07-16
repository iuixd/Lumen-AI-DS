import { afterEach, describe, expect, it, vi } from "vitest";
import "./lumen-segmented-control";
import "./lumen-segmented-control-option";
import type { LumenSegmentedControl } from "./lumen-segmented-control";
import type { LumenSegmentedControlOption } from "./lumen-segmented-control-option";

const markup = `
  <lumen-segmented-control aria-label="Tone" value="neutral">
    <lumen-segmented-control-option value="formal">Formal</lumen-segmented-control-option>
    <lumen-segmented-control-option value="neutral">Neutral</lumen-segmented-control-option>
    <lumen-segmented-control-option value="friendly">Friendly</lumen-segmented-control-option>
    <lumen-segmented-control-option value="concise">Concise</lumen-segmented-control-option>
  </lumen-segmented-control>
`;

async function renderControl(): Promise<LumenSegmentedControl> {
  document.body.innerHTML = markup;
  const el = document.querySelector("lumen-segmented-control") as LumenSegmentedControl;
  await el.updateComplete;
  const options = Array.from(el.querySelectorAll("lumen-segmented-control-option")) as LumenSegmentedControlOption[];
  await Promise.all(options.map((o) => o.updateComplete));
  return el;
}

function option(el: LumenSegmentedControl, value: string): LumenSegmentedControlOption {
  return el.querySelector(`lumen-segmented-control-option[value="${value}"]`) as LumenSegmentedControlOption;
}

describe("lumen-segmented-control", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders a radiogroup with one radio per option", async () => {
    const el = await renderControl();
    const group = el.shadowRoot!.querySelector('[role="radiogroup"]')!;
    expect(group.getAttribute("aria-label")).toBe("Tone");
    const radios = el.querySelectorAll('lumen-segmented-control-option');
    expect(radios).toHaveLength(4);
  });

  it("marks the initial value option as selected", async () => {
    const el = await renderControl();
    expect(option(el, "neutral").selected).toBe(true);
    expect(option(el, "formal").selected).toBe(false);
  });

  it("selects an option on lumen-segment-select and fires lumen-value-change", async () => {
    const el = await renderControl();
    const onChange = vi.fn();
    el.addEventListener("lumen-value-change", onChange);

    option(el, "formal").dispatchEvent(
      new CustomEvent("lumen-segment-select", { detail: { value: "formal" }, bubbles: true, composed: true })
    );
    await el.updateComplete;

    expect(el.value).toBe("formal");
    expect(onChange).toHaveBeenCalledOnce();
    expect(option(el, "formal").selected).toBe(true);
    expect(option(el, "neutral").selected).toBe(false);
  });

  it("moves selection on lumen-segment-navigate", async () => {
    const el = await renderControl();
    option(el, "neutral").dispatchEvent(
      new CustomEvent("lumen-segment-navigate", { detail: { direction: 1 }, bubbles: true, composed: true })
    );
    await el.updateComplete;
    expect(el.value).toBe("friendly");
  });

  it("propagates a disabled host to every option", async () => {
    document.body.innerHTML = markup;
    const el = document.querySelector("lumen-segmented-control") as LumenSegmentedControl;
    el.disabled = true;
    await el.updateComplete;
    const options = Array.from(el.querySelectorAll("lumen-segmented-control-option")) as LumenSegmentedControlOption[];
    await Promise.all(options.map((o) => o.updateComplete));
    expect(options.every((o) => o.disabled)).toBe(true);
  });

  it("propagates size to every option", async () => {
    document.body.innerHTML = markup;
    const el = document.querySelector("lumen-segmented-control") as LumenSegmentedControl;
    el.size = "lg";
    await el.updateComplete;
    const options = Array.from(el.querySelectorAll("lumen-segmented-control-option")) as LumenSegmentedControlOption[];
    await Promise.all(options.map((o) => o.updateComplete));
    expect(options.every((o) => o.size === "lg")).toBe(true);
    expect(options.every((o) => o.getAttribute("size") === "lg")).toBe(true);
  });
});
