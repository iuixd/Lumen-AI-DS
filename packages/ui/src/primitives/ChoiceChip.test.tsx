import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChoiceChip } from "./ChoiceChip";

describe("ChoiceChip", () => {
  it("renders its label with no icon by default", () => {
    render(<ChoiceChip>Small</ChoiceChip>);
    const chip = screen.getByRole("button", { name: "Small" });
    expect(chip).toBeInTheDocument();
    expect(chip.querySelector("svg")).not.toBeInTheDocument();
  });

  it("renders a leading check icon only when selected", () => {
    render(<ChoiceChip selected>Small</ChoiceChip>);
    const chip = screen.getByRole("button", { name: "Small" });
    expect(chip.querySelector("svg")).toBeInTheDocument();
  });

  it("exposes selection state via aria-pressed", () => {
    render(<ChoiceChip selected>Small</ChoiceChip>);
    expect(screen.getByRole("button", { name: "Small" })).toHaveAttribute("aria-pressed", "true");
  });

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    render(<ChoiceChip onClick={onClick}>Small</ChoiceChip>);
    await userEvent.click(screen.getByRole("button", { name: "Small" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("marks the chip aria-disabled and does not call onClick when disabled", async () => {
    const onClick = vi.fn();
    render(
      <ChoiceChip onClick={onClick} disabled>
        Small
      </ChoiceChip>
    );
    const chip = screen.getByRole("button", { name: "Small" });
    expect(chip).toHaveAttribute("aria-disabled", "true");
    await userEvent.click(chip);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders an always-visible leading icon when `icon` is passed, regardless of selection", () => {
    render(
      <ChoiceChip icon={<svg data-testid="leading-icon" />} tone="subtle">
        Summarize
      </ChoiceChip>
    );
    expect(screen.getByTestId("leading-icon")).toBeInTheDocument();
  });

  it("defaults to tone=\"solid\" and keeps the check icon leading (unchanged behavior)", () => {
    render(<ChoiceChip selected>Small</ChoiceChip>);
    const chip = screen.getByRole("button", { name: "Small" });
    expect(chip.firstElementChild?.tagName.toLowerCase()).toBe("svg");
  });

  it("tone=\"subtle\" renders the trailing check only when selected", () => {
    const { rerender } = render(
      <ChoiceChip tone="subtle" icon={<svg data-testid="leading-icon" />}>
        Summarize
      </ChoiceChip>
    );
    let chip = screen.getByRole("button", { name: "Summarize" });
    expect(chip.querySelectorAll("svg")).toHaveLength(1);

    rerender(
      <ChoiceChip tone="subtle" icon={<svg data-testid="leading-icon" />} selected>
        Summarize
      </ChoiceChip>
    );
    chip = screen.getByRole("button", { name: "Summarize" });
    expect(chip.querySelectorAll("svg")).toHaveLength(2);
  });
});
