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

  it("binds neutral's corrected hover treatment (dark fill + white text, not a light tint)", () => {
    render(<Button variant="neutral">Neutral</Button>);
    expect(screen.getByRole("button", { name: "Neutral" })).toHaveClass(
      "hover:bg-[var(--color-button-neutral-hover-bg)]",
      "hover:text-[var(--color-button-neutral-hover-on-action)]"
    );
  });

  it("binds the neutral-solid variant's dark-fill tokens", () => {
    render(<Button variant="neutral-solid">Neutral Solid</Button>);
    expect(screen.getByRole("button", { name: "Neutral Solid" })).toHaveClass(
      "bg-[var(--color-button-neutral-solid-bg)]",
      "text-[var(--color-button-neutral-solid-on-action)]",
      "hover:bg-[var(--color-button-neutral-solid-hover-bg)]"
    );
  });
});
