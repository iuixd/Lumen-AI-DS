import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";
import * as PublicExports from "../../index";

describe("Button", () => {
  it("is exported from @lumen/ui's public entry point", () => {
    expect(PublicExports.Button).toBe(Button);
  });

  it("renders its label and calls onClick", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Click me" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("is disabled when disabled", () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeDisabled();
  });
});
