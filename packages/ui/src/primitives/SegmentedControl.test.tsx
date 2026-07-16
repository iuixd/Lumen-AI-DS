import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SegmentedControl, SegmentedControlOption } from "./SegmentedControl";

function renderControl(props: Partial<React.ComponentProps<typeof SegmentedControl>> = {}) {
  return render(
    <SegmentedControl aria-label="Tone" defaultValue="neutral" {...props}>
      <SegmentedControlOption value="formal">Formal</SegmentedControlOption>
      <SegmentedControlOption value="neutral">Neutral</SegmentedControlOption>
      <SegmentedControlOption value="friendly">Friendly</SegmentedControlOption>
      <SegmentedControlOption value="concise">Concise</SegmentedControlOption>
    </SegmentedControl>
  );
}

describe("SegmentedControl", () => {
  it("renders a radiogroup with one radio per option", () => {
    renderControl();
    expect(screen.getByRole("radiogroup", { name: "Tone" })).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(4);
  });

  it("marks the defaultValue option as checked", () => {
    renderControl();
    expect(screen.getByRole("radio", { name: "Neutral" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "Formal" })).toHaveAttribute("aria-checked", "false");
  });

  it("selects an option on click and calls onValueChange", async () => {
    const onValueChange = vi.fn();
    renderControl({ onValueChange });
    await userEvent.click(screen.getByRole("radio", { name: "Formal" }));
    expect(onValueChange).toHaveBeenCalledWith("formal");
    expect(screen.getByRole("radio", { name: "Formal" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "Neutral" })).toHaveAttribute("aria-checked", "false");
  });

  it("moves selection with ArrowRight/ArrowLeft", async () => {
    renderControl();
    const neutral = screen.getByRole("radio", { name: "Neutral" });
    neutral.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "Friendly" })).toHaveAttribute("aria-checked", "true");
    await userEvent.keyboard("{ArrowLeft}");
    expect(screen.getByRole("radio", { name: "Neutral" })).toHaveAttribute("aria-checked", "true");
  });

  it("supports a controlled value", async () => {
    const onValueChange = vi.fn();
    renderControl({ value: "concise", onValueChange, defaultValue: undefined });
    expect(screen.getByRole("radio", { name: "Concise" })).toHaveAttribute("aria-checked", "true");
    await userEvent.click(screen.getByRole("radio", { name: "Formal" }));
    expect(onValueChange).toHaveBeenCalledWith("formal");
    // Controlled: selection does not change until the parent updates `value`.
    expect(screen.getByRole("radio", { name: "Concise" })).toHaveAttribute("aria-checked", "true");
  });

  it("disables all options when the group is disabled", async () => {
    const onValueChange = vi.fn();
    renderControl({ disabled: true, onValueChange });
    const formal = screen.getByRole("radio", { name: "Formal" });
    expect(formal).toBeDisabled();
    await userEvent.click(formal);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("applies per-size padding and type instead of reusing md for every size", () => {
    const { rerender } = renderControl({ size: "sm" });
    const sm = screen.getByRole("radio", { name: "Formal" }).className;
    expect(sm).toContain("spacing-12");
    expect(sm).toContain("text-button-sm");

    rerender(
      <SegmentedControl aria-label="Tone" defaultValue="neutral" size="lg">
        <SegmentedControlOption value="formal">Formal</SegmentedControlOption>
      </SegmentedControl>
    );
    const lg = screen.getByRole("radio", { name: "Formal" }).className;
    expect(lg).toContain("spacing-20");
    expect(lg).toContain("text-button-lg");
  });
});
