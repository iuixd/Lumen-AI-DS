import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Calendar } from "./Calendar";
import * as PublicExports from "../../index";

describe("Calendar", () => {
  it("is exported from @lumen/ui's public entry point", () => {
    expect(PublicExports.Calendar).toBe(Calendar);
  });

  it("renders a grid of day buttons for the current month", () => {
    render(<Calendar mode="single" />);
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("calls onSelect with the clicked date in single mode", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Calendar mode="single" onSelect={onSelect} defaultMonth={new Date(2026, 0, 1)} />);

    await user.click(screen.getByRole("button", { name: /15/ }));

    expect(onSelect).toHaveBeenCalled();
    const selectedArg = onSelect.mock.calls[0][0] as Date;
    expect(selectedArg.getDate()).toBe(15);
  });

  it("marks matched dates as disabled", () => {
    const { container } = render(
      <Calendar
        mode="single"
        defaultMonth={new Date(2026, 0, 1)}
        disabled={{ before: new Date(2026, 0, 10) }}
      />
    );
    const dayFive = container.querySelector<HTMLButtonElement>(
      `button[data-day="${new Date(2026, 0, 5).toLocaleDateString()}"]`
    );
    expect(dayFive).not.toBeNull();
    expect(dayFive).toBeDisabled();
  });
});
