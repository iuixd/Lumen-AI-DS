import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("associates its label with the input", () => {
    render(<Checkbox name="terms" label="Accept terms" />);
    expect(screen.getByLabelText("Accept terms")).toBeInTheDocument();
  });

  it("toggles checked state on click", async () => {
    render(<Checkbox name="terms" label="Accept terms" />);
    const checkbox = screen.getByLabelText("Accept terms");
    expect(checkbox).not.toBeChecked();
    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it("renders the design-system CheckIcon for the checked state", () => {
    const { container } = render(<Checkbox name="selected" label="Selected" defaultChecked />);
    const checkIcon = container.querySelector("svg");
    expect(checkIcon).toBeInTheDocument();
    expect(checkIcon).toHaveAttribute("viewBox", "0 0 24 24");
    expect(checkIcon).toHaveAttribute("preserveAspectRatio", "none");
    expect(checkIcon).toHaveClass("peer-checked:opacity-100");
    expect(checkIcon?.className.baseVal).toContain("--input-check-stroke-width-md");
    expect(checkIcon?.className.baseVal).toContain("vector-effect:non-scaling-stroke");
    expect(checkIcon?.querySelector("path")).toHaveAttribute("d", "M20 6 9 17l-5-5");
  });

  it.each(["sm", "md", "lg"] as const)("binds the %s Figma geometry", (size) => {
    render(<Checkbox name={size} label={size} size={size} />);
    const checkbox = screen.getByLabelText(size);
    expect(checkbox.parentElement).toHaveClass(`size-[var(--input-control-size-${size})]`);
    expect(checkbox.nextElementSibling?.className).toContain(`--input-indicator-size-${size}`);
  });

  it("sets the native indeterminate property and renders the Figma glyph", () => {
    const { container } = render(<Checkbox name="mixed" label="Mixed" indeterminate />);
    const checkbox = screen.getByLabelText("Mixed") as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(true);
    expect(checkbox.nextElementSibling?.nextElementSibling).toHaveClass("opacity-100");
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });

  it("maps invalid and disabled states semantically", () => {
    render(<Checkbox name="status" label="Invalid" invalid disabled />);
    const checkbox = screen.getByLabelText("Invalid");
    expect(checkbox).toHaveAttribute("aria-invalid", "true");
    expect(checkbox).toBeDisabled();
    expect(checkbox.nextElementSibling?.className).toContain("--color-input-primary-error-border");
  });

  it("preserves the native numeric size attribute", () => {
    render(<Checkbox name="native" label="Native" size={12} />);
    expect(screen.getByLabelText("Native")).toHaveAttribute("size", "12");
  });
});
