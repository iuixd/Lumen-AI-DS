import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox } from "./Checkbox";
import * as PublicExports from "../../index";

describe("Checkbox", () => {
  it("is exported from @lumen/ui's public entry point", () => {
    expect(PublicExports.Checkbox).toBe(Checkbox);
  });

  it("is unchecked by default and toggles on click", async () => {
    render(<Checkbox aria-label="Accept terms" />);
    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });
    expect(checkbox).toHaveAttribute("aria-checked", "false");

    await userEvent.click(checkbox);
    expect(checkbox).toHaveAttribute("aria-checked", "true");
  });

  it("respects defaultChecked", () => {
    render(<Checkbox aria-label="Accept terms" defaultChecked />);
    expect(screen.getByRole("checkbox", { name: "Accept terms" })).toHaveAttribute("aria-checked", "true");
  });

  it("does not toggle when disabled", async () => {
    render(<Checkbox aria-label="Accept terms" disabled />);
    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });
    await userEvent.click(checkbox);
    expect(checkbox).toHaveAttribute("aria-checked", "false");
  });

  it("defaults to size md", () => {
    render(<Checkbox aria-label="Accept terms" />);
    expect(screen.getByRole("checkbox", { name: "Accept terms" }).className).toContain(
      "size-[var(--input-indicator-size-md)]"
    );
  });

  it("applies the requested size", () => {
    render(<Checkbox aria-label="Accept terms" size="lg" />);
    expect(screen.getByRole("checkbox", { name: "Accept terms" }).className).toContain(
      "size-[var(--input-indicator-size-lg)]"
    );
  });

  it("renders as indeterminate", () => {
    render(<Checkbox aria-label="Select all" checked="indeterminate" />);
    expect(screen.getByRole("checkbox", { name: "Select all" })).toHaveAttribute(
      "data-state",
      "indeterminate"
    );
  });

  it("forwards a ref to the underlying checkbox element", () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Checkbox aria-label="Accept terms" ref={ref} />);
    expect(ref.current).not.toBeNull();
  });
});
