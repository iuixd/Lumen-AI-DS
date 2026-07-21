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

  it.each(["sm", "md", "lg"] as const)(
    "renders the exact Figma checked asset and %s geometry",
    (size) => {
      const { container } = render(
        <Checkbox name={`selected-${size}`} label="Selected" size={size} defaultChecked />
      );
      const checkIcon = container.querySelector('[data-checkbox-icon="checked"]');
      expect(checkIcon).toHaveClass("peer-checked:opacity-100");
      expect(checkIcon?.className).toContain(`--input-check-width-${size}`);
      expect(checkIcon?.className).toContain(`--input-check-height-${size}`);
      expect(checkIcon?.getAttribute("style")).toContain(`input-checkbox-check-${size}.svg`);
      expect(container.querySelector("svg")).not.toBeInTheDocument();
    }
  );

  it.each(["sm", "md", "lg"] as const)("binds the %s Figma geometry", (size) => {
    render(<Checkbox name={size} label={size} size={size} />);
    const checkbox = screen.getByLabelText(size);
    expect(checkbox.parentElement).toHaveClass(`size-[var(--input-control-size-${size})]`);
    expect(checkbox.nextElementSibling?.className).toContain(`--input-indicator-size-${size}`);
  });

  it.each(["sm", "md", "lg"] as const)(
    "sets the native indeterminate property and renders the exact Figma %s asset",
    (size) => {
      const { container } = render(
        <Checkbox name={`mixed-${size}`} label="Mixed" size={size} indeterminate />
      );
      const checkbox = screen.getByLabelText("Mixed") as HTMLInputElement;
      const icon = container.querySelector('[data-checkbox-icon="indeterminate"]');
      expect(checkbox.indeterminate).toBe(true);
      expect(icon).toHaveClass("opacity-100");
      expect(icon?.className).toContain(`--input-indeterminate-width-${size}`);
      expect(icon?.className).toContain(`--input-indeterminate-height-${size}`);
      expect(icon?.getAttribute("style")).toContain(`input-checkbox-indeterminate-${size}.svg`);
    }
  );

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
