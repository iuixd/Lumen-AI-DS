import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Switch } from "./Switch";
import * as PublicExports from "../../index";

describe("Switch", () => {
  it("is exported from @lumen/ui's public entry point", () => {
    expect(PublicExports.Switch).toBe(Switch);
  });

  it("is unchecked by default and toggles on click", async () => {
    render(<Switch aria-label="Toggle setting" />);
    const toggle = screen.getByRole("switch", { name: "Toggle setting" });
    expect(toggle).toHaveAttribute("aria-checked", "false");

    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "true");
  });

  it("respects defaultChecked", () => {
    render(<Switch aria-label="Toggle setting" defaultChecked />);
    expect(screen.getByRole("switch", { name: "Toggle setting" })).toHaveAttribute("aria-checked", "true");
  });

  it("does not toggle when disabled", async () => {
    render(<Switch aria-label="Toggle setting" disabled />);
    const toggle = screen.getByRole("switch", { name: "Toggle setting" });
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });
});
