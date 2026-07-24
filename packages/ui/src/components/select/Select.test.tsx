import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./Select";
import * as PublicExports from "../../index";

beforeEach(() => {
  Element.prototype.hasPointerCapture = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();
});

function BasicSelect() {
  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="orange" disabled>
          Orange
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

describe("Select", () => {
  it("is exported from @lumen/ui's public entry point", () => {
    expect(PublicExports.Select).toBe(Select);
    expect(PublicExports.SelectTrigger).toBeDefined();
    expect(PublicExports.SelectContent).toBeDefined();
    expect(PublicExports.SelectItem).toBeDefined();
    expect(PublicExports.SelectValue).toBeDefined();
  });

  it("shows the placeholder and opens its options on trigger click", async () => {
    render(<BasicSelect />);
    expect(screen.getByText("Select a fruit")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("combobox"));
    expect(screen.getByText("Apple")).toBeInTheDocument();
  });

  it("selects an option and updates the displayed value", async () => {
    render(<BasicSelect />);
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(screen.getByText("Banana"));
    expect(screen.getByRole("combobox")).toHaveTextContent("Banana");
  });
});
