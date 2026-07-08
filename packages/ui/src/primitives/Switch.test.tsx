import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Switch } from "./Switch";

describe("Switch", () => {
  it("exposes switch role and label", () => {
    render(<Switch name="notifications" label="Email notifications" />);
    expect(screen.getByRole("switch", { name: "Email notifications" })).toBeInTheDocument();
  });

  it("toggles on click", async () => {
    render(<Switch name="notifications" label="Email notifications" />);
    const toggle = screen.getByRole("switch", { name: "Email notifications" });
    expect(toggle).not.toBeChecked();
    await userEvent.click(toggle);
    expect(toggle).toBeChecked();
  });
});
