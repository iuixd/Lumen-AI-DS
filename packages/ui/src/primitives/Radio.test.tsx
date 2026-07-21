import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Radio } from "./Radio";

describe("Radio", () => {
  it("associates its label and preserves native selection", async () => {
    render(<Radio name="plan" value="pro" label="Pro" />);
    const radio = screen.getByLabelText("Pro");
    await userEvent.click(radio);
    expect(radio).toBeChecked();
  });

  it.each(["sm", "md", "lg"] as const)("binds the %s Figma geometry", (size) => {
    render(<Radio name="size" value={size} label={size} size={size} />);
    const target = screen.getByLabelText(size);
    expect(target.parentElement).toHaveClass(`size-[var(--input-control-size-${size})]`);
    expect(target.nextElementSibling?.className).toContain(`--input-indicator-size-${size}`);
  });

  it("maps invalid and disabled states without invalid radio ARIA", () => {
    render(<Radio name="status" value="invalid" label="Invalid" invalid disabled />);
    const radio = screen.getByLabelText("Invalid");
    expect(radio).not.toHaveAttribute("aria-invalid");
    expect(radio).toBeDisabled();
    expect(radio.nextElementSibling?.className).toContain("--color-input-primary-error-border");
  });

  it("preserves the native numeric size attribute", () => {
    render(<Radio name="native" value="size" label="Native" size={12} />);
    expect(screen.getByLabelText("Native")).toHaveAttribute("size", "12");
  });
});
